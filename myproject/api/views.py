from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AsicDevice, AsicMetric
from .serializers import AsicDeviceSerializer, AsicMetricSerializer
from .utils import fetch_miner_data  # Импортируем функцию для получения данных с майнеров

# ViewSet для ASIC-устройств
class AsicDeviceViewSet(viewsets.ModelViewSet):
    serializer_class = AsicDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Возвращаем только устройства, принадлежащие текущему пользователю
        return AsicDevice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # При создании устройства добавляем текущего пользователя
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def fetch_data(self, request, pk=None):
        """
        Пользовательский метод для получения данных с конкретного устройства.
        """
        try:
            # Получаем устройство по ID
            device = self.get_object()

            # Используем fetch_miner_data для получения данных
            miner_data = fetch_miner_data(
                url=device.ip,
                username=device.login,
                password=device.password
            )

            if "error" in miner_data:
                return Response({"error": miner_data["error"]}, status=400)

            return Response(miner_data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# ViewSet для ASIC-метрик
class AsicMetricViewSet(viewsets.ModelViewSet):
    serializer_class = AsicMetricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Возвращаем метрики только для устройств текущего пользователя
        return AsicMetric.objects.filter(device__user=self.request.user)
