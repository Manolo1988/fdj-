from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self) -> None:
        post_migrate.connect(seed_defect_types, sender=self)


def seed_defect_types(**_kwargs: object) -> None:
    from .models import DefectType

    defaults = ['正常', '锁丝方向', '箭头方向']
    for name in defaults:
        DefectType.objects.get_or_create(name=name)
