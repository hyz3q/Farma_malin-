Jesteś doświadczonym projektantem gier Roblox i programistą Luau. Pomożesz mi krok po kroku zbudować grę „Tycoon, but every drop is RNG”. Jestem początkujący: tłumacz prosto, mów dokładnie, GDZIE w Roblox Studio wstawić każdy skrypt (ServerScriptService, ReplicatedStorage, StarterGui, StarterPlayerScripts) i jakiego typu (Script, LocalScript, ModuleScript).

## POMYSŁ GRY
Każdy gracz dostaje własną działkę (tycoon) z JEDNĄ maszyną (Dropper).
Maszyna co kilka sekund zrzuca na taśmę LOSOWY przedmiot. Każdy przedmiot ma rzadkość.
Taśma zawozi przedmiot do sprzedaży i gracz dostaje monety. Im rzadszy przedmiot, tym więcej monet.
Za monety gracz ulepsza maszynę i rozbudowuje bazę. Rzadkie dropy są ogłaszane całemu serwerowi.
Gra ma być bardzo prosta do zrozumienia w 5 sekund i dawać chwile „O MÓJ BOŻE, SEKRET!”.

## NAJWAŻNIEJSZE PRIORYTETY (ważniejsze niż liczba funkcji)
1. SATYSFAKCJA Z DROPU: każdy dobry drop ma dawać „WOW”. Gracz ma CZUĆ różnicę między Rare a Legendary, zanim przeczyta napis.
1b. SATYSFAKCJONUJĄCY ŚWIAT 3D: wszystko, co się rusza (wypadanie z droppera, taśma, sprzedawanie, przyciski, budowanie), ma być płynne, sprężyste i z dźwiękiem – tak, żeby fajnie było na to patrzeć.
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
- System „pity”: jeśli gracz przez 800 dropów nie dostał Legendary lub lepszego, następny drop to gwarantowany Legendary (pokaż pasek „Gwarantowany Legendary za: 137 dropów”). Licznik zapisuj w danych gracza. Gracz zawsze ma na co czekać.
- Wszystkie efekty trzymaj w jednym module (EffectsManager) z jedną tabelą ustawień na rzadkość, żebym mógł je łatwo stroić.
- Efekty i dźwięki odtwarzaj po stronie KLIENTA (serwer tylko wysyła: kto, co, jaka rzadkość). Efekty cudzych dropów pokazuj słabiej niż własnych (oprócz Mythic i Secret).
- Wydajność na telefonie: limit cząsteczek, efekty sprzątane po 3 s, ustawienie „Mniej efektów” w opcjach.

## FIZYKA I ŚWIAT 3D – KAŻDY RUCH MA BYĆ SATYSFAKCJONUJĄCY
Zasada: nic nie pojawia się ani nie znika „po prostu”. Każda rzecz w świecie ma wejście, ruch i wyjście z animacją, dźwiękiem i małym efektem. Gracz ma lubić samo patrzenie na swoją działkę, nawet gdy nic nie klika.

WYPADANIE PRZEDMIOTU Z DROPPERA (najważniejsza animacja w grze – widać ją setki razy):
1. Przygotowanie: maszyna lekko „nabiera powietrza” (krótkie ściśnięcie i rozciągnięcie, ok. 0,15 s), lampka mruga, cichy dźwięk ładowania.
2. Wystrzał: przedmiot wyskakuje z wylotu łukiem (krzywa Béziera / parabola), z lekkim obrotem, z małym obłoczkiem pary i dźwiękiem „pop”. Maszyna po wystrzale odskakuje sprężyście (odrzut).
3. Lądowanie: przedmiot uderza w taśmę, spłaszcza się na chwilę (squash) i odbija 1–2 razy coraz niżej, robi mały obłoczek kurzu; dźwięk uderzenia zależy od wielkości/ciężaru (ciężkie = niższy, głuchy dźwięk).
4. Rzadkie przedmioty lądują efektowniej: wolniej opadają, unoszą się chwilę nad taśmą, obracają się i świecą (zgodnie z „drabiną efektów”).
5. Losuj drobne różnice (kąt, siła obrotu, wysokość łuku), żeby żadne dwa dropy nie wyglądały identycznie.

