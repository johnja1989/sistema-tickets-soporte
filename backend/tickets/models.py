from django.db import models
from django.core.exceptions import ValidationError


class Ticket(models.Model):
    """
    Modelo para representar un ticket de soporte.
    Maneja el flujo de estados y las transiciones válidas.
    """
    
    # Opciones de prioridad
    PRIORITY_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
    ]
    
    # Estados del ticket y flujo
    STATUS_CHOICES = [
        ('nuevo', 'Nuevo'),
        ('en_proceso', 'En Proceso'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado'),
    ]
    
    # Transiciones válidas del flujo
    VALID_TRANSITIONS = {
        'nuevo': ['en_proceso'],
        'en_proceso': ['resuelto', 'nuevo'],  # Permite retrabajo
        'resuelto': ['cerrado'],
        'cerrado': [],  # Estado final
    }
    
    # Campos del modelo
    titulo = models.CharField(max_length=200, help_text="Título descriptivo del problema")
    descripcion = models.TextField(help_text="Descripción detallada del problema")
    prioridad = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='media',
        help_text="Nivel de prioridad del ticket"
    )
    solicitante = models.CharField(max_length=100, help_text="Nombre de quien reporta el problema")
    email = models.EmailField(blank=True, null=True, help_text="Email del solicitante (opcional)")
    estado = models.CharField(
        max_length=15, 
        choices=STATUS_CHOICES, 
        default='nuevo',
        help_text="Estado actual del ticket"
    )
    
    # Timestamps automáticos
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fecha_creacion']  # Más recientes primero
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
    
    def __str__(self):
        return f"#{self.id} - {self.titulo} ({self.get_estado_display()})"
    
    def puede_transicionar_a(self, nuevo_estado):
        """
        Verifica si el ticket puede transicionar al nuevo estado.
        
        Args:
            nuevo_estado (str): Estado destino
            
        Returns:
            bool: True si la transición es válida
        """
        estados_validos = self.VALID_TRANSITIONS.get(self.estado, [])
        return nuevo_estado in estados_validos
    
    def transicionar_a(self, nuevo_estado):
        """
        Cambia el estado del ticket validando el flujo.
        
        Args:
            nuevo_estado (str): Estado destino
            
        Raises:
            ValidationError: Si la transición no es válida
        """
        if not self.puede_transicionar_a(nuevo_estado):
            raise ValidationError(
                f"No se puede cambiar de '{self.get_estado_display()}' "
                f"a '{dict(self.STATUS_CHOICES)[nuevo_estado]}'. "
                f"Transiciones válidas: {self.get_transiciones_validas()}"
            )
        
        self.estado = nuevo_estado
        self.save(update_fields=['estado', 'fecha_actualizacion'])
    
    def get_transiciones_validas(self):
        """
        Obtiene los estados a los que puede transicionar el ticket.
        
        Returns:
            list: Lista de tuplas (estado, nombre_display)
        """
        estados_validos = self.VALID_TRANSITIONS.get(self.estado, [])
        return [
            (estado, dict(self.STATUS_CHOICES)[estado]) 
            for estado in estados_validos
        ]
    
    def get_priority_color(self):
        """Retorna color CSS para la prioridad."""
        colors = {
            'baja': 'green',
            'media': 'yellow', 
            'alta': 'red'
        }
        return colors.get(self.prioridad, 'gray')
    
    def get_status_color(self):
        """Retorna color CSS para el estado."""
        colors = {
            'nuevo': 'blue',
            'en_proceso': 'yellow',
            'resuelto': 'green', 
            'cerrado': 'gray'
        }
        return colors.get(self.estado, 'gray')


class Comment(models.Model):
    """
    Modelo para comentarios asociados a un ticket.
    Mantiene historial cronológico de seguimiento.
    """
    
    ticket = models.ForeignKey(
        Ticket, 
        on_delete=models.CASCADE, 
        related_name='comentarios',
        help_text="Ticket al que pertenece el comentario"
    )
    autor = models.CharField(max_length=100, help_text="Nombre del autor del comentario")
    contenido = models.TextField(help_text="Contenido del comentario")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['fecha_creacion']  # Cronológico ascendente
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
    
    def __str__(self):
        return f"Comentario de {self.autor} en ticket #{self.ticket.id}"