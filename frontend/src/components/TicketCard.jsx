import React from 'react';
import { TICKET_STATES, PRIORITY_LEVELS } from '../services/api';

const TicketCard = ({ ticket, onClick, className = '' }) => {
  const statusInfo = TICKET_STATES[ticket.estado] || { name: ticket.estado, color: 'gray' };
  const priorityInfo = PRIORITY_LEVELS[ticket.prioridad] || { name: ticket.prioridad, color: 'gray' };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colorMap[color] || colorMap.gray;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Header con ID y prioridad */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">#{ticket.id}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClasses(priorityInfo.color)}`}>
          {priorityInfo.name}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
        {ticket.titulo}
      </h3>

      {/* Descripción truncada */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {ticket.descripcion}
      </p>

      {/* Footer con estado y info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${getColorClasses(statusInfo.color)}`}>
            {statusInfo.name}
          </span>
          {ticket.total_comentarios > 0 && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {ticket.total_comentarios}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="font-medium">{ticket.solicitante}</p>
          <p>{formatDate(ticket.fecha_creacion)}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;