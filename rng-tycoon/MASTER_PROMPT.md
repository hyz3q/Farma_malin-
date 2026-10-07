Jesteś doświadczonym projektantem gier Roblox i programistą Luau. Pomożesz mi krok po kroku zbudować grę „Tycoon, but every drop is RNG”. Jestem początkujący: tłumacz prosto, mów dokładnie, GDZIE w Roblox Studio wstawić każdy skrypt (ServerScriptService, ReplicatedStorage, StarterGui, StarterPlayerScripts) i jakiego typu (Script, LocalScript, ModuleScript).

## POMYSŁ GRY
Każdy gracz dostaje własną działkę (tycoon) z JEDNĄ maszyną (Dropper).
Maszyna co kilka sekund zrzuca na taśmę LOSOWY przedmiot. Każdy przedmiot ma rzadkość.
Taśma zawozi przedmiot do sprzedaży i gracz dostaje monety. Im rzadszy przedmiot, tym więcej monet.
Za monety gracz ulepsza maszynę i rozbudowuje bazę. Rzadkie dropy są ogłaszane całemu serwerowi.
Gra ma być bardzo prosta do zrozumienia w 5 sekund i dawać chwile „O MÓJ BOŻE, SEKRET!”.

## PĘTLA ROZGRYWKI
1. Maszyna zrzuca przedmiot (animacja + dźwięk zależny od rzadkości).
2. Przedmiot jedzie taśmą do sprzedawcy → monety (z efektem +liczba nad przedmiotem).
3. Gracz kupuje ulepszenia przyciskami na działce (styl klasycznego tycoona: przyciski na ziemi z ceną).
4. Rzadki drop → efekt świetlny, dźwięk, napis na ekranie; od rzadkości Mythic wzwyż ogłoszenie dla całego serwera.
5. Rebirth: reset monet i ulepszeń → stały mnożnik monet + nowa, lepsza maszyna i nowe przedmioty.

## RZADKOŚCI (wartości startowe, trzymaj je w jednym ModuleScript, żebym mógł łatwo zmieniać)
| Rzadkość | Szansa bazowa | Mnożnik wartości | Kolor |
|---|---|---|---|
| Common | 1 na 2 | x1 | szary |
| Uncommon | 1 na 5 | x3 | zielony |
| Rare | 1 na 25 | x10 | niebieski |
| Epic | 1 na 150 | x40 | fioletowy |
| Legendary | 1 na 1 000 | x200 | złoty |
| Mythic | 1 na 10 000 | x1 500 | czerwony |
| Secret | 1 na 1 000 000 | x50 000 | tęczowy |
Szanse liczone jako „1 na X”, a szczęście (Luck) DZIELI X (Luck x2 → Legendary 1 na 500). Common to „reszta”.
Każda maszyna ma własną listę przedmiotów w każdej rzadkości (np. Maszyna 1: kamień, cegła, puszka… Secret: złota żaba).

## ULEPSZENIA MASZYNY (kupowane za monety, ceny rosną wykładniczo)
- Szybkość dropu (np. co 4 s → co 1 s)
- Szczęście (+10% Luck za poziom)
- Wartość przedmiotów (+%)
- Szybkość taśmy
- Dodatkowe dekoracje bazy (tylko wygląd, ale fajne do pokazania)

## GABLOTA (kolekcja)
Gracz może zachować rzadki przedmiot zamiast go sprzedać i postawić na podeście w bazie.
Każdy przedmiot w gablocie daje mały stały bonus do monet. Index (kolekcja) pokazuje wszystkie przedmioty i które już zdobyłem — to ma motywować do „zebrania wszystkich”.

## GAME PASSY (mam już gotowe ikonki – użyj tych nazw i cen w Robux)
| Game pass | Cena | Działanie |
|---|---|---|
| VIP | 69 | x2 monety, złoty napis VIP nad głową |
| Auto Sell | 45 | przedmioty sprzedają się od razu, bez czekania na taśmę |
| +2 sloty | 49 | +2 miejsca w gablocie |
| Większy plecak | 15 | więcej miejsca na zachowane przedmioty |
| Potrójny drop (x3 Hatch) | 35 | 10% szansy, że maszyna zrzuci 3 przedmioty naraz |
| Szybkie otwieranie (Fast Open) | 18 | maszyna działa 1,5x szybciej |
| Lucky x2 / x3 / x4 / x5 | 10 / 15 / 20 / 24 | mnożnik Luck; liczy się NAJWYŻSZY posiadany, nie sumują się |
ID passów wpiszę sam do jednego ModuleScript „Config”. Zostaw tam zera i komentarze.

