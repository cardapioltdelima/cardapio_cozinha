
import React from 'react';
import { Order, OrderStatus } from '../types';
import OrderCard from './OrderCard';

interface OrderColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  newOrderIds: Set<string>;
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.Approved]: 'border-t-blue-400',
  [OrderStatus.InProgress]: 'border-t-amber-400',
  [OrderStatus.Ready]: 'border-t-green-400',
};

const OrderColumn: React.FC<OrderColumnProps> = ({
  title,
  status,
  orders,
  newOrderIds,
  onSelectOrder,
  onUpdateStatus,
}) => {
  return (
    <div className={`bg-slate-800 rounded-lg p-4 h-full min-h-[80vh] border-t-4 ${statusColorMap[status]}`}>
      <h2 className="text-2xl font-bold mb-4 text-slate-200 flex items-center justify-between">
        {title}
        <span className="bg-slate-700 text-slate-300 text-sm font-semibold rounded-full px-3 py-1">
          {orders.length}
        </span>
      </h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-60px)] p-1">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isNew={newOrderIds.has(order.id)}
              onSelectOrder={onSelectOrder}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p>Nenhum pedido nesta fila.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderColumn;
