"""Hand trace of San d'Oria streets.

Vertices were read off reference/sandoria/*-wiki.png. The plate is 1024 px,
origin (32, 32) at the A-1 corner, 64 px per square. A grid reading (gx, gy)
is the plate pixel (32 + gx * 64, 32 + gy * 64). This file is that reading.
No ink flood.
"""
from __future__ import annotations

import base64
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from skimage.measure import find_contours

ROOT = Path("/workspace/reference/sandoria")
OUT = Path("/workspace/src/game/sandoria-trace.generated.ts")
OX = OY = 32.0
CELL = 64.0
SPAN = 15 * 48

ORIGINS = {"south": (-264.0, -408.0), "north": (-264.0, -800.0), "port": (-312.0, -1186.0)}


def plate(gx: float, gy: float) -> tuple[float, float]:
    return (OX + gx * CELL, OY + gy * CELL)


def gxgy(px: float, py: float) -> tuple[float, float]:
    return ((px - OX) / CELL, (py - OY) / CELL)


# Street ribbons. Width is yalms. Points are plate pixels via plate(gx, gy).
# gx 0 = column A, gy 0 = row 1.
def street(width: float, pts: list[tuple[float, float]]) -> dict:
    return {"w": width, "pts": [plate(gx, gy) for gx, gy in pts]}


def poly(pts: list[tuple[float, float]]) -> list[tuple[float, float]]:
    return [plate(gx, gy) for gx, gy in pts]


SOUTH = {
    "streets": [
        # Count Caffaule's Manor court, out onto Pikeman's Way.
        street(8, [(1.85, 5.15), (2.55, 5.15), (2.55, 5.85), (1.9, 5.9)]),
        street(9, [(2.15, 5.9), (2.7, 6.25), (3.3, 6.55), (3.9, 6.9), (3.45, 7.45), (2.85, 7.65)]),
        # Pikeman's Way, about 8 yalms, into the F-8 junction, then the Westgate road.
        street(9, [(3.2, 7.45), (4.15, 7.6), (4.9, 7.55), (5.45, 7.55)]),
        street(9, [(4.85, 7.4), (5.25, 7.7), (5.75, 8.25), (5.5, 8.5), (5.5, 8.85), (5.45, 9.2), (5.5, 9.55), (5.5, 10.45)]),
        # East from F-8 into Victory Square's west door.
        street(8, [(5.5, 7.7), (6.15, 7.75), (6.85, 7.9), (7.35, 8.05)]),
        # Watchdog Alley, north gate passage, shop row, Lion Square door.
        street(8, [(6.55, 6.35), (6.85, 6.85), (7.15, 7.3), (7.4, 7.7)]),
        street(9, [(8.15, 6.05), (8.45, 6.45), (8.5, 6.95), (8.35, 7.4)]),
        street(9, [(3.7, 6.2), (4.45, 5.9), (5.15, 5.6), (6.0, 5.4), (6.9, 5.5), (7.7, 5.75), (8.25, 6.05), (8.45, 6.35), (8.7, 6.7)]),
        street(9, [(8.7, 6.7), (9.45, 6.75), (10.15, 6.4), (10.85, 6.1), (11.4, 5.95)]),
        # Victory Square.
        # South yard around the Auction House, Chocobo Stables, Cavalry Way, Eastgate.
        street(8, [(7.35, 8.35), (7.35, 8.95)]),
        street(9, [(8.85, 8.25), (9.45, 8.55), (10.15, 8.9), (10.85, 9.25), (11.29, 9.5), (11.5, 9.55), (11.55, 9.7), (12.05, 10.25)]),
        street(9, [(11.55, 6.15), (11.9, 6.7), (11.55, 7.35), (10.9, 7.9), (10.3, 8.4), (10.15, 8.9)]),
        # Squire Alley and the Residential Area exit.
        street(8, [(12.15, 6.15), (12.75, 6.7), (12.75, 7.15), (12.55, 7.6), (12.05, 7.95)]),
        street(8, [(12.15, 5.7), (12.7, 5.15), (13.25, 4.4), (13.7, 3.85), (14.05, 3.55)]),
    ],
    "plazas": [
        # Manor court.
        poly([(1.6, 4.95), (2.75, 4.95), (2.75, 5.55), (2.15, 5.55), (2.15, 6.05), (1.6, 6.05)]),
        # Star widening on Pikeman's Way.
        poly([(2.55, 7.35), (3.55, 7.3), (3.6, 7.9), (2.6, 7.95)]),
        # Victory Square.
        poly([(7.05, 7.55), (7.4, 7.3), (8.85, 7.28), (9.25, 7.6), (9.3, 8.25), (8.85, 8.6), (7.45, 8.62), (7.05, 8.2)]),
        # Auction yard and Chocobo Stables. Notch keeps the auction block solid.
        poly([(7.05, 8.65), (7.05, 10.95), (8.95, 10.95), (8.95, 8.7), (8.4, 8.7), (8.4, 10.2), (7.65, 10.2), (7.65, 8.65)]),
        # Lion Square.
        poly([(11.15, 5.55), (12.7, 5.45), (12.85, 6.05), (12.45, 6.55), (11.35, 6.5), (11.1, 5.95)]),
    ],
    "hulls": [
        poly([
            (1.35, 4.85), (2.9, 4.8), (3.85, 5.45), (4.7, 5.15), (6.2, 5.05), (7.8, 5.2),
            (8.8, 5.45), (10.2, 5.2), (11.35, 5.15), (12.45, 4.4), (13.9, 3.45), (14.2, 4.15), (13.6, 5.35),
            (13.55, 6.8), (13.15, 7.7), (12.45, 8.35), (12.25, 9.3), (12.2, 10.4), (11.0, 10.05),
            (9.6, 9.55), (8.9, 10.15), (8.35, 11.35), (6.85, 11.3), (6.55, 10.15), (5.15, 10.6),
            (4.55, 9.55), (3.4, 8.85), (2.15, 8.15), (1.45, 7.25), (1.25, 6.15), (1.35, 4.7),
        ]),
    ],
}

