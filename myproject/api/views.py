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
        Возвращает устройства, принадлежащие текущему пользователю.
        """
        return AsicDevice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Связывает создаваемое устройство с текущим пользователем.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def fetch_data(self, request, pk=None):
        """
        Получает данные с устройства, сохраняет их в базе и возвращает.
        """
        try:
            # Получаем устройство
            device = self.get_object()

            # Логируем параметры устройства
            print(f"Получение данных с устройства {device.ip} для пользователя {device.user}")

            # Получаем данные с устройства
            miner_data = fetch_miner_data(
                url=device.ip,
                username=device.login,
                password=device.password
            )

            # Логируем полученные данные
            print(f"Данные, полученные с устройства {device.ip}: {miner_data}")

            if "error" in miner_data:
                print(f"Ошибка при получении данных: {miner_data['error']}")
                return Response({"error": miner_data["error"]}, status=400)

            # Сохранение метрик устройства
            AsicMetric.objects.create(device=device, data=miner_data)

            # Извлечение и преобразование среднего хэшрейта
            stats = miner_data.get("STATS", [])
            if stats and isinstance(stats, list):
                hashrate_avg = stats[0].get("rate_avg", 0.0)
            else:
                hashrate_avg = 0.0

            try:
                hashrate_avg = float(hashrate_avg)
            except (ValueError, TypeError):
                print(f"Некорректное значение хэшрейта: {hashrate_avg}. Сохранение как 0.0")
                hashrate_avg = 0.0

            # Сохранение хэшрейта
            print(f"Сохраняем хэшрейт {hashrate_avg} для устройства {device}")
            AsicHashrate.objects.create(device=device, hashrate=hashrate_avg)

            # Удаление устаревших данных
            deleted_count, _ = AsicHashrate.objects.filter(
                device=device,
                timestamp__lt=now() - timedelta(hours=24)
            ).delete()
            print(f"Удалено {deleted_count} устаревших записей хэшрейта")

            return Response(miner_data, status=200)

        except Exception as e:
            print(f"Ошибка при обработке устройства {device.ip}: {str(e)}")
            return Response({"error": f"Ошибка при получении данных: {str(e)}"}, status=500)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def hashrate_history(self, request, pk=None):
        """
        Возвращает историю хэшрейта за последние 24 часа.
        """
        try:
            device = self.get_object()

            # Получение данных хэшрейта за последние 24 часа
            history = AsicHashrate.objects.filter(
                device=device,
                timestamp__gte=now() - timedelta(hours=24)
            ).order_by('timestamp')

            if not history.exists():
                print(f"Нет данных хэшрейта за последние 24 часа для устройства {device}")
                return Response([], status=200)

            data = [
                {"timestamp": record.timestamp, "hashrate": record.hashrate}
                for record in history
            ]
            return Response(data, status=200)

        except Exception as e:
            print(f"Ошибка при получении истории хэшрейта: {str(e)}")
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
