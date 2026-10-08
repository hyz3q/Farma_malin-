#!/usr/bin/env python3
"""Podgląd i sprawdzanie budowli Roblox PRZED wklejeniem do Studio.

Wejście: plik JSON z opisem klocków (format w SKILL.md).
Wyjście (w folderze --out):
  report.txt          – raport problemów (szczeliny, migotanie, wiszące klocki, skala, kolory…)
  preview_<widok>.png – rysunki z kilku stron, z manekinem gracza (5 studów) dla skali
  preview_sheet.png   – wszystkie widoki na jednym obrazku
  build.lua           – gotowy skrypt do Command Bar w Roblox Studio, który buduje to samo

Użycie: python preview.py budowla.json --out podglad/ [--views front,right,top,iso,back] [--no-dummy]
Wymaga: Pillow (pip install pillow)
"""
import argparse, json, math, os, sys
from itertools import combinations

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Brak biblioteki Pillow. Zainstaluj: pip install pillow")

SHAPES = {"Block", "Wedge", "Cylinder", "Ball"}
PLAYER_HEIGHT = 5.0

# ---------------------------------------------------------------- matematyka
def rot_xyz(v, r):
    """Obrót jak CFrame.Angles(rx, ry, rz) w Roblox: najpierw Z, potem Y, potem X (stopnie)."""
    x, y, z = v
    rx, ry, rz = (math.radians(a) for a in r)
    c, s = math.cos(rz), math.sin(rz); x, y = x * c - y * s, x * s + y * c
    c, s = math.cos(ry), math.sin(ry); x, z = x * c + z * s, -x * s + z * c
    c, s = math.cos(rx), math.sin(rx); y, z = y * c - z * s, y * s + z * c
    return (x, y, z)

def add(a, b): return (a[0] + b[0], a[1] + b[1], a[2] + b[2])
def sub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def mul(a, k): return (a[0] * k, a[1] * k, a[2] * k)
def dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def norm(a):
    l = math.sqrt(dot(a, a)) or 1.0
    return (a[0] / l, a[1] / l, a[2] / l)

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

