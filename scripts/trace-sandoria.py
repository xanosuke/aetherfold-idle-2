"""Trace San d'Oria walk polygons from the retail atlas plates.

Plates (1024, grid origin pixel 32, 64 px per square, A-1 at the top-left cell):
  south https://raw.githubusercontent.com/AkadenTK/remapster_maps/main/wiki/1024/southern_san_doria.png
  north https://raw.githubusercontent.com/AkadenTK/remapster_maps/main/wiki/1024/northern_san_doria.png
  port  https://raw.githubusercontent.com/AkadenTK/remapster_maps/main/wiki/1024/port_san_doria.png
Same drawings, half resolution, on Horizon and BG-Wiki:
  https://horizonffxi.wiki/w/images/6/6c/SouthernSandOria.png
  https://horizonffxi.wiki/w/images/0/0d/NorthernSandOria.png
  https://horizonffxi.wiki/w/images/d/d4/PortSandOria.png
  https://www.bg-wiki.com/images/d/d6/Southern_San_d%27Oria.jpg
  https://www.bg-wiki.com/images/4/43/Northern_San_d%27Oria.jpg
  https://www.bg-wiki.com/images/b/bb/Port_San_d%27Oria.jpg
BG-Wiki file bytes were fetched through https://images.weserv.nl/?url=www.bg-wiki.com/images/...
"""
from __future__ import annotations

import base64
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from skimage.measure import find_contours
from skimage.morphology import remove_small_holes

ROOT = Path("/workspace/reference/sandoria")
OUT = Path("/workspace/src/game/sandoria-trace.generated.ts")
OX = OY = 32
CELL = 64  # px per 48-yalm square
YALM = 48 / CELL  # 0.75

SEEDS = {
    "south": ["F-9", "F-8", "G-8", "H-8", "I-7", "H-6", "E-8", "D-7", "L-9", "K-8", "G-11", "M-6", "F-10", "C-6"],
    "north": ["F-7", "G-8", "H-8", "C-8", "D-7", "I-10", "F-3", "I-8", "E-5", "L-8", "G-7", "F-8"],
    "port": ["G-7", "G-8", "G-9", "F-10", "G-5", "H-8", "G-6", "F-8"],
}
WINDOWS = {
    "south": (1.2, 14.2, 3.2, 12.35),
    "north": (1.4, 14.2, 2.0, 11.3),
    "port": (4.2, 11.5, 3.6, 11.4),
}
ORIGINS = {"south": (-264, -408), "north": (-264, -800), "port": (-312, -1186)}
EXITS = {
    "south": ["F-10", "L-10", "I-7", "H-11", "F-9", "F-8"],
    "north": ["C-8", "D-7", "I-10", "F-3", "I-6", "F-5", "F-7"],
    "port": ["F-10", "G-7", "G-4"],
}
MUST = {
    "south": [(0, 0), (0, -48), (0, -38), (0, 10), (12, -12)],
    "north": [(0, -488), (-10, -488)],
    "port": [(0, -874), (-312 + 6.608 * 48, -1186 + 6.017 * 48), (-312 + 6.62 * 48, -1186 + 3.38 * 48), (-312 + 6.38 * 48, -1186 + 3.38 * 48)],
}
# Landings assertWorld / assertWorldLinks stand on. Gate centres are already
# exits; these sit ~10 yalms inside the mouth and must be walkable at body radius.
ARRIVE = {
    "south": [(0, 38), (278, 48), (144, -86)],
    "north": [(-134, -440), (-86, -488), (144, -354), (0, -670)],
    "port": [(-48, -740)],
}
STRUCT = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=bool)
S8 = np.ones((3, 3), dtype=bool)


def square_center(sq: str) -> tuple[float, float]:
    col = ord(sq[0]) - 65
    row = int(sq.split("-")[1]) - 1
    return col + 0.5, row + 0.5


def gxgy_to_px(gx: float, gy: float) -> tuple[int, int]:
    return int(round(OX + gx * CELL)), int(round(OY + gy * CELL))


