-- Budowla: Dzialka_Test (wygenerowane przez roblox-build-preview)
-- Wklej do Command Bar w Roblox Studio (View -> Command Bar) i naciśnij Enter.
-- Budowla pojawi się tam, gdzie patrzy kamera. Ctrl+Z cofa całość.
local ChangeHistory = game:GetService("ChangeHistoryService")
local cam = workspace.CurrentCamera
local focus = cam and cam.Focus.Position or Vector3.new(0, 0, 0)
local origin = CFrame.new(math.round(focus.X), 0, math.round(focus.Z))

local model = Instance.new("Model")
model.Name = "Dzialka_Test"

local function klocek(nazwa, ksztalt, rozmiar, pozycja, obrot, kolor, material, przezr, studsy, kolizja, cien)
	local p
	if ksztalt == "Wedge" then
		p = Instance.new("WedgePart")
	else
		p = Instance.new("Part")
		if ksztalt == "Cylinder" then p.Shape = Enum.PartType.Cylinder
		elseif ksztalt == "Ball" then p.Shape = Enum.PartType.Ball end
	end
	p.Name = nazwa
	p.Size = rozmiar
	p.CFrame = origin * CFrame.new(pozycja) * CFrame.Angles(math.rad(obrot.X), math.rad(obrot.Y), math.rad(obrot.Z))
	p.Color = kolor
	local ok = pcall(function() p.Material = Enum.Material[material] end)
	if not ok then p.Material = Enum.Material.Plastic end
	if studsy then
		p.TopSurface = Enum.SurfaceType.Studs
		p.BottomSurface = Enum.SurfaceType.Inlet
	else
		p.TopSurface = Enum.SurfaceType.Smooth
		p.BottomSurface = Enum.SurfaceType.Smooth
	end
	p.Transparency = przezr
	p.CanCollide = kolizja
	p.CastShadow = cien
	p.Anchored = true
	p.Parent = model
	return p
end

