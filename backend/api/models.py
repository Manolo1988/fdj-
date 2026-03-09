from django.db import models


class Device(models.Model):
	name = models.CharField(max_length=120, unique=True)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return self.name


class ProcessPointType(models.Model):
	name = models.CharField(max_length=120, unique=True)
	description = models.TextField(blank=True)

	def __str__(self) -> str:
		return self.name


class ProcessPoint(models.Model):
	device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='process_points')
	name = models.CharField(max_length=120)
	point_type = models.ForeignKey(
		ProcessPointType,
		on_delete=models.SET_NULL,
		related_name='process_points',
		null=True,
		blank=True,
	)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('device', 'name')

	def __str__(self) -> str:
		return f"{self.device.name} - {self.name}"


class DefectType(models.Model):
	name = models.CharField(max_length=120, unique=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return self.name


class SampleImage(models.Model):
	device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True)
	process_point = models.ForeignKey(ProcessPoint, on_delete=models.SET_NULL, null=True, blank=True)
	defect_type = models.ForeignKey(DefectType, on_delete=models.SET_NULL, null=True, blank=True)
	image = models.ImageField(upload_to='samples/images/')
	label_file = models.FileField(upload_to='samples/labels/', null=True, blank=True)
	notes = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"Sample {self.id}"
