import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  isNew: boolean;
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

function timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return "agora";
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isNew, onSelectOrder, onUpdateStatus }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleStatusUpdate = (e: React.MouseEvent, newStatus: OrderStatus) => {
    e.stopPropagation();
    onUpdateStatus(order.id, newStatus);
  };
  
  const cardClasses = `
    bg-slate-700 rounded-lg p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-slate-600
    ${isNew ? 'ring-2 ring-green-400 animate-pulse' : 'ring-2 ring-transparent'}
  `;

  return (
    <div className={cardClasses} onClick={() => onSelectOrder(order)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">{order.id}</h3>
        {/* FIX: The original file was truncated. Completed the JSX to be valid. */}
        <span className="text-sm text-slate-400">{timeSince(order.createdAt)}</span>
      </div>
      <p className="text-slate-300 font-medium">{order.customerName}</p>
      {order.data_agendamento && (
        <div className="text-slate-400 text-sm mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{new Date(order.data_agendamento).toLocaleDateString()} - {order.turno} - {order.horario_agendamento}</span>
        </div>
      )}
      <p className="text-sm text-slate-400 mb-4">{totalItems} {totalItems > 1 ? 'itens' : 'item'}</p>
      <div className="flex justify-end">
        {order.status === OrderStatus.Approved && (
          <button
            onClick={(e) => handleStatusUpdate(e, OrderStatus.InProgress)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Iniciar Preparo
          </button>
        )}
        {order.status === OrderStatus.InProgress && (
          <button
            onClick={(e) => handleStatusUpdate(e, OrderStatus.Ready)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
};

// FIX: Added missing default export.
export default OrderCard;
