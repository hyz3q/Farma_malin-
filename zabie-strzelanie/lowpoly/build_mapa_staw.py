# Low poly mapa "Staw" do Żabiego Strzelania – arena wokół stawu z wyspą na środku.
# Uruchom: python build_mapa_staw.py <folder_wyjsciowy> [plik_zaby.blend do podglądu skali]
import bpy, math, sys, os, random
from mathutils import Vector, Euler, noise
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lowpoly_wspolne import maluj, eksport, trojkaty, hex_srgb

args = [a for a in sys.argv[1:] if not a.endswith(".py")]
OUT = args[0] if args else "."
ZABA = args[1] if len(args) > 1 else None
os.makedirs(OUT, exist_ok=True)
R = math.radians
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

ROZMIAR = 150          # mapa 150 x 150 (żaba ma ok. 4,5 wysokości)
STAW_R = 24            # promień stawu
WYSPA_R = 7            # wyspa na środku stawu
WODA_Z = -0.7

obiekty = []

def wysokosc(x, y):
    d = math.hypot(x, y)
    n = noise.noise(Vector((x * 0.045, y * 0.045, 0.3)))
    h = n * 1.2
    if d < WYSPA_R:                                     # wyspa
        h = 0.35 + n * 0.3
    elif d < STAW_R:                                    # niecka stawu
        t = (d - WYSPA_R) / (STAW_R - WYSPA_R)
        h = -2.6 * math.sin(t * math.pi) ** 0.6 + 0.3 * (1 - t)
    elif d < STAW_R + 5:                                # łagodny brzeg
        h *= (d - STAW_R) / 5
    krawedz = max(abs(x), abs(y))
    if krawedz > ROZMIAR / 2 - 16:                      # wzgórza dookoła = ściana areny
        t = (krawedz - (ROZMIAR / 2 - 16)) / 16
        h += t * t * 11 + abs(n) * 3 * t
    return h

# ---------- TEREN ----------
bpy.ops.mesh.primitive_grid_add(x_subdivisions=44, y_subdivisions=44, size=ROZMIAR)
teren = bpy.context.object; teren.name = "Teren"
for v in teren.data.vertices:
    x, y = v.co.x, v.co.y
    if abs(x) < ROZMIAR / 2 - 0.1: x += random.uniform(-0.9, 0.9)
    if abs(y) < ROZMIAR / 2 - 0.1: y += random.uniform(-0.9, 0.9)
    v.co = Vector((x, y, wysokosc(x, y) + random.uniform(-0.15, 0.15)))
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.quads_convert_to_tris(); bpy.ops.object.mode_set(mode="OBJECT")
def kolor_terenu(p):
    c = p.center; d = math.hypot(c.x, c.y)
    if c.z < WODA_Z - 0.25: return "DnoStawu"
    if d < STAW_R + 2.5 or (d < WYSPA_R + 1.5): return "Piasek"
    if c.z > 5: return "Wzgorze"
    return random.choice(["TrawaJasna", "TrawaSrednia", "TrawaSrednia", "TrawaCiemna"])
maluj(teren, kolor_terenu, OUT)
obiekty.append(teren)

# ---------- WODA ----------
bpy.ops.mesh.primitive_circle_add(vertices=24, radius=STAW_R + 1.2, fill_type="TRIFAN", location=(0, 0, WODA_Z))
woda = bpy.context.object; woda.name = "Woda"; maluj(woda, "Woda", OUT); obiekty.append(woda)

# ---------- NARZĘDZIA ----------
def ziemia(x, y):
    hit, loc, *_ = scene.ray_cast(bpy.context.evaluated_depsgraph_get(), Vector((x, y, 60)), Vector((0, 0, -1)))
    return loc.z if hit else wysokosc(x, y)
def czesc(kolor, loc, scale=(1, 1, 1), rot=(0, 0, 0)):
    o = bpy.context.object; o.location = loc; o.scale = scale; o.rotation_euler = Euler([R(a) for a in rot])
    maluj(o, kolor, OUT); return o
