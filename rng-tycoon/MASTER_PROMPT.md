Jesteś doświadczonym projektantem gier Roblox i programistą Luau. Pomożesz mi krok po kroku zbudować grę „Tycoon, but every drop is RNG”. Jestem początkujący: tłumacz prosto, mów dokładnie, GDZIE w Roblox Studio wstawić każdy skrypt (ServerScriptService, ReplicatedStorage, StarterGui, StarterPlayerScripts) i jakiego typu (Script, LocalScript, ModuleScript).

## POMYSŁ GRY
Każdy gracz dostaje własną działkę (tycoon) z JEDNĄ maszyną (Dropper).
Maszyna co kilka sekund zrzuca na taśmę LOSOWY przedmiot. Każdy przedmiot ma rzadkość.
Taśma zawozi przedmiot do sprzedaży i gracz dostaje monety. Im rzadszy przedmiot, tym więcej monet.
Za monety gracz ulepsza maszynę i rozbudowuje bazę. Rzadkie dropy są ogłaszane całemu serwerowi.
Gra ma być bardzo prosta do zrozumienia w 5 sekund i dawać chwile „O MÓJ BOŻE, SEKRET!”.

## NAJWAŻNIEJSZE PRIORYTETY (ważniejsze niż liczba funkcji)
1. SATYSFAKCJA Z DROPU: każdy dobry drop ma dawać „WOW”. Gracz ma CZUĆ różnicę między Rare a Legendary, zanim przeczyta napis.
2. GRAFIKA: gra ma wyglądać ładnie i spójnie od pierwszej sekundy (miniaturki i pierwsze wrażenie decydują, czy ktoś zostanie).
Jeśli musisz wybierać, lepiej mniej funkcji, ale dopracowany drop i ładny wygląd. Zwykłe dropy mają być krótkie i nienachalne, żeby rzadkie bardziej się wyróżniały.

## SATYSFAKCJA Z DROPU – „DRABINA EFEKTÓW”
Każda wyższa rzadkość dokłada coś NOWEGO do efektów niższej (gracz uczy się, że „więcej efektów = lepszy drop”):
| Rzadkość | Efekty |
|---|---|
| Common | krótki „pyk”, mała chmurka |
| Uncommon | + zielony błysk, wyższy dźwięk |
| Rare | + niebieska poświata (PointLight + Highlight), iskry, napis „RARE!” nad przedmiotem |
| Epic | + fioletowy słup światła (Beam) z maszyny, lekkie drgnięcie kamery, dźwięk „whoosh” |
| Legendary | + napięcie przed dropem: maszyna trzęsie się i świeci przez ok. 1 s, potem złoty wybuch cząsteczek, konfetti, mocniejsze drgnięcie kamery, krótki błysk ekranu, wielki napis na środku ekranu |
| Mythic | + na pół sekundy zwolnione tempo (slow-motion przedmiotu), czerwone pioruny, ogłoszenie na cały serwer, specjalna muzyka-dżingiel |
| Secret | + ekran przyciemnia się, odliczanie „3…2…1”, tęczowa eksplozja, fajerwerki nad działką widoczne z całej mapy, ogłoszenie z nickiem, przedmiot zostaje na chwilę w powietrzu i się obraca |
Zasady:
- Napięcie (trzęsienie maszyny) pokazuj TYLKO, gdy naprawdę wypadło Legendary lub lepiej. Nie oszukuj gracza fałszywymi zapowiedziami.
- Przy każdym dropie od Rare wzwyż pokaż szansę: „1 na 1 000!” – to buduje dumę.
- Pierwszy raz zdobyty przedmiot dostaje pieczątkę „NEW!” i dźwięk odblokowania; licznik kolekcji (np. „Index 12/40”) skacze z animacją.
- Liczby monet „wyskakują” z przedmiotu przy sprzedaży (+150) i lecą do licznika na górze ekranu; licznik krótko się powiększa.
- Dźwięk każdej rzadkości jest inny i rozpoznawalny bez patrzenia.
- System „pity”: jeśli gracz przez 300 dropów nie dostał Epic lub lepszego, następny drop to gwarantowany Epic (pokaż pasek „Gwarantowany Epic za: 37 dropów”). Gracz zawsze ma na co czekać.
- Wszystkie efekty trzymaj w jednym module (EffectsManager) z jedną tabelą ustawień na rzadkość, żebym mógł je łatwo stroić.
- Efekty i dźwięki odtwarzaj po stronie KLIENTA (serwer tylko wysyła: kto, co, jaka rzadkość). Efekty cudzych dropów pokazuj słabiej niż własnych (oprócz Mythic i Secret).
- Wydajność na telefonie: limit cząsteczek, efekty sprzątane po 3 s, ustawienie „Mniej efektów” w opcjach.

