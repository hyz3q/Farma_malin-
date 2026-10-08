#!/usr/bin/env python3
"""Generuje testową mapę gry „Tycoon, but every drop is RNG” jako JSON dla skilla roblox-build-preview.
Zasady z master promptu: skala (gracz 5 studów), działki-pasy po bokach ulicy, ściany w szachownicę
ze studsami, jaskrawe kolory, kolorowe centrum widoczne z daleka, maszyna → taśma → zjadacz.

Uruchom:  python generuj_mape_test.py      → dzialka_test.json i mapa_test.json
Potem:    python ../../.claude/skills/roblox-build-preview/scripts/preview.py mapa_test.json --out podglad_mapa
"""
import json, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_EX = os.path.join(HERE, "..", "..", ".claude", "skills", "roblox-build-preview", "examples", "dropper.json")

# ------------------------------------------------------------ paleta (60/30/10)
GRASS = ("#6CC24A", "#5DB23F")        # szachownica trawy
SAND = ("#F2D98A", "#E6C873")         # ulica / ścieżki
WALL = ("#E8954A", "#D9803A")         # ściany w szachownicę (ciepły pomarańcz)
WALL_TOP = "#7EDB55"                  # jasna obwódka trawy na górze ściany
DARK = "#3E444B"
BELT = "#2B2D33"
RAIL = "#FFC93C"
WOOD = ("#9A6534", "#7E5128")
LEAF = ("#4FB83A", "#3E9E2E")
WATER = "#4FB3E0"

parts = []

def P(name, size, pos, color, **kw):
    d = {"name": name, "size": [float(x) for x in size], "pos": [float(x) for x in pos], "color": color}
    d.update(kw)
    parts.append(d)
    return d

# ------------------------------------------------------------ transformacja (obrót wokół Y o 0/90/-90/180 + przesunięcie)
def place(local_parts, offset, yaw):
    out = []
    a = math.radians(yaw)
    c, s = round(math.cos(a)), round(math.sin(a))
    for p in local_parts:
        x, y, z = p["pos"]
        # jak CFrame.Angles(0, yaw, 0): x' = x c + z s ; z' = -x s + z c
        q = dict(p)
        q["pos"] = [x * c + z * s + offset[0], y + offset[1], -x * s + z * c + offset[2]]
        rx, ry, rz = p.get("rot", [0, 0, 0])
        assert rx == 0, "obrót X nieobsługiwany przy przenoszeniu"
        q["rot"] = [0, (ry + yaw + 180) % 360 - 180, rz]
        out.append(q)
    return out

# ------------------------------------------------------------ elementy
def tiles(prefix, x0, x1, z0, z1, tile, colors, y_top=1.0, thick=1.0):
    nx, nz = int((x1 - x0) / tile), int((z1 - z0) / tile)
    for i in range(nx):
        for j in range(nz):
            P(f"{prefix}{i}_{j}", (tile, thick, tile), (x0 + tile * (i + 0.5), y_top - thick / 2, z0 + tile * (j + 0.5)), colors[(i + j) % 2])

def checker_wall(prefix, axis, a0, a1, other, thick, height, seg=16, y0=0.0):
    """Ściana w szachownicę: axis='x' – ściana biegnie wzdłuż X (stałe z=other); axis='z' – wzdłuż Z."""
    n = int(round((a1 - a0) / seg))
    bands = 2
    bh = height / bands
    for i in range(n):
        for b in range(bands):
            c = WALL[(i + b) % 2]
            mid = a0 + seg * (i + 0.5)
            yc = y0 + bh * (b + 0.5)
            if axis == "x":
                P(f"{prefix}{i}_{b}", (seg, bh, thick), (mid, yc, other), c)
            else:
                P(f"{prefix}{i}_{b}", (thick, bh, seg), (other, yc, mid), c)
    # jasna obwódka trawy na górze ściany
    if axis == "x":
        P(f"{prefix}Top", (a1 - a0, 1, thick + 1), ((a0 + a1) / 2, y0 + height + 0.5, other), WALL_TOP)
    else:
        P(f"{prefix}Top", (thick + 1, 1, a1 - a0), (other, y0 + height + 0.5, (a0 + a1) / 2), WALL_TOP)

def bush(prefix, x, z, y=1.0):
    P(prefix + "Low", (4, 2, 4), (x, y + 1, z), LEAF[0])
    P(prefix + "Top", (2, 1, 2), (x, y + 2.5, z), LEAF[1])

