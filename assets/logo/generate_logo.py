"""
Linka 로고 생성기 (HQ 버전).
- SVG (벡터, 무한 해상도)
- PNG: 4x 슈퍼샘플링으로 가장자리·곡선 부드럽게

실행: /tmp/linka-ppt/bin/python assets/logo/generate_logo.py
출력: assets/logo/*.svg + *.png
"""
from PIL import Image, ImageDraw, ImageFont
import os

# ── 색상 ─────────────────────────────
BRAND_GREEN_RGB = (0, 200, 83)
BRAND_GREEN_HEX = "#00C853"
DARK_NAVY_RGB   = (26, 26, 46)
DARK_NAVY_HEX   = "#1a1a2e"
WHITE_RGB       = (255, 255, 255)
WHITE_HEX       = "#FFFFFF"
PINK_HEX        = "#FFB3C6"
PINK_RGB_ALPHA  = (255, 179, 198, 128)

FONT_PATH = "/tmp/Nunito-Variable.ttf"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── PNG 슈퍼샘플링 배율 ────────────────────
SS = 4   # 4x 슈퍼샘플링 → LANCZOS 다운샘플


# ──────────────────────────────────────────────
#   PNG 생성 (Pillow + 슈퍼샘플링)
# ──────────────────────────────────────────────
def draw_mascot_face_pil(draw, cx, cy, size):
    """
    HomeScreen.tsx 의 MascotFace SVG 를 PIL 로 재현.
    원본 viewBox 0 0 36 36. cx/cy 는 viewBox 중심점 18,16 위치.
    """
    s = size / 36.0

    def p(x, y):
        return (cx + (x - 18) * s, cy + (y - 16) * s)

    def r(rad):
        return rad * s

    # 얼굴 (흰 + 검은 윤곽)
    head_r = r(14)
    draw.ellipse(
        [cx - head_r, cy - head_r, cx + head_r, cy + head_r],
        fill=WHITE_RGB,
        outline=DARK_NAVY_RGB,
        width=max(1, int(s * 1.2)),
    )
    # 볼
    for cheek_x in (9, 27):
        cc = p(cheek_x, 19)
        draw.ellipse(
            [cc[0] - r(3.5), cc[1] - r(2),
             cc[0] + r(3.5), cc[1] + r(2)],
            fill=PINK_RGB_ALPHA,
        )
    # 눈 + 흰 하이라이트
    for eye_x, hl_x in ((13, 14.2), (23, 24.2)):
        ec = p(eye_x, 15)
        eye_r = r(3)
        draw.ellipse(
            [ec[0] - eye_r, ec[1] - eye_r,
             ec[0] + eye_r, ec[1] + eye_r],
            fill=DARK_NAVY_RGB,
        )
        hc = p(hl_x, 13.5)
        h_r = r(1.2)
        draw.ellipse(
            [hc[0] - h_r, hc[1] - h_r,
             hc[0] + h_r, hc[1] + h_r],
            fill=WHITE_RGB,
        )
    # 미소
    draw.arc(
        [cx - r(4), cy + r(3),
         cx + r(4), cy + r(7.5)],
        start=20, end=160,
        fill=DARK_NAVY_RGB,
        width=max(1, int(s * 1.5)),
    )


def _load_font(size):
    font = ImageFont.truetype(FONT_PATH, size)
    try:
        font.set_variation_by_axes([900])
    except (AttributeError, OSError):
        pass
    return font


def render_square_png(size, with_face=True, bg=WHITE_RGB,
                      text_color=BRAND_GREEN_RGB, filename=None):
    """정사각 로고. 슈퍼샘플링 적용."""
    big = size * SS
    pad = int(big * 0.15)
    inner = big - pad * 2

    img = Image.new("RGB", (big, big), bg)
    draw = ImageDraw.Draw(img, "RGBA")

    if with_face:
        face_size = int(inner * 0.55)
        face_cx = big / 2
        face_cy = pad + face_size / 2 + int(inner * 0.02)
        draw_mascot_face_pil(draw, face_cx, face_cy, face_size)

        font_size = int(inner * 0.28)
        font = _load_font(font_size)
        text = "Linka"
        bbox = font.getbbox(text)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = (big - tw) / 2 - bbox[0]
        ty = pad + inner - th - bbox[1] + int(inner * 0.02)
        draw.text((tx, ty), text, font=font, fill=text_color)
    else:
        font_size = int(inner * 0.40)
        font = _load_font(font_size)
        text = "Linka"
        bbox = font.getbbox(text)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = (big - tw) / 2 - bbox[0]
        # 광학적 중앙: bbox 기반 중앙 + 살짝 위로 보정 (폰트 메트릭 패딩 보정)
        ty = (big - th) / 2 - bbox[1] - int(big * 0.03)
        draw.text((tx, ty), text, font=font, fill=text_color)

    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  PNG  {filename}  ({size}x{size}, {SS}x SS)")


