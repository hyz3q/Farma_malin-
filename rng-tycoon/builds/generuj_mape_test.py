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

def snap(v):
    """Zaokrąglenie do 0.25 (cienkie klocki 0.5 mają środki na .25/.75; usuwa krzywe liczby po skalowaniu)."""
    return math.floor(v * 4 + 0.5) / 4

def P(name, size, pos, color, **kw):
    d = {"name": name, "size": [float(snap(x)) for x in size], "pos": [float(snap(x)) for x in pos], "color": color}
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
    """Masywna ściana w szachownicę (jak skarpa): axis='x' – biegnie wzdłuż X (stałe z=other); axis='z' – wzdłuż Z.
    thick = grubość (ściany graniczne 6–10 studów), na górze czapa trawy z lekkim nawisem."""
    n = max(1, int(round((a1 - a0) / seg)))
    seg = (a1 - a0) / n
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
    # czapa trawy na górze (2 study, szersza o 1 z każdej strony – wygląda jak trawa na skarpie)
    if axis == "x":
        P(f"{prefix}Top", (a1 - a0, 2, thick + 2), ((a0 + a1) / 2, y0 + height + 1, other), WALL_TOP)
    else:
        P(f"{prefix}Top", (thick + 2, 2, a1 - a0), (other, y0 + height + 1, (a0 + a1) / 2), WALL_TOP)

def bush(prefix, x, z, y=1.0):
    P(prefix + "Low", (4, 2, 4), (x, y + 1, z), LEAF[0])
    P(prefix + "Top", (2, 1, 2), (x, y + 2.5, z), LEAF[1])

def bamboo(prefix, x, z, y=1.0):
    for k, (dx, dz, h) in enumerate(((0, 0, 8), (1, 0.5, 6), (-0.5, 1, 7))):
        P(f"{prefix}{k}", (0.5, h, 0.5), (x + dx, y + h / 2, z + dz), "#3E9E2E" if k % 2 else "#58B947")

def tree(prefix, x, z, y=1.0, s=1.0):
    P(prefix + "Trunk", (2 * s, 8 * s, 2 * s), (x, y + 4 * s, z), WOOD[0])
    P(prefix + "Leaves1", (9 * s, 3 * s, 9 * s), (x, y + 9 * s, z), LEAF[0])
    P(prefix + "Leaves2", (6 * s, 3 * s, 6 * s), (x + 1 * s, y + 12 * s, z - 1 * s), LEAF[1])
    P(prefix + "Leaves3", (4 * s, 2 * s, 4 * s), (x - 1 * s, y + 14 * s, z + 1 * s), LEAF[0])

def flowers(prefix, x, z, y=1.0, color="#F28BA0"):
    """Donica z kwiatami zamiast świecących lamp (mapy nie oświetlamy Neonem)."""
    P(prefix + "Pot", (3, 2, 3), (x, y + 1, z), WOOD[1])
    P(prefix + "Soil", (2, 0.5, 2), (x, y + 2.25, z), "#6B4A2B")
    P(prefix + "Bloom", (2, 1, 2), (x, y + 3, z), color)

def rock(prefix, x, z, y=1.0, s=1.0):
    P(prefix + "A", (4 * s, 2 * s, 3 * s), (x, y + 1 * s, z), "#9AA0A6")
    P(prefix + "B", (2 * s, 1 * s, 2 * s), (x + 1 * s, y + 2.5 * s, z), "#B3B8BD")

# ------------------------------------------------------------ jedna działka (lokalnie: szer. X -48..48, głęb. Z -64..64, ulica po stronie -Z)
PW, PD, WT = 96, 128, 8          # szerokość, głębokość, grubość ścian

