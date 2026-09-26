-- Żaba z klocków (skórka: Zielona) – Żabie Strzelanie
-- Wklej do Command Bar w Roblox Studio (View -> Command Bar) i naciśnij Enter.
local ChangeHistory = game:GetService("ChangeHistoryService")
local cam = workspace.CurrentCamera
local focus = cam and cam.Focus.Position or Vector3.new(0, 0, 0)
local origin = CFrame.new(focus.X, 0, focus.Z)

local model = Instance.new("Model")
model.Name = "Zaba"

local function klocek(name, size, pos, color)
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.CFrame = origin * CFrame.new(pos)
	p.Color = color
	p.Material = Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Cialo", Vector3.new(4, 2.4, 4.4), Vector3.new(0, 1.9, 0.3), Color3.fromRGB(93, 187, 74))
klocek("Brzuch", Vector3.new(3, 1.4, 0.2), Vector3.new(0, 1.6, -1.95), Color3.fromRGB(211, 234, 142))
klocek("Glowa", Vector3.new(4.4, 2, 3.4), Vector3.new(0, 3.6, -0.6), Color3.fromRGB(93, 187, 74))
klocek("Podbrodek", Vector3.new(3.6, 0.3, 0.2), Vector3.new(0, 2.75, -2.35), Color3.fromRGB(211, 234, 142))
klocek("Oko_L", Vector3.new(1.4, 1.4, 1.4), Vector3.new(-1.35, 4.9, -1.2), Color3.fromRGB(93, 187, 74))
klocek("Oko_P", Vector3.new(1.4, 1.4, 1.4), Vector3.new(1.35, 4.9, -1.2), Color3.fromRGB(93, 187, 74))
klocek("Bialko_L", Vector3.new(1.1, 1.1, 0.2), Vector3.new(-1.35, 4.95, -1.95), Color3.fromRGB(255, 255, 255))
klocek("Bialko_P", Vector3.new(1.1, 1.1, 0.2), Vector3.new(1.35, 4.95, -1.95), Color3.fromRGB(255, 255, 255))
klocek("Zrenica_L", Vector3.new(0.5, 0.6, 0.12), Vector3.new(-1.3, 4.9, -2.1), Color3.fromRGB(17, 17, 17))
klocek("Zrenica_P", Vector3.new(0.5, 0.6, 0.12), Vector3.new(1.3, 4.9, -2.1), Color3.fromRGB(17, 17, 17))
klocek("Blysk_L", Vector3.new(0.18, 0.18, 0.06), Vector3.new(-1.45, 5.08, -2.18), Color3.fromRGB(255, 255, 255))
klocek("Blysk_P", Vector3.new(0.18, 0.18, 0.06), Vector3.new(1.45, 5.08, -2.18), Color3.fromRGB(255, 255, 255))
klocek("Usta", Vector3.new(3.4, 0.22, 0.1), Vector3.new(0, 3.05, -2.34), Color3.fromRGB(60, 139, 52))
klocek("Policzek_L", Vector3.new(0.7, 0.4, 0.1), Vector3.new(-1.75, 3.35, -2.34), Color3.fromRGB(242, 139, 160))
klocek("Policzek_P", Vector3.new(0.7, 0.4, 0.1), Vector3.new(1.75, 3.35, -2.34), Color3.fromRGB(242, 139, 160))
klocek("Nozdrze_L", Vector3.new(0.22, 0.16, 0.1), Vector3.new(-0.45, 3.95, -2.34), Color3.fromRGB(60, 139, 52))
klocek("Nozdrze_P", Vector3.new(0.22, 0.16, 0.1), Vector3.new(0.45, 3.95, -2.34), Color3.fromRGB(60, 139, 52))
klocek("Plamka1", Vector3.new(0.9, 0.1, 0.9), Vector3.new(0.8, 3.15, 1.8), Color3.fromRGB(60, 139, 52))
klocek("Plamka2", Vector3.new(0.7, 0.1, 0.7), Vector3.new(-0.9, 3.15, 1.6), Color3.fromRGB(60, 139, 52))
klocek("Plamka3", Vector3.new(0.8, 0.1, 0.8), Vector3.new(-0.4, 4.65, 0.4), Color3.fromRGB(60, 139, 52))
klocek("Plamka4", Vector3.new(0.5, 0.1, 0.5), Vector3.new(1.1, 4.65, -0.3), Color3.fromRGB(60, 139, 52))
klocek("Udo_L", Vector3.new(1.2, 1.6, 2.4), Vector3.new(-2.45, 1.25, 1.2), Color3.fromRGB(93, 187, 74))
klocek("Udo_P", Vector3.new(1.2, 1.6, 2.4), Vector3.new(2.45, 1.25, 1.2), Color3.fromRGB(93, 187, 74))
klocek("StopaTyl_L", Vector3.new(1.6, 0.4, 2.2), Vector3.new(-2.65, 0.2, 0.35), Color3.fromRGB(60, 139, 52))
klocek("StopaTyl_P", Vector3.new(1.6, 0.4, 2.2), Vector3.new(2.65, 0.2, 0.35), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl1_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-2.1, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl1_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(2.1, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl2_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-2.65, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl2_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(2.65, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl3_L", Vector3.new(0.4, 0.3, 0.7), Vector3.new(-3.2, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("PalecTyl3_P", Vector3.new(0.4, 0.3, 0.7), Vector3.new(3.2, 0.15, -1.05), Color3.fromRGB(60, 139, 52))
klocek("Reka_L", Vector3.new(0.8, 1.6, 0.8), Vector3.new(-1.5, 0.85, -1.45), Color3.fromRGB(93, 187, 74))
klocek("Reka_P", Vector3.new(0.8, 1.6, 0.8), Vector3.new(1.5, 0.85, -1.45), Color3.fromRGB(93, 187, 74))
klocek("StopaPrzod_L", Vector3.new(1.2, 0.3, 1.2), Vector3.new(-1.6, 0.15, -1.85), Color3.fromRGB(60, 139, 52))
klocek("StopaPrzod_P", Vector3.new(1.2, 0.3, 1.2), Vector3.new(1.6, 0.15, -1.85), Color3.fromRGB(60, 139, 52))
klocek("Pistolet", Vector3.new(0.9, 0.9, 2.3), Vector3.new(0, 3.1, -3.3), Color3.fromRGB(58, 63, 71))
klocek("Lufa", Vector3.new(0.55, 0.55, 0.5), Vector3.new(0, 3.2, -4.65), Color3.fromRGB(255, 138, 31))
klocek("Rekojesc", Vector3.new(0.6, 1.1, 0.7), Vector3.new(0, 2.3, -2.85), Color3.fromRGB(42, 46, 52))
klocek("Muszka", Vector3.new(0.2, 0.3, 0.3), Vector3.new(0, 3.7, -4.1), Color3.fromRGB(255, 138, 31))
klocek("Spust", Vector3.new(0.15, 0.35, 0.15), Vector3.new(0, 2.55, -3.35), Color3.fromRGB(255, 138, 31))

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
print("Żaba gotowa! Klocków: 40")