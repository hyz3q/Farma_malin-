-- Żaba z klocków: Bandyta (zgrabna, skórka: Zielona) – Żabie Strzelanie
-- Wklej do Command Bar w Roblox Studio (View -> Command Bar) i naciśnij Enter.
local ChangeHistory = game:GetService("ChangeHistoryService")
local cam = workspace.CurrentCamera
local focus = cam and cam.Focus.Position or Vector3.new(0, 0, 0)
local origin = CFrame.new(focus.X, 0, focus.Z)

local model = Instance.new("Model")
model.Name = "Zaba_Bandyta"

local function klocek(name, size, pos, color, rot, przezroczystosc)
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
	if przezroczystosc then
		p.Transparency = przezroczystosc
		p.Material = Enum.Material.Glass
		p.CastShadow = false
		for _, face in Enum.NormalId:GetEnumItems() do
			p[face.Name .. "Surface"] = Enum.SurfaceType.Smooth
		end
	end
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Tulow", Vector3.new(3.2, 2.2, 3.4), Vector3.new(0, 1.75, 0.8), Color3.fromRGB(93, 187, 74), Vector3.new(25, 0, 0))
klocek("PlamaGrzbiet1", Vector3.new(0.8, 0.06, 0.7), Vector3.new(0.6, 2.596, 1.636), Color3.fromRGB(60, 139, 52), Vector3.new(25, 0, 0))
klocek("PlamaGrzbiet2", Vector3.new(0.6, 0.06, 0.5), Vector3.new(-0.7, 2.342, 2.18), Color3.fromRGB(60, 139, 52), Vector3.new(25, 0, 0))
klocek("PlamaGrzbiet3", Vector3.new(0.45, 0.06, 0.45), Vector3.new(0.1, 2.85, 1.092), Color3.fromRGB(60, 139, 52), Vector3.new(25, 0, 0))
klocek("Glowa", Vector3.new(3.6, 1.5, 2.4), Vector3.new(0, 3.3, -0.8), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Twarz", Vector3.new(3.6, 0.85, 0.2), Vector3.new(0, 3.625, -2.1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("WnetrzePyska", Vector3.new(3.1, 0.35, 0.1), Vector3.new(0, 3.02, -2.03), Color3.fromRGB(74, 22, 34), Vector3.new(0, 0, 0))
klocek("KacikPyska_L", Vector3.new(0.25, 0.35, 0.2), Vector3.new(-1.675, 3.02, -2.1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("KacikPyska_P", Vector3.new(0.25, 0.35, 0.2), Vector3.new(1.675, 3.02, -2.1), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("GornaWarga", Vector3.new(3.2, 0.08, 0.22), Vector3.new(0, 3.2, -2.11), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("DolnaSzczeka", Vector3.new(3.6, 0.45, 0.3), Vector3.new(0, 2.625, -2.15), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Gardlo", Vector3.new(3, 1.2, 0.2), Vector3.new(0, 2, -1.9), Color3.fromRGB(211, 234, 142), Vector3.new(0, 0, 0))
klocek("Szyja", Vector3.new(3, 1.35, 1.75), Vector3.new(0, 1.95, -0.95), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Nozdrze_L", Vector3.new(0.2, 0.12, 0.08), Vector3.new(-0.35, 3.85, -2.22), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Nozdrze_P", Vector3.new(0.2, 0.12, 0.08), Vector3.new(0.35, 3.85, -2.22), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Oko_L", Vector3.new(1.3, 1.2, 1.3), Vector3.new(-1.35, 4.35, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Oko_P", Vector3.new(1.3, 1.2, 1.3), Vector3.new(1.35, 4.35, -1.2), Color3.fromRGB(93, 187, 74), Vector3.new(0, 0, 0))
klocek("Bialko_L", Vector3.new(1, 0.85, 0.08), Vector3.new(-1.35, 4.3, -1.89), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Bialko_P", Vector3.new(1, 0.85, 0.08), Vector3.new(1.35, 4.3, -1.89), Color3.fromRGB(255, 255, 255), Vector3.new(0, 0, 0))
klocek("Udo_L", Vector3.new(1.1, 1.3, 2.8), Vector3.new(-1.75, 1.2, 1.1), Color3.fromRGB(93, 187, 74), Vector3.new(8, 0, 0))
klocek("Udo_P", Vector3.new(1.1, 1.3, 2.8), Vector3.new(1.75, 1.2, 1.1), Color3.fromRGB(93, 187, 74), Vector3.new(8, 0, 0))
klocek("PlamaUdo_L", Vector3.new(0.06, 0.5, 0.8), Vector3.new(-2.31, 1.3, 1.1), Color3.fromRGB(60, 139, 52), Vector3.new(8, 0, 0))
klocek("PlamaUdo_P", Vector3.new(0.06, 0.5, 0.8), Vector3.new(2.31, 1.3, 1.1), Color3.fromRGB(60, 139, 52), Vector3.new(8, 0, 0))
klocek("Golen_L", Vector3.new(0.8, 0.6, 2.4), Vector3.new(-2.1, 0.5, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(-8, 0, 0))
klocek("Golen_P", Vector3.new(0.8, 0.6, 2.4), Vector3.new(2.1, 0.5, 1.2), Color3.fromRGB(93, 187, 74), Vector3.new(-8, 0, 0))
klocek("Stopa_L", Vector3.new(1, 0.28, 2.2), Vector3.new(-2.3, 0.14, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Stopa_P", Vector3.new(1, 0.28, 2.2), Vector3.new(2.3, 0.14, 0.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl1_L", Vector3.new(0.26, 0.2, 0.9), Vector3.new(-1.95, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("PalecTyl1_P", Vector3.new(0.26, 0.2, 0.9), Vector3.new(1.95, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("PrzylgaTyl1_L", Vector3.new(0.36, 0.22, 0.3), Vector3.new(-1.74, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("PrzylgaTyl1_P", Vector3.new(0.36, 0.22, 0.3), Vector3.new(1.74, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("PalecTyl2_L", Vector3.new(0.26, 0.2, 0.9), Vector3.new(-2.3, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl2_P", Vector3.new(0.26, 0.2, 0.9), Vector3.new(2.3, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PrzylgaTyl2_L", Vector3.new(0.36, 0.22, 0.3), Vector3.new(-2.3, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PrzylgaTyl2_P", Vector3.new(0.36, 0.22, 0.3), Vector3.new(2.3, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("PalecTyl3_L", Vector3.new(0.26, 0.2, 0.9), Vector3.new(-2.65, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("PalecTyl3_P", Vector3.new(0.26, 0.2, 0.9), Vector3.new(2.65, 0.1, -1.25), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("PrzylgaTyl3_L", Vector3.new(0.36, 0.22, 0.3), Vector3.new(-2.86, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("PrzylgaTyl3_P", Vector3.new(0.36, 0.22, 0.3), Vector3.new(2.86, 0.11, -1.75), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("Reka_L", Vector3.new(0.55, 1.5, 0.55), Vector3.new(-1.15, 0.95, -1.35), Color3.fromRGB(93, 187, 74), Vector3.new(10, 0, 0))
klocek("Reka_P", Vector3.new(0.55, 1.5, 0.55), Vector3.new(1.15, 0.95, -1.35), Color3.fromRGB(93, 187, 74), Vector3.new(10, 0, 0))
klocek("Dlon_L", Vector3.new(0.9, 0.24, 0.8), Vector3.new(-1.2, 0.12, -1.65), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Dlon_P", Vector3.new(0.9, 0.24, 0.8), Vector3.new(1.2, 0.12, -1.65), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec1_L", Vector3.new(0.2, 0.18, 0.55), Vector3.new(-0.92, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("Palec1_P", Vector3.new(0.2, 0.18, 0.55), Vector3.new(0.92, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("Przylga1_L", Vector3.new(0.28, 0.2, 0.22), Vector3.new(-0.78, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("Przylga1_P", Vector3.new(0.28, 0.2, 0.22), Vector3.new(0.78, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("Palec2_L", Vector3.new(0.2, 0.18, 0.55), Vector3.new(-1.2, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec2_P", Vector3.new(0.2, 0.18, 0.55), Vector3.new(1.2, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Przylga2_L", Vector3.new(0.28, 0.2, 0.22), Vector3.new(-1.2, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Przylga2_P", Vector3.new(0.28, 0.2, 0.22), Vector3.new(1.2, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 0))
klocek("Palec3_L", Vector3.new(0.2, 0.18, 0.55), Vector3.new(-1.48, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("Palec3_P", Vector3.new(0.2, 0.18, 0.55), Vector3.new(1.48, 0.09, -2.2), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("Przylga3_L", Vector3.new(0.28, 0.2, 0.22), Vector3.new(-1.62, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, 14, 0))
klocek("Przylga3_P", Vector3.new(0.28, 0.2, 0.22), Vector3.new(1.62, 0.1, -2.5), Color3.fromRGB(60, 139, 52), Vector3.new(0, -14, 0))
klocek("Zrenica_L", Vector3.new(0.7, 0.255, 0.05), Vector3.new(-1.38, 4.2, -1.95), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_L", Vector3.new(1.2, 0.442, 0.12), Vector3.new(-1.35, 4.623, -1.95), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, -10))
klocek("Zrenica_P", Vector3.new(0.7, 0.255, 0.05), Vector3.new(1.38, 4.2, -1.95), Color3.fromRGB(17, 17, 17), Vector3.new(0, 0, 0))
klocek("Powieka_P", Vector3.new(1.2, 0.442, 0.12), Vector3.new(1.35, 4.623, -1.95), Color3.fromRGB(60, 139, 52), Vector3.new(0, 0, 10))
klocek("Maska", Vector3.new(4.1, 0.527, 0.06), Vector3.new(0, 4.3, -1.87), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_L", Vector3.new(0.08, 0.527, 1.34), Vector3.new(-2.03, 4.3, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaBok_P", Vector3.new(0.08, 0.527, 1.34), Vector3.new(2.03, 4.3, -1.2), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaTyl", Vector3.new(4.1, 0.527, 0.06), Vector3.new(0, 4.3, -0.52), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 0))
klocek("MaskaKoniec1", Vector3.new(0.1, 0.8, 0.22), Vector3.new(0.25, 3.85, -0.45), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, 15))
klocek("MaskaKoniec2", Vector3.new(0.1, 0.8, 0.22), Vector3.new(-0.2, 3.8, -0.43), Color3.fromRGB(21, 21, 21), Vector3.new(0, 0, -12))
klocek("KapeluszRondo", Vector3.new(6.318, 0.182, 4.16), Vector3.new(0, 4.47, -0.65), Color3.fromRGB(78, 50, 32), Vector3.new(13, 0, -7))
klocek("KapeluszRondoL", Vector3.new(0.182, 0.416, 3.536), Vector3.new(-3.023, 5.01, -0.525), Color3.fromRGB(78, 50, 32), Vector3.new(13, 0, -7))
klocek("KapeluszRondoP", Vector3.new(0.182, 0.416, 3.536), Vector3.new(3.067, 4.282, -0.693), Color3.fromRGB(78, 50, 32), Vector3.new(13, 0, -7))
klocek("KapeluszGora", Vector3.new(2.902, 1.365, 2.288), Vector3.new(0.095, 5.195, -0.349), Color3.fromRGB(94, 60, 36), Vector3.new(13, 0, -7))
klocek("KapeluszWgniecenie", Vector3.new(1.016, 0.13, 1.602), Vector3.new(0.177, 5.849, -0.198), Color3.fromRGB(78, 50, 32), Vector3.new(13, 0, -7))
klocek("KapeluszPasek", Vector3.new(2.954, 0.26, 2.34), Vector3.new(0.032, 4.692, -0.465), Color3.fromRGB(27, 27, 27), Vector3.new(13, 0, -7))
klocek("ZlotyZab", Vector3.new(0.24, 0.22, 0.08), Vector3.new(0.936, 3.08, -2.12), Color3.fromRGB(242, 193, 78), Vector3.new(0, 0, 0))
klocek("ChustaWiazanie", Vector3.new(3.384, 0.25, 0.1), Vector3.new(0, 2.35, -2.1), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta1", Vector3.new(1.8, 0.32, 0.12), Vector3.new(0, 2.2, -2.12), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta2", Vector3.new(1.08, 0.32, 0.12), Vector3.new(0, 1.88, -2.12), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("Chusta3", Vector3.new(0.45, 0.3, 0.12), Vector3.new(0, 1.57, -2.12), Color3.fromRGB(184, 36, 46), Vector3.new(0, 0, 0))
klocek("ChustaKropka1", Vector3.new(0.13, 0.13, 0.05), Vector3.new(-0.45, 2.2, -2.2), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka2", Vector3.new(0.13, 0.13, 0.05), Vector3.new(0.4, 2.16, -2.2), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("ChustaKropka3", Vector3.new(0.13, 0.13, 0.05), Vector3.new(0.05, 1.86, -2.2), Color3.fromRGB(244, 239, 230), Vector3.new(0, 0, 0))
klocek("BronTyl", Vector3.new(0.5, 0.3, 1), Vector3.new(0, 3.02, -2.15), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 90))
klocek("BronRama", Vector3.new(0.55, 0.6, 1.1), Vector3.new(-0.06, 3.02, -3.1), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 90))
klocek("Beben", Vector3.new(0.8, 0.55, 0.55), Vector3.new(-0.06, 3.02, -2.85), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 90))
klocek("Lufa", Vector3.new(0.3, 0.3, 1.3), Vector3.new(-0.2, 3.02, -4.3), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 90))
klocek("Wylot", Vector3.new(0.36, 0.36, 0.1), Vector3.new(-0.2, 3.02, -4.98), Color3.fromRGB(21, 23, 26), Vector3.new(0, 0, 90))
klocek("Muszka", Vector3.new(0.1, 0.16, 0.14), Vector3.new(-0.42, 3.02, -4.7), Color3.fromRGB(35, 38, 43), Vector3.new(0, 0, 90))
klocek("Kurek", Vector3.new(0.14, 0.25, 0.18), Vector3.new(-0.42, 3.02, -2.55), Color3.fromRGB(35, 38, 43), Vector3.new(0, -25, 90))
klocek("Rekojesc", Vector3.new(0.45, 0.9, 0.55), Vector3.new(0.52, 3.02, -2.75), Color3.fromRGB(122, 74, 38), Vector3.new(0, -15, 90))
klocek("Oslona", Vector3.new(0.1, 0.1, 0.45), Vector3.new(0.4, 3.02, -3.3), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 90))
klocek("Spust", Vector3.new(0.08, 0.22, 0.08), Vector3.new(0.27, 3.02, -3.15), Color3.fromRGB(142, 150, 159), Vector3.new(0, 0, 90))

-- Wszystkie klocki przyspawane do ciała, więc żaba rusza się jako jedna całość.
local cialo = model:FindFirstChild("Tulow") or model:FindFirstChild("Cialo")
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
pcall(function() game:GetService("Selection"):Set({ model }) end)
pcall(function() ChangeHistory:SetWaypoint("Dodano żabę: Bandyta") end)
print("Żaba Bandyta gotowa! Klocków: 89")