NORTH = {
    "streets": [
        # West Ronfaure gate (C-8) along the south wall toward the Parade Ground.
        street(12, [(1.45, 7.5), (2.9, 7.55), (3.8, 7.7), (4.7, 7.9), (5.5, 8.0)]),
        # D-7 postern into that road. The arrival sits on the centreline.
        street(12, [(2.3, 6.45), (3.2, 6.48), (3.71, 6.5), (4.15, 6.85), (4.7, 7.35), (5.15, 7.75)]),
        # Laborman's Way through F-7, Carpenters' Landing, up to the Port gate.
        street(10, [(4.6, 6.5), (5.35, 6.5), (6.2, 6.55), (6.9, 6.85), (7.5, 7.2)]),
        street(11, [(5.4, 6.5), (5.5, 5.5), (5.5, 4.85), (5.5, 4.15), (5.5, 3.4), (5.5, 2.25), (5.5, 1.55)]),
        # Guild row on the west.
        street(8, [(2.45, 2.9), (3.15, 3.4), (3.45, 4.2), (3.3, 5.1), (3.25, 5.9), (3.4, 6.45)]),
        # Drawbridge and the chateau door.
        street(9, [(8.15, 7.15), (8.45, 6.5), (8.5, 5.85), (8.5, 5.15)]),
        # South gate down to Southern San d'Oria, and the consulate lanes.
        street(12, [(8.15, 8.35), (8.35, 8.9), (8.5, 9.29), (8.5, 9.7), (8.5, 10.7)]),
        street(8, [(6.3, 8.35), (6.55, 9.0), (6.9, 9.7), (7.3, 10.35)]),
        street(8, [(8.7, 9.15), (9.15, 9.7), (9.4, 10.3)]),
        # Residential lane and the cathedral bridge. Moat stays off the ribbon.
        street(9, [(9.15, 8.15), (10.1, 8.35), (11.15, 8.5), (12.15, 8.7), (13.15, 9.05), (13.6, 9.45)]),
        street(8, [(8.5, 6.35), (9.4, 6.1), (10.4, 5.9), (11.4, 5.85), (12.3, 5.95), (12.9, 6.1)]),
    ],
    "plazas": [
        # Parade Ground.
        poly([(5.25, 7.25), (6.3, 7.05), (8.7, 7.1), (9.35, 7.5), (9.25, 8.35), (7.6, 8.6), (5.7, 8.35), (5.2, 7.75)]),
    ],
    "hulls": [
        poly([
            (1.85, 2.6), (3.6, 2.55), (4.8, 2.7), (6.15, 2.05), (6.2, 3.2), (5.15, 4.0),
            (4.0, 5.2), (2.9, 6.2), (1.85, 6.7), (1.8, 7.9), (2.6, 8.25), (4.4, 8.15),
            (5.3, 7.7), (6.2, 8.5), (6.9, 10.6), (7.8, 10.7), (8.9, 10.15), (9.3, 9.2),
            (10.6, 8.7), (12.4, 8.5), (14.0, 9.7), (14.15, 8.7), (12.6, 8.2), (11.2, 7.6),
            (9.6, 7.4), (8.7, 6.6), (8.9, 4.9), (7.6, 4.2), (6.2, 3.3), (4.4, 3.6),
            (3.0, 3.2), (1.85, 2.6),
        ]),
        # Cathedral island. The moat is the gap.
        poly([(11.9, 5.25), (13.7, 5.3), (13.85, 6.55), (12.05, 6.5)]),
    ],
}

PORT = {
    "streets": [
        # Gate up from Northern San d'Oria into the quay.
        street(12, [(5.45, 10.7), (5.5, 9.7), (5.5, 9.29), (5.7, 8.7), (6.25, 8.05), (6.5, 7.3), (6.5, 6.55)]),
        # Pier wide enough for the two fishermen on G-4.
        street(16, [(6.5, 5.7), (6.5, 4.5), (6.5, 3.55), (6.5, 3.15)]),
        street(8, [(6.15, 5.15), (6.7, 4.85), (7.15, 5.15), (7.05, 5.6)]),
        street(8, [(6.15, 6.85), (5.6, 7.05), (5.35, 7.5), (5.75, 7.95)]),
        street(10, [(5.6, 9.85), (6.35, 10.05), (6.9, 10.15)]),
        street(10, [(6.35, 6.85), (6.9, 7.35), (7.5, 7.9), (8.3, 8.4), (9.2, 8.75), (10.05, 9.5), (10.35, 10.05)]),
        street(10, [(6.25, 6.9), (5.55, 7.05), (5.3, 7.45), (5.7, 7.9)]),
    ],
    "plazas": [
        # Quay at G-7, covering the crystal.
        poly([(5.85, 5.5), (7.55, 5.45), (7.65, 6.85), (6.85, 7.4), (5.85, 7.1)]),
        # Chocobo is south; this is the north auction yard.
        poly([(6.15, 9.7), (7.45, 9.75), (7.5, 10.6), (6.15, 10.55)]),
    ],
    "hulls": [
        poly([
            (4.85, 4.9), (5.9, 2.95), (7.15, 2.95), (7.25, 4.7), (7.7, 5.4), (7.55, 6.6),
            (8.3, 7.7), (9.4, 8.3), (10.7, 8.7), (10.7, 10.4), (9.0, 10.75), (7.2, 10.85),
            (5.9, 10.5), (5.15, 9.6), (4.75, 8.3), (4.85, 6.6), (4.85, 4.9),
        ]),
    ],
}