# ---------------------------------------------------------------- bryły
def local_mesh(shape, size):
    """Zwraca (wierzchołki, ściany) w lokalnym układzie klocka (środek = 0)."""
    hx, hy, hz = size[0] / 2, size[1] / 2, size[2] / 2
    if shape == "Wedge":
        # jak WedgePart w Roblox: pełna wysokość z tyłu (+Z), skos opada do przodu (-Z)
        v = [(-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz), (-hx, -hy, hz), (-hx, hy, hz), (hx, hy, hz)]
        f = [[0, 1, 2, 3], [3, 2, 5, 4], [0, 1, 5, 4], [0, 3, 4], [1, 2, 5]]
        return v, f
    if shape == "Cylinder":
        # jak cylinder w Roblox: oś wzdłuż X, średnica = min(Y, Z)
        n, r = 14, min(size[1], size[2]) / 2
        v = []
        for side in (-hx, hx):
            for i in range(n):
                a = 2 * math.pi * i / n
                v.append((side, r * math.cos(a), r * math.sin(a)))
        f = [list(range(n)), list(range(n, 2 * n))]
        f += [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
        return v, f
    if shape == "Ball":
        r, seg, rings = min(size) / 2, 12, 8
        v = [(0, r, 0)]
        for j in range(1, rings):
            phi = math.pi * j / rings
            for i in range(seg):
                th = 2 * math.pi * i / seg
                v.append((r * math.sin(phi) * math.cos(th), r * math.cos(phi), r * math.sin(phi) * math.sin(th)))
        v.append((0, -r, 0))
        f = []
        for i in range(seg):
            f.append([0, 1 + i, 1 + (i + 1) % seg])
        for j in range(rings - 2):
            b = 1 + j * seg
            for i in range(seg):
                f.append([b + i, b + (i + 1) % seg, b + seg + (i + 1) % seg, b + seg + i])
        last, bot = 1 + (rings - 2) * seg, len(v) - 1
        for i in range(seg):
            f.append([last + i, bot, last + (i + 1) % seg])
        return v, f
    v = [(sx * hx, sy * hy, sz * hz) for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    f = [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]]
    return v, f

def world_mesh(p):
    v, f = local_mesh(p["shape"], p["size"])
    wv = [add(p["pos"], rot_xyz(q, p["rot"])) for q in v]
    return wv, f

def aabb(p):
    wv, _ = world_mesh(p)
    xs, ys, zs = zip(*wv)
    return (min(xs), min(ys), min(zs)), (max(xs), max(ys), max(zs))

def rot_abs(size, rot):
    """Rozmiar klocka po obrocie o wielokrotność 90° (wzdłuż osi świata)."""
    v = rot_xyz(size, rot)
    return [abs(round(x, 6)) for x in v]

def axis_aligned(p):
    return all(abs(a / 90 - round(a / 90)) < 1e-6 for a in p["rot"])

# ---------------------------------------------------------------- wczytanie
def load(path):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    errors = []
    parts = []
    for i, raw in enumerate(data.get("parts", [])):
        p = {
            "name": raw.get("name") or f"Part{i + 1}",
            "shape": raw.get("shape", "Block"),
            "size": [float(x) for x in raw.get("size", [1, 1, 1])],
            "pos": tuple(float(x) for x in raw.get("pos", [0, 0, 0])),
            "rot": tuple(float(x) for x in raw.get("rot", [0, 0, 0])),
            "color": raw.get("color", "#A3A2A5"),
            "material": raw.get("material", "Plastic"),
            "transparency": float(raw.get("transparency", 0)),
            "studs": bool(raw.get("studs", data.get("studs", True))),
            "canCollide": bool(raw.get("canCollide", True)),
            "castShadow": bool(raw.get("castShadow", True)),
            "allowFloating": bool(raw.get("allowFloating", False)),
            "_raw_name": raw.get("name"),
        }
        if p["shape"] not in SHAPES:
            errors.append(f"Klocek {p['name']}: nieznany kształt '{p['shape']}' (dozwolone: {', '.join(sorted(SHAPES))}) – rysuję jako Block")
            p["shape"] = "Block"
        if len(p["size"]) != 3 or min(p["size"]) <= 0:
            errors.append(f"Klocek {p['name']}: zły rozmiar {p['size']}")
            p["size"] = [1, 1, 1]
        try:
            hex_rgb(p["color"])
        except Exception:
            errors.append(f"Klocek {p['name']}: zły kolor '{p['color']}' (użyj #RRGGBB)")
            p["color"] = "#FF00FF"
        parts.append(p)
    return data, parts, errors

# ---------------------------------------------------------------- sprawdzanie
def check(data, parts, errors):
    cfg = {"maxParts": 500, "grid": 0.5, "minSize": 0.2, "gapWarn": 0.25}
    cfg.update(data.get("checks", {}))
    L, warn_count = [], 0

    def w(msg):
        nonlocal warn_count
        warn_count += 1
        L.append("  ⚠ " + msg)

    name = data.get("name", "Budowla")
    L.append(f"===== RAPORT: {name} =====")
    for e in errors:
        w(e)
    n = len(parts)
    L.append(f"Klocków: {n} (limit {cfg['maxParts']})")
    if n > cfg["maxParts"]:
        w(f"Za dużo klocków: {n} > {cfg['maxParts']}")
    if not parts:
        L.append("Brak klocków!")
        return "\n".join(L), warn_count

    boxes = [aabb(p) for p in parts]
    lo = tuple(min(b[0][i] for b in boxes) for i in range(3))
    hi = tuple(max(b[1][i] for b in boxes) for i in range(3))
    size = sub(hi, lo)
    L.append(f"Rozmiar całości: {size[0]:.1f} x {size[1]:.1f} x {size[2]:.1f} (szer. X × wys. Y × głęb. Z)")
    L.append(f"Wysokość = {size[1] / PLAYER_HEIGHT:.1f} wysokości gracza (gracz ≈ 5 studów)")
    exp = data.get("expect", {})
    for key, axis, label in (("height", 1, "wysokość"), ("width", 0, "szerokość"), ("depth", 2, "głębokość")):
        if key in exp:
            mn, mx = exp[key]
            if not (mn <= size[axis] <= mx):
                w(f"{label} całości {size[axis]:.1f} poza oczekiwanym zakresem {mn}–{mx}")

    g = cfg["grid"]
    def on_grid(x): return abs(x / g - round(x / g)) < 0.01
    names = {}
    for p in parts:
        names[p["name"]] = names.get(p["name"], 0) + 1
        if not p["_raw_name"] or p["name"] in ("Part", "MeshPart", "Union"):
            w(f"{p['name']}: brak sensownej nazwy")
        if axis_aligned(p):
            # OK, jeśli pozycja i rozmiar są na siatce ALBO krawędzie klocka są na siatce
            # (cienki klocek ma środek „między” liniami, a krawędzie równo – to też porządnie)
            hs = [x / 2 for x in rot_abs(p["size"], p["rot"])]
            edges = [p["pos"][k] - hs[k] for k in range(3)] + [p["pos"][k] + hs[k] for k in range(3)]
            if not (all(on_grid(x) for x in p["pos"]) and all(on_grid(x) for x in p["size"])) and not all(on_grid(x) for x in edges):
                w(f"{p['name']}: poza siatką {g} (pozycja {p['pos']}, rozmiar {p['size']})")
        if min(p["size"]) < cfg["minSize"]:
            w(f"{p['name']}: bardzo mały ({min(p['size'])} < {cfg['minSize']}) – czy będzie widoczny?")
        if min(p["size"]) < 1 and p["canCollide"] and p["castShadow"] and max(p["size"]) < 2:
            L.append(f"  ℹ {p['name']}: mała ozdoba – rozważ canCollide=false i castShadow=false")
    for nm, c in names.items():
        if c > 1:
            L.append(f"  ℹ Nazwa '{nm}' powtarza się {c}× – OK dla powtarzalnych elementów, ale nadaj numery, jeśli skrypt ma je rozróżniać")

    # duplikaty
    seen = {}
    for p in parts:
        key = (p["shape"], tuple(round(x, 3) for x in p["pos"]), tuple(round(x, 3) for x in p["size"]), tuple(round(x, 3) for x in p["rot"]))
        if key in seen:
            w(f"{p['name']}: dokładny duplikat klocka {seen[key]} (migotanie, zbędny klocek)")
        else:
            seen[key] = p["name"]

    # wiszące, szczeliny, migotanie
    eps, tol = 1e-3, 0.05
    touching = {i: False for i in range(n)}
    for i, b in enumerate(boxes):
        if b[0][1] <= lo[1] + tol:
            touching[i] = True
    for i, j in combinations(range(n), 2):
        a, b = boxes[i], boxes[j]
        gaps = [max(b[0][k] - a[1][k], a[0][k] - b[1][k]) for k in range(3)]
        if all(gk <= tol for gk in gaps):
            touching[i] = touching[j] = True
        # mała szczelina: na jednej osi przerwa, na pozostałych zachodzą na siebie
        pos_gaps = [k for k in range(3) if gaps[k] > tol]
        if len(pos_gaps) == 1 and gaps[pos_gaps[0]] < cfg["gapWarn"] and all(gaps[k] < -tol for k in range(3) if k != pos_gaps[0]):
            w(f"Szczelina {gaps[pos_gaps[0]]:.2f} studa między {parts[i]['name']} a {parts[j]['name']} (oś {'XYZ'[pos_gaps[0]]}) – połącz albo zrób wyraźną przerwę")
        # migotanie: oba prostopadłe, zachodzą objętością i mają wspólną płaszczyznę ściany w tę samą stronę
        if parts[i]["shape"] == parts[j]["shape"] == "Block" and axis_aligned(parts[i]) and axis_aligned(parts[j]):
            if all(gk < -eps for gk in gaps):
                for k in range(3):
                    same_min = abs(a[0][k] - b[0][k]) < eps
                    same_max = abs(a[1][k] - b[1][k]) < eps
                    if (same_min or same_max) and parts[i]["color"].lower() != parts[j]["color"].lower() \
                            and parts[i]["transparency"] == 0 and parts[j]["transparency"] == 0:
                        w(f"Migotanie (z-fighting): {parts[i]['name']} i {parts[j]['name']} mają wspólną ścianę na osi {'XYZ'[k]} i różne kolory – przesuń jeden o 0.05 albo zmniejsz")
                        break
    for i, ok in touching.items():
        if not ok and not parts[i]["allowFloating"]:
            w(f"{parts[i]['name']}: niczego nie dotyka (wisi w powietrzu). Jeśli to celowe, dodaj \"allowFloating\": true")

    # kolory
    counts = {}
    vol = {}
    for p in parts:
        c = p["color"].upper()
        counts[c] = counts.get(c, 0) + 1
        v = p["size"][0] * p["size"][1] * p["size"][2]
        vol[c] = vol.get(c, 0) + v
    total = sum(vol.values())
    L.append(f"Kolory: {len(counts)} różnych. Udział (wg objętości):")
    for c, v in sorted(vol.items(), key=lambda kv: -kv[1])[:8]:
        L.append(f"    {c}  {v / total * 100:5.1f}%  ({counts[c]} klocków)")
    top = sorted(vol.values(), reverse=True)
    if top and top[0] / total < 0.35:
        L.append("  ℹ Żaden kolor nie dominuje (<35%) – zasada 60/30/10 sugeruje jeden kolor główny")
    if len(counts) > 10:
        L.append("  ℹ Ponad 10 kolorów – sprawdź, czy budowla nie jest zbyt pstrokata")
    L.append(f"Ostrzeżeń: {warn_count}")
    return "\n".join(L), warn_count

# ---------------------------------------------------------------- rysowanie
VIEWS = {
    "front": ((0, 0, -1), (0, 1, 0)),     # kamera przed budowlą (budowla patrzy w -Z)
    "back": ((0, 0, 1), (0, 1, 0)),
    "right": ((1, 0, 0), (0, 1, 0)),
    "left": ((-1, 0, 0), (0, 1, 0)),
    "top": ((0, 1, 0), (0, 0, -1)),
    "iso": ((0.75, 0.62, -0.85), (0, 1, 0)),
}
LIGHT = norm((-0.45, 0.8, -0.55))

def dummy_parts(lo, hi):
    """Manekin gracza 5 studów obok budowli, dla skali."""
    x = hi[0] + 3
    y0 = lo[1]
    z = (lo[2] + hi[2]) / 2
    c, skin = "#3A6EA5", "#F2C49B"
    def b(n, s, p, col):
        return {"name": n, "shape": "Block", "size": list(s), "pos": p, "rot": (0, 0, 0), "color": col, "transparency": 0, "material": "Plastic"}
    return [
        b("Nogi", (2, 2, 1), (x, y0 + 1, z), "#2B3A4A"),
        b("Tulow", (2, 2, 1), (x, y0 + 3, z), c),
        b("RekaL", (1, 2, 1), (x - 1.5, y0 + 3, z), skin),
        b("RekaP", (1, 2, 1), (x + 1.5, y0 + 3, z), skin),
        b("Glowa", (1.2, 1, 1.2), (x, y0 + 4.5, z), skin),
    ]

def render(parts, view, out_path, with_dummy=True, label=None, size=900):
    d, up = VIEWS[view]
    f = norm(mul(d, -1))                      # kierunek patrzenia (od kamery do budowli)
    r = norm(cross(f, up))
    u = cross(r, f)
    all_parts = list(parts)
    boxes = [aabb(p) for p in parts]
    lo = tuple(min(b[0][i] for b in boxes) for i in range(3))
    hi = tuple(max(b[1][i] for b in boxes) for i in range(3))
    if with_dummy:
        all_parts += dummy_parts(lo, hi)

    polys = []
    pts2 = []
    for p in all_parts:
        wv, faces = world_mesh(p)
        center = p["pos"]
        base = hex_rgb(p["color"])
        neon = str(p.get("material", "")).lower() == "neon"
        alpha = int(255 * (1 - float(p.get("transparency", 0))))
        if alpha <= 5:
            continue
        for face in faces:
            vs = [wv[i] for i in face]
            fc = mul((sum(v[0] for v in vs), sum(v[1] for v in vs), sum(v[2] for v in vs)), 1 / len(vs))
            nrm = norm(cross(sub(vs[1], vs[0]), sub(vs[2], vs[0])))
            if dot(nrm, sub(fc, center)) < 0:
                nrm = mul(nrm, -1)
            if dot(nrm, f) >= -1e-6:      # ściana tyłem do kamery
                continue
            shade = 1.0 if neon else 0.55 + 0.45 * max(0.0, dot(nrm, LIGHT))
            col = tuple(min(255, int(c * shade)) for c in base)
            proj = [(dot(v, r), dot(v, u)) for v in vs]
            depth = max(dot(v, f) for v in vs) * 0.5 + dot(fc, f) * 0.5
            polys.append((depth, proj, col + (alpha,), neon))
            pts2.extend(proj)

    # siatka podłogi (krok 4 study) – rysowana pod wszystkim
    grid_lines = []
    gy = lo[1]
    gx0, gx1 = math.floor((lo[0] - 6) / 4) * 4, math.ceil((hi[0] + 8) / 4) * 4
    gz0, gz1 = math.floor((lo[2] - 6) / 4) * 4, math.ceil((hi[2] + 6) / 4) * 4
    if view not in ("front", "back", "left", "right"):
        for x in range(int(gx0), int(gx1) + 1, 4):
            grid_lines.append(((x, gy, gz0), (x, gy, gz1)))
        for z in range(int(gz0), int(gz1) + 1, 4):
            grid_lines.append(((gx0, gy, z), (gx1, gy, z)))
    else:
        grid_lines.append(((gx0, gy, gz0), (gx1, gy, gz0)) if view in ("front", "back") else ((gx0, gy, gz0), (gx0, gy, gz1)))
    for a, b in grid_lines:
        pts2.append((dot(a, r), dot(a, u)))
        pts2.append((dot(b, r), dot(b, u)))

    xs, ys = [p[0] for p in pts2], [p[1] for p in pts2]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    margin = 50
    scale = min((size - 2 * margin) / max(maxx - minx, 1e-6), (size - 2 * margin - 30) / max(maxy - miny, 1e-6))
    ox = margin + ((size - 2 * margin) - (maxx - minx) * scale) / 2
    oy = margin + 30 + ((size - 2 * margin - 30) - (maxy - miny) * scale) / 2
    def to_px(pt):
        return (ox + (pt[0] - minx) * scale, size - (oy + (pt[1] - miny) * scale))

    img = Image.new("RGBA", (size, size), (196, 228, 245, 255))
    dr = ImageDraw.Draw(img, "RGBA")
    if view in ("front", "back", "left", "right"):
        gpx = to_px((0, dot((0, gy, 0), u)))[1]
        dr.rectangle([0, gpx, size, size], fill=(150, 205, 120, 255))
    for a, b in grid_lines:
        dr.line([to_px((dot(a, r), dot(a, u))), to_px((dot(b, r), dot(b, u)))], fill=(110, 160, 95, 255), width=1)
    for depth, proj, col, neon in sorted(polys, key=lambda t: -t[0]):
        px = [to_px(q) for q in proj]
        dr.polygon(px, fill=col)
        edge = (255, 255, 255, 120) if neon else (0, 0, 0, 70)
        dr.line(px + [px[0]], fill=edge, width=1)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 22)
    except Exception:
        font = ImageFont.load_default()
    names = {"front": "PRZÓD", "back": "TYŁ", "right": "PRAWY BOK", "left": "LEWY BOK", "top": "GÓRA", "iso": "3/4"}
    dr.rectangle([0, 0, size, 36], fill=(255, 255, 255, 220))
    dr.text((12, 7), f"{names[view]}" + (f"  –  {label}" if label else "") + ("   (manekin = gracz 5 studów)" if with_dummy else ""), fill=(20, 30, 40, 255), font=font)
    img.convert("RGB").save(out_path)
    return out_path

