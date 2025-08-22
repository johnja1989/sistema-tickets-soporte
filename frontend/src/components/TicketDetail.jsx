import React, { useState } from 'react';
import { useTickets } from '../context/TicketsContext';
import { TICKET_STATES, PRIORITY_LEVELS } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TicketDetail = ({ ticket, onClose, onUpdate }) => {
  const { transitionTicket, addComment, loading, error, clearError } = useTickets();
  const [newComment, setNewComment] = useState('');
  const [transitionComment, setTransitionComment] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

  if (!ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <LoadingSpinner text="Cargando ticket..." />
        </div>
      </div>
    );
  }

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTransition = async (newState) => {
    setIsTransitioning(true);
    try {
      const result = await transitionTicket(ticket.id, {
        nuevo_estado: newState,
        comentario: transitionComment.trim() || undefined
      });
      setTransitionComment('');
      if (onUpdate) onUpdate(result.ticket);
    } catch (error) {
      console.error('Error transitioning ticket:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      await addComment(ticket.id, {
        autor: 'Usuario', // En un sistema real, esto vendría del usuario autenticado
        contenido: newComment.trim()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket.id}
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getColorClasses(statusInfo.color)}`}>
              {statusInfo.name}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getColorClasses(priorityInfo.color)}`}>
              Prioridad {priorityInfo.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <ErrorMessage error={error} onDismiss={clearError} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información principal del ticket */}
            <div className="lg:col-span-2 space-y-6">
              {/* Detalles del ticket */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {ticket.titulo}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">
                  {ticket.descripcion}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Solicitante:</span>
                    <p className="text-gray-900">{ticket.solicitante}</p>
                  </div>
                  {ticket.email && (
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{ticket.email}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Creado:</span>
                    <p className="text-gray-900">{formatDate(ticket.fecha_creacion)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Última actualización:</span>
                    <p className="text-gray-900">{formatDate(ticket.fecha_actualizacion)}</p>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Historial de Comentarios ({ticket.comentarios?.length || 0})
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ticket.comentarios?.map((comment) => (
                    <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{comment.autor}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.fecha_creacion)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.contenido}</p>
                    </div>
                  ))}
                  
                  {(!ticket.comentarios || ticket.comentarios.length === 0) && (
                    <p className="text-gray-500 text-center py-4">
                      No hay comentarios aún
                    </p>
                  )}
                </div>

                {/* Formulario para agregar comentario */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Agregar comentario
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Escribe tu comentario aquí..."
                      disabled={isAddingComment}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isAddingComment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingComment ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Agregando...
                      </>
                    ) : (
                      'Agregar Comentario'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Panel lateral - Acciones */}
            <div className="space-y-6">
              {/* Transiciones de estado */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cambiar Estado
                </h3>
                
                {ticket.transiciones_validas && ticket.transiciones_validas.length > 0 ? (
                  <div className="space-y-4">
                    {/* Comentario opcional para la transición */}
                    <div>
                      <label htmlFor="transition-comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Comentario (opcional)
                      </label>
                      <textarea
                        id="transition-comment"
                        rows={2}
                        value={transitionComment}
                        onChange={(e) => setTransitionComment(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Razón del cambio de estado..."
                        disabled={isTransitioning}
                      />
                    </div>

                    {/* Botones de transición */}
                    <div className="space-y-2">
                      {ticket.transiciones_validas.map((transition) => {
                        const targetStateInfo = TICKET_STATES[transition.estado];
                        return (
                          <button
                            key={transition.estado}
                            onClick={() => handleTransition(transition.estado)}
                            disabled={isTransitioning || loading}
                            className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              targetStateInfo?.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                              targetStateInfo?.color === 'green' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                              targetStateInfo?.color === 'gray' ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' :
                              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                          >
                            {isTransitioning ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cambiando...
                              </>
                            ) : (
                              <>
                                Cambiar a "{transition.nombre}"
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No hay transiciones disponibles desde el estado actual.
                  </p>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Ticket
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-gray-600">ID del Ticket</dt>
                    <dd className="text-gray-900">#{ticket.id}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Estado Actual</dt>
                    <dd>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(statusInfo.color)}`}>
                        {statusInfo.name}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Prioridad</dt>
                    <dd>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(priorityInfo.color)}`}>
                        {priorityInfo.name}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Total de Comentarios</dt>
                    <dd className="text-gray-900">{ticket.comentarios?.length || 0}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Fecha de Creación</dt>
                    <dd className="text-gray-900">
                      {new Date(ticket.fecha_creacion).toLocaleDateString('es-ES')}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Última Actualización</dt>
                    <dd className="text-gray-900">
                      {new Date(ticket.fecha_actualizacion).toLocaleDateString('es-ES')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;