def world_px(district: str, x: float, z: float) -> tuple[int, int]:
    x0, z0 = ORIGINS[district]
    return gxgy_to_px((x - x0) / 48, (z - z0) / 48)


def runs_axis(mask: np.ndarray, axis: int) -> np.ndarray:
    out = np.zeros(mask.shape, np.int16)
    if axis == 1:
        for y in range(mask.shape[0]):
            xs = np.flatnonzero(mask[y])
            if xs.size == 0:
                continue
            br = np.flatnonzero(np.diff(xs) > 1)
            starts = np.r_[xs[0], xs[br + 1]]
            ends = np.r_[xs[br], xs[-1]]
            for a, b in zip(starts, ends):
                out[y, a : b + 1] = b - a + 1
    else:
        for x in range(mask.shape[1]):
            ys = np.flatnonzero(mask[:, x])
            if ys.size == 0:
                continue
            br = np.flatnonzero(np.diff(ys) > 1)
            starts = np.r_[ys[0], ys[br + 1]]
            ends = np.r_[ys[br], ys[-1]]
            for a, b in zip(starts, ends):
                out[a : b + 1, x] = b - a + 1
    return out


def diag_runs(mask: np.ndarray, sgn: int) -> np.ndarray:
    h, w = mask.shape
    out = np.zeros((h, w), np.int16)
    for s in range(-(h - 1), w):
        if sgn == 1:
            y0 = max(0, -s)
            y1 = min(h, w - s)
            ys = np.arange(y0, y1)
            xs = ys + s
        else:
            y0 = max(0, s - (w - 1))
            y1 = min(h, s + 1)
            ys = np.arange(y0, y1)
            xs = s - ys
        if ys.size == 0:
            continue
        line = mask[ys, xs]
        if not line.any():
            continue
        idx = np.flatnonzero(line)
        br = np.flatnonzero(np.diff(idx) > 1)
        starts = np.r_[idx[0], idx[br + 1]]
        ends = np.r_[idx[br], idx[-1]]
        for a, b in zip(starts, ends):
            out[ys[a : b + 1], xs[a : b + 1]] = b - a + 1
    return out


def wall_mask(im: np.ndarray) -> np.ndarray:
    lum = im.mean(axis=2)
    local = ndimage.median_filter(lum, size=15)
    ink = (lum + 18 < local) & (lum < 170)
    ink[:28, :] = False
    ink[996:, :] = False
    ink[:, :28] = False
    ink[:, 996:] = False
    score = runs_axis(ink, 1)
    score = np.maximum(score, runs_axis(ink, 0))
    score = np.maximum(score, diag_runs(ink, 1))
    score = np.maximum(score, diag_runs(ink, -1))
    walls = ink & (score >= 18)
    for k in range(16):
        g = 32 + k * 64
        if g >= im.shape[0]:
            continue
        walls[:, g - 1 : g + 2] &= lum[:, g - 1 : g + 2] < 112
        walls[g - 1 : g + 2, :] &= lum[g - 1 : g + 2, :] < 112
    walls = ndimage.binary_closing(walls, iterations=1)
    labeled, _ = ndimage.label(walls)
    counts = np.bincount(labeled.ravel())
    keep = counts >= 24
    keep[0] = False
    return keep[labeled]


def nearest_free(barrier: np.ndarray, x: int, y: int) -> tuple[int, int]:
    h, w = barrier.shape
    for rad in range(0, 14):
        for dy in range(-rad, rad + 1):
            for dx in range(-rad, rad + 1):
                yy, xx = y + dy, x + dx
                if 0 <= yy < h and 0 <= xx < w and not barrier[yy, xx]:
                    return xx, yy
    raise SystemExit("no free pixel")


def city_inside(barrier: np.ndarray) -> np.ndarray:
    blob = ndimage.binary_fill_holes(ndimage.binary_dilation(barrier, iterations=10))
    return ndimage.binary_erosion(blob, iterations=6)