# Points that must be walkable. World x,z plus a yalm radius (0 = centre only).
MUST = {
    "south": [
        (0, 0, 0),
        (0, -48, 0),
        (0, 10, 0),
        (12, -12, 0),
        (0, 48, 0),
        (0, 38, 0.36),
        (278, 48, 0.36),
        (144, -86, 0.36),
        (96, 96, 0),
        (30, 48, -1),  # beside the south gate, must stay off the road
    ],
    "north": [
        (0, -488, 0),
        (-10, -488, 0),
        (-144, -440, 0),
        (-134, -440, 0.36),
        (-96, -488, 0),
        (-86, -488, 0.36),
        (144, -344, 0),
        (144, -354, 0.36),
        (0, -680, 0),
        (0, -670, 0.36),
        (144, -536, 0),
        (144, -526, 0.36),
        (0, -584, 0),
        (0, -574, 0.36),
    ],
    "port": [
        (0, -874, 0),
        (-312 + 6.608 * 48, -1186 + 6.017 * 48, 0),
        (-48, -730, 0),
        (-48, -740, 0.36),
        (0, -1018, 0),
        (-312 + 6.62 * 48, -1186 + 3.38 * 48, 0),
        (-312 + 6.38 * 48, -1186 + 3.38 * 48, 0),
        (0, -1046, -1),
        (24, -1038, -1),
    ],
}

# Named walks. Grid points, all one component.
NAMED = {
    "south": {
        "westgate": (5.5, 9.5),
        "pikemans": (3.3, 6.55),
        "watchdog": (6.9, 6.9),
        "victory": (8.15, 7.95),
        "auction": (7.4, 10.5),
        "chocobo": (7.5, 10.5),
        "cavalry": (10.2, 8.95),
        "lion": (12.0, 6.0),
        "squire": (12.75, 7.15),
        "eastgate": (11.5, 9.55),
        "manor": (2.1, 5.3),
        "residential": (13.45, 4.15),
    },
    "north": {
        "westgate": (2.5, 7.5),
        "postern": (3.5, 6.5),
        "parade": (7.2, 7.7),
        "chateau": (8.5, 5.5),
        "landing": (5.5, 4.5),
        "portgate": (5.5, 2.5),
        "southgate": (8.5, 9.5),
        "residential": (13.2, 9.15),
    },
    "port": {
        "quay": (6.5, 6.5),
        "gate": (5.5, 9.5),
        "pier": (6.5, 3.5),
        "fisher": (6.62, 3.38),
        "joulet": (6.38, 3.38),
    },
}


def mask_of(district: str, spec: dict) -> tuple[np.ndarray, np.ndarray]:
    walk = Image.new("1", (SPAN, SPAN), 0)
    draw = ImageDraw.Draw(walk)
    x0, z0 = ORIGINS[district]

    def xy(px: float, py: float) -> tuple[float, float]:
        gx, gy = gxgy(px, py)
        return (gx * 48.0, gy * 48.0)

    for ribbon in spec["streets"]:
        pts = [xy(*p) for p in ribbon["pts"]]
        w = int(round(ribbon["w"]))
        if len(pts) >= 2:
            draw.line(pts, fill=1, width=w, joint="curve")
        r = w / 2
        for x, y in pts:
            draw.ellipse((x - r, y - r, x + r, y + r), fill=1)
    for ring in spec["plazas"] + spec["hulls"]:
        pass
    for ring in spec["plazas"]:
        draw.polygon([xy(*p) for p in ring], fill=1)
    walk_a = np.array(walk, dtype=bool).T  # PIL is x-right y-down; array [x, y] after T is [y, x] if we used (x,y)
    # ImageDraw uses x right, y down, and np.array(image) is [y, x]. Draw used (x=east, y=south), so [row=south, col=east]. Correct already if we don't transpose.
    walk_a = np.array(walk, dtype=bool)
    hull = Image.new("1", (SPAN, SPAN), 0)
    hd = ImageDraw.Draw(hull)
    for ring in spec["hulls"]:
        hd.polygon([xy(*p) for p in ring], fill=1)
    hull_a = np.array(hull, dtype=bool)
    return walk_a, hull_a


def rdp(points: np.ndarray, eps: float) -> np.ndarray:
    if len(points) < 3:
        return points
    pts = points[:-1] if np.hypot(*(points[0] - points[-1])) < 1 else points

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


def contours(mask: np.ndarray, eps: float, min_area: float) -> list[np.ndarray]:
    padded = np.pad(mask, 1)
    rings = []
    for contour in find_contours(padded.astype(np.float32), 0.5):
        pts = np.stack([contour[:, 1] - 1, contour[:, 0] - 1], axis=1)
        if len(pts) < 6:
            continue
        area = 0.5 * np.abs(np.dot(pts[:, 0], np.roll(pts[:, 1], 1)) - np.dot(pts[:, 1], np.roll(pts[:, 0], 1)))
        if area < min_area:
            continue
        simple = rdp(pts, eps)
        if len(simple) >= 4:
            rings.append(simple)
    return rings


def world_cell(district: str, x: float, z: float) -> tuple[int, int]:
    x0, z0 = ORIGINS[district]
    return int(np.floor(x - x0)), int(np.floor(z - z0))


