-- INSPEKTOR BUDOWLI: sprawdza zaznaczoną budowlę i wypisuje raport w Output.
-- Raport skopiuj i wklej do AI – to jego „oczy”, gdy nie widzi Studio.
-- 1. Zaznacz budowlę (Model albo Folder) w Explorerze.
-- 2. Wklej całość do Command Bar i naciśnij Enter.

local LIMIT_CZESCI = 500 -- ile klocków maksymalnie na jedną budowlę
local SIATKA = 0.5       -- pozycje i rozmiary powinny być wielokrotnością tej liczby
local MALY = 0.2         -- klocki mniejsze niż to są podejrzanie małe

local wybrany = game:GetService("Selection"):Get()[1]
assert(wybrany, "Najpierw zaznacz budowlę w Explorerze!")

local czesci = {}
if wybrany:IsA("BasePart") then table.insert(czesci, wybrany) end
for _, obj in wybrany:GetDescendants() do
	if obj:IsA("BasePart") then table.insert(czesci, obj) end
end

local function naSiatce(liczba)
	local r = liczba / SIATKA
	return math.abs(r - math.round(r)) < 0.01
end
local function wektorNaSiatce(v)
	return naSiatce(v.X) and naSiatce(v.Y) and naSiatce(v.Z)
end
local function obrocony(cf)
	local x, y, z = cf:ToOrientation()
	local function prosty(kat)
		local st = math.deg(kat) / 90
		return math.abs(st - math.round(st)) < 0.01
	end
	return not (prosty(x) and prosty(y) and prosty(z))
end
local function opis(p)
	return p:GetFullName():gsub("^Workspace%.", "")
end

local niezakotwiczone, pozaSiatka, male, bezNazwy, wiszace, duplikaty = {}, {}, {}, {}, {}, {}
local kolory = {}
local widziane = {}

local params = OverlapParams.new()
params.FilterType = Enum.RaycastFilterType.Include
params.FilterDescendantsInstances = { wybrany }

for _, p in czesci do
	if not p.Anchored then table.insert(niezakotwiczone, p) end
	if not obrocony(p.CFrame) and (not wektorNaSiatce(p.Position) or not wektorNaSiatce(p.Size)) then
		table.insert(pozaSiatka, p)
	end
	if math.min(p.Size.X, p.Size.Y, p.Size.Z) < MALY then table.insert(male, p) end
	if p.Name == "Part" or p.Name == "MeshPart" or p.Name == "Union" then table.insert(bezNazwy, p) end

	-- klocek, który nie dotyka żadnego innego klocka tej budowli
	local obok = workspace:GetPartBoundsInBox(p.CFrame, p.Size + Vector3.new(0.1, 0.1, 0.1), params)
	if #obok <= 1 and #czesci > 1 then table.insert(wiszace, p) end

	-- dwa klocki w tym samym miejscu i tego samego rozmiaru (migotanie ścian)
	local klucz = ("%.2f,%.2f,%.2f|%.2f,%.2f,%.2f"):format(p.Position.X, p.Position.Y, p.Position.Z, p.Size.X, p.Size.Y, p.Size.Z)
	if widziane[klucz] then table.insert(duplikaty, p) else widziane[klucz] = true end

	local hex = p.Color:ToHex()
	kolory[hex] = (kolory[hex] or 0) + 1
end

local cf, rozmiar
if wybrany:IsA("Model") then
	cf, rozmiar = wybrany:GetBoundingBox()
elseif wybrany:IsA("BasePart") then
	rozmiar = wybrany.Size
end

local L = {}
local function linia(t) table.insert(L, t) end
local function lista(tytul, tab, max)
	if #tab == 0 then return end
	linia(("⚠ %s: %d"):format(tytul, #tab))
	for i = 1, math.min(#tab, max or 5) do
		local p = tab[i]
		linia(("   - %s  rozmiar %.2f x %.2f x %.2f  pozycja %.2f, %.2f, %.2f"):format(opis(p), p.Size.X, p.Size.Y, p.Size.Z, p.Position.X, p.Position.Y, p.Position.Z))
	end
	if #tab > (max or 5) then linia(("   ... i %d więcej"):format(#tab - (max or 5))) end
end

linia("===== RAPORT BUDOWLI: " .. wybrany.Name .. " =====")
linia(("Klocków: %d (limit %d)%s"):format(#czesci, LIMIT_CZESCI, #czesci > LIMIT_CZESCI and "  ⚠ ZA DUŻO" or ""))
if rozmiar then
	linia(("Rozmiar całości: %.1f x %.1f x %.1f studów (szer. x wys. x głęb.). Postać gracza ma ok. 5 wysokości."):format(rozmiar.X, rozmiar.Y, rozmiar.Z))
end
lista("Niezakotwiczone (Anchored = false)", niezakotwiczone)
lista("Poza siatką " .. SIATKA .. " (krzywe pozycje/rozmiary)", pozaSiatka)
lista("Bardzo małe klocki (< " .. MALY .. ")", male)
lista("Bez nazwy (Part/MeshPart/Union)", bezNazwy, 3)
lista("Niczego nie dotykają (wiszą w powietrzu albo mają szczelinę)", wiszace)
lista("Duplikaty w tym samym miejscu (migotanie)", duplikaty)

local posortowane = {}
for hex, ile in kolory do table.insert(posortowane, { hex = hex, ile = ile }) end
table.sort(posortowane, function(a, b) return a.ile > b.ile end)
linia(("Kolory (%d różnych), najczęstsze:"):format(#posortowane))
for i = 1, math.min(#posortowane, 8) do
	local k = posortowane[i]
	linia(("   #%s  %d klocków (%.0f%%)"):format(k.hex, k.ile, k.ile / #czesci * 100))
end
linia("===== KONIEC RAPORTU – skopiuj całość i wklej do AI =====")
print(table.concat(L, "\n"))