def bamboo(prefix, x, z, y=1.0):
    for k, (dx, dz, h) in enumerate(((0, 0, 8), (1, 0.5, 6), (-0.5, 1, 7))):
        P(f"{prefix}{k}", (0.5, h, 0.5), (x + dx, y + h / 2, z + dz), "#3E9E2E" if k % 2 else "#58B947")

def tree(prefix, x, z, y=1.0, s=1.0):
    P(prefix + "Trunk", (2 * s, 8 * s, 2 * s), (x, y + 4 * s, z), WOOD[0])
    P(prefix + "Leaves1", (9 * s, 3 * s, 9 * s), (x, y + 9 * s, z), LEAF[0])
    P(prefix + "Leaves2", (6 * s, 3 * s, 6 * s), (x + 1 * s, y + 12 * s, z - 0.5 * s), LEAF[1])
    P(prefix + "Leaves3", (4 * s, 2 * s, 4 * s), (x - 1 * s, y + 14.5 * s, z + 0.5 * s), LEAF[0])

def lamp(prefix, x, z, y=1.0, color="#FFE14D"):
    P(prefix + "Post", (1, 6, 1), (x, y + 3, z), DARK)
    P(prefix + "Head", (2, 1.5, 2), (x, y + 6.75, z), color, material="Neon", castShadow=False)

# ------------------------------------------------------------ jedna działka (lokalnie: szer. X -32..32, głęb. Z -48..48, ulica po stronie -Z)
def build_plot():
    global parts
    saved, parts = parts, []
    tiles("Grass", -32, 32, -48, 48, 16, GRASS)
    # ścieżka z piasku od wejścia do maszyny fuzji
    P("Path", (10, 0.5, 80), (2, 1.25, -8), SAND[0])
    P("PathEdgeL", (1, 0.5, 80), (-3.5, 1.25, -8), SAND[1])
    P("PathEdgeR", (1, 0.5, 80), (7.5, 1.25, -8), SAND[1])
    # tylna ściana działki w szachownicę
    checker_wall("BackWall", "x", -32, 32, 49, 2, 30)
    # spawn
    P("SpawnRing", (8, 0.5, 8), (2, 1.75, -40), "#FFFFFF")
    P("SpawnPad", (6, 0.5, 6), (2, 2.25, -40), "#3A8CFF", studs=False)
    # brama wejściowa
    for sx in (-6, 10):
        P(f"GatePillar{sx}", (2, 8, 2), (sx, 5, -46), WALL[0])
        P(f"GateLight{sx}", (2, 1, 2), (sx, 9.5, -46), "#FFE14D", material="Neon")
    # maszyna dropiąca (z przykładu skilla), z przodu na ulicę (-Z)
    with open(SKILL_EX, encoding="utf-8") as fh:
        dropper = json.load(fh)["parts"]
    for p in dropper:
        q = dict(p)
        x, y, z = q["pos"]
        q["pos"] = [x - 14, y + 1, z + 22]
        q["name"] = "Dropper_" + q["name"]
        parts.append(q)
    # taśma od wylotu maszyny do zjadacza (wzdłuż Z)
    P("ConveyorBelt", (4, 1, 26), (-14, 2.5, 3), BELT)
    P("ConveyorRailL", (0.5, 1, 26), (-16.25, 3, 3), RAIL)
    P("ConveyorRailR", (0.5, 1, 26), (-11.75, 3, 3), RAIL)
    for k, z in enumerate((-8, 3, 14)):
        P(f"ConveyorLeg{k}", (3, 1, 1), (-14, 1.5, z), DARK)
    P("ConveyorRollerFront", (5, 1, 1), (-14, 2.5, -10.5), "#8E969F", shape="Cylinder")
    P("ConveyorRollerBack", (5, 1, 1), (-14, 2.5, 16.5), "#8E969F", shape="Cylinder")
    # zjadacz / skarbonka – na końcu taśmy, „buzią” do taśmy (+Z)
    P("Seller_Body", (9, 7, 7), (-14, 4.5, -15), "#4CC94C")
    P("Seller_Band", (9.5, 1, 7.5), (-14, 6.5, -15), "#2F9E3A")
    P("Seller_Mouth", (5, 3, 1), (-14, 4, -11), BELT)
    P("Seller_Roof", (10, 2, 8), (-14, 9, -15), RAIL)
    P("Seller_Coin", (0.5, 3, 3), (-14, 11.5, -15), "#FFD23F", material="Neon", shape="Cylinder", rot=[0, 90, 0])
    # przyciski ulepszeń przy ścieżce (4 × 4, płaskie)
    for k, z in enumerate((-30, -22, -14, -6)):
        P(f"UpgradeButton{k}_Rim", (5, 0.5, 5), (13, 1.25, z), DARK)
        P(f"UpgradeButton{k}", (4, 0.5, 4), (13, 1.75, z), "#7CFC00" if k % 2 == 0 else "#FFB020")
    # gablota: 3 podesty
    for k, z in enumerate((14, 22, 30)):
        P(f"Showcase{k}_Base", (5, 2, 5), (18, 2, z), "#9B6BF2")
        P(f"Showcase{k}_Top", (4, 0.5, 4), (18, 3.25, z), RAIL)
    # maszyna do fuzji
    P("Fusion_Base", (9, 2, 9), (20, 2, -32), "#5E3FA0")
    P("Fusion_Bowl", (7, 4, 7), (20, 5, -32), "#9B6BF2")
    P("Fusion_Ring", (7.5, 1, 7.5), (20, 7.5, -32), "#E05BFF", material="Neon")
    P("Fusion_PipeL", (1, 6, 1), (16, 6, -36), DARK)
    P("Fusion_PipeR", (1, 6, 1), (24, 6, -36), DARK)
    # dekoracje
    tree("TreeBackLeft", -26, 40)
    bamboo("BambooL", -29, -44)
    bamboo("BambooR", 29, -44)
    bush("BushA", 28, 4)
    bush("BushB", -26, -30)
    bush("BushC", 28, 40)
    for k, z in enumerate((-36, -18, 0, 18)):
        lamp(f"PathLamp{k}", 8.5, z, y=1.5)
    plot, parts = parts, saved
    return plot

