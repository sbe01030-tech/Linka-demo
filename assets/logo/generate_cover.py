"""
Linka 커버 이미지 (Tally 폼 상단 배너용).
- 4:1 비율, 1920x480 (모바일 크롭에도 안전한 중앙 정렬)
- 4x 슈퍼샘플링으로 고화질
- 3가지 스타일 변형

실행: /tmp/linka-ppt/bin/python assets/logo/generate_cover.py
"""
from PIL import Image, ImageDraw, ImageFont
import os
import math

# 색상
BRAND_GREEN_RGB = (0, 200, 83)
DARK_NAVY_RGB   = (26, 26, 46)
WHITE_RGB       = (255, 255, 255)
PINK_RGB_ALPHA  = (255, 179, 198, 128)
SOFT_GRAY       = (108, 117, 125)

FONT_PATH = "/tmp/Nunito-Variable.ttf"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# 슈퍼샘플링 배율
SS = 3


def _font(size, weight=900):
    f = ImageFont.truetype(FONT_PATH, size)
    try:
        f.set_variation_by_axes([weight])
    except (AttributeError, OSError):
        pass
    return f


def draw_mascot(draw, cx, cy, size, fill=WHITE_RGB, outline=DARK_NAVY_RGB):
    """마스코트 얼굴. fill 파라미터로 얼굴색 변경 가능."""
    s = size / 36.0

    def p(x, y):
        return (cx + (x - 18) * s, cy + (y - 16) * s)

    def r(rad):
        return rad * s

    head_r = r(14)
    draw.ellipse(
        [cx - head_r, cy - head_r, cx + head_r, cy + head_r],
        fill=fill,
        outline=outline,
        width=max(1, int(s * 1.2)),
    )
    for cx_v in (9, 27):
        cc = p(cx_v, 19)
        draw.ellipse(
            [cc[0] - r(3.5), cc[1] - r(2),
             cc[0] + r(3.5), cc[1] + r(2)],
            fill=PINK_RGB_ALPHA,
        )
    for ex, hx in ((13, 14.2), (23, 24.2)):
        ec = p(ex, 15)
        eye_r = r(3)
        draw.ellipse(
            [ec[0] - eye_r, ec[1] - eye_r,
             ec[0] + eye_r, ec[1] + eye_r],
            fill=outline,
        )
        hc = p(hx, 13.5)
        h_r = r(1.2)
        draw.ellipse(
            [hc[0] - h_r, hc[1] - h_r,
             hc[0] + h_r, hc[1] + h_r],
            fill=fill,
        )
    draw.arc(
        [cx - r(4), cy + r(3),
         cx + r(4), cy + r(7.5)],
        start=20, end=160,
        fill=outline,
        width=max(1, int(s * 1.5)),
    )


