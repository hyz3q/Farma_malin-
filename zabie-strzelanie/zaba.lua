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
	p.FrontSurface = Enum.SurfaceType.Studs
	p.BackSurface = Enum.SurfaceType.Studs
	p.LeftSurface = Enum.SurfaceType.Studs
	p.RightSurface = Enum.SurfaceType.Studs
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Noga_L", Vector3.new(0.9, 1.9, 0.9), Vector3.new(-0.5, 1.25, 0), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Noga_P", Vector3.new(0.9, 1.9, 0.9), Vector3.new(0.5, 1.25, 0), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Stopa_L", Vector3.new(1.2, 0.3, 1.6), Vector3.new(-0.55, 0.15, -0.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Stopa_P", Vector3.new(1.2, 0.3, 1.6), Vector3.new(0.55, 0.15, -0.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy1_L", Vector3.new(0.3, 0.22, 0.5), Vector3.new(-0.17, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy1_P", Vector3.new(0.3, 0.22, 0.5), Vector3.new(0.17, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy2_L", Vector3.new(0.3, 0.22, 0.5), Vector3.new(-0.55, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy2_P", Vector3.new(0.3, 0.22, 0.5), Vector3.new(0.55, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy3_L", Vector3.new(0.3, 0.22, 0.5), Vector3.new(-0.93, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecStopy3_P", Vector3.new(0.3, 0.22, 0.5), Vector3.new(0.93, 0.11, -1.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Tulow", Vector3.new(2, 2, 1.2), Vector3.new(0, 3.2, 0), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Brzuch", Vector3.new(1.5, 1.6, 0.1), Vector3.new(0, 3.15, -0.62), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("PlamaPlecy1", Vector3.new(0.6, 0.5, 0.06), Vector3.new(0.4, 3.5, 0.63), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaPlecy2", Vector3.new(0.4, 0.35, 0.06), Vector3.new(-0.45, 2.9, 0.63), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Reka_L", Vector3.new(0.6, 1.8, 0.6), Vector3.new(-1.3, 3.25, 0), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Reka_P", Vector3.new(0.6, 1.8, 0.6), Vector3.new(1.3, 3.25, 0), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Dlon_L", Vector3.new(0.7, 0.4, 0.7), Vector3.new(-1.3, 2.2, 0), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Dlon_P", Vector3.new(0.7, 0.4, 0.7), Vector3.new(1.3, 2.2, 0), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Glowa", Vector3.new(3, 1.3, 2.2), Vector3.new(0, 5, -0.1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Twarz", Vector3.new(3, 0.7, 0.2), Vector3.new(0, 5.3, -1.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("WnetrzePyska", Vector3.new(2.6, 0.3, 0.1), Vector3.new(0, 4.8, -1.25), Color3.fromRGB(74, 22, 34), Vector3.new(0, 0, 0))
klocek("KacikPyska_L", Vector3.new(0.2, 0.3, 0.2), Vector3.new(-1.4, 4.8, -1.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("KacikPyska_P", Vector3.new(0.2, 0.3, 0.2), Vector3.new(1.4, 4.8, -1.3), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("GornaWarga", Vector3.new(2.7, 0.08, 0.22), Vector3.new(0, 4.97, -1.31), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("DolnaSzczeka", Vector3.new(3, 0.45, 0.3), Vector3.new(0, 4.43, -1.35), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Gardlo", Vector3.new(2.2, 0.2, 0.1), Vector3.new(0, 4.25, -1.25), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Nozdrze_L", Vector3.new(0.18, 0.1, 0.08), Vector3.new(-0.3, 5.45, -1.42), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Nozdrze_P", Vector3.new(0.18, 0.1, 0.08), Vector3.new(0.3, 5.45, -1.42), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaGlowa_L", Vector3.new(0.06, 0.4, 0.5), Vector3.new(-1.52, 5.1, 0.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PlamaGlowa_P", Vector3.new(0.06, 0.4, 0.5), Vector3.new(1.52, 5.1, 0.3), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Oko_L", Vector3.new(1, 0.9, 1), Vector3.new(-0.9, 6.05, -0.7), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Oko_P", Vector3.new(1, 0.9, 1), Vector3.new(0.9, 6.05, -0.7), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Bialko_L", Vector3.new(0.8, 0.62, 0.08), Vector3.new(-0.9, 6, -1.23), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Bialko_P", Vector3.new(0.8, 0.62, 0.08), Vector3.new(0.9, 6, -1.23), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Zrenica_L", Vector3.new(0.55, 0.2, 0.05), Vector3.new(-0.93, 5.92, -1.28), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Zrenica_P", Vector3.new(0.55, 0.2, 0.05), Vector3.new(0.93, 5.92, -1.28), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_L", Vector3.new(0.95, 0.38, 0.14), Vector3.new(-0.9, 6.27, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -10))
klocek("Powieka_P", Vector3.new(0.95, 0.38, 0.14), Vector3.new(0.9, 6.27, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 10))
klocek("Maska", Vector3.new(2.9, 0.45, 0.08), Vector3.new(0, 5.98, -1.21), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_L", Vector3.new(0.08, 0.45, 1.05), Vector3.new(-1.43, 5.98, -0.7), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_P", Vector3.new(0.08, 0.45, 1.05), Vector3.new(1.43, 5.98, -0.7), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaTyl", Vector3.new(2.9, 0.45, 0.08), Vector3.new(0, 5.98, -0.17), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaKoniec1", Vector3.new(0.08, 0.55, 0.18), Vector3.new(1.5, 5.65, -0.1), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 22))
klocek("MaskaKoniec2", Vector3.new(0.08, 0.55, 0.18), Vector3.new(1.47, 5.62, 0.12), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, -10))
klocek("ZlotyZab", Vector3.new(0.2, 0.18, 0.08), Vector3.new(0.8, 4.86, -1.31), Color3.fromRGB(242, 193, 78), Vector3.new(0, 0, 0))
klocek("Chusta", Vector3.new(2.1, 0.3, 1.3), Vector3.new(0, 4.3, 0), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaTrojkat1", Vector3.new(1.2, 0.35, 0.1), Vector3.new(0, 4.05, -0.67), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaTrojkat2", Vector3.new(0.6, 0.3, 0.1), Vector3.new(0, 3.75, -0.67), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaKropka1", Vector3.new(0.12, 0.12, 0.05), Vector3.new(-0.3, 4.08, -0.74), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka2", Vector3.new(0.12, 0.12, 0.05), Vector3.new(0.28, 4.02, -0.74), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("PasNaboje", Vector3.new(0.3, 2.3, 0.1), Vector3.new(0, 3.2, -0.68), Color3.fromRGB(107, 68, 35), Vector3.new(0, 0, 35))
klocek("Naboj1", Vector3.new(0.12, 0.26, 0.08), Vector3.new(0.4, 2.63, -0.75), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 35))
klocek("Naboj2", Vector3.new(0.12, 0.26, 0.08), Vector3.new(0.2, 2.91, -0.75), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 35))
klocek("Naboj3", Vector3.new(0.12, 0.26, 0.08), Vector3.new(0, 3.2, -0.75), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 35))
klocek("Naboj4", Vector3.new(0.12, 0.26, 0.08), Vector3.new(-0.2, 3.49, -0.75), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 35))
klocek("Naboj5", Vector3.new(0.12, 0.26, 0.08), Vector3.new(-0.4, 3.77, -0.75), Color3.fromRGB(217, 166, 46), Vector3.new(0, 0, 35))
klocek("Pasek", Vector3.new(2.06, 0.3, 1.26), Vector3.new(0, 2.35, 0), Color3.fromRGB(74, 47, 26), Vector3.new(0, 0, 0))
klocek("Klamra", Vector3.new(0.42, 0.3, 0.08), Vector3.new(0, 2.35, -0.66), Color3.fromRGB(242, 193, 78), Vector3.new(0, 0, 0))
klocek("KapeluszRondo", Vector3.new(2.6, 0.12, 1.6), Vector3.new(0, 5.71, 0.35), Color3.fromRGB(90, 58, 34), Vector3.new(0, 0, 0))
klocek("KapeluszGora", Vector3.new(1.6, 0.75, 1.2), Vector3.new(0, 6.15, 0.4), Color3.fromRGB(110, 74, 44), Vector3.new(0, 0, 0))
klocek("KapeluszPasek", Vector3.new(1.64, 0.16, 1.24), Vector3.new(0, 5.86, 0.4), Color3.fromRGB(27, 27, 27), Vector3.new(0, 0, 0))
klocek("BronTyl", Vector3.new(0.45, 0.3, 0.9), Vector3.new(0, 4.8, -1.45), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("BronRama", Vector3.new(0.5, 0.55, 1), Vector3.new(0, 4.85, -2.3), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Beben", Vector3.new(0.7, 0.5, 0.5), Vector3.new(0, 4.85, -2.1), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Lufa", Vector3.new(0.26, 0.26, 1.2), Vector3.new(0, 4.97, -3.4), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Wylot", Vector3.new(0.32, 0.32, 0.08), Vector3.new(0, 4.97, -4.03), Color3.fromRGB(21, 23, 26), Vector3.new(0, 0, 0))
klocek("Muszka", Vector3.new(0.08, 0.14, 0.12), Vector3.new(0, 5.15, -3.85), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 0))
klocek("Kurek", Vector3.new(0.12, 0.22, 0.16), Vector3.new(0, 5.15, -1.85), Color3.fromRGB(35, 38, 43), Vector3.new(-25, 0, 0))
klocek("Rekojesc", Vector3.new(0.4, 0.8, 0.48), Vector3.new(0, 4.3, -2), Color3.fromRGB(122, 74, 38), Vector3.new(-15, 0, 0))
klocek("Oslona", Vector3.new(0.08, 0.08, 0.4), Vector3.new(0, 4.4, -2.5), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))
klocek("Spust", Vector3.new(0.07, 0.2, 0.07), Vector3.new(0, 4.5, -2.4), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 0))

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
print("Żaba gotowa! Klocków: 71")