TAŚMA:
- Widać, że się kręci (przesuwająca się tekstura/paski, kręcące się wałki na końcach).
- Przedmioty lekko się kołyszą i podskakują na łączeniach taśmy; rzadkie jadą na środku, z poświatą odbijającą się od taśmy.
- Gdy taśma przyspiesza po ulepszeniu, widać to i słychać (wyższy dźwięk silnika).

SPRZEDAWANIE:
- Przedmiot wpada do „zjadacza” (piec/zsyp/skarbonka), który go wciąga: przedmiot maleje i wiruje, zjadacz „przełyka” (ściśnięcie), wyskakują monety, które fizycznie lecą do licznika na ekranie.
- Przy rzadkim przedmiocie zjadacz reaguje mocniej (trzęsie się, świeci, wyrzuca fontannę monet).

PRZYCISKI TYCOONA I BUDOWANIE:
- Przycisk na ziemi zapada się pod graczem jak prawdziwy, z dźwiękiem „klik”.
- Kupiona rzecz NIE pojawia się nagle: wyrasta z ziemi albo spada z nieba i ląduje sprężyście; części składają się po kolei (klocek po klocku), z obłoczkami kurzu i dźwiękami.
- Ulepszona maszyna zmienia wygląd z animacją (nowe części wjeżdżają na miejsce, błysk, dźwięk „upgrade”).

ŚWIAT ŻYJE:
- Maszyna stale pracuje: tłoki, obracające się koła zębate, migające lampki, para z komina; im szybsza maszyna, tym szybsze ruchy.
- Światła na działce pulsują w rytm dropów; przy rzadkim dropie cała działka na moment rozbłyskuje kolorem rzadkości.
- Drobne żywe detale: lekko kołyszące się krzaki i bambus, latające motyle/iskierki, flagi na wietrze.

ZASADY RUCHU (zastosuj wszędzie):
- Używaj krzywych z „charakterem”: Enum.EasingStyle.Back i Elastic dla pojawiania się i odbić, Quad/Sine dla płynnych ruchów. Unikaj liniowych ruchów.
- Zawsze: przygotowanie → akcja → dobicie (anticipation, action, follow-through). Ściśnięcie i rozciągnięcie (squash & stretch) przy uderzeniach.
- Każdy ruch ma dźwięk; dźwięki lekko zmieniaj wysokością (PlaybackSpeed losowo ±5%), żeby się nie nudziły.
- Ruchy krótkie i szybkie (0,1–0,4 s) dla częstych rzeczy, dłuższe tylko dla rzadkich dropów i dużych zakupów.

TECHNICZNIE:
- Animacje dropów, taśmy i sprzedawania rób po stronie KLIENTA (TweenService, RunService.RenderStepped, krzywe Béziera) na zakotwiczonych (Anchored) przedmiotach. To daje płynność bez szarpania i nie obciąża serwera.
- Nie używaj prawdziwej fizyki Robloxa dla przedmiotów na taśmie (setki luźnych części = lagi i dziwne zachowania). Prawdziwą fizykę możesz użyć tylko do pojedynczych efektów, np. rozsypujących się monet przy Mythic/Secret, i usuwaj je po kilku sekundach.
- Serwer decyduje tylko CO wypadło i KIEDY; wygląd ruchu to praca klienta.

## GRAFIKA I WYGLĄD
Styl: „odświeżony klasyczny Roblox” – taki jak w Steal an Egg, Steal a Brainrot czy Grow a Garden.
CAŁA gra jest z klocków ze studsami: świat, maszyna, przedmioty z droppera, zwierzaki i postacie. Jeden spójny styl, jak stary Roblox / LEGO, ale w jaskrawych kolorach i jasnym świetle.

