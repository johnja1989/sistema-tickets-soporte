import React, { useState, useEffect } from 'react';
import { TicketsProvider, useTickets } from './context/TicketsContext';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import TicketDetail from './components/TicketDetail';
import CreateTicketForm from './components/CreateTicketForm';
import TicketFilters from './components/TicketFilters';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const AppContent = () => {
  const { 
    tickets, 
    selectedTicket, 
    loading, 
    error, 
    loadTickets, 
    loadTicket, 
    clearSelectedTicket, 
    clearError,
    filters 
  } = useTickets();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar tickets al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadTickets(filters);
  }, [loadTickets, filters]);

  const handleTicketClick = async (ticket) => {
    try {
      await loadTicket(ticket.id);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading ticket:', error);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    clearSelectedTicket();
  };

  const handleCreateTicket = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleTicketCreated = (newTicket) => {
    setShowCreateForm(false);
    // Recargar tickets para mostrar el nuevo
    loadTickets(filters);
  };

  const handleTicketUpdated = (updatedTicket) => {
    // Recargar tickets para reflejar cambios
    loadTickets(filters);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header con título y botón crear */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Tickets
            </h1>
            <p className="mt-2 text-gray-600">
              Sistema de soporte técnico - Gestiona y da seguimiento a solicitudes
            </p>
          </div>
          <button
            onClick={handleCreateTicket}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Ticket
          </button>
        </div>

        {/* Filtros */}
        <TicketFilters />

        {/* Mensaje de error global */}
        <ErrorMessage error={error} onDismiss={clearError} />

        {/* Resumen rápido */}
        {!loading && tickets.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
                  <div className="text-sm text-gray-500">Total Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tickets.filter(t => t.estado === 'nuevo').length}
                  </div>
                  <div className="text-sm text-gray-500">Nuevos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {tickets.filter(t => t.estado === 'en_proceso').length}
                  </div>
                  <div className="text-sm text-gray-500">En Proceso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tickets.filter(t => t.estado === 'resuelto').length}
                  </div>
                  <div className="text-sm text-gray-500">Resueltos</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {filters.search && `Filtrado por: "${filters.search}"`}
                {filters.estado && ` | Estado: ${filters.estado}`}
              </div>
            </div>
          </div>
        )}

        {/* Tablero Kanban */}
        <KanbanBoard
          tickets={tickets}
          onTicketClick={handleTicketClick}
          loading={loading}
        />

        {/* Estado vacío cuando no hay tickets */}
        {!loading && tickets.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tickets</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.estado 
                ? 'No se encontraron tickets con los filtros aplicados.'
                : 'Comienza creando tu primer ticket de soporte.'
              }
            </p>
            {!filters.search && !filters.estado && (
              <div className="mt-6">
                <button
                  onClick={handleCreateTicket}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Primer Ticket
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear ticket */}
      {showCreateForm && (
        <CreateTicketForm
          onClose={handleCloseCreateForm}
          onSuccess={handleTicketCreated}
        />
      )}

      {/* Modal para detalle de ticket */}
      {showDetailModal && selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={handleCloseDetail}
          onUpdate={handleTicketUpdated}
        />
      )}
    </Layout>
  );
};

const App = () => {
  return (
    <TicketsProvider>
      <AppContent />
    </TicketsProvider>
  );
};

export default App;