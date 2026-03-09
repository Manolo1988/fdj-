from __future__ import annotations

from collections import Counter
from typing import Iterable


def detect_surface_defect(image_file: object) -> str:
    """Stub: return a mask identifier for surface defect segmentation."""
    filename = getattr(image_file, 'name', 'unknown')
    return f"mask://surface/{filename}"


def detect_screw_direction(image_file: object) -> int:
    """Stub: return 0 or 1 for screw direction classification."""
    return 1


def detect_missing_part(image_file: object) -> str:
    """Stub: return a mask identifier for missing part segmentation."""
    filename = getattr(image_file, 'name', 'unknown')
    return f"mask://missing/{filename}"


def detect_arrow_direction(image_file: object) -> int:
    """Stub: return an int class id for arrow direction."""
    return 0


DETECTION_HANDLERS = {
    '表面缺陷': ('mask', detect_surface_defect),
    '锁丝方向': ('binary', detect_screw_direction),
    '零件缺失': ('mask', detect_missing_part),
    '箭头方向': ('int', detect_arrow_direction),
}


def run_detection(image_files: Iterable[object], defect_type: str) -> list[dict]:
    """Route detection logic by defect type and return per-image outputs."""
    output_type, handler = DETECTION_HANDLERS.get(defect_type, ('unknown', detect_surface_defect))
    results = []
    for index, image_file in enumerate(image_files):
        filename = getattr(image_file, 'name', 'unknown')
        output_value = handler(image_file)
        status = '缺陷'
        results.append({
            'index': index,
            'filename': filename,
            'status': status,
            'defect_type': defect_type,
            'output_type': output_type,
            'output_value': output_value,
            'preview_url': None,
        })
    return results


def compute_metrics(results: list[dict], labels: Iterable[object] | None) -> dict | None:
    """Stub metrics logic. Replace this with real evaluation."""
    if not labels:
        return None
    return {
        'accuracy': 0.0,
        'precision': 0.0,
        'recall': 0.0,
    }


def build_stats(results: list[dict]) -> dict:
    total = len(results)
    by_defect = Counter(result.get('defect_type', '未知') for result in results)
    normal_count = by_defect.get('正常', 0)
    defect_count = total - normal_count
    return {
        'total': total,
        'normal': normal_count,
        'defects': defect_count,
        'by_defect': dict(by_defect),
    }
