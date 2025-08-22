from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Ticket, Comment
from .serializers import (
    TicketListSerializer, TicketDetailSerializer, TicketCreateSerializer,
    TicketTransitionSerializer, CommentSerializer, CommentCreateSerializer
)


class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar tickets de soporte.
    Incluye operaciones CRUD, filtros y transiciones de estado.
    """
    
    queryset = Ticket.objects.all().prefetch_related('comentarios')
    
    def get_serializer_class(self):
        """Selecciona el serializer apropiado según la acción."""
        if self.action == 'list':
            return TicketListSerializer
        elif self.action == 'create':
            return TicketCreateSerializer
        elif self.action == 'transition':
            return TicketTransitionSerializer
        else:
            return TicketDetailSerializer
    
    def get_queryset(self):
        """
        Filtra tickets según parámetros de query.
        Soporta filtros por estado y búsqueda de texto.
        """
        queryset = super().get_queryset()
        
        # Filtro por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Búsqueda por texto en título y descripción
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) | 
                Q(descripcion__icontains=search) |
                Q(solicitante__icontains=search)
            )
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo ticket con validaciones.
        Retorna el ticket creado con datos completos.
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            ticket = serializer.save()
            
            # Crear comentario inicial automático
            Comment.objects.create(
                ticket=ticket,
                autor='Sistema',
                contenido=f'Ticket creado por {ticket.solicitante}'
            )
            
            # Retornar respuesta con datos completos
            response_serializer = TicketDetailSerializer(ticket)
            return Response(
                response_serializer.data, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['patch'], url_path='transition')
    def transition(self, request, pk=None):
        """
        Maneja la transición de estado de un ticket.
        Valida que la transición sea permitida según el flujo definido.
        """
        ticket = self.get_object()
        serializer = self.get_serializer(
            data=request.data,
            context={'ticket': ticket}
        )
        
        if serializer.is_valid():
            try:
                updated_ticket = serializer.save()
                response_serializer = TicketDetailSerializer(updated_ticket)
                return Response(
                    {
                        'message': f'Ticket transicionado a {updated_ticket.get_estado_display()}',
                        'ticket': response_serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        """
        Gestiona los comentarios de un ticket específico.
        GET: Lista comentarios ordenados cronológicamente.
        POST: Agrega nuevo comentario al ticket.
        """
        ticket = self.get_object()
        
        if request.method == 'GET':
            # Listar comentarios del ticket
            comentarios = ticket.comentarios.all()
            serializer = CommentSerializer(comentarios, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Crear nuevo comentario
            serializer = CommentCreateSerializer(data=request.data)
            
            if serializer.is_valid():
                comment = serializer.save(ticket=ticket)
                response_serializer = CommentSerializer(comment)
                return Response(
                    response_serializer.data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        Proporciona estadísticas básicas de los tickets.
        Útil para dashboards y reportes.
        """
        queryset = self.get_queryset()
        
        # Contar tickets por estado
        stats_por_estado = {}
        for estado, nombre in Ticket.STATUS_CHOICES:
            count = queryset.filter(estado=estado).count()
            stats_por_estado[estado] = {
                'nombre': nombre,
                'count': count
            }
        
        # Contar tickets por prioridad
        stats_por_prioridad = {}
        for prioridad, nombre in Ticket.PRIORITY_CHOICES:
            count = queryset.filter(prioridad=prioridad).count()
            stats_por_prioridad[prioridad] = {
                'nombre': nombre,
                'count': count
            }
        
        return Response({
            'total_tickets': queryset.count(),
            'por_estado': stats_por_estado,
            'por_prioridad': stats_por_prioridad,
        })


class CommentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para comentarios.
    Permite consultar comentarios individuales si es necesario.
    """
    
    queryset = Comment.objects.all().select_related('ticket')
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        """Filtra comentarios por ticket si se especifica."""
        queryset = super().get_queryset()
        
        ticket_id = self.request.query_params.get('ticket', None)
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
        
        return queryset