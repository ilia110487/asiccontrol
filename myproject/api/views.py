from datetime import timedelta
from django.utils.timezone import now
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AsicDevice, AsicMetric, AsicHashrate
from .serializers import AsicDeviceSerializer, AsicMetricSerializer
from .utils import fetch_miner_data  # Импортируем функцию для получения данных с майнеров


class AsicDeviceViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с ASIC-устройствами.
    """
    serializer_class = AsicDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только устройства, принадлежащие текущему пользователю.
        """
        return AsicDevice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании устройства автоматически связывает его с текущим пользователем.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def fetch_data(self, request, pk=None):
        """
        Получает данные с ASIC-устройства, сохраняет их в базе и возвращает.
        """
        try:
            # Получаем устройство по ID
            device = self.get_object()

            # Получаем данные с устройства
            miner_data = fetch_miner_data(
                url=device.ip,
                username=device.login,
                password=device.password
            )

            # Проверяем наличие ошибок
            if "error" in miner_data:
                return Response({"error": miner_data["error"]}, status=400)

            # Сохраняем метрики устройства
            AsicMetric.objects.create(device=device, data=miner_data)

            # Сохраняем хэшрейт
            hashrate_avg = miner_data.get("hashrate_avg", 0.0)
            try:
                hashrate_avg = float(hashrate_avg)
            except ValueError:
                hashrate_avg = 0.0  # Если значение некорректное, сохраняем как 0.0

            AsicHashrate.objects.create(device=device, hashrate=hashrate_avg)

            # Удаляем устаревшие записи хэшрейта (старше 24 часов)
            AsicHashrate.objects.filter(
                device=device,
                timestamp__lt=now() - timedelta(hours=24)
            ).delete()

            # Возвращаем свежие данные
            return Response(miner_data, status=200)

        except Exception as e:
            return Response({"error": f"Ошибка при получении данных: {str(e)}"}, status=500)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def hashrate_history(self, request, pk=None):
        """
        Возвращает историю хэшрейта устройства за последние 24 часа.
        """
        try:
            # Получаем устройство
            device = self.get_object()

            # Выбираем хэшрейт за последние 24 часа
            history = AsicHashrate.objects.filter(
                device=device,
                timestamp__gte=now() - timedelta(hours=24)
            ).order_by('timestamp')

            # Формируем данные для ответа
            data = [
                {"timestamp": record.timestamp, "hashrate": record.hashrate}
                for record in history
            ]

            return Response(data, status=200)

        except Exception as e:
            return Response({"error": f"Ошибка при получении истории хэшрейта: {str(e)}"}, status=500)


class AsicMetricViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с метриками ASIC-устройств.
    """
    serializer_class = AsicMetricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает метрики только для устройств, принадлежащих текущему пользователю.
        """
        return AsicMetric.objects.filter(device__user=self.request.user)