def on(mask: np.ndarray, district: str, x: float, z: float, radius: float) -> bool:
    def at(xx: float, zz: float) -> bool:
        ix, iz = world_cell(district, xx, zz)
        if ix < 0 or iz < 0 or ix >= mask.shape[1] or iz >= mask.shape[0]:
            return False
        return bool(mask[iz, ix])

    if radius < 0:
        return not at(x, z)
    if not at(x, z):
        return False
    if radius <= 0:
        return True
    for i in range(8):
        a = (i / 8) * np.pi * 2
        if not at(x + np.cos(a) * radius, z + np.sin(a) * radius):
            return False
    return True


def components(mask: np.ndarray, limit: int) -> np.ndarray:
    lab, n = ndimage.label(mask)
    if n == 0:
        return mask
    counts = np.bincount(lab.ravel())
    keep = counts >= limit
    keep[0] = False
    return keep[lab]


def pack(mask: np.ndarray) -> str:
    bits = np.packbits(mask.astype(np.uint8).ravel())
    return base64.b64encode(bits.tobytes()).decode("ascii")


def ring_gx(ring: np.ndarray) -> list[list[float]]:
    out = []
    for x, y in ring:
        gx = round(float(x) / 48.0, 3)
        gy = round(float(y) / 48.0, 3)
        if not out or out[-1] != [gx, gy]:
            out.append([gx, gy])
    if len(out) > 2 and out[0] == out[-1]:
        out.pop()
    return out


def ring_gx_fine(ring: np.ndarray) -> list[list[float]]:
    """Cell corners need more than 3 decimals or *48 drifts off the yalm grid."""
    out = []
    for x, y in ring:
        gx = round(float(x) / 48.0, 8)
        gy = round(float(y) / 48.0, 8)
        if not out or out[-1] != [gx, gy]:
            out.append([gx, gy])
    if len(out) > 2 and out[0] == out[-1]:
        out.pop()
    return out


def find_stand(walk: np.ndarray, buildings: np.ndarray, district: str, box: tuple[float, float, float, float]) -> tuple[float, float] | None:
    """A cobble with walls to the left and right, inside the named square."""
    x0, z0 = ORIGINS[district]
    gx0, gx1, gy0, gy1 = box
    best = None
    for gy in np.arange(gy0, gy1, 0.04):
        for gx in np.arange(gx0, gx1, 0.04):
            x = x0 + gx * 48
            z = z0 + gy * 48
            if not on(walk, district, x, z, 0.36):
                continue
            def side(sign: int) -> bool:
                for dist in (3.6, 4.4, 5.2):
                    ix, iz = world_cell(district, x + sign * dist, z)
                    if 0 <= iz < buildings.shape[0] and 0 <= ix < buildings.shape[1] and buildings[iz, ix]:
                        return True
                return False
            if not (side(-1) and side(1)):
                continue
            # Prefer a spot with a building ahead (north, -Z) so the square reads.
            ahead = False
            for dist in (6, 10, 14):
                ix, iz = world_cell(district, x, z - dist)
                if 0 <= iz < buildings.shape[0] and 0 <= ix < buildings.shape[1] and buildings[iz, ix]:
                    ahead = True
                    break
            score = (1 if ahead else 0, -abs(gx - (gx0 + gx1) / 2))
            if best is None or score > best[0]:
                best = (score, x, z)
    if best is None:
        return None
    return best[1], best[2]


def h2(x: float, y: float) -> float:
    n = np.sin(x * 127.1 + y * 311.7) * 43758.5453
    return float(n - np.floor(n))


def poly_area(ring: np.ndarray) -> float:
    if len(ring) < 3:
        return 0.0
    return 0.5 * abs(float(np.dot(ring[:, 0], np.roll(ring[:, 1], 1)) - np.dot(ring[:, 1], np.roll(ring[:, 0], 1))))


def split_labels(buildings: np.ndarray) -> np.ndarray:
    """Break each city block into footprints about 6–14 yalms across."""
    h, w = buildings.shape
    step = 11
    seeds: list[tuple[int, int]] = []
    for iz in range(0, h, step):
        y1 = min(h, iz + step)
        for ix in range(0, w, step):
            x1 = min(w, ix + step)
            sub = buildings[iz:y1, ix:x1]
            if not sub.any():
                continue
            ys, xs = np.nonzero(sub)
            cy = float(ys.mean()) + (h2(ix, iz) - 0.5) * step * 0.45
            cx = float(xs.mean()) + (h2(iz + 4, ix + 1) - 0.5) * step * 0.45
            k = int(np.argmin((ys - cy) ** 2 + (xs - cx) ** 2))
            seeds.append((iz + int(ys[k]), ix + int(xs[k])))
    labels = np.zeros((h, w), dtype=np.int32)
    if not seeds:
        return labels
    marker = np.ones((h, w), dtype=np.uint8)
    seed_id = np.zeros((h, w), dtype=np.int32)
    for i, (sy, sx) in enumerate(seeds, start=1):
        marker[sy, sx] = 0
        seed_id[sy, sx] = i
    _dist, (iy, ix) = ndimage.distance_transform_edt(marker, return_indices=True)
    labels = np.where(buildings, seed_id[iy, ix], 0)
    return labels


def _span(ys: np.ndarray, xs: np.ndarray) -> tuple[int, int, int]:
    return int(len(ys)), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)


def refine_labels(labels: np.ndarray) -> np.ndarray:
    labels = labels.copy()
    for _ in range(8):
        changed = False
        for i in [n for n in np.unique(labels) if n]:
            ys, xs = np.nonzero(labels == i)
            if len(ys) == 0:
                continue
            area, span_x, span_y = _span(ys, xs)
            if area <= 168 and span_x <= 14 and span_y <= 14:
                continue
            cy, cx = float(ys.mean()), float(xs.mean())
            near = int(np.argmin((ys - cy) ** 2 + (xs - cx) ** 2))
            far = int(np.argmax((ys - cy) ** 2 + (xs - cx) ** 2))
            sy1, sx1 = int(ys[near]), int(xs[near])
            sy2, sx2 = int(ys[far]), int(xs[far])
            if sy1 == sy2 and sx1 == sx2:
                continue
            d1 = (ys - sy1) ** 2 + (xs - sx1) ** 2
            d2 = (ys - sy2) ** 2 + (xs - sx2) ** 2
            take = d2 < d1
            if not take.any() or take.all():
                continue
            labels[ys[take], xs[take]] = int(labels.max()) + 1
            changed = True
        if not changed:
            break
    # Fold slivers into a neighbour when the pair still fits in 14 yalms.
    for _ in range(6):
        merged = False
        ids = [n for n in np.unique(labels) if n]
        for i in ids:
            ys, xs = np.nonzero(labels == i)
            if len(ys) == 0:
                continue
            area, span_x, span_y = _span(ys, xs)
            if area >= 42 and min(span_x, span_y) >= 6 and max(span_x, span_y) <= 14:
                continue
            border: dict[int, int] = {}
            for y, x in zip(ys.tolist(), xs.tolist()):
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if ny < 0 or nx < 0 or ny >= labels.shape[0] or nx >= labels.shape[1]:
                        continue
                    other = int(labels[ny, nx])
                    if other == 0 or other == i:
                        continue
                    border[other] = border.get(other, 0) + 1
            if not border:
                continue
            neighbour = max(border, key=border.get)
            oy, ox = np.nonzero(labels == neighbour)
            both_y = np.concatenate([ys, oy])
            both_x = np.concatenate([xs, ox])
            _area, sx, sy = _span(both_y, both_x)
            if sx > 14 or sy > 14 or _area > 175:
                continue
            labels[ys, xs] = neighbour
            merged = True
        if not merged:
            break
    return labels


def inset_ring(ring: np.ndarray, dist: float) -> np.ndarray:
    centre = ring.mean(axis=0)
    out = []
    for p in ring:
        v = p - centre
        length = float(np.hypot(v[0], v[1]))
        if length <= dist + 0.15:
            out.append(p)
        else:
            out.append(p - v / length * dist)
    return np.asarray(out, dtype=np.float64)


def ring_hits_walk(ring: np.ndarray, walk: np.ndarray) -> int:
    im = Image.new("1", (walk.shape[1], walk.shape[0]), 0)
    ImageDraw.Draw(im).polygon([(float(x), float(y)) for x, y in ring], fill=1)
    return int(np.count_nonzero(np.array(im, dtype=bool) & walk))


def cell_loops(cells: set[tuple[int, int]]) -> list[np.ndarray]:
    """Outer edges of a set of yalm cells. One loop per pinch or island."""
    nxt: dict[tuple[int, int], list[tuple[int, int]]] = {}

    def add(a: tuple[int, int], b: tuple[int, int]) -> None:
        nxt.setdefault(a, []).append(b)

    for x, y in cells:
        if (x, y - 1) not in cells:
            add((x, y), (x + 1, y))
        if (x + 1, y) not in cells:
            add((x + 1, y), (x + 1, y + 1))
        if (x, y + 1) not in cells:
            add((x + 1, y + 1), (x, y + 1))
        if (x - 1, y) not in cells:
            add((x, y + 1), (x, y))
    loops = []
    seen: set[tuple[tuple[int, int], tuple[int, int]]] = set()
    for start, dests in list(nxt.items()):
        for first in dests:
            if (start, first) in seen:
                continue
            loop = [start]
            a, b = start, first
            closed = False
            for _ in range(100000):
                if (a, b) in seen:
                    break
                seen.add((a, b))
                loop.append(b)
                if b == start:
                    closed = True
                    break
                options = [c for c in nxt.get(b, []) if (b, c) not in seen]
                if not options:
                    break
                a, b = b, options[0]
            if closed and len(loop) >= 4:
                loops.append(np.asarray(loop[:-1], dtype=np.float64))
    return loops


def ring_area(ring: np.ndarray) -> float:
    return 0.5 * abs(float(np.dot(ring[:, 0], np.roll(ring[:, 1], 1)) - np.dot(ring[:, 1], np.roll(ring[:, 0], 1))))


def point_in_ring(ring: np.ndarray, x: float, z: float) -> bool:
    hit = False
    for i in range(len(ring)):
        ax, az = ring[i - 1]
        bx, bz = ring[i]
        if (az > z) != (bz > z) and x < (bx - ax) * (z - az) / (bz - az) + ax:
            hit = not hit
    return hit


def drop_collinear(ring: np.ndarray) -> np.ndarray:
    if len(ring) < 4:
        return ring
    keep = []
    n = len(ring)
    for i in range(n):
        a = ring[(i - 1) % n]
        b = ring[i]
        c = ring[(i + 1) % n]
        cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
        if abs(cross) > 1e-8:
            keep.append(b)
    if len(keep) < 3:
        return ring
    return np.asarray(keep, dtype=np.float64)


