# Low poly żaba (Bandyta) – buduje model w Blenderze (bpy), renderuje podglądy i eksportuje FBX/OBJ.
# Uruchom: python build_zaba_lowpoly.py <folder_wyjsciowy>
import bpy, bmesh, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lowpoly_wspolne import maluj, eksport, trojkaty, PALETA, hex_srgb
from mathutils import Vector, Euler

OUT = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith(".py") else "."
os.makedirs(OUT, exist_ok=True)
R = math.radians

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

COLORS = ["Cialo", "Brzuch", "Ciemne", "OczyBiale", "Zrenice", "Pysk", "Policzki",
          "Kapelusz", "KapeluszPasek", "Bron", "BronStal", "BronRekojesc"]
def hex_rgba(h):
    return [x ** 2.2 for x in hex_srgb(h)] + [1]

groups = {k: [] for k in COLORS}

def finish(obj, group, loc, scale=(1, 1, 1), rot=(0, 0, 0)):
    obj.location = loc; obj.scale = scale; obj.rotation_euler = Euler([R(a) for a in rot])
    groups[group].append(obj)
    return obj
def sphere(group, loc, scale, seg=8, rings=6, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=1)
    return finish(bpy.context.object, group, loc, scale, rot)
def ico(group, loc, scale, sub=1, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1)
    return finish(bpy.context.object, group, loc, scale, rot)
def cyl(group, loc, r, h, verts=8, rot=(0, 0, 0), scale=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h)
    return finish(bpy.context.object, group, loc, scale or (1, 1, 1), rot)
def cone(group, loc, r1, r2, h, verts=6, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=h)
    return finish(bpy.context.object, group, loc, (1, 1, 1), rot)
def box(group, loc, size, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1)
    return finish(bpy.context.object, group, loc, size, rot)

# ---------- CIAŁO (żaba siedzi, patrzy w stronę -Y) ----------
sphere("Cialo", (0, 0.35, 1.45), (1.55, 1.75, 1.2), seg=10, rings=7, rot=(-28, 0, 0))   # tułów pochylony
sphere("Cialo", (0, -0.75, 2.55), (1.75, 1.45, 0.95), seg=10, rings=7)                 # głowa
sphere("Brzuch", (0, -1.05, 1.45), (1.15, 0.75, 1.05), seg=8, rings=6, rot=(-15, 0, 0))  # brzuch
for sx in (-1, 1):
    # oczy: guzy, białka, źrenice
    sphere("Cialo", (sx * 0.95, -1.15, 3.12), (0.62, 0.6, 0.45), seg=8, rings=6)  # guz oka niższy, żeby nie wystawał zza kapelusza
    sphere("OczyBiale", (sx * 1.0, -1.5, 3.22), (0.4, 0.3, 0.38), seg=8, rings=6)
    box("Zrenice", (sx * 1.02, -1.78, 3.2), (0.34, 0.06, 0.2))
    # policzki
    box("Policzki", (sx * 1.2, -1.95, 2.3), (0.34, 0.05, 0.16), rot=(0, 0, sx * -15))
    # nozdrza
    box("Ciemne", (sx * 0.25, -2.15, 2.85), (0.12, 0.05, 0.07))
    # tylne nogi: udo, goleń, stopa z palcami
    sphere("Cialo", (sx * 1.45, 0.55, 0.85), (0.65, 1.35, 0.7), seg=8, rings=5, rot=(-12, 0, 0))
    sphere("Cialo", (sx * 1.75, -0.25, 0.35), (0.42, 0.95, 0.35), seg=6, rings=4, rot=(0, 0, sx * 8))
    for i, a in enumerate((-22, 0, 22)):
        v = Vector((0, -0.75, 0)); v.rotate(Euler((0, 0, R(a)))); base = Vector((sx * 1.9, -0.95, 0.12))
        cone("Ciemne", base + v * 0.5, 0.2, 0.08, 0.75, verts=5, rot=(90, 0, a))
        box("Ciemne", base + v, (0.28, 0.2, 0.14), rot=(0, 0, a))
    # przednie łapki
    cyl("Cialo", (sx * 0.95, -1.45, 0.75), 0.24, 1.3, verts=6, rot=(-12, sx * 6, 0))
    for i, a in enumerate((-25, 0, 25)):
        v = Vector((0, -0.45, 0)); v.rotate(Euler((0, 0, R(a)))); base = Vector((sx * 1.0, -1.75, 0.1))
        cone("Ciemne", base + v * 0.5, 0.14, 0.06, 0.5, verts=5, rot=(90, 0, a))
        box("Ciemne", base + v, (0.2, 0.15, 0.1), rot=(0, 0, a))
