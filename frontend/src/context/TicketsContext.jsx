import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ticketsAPI, commentsAPI, handleAPIError } from '../services/api';

// Estado inicial
const initialState = {
  tickets: [],
  selectedTicket: null,
  comments: [],
  filters: {
    estado: '',
    search: '',
  },
  loading: false,
  error: null,
  stats: null,
};

// Acciones del reducer
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TICKETS: 'SET_TICKETS',
  SET_SELECTED_TICKET: 'SET_SELECTED_TICKET',
  SET_COMMENTS: 'SET_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_TICKET: 'UPDATE_TICKET',
  ADD_TICKET: 'ADD_TICKET',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATS: 'SET_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer para manejar el estado
const ticketsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.SET_TICKETS:
      return { ...state, tickets: action.payload, loading: false };
    
    case ACTIONS.SET_SELECTED_TICKET:
      return { ...state, selectedTicket: action.payload, loading: false };
    
    case ACTIONS.SET_COMMENTS:
      return { ...state, comments: action.payload };
    
    case ACTIONS.ADD_COMMENT:
      return { 
        ...state, 
        comments: [...state.comments, action.payload],
        selectedTicket: state.selectedTicket ? {
          ...state.selectedTicket,
          comentarios: [...(state.selectedTicket.comentarios || []), action.payload]
        } : null
      };
    
    case ACTIONS.UPDATE_TICKET:
      const updatedTickets = state.tickets.map(ticket =>
        ticket.id === action.payload.id ? action.payload : ticket
      );
      return {
        ...state,
        tickets: updatedTickets,
        selectedTicket: state.selectedTicket?.id === action.payload.id 
          ? action.payload 
          : state.selectedTicket,
        loading: false
      };
    
    case ACTIONS.ADD_TICKET:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        loading: false
      };
    
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
};

// Contexto
const TicketsContext = createContext();

// Provider del contexto
export const TicketsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketsReducer, initialState);

  // Cargar tickets con filtros
  const loadTickets = useCallback(async (filters = {}) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const data = await ticketsAPI.getTickets(filters);
      dispatch({ type: ACTIONS.SET_TICKETS, payload: data.results || data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: handleAPIError(error) });
    }
  }, []);

  // Cargar ticket específico
  const loadTicket = useCallback(async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const ticket = await ticketsAPI.getTicket(id);
      dispatch({ type: ACTIONS.SET_SELECTED_TICKET, payload: ticket });
      
      // Cargar comentarios del ticket
      const comments = await commentsAPI.getTicketComments(id);
      dispatch({ type: ACTIONS.SET_COMMENTS, payload: comments });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: handleAPIError(error) });
    }
  }, []);

  // Crear nuevo ticket
  const createTicket = useCallback(async (ticketData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const newTicket = await ticketsAPI.createTicket(ticketData);
      dispatch({ type: ACTIONS.ADD_TICKET, payload: newTicket });
      return newTicket;
    } catch (error) {
      const errorMsg = handleAPIError(error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMsg });
      throw new Error(errorMsg);
    }
  }, []);

  // Transicionar estado de ticket
  const transitionTicket = useCallback(async (id, transitionData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await ticketsAPI.transitionTicket(id, transitionData);
      dispatch({ type: ACTIONS.UPDATE_TICKET, payload: result.ticket });
      
      // Recargar comentarios para ver los nuevos comentarios automáticos
      const comments = await commentsAPI.getTicketComments(id);
      dispatch({ type: ACTIONS.SET_COMMENTS, payload: comments });
      
      return result;
    } catch (error) {
      const errorMsg = handleAPIError(error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMsg });
      throw new Error(errorMsg);
    }
  }, []);

  // Agregar comentario
  const addComment = useCallback(async (ticketId, commentData) => {
    try {
      const newComment = await commentsAPI.addComment(ticketId, commentData);
      dispatch({ type: ACTIONS.ADD_COMMENT, payload: newComment });
      return newComment;
    } catch (error) {
      const errorMsg = handleAPIError(error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMsg });
      throw new Error(errorMsg);
    }
  }, []);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const stats = await ticketsAPI.getStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      console.warn('Error loading stats:', error);
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // Limpiar ticket seleccionado
  const clearSelectedTicket = useCallback(() => {
    dispatch({ type: ACTIONS.SET_SELECTED_TICKET, payload: null });
    dispatch({ type: ACTIONS.SET_COMMENTS, payload: [] });
  }, []);

  const value = {
    // Estado
    ...state,
    
    // Acciones
    loadTickets,
    loadTicket,
    createTicket,
    transitionTicket,
    addComment,
    updateFilters,
    loadStats,
    clearError,
    clearSelectedTicket,
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error('useTickets debe ser usado dentro de TicketsProvider');
  }
  return context;
};

// Hook para manejar filtros con debounce
export const useTicketFilters = () => {
  const { filters, updateFilters, loadTickets } = useTickets();
  const [localFilters, setLocalFilters] = React.useState(filters);

  // Debounce para búsqueda
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters(localFilters);
      loadTickets(localFilters);
    }, 300); // 300ms de delay

    return () => clearTimeout(timer);
  }, [localFilters, updateFilters, loadTickets]);

  return {
    filters: localFilters,
    setFilters: setLocalFilters,
    searchQuery: localFilters.search,
    selectedState: localFilters.estado,
  };
};