def build_plot():
    global parts
    saved, parts = parts, []
    hw, hd = PW / 2, PD / 2
    tiles("Grass", -hw, hw, -hd, hd, 16, GRASS)
    # ścieżka z piasku od wejścia do tyłu działki
    P("Path", (12, 0.5, 112), (0, 1.25, -8), SAND[0])
    P("PathEdgeL", (1, 0.5, 112), (-6.5, 1.25, -8), SAND[1])
    P("PathEdgeR", (1, 0.5, 112), (6.5, 1.25, -8), SAND[1])
    # tylna ściana działki: masywna (8 grubości)
    checker_wall("BackWall", "x", -hw, hw, hd + WT / 2, WT, 30)
    # spawn
    P("SpawnRing", (8, 0.5, 8), (0, 1.75, -56), "#FFFFFF")
    P("SpawnPad", (6, 0.5, 6), (0, 2.25, -56), "#3A8CFF", studs=False)
    # brama wejściowa (bez świateł)
    for sx in (-10, 10):
        P(f"GatePillar{sx}", (3, 10, 3), (sx, 6, -61.5), WALL[0])
        P(f"GateCap{sx}", (4, 1, 4), (sx, 11.5, -61.5), WALL_TOP)
    # maszyna dropiąca (z przykładu skilla), przodem do ulicy (-Z)
    MX, MZ = -26, 34
    with open(SKILL_EX, encoding="utf-8") as fh:
        dropper = json.load(fh)["parts"]
    for p in dropper:
        q = dict(p)
        x, y, z = q["pos"]
        q["pos"] = [x + MX, y + 1, z + MZ]
        q["name"] = "Dropper_" + q["name"]
        parts.append(q)
    # taśma od wylotu maszyny do zjadacza (wzdłuż Z)
    cz = MZ - 19
    P("ConveyorBelt", (4, 1, 26), (MX, 2.5, cz), BELT)
    P("ConveyorRailL", (0.5, 1, 26), (MX - 2.25, 3, cz), RAIL)
    P("ConveyorRailR", (0.5, 1, 26), (MX + 2.25, 3, cz), RAIL)
    for k, dz in enumerate((-11, 0, 11)):
        P(f"ConveyorLeg{k}", (3, 1, 1), (MX, 1.5, cz + dz), DARK)
    P("ConveyorRollerFront", (5, 1, 1), (MX, 2.5, cz - 13.5), "#8E969F", shape="Cylinder")
    P("ConveyorRollerBack", (5, 1, 1), (MX, 2.5, cz + 13.5), "#8E969F", shape="Cylinder")
    # zjadacz / skarbonka – na końcu taśmy, „buzią” do taśmy (+Z)
    sz = cz - 18
    P("Seller_Body", (9, 7, 7), (MX, 4.5, sz), "#4CC94C")
    P("Seller_Band", (9.5, 1, 7.5), (MX, 6.5, sz), "#2F9E3A")
    P("Seller_Mouth", (5, 3, 1), (MX, 4, sz + 4), BELT)
    P("Seller_Roof", (10, 2, 8), (MX, 9, sz), RAIL)
    P("Seller_Coin", (0.5, 3, 3), (MX, 11.5, sz), "#FFD23F", shape="Cylinder", rot=[0, 90, 0])
    # przyciski ulepszeń przy ścieżce
    for k, z in enumerate((-44, -34, -24, -14)):
        P(f"UpgradeButton{k}_Rim", (5, 0.5, 5), (12, 1.25, z), DARK)
        P(f"UpgradeButton{k}", (4, 0.5, 4), (12, 1.75, z), "#7CFC00" if k % 2 == 0 else "#FFB020")
    # gablota: 3 podesty
    for k, z in enumerate((20, 30, 40)):
        P(f"Showcase{k}_Base", (5, 2, 5), (28, 2, z), "#9B6BF2")
        P(f"Showcase{k}_Top", (4, 0.5, 4), (28, 3.25, z), RAIL)
    # maszyna do fuzji (bez świecenia)
    P("Fusion_Base", (9, 2, 9), (30, 2, -40), "#5E3FA0")
    P("Fusion_Bowl", (7, 4, 7), (30, 5, -40), "#9B6BF2")
    P("Fusion_Ring", (7.5, 1, 7.5), (30, 7.5, -40), "#E05BFF")
    P("Fusion_PipeL", (1, 6, 1), (26, 6, -44), DARK)
    P("Fusion_PipeR", (1, 6, 1), (34, 6, -44), DARK)
    # dekoracje (bez świecących rzeczy)
    tree("TreeBackL", -38, 52)
    tree("TreeBackR", 38, 52, s=1.5)
    tree("TreeFrontL", -40, -40)
    bamboo("BambooL", -45, -61)
    bamboo("BambooR", 45, -61)
    bush("BushA", 42, 4)
    bush("BushB", -40, -12)
    bush("BushC", 42, 30)
    bush("BushD", -10, 52)
    rock("RockA", 40, -22)
    rock("RockB", -42, 20, s=1.5)
    for k, z in enumerate((-48, -30, -12, 6)):
        flowers(f"PathFlowers{k}", -10, z, color=("#F28BA0", "#FFD166", "#8EC5FF", "#F28BA0")[k])
    plot, parts = parts, saved
    return plot