ŚWIAT (klocki):
- Wszystko budowane z prostych Partów (prostopadłościany, czasem cylindry i kliny). Mało detali, duże czytelne kształty.
- Na powierzchniach widać STUDSY (wypustki). Najlepiej jako obiekt Texture z obrazkiem studsa powtarzanym na całej powierzchni (StudsPerTileU/V), żeby studsy wyglądały tak samo na każdym klocku i dało się łatwo zmieniać ich kolor/przezroczystość.
- SZACHOWNICA z dwóch odcieni tego samego koloru na dużych powierzchniach: trawa w dwóch zieleniach, ściany w dwóch brązach/pomarańczach, piasek w dwóch żółciach. Kafle duże (np. 8×8 lub 16×16 studów). Daje to poczucie skali i sprawia, że płaskie miejsca nie są nudne.
- Jasne „obwódki” na krawędziach: np. jaśniejszy zielony pasek trawy na górze ściany, jaśniejsza krawędź ścieżki.
- Kolory bardzo nasycone i radosne: soczysta zieleń, mocny błękit nieba, ciepłe pomarańcze i żółcie. Bez szarości i brudnych odcieni.
- Proste dekoracje z klocków: drzewa z kilku klocków (pień + bryły liści), bambus z cienkich słupków, krzaki jako zielone klocki ze studsami, woda jako płaski niebieski klocek, lilie jako płaskie dyski.
- Układ jak w grach typu Steal a…: każdy gracz ma swoją działkę-pas po bokach, oddzieloną wysokimi ścianami w szachownicę, a na środku mapy jest kolorowe centrum (sklep, ranking, wydarzenia), widoczne z daleka.

OŚWIETLENIE (jasne, słoneczne, „zabawkowe”):
- Wszystko ma być dobrze widoczne: brak ciemnych zakamarków, miękkie i delikatne cienie, jasne ambient i outdoor ambient.
- Czyste, błękitne niebo z kilkoma chmurkami; bez gęstej mgły (najwyżej bardzo lekka Atmosphere daleko na horyzoncie).
- ColorCorrection: trochę więcej nasycenia i lekko podbity kontrast. Bloom bardzo delikatny – tylko żeby świecące rzadkie przedmioty ładnie lśniły.
- Podaj dokładne wartości wszystkich ustawień Lighting.

PRZEDMIOTY I POSTACIE (też z klocków):
- Zbudowane z małych klocków ze studsami (jak figurki z LEGO): kilka–kilkanaście prostych brył, wyraźne kształty, rozpoznawalne z daleka.
- Słodkie albo zabawne: duże głowy, proste oczka i buźki z płaskich klocków (białko + czarna źrenica), czasem paski i łatki w innym kolorze (np. tygrys w pomarańczowo-czarne pasy).
- Wyróżniają się na tle świata KOLOREM i EFEKTAMI, nie innym stylem: im rzadsze, tym bardziej błyszczą (Neon/ForceField w detalach, poświata, unoszenie się i obrót).
- Małe efekty „charakteru”: np. „Zzz” nad śpiącym zwierzakiem, serduszka, iskierki.

MASZYNA I DZIAŁKA:
- Maszyna to „gwiazda” działki: z klocków jak świat, ale z kolorowymi świecącymi elementami (lampki, rury, ekran z rzadkością). Wyraźnie widoczna, z animacją pracy (tłoki, migające lampki, kołysanie), z każdym ulepszeniem wygląda lepiej (nowe części, światła, kolory). Gracz ma WIDZIEĆ postęp.
- Działka rośnie wizualnie z postępem: nowe ścieżki, ogrodzenie, dekoracje, podest gabloty.

UI:
- Duże, zaokrąglone przyciski (UICorner), gruby czarny obrys (UIStroke), cień, gradienty (UIGradient), czcionka Lilita One/Fredoka, ikonki zamiast długich tekstów. Animacje UI: przyciski lekko rosną po najechaniu i „sprężynują” po kliknięciu (TweenService), okna wjeżdżają płynnie.
- Kolory rzadkości wszędzie te same (przedmiot, napis, ramka w Indexie, ogłoszenie).

MODELE:
- Mam gotowy sposób na robienie postaci z klocków ze studsami (skrypty, które budują model z Partów prosto w Roblox Studio – tak powstało 20 żab). Jeśli potrzebujesz modeli przedmiotów lub zwierzaków, opisz mi, co ma być (kształt, kolory, rozmiar w studach), a ja je przygotuję; do tego czasu używaj prostych Partów jako tymczasowych.
- Gotowe żaby z klocków mogą być np. maskotką na środku mapy albo przedmiotami Secret.

## PĘTLA ROZGRYWKI
1. Maszyna zrzuca przedmiot z efektami z „drabiny efektów” (patrz wyżej).
2. Przedmiot jedzie taśmą do sprzedawcy → monety (z efektem +liczba nad przedmiotem).
3. Gracz kupuje ulepszenia przyciskami na działce (styl klasycznego tycoona: przyciski na ziemi z ceną).
4. Rzadki drop → efekt świetlny, dźwięk, napis na ekranie; od rzadkości Mythic wzwyż ogłoszenie dla całego serwera.
5. Rebirth: reset monet i ulepszeń → stały mnożnik monet. (W aktualizacjach: kolejne rebirthy odblokowują nową, lepszą maszynę z nowymi przedmiotami.)

