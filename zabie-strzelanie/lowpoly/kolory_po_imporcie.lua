-- Kolory dla low poly żaby po imporcie FBX do Roblox Studio.
-- Uwaga: model ma już kolory z tekstury paleta.png. Ten skrypt jest tylko na wypadek, gdyby po imporcie żaba była szara.
-- 1. Zaimportuj Zaba_LowPoly.fbx (Home -> Import 3D) i zaznacz model w Explorerze.
-- 2. Wklej to do Command Bar i naciśnij Enter.
local KOLORY = {
	Cialo = Color3.fromRGB(93, 187, 74), Brzuch = Color3.fromRGB(211, 234, 142), Ciemne = Color3.fromRGB(60, 139, 52),
	OczyBiale = Color3.fromRGB(255, 255, 255), Zrenice = Color3.fromRGB(17, 17, 17), Pysk = Color3.fromRGB(74, 22, 34),
	Policzki = Color3.fromRGB(242, 139, 160), Kapelusz = Color3.fromRGB(94, 60, 36), KapeluszPasek = Color3.fromRGB(27, 27, 27),
	Bron = Color3.fromRGB(42, 45, 51), BronStal = Color3.fromRGB(142, 150, 159), BronRekojesc = Color3.fromRGB(122, 74, 38),
}
local ile = 0
for _, wybrany in game:GetService("Selection"):Get() do
	for _, obj in { wybrany, unpack(wybrany:GetDescendants()) } do
		if obj:IsA("MeshPart") and KOLORY[obj.Name] then
			obj.Color = KOLORY[obj.Name]
			obj.Material = Enum.Material.SmoothPlastic
			obj.TextureID = ""
			ile = ile + 1
		end
	end
end
print("Pokolorowano części: " .. ile)