# ---------------------------------------------------------------- skrypt Luau
def lua_num(x):
    s = f"{x:.3f}".rstrip("0").rstrip(".")
    return s if s not in ("-0", "") else "0"

def to_luau(data, parts):
    name = data.get("name", "Budowla")
    L = []
    L.append(f"-- Budowla: {name} (wygenerowane przez roblox-build-preview)")
    L.append("-- Wklej do Command Bar w Roblox Studio (View -> Command Bar) i naciśnij Enter.")
    L.append("-- Budowla pojawi się tam, gdzie patrzy kamera. Ctrl+Z cofa całość.")
    L.append('local ChangeHistory = game:GetService("ChangeHistoryService")')
    L.append("local cam = workspace.CurrentCamera")
    L.append("local focus = cam and cam.Focus.Position or Vector3.new(0, 0, 0)")
    L.append("local origin = CFrame.new(math.round(focus.X), 0, math.round(focus.Z))")
    L.append("")
    L.append('local model = Instance.new("Model")')
    L.append(f'model.Name = "{name}"')
    L.append("")
    L.append("local function klocek(nazwa, ksztalt, rozmiar, pozycja, obrot, kolor, material, przezr, studsy, kolizja, cien)")
    L.append("\tlocal p")
    L.append('\tif ksztalt == "Wedge" then')
    L.append('\t\tp = Instance.new("WedgePart")')
    L.append("\telse")
    L.append('\t\tp = Instance.new("Part")')
    L.append('\t\tif ksztalt == "Cylinder" then p.Shape = Enum.PartType.Cylinder')
    L.append('\t\telseif ksztalt == "Ball" then p.Shape = Enum.PartType.Ball end')
    L.append("\tend")
    L.append("\tp.Name = nazwa")
    L.append("\tp.Size = rozmiar")
    L.append("\tp.CFrame = origin * CFrame.new(pozycja) * CFrame.Angles(math.rad(obrot.X), math.rad(obrot.Y), math.rad(obrot.Z))")
    L.append("\tp.Color = kolor")
    L.append("\tlocal ok = pcall(function() p.Material = Enum.Material[material] end)")
    L.append("\tif not ok then p.Material = Enum.Material.Plastic end")
    L.append("\tif studsy then")
    L.append("\t\tp.TopSurface = Enum.SurfaceType.Studs")
    L.append("\t\tp.BottomSurface = Enum.SurfaceType.Inlet")
    L.append("\telse")
    L.append("\t\tp.TopSurface = Enum.SurfaceType.Smooth")
    L.append("\t\tp.BottomSurface = Enum.SurfaceType.Smooth")
    L.append("\tend")
    L.append("\tp.Transparency = przezr")
    L.append("\tp.CanCollide = kolizja")
    L.append("\tp.CastShadow = cien")
    L.append("\tp.Anchored = true")
    L.append("\tp.Parent = model")
    L.append("\treturn p")
    L.append("end")
    L.append("")
    biggest, bigvol = None, -1
    for p in parts:
        r, g, b = hex_rgb(p["color"])
        L.append(
            f'klocek("{p["name"]}", "{p["shape"]}", Vector3.new({", ".join(lua_num(x) for x in p["size"])}), '
            f'Vector3.new({", ".join(lua_num(x) for x in p["pos"])}), Vector3.new({", ".join(lua_num(x) for x in p["rot"])}), '
            f'Color3.fromRGB({r}, {g}, {b}), "{p["material"]}", {lua_num(p["transparency"])}, '
            f'{str(p["studs"]).lower()}, {str(p["canCollide"]).lower()}, {str(p["castShadow"]).lower()})'
        )
        v = p["size"][0] * p["size"][1] * p["size"][2]
        if v > bigvol:
            biggest, bigvol = p["name"], v
    L.append("")
    L.append(f'model.PrimaryPart = model:FindFirstChild("{biggest}")')
    L.append("model.Parent = workspace")
    L.append("pcall(function() game:GetService(\"Selection\"):Set({ model }) end)")
    L.append(f'pcall(function() ChangeHistory:SetWaypoint("Dodano budowlę: {name}") end)')
    L.append(f'print("Gotowe: {name}, klocków: {len(parts)}")')
    return "\n".join(L) + "\n"

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("json")
    ap.add_argument("--out", default="podglad")
    ap.add_argument("--views", default="front,right,top,iso")
    ap.add_argument("--no-dummy", action="store_true")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    data, parts, errors = load(a.json)
    report, warns = check(data, parts, errors)
    with open(os.path.join(a.out, "report.txt"), "w", encoding="utf-8") as fh:
        fh.write(report + "\n")
    print(report)
    if not parts:
        return 1
    views = [v.strip() for v in a.views.split(",") if v.strip() in VIEWS]
    files = [render(parts, v, os.path.join(a.out, f"preview_{v}.png"), not a.no_dummy, data.get("name")) for v in views]
    ims = [Image.open(fp) for fp in files]
    cols = 2 if len(ims) > 1 else 1
    rows = math.ceil(len(ims) / cols)
    w, h = ims[0].size
    sheet = Image.new("RGB", (cols * w, rows * h), (255, 255, 255))
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * w, (i // cols) * h))
    sheet_path = os.path.join(a.out, "preview_sheet.png")
    sheet.save(sheet_path)
    with open(os.path.join(a.out, "build.lua"), "w", encoding="utf-8") as fh:
        fh.write(to_luau(data, parts))
    print(f"\nPodgląd: {sheet_path}\nSkrypt do Studio: {os.path.join(a.out, 'build.lua')}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
