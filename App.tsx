
import React, { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from './types';
import KitchenDisplay from './components/KitchenDisplay';
import OrderDetailModal from './components/OrderDetailModal';
import { useSupabaseOrders } from './hooks/useSupabaseOrders';

const App: React.FC = () => {
    const { orders, loading, error, updateOrderStatus, refetch } = useSupabaseOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (orders.length > 0) {
            const currentOrderIds = new Set(orders.map(o => o.id));
            const prevOrderIds = new Set(sessionStorage.getItem('orderIds')?.split(','));

            const newOrders = [...currentOrderIds].filter(id => !prevOrderIds.has(id));
            if (newOrders.length > 0) {
                setNewOrderIds(prev => new Set([...prev, ...newOrders]));
                setNotification(`${newOrders.length} novo(s) pedido(s) recebido(s)!`);
                setTimeout(() => setNotification(null), 5000);
            }

            sessionStorage.setItem('orderIds', [...currentOrderIds].join(','));
        }
    }, [orders]);

    const handleUpdateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
        const success = await updateOrderStatus(orderId, newStatus);
        
        if (success) {
            setNewOrderIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });

            if (newStatus === OrderStatus.Ready) {
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    console.log(`Disparando gatilho para a API do WhatsApp...`);
                    console.log(`Mensagem: "Olá ${order.customerName}! Seu pedido da Panificação Lima Rocha está pronto e já está a caminho! 🚀"`);
                    setNotification(`Notificação do pedido ${order.id} enviada!`);
                    setTimeout(() => setNotification(null), 5000);
                }
            }
        } else {
            setNotification('Erro ao atualizar status do pedido');
            setTimeout(() => setNotification(null), 5000);
        }
    }, [orders, updateOrderStatus]);

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setNewOrderIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(order.id);
            return newSet;
        });
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="bg-slate-900 text-white min-h-screen font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
                    <p className="text-xl">Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-900 text-white min-h-screen font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Erro de Conexão</h2>
                    <p className="text-slate-400 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
             {notification && (
                <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
                    {notification}
                </div>
            )}
            <header className="p-4 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-md flex flex-wrap justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-amber-400">
                        Panificação Lima Rocha - Sistema da Cozinha
                    </h1>
                    <p className="text-slate-400">Pedidos em tempo real • {orders.length} pedidos</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0"
                >
                    Atualizar Pedidos
                </button>
            </header>
            <main className="p-4">
                <KitchenDisplay
                    orders={orders}
                    newOrderIds={newOrderIds}
                    onSelectOrder={handleSelectOrder}
                    onUpdateStatus={handleUpdateOrderStatus}
                />
            </main>
            <OrderDetailModal
                isOpen={!!selectedOrder}
                onClose={handleCloseModal}
                order={selectedOrder}
            />
        </div>
    );
};

export default App;