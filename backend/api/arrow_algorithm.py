# backend/api/arrow_algorithm.py
import os
import math
import numpy as np
import cv2
import logging
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# 1. 全局加载模型（在这个文件被引入时加载一次，绝不影响别人）
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'arrow_model.pt')

yolo_model = None
try:
    if os.path.exists(MODEL_PATH):
        print(f"👉 正在加载模型，路径: {MODEL_PATH}") # 新增这行
        yolo_model = YOLO(MODEL_PATH)
        logger.info("箭头检测 YOLO 模型加载成功！")
        print("✅ 模型加载成功！") # 新增这行
    else:
        print(f"❌ 错误：在路径 {MODEL_PATH} 下找不到模型文件！") # 重点在这里！
except Exception as e:
    print(f"❌ 严重错误：模型加载抛出异常: {e}") # 重点在这里！
    logger.error(f"箭头检测模型加载异常: {e}")

# 2. 你的数学计算函数
def calculate_angle(tail, head):
    x1, y1 = tail
    x2, y2 = head
    # 修正：y轴取反，保证左右不变，上下方向正确
    return math.degrees(math.atan2(-(y2 - y1), x2 - x1))


def determine_direction_id(angle: float) -> int:
    # 标准8方向分区，单位为度，向右为0°，逆时针为正
    # 0: 向右, 1: 右上, 2: 向上, 3: 左上, 4: 向左, 5: 左下, 6: 向下, 7: 右下
    # 分界点为±22.5°、±67.5°、±112.5°、±157.5°
    if -22.5 < angle <= 22.5:
        return 0  # 向右
    elif 22.5 < angle <= 67.5:
        return 1  # 右上
    elif 67.5 < angle <= 112.5:
        return 2  # 向上
    elif 112.5 < angle <= 157.5:
        return 3  # 左上
    elif angle > 157.5 or angle <= -157.5:
        return 4  # 向左
    elif -157.5 < angle <= -112.5:
        return 5  # 左下
    elif -112.5 < angle <= -67.5:
        return 6  # 向下
    elif -67.5 < angle <= -22.5:
        return 7  # 右下
    return -1


# 3. 提供给外部的核心处理逻辑
def process_arrow_image(image_file: object) -> int:
    """处理图片并返回方向 ID"""
    if yolo_model is None:
        return -1

    try:
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if frame is None: return -1

        results = yolo_model(source=frame, conf=0.1, iou=0.5, agnostic_nms=True, verbose=False)

        for result in results:
            if result.keypoints is None or result.keypoints.data is None: continue
            keypoints = result.keypoints.data.cpu().numpy()
            for kp in keypoints:
                if len(kp) < 2: continue
                tail_point, tail_conf = kp[0][:2], kp[0][2]
                head_point, head_conf = kp[1][:2], kp[1][2]

                if tail_conf < 0.1 or head_conf < 0.1: continue

                angle = calculate_angle(tail_point, head_point)
                direction_id = determine_direction_id(angle)
                if direction_id != -1: return direction_id
        return -1
    except Exception as e:
        logger.error(f"箭头检测出错: {e}")
        return -1
    finally:
        if hasattr(image_file, 'seek'):
            image_file.seek(0)