# ──────────────────────────────────────────────
def cover_a_brand(filename="linka_cover_a_brand.png"):
    """A: 그린 배경 + 흰 마스코트 + 'Linka' 텍스트 + 부제."""
    W, H = 1920 * SS, 480 * SS
    img = Image.new("RGB", (W, H), BRAND_GREEN_RGB)
    draw = ImageDraw.Draw(img, "RGBA")

    # 마스코트 (왼쪽)
    face_size = int(H * 0.55)
    face_cx = W * 0.32
    face_cy = H / 2
    draw_mascot(draw, face_cx, face_cy, face_size,
                fill=WHITE_RGB, outline=DARK_NAVY_RGB)

    # 'Linka' 텍스트 (오른쪽)
    text_x = W * 0.42
    title_font = _font(int(H * 0.55))
    title_text = "Linka"
    bbox = title_font.getbbox(title_text)
    th = bbox[3] - bbox[1]
    title_y = H * 0.30 - bbox[1]
    draw.text((text_x, title_y), title_text, font=title_font, fill=WHITE_RGB)

    # 부제 (아래)
    sub_font = _font(int(H * 0.10), weight=700)
    sub_text = "Koneksi kecil. Dunia yang hangat."
    sbbox = sub_font.getbbox(sub_text)
    sub_y = title_y + th + bbox[1] + int(H * 0.04)
    draw.text((text_x, sub_y), sub_text, font=sub_font, fill=WHITE_RGB)

    # 영어 부제
    eng_font = _font(int(H * 0.08), weight=600)
    eng_text = "Small links. Warmer world."
    eng_y = sub_y + (sbbox[3] - sbbox[1]) + int(H * 0.025)
    draw.text((text_x, eng_y), eng_text, font=eng_font,
              fill=(255, 255, 255, 200))

    img = img.resize((W // SS, H // SS), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  {filename}  ({W//SS}x{H//SS})")


def cover_b_circles(filename="linka_cover_b_circles.png"):
    """B: 그린 + 데코 원 (스플래시 스타일) + 중앙 'Linka'."""
    W, H = 1920 * SS, 480 * SS
    img = Image.new("RGB", (W, H), BRAND_GREEN_RGB)
    draw = ImageDraw.Draw(img, "RGBA")

    # 데코 원 — 윤곽선만 (흰색 반투명)
    decos = [
        (W * 0.08, H * 0.20, H * 0.65, 3),
        (W * 0.12, H * 0.95, H * 0.40, 2.5),
        (W * 0.92, H * 0.10, H * 0.55, 3),
        (W * 0.95, H * 0.85, H * 0.30, 2.5),
        (W * 0.40, H * -0.20, H * 0.45, 2),
        (W * 0.65, H * 1.10, H * 0.42, 2),
    ]
    for cx, cy, rr, lw in decos:
        draw.ellipse(
            [cx - rr, cy - rr, cx + rr, cy + rr],
            outline=(255, 255, 255, 60),
            width=int(lw * SS),
        )

    # 'Linka' 중앙 (큰)
    title_font = _font(int(H * 0.65))
    title_text = "Linka"
    bbox = title_font.getbbox(title_text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (W - tw) / 2 - bbox[0]
    ty = (H - th) / 2 - bbox[1] - int(H * 0.04)
    draw.text((tx, ty), title_text, font=title_font, fill=WHITE_RGB)

    # 부제
    sub_font = _font(int(H * 0.10), weight=700)
    sub_text = "Koneksi kecil. Dunia yang hangat. · Small links. Warmer world."
    sbbox = sub_font.getbbox(sub_text)
    sub_y = ty + th + bbox[1] + int(H * 0.04)
    sub_x = (W - (sbbox[2] - sbbox[0])) / 2 - sbbox[0]
    draw.text((sub_x, sub_y), sub_text, font=sub_font, fill=(255, 255, 255, 230))

    img = img.resize((W // SS, H // SS), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  {filename}  ({W//SS}x{H//SS})")


def cover_c_light(filename="linka_cover_c_light.png"):
    """C: 흰 배경 + 그린 마스코트 액센트 + 그린 'Linka' 텍스트 (밝고 깔끔)."""
    W, H = 1920 * SS, 480 * SS
    img = Image.new("RGB", (W, H), WHITE_RGB)
    draw = ImageDraw.Draw(img, "RGBA")

    # 옅은 그린 데코 원 (배경 액센트)
    accent_alpha = (0, 200, 83, 30)
    draw.ellipse(
        [W * 0.85, -H * 0.5, W * 1.15, H * 1.5],
        fill=accent_alpha,
    )
    draw.ellipse(
        [-W * 0.05, H * 0.7, W * 0.10, H * 1.4],
        fill=accent_alpha,
    )

    # 마스코트 (왼쪽)
    face_size = int(H * 0.55)
    face_cx = W * 0.20
    face_cy = H / 2
    draw_mascot(draw, face_cx, face_cy, face_size,
                fill=WHITE_RGB, outline=DARK_NAVY_RGB)

    # 'Linka' 그린
    text_x = W * 0.30
    title_font = _font(int(H * 0.55))
    title_text = "Linka"
    bbox = title_font.getbbox(title_text)
    th = bbox[3] - bbox[1]
    title_y = H * 0.27 - bbox[1]
    draw.text((text_x, title_y), title_text, font=title_font,
              fill=BRAND_GREEN_RGB)

    # 부제 (다크네이비)
    sub_font = _font(int(H * 0.11), weight=700)
    sub_text = "Bergabunglah dengan Linka."
    sbbox = sub_font.getbbox(sub_text)
    sub_y = title_y + th + bbox[1] + int(H * 0.05)
    draw.text((text_x, sub_y), sub_text, font=sub_font, fill=DARK_NAVY_RGB)

    # 영어 부제
    eng_font = _font(int(H * 0.085), weight=600)
    eng_text = "Join Linka. Your work, trusted."
    eng_y = sub_y + (sbbox[3] - sbbox[1]) + int(H * 0.025)
    draw.text((text_x, eng_y), eng_text, font=eng_font, fill=SOFT_GRAY)

    img = img.resize((W // SS, H // SS), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  {filename}  ({W//SS}x{H//SS})")


def cover_d_minimal(filename="linka_cover_d_minimal.png"):
    """D: 그린 배경 + 가운데 흰 'Linka' (가장 미니멀)."""
    W, H = 1920 * SS, 480 * SS
    img = Image.new("RGB", (W, H), BRAND_GREEN_RGB)
    draw = ImageDraw.Draw(img, "RGBA")

    title_font = _font(int(H * 0.50))
    title_text = "Linka"
    bbox = title_font.getbbox(title_text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (W - tw) / 2 - bbox[0]
    ty = (H - th) / 2 - bbox[1]
    draw.text((tx, ty), title_text, font=title_font, fill=WHITE_RGB)

    img = img.resize((W // SS, H // SS), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  {filename}  ({W//SS}x{H//SS})")


def cover_e_splash(filename="linka_cover_e_splash.png"):
    """E: 그린 배경 + 스플래시 스타일 흰 원 + 연결선 + 가운데 'Linka'.

    SplashScreen.tsx 의 NODES + EDGES 컨셉을 와이드 커버(1920x480)에
    맞춰 재배치. 가운데 텍스트 영역(x 35–65%, y 25–75%)은 비워둠.
    """
    W, H = 1920 * SS, 480 * SS
    img = Image.new("RGB", (W, H), BRAND_GREEN_RGB)
    draw = ImageDraw.Draw(img, "RGBA")

    # 1920x480 좌표계에서의 노드 (cx, cy, r, opacity)
    # 큰 원은 가장자리 너머로 잘리게 배치 → 부드러운 페이드 분위기
    NODES_E = [
        (1850, -120, 320, 0.62),   # 우상단 큰 원 (잘림)
        (50,    600, 260, 0.58),   # 좌하단 큰 원 (잘림)
        (130,   220, 90,  0.70),   # 중좌
        (1720,  360, 78,  0.66),   # 중우하
        (380,   100, 38,  0.74),   # 좌상 작은
        (1540,   90, 32,  0.70),   # 우상 작은
        (300,   400, 18,  0.80),   # 좌하 점
        (1640,   60, 14,  0.65),   # 우상 점
        (220,   340, 12,  0.55),   # 추가 점
    ]

    # 엣지: 텍스트 영역(x 672~1248, y 120~360) 가로지르지 않게
    EDGES_E = [
        ((1850, -120), (1540,   90)),
        ((1540,   90), (1720,  360)),
        ((1540,   90), ( 380,  100)),  # 위쪽 가로지름 (텍스트 위)
        (( 380,  100), ( 130,  220)),
        (( 130,  220), (  50,  600)),
        (( 380,  100), (1640,   60)),  # 위쪽 한 번 더
        (( 300,  400), ( 130,  220)),
        (( 300,  400), (  50,  600)),
        ((1720,  360), (  50,  600)),  # 아래쪽 가로지름 (텍스트 아래)
        (( 220,  340), ( 300,  400)),
    ]

    # 좌표 → 슈퍼샘플 픽셀 변환
    def sx(x):
        return x * (W / 1920)

    def sy(y):
        return y * (H / 480)

    def sr(r):
        # 가로/세로 스케일 평균 (살짝 가로로 늘어나는 거 방지)
        return r * ((W + H) / (1920 + 480)) / 1

    # 엣지 (선) 먼저 그리기 → 노드 위에 깔리지 않도록
    for (x1, y1), (x2, y2) in EDGES_E:
        draw.line(
            [(sx(x1), sy(y1)), (sx(x2), sy(y2))],
            fill=(255, 255, 255, 70),
            width=int(2.0 * SS),
        )

    # 노드 (흰 원, 알파 적용)
    for cx, cy, r, op in NODES_E:
        cx_p, cy_p = sx(cx), sy(cy)
        r_p = sr(r)
        alpha = int(op * 255 * 0.55)  # 살짝 흐리게 → 텍스트 가독성
        draw.ellipse(
            [cx_p - r_p, cy_p - r_p, cx_p + r_p, cy_p + r_p],
            fill=(255, 255, 255, alpha),
        )

    # 가운데 'Linka' 텍스트 (위에 얹기) — splash 버전은 작게 (D의 50%)
    title_font = _font(int(H * 0.25))
    title_text = "Linka"
    bbox = title_font.getbbox(title_text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (W - tw) / 2 - bbox[0]
    ty = (H - th) / 2 - bbox[1]
    draw.text((tx, ty), title_text, font=title_font, fill=WHITE_RGB)

    img = img.resize((W // SS, H // SS), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  {filename}  ({W//SS}x{H//SS})")


# ──────────────────────────────────────────────
print("Linka 커버 이미지 생성 (4:1, 1920x480)")
print("-" * 50)
cover_a_brand()
cover_b_circles()
cover_c_light()
cover_d_minimal()
cover_e_splash()
print("-" * 50)
print(f"완료. 폴더: {OUT_DIR}")
