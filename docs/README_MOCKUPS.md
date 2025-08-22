# Mockups del Sistema de Tickets

## Vista Tablero Kanban

┌─────────────────────────────────────────────────────────────────────────────┐
│ Sistema de Tickets - Gestión de soporte técnico      [+ Nuevo Ticket]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Buscar tickets...              [Estado: Todos ▼]     [Limpiar]          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Total: 6 tickets | Nuevos: 2 | En Proceso: 2 | Resueltos: 1 | Cerrados: 1  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──NUEVO────────┐  ┌──EN PROCESO───┐  ┌──RESUELTO────┐  ┌──CERRADO──────┐  │
│  │      🔵 (2)   │  │      🟡 (2)   │  │      🟢 (1)  │  │      ⚫ (1)   │
│  │               │  │               │  │              │  │               │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌──────────┐ │  │ ┌───────────┐ │
│  │ │#2  [MEDIA]│ │  │ │#1  [ALTA] │ │  │ │#3 [MEDIA]│ │  │ │#4  [BAJA] │ │
│  │ │Solicitud  │ │  │ │Error en   │ │  │ │Config.   │ │  │ │Problema   │ │
│  │ │de acceso  │ │  │ │login del  │ │  │ │de nuevo  │ │  │ │impresora  │ │
│  │ │a carpeta  │ │  │ │sistema    │ │  │ │equipo    │ │  │ │oficina    │ │
│  │ │compartida │ │  │ │           │ │  │ │          │ │  │ │           │ │
│  │ │           │ │  │ │💬 2 coment│ │  │ │💬 1 coment│ │  │ │💬 3 coment│ │
│  │ │Carlos R.  │ │  │ │María G.   │ │  │ │Ana L.    │ │  │ │Luis H.    │ │
│  │ │16/08/24   │ │  │ │15/08/24   │ │  │ │10/08/24  │ │  │ │05/08/24   │ │
│  │ └───────────┘ │  │ └───────────┘ │  │ └──────────┘ │  │ └───────────┘ │
│  │               │  │               │  │              │  │               │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │              │  │               │
│  │ │#5  [ALTA] │ │  │ │#6  [BAJA] │ │  │              │  │               │
│  │ │Actualiz.  │ │  │ │Capacitación│ │  │              │  │               │
│  │ │software   │ │  │ │herramientas│ │  │              │  │               │
│  │ │contabilid.│ │  │ │digitales  │ │  │              │  │               │
│  │ │           │ │  │ │           │ │  │              │  │               │
│  │ │💬 1 coment│ │  │ │💬 1 coment│ │  │              │  │               │
│  │ │Patricia M.│ │  │ │Roberto S. │ │  │              │  │               │
│  │ │17/08/24   │ │  │ │12/08/24   │ │  │              │  │               │
│  │ └───────────┘ │  │ └───────────┘ │  │              │  │               │
│  └───────────────┘  └───────────────┘  └──────────────┘  └───────────────┘
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

## Flujo de Estados

┌─────────┐      ┌──────────────┐      ┌──────────┐      ┌─────────┐
   │  NUEVO  │ ───▶ │  EN PROCESO  │ ───▶ │ RESUELTO │ ───▶ │ CERRADO │
   │   🔵    │      │     🟡       │      │    🟢    │      │   ⚫    │
   └─────────┘      └──────────────┘      └──────────┘      └─────────┘
        ▲                   │
        │                   │
        └───────────────────┘
           (retrabajo)

## Transiciones Válidas:

- nuevo → en_proceso: Cuando se comienza a trabajar en el ticket
- en_proceso → resuelto: Cuando se completa la solución
- en_proceso → nuevo: Para retrabajo (volver al estado inicial)
- resuelto → cerrado: Confirmación final del usuario

## Características de la UI

   ## Colores y Estados:

