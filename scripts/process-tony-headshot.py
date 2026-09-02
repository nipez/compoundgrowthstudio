#!/usr/bin/env python3
"""Process a Tony source PNG into a Conor-matched team headshot."""
from __future__ import annotations

import io
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove

BG = (248, 248, 248)
SIZE = 900
DEFAULT_SCALE = 0.80
DEFAULT_HEADROOM = 0.12


def get_cutout(src_path: str | Path) -> Image.Image:
    raw = Image.open(src_path).convert("RGBA")
    out = remove(raw)
    cut = Image.open(io.BytesIO(out)).convert("RGBA") if isinstance(out, bytes) else out.convert("RGBA")

    # Remove black-background bleed on semi-transparent edge pixels.
    arr = np.array(cut, dtype=np.float32)
    alpha = arr[:, :, 3:4] / 255.0
    arr[:, :, :3] = np.where(alpha > 0.01, arr[:, :, :3] / np.maximum(alpha, 0.01), arr[:, :, :3])
    arr[:, :, :3] = np.clip(arr[:, :, :3], 0, 255)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def subject_bbox(cut: Image.Image) -> tuple[int, int, int, int]:
    arr = np.array(cut)
    ys, xs = np.where(arr[:, :, 3] > 20)
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def compose(
    cut: Image.Image,
    scale_frac: float = DEFAULT_SCALE,
    headroom_frac: float = DEFAULT_HEADROOM,
) -> Image.Image:
    x0, y0, x1, y1 = subject_bbox(cut)
    subject = cut.crop((x0, y0, x1 + 1, y1 + 1))
    subject_w, subject_h = subject.size
    target_h = int(SIZE * scale_frac)
    scale = target_h / subject_h
    resized = subject.resize((int(subject_w * scale), int(subject_h * scale)), Image.LANCZOS)

    canvas = Image.new("RGBA", (SIZE, SIZE), BG + (255,))
    x = (SIZE - resized.size[0]) // 2
    y = int(SIZE * headroom_frac)
    canvas.paste(resized, (x, y), resized)
    return canvas.convert("RGB")


def process(
    src_path: str | Path,
    out_path: str | Path,
    scale_frac: float = DEFAULT_SCALE,
    headroom_frac: float = DEFAULT_HEADROOM,
) -> Image.Image:
    result = compose(get_cutout(src_path), scale_frac=scale_frac, headroom_frac=headroom_frac)
    result.save(out_path, quality=92)
    return result


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    process(
        root / "public/images/tony3.png",
        root / "public/images/team-tony-v17.jpg",
    )
    print("Wrote public/images/team-tony-v17.jpg")