# ------------------------------------------------------------ cała mapa
def build_map(plot):
    STREET_HALF = 12          # ulica 24 szerokości
    PLOT_W, PLOT_D, GAP = 64, 96, 2
    pitch = PLOT_W + GAP
    zs = [-1.5 * pitch, -0.5 * pitch, 0.5 * pitch, 1.5 * pitch]
    z_end = 2 * pitch         # koniec ulicy (132)
    # ulica w szachownicę piasku
    tiles("Street", -STREET_HALF, STREET_HALF, -z_end, z_end, 12, SAND)
    # działki: po lewej (x<0) patrzą w +X, po prawej (x>0) patrzą w -X
    for side, yaw in ((-1, -90), (1, 90)):
        for k, z in enumerate(zs):
            cx = side * (STREET_HALF + PLOT_D / 2)
            for q in place(plot, (cx, 0, z), yaw):
                q = dict(q)
                q["name"] = f"Plot{'L' if side < 0 else 'R'}{k + 1}_{q['name']}"
                parts.append(q)
        # ściany między działkami (wzdłuż X)
        for k in range(5):
            zw = -z_end + k * pitch
            x0, x1 = (STREET_HALF, STREET_HALF + PLOT_D) if side > 0 else (-STREET_HALF - PLOT_D, -STREET_HALF)
            checker_wall(f"Divider{'L' if side < 0 else 'R'}{k}_", "x", x0, x1, zw, GAP, 30)
    # tył ulicy (południe) zamknięty ścianą
    checker_wall("SouthWall", "x", -STREET_HALF - PLOT_D, STREET_HALF + PLOT_D, -z_end - 2, 2, 30)

    # ------------------------- centrum (północ): plac 96 × 80, wieża widoczna z każdego miejsca
    HW = 48                                 # pół szerokości placu
    hz0, hz1 = z_end + 1, z_end + 81        # plac zaczyna się ZA ścianą działek (bez nachodzenia)
    tiles("Plaza", -HW, HW, hz0, hz1, 16, ("#8ED46A", "#7CC95A"))
    for sx in (-1, 1):
        checker_wall(f"PlazaWall{'L' if sx < 0 else 'R'}", "z", hz0, hz1, sx * (HW + 1), 2, 30)
    checker_wall("PlazaBackWall", "x", -HW - 2, HW + 2, hz1 + 1, 2, 30, seg=20)
    cz = (hz0 + hz1) / 2
    # ścieżka z ulicy do wieży
    P("PlazaPath", (24, 0.5, 20), (0, 1.25, hz0 + 10), SAND[0])
    # wieża: schodkowa podstawa, kolumna w paski, świecąca „kula RNG” na szczycie (najwyższy punkt mapy)
    P("Tower_Base1", (28, 2, 28), (0, 2, cz), "#9B6BF2")
    P("Tower_Base2", (22, 2, 22), (0, 4, cz), "#B78CFF")
    P("Tower_Base3", (16, 2, 16), (0, 6, cz), "#9B6BF2")
    P("Tower_Column", (10, 34, 10), (0, 24, cz), "#FFB020")
    for k, y in enumerate((12, 20, 28, 36)):
        P(f"Tower_Stripe{k}", (11, 2, 11), (0, y, cz), "#E05BFF" if k % 2 == 0 else "#3FE0F2")
    P("Tower_Cap", (16, 2, 16), (0, 42, cz), "#9B6BF2")
    P("Tower_Orb", (12, 12, 12), (0, 49, cz), "#3FE0F2", shape="Ball", material="Neon")
    # sklep (stragan w paski) po lewej, tablica rankingu po prawej
    sz = cz - 18
    P("Shop_Counter", (16, 4, 6), (-30, 3, sz), WOOD[0])
    for sx in (-37.5, -22.5):
        P(f"Shop_Post{sx}", (1, 5, 1), (sx, 7.5, sz), WOOD[1])
    for k in range(9):
        P(f"Shop_Roof{k}", (2, 1, 8), (-38 + k * 2, 10.5, sz), "#FFFFFF" if k % 2 else "#F0524B")
    P("Leaderboard_Frame", (18, 12, 2), (30, 11, cz + 20), DARK)
    P("Leaderboard_Screen", (16, 10, 0.5), (30, 11, cz + 18.75), "#1E2A44", material="Neon")
    for sx in (22.5, 37.5):
        P(f"Leaderboard_Leg{sx}", (1, 4, 1), (sx, 3, cz + 20), DARK)
    # tablica wydarzeń
    P("EventBoard_Frame", (14, 8, 2), (-30, 11, cz + 20), "#F0524B")
    P("EventBoard_Screen", (12, 6, 0.5), (-30, 11, cz + 18.75), "#FFE14D", material="Neon")
    for sx in (-36.5, -23.5):
        P(f"EventBoard_Leg{sx}", (1, 6, 1), (sx, 4, cz + 20), DARK)
    # staw z liliami
    P("Pond_Rim", (18, 1, 14), (30, 1.5, sz), "#BFA36A")
    P("Pond_Water", (16, 0.5, 12), (30, 2.25, sz), WATER, material="SmoothPlastic", studs=False)
    P("Pond_Lily1", (0.5, 3, 3), (27, 2.75, sz - 1), "#4CAF3A", shape="Cylinder", rot=[0, 0, 90])
    P("Pond_Lily2", (0.5, 2, 2), (33, 2.75, sz + 2), "#4CAF3A", shape="Cylinder", rot=[0, 0, 90])
    # dekoracje placu
    tree("PlazaTreeL", -40, hz1 - 8)
    tree("PlazaTreeR", 40, hz1 - 8)
    for k, (x, z) in enumerate(((-14, hz0 + 4), (14, hz0 + 4), (-14, hz1 - 6), (14, hz1 - 6))):
        lamp(f"PlazaLamp{k}", x, z, color="#E05BFF")
    for sx in (-1, 1):
        bamboo(f"PlazaBamboo{sx}", sx * 45, hz0 + 4)
        bush(f"PlazaBush{sx}", sx * 44, cz)

def main():
    plot = build_plot()
    with open(os.path.join(HERE, "dzialka_test.json"), "w", encoding="utf-8") as fh:
        json.dump({"name": "Dzialka_Test", "studs": True, "expect": {"width": [60, 70], "depth": [95, 105]}, "parts": plot}, fh, indent=1, ensure_ascii=False)
    build_map(plot)
    with open(os.path.join(HERE, "mapa_test.json"), "w", encoding="utf-8") as fh:
        json.dump({"name": "Mapa_Test", "studs": True, "checks": {"maxParts": 2500}, "parts": parts}, fh, indent=1, ensure_ascii=False)
    print(f"Działka: {len(plot)} klocków, mapa: {len(parts)} klocków")

if __name__ == "__main__":
    main()
