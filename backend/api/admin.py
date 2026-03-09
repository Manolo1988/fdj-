from django.contrib import admin

from .models import DefectType, Device, ProcessPoint, ProcessPointType, SampleImage


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
	list_display = ('name', 'created_at')
	search_fields = ('name',)


@admin.register(ProcessPointType)
class ProcessPointTypeAdmin(admin.ModelAdmin):
	list_display = ('name',)
	search_fields = ('name',)


@admin.register(ProcessPoint)
class ProcessPointAdmin(admin.ModelAdmin):
	list_display = ('name', 'device', 'point_type', 'created_at')
	list_filter = ('device', 'point_type')
	search_fields = ('name', 'device__name')


@admin.register(DefectType)
class DefectTypeAdmin(admin.ModelAdmin):
	list_display = ('name', 'is_active', 'created_at')
	list_filter = ('is_active',)
	search_fields = ('name',)


@admin.register(SampleImage)
class SampleImageAdmin(admin.ModelAdmin):
	list_display = ('id', 'device', 'process_point', 'defect_type', 'created_at')
	list_filter = ('device', 'defect_type')
	search_fields = ('id',)
