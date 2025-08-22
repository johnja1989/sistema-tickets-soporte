import React from 'react';
import { useTicketFilters } from '../context/TicketsContext';
import { TICKET_STATES } from '../services/api';

const TicketFilters = () => {
  const { filters, setFilters, searchQuery, selectedState } = useTicketFilters();

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStateChange = (e) => {
    setFilters({ ...filters, estado: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ estado: '', search: '' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Búsqueda por texto */}
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar tickets
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por título, descripción o solicitante..."
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="w-full sm:w-48">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            {Object.entries(TICKET_STATES).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {(searchQuery || selectedState) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketFilters;