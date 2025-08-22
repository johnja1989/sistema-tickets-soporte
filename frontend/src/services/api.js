// frontend/src/services/api.js
import axios from 'axios';

// Detectar si estamos en modo demo (GitHub Pages)
const isDemoMode = window.location.hostname.includes('github.io');

// Datos de demo para GitHub Pages
let DEMO_TICKETS = [
  {
    id: 1,
    titulo: "Error en el login del sistema",
    descripcion: "Los usuarios no pueden acceder al sistema usando sus credenciales habituales. El error aparece después de hacer clic en 'Iniciar Sesión'.",
    prioridad: "alta",
    estado: "en_proceso",
    solicitante: "María García",
    email: "maria.garcia@empresa.com",
    fecha_creacion: "2024-08-15T09:30:00Z",
    fecha_actualizacion: "2024-08-15T11:45:00Z",
    total_comentarios: 3,
    comentarios: [
      {
        id: 1,
        autor: "Sistema",
        contenido: "Ticket creado por María García",
        fecha_creacion: "2024-08-15T09:30:00Z"
      },
      {
        id: 2,
        autor: "Soporte Técnico",
        contenido: "Hemos identificado el problema. Parece ser un error en el servidor de autenticación. Trabajando en la solución.",
        fecha_creacion: "2024-08-15T10:15:00Z"
      },
      {
        id: 3,
        autor: "Sistema",
        contenido: "Estado cambiado a 'En Proceso'",
        fecha_creacion: "2024-08-15T11:45:00Z"
      }
    ],
    transiciones_validas: [
      { estado: "resuelto", nombre: "Resuelto" },
      { estado: "nuevo", nombre: "Nuevo" }
    ]
  },
  {
    id: 2,
    titulo: "Solicitud de acceso a carpeta compartida",
    descripcion: "Necesito acceso a la carpeta compartida 'Proyectos 2024' para poder colaborar en el proyecto actual.",
    prioridad: "media",
    estado: "nuevo",
    solicitante: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    fecha_creacion: "2024-08-16T14:20:00Z",
    fecha_actualizacion: "2024-08-16T14:20:00Z",
    total_comentarios: 1,
    comentarios: [
      {
        id: 4,
        autor: "Sistema",
        contenido: "Ticket creado por Carlos Rodríguez",
        fecha_creacion: "2024-08-16T14:20:00Z"
      }
    ],
    transiciones_validas: [
      { estado: "en_proceso", nombre: "En Proceso" }
    ]
  },
  {
    id: 3,
    titulo: "Configuración de nuevo equipo",
    descripcion: "Necesito ayuda para configurar mi nuevo equipo de trabajo con todos los programas y accesos necesarios.",
    prioridad: "media",
    estado: "resuelto",
    solicitante: "Ana López",
    email: "ana.lopez@empresa.com",
    fecha_creacion: "2024-08-10T08:15:00Z",
    fecha_actualizacion: "2024-08-14T16:30:00Z",
    total_comentarios: 3,
    comentarios: [
      {
        id: 5,
        autor: "Sistema",
        contenido: "Ticket creado por Ana López",
        fecha_creacion: "2024-08-10T08:15:00Z"
      },
      {
        id: 6,
        autor: "IT Support",
        contenido: "Equipo configurado exitosamente. Se instalaron todos los programas requeridos y se configuraron los accesos necesarios.",
        fecha_creacion: "2024-08-14T15:20:00Z"
      },
      {
        id: 7,
        autor: "Sistema",
        contenido: "Estado cambiado a 'Resuelto'",
        fecha_creacion: "2024-08-14T16:30:00Z"
      }
    ],
    transiciones_validas: [
      { estado: "cerrado", nombre: "Cerrado" }
    ]
  },
  {
    id: 4,
    titulo: "Problema con impresora de oficina",
    descripcion: "La impresora del segundo piso no funciona. Muestra un error de conexión constante.",
    prioridad: "baja",
    estado: "cerrado",
    solicitante: "Luis Hernández",
    email: "",
    fecha_creacion: "2024-08-05T13:45:00Z",
    fecha_actualizacion: "2024-08-12T10:20:00Z",
    total_comentarios: 3,
    comentarios: [
      {
        id: 8,
        autor: "Sistema",
        contenido: "Ticket creado por Luis Hernández",
        fecha_creacion: "2024-08-05T13:45:00Z"
      },
      {
        id: 9,
        autor: "Mantenimiento",
        contenido: "Se reemplazó el cable de red de la impresora. Problema solucionado.",
        fecha_creacion: "2024-08-12T09:30:00Z"
      },
      {
        id: 10,
        autor: "Sistema",
        contenido: "Estado cambiado a 'Cerrado'",
        fecha_creacion: "2024-08-12T10:20:00Z"
      }
    ],
    transiciones_validas: []
  },
  {
    id: 5,
    titulo: "Actualización de software de contabilidad",
    descripcion: "El sistema de contabilidad necesita ser actualizado a la última versión para cumplir con las nuevas regulaciones.",
    prioridad: "alta",
    estado: "nuevo",
    solicitante: "Patricia Morales",
    email: "patricia.morales@empresa.com",
    fecha_creacion: "2024-08-17T11:00:00Z",
    fecha_actualizacion: "2024-08-17T11:00:00Z",
    total_comentarios: 1,
    comentarios: [
      {
        id: 11,
        autor: "Sistema",
        contenido: "Ticket creado por Patricia Morales",
        fecha_creacion: "2024-08-17T11:00:00Z"
      }
    ],
    transiciones_validas: [
      { estado: "en_proceso", nombre: "En Proceso" }
    ]
  },
  {
    id: 6,
    titulo: "Capacitación en herramientas digitales",
    descripcion: "Solicito capacitación en las nuevas herramientas digitales que implementó la empresa para mejorar la productividad.",
    prioridad: "baja",
    estado: "en_proceso",
    solicitante: "Roberto Silva",
    email: "roberto.silva@empresa.com",
    fecha_creacion: "2024-08-12T16:30:00Z",
    fecha_actualizacion: "2024-08-15T09:15:00Z",
    total_comentarios: 2,
    comentarios: [
      {
        id: 12,
        autor: "Sistema",
        contenido: "Ticket creado por Roberto Silva",
        fecha_creacion: "2024-08-12T16:30:00Z"
      },
      {
        id: 13,
        autor: "Recursos Humanos",
        contenido: "Se ha programado la capacitación para el próximo viernes. Se enviará invitación por correo.",
        fecha_creacion: "2024-08-15T09:15:00Z"
      }
    ],
    transiciones_validas: [
      { estado: "resuelto", nombre: "Resuelto" },
      { estado: "nuevo", nombre: "Nuevo" }
    ]
  }
];

// API simulada para modo demo
const mockAPI = {
  getTickets: async (filters = {}) => {
    let tickets = [...DEMO_TICKETS];
    
    if (filters.estado) {
      tickets = tickets.filter(t => t.estado === filters.estado);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.titulo.toLowerCase().includes(searchLower) ||
        t.descripcion.toLowerCase().includes(searchLower) ||
        t.solicitante.toLowerCase().includes(searchLower)
      );
    }
    
    return tickets;
  },
  
  getTicket: async (id) => {
    const ticket = DEMO_TICKETS.find(t => t.id === parseInt(id));
    return ticket || null;
  },
  
  createTicket: async (data) => {
    const newTicket = {
      id: Math.max(...DEMO_TICKETS.map(t => t.id)) + 1,
      ...data,
      estado: "nuevo",
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
      total_comentarios: 1,
      comentarios: [{
        id: Date.now(),
        autor: "Sistema",
        contenido: `Ticket creado por ${data.solicitante}`,
        fecha_creacion: new Date().toISOString()
      }],
      transiciones_validas: [{ estado: "en_proceso", nombre: "En Proceso" }]
    };
    
    DEMO_TICKETS.unshift(newTicket);
    return newTicket;
  },

  transitionTicket: async (id, transitionData) => {
    const ticketIndex = DEMO_TICKETS.findIndex(t => t.id === parseInt(id));
    if (ticketIndex === -1) return null;

    const ticket = DEMO_TICKETS[ticketIndex];
    const newState = transitionData.nuevo_estado;
    
    // Actualizar estado
    ticket.estado = newState;
    ticket.fecha_actualizacion = new Date().toISOString();
    
    // Agregar comentario de transición
    const transitionComment = {
      id: Date.now(),
      autor: "Sistema",
      contenido: `Estado cambiado a '${getStateDisplayName(newState)}'`,
      fecha_creacion: new Date().toISOString()
    };
    
    ticket.comentarios.push(transitionComment);
    ticket.total_comentarios = ticket.comentarios.length;
    
    // Agregar comentario adicional si se proporcionó
    if (transitionData.comentario && transitionData.comentario.trim()) {
      const userComment = {
        id: Date.now() + 1,
        autor: "Sistema",
        contenido: transitionData.comentario.trim(),
        fecha_creacion: new Date().toISOString()
      };
      ticket.comentarios.push(userComment);
      ticket.total_comentarios = ticket.comentarios.length;
    }
    
    // Actualizar transiciones válidas
    ticket.transiciones_validas = getValidTransitions(newState);
    
    return { ticket };
  },

  addComment: async (ticketId, commentData) => {
    const ticketIndex = DEMO_TICKETS.findIndex(t => t.id === parseInt(ticketId));
    if (ticketIndex === -1) return null;

    const newComment = {
      id: Date.now(),
      autor: commentData.autor,
      contenido: commentData.contenido,
      fecha_creacion: new Date().toISOString()
    };

    DEMO_TICKETS[ticketIndex].comentarios.push(newComment);
    DEMO_TICKETS[ticketIndex].total_comentarios = DEMO_TICKETS[ticketIndex].comentarios.length;

    return newComment;
  }
};

// Helpers para transiciones
const getStateDisplayName = (state) => {
  const stateNames = {
    'nuevo': 'Nuevo',
    'en_proceso': 'En Proceso',
    'resuelto': 'Resuelto',
    'cerrado': 'Cerrado'
  };
  return stateNames[state] || state;
};

const getValidTransitions = (currentState) => {
  const transitions = {
    'nuevo': [{ estado: 'en_proceso', nombre: 'En Proceso' }],
    'en_proceso': [
      { estado: 'resuelto', nombre: 'Resuelto' },
      { estado: 'nuevo', nombre: 'Nuevo' }
    ],
    'resuelto': [{ estado: 'cerrado', nombre: 'Cerrado' }],
    'cerrado': []
  };
  return transitions[currentState] || [];
};

// Configuración base de axios (solo para desarrollo local)
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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
  getTickets: async (filters = {}) => {
    if (isDemoMode) {
      console.log('🎭 Modo demo: usando datos simulados');
      return mockAPI.getTickets(filters);
    }
    
    const params = new URLSearchParams();
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/tickets/?${params.toString()}`);
    return response.data;
  },

  getTicket: async (id) => {
    if (isDemoMode) {
      return mockAPI.getTicket(id);
    }
    
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    if (isDemoMode) {
      return mockAPI.createTicket(ticketData);
    }
    
    const response = await api.post('/tickets/', ticketData);
    return response.data;
  },

  transitionTicket: async (id, transitionData) => {
    if (isDemoMode) {
      return mockAPI.transitionTicket(id, transitionData);
    }
    
    const response = await api.patch(`/tickets/${id}/transition/`, transitionData);
    return response.data;
  },

  getStats: async () => {
    if (isDemoMode) {
      const tickets = await mockAPI.getTickets();
      const stats = {
        total_tickets: tickets.length,
        por_estado: {},
        por_prioridad: {}
      };
      
      // Calcular estadísticas
      ['nuevo', 'en_proceso', 'resuelto', 'cerrado'].forEach(estado => {
        const count = tickets.filter(t => t.estado === estado).length;
        stats.por_estado[estado] = {
          nombre: getStateDisplayName(estado),
          count
        };
      });
      
      ['baja', 'media', 'alta'].forEach(prioridad => {
        const count = tickets.filter(t => t.prioridad === prioridad).length;
        stats.por_prioridad[prioridad] = {
          nombre: prioridad.charAt(0).toUpperCase() + prioridad.slice(1),
          count
        };
      });
      
      return stats;
    }
    
    const response = await api.get('/tickets/stats/');
    return response.data;
  },
};

// Servicio para comentarios
export const commentsAPI = {
  getTicketComments: async (ticketId) => {
    if (isDemoMode) {
      const ticket = await mockAPI.getTicket(ticketId);
      return ticket ? ticket.comentarios : [];
    }
    
    const response = await api.get(`/tickets/${ticketId}/comments/`);
    return response.data;
  },

  addComment: async (ticketId, commentData) => {
    if (isDemoMode) {
      return mockAPI.addComment(ticketId, commentData);
    }
    
    const response = await api.post(`/tickets/${ticketId}/comments/`, commentData);
    return response.data;
  },
};

// Utilidades para manejo de errores
export const handleAPIError = (error) => {
  if (isDemoMode) {
    return 'Error en modo demo: ' + (error.message || 'Error desconocido');
  }
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
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
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
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