## RZADKOŚCI (wartości startowe, trzymaj je w jednym ModuleScript, żebym mógł łatwo zmieniać)
| Rzadkość | Szansa bazowa | Mnożnik wartości | Kolor |
|---|---|---|---|
| Common | reszta (ok. 65%) | x1 | szary |
| Uncommon | 1 na 4 | x3 | zielony |
| Rare | 1 na 12 | x10 | niebieski |
| Epic | 1 na 60 | x40 | fioletowy |
| Legendary | 1 na 400 | x200 | złoty |
| Mythic | 1 na 5 000 | x1 500 | czerwony |
| Secret | 1 na 1 000 000 | x50 000 | tęczowy |
Jak losować: sprawdzaj od NAJRZADSZEJ do najczęstszej; szansa danej rzadkości = Luck / X (np. Luck 2 → Legendary 1 na 200). Pierwsza rzadkość, która „trafi”, wygrywa; jeśli żadna – Common. Ogranicz każdą szansę do maks. 50%, żeby przy dużym Luck gra się nie psuła.
Luck gracza = 1 + bonus z ulepszenia „Szczęście” + aktywne boosty. Liczenie Luck i mnożnika monet trzymaj w JEDNEJ funkcji (np. Multipliers.Get(gracz)), żeby później łatwo dodać do niej game passy.
Każda maszyna ma własną listę przedmiotów w każdej rzadkości (np. Maszyna 1: kamień, cegła, puszka… Secret: złota żaba).

## ULEPSZENIA MASZYNY (kupowane za monety, ceny rosną wykładniczo)
- Szybkość dropu (np. co 4 s → co 1 s)
- Szczęście (+10% Luck za poziom)
- Wartość przedmiotów (+%)
- Szybkość taśmy
- Dodatkowe dekoracje bazy (tylko wygląd, ale fajne do pokazania)

## GABLOTA (kolekcja)
Gracz może zachować rzadki przedmiot zamiast go sprzedać i postawić na podeście w bazie. Na start 3 podesty; kolejne odblokowuje się za monety i rebirthy.
Każdy przedmiot w gablocie daje mały stały bonus do monet. Index (kolekcja) pokazuje wszystkie przedmioty i które już zdobyłem — to ma motywować do „zebrania wszystkich”.

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
2. Zapisywanie: DataStoreService z pcall i ponawianiem, UpdateAsync, autozapis co 2 minuty, zapis przy wyjściu gracza i w game:BindToClose. Wersjonuj dane (pole „wersja”), żeby przyszłe aktualizacje nie psuły zapisów. Zapisuj: monety, ulepszenia, rebirthy, przedmioty w gablocie, Index (zdobyte przedmioty), licznik pity, najrzadszy drop, kupione produkty.
3. Wydajność: maks. ok. 30 przedmiotów na taśmie na gracza; stare usuwaj. Przedmioty to małe modele z klocków (najlepiej do ok. 15 Partów każdy, trzymane jako gotowe szablony w ReplicatedStorage i klonowane), animowane po stronie klienta (patrz „Fizyka i świat 3D”), a serwer liczy tylko czas dojazdu.
4. UI: WSZYSTKO w Scale (procentach), nie w Offset, z UIAspectRatioConstraint dla ikon i TextScaled + UITextSizeConstraint dla tekstów. Gra musi wyglądać dobrze na TELEFONIE. Nie kładź przycisków w lewym dolnym rogu (joystick) ani w prawym dolnym (skok).
5. Kod modularny: ModuleScripty Config, Rarities, Items, DataManager, DropperManager, ConveyorManager, UpgradeManager, Multipliers, ProductManager, EffectsManager, RebirthManager, AnnouncementManager, CollectionManager + jeden RemoteEvents folder w ReplicatedStorage.
6. Każdy plik zaczyna się komentarzem: co robi i gdzie leży. Komentarze po polsku.