def render_horizontal_png(size_w, with_face=True, bg=WHITE_RGB,
                          text_color=BRAND_GREEN_RGB, filename=None):
    """가로 로고. 마스코트 + 텍스트."""
    SS_local = SS
    big_w = size_w * SS_local
    padding = int(big_w * 0.05)

    font_size = int((big_w - padding * 2) * 0.30)
    font = _load_font(font_size)
    text = "Linka"
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    if with_face:
        face_size = int(font_size * 1.1)
        gap = int(font_size * 0.18)
        inner_w = face_size + gap + text_w
    else:
        face_size = 0
        gap = 0
        inner_w = text_w

    big_w_actual = inner_w + padding * 2
    big_h = max(face_size, text_h) + padding * 2

    img = Image.new("RGB", (big_w_actual, big_h), bg)
    draw = ImageDraw.Draw(img, "RGBA")

    if with_face:
        face_cx = padding + face_size / 2
        face_cy = big_h / 2
        draw_mascot_face_pil(draw, face_cx, face_cy, face_size)
        text_x = padding + face_size + gap
    else:
        text_x = padding

    text_y = (big_h - text_h) / 2 - bbox[1]
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    final_w = big_w_actual // SS_local
    final_h = big_h // SS_local
    img = img.resize((final_w, final_h), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  PNG  {filename}  ({final_w}x{final_h}, {SS_local}x SS)")


def render_circle_png(size, filename=None):
    """원형 그린 뱃지."""
    big = size * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")

    draw.ellipse([0, 0, big, big], fill=BRAND_GREEN_RGB)

    face_size = int(big * 0.45)
    face_cx = big / 2
    face_cy = big * 0.40
    draw_mascot_face_pil(draw, face_cx, face_cy, face_size)

    font_size = int(big * 0.18)
    font = _load_font(font_size)
    text = "Linka"
    bbox = font.getbbox(text)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (big - tw) / 2 - bbox[0]
    ty = big * 0.72 - th / 2 - bbox[1]
    draw.text((tx, ty), text, font=font, fill=WHITE_RGB)

    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  PNG  {filename}  ({size}x{size}, {SS}x SS)")


def render_splash_png(size, filename=None):
    """그린 배경 + 큰 흰 Linka."""
    big = size * SS
    img = Image.new("RGB", (big, big), BRAND_GREEN_RGB)
    draw = ImageDraw.Draw(img, "RGBA")
    font = _load_font(int(big * 0.35))
    text = "Linka"
    bbox = font.getbbox(text)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((big - tw) / 2 - bbox[0], (big - th) / 2 - bbox[1]),
              text, font=font, fill=WHITE_RGB)
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), "PNG", optimize=True)
    print(f"  PNG  {filename}  ({size}x{size}, {SS}x SS)")


# ──────────────────────────────────────────────
#   SVG 생성 (벡터, 무한 해상도)
# ──────────────────────────────────────────────
MASCOT_SVG = '''<g transform="translate({tx},{ty}) scale({sc})">
  <circle cx="18" cy="16" r="14" fill="white" stroke="{outline}" stroke-width="1.2"/>
  <ellipse cx="9" cy="19" rx="3.5" ry="2" fill="{pink}" fill-opacity="0.5"/>
  <ellipse cx="27" cy="19" rx="3.5" ry="2" fill="{pink}" fill-opacity="0.5"/>
  <circle cx="13" cy="15" r="3" fill="{outline}"/>
  <circle cx="23" cy="15" r="3" fill="{outline}"/>
  <circle cx="14.2" cy="13.5" r="1.2" fill="white"/>
  <circle cx="24.2" cy="13.5" r="1.2" fill="white"/>
  <path d="M14,21 Q18,25 22,21" stroke="{outline}" stroke-width="1.5"
        stroke-linecap="round" fill="none"/>
</g>'''