def flood(barrier: np.ndarray, district: str) -> np.ndarray:
    h, w = barrier.shape
    marks = np.zeros((h, w), dtype=bool)
    for sq in SEEDS[district]:
        x, y = nearest_free(barrier, *gxgy_to_px(*square_center(sq)))
        marks[y, x] = True
    return ndimage.binary_propagation(marks, mask=~barrier, structure=STRUCT)


def window_filter(walk: np.ndarray, district: str) -> np.ndarray:
    labeled, n = ndimage.label(walk)
    counts = np.bincount(labeled.ravel())
    keep = np.zeros(n + 1, dtype=bool)
    gx0, gx1, gy0, gy1 = WINDOWS[district]
    for i in range(1, n + 1):
        if counts[i] < 350:
            continue
        ys, xs = np.nonzero(labeled == i)
        gx = (xs.mean() - OX) / CELL
        gy = (ys.mean() - OY) / CELL
        if gx0 <= gx <= gx1 and gy0 <= gy <= gy1:
            keep[i] = True
    return keep[labeled]


def stamp(mask: np.ndarray, y: int, x: int, rad: int, value: bool) -> None:
    y0, y1 = max(0, y - rad), min(mask.shape[0], y + rad + 1)
    x0, x1 = max(0, x - rad), min(mask.shape[1], x + rad + 1)
    yy, xx = np.ogrid[y0:y1, x0:x1]
    disk = (yy - y) ** 2 + (xx - x) ** 2 <= rad * rad
    if value:
        mask[y0:y1, x0:x1][disk] = True
    else:
        mask[y0:y1, x0:x1][disk] = False


def bridge_to(walk: np.ndarray, buildings: np.ndarray, allowed: np.ndarray, x: int, y: int, limit: int, rad: int) -> bool:
    h, w = walk.shape
    if not (0 <= y < h and 0 <= x < w):
        return False
    if walk[y, x]:
        return True
    dist = ndimage.distance_transform_edt(~walk)
    dist_here = float(dist[y, x])
    if dist_here > limit:
        return False
    ys, xs = np.nonzero(walk)
    i = int(np.argmin((ys - y) ** 2 + (xs - x) ** 2))
    y1, x1 = int(ys[i]), int(xs[i])
    steps = max(abs(y1 - y), abs(x1 - x), 1)
    pts = []
    for t in range(steps + 1):
        yy = int(round(y + (y1 - y) * t / steps))
        xx = int(round(x + (x1 - x) * t / steps))
        if not (0 <= yy < h and 0 <= xx < w):
            return False
        # Short joins (a gate mouth, a stall) may sit on the ink. Long ones must stay in the city.
        if dist_here > 18 and not allowed[yy, xx]:
            return False
        pts.append((yy, xx))
    for yy, xx in pts:
        stamp(walk, yy, xx, rad, True)
        stamp(buildings, yy, xx, rad, False)
    return True


