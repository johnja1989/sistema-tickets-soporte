import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://tu-backend-deploy.railway.app/api'  // URL de tu backend en producción
    : 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicio para tickets
export const ticketsAPI = {
  // Obtener todos los tickets con filtros opcionales
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/tickets/?${params.toString()}`);
    return response.data;
  },

  // Obtener un ticket específico
  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },

  // Crear nuevo ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets/', ticketData);
    return response.data;
  },

  // Transicionar estado de ticket
  transitionTicket: async (id, transitionData) => {
    const response = await api.patch(`/tickets/${id}/transition/`, transitionData);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/tickets/stats/');
    return response.data;
  },
};

// Servicio para comentarios
export const commentsAPI = {
  // Obtener comentarios de un ticket
  getTicketComments: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments/`);
    return response.data;
  },

  // Agregar comentario a un ticket
  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/tickets/${ticketId}/comments/`, commentData);
    return response.data;
  },
};

// Utilidades para manejo de errores
export const handleAPIError = (error) => {
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      // Errores de validación
      if (data.errors || data.error) {
        return data.errors || data.error;
      }
      return 'Datos inválidos. Por favor revisa los campos.';
    } else if (status === 404) {
      return 'Recurso no encontrado.';
    } else if (status === 500) {
      return 'Error interno del servidor. Intenta nuevamente.';
    } else {
      return data.message || data.error || 'Error en el servidor.';
    }
  } else if (error.request) {
    // Error de conexión
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
    // Error de configuración
    return 'Error inesperado. Intenta nuevamente.';
  }
};

// Constantes útiles
export const TICKET_STATES = {
  'nuevo': { name: 'Nuevo', color: 'blue' },
  'en_proceso': { name: 'En Proceso', color: 'yellow' },
  'resuelto': { name: 'Resuelto', color: 'green' },
  'cerrado': { name: 'Cerrado', color: 'gray' },
};

export const PRIORITY_LEVELS = {
  'baja': { name: 'Baja', color: 'green' },
  'media': { name: 'Media', color: 'yellow' },
  'alta': { name: 'Alta', color: 'red' },
};

export default api;