# ------------------------------------------------------------ cała mapa
def build_map(plot):
    STREET_HALF = 16          # ulica 32 szerokości
    pitch = PW + WT           # działka + ściana między działkami
    zs = [-1.5 * pitch, -0.5 * pitch, 0.5 * pitch, 1.5 * pitch]
    z_end = 2 * pitch         # środek ostatniej ściany (208)
    x_back = STREET_HALF + PD + WT   # tył działki razem z jej tylną ścianą
    # ulica w szachownicę piasku (od ściany południowej do placu)
    tiles("Street", -STREET_HALF, STREET_HALF, -z_end + WT / 2, z_end + WT / 2, 16, SAND)
    # działki: po lewej (x<0) patrzą w +X, po prawej (x>0) patrzą w -X
    for side, yaw in ((-1, -90), (1, 90)):
        for k, z in enumerate(zs):
            cx = side * (STREET_HALF + PD / 2)
            for q in place(plot, (cx, 0, z), yaw):
                q = dict(q)
                q["name"] = f"Plot{'L' if side < 0 else 'R'}{k + 1}_{q['name']}"
                parts.append(q)
        # masywne ściany między działkami (wzdłuż X)
        for k in range(5):
            zw = -z_end + k * pitch
            x0, x1 = (STREET_HALF, x_back) if side > 0 else (-x_back, -STREET_HALF)
            checker_wall(f"Divider{'L' if side < 0 else 'R'}{k}_", "x", x0, x1, zw, WT, 30, seg=17)
    # koniec ulicy (południe) zamknięty ścianą
    checker_wall("SouthWall", "x", -STREET_HALF, STREET_HALF, -z_end, WT, 30)

    # ------------------------- centrum (północ): plac 128 × 96, wieża widoczna z każdego miejsca
    HW = 64
    hz0, hz1 = z_end + WT / 2, z_end + WT / 2 + 96
    tiles("Plaza", -HW, HW, hz0, hz1, 16, ("#8ED46A", "#7CC95A"))
    for sx in (-1, 1):
        checker_wall(f"PlazaWall{'L' if sx < 0 else 'R'}", "z", hz0, hz1, sx * (HW + WT / 2), WT, 30)
    checker_wall("PlazaBackWall", "x", -HW - WT, HW + WT, hz1 + WT / 2, WT, 30, seg=20)
    cz = (hz0 + hz1) / 2
    P("PlazaPath", (32, 0.5, 24), (0, 1.25, hz0 + 12), SAND[0])
    # wieża: schodkowa podstawa, kolumna w paski, wielka kula RNG na szczycie (bez świecenia – wyróżnia ją kolor i wysokość)
    P("Tower_Base1", (28, 2, 28), (0, 2, cz), "#9B6BF2")
    P("Tower_Base2", (22, 2, 22), (0, 4, cz), "#B78CFF")
    P("Tower_Base3", (16, 2, 16), (0, 6, cz), "#9B6BF2")
    P("Tower_Column", (10, 34, 10), (0, 24, cz), "#FFB020")
    for k, y in enumerate((12, 20, 28, 36)):
        P(f"Tower_Stripe{k}", (11, 2, 11), (0, y, cz), "#E05BFF" if k % 2 == 0 else "#3FE0F2")
    P("Tower_Cap", (16, 2, 16), (0, 42, cz), "#9B6BF2")
    P("Tower_Orb", (12, 12, 12), (0, 49, cz), "#3FE0F2", shape="Ball", material="SmoothPlastic", studs=False)
    # sklep (stragan w paski) po lewej, tablice po prawej
    sz = cz - 22
    P("Shop_Counter", (16, 4, 6), (-36, 3, sz), WOOD[0])
    for sx in (-43.5, -28.5):
        P(f"Shop_Post{sx}", (1, 5, 1), (sx, 7.5, sz), WOOD[1])
    for k in range(9):
        P(f"Shop_Roof{k}", (2, 1, 8), (-44 + k * 2, 10.5, sz), "#FFFFFF" if k % 2 else "#F0524B")
    P("Leaderboard_Frame", (18, 12, 2), (36, 11, cz + 26), DARK)
    P("Leaderboard_Screen", (16, 10, 0.5), (36, 11, cz + 24.75), "#1E2A44", material="SmoothPlastic", studs=False)
    for sx in (28.5, 43.5):
        P(f"Leaderboard_Leg{sx}", (1, 4, 1), (sx, 3, cz + 26), DARK)
    P("EventBoard_Frame", (14, 8, 2), (-36, 11, cz + 26), "#F0524B")
    P("EventBoard_Screen", (12, 6, 0.5), (-36, 11, cz + 24.75), "#FFE14D", material="SmoothPlastic", studs=False)
    for sx in (-42.5, -29.5):
        P(f"EventBoard_Leg{sx}", (1, 6, 1), (sx, 4, cz + 26), DARK)
    # staw z liliami
    P("Pond_Rim", (18, 1, 14), (36, 1.5, sz), "#BFA36A")
    P("Pond_Water", (16, 0.5, 12), (36, 2.25, sz), WATER, material="SmoothPlastic", studs=False)
    P("Pond_Lily1", (0.5, 3, 3), (33, 2.75, sz - 1), "#4CAF3A", shape="Cylinder", rot=[0, 0, 90])
    P("Pond_Lily2", (0.5, 2, 2), (39, 2.75, sz + 2), "#4CAF3A", shape="Cylinder", rot=[0, 0, 90])
    # dekoracje placu
    tree("PlazaTreeL", -52, hz1 - 10, s=1.5)
    tree("PlazaTreeR", 52, hz1 - 10, s=1.5)
    for k, (x, z) in enumerate(((-18, hz0 + 6), (18, hz0 + 6), (-18, hz1 - 8), (18, hz1 - 8))):
        flowers(f"PlazaFlowers{k}", x, z, color=("#F28BA0", "#FFD166")[k % 2])
    for sx in (-1, 1):
        bamboo(f"PlazaBamboo{sx}", sx * 59, hz0 + 4)
        bush(f"PlazaBush{sx}", sx * 56, cz)
        rock(f"PlazaRock{sx}", sx * 54, cz + 20)

def main():
    plot = build_plot()
    with open(os.path.join(HERE, "dzialka_test.json"), "w", encoding="utf-8") as fh:
        json.dump({"name": "Dzialka_Test", "studs": True, "expect": {"width": [95, 100], "depth": [128, 140]}, "parts": plot}, fh, indent=1, ensure_ascii=False)
    build_map(plot)
    with open(os.path.join(HERE, "mapa_test.json"), "w", encoding="utf-8") as fh:
        # maxNeonParts 16 = tylko 2 małe lampki-wskaźniki na maszynę × 8 działek
        json.dump({"name": "Mapa_Test", "studs": True, "checks": {"maxParts": 3000, "maxNeonParts": 16}, "parts": parts}, fh, indent=1, ensure_ascii=False)
    print(f"Działka: {len(plot)} klocków, mapa: {len(parts)} klocków")

if __name__ == "__main__":
    main()
