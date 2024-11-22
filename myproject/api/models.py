from django.db import models
from django.contrib.auth.models import User  # Для связи с пользователями

# Модель для хранения информации об ASIC-устройствах
class AsicDevice(models.Model):
    TYPE_CHOICES = [
        ('antminer', 'Antminer'),
        ('wotsminer', 'Wotsminer'),
        # Добавьте другие типы устройств, если необходимо
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="devices")
    ip = models.URLField(max_length=200)  # IP-адрес устройства
    login = models.CharField(max_length=50)  # Логин для доступа к устройству
    password = models.CharField(max_length=50)  # Пароль для доступа к устройству
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)  # Тип устройства (Antminer, Wotsminer)
    created_at = models.DateTimeField(auto_now_add=True)  # Время добавления устройства

    def __str__(self):
        return f"{self.type} ({self.ip})"

# Модель для хранения метрик ASIC-устройства
class AsicMetric(models.Model):
    device = models.ForeignKey(AsicDevice, on_delete=models.CASCADE, related_name="metrics")
    timestamp = models.DateTimeField(auto_now_add=True)  # Время получения метрик
    data = models.JSONField()  # Хранение всех метрик в формате JSON

    def __str__(self):
        return f"Metrics for {self.device.ip} at {self.timestamp}"