def absorb_slivers(labels: np.ndarray, walk: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """A pinch can leave a 1–3 yalm island. Fold it into a neighbour, or open it as street."""
    labels = labels.copy()
    walk = walk.copy()
    for _ in range(6):
        changed = False
        for i in [n for n in np.unique(labels) if n]:
            ys, xs = np.nonzero(labels == i)
            if len(ys) == 0:
                continue
            cells = set(zip(xs.tolist(), ys.tolist()))
            for loop in cell_loops(cells):
                if ring_area(loop) >= 4:
                    continue
                owned = [(x, y) for x, y in cells if point_in_ring(loop, x + 0.5, y + 0.5)]
                for x, y in owned:
                    moved = False
                    for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                        if ny < 0 or nx < 0 or ny >= labels.shape[0] or nx >= labels.shape[1]:
                            continue
                        other = int(labels[ny, nx])
                        if other != 0 and other != i:
                            labels[y, x] = other
                            moved = True
                            break
                    if not moved:
                        walk[y, x] = True
                        labels[y, x] = 0
                    changed = True
                    cells.discard((x, y))
        if not changed:
            break
    return labels, walk


def orient_positive(ring: np.ndarray) -> np.ndarray:
    """Positive shoelace matches the wall winding the city already draws."""
    s = 0.0
    n = len(ring)
    for i in range(n):
        x0, z0 = float(ring[i - 1, 0]), float(ring[i - 1, 1])
        x1, z1 = float(ring[i, 0]), float(ring[i, 1])
        s += x0 * z1 - x1 * z0
    if s < 0:
        return np.ascontiguousarray(ring[::-1])
    return ring


def max_edge(ring: np.ndarray) -> float:
    best = 0.0
    n = len(ring)
    for i in range(n):
        a = ring[i]
        b = ring[(i + 1) % n]
        best = max(best, float(np.hypot(a[0] - b[0], a[1] - b[1])))
    return best


def simplify_footprint(loop: np.ndarray) -> np.ndarray | None:
    """Drop 1-yalm jogs so a roof stays a handful of corners, never an inset hole."""
    ring = drop_collinear(loop)
    if len(ring) < 4:
        return None
    if not (4 <= poly_area(ring) <= 200):
        return None
    eps = 1.35
    while len(ring) > 6 and eps < 5:
        eps += 0.45
        again = drop_collinear(rdp(ring, eps))
        if len(again) < 4:
            break
        area = poly_area(again)
        if area < 4 or area > 200 or max_edge(again) > 18:
            break
        ring = again
    if len(ring) < 4 or not (4 <= poly_area(ring) <= 200):
        return None
    return orient_positive(ring)


def rect_ring(x: int, y: int, w: int, h: int) -> np.ndarray:
    ring = np.array([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], dtype=np.float64)
    return orient_positive(ring)


def largest_rect(cells: set[tuple[int, int]]) -> tuple[int, int, int, int] | None:
    """Biggest rectangle inside the cells, at most 14 yalms on a side."""
    if not cells:
        return None
    xs = [p[0] for p in cells]
    ys = [p[1] for p in cells]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    width = maxx - minx + 1
    height = maxy - miny + 1
    grid = [[(x + minx, y + miny) in cells for x in range(width)] for y in range(height)]
    hist = [0] * width
    best = None
    for y in range(height):
        for x in range(width):
            hist[x] = hist[x] + 1 if grid[y][x] else 0
        stack: list[int] = []
        for i in range(width + 1):
            hgt = hist[i] if i < width else 0
            while stack and hist[stack[-1]] > hgt:
                hh = hist[stack.pop()]
                left = stack[-1] + 1 if stack else 0
                ww = i - left
                area = hh * ww
                if ww > 14 or hh > 14 or area < 4:
                    continue
                top = y - hh + 1
                cand = (area, -(max(ww, hh)), minx + left, miny + top, ww, hh)
                if best is None or cand[:2] > best[:2]:
                    best = cand
            stack.append(i)
    if best is None:
        return None
    return best[2], best[3], best[4], best[5]


def grid_rings(labels: np.ndarray, walk: np.ndarray, hull: np.ndarray) -> list[np.ndarray]:
    """Cover blocked ground with rectangles no wider than 14. Streets stay cobbles."""
    del labels
    blocked = hull & ~walk
    rings: list[np.ndarray] = []
    claimed = np.zeros(blocked.shape, dtype=bool)
    lab, n = ndimage.label(blocked)
    leftovers: list[tuple[int, int]] = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        cells = set(zip(xs.tolist(), ys.tolist()))
        guard = 0
        while len(cells) >= 4 and guard < 8000:
            guard += 1
            rect = largest_rect(cells)
            if rect is None:
                break
            x, y, w, h = rect
            rings.append(rect_ring(x, y, w, h))
            for yy in range(y, y + h):
                for xx in range(x, x + w):
                    cells.discard((xx, yy))
                    claimed[yy, xx] = True
        leftovers.extend(cells)
    for x, y in leftovers:
        if claimed[y, x]:
            continue
        placed = False
        for hh, ww in ((2, 2), (1, 4), (4, 1), (2, 3), (3, 2), (1, 5), (5, 1)):
            if ww > 14 or hh > 14 or ww * hh < 4:
                continue
            for dy in range(hh):
                for dx in range(ww):
                    x0, y0 = x - dx, y - dy
                    ok = True
                    for iy in range(hh):
                        for ix in range(ww):
                            xx, yy = x0 + ix, y0 + iy
                            if yy < 0 or xx < 0 or yy >= walk.shape[0] or xx >= walk.shape[1] or not blocked[yy, xx]:
                                ok = False
                                break
                        if not ok:
                            break
                    if not ok:
                        continue
                    rings.append(rect_ring(x0, y0, ww, hh))
                    for iy in range(hh):
                        for ix in range(ww):
                            claimed[y0 + iy, x0 + ix] = True
                    placed = True
                    break
                if placed:
                    break
            if placed:
                break
    return rings


def trace(district: str, spec: dict) -> dict:
    walk, hull = mask_of(district, spec)
    walk = components(walk, 20)
    buildings = hull & ~walk
    pocket = ndimage.binary_fill_holes(buildings) & ~buildings & ~walk
    if 0 < int(pocket.sum()) < 80:
        buildings |= pocket
    holes = int((ndimage.binary_fill_holes(buildings) & ~buildings & ~walk).sum())
    buildings = components(buildings, 4)
    lab, n = ndimage.label(buildings)
    counts = np.bincount(lab.ravel())
    small = int(((counts < 4) & (np.arange(len(counts)) > 0)).sum()) if len(counts) else 0
    walk_lab, wn = ndimage.label(walk)
    print(f"{district} walk {int(walk.sum())} yalms buildings {int(buildings.sum())} parts {n} holes {holes} walk-parts {wn} tiny {small}")
    if wn > 1:
        sizes = np.bincount(walk_lab.ravel())
        order = np.argsort(sizes)[::-1]
        for i in order[:6]:
            if i == 0 or sizes[i] == 0:
                continue
            ys, xs = np.nonzero(walk_lab == i)
            print(f"  piece {i} {sizes[i]} gx {xs.mean()/48:.2f} gy {ys.mean()/48:.2f}")
    x0, z0 = ORIGINS[district]
    for name, (gx, gy) in NAMED[district].items():
        x = x0 + gx * 48
        z = z0 + gy * 48
        if not on(walk, district, x, z, 0):
            print(f"  MISS {name} {gx:.2f},{gy:.2f}")
    for x, z, radius in MUST[district]:
        if not on(walk, district, x, z, radius):
            print(f"  MUST {x:.1f},{z:.1f} r {radius}")
    # One component must hold every named point and every positive must-point.
    if wn != 1:
        print(f"  walk is in {wn} pieces")
    labels = refine_labels(split_labels(buildings))
    # Cells the block split dropped (under 4 yalms) are not a roof. Open them if they
    # touch the street; otherwise give them to the neighbouring block.
    bare = hull & ~walk & (labels == 0)
    ys, xs = np.nonzero(bare)
    for y, x in zip(ys.tolist(), xs.tolist()):
        stuck = False
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if ny < 0 or nx < 0 or ny >= labels.shape[0] or nx >= labels.shape[1]:
                continue
            other = int(labels[ny, nx])
            if other:
                labels[y, x] = other
                stuck = True
                break
        if not stuck:
            walk[y, x] = True
    labels, walk = absorb_slivers(labels, walk)
    brooms = grid_rings(labels, walk, hull)
    # Simplified corners miss a few blocked cells and clip a few cobbles.
    # Missed cells become cobbles. Clipped cobbles become part of the building.
    # Paint follows this same walk mask, so a dark cell never stands in for a roof.
    cover = np.zeros_like(walk)
    for ring in brooms:
        x0i = max(0, int(np.floor(ring[:, 0].min())) - 1)
        x1i = min(walk.shape[1] - 1, int(np.ceil(ring[:, 0].max())))
        y0i = max(0, int(np.floor(ring[:, 1].min())) - 1)
        y1i = min(walk.shape[0] - 1, int(np.ceil(ring[:, 1].max())))
        for y in range(y0i, y1i + 1):
            for x in range(x0i, x1i + 1):
                if cover[y, x]:
                    continue
                if point_in_ring(ring, x + 0.5, y + 0.5):
                    cover[y, x] = True
    eaten = walk & cover
    walk[eaten] = False
    skirt = hull & ~walk & ~cover
    # Open only the blocked cells that join the street, so they cannot become a one-cell island.
    opened = 0
    fringe = skirt & ndimage.binary_dilation(walk)
    stack = list(zip(*np.nonzero(fringe)[::-1]))
    seen = set(stack)
    while stack:
        x, y = stack.pop()
        if not skirt[y, x]:
            continue
        walk[y, x] = True
        skirt[y, x] = False
        opened += 1
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if ny < 0 or nx < 0 or ny >= walk.shape[0] or nx >= walk.shape[1]:
                continue
            if skirt[ny, nx] and (nx, ny) not in seen:
                seen.add((nx, ny))
                stack.append((nx, ny))
    left = int(skirt.sum())
    if left:
        # Interior specks the simplified roof missed. Give each one to the street only when it
        # is already gone; otherwise keep it blocked and fail below so a roof has to claim it.
        ys, xs = np.nonzero(skirt)
        for y, x in zip(ys.tolist(), xs.tolist()):
            walk[y, x] = False
    over = int(np.logical_and(walk, cover).sum())
    bare_left = int((hull & ~walk & ~cover).sum())
    verts = sum(len(r) for r in brooms)
    print(
        f"  roofs {len(brooms)} opened {opened} left {left} eaten {int(eaten.sum())} "
        f"bare {bare_left} walk-under {over} verts {verts}"
    )
    if bare_left or over:
        raise SystemExit(f"{district} roof cover bare {bare_left} under {over}")
    x0, z0 = ORIGINS[district]
    lost = []
    for name, (gx, gy) in NAMED[district].items():
        if not on(walk, district, x0 + gx * 48, z0 + gy * 48, 0):
            lost.append(name)
    for mx, mz, radius in MUST[district]:
        if not on(walk, district, mx, mz, radius):
            lost.append(f"{mx:.0f},{mz:.0f}")
    if lost:
        raise SystemExit(f"{district} lost {lost}")
    areas = [poly_area(r) for r in brooms]
    spans = []
    edges = []
    for ring in brooms:
        spans.append(max(float(ring[:, 0].max() - ring[:, 0].min()), float(ring[:, 1].max() - ring[:, 1].min())))
        edges.append(max_edge(ring))
    over = sum(1 for a in areas if a > 200)
    wide = sum(1 for s in spans if s > 14.2)
    long_e = sum(1 for e in edges if e > 18)
    print(
        f"  roofs {len(brooms)} area {min(areas):.0f}-{max(areas):.0f} span {min(spans):.1f}-{max(spans):.1f} "
        f"edge {max(edges):.1f} over {over} wide {wide} long {long_e} avg verts {verts / max(1, len(brooms)):.1f}"
        if areas
        else "  roofs 0"
    )
    if over or not areas or long_e:
        raise SystemExit(f"{district} roofs")
    rings = contours(walk, 1.2, 8)
    # Even-odd ring raster versus the hand mask. 1-cell slack, same as the game assert.
    poly = np.zeros_like(walk)
    for iz in range(walk.shape[0]):
        z = iz + 0.5
        xs = []
        for ring in rings:
            for i in range(len(ring)):
                a = ring[i - 1]
                b = ring[i]
                if (a[1] > z) == (b[1] > z):
                    continue
                xs.append(a[0] + (z - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
        xs.sort()
        for k in range(0, len(xs) - 1, 2):
            x0 = max(0, int(np.floor(xs[k])))
            x1 = min(walk.shape[1] - 1, int(np.floor(xs[k + 1])))
            if x1 >= x0:
                poly[iz, x0 : x1 + 1] = True
    near_p = ndimage.binary_dilation(poly, iterations=1)
    near_w = ndimage.binary_dilation(walk, iterations=1)
    recall = float(np.logical_and(walk, near_p).sum()) / max(1, int(walk.sum()))
    precision = float(np.logical_and(poly, near_w).sum()) / max(1, int(poly.sum()))
    verts = sum(len(r) for r in brooms)
    print(f"  overlap {recall:.3f}/{precision:.3f} building verts {verts}")
    if recall < 0.9 or precision < 0.9:
        raise SystemExit(f"{district} overlap {recall:.3f}/{precision:.3f}")
    walk_lab, wn = ndimage.label(walk)
    sizes = np.bincount(walk_lab.ravel())
    fragments = [int(s) for s in sizes[1:] if 0 < s < 20]
    if wn != 1 or fragments:
        raise SystemExit(f"{district} walk pieces {wn} fragments {fragments[:6]}")
    stands = {}
    if district == "south":
        stands["victory"] = find_stand(walk, buildings, district, (7.15, 7.55, 8.4, 8.9))
        stands["lion"] = find_stand(walk, buildings, district, (11.35, 12.05, 6.15, 6.85))
        ox, oz = ORIGINS[district]
        px = ox + 3.55 * 48
        pz = oz + 7.50 * 48
        stands["pikeman"] = (px, pz) if on(walk, district, px, pz, 0.36) else None
        print("  stands", stands)
    wall = int(hull.sum())
    inside = int(np.logical_and(walk, hull).sum())
    ratio = inside / max(1, wall)
    print(f"  streets {ratio:.3f} of the wall ({inside}/{wall})")
    if not (0.25 <= ratio <= 0.45):
        raise SystemExit(f"{district} street share {ratio:.3f}")
    preview(district, walk, cover)
    return {
        "rings": [ring_gx(r) for r in rings],
        "buildings": [ring_gx_fine(r) for r in brooms],
        "mask": pack(walk),
        "hull": pack(hull),
        "w": SPAN,
        "h": SPAN,
        "wall": wall,
        "inside": inside,
        "stands": stands,
    }


def preview(district: str, walk: np.ndarray, buildings: np.ndarray) -> None:
    im = np.array(Image.open(ROOT / f"{district}-wiki.png").convert("RGB"))
    yy, xx = np.mgrid[0:im.shape[0], 0:im.shape[1]]
    gx = (xx - OX) / CELL
    gy = (yy - OY) / CELL
    ix = np.floor(gx * 48).astype(np.int32)
    iz = np.floor(gy * 48).astype(np.int32)
    valid = (ix >= 0) & (ix < walk.shape[1]) & (iz >= 0) & (iz < walk.shape[0])
    over = im.copy()
    wsel = np.zeros(im.shape[:2], dtype=bool)
    bsel = np.zeros(im.shape[:2], dtype=bool)
    wsel[valid] = walk[iz[valid], ix[valid]]
    bsel[valid] = buildings[iz[valid], ix[valid]]
    over[wsel] = (over[wsel] * 0.45 + np.array([30, 140, 70]) * 0.55).astype(np.uint8)
    over[bsel] = (over[bsel] * 0.55 + np.array([160, 50, 45]) * 0.45).astype(np.uint8)
    Image.fromarray(over).save(ROOT / f"hand-{district}.png")


def emit(data: dict) -> None:
    parts = [
        "/** Hand-traced San d'Oria streets. Generated by scripts/hand-sandoria.py. Do not edit. */",
        "export const SAN_TRACE = {",
    ]
    for district, payload in data.items():
        parts.append(f"  {district}: {{")
        parts.append(f"    w: {payload['w']},")
        parts.append(f"    h: {payload['h']},")
        parts.append(f"    mask: {payload['mask']!r},")
        parts.append(f"    hull: {payload['hull']!r},")
        parts.append(f"    rings: {payload['rings']!r},")
        parts.append(f"    wall: {payload['wall']},")
        parts.append(f"    inside: {payload['inside']},")
        parts.append(f"    buildings: {payload['buildings']!r},")
        parts.append("  },")
    parts.append("} as const;\n")
    OUT.write_text("\n".join(parts))
    print("wrote", OUT, OUT.stat().st_size)


def main() -> None:
    data = {
        "south": trace("south", SOUTH),
        "north": trace("north", NORTH),
        "port": trace("port", PORT),
    }
    emit(data)


if __name__ == "__main__":
    main()