- Nuevo: Azul (#3b82f6) - Tickets recién creados
- En Proceso: Amarillo (#eab308) - Tickets siendo trabajados
- Resuelto: Verde (#22c55e) - Tickets solucionados
- Cerrado: Gris (#6b7280) - Tickets finalizados

   ## Prioridades:

- Alta: Rojo (#ef4444) - Problemas críticos
- Media: Amarillo (#eab308) - Problemas normales
- Baja: Verde (#22c55e) - Problemas menores

## Funcionalidades Clave:

1. Filtrado en tiempo real: Buscar por texto y filtrar por estado
2. Vista Kanban: Organización visual por columnas de estado
3. Transiciones controladas: Solo se permiten cambios válidos
4. Historial completo: Comentarios cronológicos con timestamps
5. Responsive: Adaptable a dispositivos móviles y escritorio
6. Feedback visual: Estados de carga, errores y confirmaciones

---

## 📁 **ARCHIVO PRINCIPAL README**

### `README.md` (Raíz del proyecto)
```markdown
# Sistema de Tickets de Soporte

Sistema web para gestionar tickets de soporte con flujo de estados, comentarios y vista tipo kanban.

## Características

- ✅ Creación de tickets con información esencial
- ✅ Flujo controlado de estados (nuevo → en_proceso → resuelto → cerrado)
- ✅ Comentarios por ticket con historial cronológico
- ✅ Filtros por estado y búsqueda por texto
- ✅ Vista tablero kanban + detalle de ticket
- ✅ Validaciones de transiciones de estado
- ✅ Manejo de errores y estados de carga

## Tecnologías

**Backend:**
- Django 4.2+
- Django REST Framework
- SQLite (base de datos)
- Python 3.8+

**Frontend:**
- React 18+
- Vite
- Tailwind CSS
- Axios para peticiones HTTP
- Node.js 16+

## Instalación y Ejecución

### Requisitos previos
- Python 3.8 o superior
- Node.js 16 o superior
- pip y npm

### Backend (Django)

1. Navegar al directorio del backend:
```bash
cd backend

2. Crear entorno virtual:

python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

3. Instalar dependencias:

pip install -r requirements.txt

4. Configurar base de datos:

python manage.py migrate

5. Cargar datos de ejemplo:

python manage.py loaddata fixtures/sample_data.json

6. Ejecutar servidor de desarrollo:

python manage.py runserver

El backend estará disponible en http://localhost:8000

### Frontend (React)

1. En una nueva terminal, navegar al directorio del frontend:

cd frontend

2. Instalar dependencias:

npm install

3. Ejecutar servidor de desarrollo:

npm run dev

El frontend estará disponible en http://localhost:5173

### API Endpoints

Tickets

- GET /api/tickets/ - Listar tickets (con filtros: estado, search)
- POST /api/tickets/ - Crear nuevo ticket
- GET /api/tickets/{id}/ - Obtener ticket específico
- PATCH /api/tickets/{id}/transition/ - Cambiar estado del ticket

Comentarios

- GET /api/tickets/{id}/comments/ - Obtener comentarios de un ticket
- POST /api/tickets/{id}/comments/ - Agregar comentario a un ticket

Flujo de Estados

nuevo → en_proceso → resuelto → cerrado
  ↑         ↓
  ←─────────┘ (retrabajo permitido)

Transiciones válidas:

- nuevo → en_proceso
- en_proceso → resuelto
- en_proceso → nuevo (retrabajo)
- resuelto → cerrado

Estructura del Proyecto

├── backend/
│   ├── tickets_system/          # Proyecto Django
│   ├── tickets/                 # App principal
│   │   ├── models.py           # Modelos Ticket y Comment
│   │   ├── serializers.py      # Serializers DRF
│   │   ├── views.py            # ViewSets y API views
│   │   └── urls.py             # URLs de la API
│   ├── fixtures/               # Datos de ejemplo
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Cliente API
│   │   ├── context/            # Context API
│   │   └── App.jsx             # Componente principal
│   └── package.json
└── docs/                       # Mockups y documentación

## Mockups
Vista Tablero Kanban
La aplicación incluye un tablero visual organizado en columnas por estado:

- Nuevo (azul)
- En Proceso (amarillo)
- Resuelto (verde)
- Cerrado (gris)

Vista Detalle de Ticket
Muestra información completa del ticket:

- Datos principales (título, descripción, prioridad, solicitante)
- Historial de comentarios ordenado cronológicamente
- Botones para transiciones de estado válidas
- Formulario para agregar comentarios

Datos de Ejemplo
El sistema incluye datos de prueba con:

- 6 tickets de ejemplo en diferentes estados
- Varios comentarios por ticket
- Diferentes prioridades y solicitantes

Validaciones

- Transiciones de estado: Solo se permiten transiciones válidas según el flujo
- Campos requeridos: Título, descripción y solicitante son obligatorios
- Prioridad: Solo valores válidos (baja, media, alta)
- Manejo de errores: Respuestas HTTP apropiadas (400, 404, 500)

## Características Técnicas
Backend

- Serializers DRF con validaciones personalizadas
- ViewSets para operaciones CRUD
- Filtrado por QueryParameters
- CORS configurado para desarrollo
- Validación de transiciones de estado

Frontend

- Estado global con Context API
- Custom hooks para API calls
- Componentes reutilizables
- Loading states y error handling
- Responsive design con Tailwind CSS

## Scripts Útiles
Backend

# Crear superusuario (opcional)
python manage.py createsuperuser

# Resetear base de datos
python manage.py flush
python manage.py migrate
python manage.py loaddata fixtures/sample_data.json

Frontend
# Build para producción
npm run build

# Preview del build
npm run preview

## Acceso a la Aplicación
Una vez que ambos servidores estén ejecutándose:

- Frontend: http://localhost:5173
- API Backend: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

Mejoras Futuras

- Sistema de autenticación y autorización
- Asignación de tickets a agentes específicos
- Notificaciones por email
- Métricas y reportes
- Filtros adicionales (fecha, prioridad, asignado)
- Adjuntos de archivos
- Plantillas de respuesta
- SLA y tiempos de respuesta

Contribución
Este es un proyecto de prueba técnica. Para mejoras o sugerencias, por favor revisar el código y documentación incluida.

Licencia
Proyecto desarrollado para fines educativos y de evaluación técnica.

---

## 🎯 **RESUMEN FINAL DE ARCHIVOS**

¡Listo! Te he entregado todos los archivos del sistema de tickets siguiendo la estructura exacta que especificaste:

### **Backend Completo:**
- ✅ `requirements.txt`
- ✅ `tickets_system/` (settings, urls, wsgi, asgi)
- ✅ `tickets/` (models, serializers, views, urls, admin, apps)
- ✅ `fixtures/sample_data.json`
- ✅ `manage.py`

### **Frontend Completo:**
- ✅ `package.json`, `vite.config.js`, `tailwind.config.js`
- ✅ `index.html`, `main.jsx`, `index.css`
- ✅ `services/api.js`
- ✅ `context/TicketsContext.jsx`
- ✅ `components/` (Layout, LoadingSpinner, ErrorMessage, TicketCard, TicketFilters, KanbanBoard, CreateTicketForm, TicketDetail)
- ✅ `App.jsx`

### **Documentación:**
- ✅ `docs/README_MOCKUPS.md`
- ✅ `README.md` principal

## 🚀 **Para ejecutar el proyecto:**

1. **Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/sample_data.json
python manage.py runserver

2. **Frontend:**

cd frontend
npm install
npm run dev

3. **Acceder:**

- Frontend: http://localhost:5173
- API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

¡El sistema está completo y listo para funcionar! 🎉