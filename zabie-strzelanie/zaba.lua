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
	p.Material = Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Cialo", Vector3.new(5, 3.2, 4.8), Vector3.new(0, 2.2, 0.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Grzbiet", Vector3.new(4.4, 0.5, 4.2), Vector3.new(0, 4.05, 0.4), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Twarz", Vector3.new(5, 1.15, 0.3), Vector3.new(0, 3.23, -2.25), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("WnetrzePyska", Vector3.new(4.2, 0.45, 0.1), Vector3.new(0, 2.42, -2.15), Color3.fromRGB(74, 22, 34), Vector3.new(0, 0, 0))
klocek("KacikPyska_L", Vector3.new(0.4, 0.45, 0.3), Vector3.new(-2.3, 2.42, -2.25), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("KacikPyska_P", Vector3.new(0.4, 0.45, 0.3), Vector3.new(2.3, 2.42, -2.25), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("GornaWarga", Vector3.new(4.4, 0.12, 0.34), Vector3.new(0, 2.7, -2.26), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("DolnaSzczeka", Vector3.new(5, 0.55, 0.45), Vector3.new(0, 1.93, -2.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Gardlo", Vector3.new(4.2, 1.1, 0.25), Vector3.new(0, 1.1, -2.2), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Nozdrze_L", Vector3.new(0.26, 0.16, 0.1), Vector3.new(-0.45, 3.55, -2.42), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Nozdrze_P", Vector3.new(0.26, 0.16, 0.1), Vector3.new(0.45, 3.55, -2.42), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok1_L", Vector3.new(0.1, 0.8, 0.9), Vector3.new(-2.52, 2.9, 0.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok1_P", Vector3.new(0.1, 0.8, 0.9), Vector3.new(2.52, 2.9, 0.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok2_L", Vector3.new(0.1, 0.55, 0.6), Vector3.new(-2.52, 1.9, 1.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaBok2_P", Vector3.new(0.1, 0.55, 0.6), Vector3.new(2.52, 1.9, 1.9), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaTyl1", Vector3.new(1, 0.8, 0.1), Vector3.new(0.7, 2.7, 2.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaTyl2", Vector3.new(0.6, 0.5, 0.1), Vector3.new(-0.9, 3.3, 2.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Oko_L", Vector3.new(1.7, 1.5, 1.7), Vector3.new(-1.45, 4.45, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Oko_P", Vector3.new(1.7, 1.5, 1.7), Vector3.new(1.45, 4.45, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Bialko_L", Vector3.new(1.3, 1.1, 0.12), Vector3.new(-1.45, 4.4, -2.1), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Bialko_P", Vector3.new(1.3, 1.1, 0.12), Vector3.new(1.45, 4.4, -2.1), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Udo_L", Vector3.new(1.3, 1.8, 2.6), Vector3.new(-2.55, 1.4, 1.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Udo_P", Vector3.new(1.3, 1.8, 2.6), Vector3.new(2.55, 1.4, 1.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("StopaTyl_L", Vector3.new(1.8, 0.4, 2.4), Vector3.new(-2.8, 0.2, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("StopaTyl_P", Vector3.new(1.8, 0.4, 2.4), Vector3.new(2.8, 0.2, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_L", Vector3.new(0.45, 0.3, 0.8), Vector3.new(-2.2, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_P", Vector3.new(0.45, 0.3, 0.8), Vector3.new(2.2, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_L", Vector3.new(0.45, 0.3, 0.8), Vector3.new(-2.8, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_P", Vector3.new(0.45, 0.3, 0.8), Vector3.new(2.8, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_L", Vector3.new(0.45, 0.3, 0.8), Vector3.new(-3.4, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_P", Vector3.new(0.45, 0.3, 0.8), Vector3.new(3.4, 0.15, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Reka_L", Vector3.new(0.9, 1.6, 0.9), Vector3.new(-1.7, 0.8, -1.7), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Reka_P", Vector3.new(0.9, 1.6, 0.9), Vector3.new(1.7, 0.8, -1.7), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Dlon_L", Vector3.new(1.3, 0.3, 1.3), Vector3.new(-1.8, 0.15, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Dlon_P", Vector3.new(1.3, 0.3, 1.3), Vector3.new(1.8, 0.15, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec1_L", Vector3.new(0.3, 0.25, 0.45), Vector3.new(-1.4, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec1_P", Vector3.new(0.3, 0.25, 0.45), Vector3.new(1.4, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec2_L", Vector3.new(0.3, 0.25, 0.45), Vector3.new(-1.8, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec2_P", Vector3.new(0.3, 0.25, 0.45), Vector3.new(1.8, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec3_L", Vector3.new(0.3, 0.25, 0.45), Vector3.new(-2.2, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec3_P", Vector3.new(0.3, 0.25, 0.45), Vector3.new(2.2, 0.13, -3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Zrenica_L", Vector3.new(0.9, 0.34, 0.08), Vector3.new(-1.5, 4.25, -2.18), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Zrenica_P", Vector3.new(0.9, 0.34, 0.08), Vector3.new(1.5, 4.25, -2.18), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_L", Vector3.new(1.55, 0.6, 0.2), Vector3.new(-1.45, 4.82, -2.13), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -10))
klocek("Powieka_P", Vector3.new(1.55, 0.6, 0.2), Vector3.new(1.45, 4.82, -2.13), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 10))
klocek("Maska", Vector3.new(4.9, 0.7, 0.1), Vector3.new(0, 4.3, -2.07), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_L", Vector3.new(0.1, 0.7, 1.75), Vector3.new(-2.33, 4.3, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_P", Vector3.new(0.1, 0.7, 1.75), Vector3.new(2.33, 4.3, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaTyl", Vector3.new(4.9, 0.7, 0.1), Vector3.new(0, 4.3, -0.33), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaWezel", Vector3.new(0.35, 0.35, 0.2), Vector3.new(2.4, 4.3, -0.33), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaKoniec1", Vector3.new(0.12, 0.8, 0.28), Vector3.new(2.5, 3.85, -0.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 22))
klocek("MaskaKoniec2", Vector3.new(0.12, 0.8, 0.28), Vector3.new(2.45, 3.8, 0.1), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, -10))
klocek("ZlotyZab", Vector3.new(0.3, 0.28, 0.1), Vector3.new(1.25, 2.5, -2.22), Color3.fromRGB(242, 193, 78), Vector3.new(0, 0, 0))
klocek("ChustaPas", Vector3.new(5.1, 0.35, 5), Vector3.new(0, 1.6, 0.3), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta1", Vector3.new(2.6, 0.4, 0.15), Vector3.new(0, 1.45, -2.4), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta2", Vector3.new(1.7, 0.4, 0.15), Vector3.new(0, 1.05, -2.4), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta3", Vector3.new(0.8, 0.4, 0.15), Vector3.new(0, 0.65, -2.4), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaKropka1", Vector3.new(0.16, 0.16, 0.06), Vector3.new(-0.8, 1.45, -2.5), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka2", Vector3.new(0.16, 0.16, 0.06), Vector3.new(0.75, 1.5, -2.5), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka3", Vector3.new(0.16, 0.16, 0.06), Vector3.new(-0.35, 1.05, -2.5), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka4", Vector3.new(0.16, 0.16, 0.06), Vector3.new(0.4, 0.95, -2.5), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("KapeluszRondo", Vector3.new(4.2, 0.18, 2.8), Vector3.new(0, 4.39, 1.3), Color3.fromRGB(90, 58, 34), Vector3.new(0, 0, 0))
klocek("KapeluszGora", Vector3.new(2.6, 1.1, 2), Vector3.new(0, 5.03, 1.35), Color3.fromRGB(110, 74, 44), Vector3.new(0, 0, 0))
klocek("KapeluszPasek", Vector3.new(2.66, 0.24, 2.06), Vector3.new(0, 4.6, 1.35), Color3.fromRGB(27, 27, 27), Vector3.new(0, 0, 0))
klocek("BronTyl", Vector3.new(0.7, 0.42, 1.2), Vector3.new(0, 2.42, -2.4), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("BronRama", Vector3.new(0.8, 0.8, 1.5), Vector3.new(0, 2.5, -3.6), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Beben", Vector3.new(1.05, 0.75, 0.75), Vector3.new(0, 2.5, -3.3), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Lufa", Vector3.new(0.42, 0.42, 1.6), Vector3.new(0, 2.68, -5.1), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Wylot", Vector3.new(0.5, 0.5, 0.12), Vector3.new(0, 2.68, -5.95), Color3.fromRGB(21, 23, 26), Vector3.new(0, 0, 0))
klocek("Muszka", Vector3.new(0.14, 0.22, 0.2), Vector3.new(0, 2.98, -5.7), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Kurek", Vector3.new(0.2, 0.32, 0.25), Vector3.new(0, 2.95, -2.95), Color3.fromRGB(35, 38, 43), Vector3.new(-25, 0, 0))
klocek("Rekojesc", Vector3.new(0.6, 1.2, 0.7), Vector3.new(0, 1.75, -3.05), Color3.fromRGB(122, 74, 38), Vector3.new(-15, 0, 0))
klocek("Oslona", Vector3.new(0.14, 0.12, 0.6), Vector3.new(0, 1.85, -3.75), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Spust", Vector3.new(0.12, 0.3, 0.12), Vector3.new(0, 2, -3.6), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))

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
print("Żaba gotowa! Klocków: 74")