klocek("Grass0_0", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, -40), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass0_1", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, -24), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass0_2", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, -8), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass0_3", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, 8), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass0_4", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, 24), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass0_5", "Block", Vector3.new(16, 1, 16), Vector3.new(-24, 0.5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass1_0", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, -40), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass1_1", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, -24), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass1_2", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, -8), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass1_3", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, 8), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass1_4", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, 24), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass1_5", "Block", Vector3.new(16, 1, 16), Vector3.new(-8, 0.5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass2_0", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, -40), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass2_1", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, -24), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass2_2", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, -8), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass2_3", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, 8), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass2_4", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, 24), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass2_5", "Block", Vector3.new(16, 1, 16), Vector3.new(8, 0.5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass3_0", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, -40), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass3_1", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, -24), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass3_2", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, -8), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass3_3", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, 8), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Grass3_4", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, 24), Vector3.new(0, 0, 0), Color3.fromRGB(93, 178, 63), "Plastic", 0, true, true, true)
klocek("Grass3_5", "Block", Vector3.new(16, 1, 16), Vector3.new(24, 0.5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(108, 194, 74), "Plastic", 0, true, true, true)
klocek("Path", "Block", Vector3.new(10, 0.5, 80), Vector3.new(2, 1.25, -8), Vector3.new(0, 0, 0), Color3.fromRGB(242, 217, 138), "Plastic", 0, true, true, true)
klocek("PathEdgeL", "Block", Vector3.new(1, 0.5, 80), Vector3.new(-3.5, 1.25, -8), Vector3.new(0, 0, 0), Color3.fromRGB(230, 200, 115), "Plastic", 0, true, true, true)
klocek("PathEdgeR", "Block", Vector3.new(1, 0.5, 80), Vector3.new(7.5, 1.25, -8), Vector3.new(0, 0, 0), Color3.fromRGB(230, 200, 115), "Plastic", 0, true, true, true)
klocek("BackWall0_0", "Block", Vector3.new(16, 15, 2), Vector3.new(-24, 7.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("BackWall0_1", "Block", Vector3.new(16, 15, 2), Vector3.new(-24, 22.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(217, 128, 58), "Plastic", 0, true, true, true)
klocek("BackWall1_0", "Block", Vector3.new(16, 15, 2), Vector3.new(-8, 7.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(217, 128, 58), "Plastic", 0, true, true, true)
klocek("BackWall1_1", "Block", Vector3.new(16, 15, 2), Vector3.new(-8, 22.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("BackWall2_0", "Block", Vector3.new(16, 15, 2), Vector3.new(8, 7.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("BackWall2_1", "Block", Vector3.new(16, 15, 2), Vector3.new(8, 22.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(217, 128, 58), "Plastic", 0, true, true, true)
klocek("BackWall3_0", "Block", Vector3.new(16, 15, 2), Vector3.new(24, 7.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(217, 128, 58), "Plastic", 0, true, true, true)
klocek("BackWall3_1", "Block", Vector3.new(16, 15, 2), Vector3.new(24, 22.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("BackWallTop", "Block", Vector3.new(64, 1, 3), Vector3.new(0, 30.5, 49), Vector3.new(0, 0, 0), Color3.fromRGB(126, 219, 85), "Plastic", 0, true, true, true)
klocek("SpawnRing", "Block", Vector3.new(8, 0.5, 8), Vector3.new(2, 1.75, -40), Vector3.new(0, 0, 0), Color3.fromRGB(255, 255, 255), "Plastic", 0, true, true, true)
klocek("SpawnPad", "Block", Vector3.new(6, 0.5, 6), Vector3.new(2, 2.25, -40), Vector3.new(0, 0, 0), Color3.fromRGB(58, 140, 255), "Plastic", 0, false, true, true)
klocek("GatePillar-6", "Block", Vector3.new(2, 8, 2), Vector3.new(-6, 5, -46), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("GateLight-6", "Block", Vector3.new(2, 1, 2), Vector3.new(-6, 9.5, -46), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, true)
klocek("GatePillar10", "Block", Vector3.new(2, 8, 2), Vector3.new(10, 5, -46), Vector3.new(0, 0, 0), Color3.fromRGB(232, 149, 74), "Plastic", 0, true, true, true)
klocek("GateLight10", "Block", Vector3.new(2, 1, 2), Vector3.new(10, 9.5, -46), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, true)
klocek("Dropper_Base", "Block", Vector3.new(10, 1, 10), Vector3.new(-14, 1.5, 22), Vector3.new(0, 0, 0), Color3.fromRGB(94, 101, 109), "Plastic", 0, true, true, true)
klocek("Dropper_BaseTrim", "Block", Vector3.new(11, 0.5, 11), Vector3.new(-14, 2.25, 22), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("Dropper_Body", "Block", Vector3.new(8, 7, 8), Vector3.new(-14, 6, 22), Vector3.new(0, 0, 0), Color3.fromRGB(255, 154, 31), "Plastic", 0, true, true, true)
klocek("Dropper_BodyStripe", "Block", Vector3.new(8.5, 1, 8.5), Vector3.new(-14, 7.5, 22), Vector3.new(0, 0, 0), Color3.fromRGB(43, 45, 51), "Plastic", 0, true, true, true)
klocek("Dropper_Head", "Block", Vector3.new(6, 3, 6), Vector3.new(-14, 11, 22), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Dropper_Hopper", "Wedge", Vector3.new(6, 2, 3), Vector3.new(-14, 13.5, 23.5), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Dropper_Chimney", "Cylinder", Vector3.new(3, 1.5, 1.5), Vector3.new(-12, 14, 23.5), Vector3.new(0, 0, 90), Color3.fromRGB(94, 101, 109), "Plastic", 0, true, true, true)
klocek("Dropper_Nozzle", "Block", Vector3.new(3, 3, 2), Vector3.new(-14, 5, 17), Vector3.new(0, 0, 0), Color3.fromRGB(43, 45, 51), "Plastic", 0, true, true, true)
klocek("Dropper_NozzleRim", "Block", Vector3.new(4, 0.5, 3), Vector3.new(-14, 6.75, 17), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Dropper_Screen", "Block", Vector3.new(4, 2, 0.5), Vector3.new(-14, 9.5, 17.75), Vector3.new(0, 0, 0), Color3.fromRGB(63, 224, 242), "Neon", 0, true, true, true)
klocek("Dropper_LampL", "Ball", Vector3.new(1, 1, 1), Vector3.new(-16.5, 13, 20), Vector3.new(0, 0, 0), Color3.fromRGB(124, 252, 0), "Neon", 0, true, true, true)
klocek("Dropper_LampR", "Ball", Vector3.new(1, 1, 1), Vector3.new(-11.5, 13, 20), Vector3.new(0, 0, 0), Color3.fromRGB(240, 82, 75), "Neon", 0, true, true, true)
klocek("Dropper_PipeL", "Cylinder", Vector3.new(6, 1, 1), Vector3.new(-18.5, 6, 24), Vector3.new(0, 0, 90), Color3.fromRGB(142, 150, 159), "Plastic", 0, true, true, true)
klocek("Dropper_PipeR", "Cylinder", Vector3.new(6, 1, 1), Vector3.new(-9.5, 6, 24), Vector3.new(0, 0, 90), Color3.fromRGB(142, 150, 159), "Plastic", 0, true, true, true)
klocek("ConveyorBelt", "Block", Vector3.new(4, 1, 26), Vector3.new(-14, 2.5, 3), Vector3.new(0, 0, 0), Color3.fromRGB(43, 45, 51), "Plastic", 0, true, true, true)
klocek("ConveyorRailL", "Block", Vector3.new(0.5, 1, 26), Vector3.new(-16.25, 3, 3), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("ConveyorRailR", "Block", Vector3.new(0.5, 1, 26), Vector3.new(-11.75, 3, 3), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("ConveyorLeg0", "Block", Vector3.new(3, 1, 1), Vector3.new(-14, 1.5, -8), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("ConveyorLeg1", "Block", Vector3.new(3, 1, 1), Vector3.new(-14, 1.5, 3), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("ConveyorLeg2", "Block", Vector3.new(3, 1, 1), Vector3.new(-14, 1.5, 14), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("ConveyorRollerFront", "Cylinder", Vector3.new(5, 1, 1), Vector3.new(-14, 2.5, -10.5), Vector3.new(0, 0, 0), Color3.fromRGB(142, 150, 159), "Plastic", 0, true, true, true)
klocek("ConveyorRollerBack", "Cylinder", Vector3.new(5, 1, 1), Vector3.new(-14, 2.5, 16.5), Vector3.new(0, 0, 0), Color3.fromRGB(142, 150, 159), "Plastic", 0, true, true, true)
klocek("Seller_Body", "Block", Vector3.new(9, 7, 7), Vector3.new(-14, 4.5, -15), Vector3.new(0, 0, 0), Color3.fromRGB(76, 201, 76), "Plastic", 0, true, true, true)
klocek("Seller_Band", "Block", Vector3.new(9.5, 1, 7.5), Vector3.new(-14, 6.5, -15), Vector3.new(0, 0, 0), Color3.fromRGB(47, 158, 58), "Plastic", 0, true, true, true)
klocek("Seller_Mouth", "Block", Vector3.new(5, 3, 1), Vector3.new(-14, 4, -11), Vector3.new(0, 0, 0), Color3.fromRGB(43, 45, 51), "Plastic", 0, true, true, true)
klocek("Seller_Roof", "Block", Vector3.new(10, 2, 8), Vector3.new(-14, 9, -15), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Seller_Coin", "Cylinder", Vector3.new(0.5, 3, 3), Vector3.new(-14, 11.5, -15), Vector3.new(0, 90, 0), Color3.fromRGB(255, 210, 63), "Neon", 0, true, true, true)
klocek("UpgradeButton0_Rim", "Block", Vector3.new(5, 0.5, 5), Vector3.new(13, 1.25, -30), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("UpgradeButton0", "Block", Vector3.new(4, 0.5, 4), Vector3.new(13, 1.75, -30), Vector3.new(0, 0, 0), Color3.fromRGB(124, 252, 0), "Plastic", 0, true, true, true)
klocek("UpgradeButton1_Rim", "Block", Vector3.new(5, 0.5, 5), Vector3.new(13, 1.25, -22), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("UpgradeButton1", "Block", Vector3.new(4, 0.5, 4), Vector3.new(13, 1.75, -22), Vector3.new(0, 0, 0), Color3.fromRGB(255, 176, 32), "Plastic", 0, true, true, true)
klocek("UpgradeButton2_Rim", "Block", Vector3.new(5, 0.5, 5), Vector3.new(13, 1.25, -14), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("UpgradeButton2", "Block", Vector3.new(4, 0.5, 4), Vector3.new(13, 1.75, -14), Vector3.new(0, 0, 0), Color3.fromRGB(124, 252, 0), "Plastic", 0, true, true, true)
klocek("UpgradeButton3_Rim", "Block", Vector3.new(5, 0.5, 5), Vector3.new(13, 1.25, -6), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("UpgradeButton3", "Block", Vector3.new(4, 0.5, 4), Vector3.new(13, 1.75, -6), Vector3.new(0, 0, 0), Color3.fromRGB(255, 176, 32), "Plastic", 0, true, true, true)
klocek("Showcase0_Base", "Block", Vector3.new(5, 2, 5), Vector3.new(18, 2, 14), Vector3.new(0, 0, 0), Color3.fromRGB(155, 107, 242), "Plastic", 0, true, true, true)
klocek("Showcase0_Top", "Block", Vector3.new(4, 0.5, 4), Vector3.new(18, 3.25, 14), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Showcase1_Base", "Block", Vector3.new(5, 2, 5), Vector3.new(18, 2, 22), Vector3.new(0, 0, 0), Color3.fromRGB(155, 107, 242), "Plastic", 0, true, true, true)
klocek("Showcase1_Top", "Block", Vector3.new(4, 0.5, 4), Vector3.new(18, 3.25, 22), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Showcase2_Base", "Block", Vector3.new(5, 2, 5), Vector3.new(18, 2, 30), Vector3.new(0, 0, 0), Color3.fromRGB(155, 107, 242), "Plastic", 0, true, true, true)
klocek("Showcase2_Top", "Block", Vector3.new(4, 0.5, 4), Vector3.new(18, 3.25, 30), Vector3.new(0, 0, 0), Color3.fromRGB(255, 201, 60), "Plastic", 0, true, true, true)
klocek("Fusion_Base", "Block", Vector3.new(9, 2, 9), Vector3.new(20, 2, -32), Vector3.new(0, 0, 0), Color3.fromRGB(94, 63, 160), "Plastic", 0, true, true, true)
klocek("Fusion_Bowl", "Block", Vector3.new(7, 4, 7), Vector3.new(20, 5, -32), Vector3.new(0, 0, 0), Color3.fromRGB(155, 107, 242), "Plastic", 0, true, true, true)
klocek("Fusion_Ring", "Block", Vector3.new(7.5, 1, 7.5), Vector3.new(20, 7.5, -32), Vector3.new(0, 0, 0), Color3.fromRGB(224, 91, 255), "Neon", 0, true, true, true)
klocek("Fusion_PipeL", "Block", Vector3.new(1, 6, 1), Vector3.new(16, 6, -36), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("Fusion_PipeR", "Block", Vector3.new(1, 6, 1), Vector3.new(24, 6, -36), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("TreeBackLeftTrunk", "Block", Vector3.new(2, 8, 2), Vector3.new(-26, 5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(154, 101, 52), "Plastic", 0, true, true, true)
klocek("TreeBackLeftLeaves1", "Block", Vector3.new(9, 3, 9), Vector3.new(-26, 10, 40), Vector3.new(0, 0, 0), Color3.fromRGB(79, 184, 58), "Plastic", 0, true, true, true)
klocek("TreeBackLeftLeaves2", "Block", Vector3.new(6, 3, 6), Vector3.new(-25, 13, 39.5), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("TreeBackLeftLeaves3", "Block", Vector3.new(4, 2, 4), Vector3.new(-27, 15.5, 40.5), Vector3.new(0, 0, 0), Color3.fromRGB(79, 184, 58), "Plastic", 0, true, true, true)
klocek("BambooL0", "Block", Vector3.new(0.5, 8, 0.5), Vector3.new(-29, 5, -44), Vector3.new(0, 0, 0), Color3.fromRGB(88, 185, 71), "Plastic", 0, true, true, true)
klocek("BambooL1", "Block", Vector3.new(0.5, 6, 0.5), Vector3.new(-28, 4, -43.5), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("BambooL2", "Block", Vector3.new(0.5, 7, 0.5), Vector3.new(-29.5, 4.5, -43), Vector3.new(0, 0, 0), Color3.fromRGB(88, 185, 71), "Plastic", 0, true, true, true)
klocek("BambooR0", "Block", Vector3.new(0.5, 8, 0.5), Vector3.new(29, 5, -44), Vector3.new(0, 0, 0), Color3.fromRGB(88, 185, 71), "Plastic", 0, true, true, true)
klocek("BambooR1", "Block", Vector3.new(0.5, 6, 0.5), Vector3.new(30, 4, -43.5), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("BambooR2", "Block", Vector3.new(0.5, 7, 0.5), Vector3.new(28.5, 4.5, -43), Vector3.new(0, 0, 0), Color3.fromRGB(88, 185, 71), "Plastic", 0, true, true, true)
klocek("BushALow", "Block", Vector3.new(4, 2, 4), Vector3.new(28, 2, 4), Vector3.new(0, 0, 0), Color3.fromRGB(79, 184, 58), "Plastic", 0, true, true, true)
klocek("BushATop", "Block", Vector3.new(2, 1, 2), Vector3.new(28, 3.5, 4), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("BushBLow", "Block", Vector3.new(4, 2, 4), Vector3.new(-26, 2, -30), Vector3.new(0, 0, 0), Color3.fromRGB(79, 184, 58), "Plastic", 0, true, true, true)
klocek("BushBTop", "Block", Vector3.new(2, 1, 2), Vector3.new(-26, 3.5, -30), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("BushCLow", "Block", Vector3.new(4, 2, 4), Vector3.new(28, 2, 40), Vector3.new(0, 0, 0), Color3.fromRGB(79, 184, 58), "Plastic", 0, true, true, true)
klocek("BushCTop", "Block", Vector3.new(2, 1, 2), Vector3.new(28, 3.5, 40), Vector3.new(0, 0, 0), Color3.fromRGB(62, 158, 46), "Plastic", 0, true, true, true)
klocek("PathLamp0Post", "Block", Vector3.new(1, 6, 1), Vector3.new(8.5, 4.5, -36), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("PathLamp0Head", "Block", Vector3.new(2, 1.5, 2), Vector3.new(8.5, 8.25, -36), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, false)
klocek("PathLamp1Post", "Block", Vector3.new(1, 6, 1), Vector3.new(8.5, 4.5, -18), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("PathLamp1Head", "Block", Vector3.new(2, 1.5, 2), Vector3.new(8.5, 8.25, -18), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, false)
klocek("PathLamp2Post", "Block", Vector3.new(1, 6, 1), Vector3.new(8.5, 4.5, 0), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("PathLamp2Head", "Block", Vector3.new(2, 1.5, 2), Vector3.new(8.5, 8.25, 0), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, false)
klocek("PathLamp3Post", "Block", Vector3.new(1, 6, 1), Vector3.new(8.5, 4.5, 18), Vector3.new(0, 0, 0), Color3.fromRGB(62, 68, 75), "Plastic", 0, true, true, true)
klocek("PathLamp3Head", "Block", Vector3.new(2, 1.5, 2), Vector3.new(8.5, 8.25, 18), Vector3.new(0, 0, 0), Color3.fromRGB(255, 225, 77), "Neon", 0, true, true, false)

model.PrimaryPart = model:FindFirstChild("BackWall0_0")
model.Parent = workspace
pcall(function() game:GetService("Selection"):Set({ model }) end)
pcall(function() ChangeHistory:SetWaypoint("Dodano budowlę: Dzialka_Test") end)
print("Gotowe: Dzialka_Test, klocków: 112")