## DEVELOPER PRODUCTS (kupowane wielokrotnie)
- Boost szczęścia x2 na 15 minut
- Paczka monet (mała / średnia / duża, skalowana do postępu gracza)
- „Natychmiastowy drop Legendary+” (gwarantowany Legendary albo lepszy)
Obsłuż je przez MarketplaceService.ProcessReceipt POPRAWNIE: zapisz zakup w DataStore przed zwróceniem PurchaseGranted, nie dawaj nagrody dwa razy.

## SPOŁECZNE
- +10% monet za każdego znajomego na serwerze (mam już skrypt BonusZnajomi — użyj atrybutu gracza „MnoznikZnajomi”).
- Ogłoszenia na cały serwer o rzadkich dropach (Mythic i Secret) z nickiem gracza.
- Ranking (leaderstats): Monety, Rebirths, Najrzadszy drop.
- Globalna tablica „Najrzadsze dropy dzisiaj” na spawnie.

## ZASADY TECHNICZNE (bardzo ważne)
1. SERWER decyduje o wszystkim: losowanie (Random.new()), monety, zakupy, ulepszenia. Klient tylko pokazuje efekty i wysyła prośby („chcę kupić ulepszenie X”). Serwer zawsze sprawdza, czy gracz ma pieniądze i czy prośba ma sens. Nigdy nie ufaj wartościom od klienta.
2. Zapisywanie: DataStoreService z pcall i ponawianiem, UpdateAsync, autozapis co 2 minuty, zapis przy wyjściu gracza i w game:BindToClose. Wersjonuj dane (pole „wersja”), żeby przyszłe aktualizacje nie psuły zapisów.
3. Wydajność: maks. ok. 30 przedmiotów na taśmie na gracza; stare usuwaj. Przedmioty to proste Party/MeshParty, bez fizyki tam, gdzie nie trzeba (taśma może przesuwać je przez TweenService albo CFrame po stronie klienta, a serwer liczy tylko czas dojazdu).
4. UI: WSZYSTKO w Scale (procentach), nie w Offset, z UIAspectRatioConstraint dla ikon i TextScaled + UITextSizeConstraint dla tekstów. Gra musi wyglądać dobrze na TELEFONIE. Nie kładź przycisków w lewym dolnym rogu (joystick) ani w prawym dolnym (skok).
5. Kod modularny: ModuleScripty Config, Rarities, Items, DataManager, DropperManager, ConveyorManager, UpgradeManager, PassManager, ProductManager, RebirthManager, AnnouncementManager, CollectionManager + jeden RemoteEvents folder w ReplicatedStorage.
6. Każdy plik zaczyna się komentarzem: co robi i gdzie leży. Komentarze po polsku.

## STYL GRAFICZNY
Kolorowy, prosty, czytelny. Duże, grube przyciski z czarnym obrysem i cieniem (styl jak popularne gry symulatorowe). Czcionka Lilita One / Fredoka. Rzadkości wyraźnie różnią się kolorem, poświatą i dźwiękiem. Secret ma tęczową poświatę, wstrząs ekranu i wyjątkowy dźwięk.

## KOLEJNOŚĆ BUDOWANIA (rób po jednym kroku i czekaj, aż napiszę „działa”)
1. Działka gracza + przypisywanie działki po wejściu.
2. Maszyna, która co X sekund zrzuca przedmiot (na razie bez rzadkości).
3. Taśma + sprzedawca + monety (leaderstats).
4. System rzadkości i losowania (ModuleScript Rarities) + kolory przedmiotów.
5. Zapisywanie danych.
6. Przyciski ulepszeń.
7. UI: monety, szczęście, przycisk sklepu, okno ulepszeń (wszystko w Scale).
8. Efekty rzadkich dropów + ogłoszenia serwerowe.
9. Game passy.
10. Developer products.
11. Gablota i Index kolekcji.
12. Rebirth + druga maszyna.
13. Ranking i tablica najrzadszych dropów.
14. Dopracowanie: dźwięki, animacje, kody promocyjne (np. RELEASE = 10 000 monet).

## WERSJA NA START (MVP)
Na premierę wystarczą: 1 działka na gracza (serwer do 8 graczy), 1 maszyna, 7 rzadkości, 15–20 przedmiotów, 4 ulepszenia, rebirth, wszystkie game passy i zapisywanie. Reszta w aktualizacjach co tydzień.

## JAK MI ODPOWIADAĆ
- Przy każdym kroku podaj: listę plików, pełny kod każdego pliku (bez „…reszta kodu”), dokładne miejsce w Explorerze i jak przetestować krok w Studio (Play / Test → Device telefon).
- Jeśli coś wymaga zrobienia ręcznie w Studio (np. stworzenie Partu), opisz to krok po kroku.
- Po każdym kroku napisz krótko, co mogło pójść źle i jak to rozpoznać w oknie Output.
- Nie dodawaj rzeczy, o które nie prosiłem, zanim nie skończymy MVP.

Zacznij od kroku 1.
