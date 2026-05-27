"""
얼굴 들어간 아이콘 PNG 변환:
  - 외곽선(가장 큰 검정 덩어리) → 흰색
  - 내부 흰색 → 투명 (배경색 비치게)
  - 눈·입(작은 검정 덩어리) → 검정 유지 (얼굴 살아남)
  - 분홍 볼 → 그대로

실행:
  DYLD_LIBRARY_PATH=/usr/local/lib /tmp/linka-ppt/bin/python assets/icons-faces/transform_to_white.py

입력:  assets/icons-faces/{helper,cooking,...}.png   (영문 이름 8개)
출력:  assets/icons-faces/white/{...}.png
"""
import os
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_dilation

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "white")

FILES = [
    "helper.png",
    "cooking.png",
    "cleaning.png",
    "childcare.png",
    "driver_designated.png",
    "driver_daily.png",
    "errand.png",
    "more.png",
]

# 임계값
DARK_THRESHOLD  = 100   # R, G, B 모두 이 값 미만이면 "검정"
WHITE_THRESHOLD = 220   # R, G, B 모두 이 값 이상이면 "흰색"

# 분홍 볼 검출 (R 높음, G·B 중간)
PINK_R_MIN, PINK_R_MAX = 220, 255
PINK_G_MIN, PINK_G_MAX = 130, 220
PINK_B_MIN, PINK_B_MAX = 140, 230

# 얼굴 zone 확장 (볼 bbox 기준 픽셀 단위 마진)
FACE_MARGIN_TOP    = 200   # 볼 위로 (눈이 있을 영역)
FACE_MARGIN_BOTTOM = 80    # 볼 아래로 (입이 약간 더 아래일 수도)
FACE_MARGIN_X      = 100   # 좌우 (입이 좌우로 약간 길 수도)

# 얼굴 디테일 최대 크기 — 이보다 큰 dark 컴포넌트는 face zone 안이어도 외곽선으로 간주
# (예: 더보기 아이콘의 큰 점들은 38656 px → outline)
FEATURE_MAX_SIZE = 20000


def transform(in_path: str, out_path: str):
    img = Image.open(in_path).convert("RGBA")
    arr = np.array(img)
    H, W = arr.shape[:2]

    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # 1. 마스크들
    dark_mask  = (r < DARK_THRESHOLD)  & (g < DARK_THRESHOLD)  & (b < DARK_THRESHOLD)  & (a > 0)
    white_mask = (r > WHITE_THRESHOLD) & (g > WHITE_THRESHOLD) & (b > WHITE_THRESHOLD) & (a > 0)
    # 분홍 볼: R 매우 높음 + R이 G보다 40 이상 높음 (회색·흰색 제외)
    # 볼은 반투명으로 그려진 경우가 많아 alpha 임계는 낮게 (a > 50)
    pink_mask = (
        (r >= 240)
        & (r.astype(int) - g.astype(int) >= 40)
        & (r.astype(int) - b.astype(int) >= 20)
        & (g >= 130)
        & (b >= 130)
        & (a > 50)
    )

    # 2. 분홍 볼 bbox → 얼굴 zone 정의
    if pink_mask.any():
        ys, xs = np.where(pink_mask)
        y_min, y_max = int(ys.min()), int(ys.max())
        x_min, x_max = int(xs.min()), int(xs.max())
        face_y_min = max(0, y_min - FACE_MARGIN_TOP)
        face_y_max = min(H, y_max + FACE_MARGIN_BOTTOM)
        face_x_min = max(0, x_min - FACE_MARGIN_X)
        face_x_max = min(W, x_max + FACE_MARGIN_X)
        face_zone = np.zeros_like(dark_mask, dtype=bool)
        face_zone[face_y_min:face_y_max, face_x_min:face_x_max] = True
    else:
        # 볼 없으면 작은 컴포넌트만 보존 (fallback)
        face_zone = None

    # 3. 검정 컴포넌트 분석
    labeled, num = label(dark_mask)
    if num == 0:
        print(f"  ⚠️ {in_path}: 검정 픽셀 없음. 스킵.")
        return

    # 4. 각 컴포넌트가 face zone 안에 들어가면 얼굴 디테일, 아니면 외곽선
    outline_labels = []
    feature_labels = []
    for i in range(1, num + 1):
        comp_mask = (labeled == i)
        if face_zone is not None:
            in_zone = (comp_mask & face_zone).sum()
            total   = comp_mask.sum()
            # 얼굴 디테일 조건: face zone 안 70%+ AND size 작음
            if total > 0 and in_zone / total > 0.7 and total < FEATURE_MAX_SIZE:
                feature_labels.append(i)
                continue
        outline_labels.append(i)

    outline_mask = np.isin(labeled, outline_labels) if outline_labels else np.zeros_like(dark_mask)

    print(f"    components: {num}개, 외곽선/장식 {len(outline_labels)}개, 얼굴 디테일 {len(feature_labels)}개")

    # 5. 변환
    out = arr.copy()
    out[outline_mask] = [255, 255, 255, 255]    # 외곽선 → 흰색
    out[white_mask]   = [255, 255, 255, 0]      # 흰색 → 투명
    # 얼굴 디테일, 분홍 볼은 그대로

    result = Image.fromarray(out, mode="RGBA")
    result.save(out_path, "PNG")
    print(f"  saved  {os.path.basename(out_path)}")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for filename in FILES:
        in_path = os.path.join(HERE, filename)
        out_path = os.path.join(OUT_DIR, filename)
        if not os.path.exists(in_path):
            print(f"  ⚠️ 입력 파일 없음: {in_path}")
            continue
        transform(in_path, out_path)
    print(f"\nDone. 출력: {OUT_DIR}")


if __name__ == "__main__":
    main()