def polacz(czesci, nazwa):
    bpy.ops.object.select_all(action="DESELECT")
    for c in czesci: c.select_set(True)
    bpy.context.view_layer.objects.active = czesci[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    bpy.ops.object.join(); o = bpy.context.object; o.name = nazwa
    bpy.ops.object.shade_flat(); obiekty.append(o); return o
def poszarp(o, sila):
    for v in o.data.vertices: v.co += Vector([random.uniform(-sila, sila) for _ in range(3)])
licznik = {}
def nazwa(n):
    licznik[n] = licznik.get(n, 0) + 1; return f"{n}{licznik[n]}"

def drzewo(x, y, s=1.0, typ=None):
    z = ziemia(x, y) - 0.3; typ = typ or random.choice(["sosna", "okragle"])
    c = []
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.55 * s, depth=4 * s); c.append(czesc("Kora", (x, y, z + 2 * s)))
    if typ == "sosna":
        for i, (r, h) in enumerate(((3.2, 3.6), (2.5, 3.2), (1.7, 2.8))):
            bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=r * s, depth=h * s)
            c.append(czesc("Liscie" if i != 1 else "LiscieJasne", (x, y, z + (3.6 + i * 1.9) * s), rot=(0, 0, random.uniform(0, 60))))
    else:
        for (dx, dy, dz, r, k) in ((0, 0, 5.2, 2.6, "Liscie"), (1.3, 0.6, 4.3, 1.8, "LiscieJasne"), (-1.2, -0.7, 4.6, 1.9, "LiscieJasne")):
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r * s)
            o = czesc(k, (x + dx * s, y + dy * s, z + dz * s), rot=(random.uniform(0, 40), 0, random.uniform(0, 60))); poszarp(o, 0.15)
    polacz(c, nazwa("Drzewo"))

def kamien(x, y, s=1.0):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=s)
    o = czesc(random.choice(["Kamien", "KamienCiemny"]), (x, y, ziemia(x, y) + s * 0.2),
              (random.uniform(1, 1.5), random.uniform(0.8, 1.2), random.uniform(0.55, 0.8)), (0, 0, random.uniform(0, 90)))
    poszarp(o, s * 0.18); polacz([o], nazwa("Kamien"))

def lilia(x, y, s=1.0, kwiat=False):
    c = []
    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=1.6 * s, depth=0.15); c.append(czesc("Lilia", (x, y, WODA_Z + 0.08), rot=(0, 0, random.uniform(0, 360))))
    if kwiat:
        for a in range(0, 360, 60):
            v = Vector((0.45 * s, 0, 0)); v.rotate(Euler((0, 0, R(a))))
            bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.3 * s, depth=0.6 * s)
            c.append(czesc("Kwiat", Vector((x, y, WODA_Z + 0.4)) + v, rot=(0, 35, a)))
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.25 * s); c.append(czesc("KwiatSrodek", (x, y, WODA_Z + 0.5)))
    polacz(c, nazwa("Lilia"))

def palki(x, y):
    c = []
    for i in range(random.randint(3, 5)):
        dx, dy, h = random.uniform(-0.8, 0.8), random.uniform(-0.8, 0.8), random.uniform(2.2, 3.6)
        z = ziemia(x + dx, y + dy); tilt = (random.uniform(-8, 8), random.uniform(-8, 8), 0)
        bpy.ops.mesh.primitive_cylinder_add(vertices=4, radius=0.08, depth=h); c.append(czesc("Trzcina", (x + dx, y + dy, z + h / 2), rot=tilt))
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.2, depth=0.8); c.append(czesc("Palka", (x + dx, y + dy, z + h - 0.3), rot=tilt))
    polacz(c, nazwa("Palki"))

