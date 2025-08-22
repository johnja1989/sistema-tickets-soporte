import React from 'react';
import TicketCard from './TicketCard';
import { TICKET_STATES } from '../services/api';

const KanbanColumn = ({ title, tickets, color, onTicketClick }) => {
  const getColumnColors = (color) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      green: 'border-green-200 bg-green-50',
      gray: 'border-gray-200 bg-gray-50',
    };
    return colorMap[color] || colorMap.gray;
  };

  const getHeaderColors = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className={`flex-1 min-w-80 rounded-lg border-2 ${getColumnColors(color)}`}>
      {/* Header de la columna */}
      <div className={`px-4 py-3 rounded-t-lg ${getHeaderColors(color)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="bg-white bg-opacity-70 text-sm font-medium px-2 py-1 rounded-full">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Contenido de la columna */}
      <div className="p-4 space-y-3 min-h-96 max-h-96 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-sm">No hay tickets en este estado</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
              className="hover:scale-105 transition-transform duration-200"
            />
          ))
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ tickets, onTicketClick, loading }) => {
  // Agrupar tickets por estado
  const ticketsByState = React.useMemo(() => {
    const grouped = {};
    
    // Inicializar todos los estados
    Object.keys(TICKET_STATES).forEach(state => {
      grouped[state] = [];
    });
    
    // Agrupar tickets
    tickets.forEach(ticket => {
      if (grouped[ticket.estado]) {
        grouped[ticket.estado].push(ticket);
      }
    });
    
    return grouped;
  }, [tickets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando tickets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título del tablero */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Tablero de Tickets
        </h2>
        <div className="text-sm text-gray-500">
          Total: {tickets.length} tickets
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.entries(TICKET_STATES).map(([stateKey, stateInfo]) => (
          <KanbanColumn
            key={stateKey}
            title={stateInfo.name}
            tickets={ticketsByState[stateKey] || []}
            color={stateInfo.color}
            onTicketClick={onTicketClick}
          />
        ))}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {Object.entries(TICKET_STATES).map(([stateKey, stateInfo]) => {
          const count = ticketsByState[stateKey]?.length || 0;
          return (
            <div key={stateKey} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  stateInfo.color === 'blue' ? 'bg-blue-500' :
                  stateInfo.color === 'yellow' ? 'bg-yellow-500' :
                  stateInfo.color === 'green' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stateInfo.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;