def write_svg(filename, body, vw, vh):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vw} {vh}" width="{vw}" height="{vh}">
{body}
</svg>'''
    with open(os.path.join(OUT_DIR, filename), "w") as f:
        f.write(svg)
    print(f"  SVG  {filename}")


def svg_square(filename="linka_square.svg", with_face=True, size=512,
               bg=WHITE_HEX, text=BRAND_GREEN_HEX):
    pad = size * 0.15
    inner = size - pad * 2
    body = f'<rect width="{size}" height="{size}" fill="{bg}"/>'
    if with_face:
        face_size = inner * 0.55
        face_cx = size / 2
        face_cy = pad + face_size / 2 + inner * 0.02
        sc = face_size / 36
        tx = face_cx - 18 * sc
        ty = face_cy - 16 * sc
        body += MASCOT_SVG.format(
            tx=f"{tx:.2f}", ty=f"{ty:.2f}", sc=f"{sc:.4f}",
            outline=DARK_NAVY_HEX, pink=PINK_HEX,
        )
        # 텍스트 (font-size 비율로)
        fs = inner * 0.28
        text_y = pad + inner - fs * 0.10
        body += (f'<text x="{size/2}" y="{text_y:.2f}" '
                 f'font-family="Nunito, sans-serif" font-weight="900" '
                 f'font-size="{fs:.2f}" fill="{text}" text-anchor="middle">Linka</text>')
    else:
        fs = inner * 0.40
        body += (f'<text x="{size/2}" y="{size/2 + fs*0.35:.2f}" '
                 f'font-family="Nunito, sans-serif" font-weight="900" '
                 f'font-size="{fs:.2f}" fill="{text}" text-anchor="middle">Linka</text>')
    write_svg(filename, body, size, size)


def svg_horizontal(filename="linka_horizontal.svg", size=512):
    # 가로 비율은 텍스트 길이에 따라 가변. 단순 비율로 1024x320 권장.
    w, h = 1024, 320
    body = f'<rect width="{w}" height="{h}" fill="{WHITE_HEX}"/>'
    face_size = 240
    face_cx = 60 + face_size / 2
    face_cy = h / 2
    sc = face_size / 36
    body += MASCOT_SVG.format(
        tx=f"{face_cx - 18*sc:.2f}", ty=f"{face_cy - 16*sc:.2f}",
        sc=f"{sc:.4f}", outline=DARK_NAVY_HEX, pink=PINK_HEX,
    )
    body += (f'<text x="{60 + face_size + 40}" y="{h/2 + 75}" '
             f'font-family="Nunito, sans-serif" font-weight="900" '
             f'font-size="220" fill="{BRAND_GREEN_HEX}">Linka</text>')
    write_svg(filename, body, w, h)


def svg_circle(filename="linka_circle.svg", size=512):
    body = f'<circle cx="{size/2}" cy="{size/2}" r="{size/2}" fill="{BRAND_GREEN_HEX}"/>'
    face_size = size * 0.45
    face_cx = size / 2
    face_cy = size * 0.40
    sc = face_size / 36
    body += MASCOT_SVG.format(
        tx=f"{face_cx - 18*sc:.2f}", ty=f"{face_cy - 16*sc:.2f}",
        sc=f"{sc:.4f}", outline=DARK_NAVY_HEX, pink=PINK_HEX,
    )
    body += (f'<text x="{size/2}" y="{size*0.78:.2f}" '
             f'font-family="Nunito, sans-serif" font-weight="900" '
             f'font-size="{size*0.18:.2f}" fill="{WHITE_HEX}" text-anchor="middle">Linka</text>')
    write_svg(filename, body, size, size)


def svg_splash(filename="linka_splash.svg", size=1024):
    body = f'<rect width="{size}" height="{size}" fill="{BRAND_GREEN_HEX}"/>'
    fs = size * 0.35
    body += (f'<text x="{size/2}" y="{size/2 + fs*0.35:.2f}" '
             f'font-family="Nunito, sans-serif" font-weight="900" '
             f'font-size="{fs:.2f}" fill="{WHITE_HEX}" text-anchor="middle">Linka</text>')
    write_svg(filename, body, size, size)


# ──────────────────────────────────────────────
#   생성
# ──────────────────────────────────────────────
print("=" * 60)
print("  Linka 로고 HQ 생성")
print("=" * 60)
print()
print("[ PNG — 4x 슈퍼샘플링 ]")
render_square_png(2048, with_face=True, filename="linka_square_2048.png")
render_square_png(1024, with_face=True, filename="linka_square_1024.png")
render_square_png(512,  with_face=True, filename="linka_square_512.png")
render_square_png(200,  with_face=True, filename="linka_square_200.png")

# 텍스트만 (마스코트 없이) 정사각 버전
render_square_png(2048, with_face=False, filename="linka_text_square_2048.png")
render_square_png(1024, with_face=False, filename="linka_text_square_1024.png")
render_square_png(512,  with_face=False, filename="linka_text_square_512.png")
render_square_png(200,  with_face=False, filename="linka_text_square_200.png")

render_horizontal_png(2048, with_face=True, filename="linka_horizontal_2048.png")
render_horizontal_png(1024, with_face=True, filename="linka_horizontal_1024.png")
render_horizontal_png(512,  with_face=True, filename="linka_horizontal_512.png")

render_horizontal_png(1024, with_face=False, filename="linka_text_only_1024.png")
render_horizontal_png(512,  with_face=False, filename="linka_text_only_512.png")

render_circle_png(2048, filename="linka_circle_2048.png")
render_circle_png(1024, filename="linka_circle_1024.png")
render_circle_png(512,  filename="linka_circle_512.png")
render_circle_png(200,  filename="linka_circle_200.png")

render_splash_png(2048, filename="linka_splash_2048.png")
render_splash_png(1024, filename="linka_splash_1024.png")

print()
print("[ SVG — 벡터, 무한 해상도 ]")
svg_square("linka_square.svg")
svg_square("linka_text_square.svg", with_face=False)
svg_horizontal("linka_horizontal.svg")
svg_circle("linka_circle.svg")
svg_splash("linka_splash.svg")

print()
print("=" * 60)
print(f"  완료. 출력 폴더: {OUT_DIR}")
print("=" * 60)
