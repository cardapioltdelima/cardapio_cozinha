import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus, SupabaseOrder, SupabaseOrderItem, SupabaseProduct } from '../types';

export const useSupabaseOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para converter status do Supabase para o enum local
  const convertStatus = (status: string): OrderStatus => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'aguardando':
      case 'aguardando aprovação':
        return OrderStatus.Approved;
      case 'em preparo':
      case 'in_progress':
        return OrderStatus.InProgress;
      case 'ready':
      case 'pronto':
      case 'concluído':
        return OrderStatus.Ready;
      default:
        return OrderStatus.Approved;
    }
  };

  // Função para converter Order local para status do Supabase
  const convertToSupabaseStatus = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.Approved:
        return 'pending';
      case OrderStatus.InProgress:
        return 'em preparo';
      case OrderStatus.Ready:
        return 'pronto';
      default:
        return 'pending';
    }
  };

  // Função para transformar dados do Supabase em Order local
  const transformSupabaseOrder = (
    supabaseOrder: SupabaseOrder,
    orderItems: (SupabaseOrderItem & { products: SupabaseProduct | null })[]
  ): Order => {
    return {
      id: `#${supabaseOrder.id}`,
      customerName: supabaseOrder.customer_name,
      status: convertStatus(supabaseOrder.status),
      createdAt: new Date(supabaseOrder.created_at),
      data_agendamento: supabaseOrder.data_agendamento,
      turno: supabaseOrder.turno,
      horario_agendamento: supabaseOrder.horario_agendamento,
      items: (orderItems || [])
        .map(item => {
          if (!item.products) {
            return null;
          }
          return {
            id: item.product_id,
            name: item.products.name,
            quantity: item.quantity,
            notes: supabaseOrder.notes,
          };
        })
        .filter((item): item is OrderItem => !!item),
    };
  };

  // Buscar pedidos do Supabase
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar pedidos com seus itens e produtos
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      if (ordersData) {
        const transformedOrders = ordersData.map(order => 
          transformSupabaseOrder(order, order.order_items)
        );
        setOrders(transformedOrders);
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar status do pedido
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    try {
      const numericId = parseInt(orderId.replace('#', ''));
      const supabaseStatus = convertToSupabaseStatus(newStatus);

      const { error } = await supabase
        .from('orders')
        .update({ status: supabaseStatus })
        .eq('id', numericId);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      return true;
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
      return false;
    }
  }, []);

  // Configurar subscription para mudanças em tempo real
  useEffect(() => {
    fetchOrders();

    const handleChanges = (payload: any) => {
      console.log('Change received!', payload);
      fetchOrders();
    };

    const ordersSubscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handleChanges)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [fetchOrders]);


  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: fetchOrders
  };
};