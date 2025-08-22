from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet

# Crear router para las APIs REST
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')

# URLs de la aplicación
urlpatterns = [
    path('api/', include(router.urls)),
]