# plamki na grzbiecie
for (x, y, z, s) in ((0.55, 0.9, 2.35, 0.32), (-0.6, 1.3, 2.0, 0.26), (0.1, 1.5, 1.6, 0.22), (-0.3, 0.2, 2.62, 0.2)):
    ico("Ciemne", (x, y, z), (s, s, s * 0.45), sub=1, rot=(-40, 0, 0))
# pysk: szeroka ciemna linia z kącikami
box("Pysk", (0, -2.08, 2.38), (2.0, 0.12, 0.13), rot=(-8, 0, 0))
for sx in (-1, 1):
    box("Pysk", (sx * 1.02, -1.98, 2.46), (0.14, 0.12, 0.2), rot=(0, 0, sx * -20))

# ---------- AKCESORIA: kapelusz kowbojski (przechylony do tyłu) i rewolwer bokiem w pysku ----------
hat_tilt = (-14, 0, -6)
def on_hat(local):
    v = Vector(local); v.rotate(Euler([R(a) for a in hat_tilt])); return Vector((0, -0.85, 3.62)) + v
cyl("Kapelusz", on_hat((0, 0, 0)), 1.0, 0.12, verts=10, rot=hat_tilt, scale=(2.05, 1.8, 1))   # rondo
cyl("Kapelusz", on_hat((0, 0.05, 0.5)), 0.95, 0.9, verts=8, rot=hat_tilt, scale=(1.0, 0.85, 1))  # główka
box("Kapelusz", on_hat((0, 0.05, 0.98)), (0.35, 1.0, 0.12), rot=hat_tilt)                        # wgniecenie
cyl("KapeluszPasek", on_hat((0, 0.05, 0.18)), 0.97, 0.2, verts=8, rot=hat_tilt, scale=(1.02, 0.87, 1))
for sx in (-1, 1):  # podwinięte boki ronda
    box("Kapelusz", on_hat((sx * 1.95, 0, 0.18)), (0.14, 1.9, 0.34), rot=(hat_tilt[0], 0, hat_tilt[2] + sx * 0))

# rewolwer obrócony o 90° w prawo (patrząc z przodu): muszka w prawo, rękojeść w lewo; lufa do przodu
g = Vector((0.7, -2.08, 2.4))  # pistolet w prawym kąciku pyska (patrząc z przodu)
box("Bron", g + Vector((0, 0.1, 0)), (0.3, 0.9, 0.5))                   # tył/rama w pysku
cyl("BronStal", g + Vector((0, -0.55, 0)), 0.32, 0.5, verts=6, rot=(90, 0, 0))  # bęben
cyl("BronStal", g + Vector((0.12, -1.35, 0)), 0.13, 1.3, verts=6, rot=(90, 0, 0))  # lufa
box("Bron", g + Vector((0.12, -2.0, 0)), (0.3, 0.1, 0.3))              # wylot
box("BronRekojesc", g + Vector((-0.55, -0.25, 0)), (0.75, 0.42, 0.36), rot=(0, 0, -12))  # rękojeść w bok
box("Bron", g + Vector((0.38, -1.75, 0)), (0.14, 0.14, 0.08))           # muszka (bokiem)

# ---------- SCALANIE: jeden obiekt na kolor, płaskie cieniowanie ----------
final = []
for name, objs in groups.items():
    if not objs: continue
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if len(objs) > 1: bpy.ops.object.join()
    o = bpy.context.object; o.name = name; o.data.name = name
    maluj(o, name, OUT)
    bpy.ops.object.shade_flat()
    final.append(o)
print("TROJKATY", trojkaty(final), "OBIEKTY", len(final))

# ---------- PODGLĄDY ----------
scene.render.engine = "CYCLES"; scene.cycles.samples = 24; scene.cycles.device = "CPU"
scene.render.resolution_x = 640; scene.render.resolution_y = 640
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.75, 0.88, 0.95, 1); world.node_tree.nodes["Background"].inputs[1].default_value = 0.9
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); ground = bpy.context.object
gm = bpy.data.materials.new("Ziemia"); gm.use_nodes = True; gm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = hex_rgba("#8FC77A"); ground.data.materials.append(gm)
bpy.ops.object.light_add(type="SUN", location=(3, -4, 8)); sun = bpy.context.object; sun.data.energy = 3.5; sun.rotation_euler = Euler((R(40), R(10), R(-30)))
bpy.ops.object.camera_add(); cam = bpy.context.object; scene.camera = cam; cam.data.lens = 50
target = Vector((0, -0.4, 2.0))
for name, pos in {"przod": (0, -13, 2.6), "bok": (13, -0.4, 2.6), "iso": (8, -10, 6)}.items():
    cam.location = pos; cam.rotation_euler = (target - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(OUT, "podglad_" + name + ".png")
    bpy.ops.render.render(write_still=True)
ground.hide_set(True); bpy.data.objects.remove(ground)

# ---------- EKSPORT ----------
eksport(final, OUT, "Zaba_LowPoly")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "Zaba_LowPoly.blend"))
print("GOTOWE")
