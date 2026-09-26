-- Żaba z klocków (bandyta, skórka: Zielona) – Żabie Strzelanie
-- Wklej do Command Bar w Roblox Studio (View -> Command Bar) i naciśnij Enter.
local ChangeHistory = game:GetService("ChangeHistoryService")
local cam = workspace.CurrentCamera
local focus = cam and cam.Focus.Position or Vector3.new(0, 0, 0)
local origin = CFrame.new(focus.X, 0, focus.Z)

local model = Instance.new("Model")
model.Name = "Zaba"

local function klocek(name, size, pos, color, rot)
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.CFrame = origin * CFrame.new(pos) * CFrame.Angles(math.rad(rot.X), math.rad(rot.Y), math.rad(rot.Z))
	p.Color = color
	-- Studsy widać tylko na materiale Plastic
	p.Material = Enum.Material.Plastic
	p.TopSurface = Enum.SurfaceType.Studs
	p.BottomSurface = Enum.SurfaceType.Inlet
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Cialo", Vector3.new(4.2, 2.6, 4.2), Vector3.new(0, 2.5, 0.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("CialoDol", Vector3.new(3.6, 0.7, 3.6), Vector3.new(0, 0.85, 0.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Grzbiet", Vector3.new(3.6, 0.45, 3.6), Vector3.new(0, 4.03, 0.4), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Twarz", Vector3.new(4.2, 1.15, 0.3), Vector3.new(0, 3.23, -1.95), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("WnetrzePyska", Vector3.new(3.5, 0.45, 0.1), Vector3.new(0, 2.42, -1.85), Color3.fromRGB(74, 22, 34), Vector3.new(0, 0, 0))
klocek("KacikPyska_L", Vector3.new(0.35, 0.45, 0.3), Vector3.new(-1.92, 2.42, -1.95), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("KacikPyska_P", Vector3.new(0.35, 0.45, 0.3), Vector3.new(1.93, 2.42, -1.95), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("GornaWarga", Vector3.new(3.7, 0.12, 0.34), Vector3.new(0, 2.7, -1.96), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("DolnaSzczeka", Vector3.new(4.2, 0.5, 0.4), Vector3.new(0, 1.95, -2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Gardlo", Vector3.new(3.4, 0.9, 0.25), Vector3.new(0, 1.25, -1.9), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Nozdrze_L", Vector3.new(0.24, 0.15, 0.1), Vector3.new(-0.4, 3.55, -2.12), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Nozdrze_P", Vector3.new(0.24, 0.15, 0.1), Vector3.new(0.4, 3.55, -2.12), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok1_L", Vector3.new(0.1, 0.8, 0.9), Vector3.new(-2.12, 2.9, 0.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok1_P", Vector3.new(0.1, 0.8, 0.9), Vector3.new(2.12, 2.9, 0.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok2_L", Vector3.new(0.1, 0.55, 0.6), Vector3.new(-2.12, 2, 1.8), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok2_P", Vector3.new(0.1, 0.55, 0.6), Vector3.new(2.12, 2, 1.8), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaTyl1", Vector3.new(0.9, 0.8, 0.1), Vector3.new(0.6, 2.7, 2.45), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaTyl2", Vector3.new(0.55, 0.5, 0.1), Vector3.new(-0.8, 3.3, 2.45), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Oko_L", Vector3.new(1.5, 1.4, 1.5), Vector3.new(-1.25, 4.4, -1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Oko_P", Vector3.new(1.5, 1.4, 1.5), Vector3.new(1.25, 4.4, -1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Bialko_L", Vector3.new(1.15, 1, 0.12), Vector3.new(-1.25, 4.35, -1.8), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Bialko_P", Vector3.new(1.15, 1, 0.12), Vector3.new(1.25, 4.35, -1.8), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Udo_L", Vector3.new(1, 1.7, 2.4), Vector3.new(-2.2, 1.35, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Udo_P", Vector3.new(1, 1.7, 2.4), Vector3.new(2.2, 1.35, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("StopaTyl_L", Vector3.new(1.3, 0.35, 2.2), Vector3.new(-2.35, 0.18, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("StopaTyl_P", Vector3.new(1.3, 0.35, 2.2), Vector3.new(2.35, 0.18, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_L", Vector3.new(0.35, 0.28, 0.7), Vector3.new(-1.9, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_P", Vector3.new(0.35, 0.28, 0.7), Vector3.new(1.9, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_L", Vector3.new(0.35, 0.28, 0.7), Vector3.new(-2.35, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_P", Vector3.new(0.35, 0.28, 0.7), Vector3.new(2.35, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_L", Vector3.new(0.35, 0.28, 0.7), Vector3.new(-2.8, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_P", Vector3.new(0.35, 0.28, 0.7), Vector3.new(2.8, 0.14, -1.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Reka_L", Vector3.new(0.7, 1.5, 0.7), Vector3.new(-1.45, 0.75, -1.45), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Reka_P", Vector3.new(0.7, 1.5, 0.7), Vector3.new(1.45, 0.75, -1.45), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Dlon_L", Vector3.new(1, 0.26, 1.1), Vector3.new(-1.5, 0.13, -1.85), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Dlon_P", Vector3.new(1, 0.26, 1.1), Vector3.new(1.5, 0.13, -1.85), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec1_L", Vector3.new(0.26, 0.22, 0.4), Vector3.new(-1.17, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec1_P", Vector3.new(0.26, 0.22, 0.4), Vector3.new(1.17, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec2_L", Vector3.new(0.26, 0.22, 0.4), Vector3.new(-1.5, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec2_P", Vector3.new(0.26, 0.22, 0.4), Vector3.new(1.5, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec3_L", Vector3.new(0.26, 0.22, 0.4), Vector3.new(-1.83, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec3_P", Vector3.new(0.26, 0.22, 0.4), Vector3.new(1.83, 0.11, -2.55), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Zrenica_L", Vector3.new(0.8, 0.3, 0.08), Vector3.new(-1.3, 4.2, -1.88), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Zrenica_P", Vector3.new(0.8, 0.3, 0.08), Vector3.new(1.3, 4.2, -1.88), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_L", Vector3.new(1.35, 0.55, 0.2), Vector3.new(-1.25, 4.75, -1.83), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -10))
klocek("Powieka_P", Vector3.new(1.35, 0.55, 0.2), Vector3.new(1.25, 4.75, -1.83), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 10))
klocek("Maska", Vector3.new(4.1, 0.65, 0.1), Vector3.new(0, 4.25, -1.77), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_L", Vector3.new(0.1, 0.65, 1.55), Vector3.new(-2.03, 4.25, -1), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_P", Vector3.new(0.1, 0.65, 1.55), Vector3.new(2.03, 4.25, -1), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaTyl", Vector3.new(4.1, 0.65, 0.1), Vector3.new(0, 4.25, -0.23), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaWezel", Vector3.new(0.32, 0.32, 0.2), Vector3.new(2.1, 4.25, -0.23), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaKoniec1", Vector3.new(0.12, 0.75, 0.26), Vector3.new(2.2, 3.82, -0.1), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 22))
klocek("MaskaKoniec2", Vector3.new(0.12, 0.75, 0.26), Vector3.new(2.15, 3.77, 0.18), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, -10))
klocek("ZlotyZab", Vector3.new(0.28, 0.26, 0.1), Vector3.new(1.05, 2.5, -1.92), Color3.fromRGB(242, 193, 78), Vector3.new(0, 0, 0))
klocek("ChustaPas", Vector3.new(4.3, 0.32, 4.3), Vector3.new(0, 1.55, 0.3), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta1", Vector3.new(2.2, 0.36, 0.14), Vector3.new(0, 1.4, -2.1), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta2", Vector3.new(1.4, 0.36, 0.14), Vector3.new(0, 1.04, -2.1), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta3", Vector3.new(0.6, 0.36, 0.14), Vector3.new(0, 0.68, -2.1), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaKropka1", Vector3.new(0.14, 0.14, 0.06), Vector3.new(-0.65, 1.4, -2.19), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka2", Vector3.new(0.14, 0.14, 0.06), Vector3.new(0.6, 1.45, -2.19), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka3", Vector3.new(0.14, 0.14, 0.06), Vector3.new(-0.3, 1.04, -2.19), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka4", Vector3.new(0.14, 0.14, 0.06), Vector3.new(0.35, 0.98, -2.19), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("KapeluszRondo", Vector3.new(3.6, 0.16, 2.5), Vector3.new(0, 4.33, 1.2), Color3.fromRGB(90, 58, 34), Vector3.new(0, 0, 0))
klocek("KapeluszGora", Vector3.new(2.2, 1, 1.8), Vector3.new(0, 4.91, 1.25), Color3.fromRGB(110, 74, 44), Vector3.new(0, 0, 0))
klocek("KapeluszPasek", Vector3.new(2.26, 0.22, 1.86), Vector3.new(0, 4.52, 1.25), Color3.fromRGB(27, 27, 27), Vector3.new(0, 0, 0))
klocek("BronTyl", Vector3.new(0.6, 0.4, 1.2), Vector3.new(0, 2.42, -2.1), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("BronRama", Vector3.new(0.7, 0.75, 1.4), Vector3.new(0, 2.5, -3.25), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Beben", Vector3.new(0.95, 0.7, 0.7), Vector3.new(0, 2.5, -2.95), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Lufa", Vector3.new(0.36, 0.36, 1.6), Vector3.new(0, 2.66, -4.7), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Wylot", Vector3.new(0.44, 0.44, 0.12), Vector3.new(0, 2.66, -5.55), Color3.fromRGB(21, 23, 26), Vector3.new(0, 0, 0))
klocek("Muszka", Vector3.new(0.12, 0.2, 0.18), Vector3.new(0, 2.93, -5.3), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Kurek", Vector3.new(0.18, 0.3, 0.22), Vector3.new(0, 2.93, -2.6), Color3.fromRGB(35, 38, 43), Vector3.new(-25, 0, 0))
klocek("Rekojesc", Vector3.new(0.55, 1.1, 0.65), Vector3.new(0, 1.8, -2.7), Color3.fromRGB(122, 74, 38), Vector3.new(-15, 0, 0))
klocek("Oslona", Vector3.new(0.12, 0.12, 0.55), Vector3.new(0, 1.9, -3.4), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Spust", Vector3.new(0.1, 0.28, 0.1), Vector3.new(0, 2.02, -3.25), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))

-- Wszystkie klocki przyspawane do ciała, więc żaba rusza się jako jedna całość.
local cialo = model:FindFirstChild("Cialo")
for _, p in model:GetChildren() do
	if p:IsA("BasePart") and p ~= cialo then
		local weld = Instance.new("WeldConstraint")
		weld.Part0 = cialo
		weld.Part1 = p
		weld.Parent = p
	end
end
model.PrimaryPart = cialo
model.Parent = workspace
game:GetService("Selection"):Set({ model })
ChangeHistory:SetWaypoint("Dodano żabę")
print("Żaba gotowa! Klocków: 75")