## STYL GRAFICZNY – PODSUMOWANIE
Wszystko z klocków ze studsami (świat, maszyna, przedmioty, zwierzaki) + szachownica z dwóch odcieni + jaskrawe kolory + jasne słoneczne światło (jak Steal an Egg / Grow a Garden). Przedmioty i zwierzaki wyróżniają się kolorem i efektami. Duże, grube przyciski z czarnym obrysem i cieniem. Czcionka Lilita One / Fredoka. Rzadkości wyraźnie różnią się kolorem, poświatą i dźwiękiem. Secret ma tęczową poświatę, wstrząs ekranu i wyjątkowy dźwięk.

## KOLEJNOŚĆ BUDOWANIA (rób po jednym kroku i czekaj, aż napiszę „działa”)
1. Oświetlenie i wygląd świata (Lighting, Atmosphere, Bloom, niebo) + działka gracza i przypisywanie działki po wejściu.
2. Maszyna, która co X sekund zrzuca przedmiot (na razie bez rzadkości), z PEŁNĄ animacją wypadania (przygotowanie, wystrzał łukiem, lądowanie z odbiciem) i animacją pracy maszyny. Dopracowujemy, aż samo patrzenie będzie przyjemne.
3. Taśma (widać ruch, kołysanie przedmiotów) + zjadacz/sprzedawca z animacją wciągania + monety (leaderstats) lecące do licznika.
4. System rzadkości i losowania (ModuleScript Rarities) + kolory i poświata przedmiotów.
5. DRABINA EFEKTÓW dropów (EffectsManager): dźwięki, cząsteczki, kamera, napisy, napięcie przed Legendary+, ogłoszenia serwerowe. Ten krok dopracowujemy, aż będzie naprawdę satysfakcjonujący.
6. Zapisywanie danych.
7. Przyciski ulepszeń (zapadają się pod graczem) + kupione rzeczy wyrastają/spadają z animacją + wizualne zmiany maszyny po ulepszeniu.
8. UI: monety, szczęście, pasek „pity”, przycisk sklepu, okno ulepszeń (wszystko w Scale, z animacjami).
9. Gablota i Index kolekcji z pieczątką „NEW!”.
10. Rebirth.
11. Developer products.
12. Ranking i tablica najrzadszych dropów.
13. Dopracowanie: opcja „Mniej efektów”, kody promocyjne (np. RELEASE = 10 000 monet), drobne poprawki wyglądu.

## WERSJA NA START (MVP)
Na premierę wystarczą: 1 działka na gracza (serwer do 8 graczy), 1 maszyna, 7 rzadkości, 15–20 przedmiotów, 4 ulepszenia + dekoracje, gablota z Indexem, rebirth, developer products i zapisywanie. Game passy dodamy na końcu (patrz niżej). Reszta w aktualizacjach co tydzień.
Nie wypuszczaj gry, dopóki drop Legendary+ nie daje prawdziwego „WOW” i gra nie wygląda ładnie na telefonie – to ważniejsze niż dodatkowe funkcje.

## DO DODANIA NA KOŃCU: GAME PASSY (na razie NIE rób)
Game passy zaprojektujemy razem, gdy gra będzie gotowa. Założenia:
- Jak w popularnych grach: pierwszy pass ma być bardzo tani, „na zachętę”, np. 2x Luck za ok. 2 Robuxy; kolejne passy coraz droższe i mocniejsze.
- Teraz tylko przygotuj kod tak, żeby dodanie passów było łatwe: wszystkie mnożniki (Luck, monety, szybkość maszyny) liczone w jednym miejscu (Multipliers), a w ModuleScript Config zostaw pustą sekcję „GamePasses” z komentarzem.

## JAK MI ODPOWIADAĆ
- Przy każdym kroku podaj: listę plików, pełny kod każdego pliku (bez „…reszta kodu”), dokładne miejsce w Explorerze i jak przetestować krok w Studio (Play / Test → Device telefon).
- Jeśli coś wymaga zrobienia ręcznie w Studio (np. stworzenie Partu), opisz to krok po kroku.
- Po każdym kroku napisz krótko, co mogło pójść źle i jak to rozpoznać w oknie Output.
- Nie dodawaj rzeczy, o które nie prosiłem, zanim nie skończymy MVP.
- Przy krokach z efektami i grafiką zaproponuj, co jeszcze mogłoby zwiększyć satysfakcję lub poprawić wygląd, ale zrób to jako osobną listę propozycji.

Zacznij od kroku 1.
