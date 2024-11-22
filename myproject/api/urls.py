from rest_framework.routers import DefaultRouter
from .views import AsicDeviceViewSet, AsicMetricViewSet

# Создаём роутер
router = DefaultRouter()
router.register(r'devices', AsicDeviceViewSet, basename='device')  # Маршрут для устройств
router.register(r'metrics', AsicMetricViewSet, basename='metric')  # Маршрут для метрик

# Экспортируем маршруты
urlpatterns = router.urls
