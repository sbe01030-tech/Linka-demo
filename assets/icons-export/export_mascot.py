"""
Linka 마스코트 캐릭터를 레이어 분리 PNG + 합쳐진 PSD로 export.

원본 소스: src/screens/customer/HomeScreen.tsx 의 MascotFace 컴포넌트.
viewBox 36x36 기준.

레이어 구조 (아래부터 위로):
  1. face          — 흰 머리 원
  2. cheeks        — 분홍 양볼
  3. eyes          — 검정 양눈
  4. eye_highlight — 흰 캐치라이트
  5. mouth         — 미소 곡선

실행:
  DYLD_LIBRARY_PATH=/usr/local/lib /tmp/linka-ppt/bin/python assets/icons-export/export_mascot.py

출력:
  assets/icons-export/mascot/svg/*.svg        (레이어별 SVG)
  assets/icons-export/mascot/png/layers/*.png (레이어별 PNG, 1024×1024 투명)
  assets/icons-export/mascot/png/full.png     (합쳐진 PNG)
  assets/icons-export/mascot/svg/full.svg     (합쳐진 SVG)
  assets/icons-export/mascot/mascot.psd       (포토샵 레이어 파일)
"""
import os
import io
import numpy as np
from PIL import Image
import cairosvg

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR     = os.path.join(HERE, "mascot")
SVG_DIR     = os.path.join(OUT_DIR, "svg")
PNG_DIR     = os.path.join(OUT_DIR, "png")
LAYERS_DIR  = os.path.join(PNG_DIR, "layers")
PSD_PATH    = os.path.join(OUT_DIR, "mascot.psd")

SIZE = 1024  # 출력 해상도

# ── 마스코트 부위별 SVG body (viewBox 36×36) ────────────
PARTS = {
    "01_face":          '<circle cx="18" cy="16" r="14" fill="white" stroke="#1a1a2e" stroke-width="0.6"/>',
    "02_cheeks":        (
                          '<ellipse cx="9"  cy="19" rx="3.5" ry="2" fill="#FFB3C6" fill-opacity="0.5"/>'
                          '<ellipse cx="27" cy="19" rx="3.5" ry="2" fill="#FFB3C6" fill-opacity="0.5"/>'
                        ),
    "03_eyes":          (
                          '<circle cx="13" cy="15" r="3" fill="#1a1a2e"/>'
                          '<circle cx="23" cy="15" r="3" fill="#1a1a2e"/>'
                        ),
    "04_eye_highlight": (
                          '<circle cx="14.2" cy="13.5" r="1.2" fill="white"/>'
                          '<circle cx="24.2" cy="13.5" r="1.2" fill="white"/>'
                        ),
    "05_mouth":         (
                          '<path d="M14,21 Q18,25 22,21" stroke="#1a1a2e" '
                          'stroke-width="1.5" stroke-linecap="round" fill="none"/>'
                        ),
}

LAYER_ORDER = ["01_face", "02_cheeks", "03_eyes", "04_eye_highlight", "05_mouth"]


def wrap_svg(body: str) -> str:
    """body SVG 요소들을 viewBox 0 0 36 36 SVG로 감싼다."""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'width="36" height="36" viewBox="0 0 36 36">\n'
        f'{body}\n'
        '</svg>\n'
    )


def svg_to_png_bytes(svg_text: str, size: int = SIZE) -> bytes:
    return cairosvg.svg2png(
        bytestring=svg_text.encode("utf-8"),
        output_width=size,
        output_height=size,
    )


def main():
    os.makedirs(SVG_DIR, exist_ok=True)
    os.makedirs(LAYERS_DIR, exist_ok=True)

    # ── 1) 레이어별 SVG + PNG ──
    layer_images = []  # PSD 용
    for name in LAYER_ORDER:
        body = PARTS[name]
        svg_text = wrap_svg(body)

        # SVG 저장
        with open(os.path.join(SVG_DIR, f"{name}.svg"), "w") as f:
            f.write(svg_text)

        # PNG 저장
        png_bytes = svg_to_png_bytes(svg_text)
        png_path = os.path.join(LAYERS_DIR, f"{name}.png")
        with open(png_path, "wb") as f:
            f.write(png_bytes)

        # PSD 용 PIL Image 보관
        img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
        layer_images.append((name, img))

        print(f"  layer  {name}.svg + {name}.png")

    # ── 2) 합쳐진 SVG ──
    full_body = "\n".join(PARTS[n] for n in LAYER_ORDER)
    full_svg = wrap_svg(full_body)
    with open(os.path.join(SVG_DIR, "full.svg"), "w") as f:
        f.write(full_svg)
    print(f"  full   full.svg")

    # ── 3) 합쳐진 PNG ──
    composite = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    for _, img in layer_images:
        composite = Image.alpha_composite(composite, img)
    composite.save(os.path.join(PNG_DIR, "full.png"), "PNG")
    print(f"  full   full.png")

    # ── 4) PSD 생성 (pytoshop) ──
    try:
        from pytoshop.user import nested_layers as nl
        from pytoshop.enums import ColorMode, Compression
        psd_layers = []
        for name, img in layer_images:
            arr = np.array(img)  # (H, W, 4) uint8 RGBA
            r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
            layer = nl.Image(
                name=name.split("_", 1)[-1],
                visible=True,
                opacity=255,
                top=0, left=0, bottom=SIZE, right=SIZE,
                channels={0: r, 1: g, 2: b, -1: a},
            )
            psd_layers.append(layer)

        psd = nl.nested_layers_to_psd(
            psd_layers,
            color_mode=ColorMode.rgb,
            size=(SIZE, SIZE),
            compression=Compression.raw,  # packbits 호환 문제 회피
        )

        with open(PSD_PATH, "wb") as f:
            psd.write(f)
        print(f"\nPSD: {PSD_PATH}")
    except Exception as e:
        print(f"\n⚠️ PSD 생성 실패: {e}")
        print("   → 레이어별 PNG로 대체 사용 가능 (모든 에디터에서 import 후 스택)")

    print(f"\nDone.\n  SVG:    {SVG_DIR}\n  PNG:    {PNG_DIR}\n  Layers: {LAYERS_DIR}")


if __name__ == "__main__":
    main()
