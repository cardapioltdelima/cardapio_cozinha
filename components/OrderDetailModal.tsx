
import React from 'react';
import { Order } from '../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha o modal ao clicar no fundo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">{order.id}</h2>
            <p className="text-slate-300">{order.customerName}</p>
            {order.data_agendamento && (
              <div className="text-slate-400 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(order.data_agendamento).toLocaleDateString()} - {order.turno} - {order.horario_agendamento}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-3xl leading-none p-1"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {/* Corpo */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">
            Itens do Pedido
          </h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {order.items.map(item => (
              <li key={item.id} className="flex flex-col bg-slate-700 p-3 rounded-md">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-100">{item.name}</span>
                    <span className="text-lg font-bold text-amber-300">x{item.quantity}</span>
                </div>
                {item.notes && (
                  <p className="text-sm text-slate-400 italic mt-1">"{item.notes}"</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Rodapé */}
        <div className="text-right p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-lg">
             <button
                onClick={onClose}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
