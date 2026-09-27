# Wspólne rzeczy dla modeli low poly: paleta kolorów w jednej teksturze + eksport do Roblox.
# Każda ściana modelu ma UV wskazujące na jeden kolorowy kwadracik palety, więc po imporcie
# do Roblox Studio model ma kolory od razu (jedna mała tekstura zamiast wielu materiałów).
import bpy, os

PALETA = {
    # żaba
    "Cialo": "#5DBB4A", "Brzuch": "#D3EA8E", "Ciemne": "#3C8B34", "OczyBiale": "#FFFFFF",
    "Zrenice": "#111111", "Pysk": "#4A1622", "Policzki": "#F28BA0",
    "Kapelusz": "#5E3C24", "KapeluszPasek": "#1B1B1B", "Bron": "#2A2D33", "BronStal": "#8E969F", "BronRekojesc": "#7A4A26",
    # mapa
    "TrawaJasna": "#86CF5E", "TrawaSrednia": "#6DBE4B", "TrawaCiemna": "#56A63E", "Wzgorze": "#4E9440",
    "Piasek": "#E6D49A", "DnoStawu": "#8C7A55", "Woda": "#4FB3E0",
    "Kamien": "#9AA0A6", "KamienCiemny": "#737A82", "Kora": "#7A4A26", "Liscie": "#3F9A3A", "LiscieJasne": "#5DBB4A",
    "Lilia": "#4CAF3A", "Kwiat": "#F28BA0", "KwiatSrodek": "#FFD166", "Palka": "#6B4423", "Trzcina": "#7FA84A",
    "Deska": "#B07A45", "DeskaCiemna": "#8A5A30", "Skrzynka": "#FFC93C", "SkrzynkaRama": "#C98E10", "Znak": "#FFFFFF",
    "Grzyb": "#E8453C", "GrzybNoga": "#F4EFE6",
}
CELL, COLS = 8, 8
NAZWY = list(PALETA)
SIZE = CELL * COLS  # 64x64 px, miejsce na 64 kolory

def hex_srgb(h):
    h = h.lstrip("#"); return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]

def uv_koloru(nazwa):
    i = NAZWY.index(nazwa)
    return (((i % COLS) * CELL + CELL / 2) / SIZE, ((i // COLS) * CELL + CELL / 2) / SIZE)

def material_palety(folder):
    if "Paleta" in bpy.data.materials: return bpy.data.materials["Paleta"]
    img = bpy.data.images.new("paleta", SIZE, SIZE, alpha=False)
    px = [0.0] * (SIZE * SIZE * 4)
    for y in range(SIZE):
        for x in range(SIZE):
            i = (y // CELL) * COLS + x // CELL
            c = hex_srgb(PALETA[NAZWY[i]]) if i < len(NAZWY) else [1, 0, 1]
            px[(y * SIZE + x) * 4:(y * SIZE + x) * 4 + 4] = c + [1]
    img.pixels = px
    img.filepath_raw = os.path.join(folder, "paleta.png"); img.file_format = "PNG"; img.save()
    m = bpy.data.materials.new("Paleta"); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes["Principled BSDF"]; bsdf.inputs["Roughness"].default_value = 0.85
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img; tex.interpolation = "Closest"
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    return m

def maluj(obj, kolor_sciany, folder):
    """kolor_sciany: nazwa koloru albo funkcja(polygon) -> nazwa koloru"""
    me = obj.data
    uv = me.uv_layers.active or me.uv_layers.new(name="UV")
    for poly in me.polygons:
        n = kolor_sciany(poly) if callable(kolor_sciany) else kolor_sciany
        u, v = uv_koloru(n)
        for li in poly.loop_indices: uv.data[li].uv = (u, v)
    me.materials.clear(); me.materials.append(material_palety(folder))

def eksport(obiekty, folder, nazwa):
    bpy.ops.object.select_all(action="DESELECT")
    for o in obiekty: o.select_set(True)
    bpy.ops.export_scene.fbx(filepath=os.path.join(folder, nazwa + ".fbx"), use_selection=True,
                             apply_scale_options="FBX_SCALE_ALL", mesh_smooth_type="FACE",
                             path_mode="COPY", embed_textures=True)
    bpy.ops.wm.obj_export(filepath=os.path.join(folder, nazwa + ".obj"), export_selected_objects=True, path_mode="COPY")

def trojkaty(obiekty):
    t = 0
    for o in obiekty:
        o.data.calc_loop_triangles(); t += len(o.data.loop_triangles)
    return t
