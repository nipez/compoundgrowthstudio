#!/usr/bin/env python3
"""Extend Tony blazer into background gaps without distorting face."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

BG = np.array([248, 248, 248], dtype=np.uint8)


def is_bg_px(px: np.ndarray, tol: int = 28) -> bool:
    return bool(np.all(np.abs(px.astype(int) - BG.astype(int)) < tol))


def is_navy(px: np.ndarray) -> bool:
    r, g, b = int(px[0]), int(px[1]), int(px[2])
    return b > r + 10 and b > g + 2 and 45 < b < 200 and r < 135


def sample_navy(row: np.ndarray, x: int, direction: str, width: int = 20) -> np.ndarray:
    colors: list[np.ndarray] = []
    if direction == "left":
        for dx in range(width):
            xi = x + dx
            if xi < len(row) and is_navy(row[xi]):
                colors.append(row[xi])
    else:
        for dx in range(width):
            xi = x - dx
            if xi >= 0 and is_navy(row[xi]):
                colors.append(row[xi])
    if not colors:
        return np.array([30, 50, 90], dtype=np.uint8)
    return np.mean(colors, axis=0).astype(np.uint8)


def process(
    src_path: str | Path,
    out_path: str | Path,
    margin_frac: float = 0.08,
    y0_frac: float = 0.74,
    y1_frac: float = 0.95,
    gap_close: float = 0.65,
) -> np.ndarray:
    """Fill part of each shoulder-row background gap with sampled navy color."""
    img = np.array(Image.open(src_path).convert("RGB"))
    h, w = img.shape[:2]
    margin = int(w * margin_frac)
    target_l, target_r = margin, w - 1 - margin
    out = img.copy()

    for y in range(int(h * y0_frac), int(h * y1_frac)):
        row = out[y]
        nonbg = np.array([not is_bg_px(p) for p in row])
        xs = np.where(nonbg)[0]
        if len(xs) < 16:
            continue

        left_edge, right_edge = int(xs[0]), int(xs[-1])
        left_color = sample_navy(row, left_edge, "left")
        right_color = sample_navy(row, right_edge, "right")

        left_span = max(1, left_edge - target_l)
        right_span = max(1, target_r - right_edge)

        for x in range(target_l, left_edge):
            if not is_bg_px(row[x]):
                continue
            dist = left_edge - x
            if dist > left_span * gap_close:
                continue
            t = 1 - dist / (left_span * gap_close)
            blend = 0.35 + 0.55 * t
            out[y, x] = (left_color * blend + BG * (1 - blend)).astype(np.uint8)

        for x in range(right_edge + 1, target_r + 1):
            if not is_bg_px(row[x]):
                continue
            dist = x - right_edge
            if dist > right_span * gap_close:
                continue
            t = 1 - dist / (right_span * gap_close)
            blend = 0.35 + 0.55 * t
            out[y, x] = (right_color * blend + BG * (1 - blend)).astype(np.uint8)

    Image.fromarray(out).save(out_path, quality=92)
    return out


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    process(
        root / "public/images/team-tony-v12.jpg",
        root / "public/images/team-tony-v16.jpg",
    )
    print("Wrote public/images/team-tony-v16.jpg")
