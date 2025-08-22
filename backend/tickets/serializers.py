from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Ticket, Comment


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer para comentarios de tickets.
    Incluye validación y campos de solo lectura.
    """
    
    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'autor', 'contenido', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']
    
    def validate_contenido(self, value):
        """Valida que el comentario tenga contenido significativo."""
        if not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El comentario debe tener al menos 3 caracteres.")
            
        return value.strip()


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para crear comentarios sin especificar ticket."""
    
    class Meta:
        model = Comment
        fields = ['autor', 'contenido']
    
    def validate_contenido(self, value):
        """Valida que el comentario tenga contenido significativo."""
        if not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El comentario debe tener al menos 3 caracteres.")
            
        return value.strip()


class TicketListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listado de tickets.
    Incluye campos calculados y cuenta de comentarios.
    """
    
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    prioridad_display = serializers.CharField(source='get_prioridad_display', read_only=True)
    total_comentarios = serializers.SerializerMethodField()
    priority_color = serializers.CharField(source='get_priority_color', read_only=True)
    status_color = serializers.CharField(source='get_status_color', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'titulo', 'descripcion', 'prioridad', 'prioridad_display',
            'solicitante', 'email', 'estado', 'estado_display', 
            'fecha_creacion', 'fecha_actualizacion', 'total_comentarios',
            'priority_color', 'status_color'
        ]
    
    def get_total_comentarios(self, obj):
        """Cuenta total de comentarios del ticket."""
        return obj.comentarios.count()


class TicketDetailSerializer(serializers.ModelSerializer):
    """
    Serializer detallado para un ticket específico.
    Incluye comentarios y transiciones válidas.
    """
    
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    prioridad_display = serializers.CharField(source='get_prioridad_display', read_only=True)
    comentarios = CommentSerializer(many=True, read_only=True)
    transiciones_validas = serializers.SerializerMethodField()
    priority_color = serializers.CharField(source='get_priority_color', read_only=True)
    status_color = serializers.CharField(source='get_status_color', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'titulo', 'descripcion', 'prioridad', 'prioridad_display',
            'solicitante', 'email', 'estado', 'estado_display',
            'fecha_creacion', 'fecha_actualizacion', 'comentarios',
            'transiciones_validas', 'priority_color', 'status_color'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']
    
    def get_transiciones_validas(self, obj):
        """Obtiene las transiciones válidas desde el estado actual."""
        return [
            {'estado': estado, 'nombre': nombre}
            for estado, nombre in obj.get_transiciones_validas()
        ]


class TicketCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear nuevos tickets.
    Incluye validaciones específicas de creación.
    """
    
    class Meta:
        model = Ticket
        fields = [
            'titulo', 'descripcion', 'prioridad', 
            'solicitante', 'email'
        ]
    
    def validate_titulo(self, value):
        """Valida que el título sea descriptivo."""
        if not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío.")
        
        if len(value.strip()) < 5:
            raise serializers.ValidationError("El título debe tener al menos 5 caracteres.")
            
        return value.strip()
    
    def validate_descripcion(self, value):
        """Valida que la descripción sea suficientemente detallada."""
        if not value.strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")
        
        if len(value.strip()) < 10:
            raise serializers.ValidationError("La descripción debe tener al menos 10 caracteres.")
            
        return value.strip()
    
    def validate_solicitante(self, value):
        """Valida el nombre del solicitante."""
        if not value.strip():
            raise serializers.ValidationError("El nombre del solicitante no puede estar vacío.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
            
        return value.strip()


class TicketTransitionSerializer(serializers.Serializer):
    """
    Serializer para manejar transiciones de estado.
    Valida que la transición sea permitida según el flujo.
    """
    
    nuevo_estado = serializers.ChoiceField(choices=Ticket.STATUS_CHOICES)
    comentario = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text="Comentario opcional sobre la transición"
    )
    
    def validate_nuevo_estado(self, value):
        """Valida que la transición sea válida para el ticket actual."""
        ticket = self.context.get('ticket')
        
        if not ticket:
            raise serializers.ValidationError("No se encontró el ticket para validar la transición.")
        
        if not ticket.puede_transicionar_a(value):
            transiciones_validas = [nombre for estado, nombre in ticket.get_transiciones_validas()]
            raise serializers.ValidationError(
                f"Transición inválida. El ticket en estado '{ticket.get_estado_display()}' "
                f"solo puede transicionar a: {', '.join(transiciones_validas)}"
            )
        
        return value
    
    def save(self):
        """Ejecuta la transición y crea comentario si se proporciona."""
        ticket = self.context['ticket']
        nuevo_estado = self.validated_data['nuevo_estado']
        comentario = self.validated_data.get('comentario', '').strip()
        
        try:
            # Realizar la transición
            ticket.transicionar_a(nuevo_estado)
            
            # Crear comentario automático de la transición
            Comment.objects.create(
                ticket=ticket,
                autor='Sistema',
                contenido=f"Estado cambiado a '{ticket.get_estado_display()}'"
            )
            
            # Crear comentario adicional si se proporcionó
            if comentario:
                Comment.objects.create(
                    ticket=ticket,
                    autor='Sistema',
                    contenido=comentario
                )
                
            return ticket
            
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))