## GRAFIKA I WYGLĄD
- Styl: kolorowy LOW POLY (płaskie ściany, mało szczegółów, czyste kolory), jak w nowoczesnych grach Roblox. Wszystko w jednym stylu: działki, maszyna, taśma, przedmioty, UI.
- Oświetlenie: Lighting.Technology = Future, Atmosphere (lekka mgiełka), Bloom (delikatny, żeby świecące rzeczy ładnie lśniły), ColorCorrection (trochę więcej nasycenia), Sky z ładnym niebem. Podaj dokładne wartości.
- Maszyna to „gwiazda” działki: wyraźnie widoczna, z animacją pracy (tłoki, migające lampki, kołysanie), z każdym ulepszeniem wygląda lepiej (nowe części, światła, kolory). Gracz ma WIDZIEĆ postęp.
- Przedmioty: proste, czytelne kształty, rozpoznawalne z daleka; im rzadsze, tym bardziej błyszczą (Material Neon/ForceField w detalach, poświata, unoszenie się i obrót).
- Działka rośnie wizualnie z postępem: nowe ścieżki, ogrodzenie, dekoracje, podest gabloty.
- UI: duże, zaokrąglone przyciski (UICorner), gruby czarny obrys (UIStroke), cień, gradienty (UIGradient), czcionka Lilita One/Fredoka, ikonki zamiast długich tekstów. Animacje UI: przyciski lekko rosną po najechaniu i „sprężynują” po kliknięciu (TweenService), okna wjeżdżają płynnie.
- Kolory rzadkości wszędzie te same (przedmiot, napis, ramka w Indexie, ogłoszenie).
- Mam własny pipeline low poly w Blenderze (modele eksportowane jako FBX z jedną teksturą palety kolorów). Jeśli potrzebujesz modeli, opisz mi, co ma być (kształt, kolory, rozmiar w studach), a ja je przygotuję; do tego czasu używaj prostych Partów jako tymczasowych.

## PĘTLA ROZGRYWKI
1. Maszyna zrzuca przedmiot z efektami z „drabiny efektów” (patrz wyżej).
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
1. Oświetlenie i wygląd świata (Lighting, Atmosphere, Bloom, niebo) + działka gracza i przypisywanie działki po wejściu.
2. Maszyna, która co X sekund zrzuca przedmiot (na razie bez rzadkości), z animacją pracy.
3. Taśma + sprzedawca + monety (leaderstats) + wyskakujące liczby monet.
4. System rzadkości i losowania (ModuleScript Rarities) + kolory i poświata przedmiotów.
5. DRABINA EFEKTÓW dropów (EffectsManager): dźwięki, cząsteczki, kamera, napisy, napięcie przed Legendary+, ogłoszenia serwerowe. Ten krok dopracowujemy, aż będzie naprawdę satysfakcjonujący.
6. Zapisywanie danych.
7. Przyciski ulepszeń + wizualne zmiany maszyny po ulepszeniu.
8. UI: monety, szczęście, pasek „pity”, przycisk sklepu, okno ulepszeń (wszystko w Scale, z animacjami).
9. Gablota i Index kolekcji z pieczątką „NEW!”.
10. Game passy.
11. Developer products.
12. Rebirth + druga maszyna.
13. Ranking i tablica najrzadszych dropów.
14. Dopracowanie: opcja „Mniej efektów”, kody promocyjne (np. RELEASE = 10 000 monet), drobne poprawki wyglądu.

## WERSJA NA START (MVP)
Na premierę wystarczą: 1 działka na gracza (serwer do 8 graczy), 1 maszyna, 7 rzadkości, 15–20 przedmiotów, 4 ulepszenia, rebirth, wszystkie game passy i zapisywanie. Reszta w aktualizacjach co tydzień.
Nie wypuszczaj gry, dopóki drop Legendary+ nie daje prawdziwego „WOW” i gra nie wygląda ładnie na telefonie – to ważniejsze niż dodatkowe funkcje.

## JAK MI ODPOWIADAĆ
- Przy każdym kroku podaj: listę plików, pełny kod każdego pliku (bez „…reszta kodu”), dokładne miejsce w Explorerze i jak przetestować krok w Studio (Play / Test → Device telefon).
- Jeśli coś wymaga zrobienia ręcznie w Studio (np. stworzenie Partu), opisz to krok po kroku.
- Po każdym kroku napisz krótko, co mogło pójść źle i jak to rozpoznać w oknie Output.
- Nie dodawaj rzeczy, o które nie prosiłem, zanim nie skończymy MVP.
- Przy krokach z efektami i grafiką zaproponuj, co jeszcze mogłoby zwiększyć satysfakcję lub poprawić wygląd, ale zrób to jako osobną listę propozycji.

Zacznij od kroku 1.
