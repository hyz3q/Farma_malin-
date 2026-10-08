-- KAMERA PODGLĄD: ustawia kamerę Studio na stały widok zaznaczonej budowli,
-- żeby szybko robić takie same zrzuty ekranu dla AI.
-- 1. Zaznacz budowlę (Model albo Part) w Explorerze.
-- 2. Zmień WIDOK poniżej i wklej całość do Command Bar, naciśnij Enter.
-- 3. Zrób zrzut ekranu. Powtórz dla innych widoków.

local WIDOK = 4 -- 1 = przód, 2 = prawy bok, 3 = góra, 4 = 3/4 (skos z góry), 5 = tył
local ZAPAS = 1.15 -- większa liczba = kamera dalej

local wybrany = game:GetService("Selection"):Get()[1]
assert(wybrany, "Najpierw zaznacz budowlę w Explorerze!")

local cf, rozmiar
if wybrany:IsA("Model") then
	cf, rozmiar = wybrany:GetBoundingBox()
elseif wybrany:IsA("BasePart") then
	cf, rozmiar = wybrany.CFrame, wybrany.Size
else
	error("Zaznacz Model albo Part")
end

local cam = workspace.CurrentCamera
local srodek = cf.Position
local promien = rozmiar.Magnitude / 2
local odleglosc = promien / math.tan(math.rad(cam.FieldOfView / 2)) * ZAPAS

local przod, prawo, gora = cf.LookVector, cf.RightVector, cf.UpVector
local kierunki = {
	[1] = { przod, gora },
	[2] = { prawo, gora },
	[3] = { gora, przod },
	[4] = { (przod + prawo + gora * 0.8).Unit, gora },
	[5] = { -przod, gora },
}
local k = kierunki[WIDOK]
assert(k, "WIDOK musi być od 1 do 5")

cam.CFrame = CFrame.lookAt(srodek + k[1] * odleglosc, srodek, k[2])
cam.Focus = CFrame.new(srodek) -- kamera Studio obraca się wokół budowli
print(("Widok %d ustawiony dla: %s (rozmiar %.1f x %.1f x %.1f)"):format(WIDOK, wybrany.Name, rozmiar.X, rozmiar.Y, rozmiar.Z))