def skrzynka(x, y, s=1.6):
    """Mystery box: żółta skrzynka z ramą i znakiem zapytania."""
    z = ziemia(x, y); c = []
    bpy.ops.mesh.primitive_cube_add(size=2 * s); c.append(czesc("Skrzynka", (x, y, z + s)))
    for (sx, sy, sz) in ((1, 1, 0), (1, -1, 0), (-1, 1, 0), (-1, -1, 0)):
        bpy.ops.mesh.primitive_cube_add(size=1); c.append(czesc("SkrzynkaRama", (x + sx * s, y + sy * s, z + s), (0.35, 0.35, 2 * s + 0.1)))
    for sz in (0, 2 * s):
        for (sx, sy, w, d) in ((0, 1, 2 * s, 0.35), (0, -1, 2 * s, 0.35), (1, 0, 0.35, 2 * s), (-1, 0, 0.35, 2 * s)):
            bpy.ops.mesh.primitive_cube_add(size=1); c.append(czesc("SkrzynkaRama", (x + sx * s, y + sy * s, z + sz), (w + 0.1, d + 0.1, 0.35)))
    for side in ((0, -1), (0, 1), (1, 0), (-1, 0)):   # "?" z klocków na 4 bokach
        rot = (0, 0, 0 if side[0] == 0 else 90); off = Vector((side[0], side[1], 0)) * (s + 0.03)
        def q(dx, dz, w, h):
            v = Vector((dx, 0, 0)); v.rotate(Euler([R(a) for a in rot]))
            bpy.ops.mesh.primitive_cube_add(size=1); c.append(czesc("Znak", Vector((x, y, z + s)) + off + v + Vector((0, 0, dz)), (w, 0.08, h), rot))
        k = s / 1.6
        for (dx, dz, w, h) in ((0, 0.62, 0.9, 0.24), (-0.36, 0.45, 0.24, 0.3), (0.36, 0.33, 0.24, 0.6), (0.12, 0.05, 0.5, 0.24), (0, -0.22, 0.24, 0.4), (0, -0.66, 0.26, 0.26)):
            q(dx * k, dz * k, w * k, h * k)
    polacz(c, nazwa("MysteryBox"))

def pien(x, y, dl=7, rot=0):
    z = ziemia(x, y); c = []
    bpy.ops.mesh.primitive_cylinder_add(vertices=7, radius=0.9, depth=dl); c.append(czesc("Kora", (x, y, z + 0.7), rot=(90, 0, rot)))
    for k in (-1, 1):
        v = Vector((0, k * dl / 2, 0)); v.rotate(Euler((0, 0, R(rot))))
        bpy.ops.mesh.primitive_cylinder_add(vertices=7, radius=0.75, depth=0.1); c.append(czesc("Deska", Vector((x, y, z + 0.7)) + v * 1.005, rot=(90, 0, rot)))
    polacz(c, nazwa("Pien"))

def grzyb(x, y, s=1.0):
    z = ziemia(x, y); c = []
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.25 * s, depth=1.0 * s); c.append(czesc("GrzybNoga", (x, y, z + 0.5 * s)))
    bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=0.8 * s, radius2=0.2 * s, depth=0.6 * s); c.append(czesc("Grzyb", (x, y, z + 1.2 * s)))
    polacz(c, nazwa("Grzyb"))

def most(x0, x1, y=0):
    c = []; n = int(abs(x1 - x0) / 1.1)
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        bpy.ops.mesh.primitive_cube_add(size=1)
        c.append(czesc("Deska" if i % 2 else "DeskaCiemna", (x, y + random.uniform(-0.1, 0.1), 0.35), (0.95, 4.2, 0.25), (0, 0, random.uniform(-3, 3))))
    for x in (x0, (x0 + x1) / 2, x1):
        for sy in (-1.9, 1.9):
            bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.28, depth=4); c.append(czesc("DeskaCiemna", (x, y + sy, -1.3)))
    polacz(c, nazwa("Most"))

# ---------- ROZSTAWIENIE ----------
most(-STAW_R - 2, -WYSPA_R + 0.5); most(WYSPA_R - 0.5, STAW_R + 2)
skrzynka(0, 0, 1.9)                                              # duża skrzynka na wyspie
for a in (30, 90, 150, 210, 270, 330):                            # skrzynki dookoła areny
    skrzynka(math.cos(R(a)) * 42, math.sin(R(a)) * 42)
