-- Ustawienia mapy "Staw" po imporcie Mapa_Staw.fbx do Roblox Studio.
-- 1. Home -> Import 3D -> Mapa_Staw.fbx, potem zaznacz zaimportowany model w Explorerze.
-- 2. Wklej to do Command Bar i naciśnij Enter.
local ChangeHistory = game:GetService("ChangeHistoryService")
pcall(function() ChangeHistory:SetWaypoint("Przed ustawieniem mapy") end)
local ile = 0
for _, wybrany in game:GetService("Selection"):Get() do
	for _, obj in { wybrany, unpack(wybrany:GetDescendants()) } do
		if obj:IsA("MeshPart") then
			obj.Anchored = true
			obj.Material = Enum.Material.SmoothPlastic
			if obj.Name == "Woda" then
				obj.Transparency = 0.35
				obj.CanCollide = false           -- przez wodę można przejść (staw jest płytki)
				obj.CastShadow = false
			elseif obj.Name == "Teren" or string.match(obj.Name, "^Most") then
				-- dokładna kolizja, żeby chodzić po górkach i moście, a nie po niewidzialnych pudłach
				obj.CollisionFidelity = Enum.CollisionFidelity.PreciseConvexDecomposition
			elseif string.match(obj.Name, "^Palki") or string.match(obj.Name, "^Lilia") or string.match(obj.Name, "^Grzyb") then
				obj.CanCollide = false           -- ozdoby nie blokują gracza
			end
			ile = ile + 1
		end
	end
end
pcall(function() ChangeHistory:SetWaypoint("Ustawiono mapę") end)
print("Mapa gotowa! Ustawiono części: " .. ile)
