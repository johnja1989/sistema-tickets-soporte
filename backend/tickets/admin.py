from django.contrib import admin
from django.utils.html import format_html
from .models import Ticket, Comment


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Ticket.
    Proporciona una interfaz administrativa completa.
    """
    
    list_display = [
        'id', 'titulo_truncado', 'estado_badge', 'prioridad_badge', 
        'solicitante', 'fecha_creacion', 'total_comentarios'
    ]
    list_filter = ['estado', 'prioridad', 'fecha_creacion']
    search_fields = ['titulo', 'descripcion', 'solicitante', 'email']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    ordering = ['-fecha_creacion']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'descripcion')
        }),
        ('Clasificación', {
            'fields': ('estado', 'prioridad')
        }),
        ('Solicitante', {
            'fields': ('solicitante', 'email')
        }),
        ('Metadatos', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    def titulo_truncado(self, obj):
        """Muestra el título truncado en la lista."""
        if len(obj.titulo) > 50:
            return obj.titulo[:50] + '...'
        return obj.titulo
    titulo_truncado.short_description = 'Título'
    
    def estado_badge(self, obj):
        """Muestra el estado como badge colorido."""
        colors = {
            'nuevo': 'blue',
            'en_proceso': 'orange', 
            'resuelto': 'green',
            'cerrado': 'gray'
        }
        color = colors.get(obj.estado, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 10px; font-size: 11px; font-weight: bold;">{}</span>',
            color, obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    
    def prioridad_badge(self, obj):
        """Muestra la prioridad como badge colorido."""
        colors = {
            'baja': 'green',
            'media': 'orange',
            'alta': 'red'
        }
        color = colors.get(obj.prioridad, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 10px; font-size: 11px; font-weight: bold;">{}</span>',
            color, obj.get_prioridad_display()
        )
    prioridad_badge.short_description = 'Prioridad'
    
    def total_comentarios(self, obj):
        """Muestra el total de comentarios."""
        count = obj.comentarios.count()
        return f"{count} comentario{'s' if count != 1 else ''}"
    total_comentarios.short_description = 'Comentarios'
    
    def get_queryset(self, request):
        """Optimiza las consultas para evitar N+1."""
        queryset = super().get_queryset(request)
        return queryset.prefetch_related('comentarios')


class CommentInline(admin.TabularInline):
    """Inline para mostrar comentarios en el admin de tickets."""
    model = Comment
    extra = 0
    readonly_fields = ['fecha_creacion']
    fields = ['autor', 'contenido', 'fecha_creacion']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Comment.
    """
    
    list_display = ['id', 'ticket_link', 'autor', 'contenido_truncado', 'fecha_creacion']
    list_filter = ['fecha_creacion', 'autor']
    search_fields = ['contenido', 'autor', 'ticket__titulo']
    readonly_fields = ['fecha_creacion']
    ordering = ['-fecha_creacion']
    
    def ticket_link(self, obj):
        """Muestra un enlace al ticket asociado."""
        return format_html(
            '<a href="/admin/tickets/ticket/{}/change/">Ticket #{} - {}</a>',
            obj.ticket.id, obj.ticket.id, obj.ticket.titulo[:30]
        )
    ticket_link.short_description = 'Ticket'
    
    def contenido_truncado(self, obj):
        """Muestra el contenido truncado."""
        if len(obj.contenido) > 100:
            return obj.contenido[:100] + '...'
        return obj.contenido
    contenido_truncado.short_description = 'Contenido'


# Agregar CommentInline al TicketAdmin
TicketAdmin.inlines = [CommentInline]