for a, rot in ((0, 90), (60, 150), (120, 30), (180, 90), (240, 150), (300, 30)):   # pnie jako osłony
    pien(math.cos(R(a)) * 34, math.sin(R(a)) * 34, rot=rot)
for i in range(9):                                                # lilie na stawie
    a = R(i * 40 + random.uniform(-10, 10)); d = random.uniform(WYSPA_R + 3, STAW_R - 3)
    if abs(math.sin(a) * d) < 3.5: continue                       # nie na moście
    lilia(math.cos(a) * d, math.sin(a) * d, random.uniform(0.8, 1.3), kwiat=i % 3 == 0)
for i in range(12):                                               # pałki przy brzegu
    a = R(i * 30 + 15 + random.uniform(-8, 8)); d = STAW_R + random.uniform(-1.5, 1)
    if abs(math.sin(a) * d) < 4: continue
    palki(math.cos(a) * d, math.sin(a) * d)
miejsca = []
def wolne(x, y, r):
    return all(math.hypot(x - a, y - b) > r + rr for a, b, rr in miejsca)
for typ, ile, rmin, rmax, rr in (("drzewo", 26, 48, 68, 5), ("kamien", 22, 28, 66, 3), ("grzyb", 10, 27, 55, 1.5)):
    n = 0; proby = 0
    while n < ile and proby < 500:
        proby += 1; a = random.uniform(0, 2 * math.pi); d = random.uniform(rmin, rmax)
        x, y = math.cos(a) * d, math.sin(a) * d
        if max(abs(x), abs(y)) > ROZMIAR / 2 - 4 or not wolne(x, y, rr): continue
        if any(math.hypot(x - math.cos(R(b)) * 42, y - math.sin(R(b)) * 42) < 5 for b in range(30, 360, 60)): continue
        miejsca.append((x, y, rr)); n += 1
        if typ == "drzewo": drzewo(x, y, random.uniform(0.9, 1.4))
        elif typ == "kamien": kamien(x, y, random.uniform(0.9, 2.2))
        else: grzyb(x, y, random.uniform(0.8, 1.4))
print("TROJKATY", trojkaty(obiekty), "OBIEKTY", len(obiekty))

# ---------- EKSPORT (przed dodaniem rzeczy do podglądu) ----------
eksport(obiekty, OUT, "Mapa_Staw")

# ---------- PODGLĄDY ----------
if ZABA and os.path.exists(ZABA):
    with bpy.data.libraries.load(ZABA) as (src, dst): dst.objects = [n for n in src.objects]
    bpy.ops.object.empty_add(location=(-9, -30, ziemia(-9, -30))); pivot = bpy.context.object
    pivot.rotation_euler = (0, 0, R(160)); pivot.scale = (1.3, 1.3, 1.3)   # żaba patrzy w stronę kamery
    for o in dst.objects:
        if o and o.type == "MESH":
            scene.collection.objects.link(o); o.parent = pivot
scene.render.engine = "CYCLES"; scene.cycles.samples = 24
scene.render.resolution_x = 1280; scene.render.resolution_y = 720
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.62, 0.82, 0.97, 1)
bpy.ops.object.light_add(type="SUN"); sun = bpy.context.object; sun.data.energy = 3.2; sun.rotation_euler = Euler((R(45), R(8), R(-35)))
bpy.ops.object.camera_add(); cam = bpy.context.object; scene.camera = cam
for n, pos, tgt, lens in (("calosc", (70, -95, 80), (0, 0, 0), 32), ("blisko", (6, -52, 12), (-4, -18, 1), 30), ("wyspa", (-30, -30, 18), (0, 0, 1), 35)):
    cam.location = pos; cam.data.lens = lens; cam.rotation_euler = (Vector(tgt) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(OUT, "mapa_" + n + ".png"); bpy.ops.render.render(write_still=True)
print("GOTOWE")
