from rest_framework import serializers

from .models import DefectType, Device, ProcessPoint, ProcessPointType, SampleImage


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProcessPointTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessPointType
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class ProcessPointSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    point_type_name = serializers.CharField(source='point_type.name', read_only=True)

    class Meta:
        model = ProcessPoint
        fields = [
            'id',
            'device',
            'device_name',
            'name',
            'point_type',
            'point_type_name',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'device_name', 'point_type_name']


class DefectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefectType
        fields = ['id', 'name', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class SampleImageSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    process_point_name = serializers.CharField(source='process_point.name', read_only=True)
    defect_type_name = serializers.CharField(source='defect_type.name', read_only=True)

    class Meta:
        model = SampleImage
        fields = [
            'id',
            'device',
            'device_name',
            'process_point',
            'process_point_name',
            'defect_type',
            'defect_type_name',
            'image',
            'label_file',
            'notes',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'device_name',
            'process_point_name',
            'defect_type_name',
        ]
