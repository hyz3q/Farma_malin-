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

klocek("Cialo", Vector3.new(4, 2.4, 4.4), Vector3.new(0, 1.9, 0.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Brzuch", Vector3.new(3, 1.4, 0.2), Vector3.new(0, 1.6, -1.95), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Glowa", Vector3.new(4.4, 2, 3.4), Vector3.new(0, 3.6, -0.6), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Podbrodek", Vector3.new(3.6, 0.3, 0.2), Vector3.new(0, 2.75, -2.35), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Oko_L", Vector3.new(1.4, 1.4, 1.4), Vector3.new(-1.35, 4.9, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Oko_P", Vector3.new(1.4, 1.4, 1.4), Vector3.new(1.35, 4.9, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Bialko_L", Vector3.new(1.1, 1.1, 0.2), Vector3.new(-1.35, 4.95, -1.95), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Bialko_P", Vector3.new(1.1, 1.1, 0.2), Vector3.new(1.35, 4.95, -1.95), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Nozdrze_L", Vector3.new(0.22, 0.16, 0.1), Vector3.new(-0.45, 3.95, -2.34), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Nozdrze_P", Vector3.new(0.22, 0.16, 0.1), Vector3.new(0.45, 3.95, -2.34), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Zrenica_L", Vector3.new(0.42, 0.42, 0.12), Vector3.new(-1.25, 4.78, -2.1), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Zrenica_P", Vector3.new(0.42, 0.42, 0.12), Vector3.new(1.25, 4.78, -2.1), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_L", Vector3.new(1.2, 0.55, 0.12), Vector3.new(-1.35, 5.3, -2.08), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, -14))
klocek("Powieka_P", Vector3.new(1.2, 0.55, 0.12), Vector3.new(1.35, 5.3, -2.08), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 14))
klocek("Brew_L", Vector3.new(1.45, 0.3, 0.3), Vector3.new(-1.3, 5.58, -2.08), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -22))
klocek("Brew_P", Vector3.new(1.45, 0.3, 0.3), Vector3.new(1.3, 5.58, -2.08), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 22))
klocek("Maska", Vector3.new(4.5, 0.75, 0.1), Vector3.new(0, 4.95, -1.9), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_L", Vector3.new(0.12, 0.75, 1.5), Vector3.new(-2.08, 4.95, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_P", Vector3.new(0.12, 0.75, 1.5), Vector3.new(2.08, 4.95, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaWstazka1", Vector3.new(0.14, 1, 0.3), Vector3.new(2.2, 4.55, -0.35), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 28))
klocek("MaskaWstazka2", Vector3.new(0.14, 1, 0.3), Vector3.new(2.2, 4.5, -0.05), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, -12))
klocek("Blizna", Vector3.new(0.14, 1.3, 0.08), Vector3.new(-1.2, 5, -2.2), Color3.fromRGB(233, 183, 189), Vector3.new(0, 0, 28))
klocek("Usta", Vector3.new(2.6, 0.22, 0.1), Vector3.new(0, 3.1, -2.34), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("KacikUst_L", Vector3.new(0.55, 0.22, 0.1), Vector3.new(-1.45, 2.97, -2.34), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -25))
klocek("KacikUst_P", Vector3.new(0.55, 0.22, 0.1), Vector3.new(1.45, 2.97, -2.34), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 25))
klocek("Chusta", Vector3.new(4.6, 0.45, 3.6), Vector3.new(0, 2.62, -0.6), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaWezel1", Vector3.new(1.8, 0.4, 0.15), Vector3.new(0, 2.25, -2.45), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaWezel2", Vector3.new(1.1, 0.4, 0.15), Vector3.new(0, 1.88, -2.45), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaWezel3", Vector3.new(0.45, 0.35, 0.15), Vector3.new(0, 1.55, -2.45), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaKropka1", Vector3.new(0.16, 0.16, 0.06), Vector3.new(-0.6, 2.3, -2.55), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka2", Vector3.new(0.16, 0.16, 0.06), Vector3.new(0.55, 2.2, -2.55), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka3", Vector3.new(0.16, 0.16, 0.06), Vector3.new(0.1, 1.9, -2.55), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka4", Vector3.new(0.16, 0.16, 0.06), Vector3.new(-1.6, 2.7, -2.45), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka5", Vector3.new(0.16, 0.16, 0.06), Vector3.new(1.5, 2.7, -2.45), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("PasNaboje", Vector3.new(0.42, 2.4, 0.12), Vector3.new(0.1, 1.6, -2.08), Color3.fromRGB(107, 68, 35), Vector3.new(0, 0, 38))
klocek("Naboj1", Vector3.new(0.16, 0.36, 0.1), Vector3.new(0.59, 0.97, -2.17), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 38))
klocek("Naboj2", Vector3.new(0.16, 0.36, 0.1), Vector3.new(0.35, 1.28, -2.17), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 38))
klocek("Naboj3", Vector3.new(0.16, 0.36, 0.1), Vector3.new(0.1, 1.6, -2.17), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 38))
klocek("Naboj4", Vector3.new(0.16, 0.36, 0.1), Vector3.new(-0.15, 1.92, -2.17), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 38))
klocek("Naboj5", Vector3.new(0.16, 0.36, 0.1), Vector3.new(-0.39, 2.23, -2.17), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 38))
klocek("KapeluszRondo", Vector3.new(4.8, 0.18, 2.6), Vector3.new(0, 4.74, 0.8), Color3.fromRGB(90, 58, 34), Vector3.new(-8, 0, 0))
klocek("KapeluszGora", Vector3.new(2.7, 1.05, 1.9), Vector3.new(0, 5.32, 0.95), Color3.fromRGB(110, 74, 44), Vector3.new(-8, 0, 0))
klocek("KapeluszPasek", Vector3.new(2.76, 0.24, 1.96), Vector3.new(0, 5, 0.97), Color3.fromRGB(27, 27, 27), Vector3.new(-8, 0, 0))
klocek("Plamka1", Vector3.new(0.9, 0.1, 0.9), Vector3.new(0.8, 3.15, 1.8), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Plamka2", Vector3.new(0.7, 0.1, 0.7), Vector3.new(-0.9, 3.15, 1.6), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Udo_L", Vector3.new(1.2, 1.6, 2.4), Vector3.new(-2.45, 1.25, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Udo_P", Vector3.new(1.2, 1.6, 2.4), Vector3.new(2.45, 1.25, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("StopaTyl_L", Vector3.new(1.6, 0.4, 2.2), Vector3.new(-2.65, 0.2, 0.35), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("StopaTyl_P", Vector3.new(1.6, 0.4, 2.2), Vector3.new(2.65, 0.2, 0.35), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-2.1, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(2.1, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-2.65, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(2.65, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-3.2, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(3.2, 0.15, -1.05), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Reka_L", Vector3.new(0.8, 1.6, 0.8), Vector3.new(-1.5, 0.85, -1.45), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Reka_P", Vector3.new(0.8, 1.6, 0.8), Vector3.new(1.5, 0.85, -1.45), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("StopaPrzod_L", Vector3.new(1.2, 0.3, 1.2), Vector3.new(-1.6, 0.15, -1.85), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("StopaPrzod_P", Vector3.new(1.2, 0.3, 1.2), Vector3.new(1.6, 0.15, -1.85), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Rama", Vector3.new(0.8, 0.9, 1.5), Vector3.new(0, 3.1, -2.95), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Beben", Vector3.new(1.05, 0.85, 0.8), Vector3.new(0, 3.1, -3.15), Color3.fromRGB(124, 131, 140), Vector3.new(0, 0, 0))
klocek("Lufa", Vector3.new(0.42, 0.42, 1.7), Vector3.new(0, 3.32, -4.45), Color3.fromRGB(154, 162, 171), Vector3.new(0, 0, 0))
klocek("Wylot", Vector3.new(0.5, 0.5, 0.12), Vector3.new(0, 3.32, -5.3), Color3.fromRGB(26, 26, 26), Vector3.new(0, 0, 0))
klocek("Muszka", Vector3.new(0.14, 0.24, 0.22), Vector3.new(0, 3.62, -5.1), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Kurek", Vector3.new(0.2, 0.35, 0.25), Vector3.new(0, 3.62, -2.3), Color3.fromRGB(35, 38, 43), Vector3.new(-25, 0, 0))
klocek("Rekojesc", Vector3.new(0.6, 1.25, 0.72), Vector3.new(0, 2.3, -2.6), Color3.fromRGB(122, 74, 38), Vector3.new(-12, 0, 0))
klocek("Spust", Vector3.new(0.14, 0.35, 0.14), Vector3.new(0, 2.55, -3.25), Color3.fromRGB(154, 162, 171), Vector3.new(0, 0, 0))

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
print("Żaba gotowa! Klocków: 67")