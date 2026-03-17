from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DefectType, Device, ProcessPoint, ProcessPointType, SampleImage
from .serializers import (
	DefectTypeSerializer,
	DeviceSerializer,
	ProcessPointSerializer,
	ProcessPointTypeSerializer,
	SampleImageSerializer,
)
from .services import build_stats, compute_metrics, run_detection


class DeviceViewSet(viewsets.ModelViewSet):
	queryset = Device.objects.all().order_by('-created_at')
	serializer_class = DeviceSerializer


class ProcessPointTypeViewSet(viewsets.ModelViewSet):
	queryset = ProcessPointType.objects.all().order_by('name')
	serializer_class = ProcessPointTypeSerializer


class ProcessPointViewSet(viewsets.ModelViewSet):
	queryset = ProcessPoint.objects.all()
	serializer_class = ProcessPointSerializer

	def get_queryset(self):
		queryset = ProcessPoint.objects.select_related('device', 'point_type').order_by('device__name', 'name')
		device_id = self.request.query_params.get('device')
		point_type_id = self.request.query_params.get('point_type')
		if device_id:
			queryset = queryset.filter(device_id=device_id)
		if point_type_id:
			queryset = queryset.filter(point_type_id=point_type_id)
		return queryset


class DefectTypeViewSet(viewsets.ModelViewSet):
	queryset = DefectType.objects.all().order_by('name')
	serializer_class = DefectTypeSerializer


class SampleImageViewSet(viewsets.ModelViewSet):
	queryset = SampleImage.objects.all()
	serializer_class = SampleImageSerializer

	def get_queryset(self):
		queryset = SampleImage.objects.select_related('device', 'process_point', 'defect_type').order_by('-created_at')
		device_id = self.request.query_params.get('device')
		process_point_id = self.request.query_params.get('process_point')
		defect_type_id = self.request.query_params.get('defect_type')
		if device_id:
			queryset = queryset.filter(device_id=device_id)
		if process_point_id:
			queryset = queryset.filter(process_point_id=process_point_id)
		if defect_type_id:
			queryset = queryset.filter(defect_type_id=defect_type_id)
		return queryset


class DetectionAPIView(APIView):
	parser_classes = [MultiPartParser, FormParser]

	def post(self, request, *args, **kwargs):
		images = request.FILES.getlist('images')
		labels = request.FILES.getlist('labels')
		device_id = request.data.get('device')
		process_point_id = request.data.get('process_point')
		defect_type = request.data.get('defect_type') or '表面缺陷'
		test_mode_raw = request.data.get('test_mode', 'false')
		test_mode = str(test_mode_raw).lower() in {'1', 'true', 'yes'}

		results = run_detection(images, defect_type)
		stats = build_stats(results)
		metrics = compute_metrics(results, labels) if test_mode else None

		# 增加每张图片的真实标签和是否预测正确
		label_map = metrics['label_map'] if metrics and 'label_map' in metrics else {}
		import os
		def match_label(filename):
			base = os.path.splitext(filename)[0]
			for k, v in label_map.items():
				if os.path.splitext(k)[0] == base:
					return v
			return None
		for r in results:
			true_label = match_label(r['filename'])
			r['true_label'] = true_label
			r['is_correct'] = (str(r['output_value']) == str(true_label)) if true_label is not None else None

		payload = {
			'device': device_id,
			'process_point': process_point_id,
			'test_mode': test_mode,
			'defect_type': defect_type,
			'results': results,
			'stats': stats,
			'metrics': metrics,
		}
		return Response(payload)