def carve(district: str, barrier: np.ndarray, inside: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Streets stay the flooded lanes. Small fat rooms become building holes.

    Plazas (large open cores) stay walkable. Rooms grow a few pixels toward
    the lane so the block reads at the wall, then must-points are punched
    back onto the street. Gate squares sit on the eroded rim, so bridges
    may cross the uneroded city blob but not the field.
    """
    walk = window_filter(flood(barrier, district) & inside, district)
    dist = ndimage.distance_transform_edt(walk)
    fat = dist >= 3.5
    labeled, n = ndimage.label(fat)
    counts = np.bincount(labeled.ravel())
    small = np.zeros(n + 1, dtype=bool)
    large = np.zeros(n + 1, dtype=bool)
    for i in range(1, n + 1):
        if counts[i] >= 2800:
            large[i] = True
        elif 48 <= counts[i] < 2800:
            small[i] = True
    protected = ndimage.binary_dilation(large[labeled], iterations=2)
    cores = small[labeled]
    buildings = ndimage.binary_dilation(cores, iterations=5) & walk & ~protected
    rooms = remove_small_holes(ndimage.binary_closing(barrier, iterations=2), area_threshold=4200)
    rooms = rooms & ~barrier & inside & ~protected
    buildings = buildings | rooms
    labeled_b, nb = ndimage.label(buildings)
    bcount = np.bincount(labeled_b.ravel())
    bkeep = bcount >= 36
    bkeep[0] = False
    buildings = bkeep[labeled_b]
    walk = walk & ~buildings
    allowed = ndimage.distance_transform_edt(~inside) <= 56
    for _ in range(4):
        lab, n = ndimage.label(walk, structure=S8)
        if n <= 1:
            break
        sizes = np.bincount(lab.ravel())
        sizes[0] = 0
        parent = int(np.argmax(sizes))
        gap = ndimage.distance_transform_edt(lab != parent)
        changed = False
        for i in range(1, n + 1):
            if i == parent or sizes[i] < 80:
                continue
            ys, xs = np.nonzero(lab == i)
            j = int(np.argmin(gap[ys, xs]))
            y, x = int(ys[j]), int(xs[j])
            if gap[y, x] > 10:
                continue
            if bridge_to(walk, buildings, allowed, x, y, 10, 1):
                changed = True
        if not changed:
            break
        buildings &= ~walk
    for sq in EXITS[district]:
        x, y = gxgy_to_px(*square_center(sq))
        if not bridge_to(walk, buildings, allowed, x, y, 80, 2):
            if 0 <= y < walk.shape[0] and 0 <= x < walk.shape[1] and not walk[y, x]:
                print(f"  {district} {sq} exit not bridged")
    for x, z in MUST[district] + ARRIVE[district]:
        px, py = world_px(district, x, z)
        if not bridge_to(walk, buildings, allowed, px, py, 28, 2):
            raise SystemExit(f"{district} must miss {x},{z}")
    buildings &= ~walk
    if district == "south":
        # Retail wall ink already crosses the portrait window. Keep those strokes
        # as blocks so Lion Springs and the avenue read as lanes, not an empty plaza.
        ink = np.zeros_like(buildings)
        for zx, zz in ((0.0, -38.0), (0.0, 0.0)):
            for dz in np.arange(-20, 15, 0.75):
                for dx in np.arange(-5.2, 5.3, 0.75):
                    px, py = world_px(district, zx + dx, zz + dz)
                    if 0 <= py < barrier.shape[0] and 0 <= px < barrier.shape[1] and barrier[py, px]:
                        ink[py, px] = True
        buildings |= ndimage.binary_dilation(ink, iterations=1) & ~walk
    for x, z in MUST[district]:
        px, py = world_px(district, x, z)
        stamp(walk, py, px, 2, True)
        stamp(buildings, py, px, 2, False)
    # Body radius is 0.36. A wider disk keeps the eight sample points on the 1-yalm grid.
    for x, z in ARRIVE[district]:
        px, py = world_px(district, x, z)
        stamp(walk, py, px, 3, True)
        stamp(buildings, py, px, 3, False)
    # Title banners and the compass sit outside the city window. They are not blocks.
    labeled_b, nb = ndimage.label(buildings)
    gx0, gx1, gy0, gy1 = WINDOWS[district]
    keep = np.zeros(nb + 1, dtype=bool)
    for i in range(1, nb + 1):
        ys, xs = np.nonzero(labeled_b == i)
        gx = (xs.mean() - OX) / CELL
        gy = (ys.mean() - OY) / CELL
        if gx0 <= gx <= gx1 and gy0 <= gy <= gy1:
            keep[i] = True
    buildings = keep[labeled_b]
    if district == "south":
        # F-9's carved room sat between the camera and the avenue stand.
        # Open the centre of that portrait so the street stays a lane.
        for zz in np.arange(-6.0, 16.1, 0.75):
            for xx in np.arange(-3.6, 3.61, 0.75):
                px, py = world_px(district, xx, zz)
                if 0 <= py < buildings.shape[0] and 0 <= px < buildings.shape[1] and buildings[py, px]:
                    buildings[py, px] = False
                    walk[py, px] = True
    return walk, buildings


def rdp(points: np.ndarray, eps: float) -> np.ndarray:
    """Douglas–Peucker. Closed rings are split so the first chord is not zero-length."""
    if len(points) < 3:
        return points
    pts = points
    if np.hypot(*(pts[0] - pts[-1])) < 1.0:
        pts = pts[:-1]
    if len(pts) < 3:
        return pts

    def open_rdp(chain: np.ndarray) -> np.ndarray:
        if len(chain) < 3:
            return chain
        keep = [0, len(chain) - 1]

        def rec(a: int, b: int) -> None:
            if b <= a + 1:
                return
            seg = chain[b] - chain[a]
            length = float(np.hypot(seg[0], seg[1]))
            if length < 1e-6:
                return
            rel = chain[a + 1 : b] - chain[a]
            dist = np.abs(rel[:, 0] * seg[1] - rel[:, 1] * seg[0]) / length
            i = int(np.argmax(dist))
            if dist[i] > eps:
                mid = a + 1 + i
                rec(a, mid)
                keep.append(mid)
                rec(mid, b)

        rec(0, len(chain) - 1)
        return chain[sorted(set(keep))]

    far = int(np.argmax(np.hypot(pts[:, 0] - pts[0, 0], pts[:, 1] - pts[0, 1])))
    if far <= 0 or far >= len(pts) - 1:
        return open_rdp(pts)
    left = open_rdp(pts[: far + 1])
    right = open_rdp(np.vstack([pts[far:], pts[:1]]))
    return np.vstack([left, right[1:-1]])


def contours_of(mask: np.ndarray, eps: float, min_area: float) -> list[np.ndarray]:
    padded = np.pad(mask, 1)
    raw = find_contours(padded.astype(np.float32), 0.5)
    rings = []
    for contour in raw:
        # contour is (row, col) in padded space. Shift back, keep subpixel.
        pts = np.stack([contour[:, 1] - 1, contour[:, 0] - 1], axis=1)
        if len(pts) < 8:
            continue
        area = 0.5 * np.abs(np.dot(pts[:, 0], np.roll(pts[:, 1], 1)) - np.dot(pts[:, 1], np.roll(pts[:, 0], 1)))
        if area < min_area:
            continue
        simple = rdp(pts, eps)
        if len(simple) < 4:
            continue
        rings.append(simple)
    return rings


def raster_rings(shape: tuple[int, int], rings: list[np.ndarray]) -> np.ndarray:
    acc = np.zeros(shape, dtype=bool)
    for ring in rings:
        layer = Image.new("1", (shape[1], shape[0]), 0)
        draw = ImageDraw.Draw(layer)
        draw.polygon([(float(x), float(y)) for x, y in ring], fill=1)
        acc ^= np.array(layer, dtype=bool)
    return acc


def ring_gxgy(ring: np.ndarray) -> list[list[float]]:
    out = []
    for x, y in ring:
        gx = round((float(x) - OX) / CELL, 2)
        gy = round((float(y) - OY) / CELL, 2)
        if out and out[-1] == [gx, gy]:
            continue
        out.append([gx, gy])
    if len(out) > 2 and out[0] == out[-1]:
        out.pop()
    return out


def pack_mask(walk: np.ndarray, district: str, step: int = 1) -> tuple[str, int, int]:
    """1-yalm bits over the 15x15 district. Bit on when the pixel under that yalm is walk."""
    x0, z0 = ORIGINS[district]
    span = 15 * 48
    w = span // step
    h = span // step
    bits = np.zeros(w * h, dtype=np.uint8)
    # Sample the source pixel at each yalm centre.
    for iz in range(h):
        z = z0 + (iz + 0.5) * step
        py = int(round(OY + ((z - z0) / 48) * CELL))
        if not (0 <= py < walk.shape[0]):
            continue
        for ix in range(w):
            x = x0 + (ix + 0.5) * step
            px = int(round(OX + ((x - x0) / 48) * CELL))
            if 0 <= px < walk.shape[1] and walk[py, px]:
                bits[iz * w + ix] = 1
    packed = np.packbits(bits)
    return base64.b64encode(packed.tobytes()).decode("ascii"), w, h


def stand_on(mask_b64: str, w: int, h: int, district: str, x: float, z: float, radius: float) -> bool:
    """Same test as inGraph: centre cell plus eight points on the radius."""
    raw = np.unpackbits(np.frombuffer(base64.b64decode(mask_b64), dtype=np.uint8))
    x0, z0 = ORIGINS[district]

    def at(xx: float, zz: float) -> bool:
        ix = int(np.floor(xx - x0))
        iz = int(np.floor(zz - z0))
        if ix < 0 or iz < 0 or ix >= w or iz >= h:
            return False
        return bool(raw[iz * w + ix])

    if not at(x, z):
        return False
    if radius <= 0:
        return True
    for i in range(8):
        ang = (i / 8) * np.pi * 2
        if not at(x + np.cos(ang) * radius, z + np.sin(ang) * radius):
            return False
    return True
    best = None
    for zz in np.arange(z - 20, z + 14.1, 0.8):
        for xx in np.arange(x - 5.4, x + 5.41, 0.8):
            px, py = world_px(district, xx, zz)
            if 0 <= py < buildings.shape[0] and 0 <= px < buildings.shape[1] and buildings[py, px]:
                d = abs(xx - x)
                best = d if best is None else min(best, d)
    return best


def portrait_hit(buildings: np.ndarray, district: str, x: float, z: float) -> float | None:
    best = None
    for zz in np.arange(z - 20, z + 14.1, 0.8):
        for xx in np.arange(x - 5.4, x + 5.41, 0.8):
            px, py = world_px(district, xx, zz)
            if 0 <= py < buildings.shape[0] and 0 <= px < buildings.shape[1] and buildings[py, px]:
                d = abs(xx - x)
                best = d if best is None else min(best, d)
    return best


def axis_faults(walk: np.ndarray, poly: np.ndarray, district: str) -> list[str]:
    faults = []
    x0, z0 = ORIGINS[district]
    for col in range(15):
        for row in range(15):
            for horiz in (True, False):
                poly_on = True
                mask_on = True
                for t in range(8):
                    gx = col + (t + 0.5) / 8 if horiz else col + 0.5
                    gy = row + 0.5 if horiz else row + (t + 0.5) / 8
                    px, py = gxgy_to_px(gx, gy)
                    if not (0 <= py < walk.shape[0] and 0 <= px < walk.shape[1]) or not poly[py, px]:
                        poly_on = False
                    m = False
                    if 0 <= py < walk.shape[0] and 0 <= px < walk.shape[1]:
                        m = bool(walk[py - 1 : py + 2, px - 1 : px + 2].any())
                    if not m:
                        mask_on = False
                if poly_on and not mask_on:
                    faults.append(f"{chr(65+col)}-{row+1}{'H' if horiz else 'V'}")
    return faults


def trace_district(district: str) -> dict:
    im = np.array(Image.open(ROOT / f"{district}-wiki.png").convert("RGB"))
    cache = ROOT / f"{district}-walls.npy"
    if cache.exists():
        barrier = np.load(cache)
    else:
        barrier = wall_mask(im)
        np.save(cache, barrier)
    inside = city_inside(barrier)
    walk, buildings = carve(district, barrier, inside)
    # Polygons. Epsilon ~0.7 px keeps sub-yalm corners without a square-centre chain.
    eps = 0.55
    rings = contours_of(walk, eps, 12)
    brooms = contours_of(buildings, eps, 20)
    poly = raster_rings(walk.shape, rings)
    # Score on the 1-yalm grid the game assert uses, so a 1px fringe cannot fail a true trace.
    near_walk = ndimage.binary_dilation(walk, iterations=1)
    near_poly = ndimage.binary_dilation(poly, iterations=1)
    # A one-pixel fringe is the rasterizer's boundary, not a different street.
    recall = float(np.logical_and(walk, near_poly).sum()) / max(1, int(walk.sum()))
    precision = float(np.logical_and(poly, near_walk).sum()) / max(1, int(poly.sum()))
    print(
        f"{district} walk {int(walk.sum())} buildings {int(buildings.sum())} "
        f"rings {len(rings)} brooms {len(brooms)} recall {recall:.3f} precision {precision:.3f}"
    )
    if recall < 0.9 or precision < 0.9:
        raise SystemExit(f"{district} overlap {recall:.3f}/{precision:.3f}")
    faults = axis_faults(walk, poly, district)
    if faults:
        raise SystemExit(f"{district} axis streets {faults[:8]}")
    if district == "south":
        for name, x, z in (("ave", 0, 0), ("lion", 0, -38)):
            hit = portrait_hit(buildings, district, x, z)
            print(f"  portrait {name} {hit}")
            if hit is None:
                raise SystemExit(f"no building in the {name} portrait")
    # Points the graph promises.
    checks = {
        "south": [(0, 0, True), (0, -48, True), (0, -38, True), (0, 10, True), (12, -12, True), (0, 48, True), (30, 48, False)],
        "north": [(0, -488, True), (-10, -488, True)],
        "port": [
            (0, -874, True),
            (-312 + 6.608 * 48, -1186 + 6.017 * 48, True),
            (-312 + 6.62 * 48, -1186 + 3.38 * 48, True),
            (-312 + 6.38 * 48, -1186 + 3.38 * 48, True),
            (0, -1046, False),
            (24, -1038, False),
        ],
    }[district]
    for sq in EXITS[district]:
        px, py = gxgy_to_px(*square_center(sq))
        if not walk[py, px]:
            raise SystemExit(f"{district} exit {sq} is not walk")
    for x, z, want in checks:
        px, py = world_px(district, x, z)
        got = bool(walk[py, px])
        if got != want:
            raise SystemExit(f"{district} ({x},{z}) walk {got} wanted {want}")
    mask, mw, mh = pack_mask(walk, district, 1)
    for x, z in ARRIVE[district]:
        if not stand_on(mask, mw, mh, district, x, z, 0.36):
            raise SystemExit(f"{district} arrival ({x},{z}) is not a stand")
    for x, z, want in checks:
        if stand_on(mask, mw, mh, district, x, z, 0) != want:
            raise SystemExit(f"{district} packed ({x},{z}) wanted {want}")
    preview = im.copy()
    preview[walk] = (preview[walk] * 0.4 + np.array([40, 150, 70]) * 0.6).astype(np.uint8)
    preview[buildings] = (preview[buildings] * 0.3 + np.array([180, 50, 45]) * 0.7).astype(np.uint8)
    Image.fromarray(preview).save(ROOT / f"{district}-mask.png")
    np.savez(ROOT / f"{district}-trace.npz", walk=walk, buildings=buildings)
    return {
        "rings": [ring_gxgy(r) for r in rings if len(ring_gxgy(r)) >= 4],
        "buildings": [ring_gxgy(r) for r in brooms if len(ring_gxgy(r)) >= 4],
        "mask": mask,
        "w": mw,
        "h": mh,
    }


def emit(data: dict) -> None:
    parts = [
        "/** Generated by scripts/trace-sandoria.py from the retail atlas plates. Do not edit. */",
        "export const SAN_TRACE = {",
    ]
    for district, payload in data.items():
        rings = payload["rings"]
        buildings = payload["buildings"]
        parts.append(f"  {district}: {{")
        parts.append(f"    w: {payload['w']},")
        parts.append(f"    h: {payload['h']},")
        parts.append(f"    mask: {payload['mask']!r},")
        parts.append(f"    rings: {rings!r},")
        parts.append(f"    buildings: {buildings!r},")
        parts.append("  },")
    parts.append("} as const;\n")
    OUT.write_text("\n".join(parts))
    print("wrote", OUT, "bytes", OUT.stat().st_size)


def main() -> None:
    data = {district: trace_district(district) for district in ("south", "north", "port")}
    emit(data)


if __name__ == "__main__":
    main()
