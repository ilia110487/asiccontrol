from rest_framework import serializers
from .models import AsicDevice, AsicMetric

# Сериализатор для ASIC-устройств
class AsicDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsicDevice
        fields = ['id', 'user', 'ip', 'login', 'password', 'type',  'fan_count', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

# Сериализатор для ASIC-метрик
class AsicMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsicMetric
        fields = ['id', 'device', 'timestamp', 'data']
        read_only_fields = ['id', 'timestamp']
class AsicDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsicDevice
        fields = ['id', 'user', 'ip', 'login', 'password', 'type', 'fan_count', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_type(self, value):
        allowed_types = ['antminer', 'whatsminer']
        if value not in allowed_types:
            raise serializers.ValidationError(f"Недопустимый тип устройства: {value}")
        return value
