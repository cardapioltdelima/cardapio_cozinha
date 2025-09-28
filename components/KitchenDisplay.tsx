
import React from 'react';
import { Order, OrderStatus } from '../types';
import OrderColumn from './OrderColumn';

interface KitchenDisplayProps {
  orders: Order[];
  newOrderIds: Set<string>;
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  orders,
  newOrderIds,
  onSelectOrder,
  onUpdateStatus,
}) => {
  const approvedOrders = orders.filter(o => o.status === OrderStatus.Approved).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const inProgressOrders = orders.filter(o => o.status === OrderStatus.InProgress).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const readyOrders = orders.filter(o => o.status === OrderStatus.Ready).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <OrderColumn
        title="A Fazer"
        status={OrderStatus.Approved}
        orders={approvedOrders}
        newOrderIds={newOrderIds}
        onSelectOrder={onSelectOrder}
        onUpdateStatus={onUpdateStatus}
      />
      <OrderColumn
        title="Em Preparo"
        status={OrderStatus.InProgress}
        orders={inProgressOrders}
        newOrderIds={newOrderIds}
        onSelectOrder={onSelectOrder}
        onUpdateStatus={onUpdateStatus}
      />
      <OrderColumn
        title="Pronto"
        status={OrderStatus.Ready}
        orders={readyOrders}
        newOrderIds={newOrderIds}
        onSelectOrder={onSelectOrder}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};

export default KitchenDisplay;
