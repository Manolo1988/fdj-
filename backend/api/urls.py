from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DefectTypeViewSet,
    DetectionAPIView,
    DeviceViewSet,
    ProcessPointTypeViewSet,
    ProcessPointViewSet,
    SampleImageViewSet,
)

router = DefaultRouter()
router.register('devices', DeviceViewSet)
router.register('process-point-types', ProcessPointTypeViewSet)
router.register('process-points', ProcessPointViewSet, basename='process-points')
router.register('defect-types', DefectTypeViewSet)
router.register('samples', SampleImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('detect/', DetectionAPIView.as_view(), name='detect'),
]
