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

from .arrow_algorithm import process_arrow_image
def detect_arrow_direction(image_file: object) -> int:
    # 只调用 arrow_algorithm 里的处理逻辑，不直接访问 yolo_model
    return process_arrow_image(image_file)



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
    """
    计算准确率等指标，labels 支持 CSV/JSON 文件，按文件名或顺序与 results 匹配。
    labels: Iterable[UploadedFile]，每个文件名与图片名对应，内容为真实标签。
    """
    import csv, json
    if not labels or not results:
        return None

    # 1. 读取所有label文件内容，支持csv/json，返回 {filename: label}
    label_map = {}

    from .arrow_algorithm import calculate_angle, determine_direction_id
    for label_file in labels:
        name = getattr(label_file, 'name', None)
        try:
            content = label_file.read().decode('utf-8')
            label_file.seek(0)
            lines = [l for l in content.splitlines() if l.strip()]
            if lines:
                # 只取第一行（如有多行可扩展）
                parts = lines[0].strip().split()
                # 兼容格式：类别 cx cy w h tail_x tail_y tail_conf head_x head_y head_conf
                if len(parts) >= 11:
                    tail_x = float(parts[5])
                    tail_y = float(parts[6])
                    head_x = float(parts[8])
                    head_y = float(parts[9])
                    # 计算方向角度
                    angle = calculate_angle((tail_x, tail_y), (head_x, head_y))
                    direction_id = determine_direction_id(angle)
                    label_map[name] = str(direction_id)
                else:
                    # 其它格式兼容原有逻辑
                    label_map[name] = parts[-1] if parts else ''
        except Exception as e:
            continue

    # 2. 统计准确率
    total = 0
    correct = 0
    y_true = []
    y_pred = []

    import os
    def match_label(filename):
        # 只比对主文件名（不含扩展名）
        base = os.path.splitext(filename)[0]
        for k, v in label_map.items():
            if os.path.splitext(k)[0] == base:
                return v
        return None

    for result in results:
        fname = result.get('filename')
        pred = str(result.get('output_value'))
        label = match_label(fname)
        if label is not None:
            total += 1
            y_true.append(str(label))
            y_pred.append(pred)
            if pred == str(label):
                correct += 1

    accuracy = correct / total if total else 0.0
    # 可选：precision/recall 仅二分类时
    precision = recall = 0.0
    if total and len(set(y_true)) <= 2:
        tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp and yp == '1')
        fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt != yp and yp == '1')
        fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt != yp and yp == '0')
        precision = tp / (tp + fp) if (tp + fp) else 0.0
        recall = tp / (tp + fn) if (tp + fn) else 0.0

    # 调试信息，便于前端排查
    return {
        'accuracy': round(accuracy, 4),
        'precision': round(precision, 4),
        'recall': round(recall, 4),
        'total': total,
        'correct': correct,
        'label_map': label_map,   # 新增，label文件解析结果
        'y_true': y_true,         # 新增，标签列表
        'y_pred': y_pred,         # 新增，预测列表
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
