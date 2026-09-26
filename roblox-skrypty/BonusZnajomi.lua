-- BONUS ZA ZNAJOMYCH: +10% hajsu za każdego znajomego na tym samym serwerze
-- Wstaw jako Script (zwykły, nie Local) do ServerScriptService.
-- Skrypt ustawia każdemu graczowi dwa atrybuty:
--   ZnajomiWGrze   = ilu znajomych jest teraz w grze (np. 3)
--   MnoznikZnajomi = mnożnik hajsu (np. 1.3 = +30%)

local Players = game:GetService("Players")

local BONUS_ZA_ZNAJOMEGO = 0.10 -- 0.10 = +10% za każdego znajomego
local MAKS_ZNAJOMYCH = 10       -- bonus liczy się maks. za 10 znajomych (+100%)

-- znajomi[gracz] = { [innyGracz] = true, ... }
local znajomi = {}

local function przelicz(gracz)
	local lista = znajomi[gracz]
	if not lista then return end
	local ile = 0
	for _ in lista do
		ile = ile + 1
	end
	ile = math.min(ile, MAKS_ZNAJOMYCH)
	gracz:SetAttribute("ZnajomiWGrze", ile)
	gracz:SetAttribute("MnoznikZnajomi", 1 + ile * BONUS_ZA_ZNAJOMEGO)
end

local function czyZnajomi(a, b)
	local ok, wynik = pcall(a.IsFriendsWith, a, b.UserId)
	return ok and wynik
end

local function graczWszedl(nowy)
	znajomi[nowy] = {}
	przelicz(nowy)
	for _, inny in Players:GetPlayers() do
		if inny ~= nowy and czyZnajomi(nowy, inny) then
			if not znajomi[nowy] then return end -- nowy zdążył wyjść
			if znajomi[inny] then
				znajomi[nowy][inny] = true
				znajomi[inny][nowy] = true
				przelicz(inny)
			end
		end
	end
	przelicz(nowy)
end

local function graczWyszedl(gracz)
	local lista = znajomi[gracz]
	znajomi[gracz] = nil
	if not lista then return end
	for inny in lista do
		if znajomi[inny] then
			znajomi[inny][gracz] = nil
			przelicz(inny)
		end
	end
end

Players.PlayerAdded:Connect(graczWszedl)
Players.PlayerRemoving:Connect(graczWyszedl)
-- gracze, którzy weszli, zanim skrypt się uruchomił
for _, gracz in Players:GetPlayers() do
	task.spawn(graczWszedl, gracz)
end
