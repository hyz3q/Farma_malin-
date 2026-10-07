Jesteś doświadczonym projektantem gier Roblox i programistą Luau. Pomożesz mi krok po kroku zbudować grę „Tycoon, but every drop is RNG”. Jestem początkujący: tłumacz prosto, mów dokładnie, GDZIE w Roblox Studio wstawić każdy skrypt (ServerScriptService, ReplicatedStorage, StarterGui, StarterPlayerScripts) i jakiego typu (Script, LocalScript, ModuleScript).

## JAK PRACUJEMY
Ten prompt ma dwie części:
- CZĘŚĆ 1 – BRIEF: opis całej gry (jak ma wyglądać i działać). To jest „biblia” projektu – wracaj do niej przy każdym kroku.
- CZĘŚĆ 2 – KROKI: budujemy grę po kolei, krok po kroku.

Zasady:
1. Teraz przeczytaj CAŁY brief i NIE pisz jeszcze kodu.
2. Odpowiedz krótkim podsumowaniem (5–8 zdań), jak rozumiesz grę, i zadaj pytania, jeśli coś jest niejasne.
3. Potem czekaj, aż napiszę „zaczynaj krok 1”.
4. Rób tylko JEDEN krok naraz. Po każdym kroku czekaj, aż przetestuję i napiszę „działa” albo opiszę problem.
5. Nie wybiegaj do przodu: nie rób rzeczy z dalszych kroków, ale pisz kod tak, żeby dało się je łatwo dodać.

════════════════════════════════════════
# CZĘŚĆ 1 – BRIEF (przeczytaj w całości, nie pisz kodu)
════════════════════════════════════════

## 1. POMYSŁ GRY
Każdy gracz dostaje własną działkę (tycoon) z JEDNĄ maszyną (Dropper).
Maszyna co kilka sekund zrzuca na taśmę LOSOWY przedmiot. Każdy przedmiot ma rzadkość.
Taśma zawozi przedmiot do sprzedaży i gracz dostaje monety. Im rzadszy przedmiot, tym więcej monet.
Za monety gracz ulepsza maszynę i rozbudowuje bazę. Najlepsze dropy (Secret albo mega mutacja na dobrym przedmiocie) są ogłaszane całemu serwerowi. Gracz zbiera mutacje, łączy przedmioty w fuzji i czeka na wydarzenia serwerowe.
Gra ma być bardzo prosta do zrozumienia w 5 sekund i dawać chwile „O MÓJ BOŻE, SEKRET!”.

## 2. NAJWAŻNIEJSZE PRIORYTETY
1. SATYSFAKCJA Z DROPU: każdy dobry drop ma dawać „WOW”. Gracz ma CZUĆ różnicę między Rare a Legendary, zanim przeczyta napis.
1b. SATYSFAKCJONUJĄCY ŚWIAT 3D: wszystko, co się rusza (wypadanie z droppera, taśma, sprzedawanie, przyciski, budowanie), ma być płynne, sprężyste i z dźwiękiem – tak, żeby fajnie było na to patrzeć.
2. GRAFIKA: gra ma wyglądać ładnie i spójnie od pierwszej sekundy (miniaturki i pierwsze wrażenie decydują, czy ktoś zostanie).
Jeśli musisz wybierać, lepiej mniej funkcji, ale dopracowany drop i ładny wygląd. Zwykłe dropy mają być krótkie i nienachalne, żeby rzadkie bardziej się wyróżniały.

## 3. PĘTLA ROZGRYWKI
1. Maszyna zrzuca przedmiot z efektami z „drabiny efektów” (sekcja 8).
2. Przedmiot jedzie taśmą do sprzedawcy → monety (z efektem +liczba nad przedmiotem).
3. Gracz kupuje ulepszenia przyciskami na działce (styl klasycznego tycoona: przyciski na ziemi z ceną).
4. Rzadki drop lub mutacja → efekt świetlny, dźwięk, napis na ekranie; ogłoszenie dla całego serwera tylko przy Secret albo mutacji MEGA na przedmiocie Rare+ (sekcja 8).
5. Gracz decyduje: sprzedać, zachować w ekwipunku, postawić w gablocie albo zbierać do fuzji (sekcja 6).
6. Co ok. 12 minut wydarzenie serwerowe zmienia zasady na chwilę (sekcja 7).
7. Rebirth: reset monet i ulepszeń → stały mnożnik monet. (W aktualizacjach: kolejne rebirthy odblokowują nową, lepszą maszynę z nowymi przedmiotami.)

## 4. RZADKOŚCI I LOSOWANIE
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

## 5. MUTACJE (jak w Grow a Garden)
Każdy drop ma OSOBNE losowanie mutacji (niezależne od rzadkości). Ten sam przedmiot z mutacją wygląda inaczej i jest wart więcej, więc nawet zwykły przedmiot może być ekscytujący.
| Mutacja | Szansa | Mnożnik wartości | Wygląd |
|---|---|---|---|
| brak | reszta | x1 | zwykły |
| Złota | 1 na 25 | x3 | złoty kolor, błysk |
| Zamrożona | 1 na 50 | x4 | lodowy niebieski, para mrozu, szron |
| Płonąca | 1 na 80 | x5 | pomarańczowo-czerwony, płomyki |
| Tęczowa (MEGA) | 1 na 500 | x12 | kolory przechodzą przez tęczę, iskry |
| Kosmiczna (MEGA) | 1 na 2 500 | x30 | ciemnofioletowa z gwiazdkami, orbitujące kuleczki |
- Wartość przedmiotu = wartość bazowa × mnożnik rzadkości × mnożnik mutacji.
- Losowanie mutacji działa jak rzadkości (od najrzadszej, szansa = Luck / X, maks. 50%).
- Mutacja dokłada WŁASNY efekt do efektu rzadkości (krótki dźwięk „MUTACJA!” i napis z nazwą mutacji). Mutacje MEGA mają efekt na poziomie Legendary z drabiny efektów.
- Mutacje są w danych przedmiotu (ekwipunek, gablota, Index – Index pokazuje też, jakie mutacje danego przedmiotu już zdobyłem).
- Tabelę mutacji trzymaj w osobnym ModuleScript Mutations, żebym mógł łatwo dodawać nowe.

## 6. FUZJA (łączenie przedmiotów)
- Gracz ma EKWIPUNEK (plecak) na zachowane przedmioty – na start 50 miejsc. Przy każdym dropie może zdecydować: sprzedać (domyślnie), zachować w ekwipunku albo postawić w gablocie. Ustawienie „automatycznie zachowuj od rzadkości X / z mutacją” żeby nie trzeba było klikać co chwilę.
- Maszyna do fuzji na działce: wkładasz 5 TAKICH SAMYCH przedmiotów → dostajesz 1 losowy przedmiot o JEDNĄ rzadkość wyższej.
- Jeśli wszystkie 5 mają tę samą mutację, wynik ją dziedziczy. Do tego mała szansa (np. 5%) na nową losową mutację.
- Fuzja ma być bardzo satysfakcjonująca: przedmioty wjeżdżają do maszyny jeden po drugim, maszyna się trzęsie i świeci coraz mocniej, chwila napięcia, wybuch i nowy przedmiot wyskakuje łukiem (zasady ruchu z sekcji 9).
- Dzięki fuzji zwykłe dropy mają znaczenie: gracz decyduje, czy sprzedać, zachować, czy zbierać do fuzji.

## 7. WYDARZENIA SERWEROWE
- Co ok. 12 minut losowe wydarzenie dla całego serwera. Na ekranie stale widać odliczanie „Następne wydarzenie za 4:12” i nazwę, co nadchodzi (żeby czekać i nie wychodzić).
- Start każdego wydarzenia: dźwięk alarmu, wielki napis, zmiana nieba/światła na czas wydarzenia.
- Na start 2 wydarzenia:
  1. DESZCZ METEORÓW (2 min): niebo ciemnieje, na całą mapę spadają meteoryty z przedmiotami w środku. Gracze biegają i je zbierają (podejście/dotknięcie). Serwer sprawdza odległość gracza od meteorytu, pierwszy gracz zabiera. Większa szansa na rzadkie przedmioty i mutacje niż z maszyny.
  2. ZŁOTA GODZINA (3 min): złote niebo, wszystkie maszyny na serwerze mają 5x większą szansę na mutację Złotą i 2x na mutacje MEGA.
- Kolejne wydarzenia dodamy w aktualizacjach (np. „Szalona maszyna” – maszyny strzelają 10x szybciej przez minutę). Zrób system tak, żeby dodanie wydarzenia = dopisanie jednego wpisu w ModuleScript Events.

## 8. SATYSFAKCJA Z DROPU – „DRABINA EFEKTÓW”
Każda wyższa rzadkość dokłada coś NOWEGO do efektów niższej (gracz uczy się, że „więcej efektów = lepszy drop”):
| Rzadkość | Efekty |
|---|---|
| Common | krótki „pyk”, mała chmurka |
| Uncommon | + zielony błysk, wyższy dźwięk |
| Rare | + niebieska poświata (PointLight + Highlight), iskry, napis „RARE!” nad przedmiotem |
| Epic | + fioletowy słup światła (Beam) z maszyny, lekkie drgnięcie kamery, dźwięk „whoosh” |
| Legendary | + napięcie przed dropem: maszyna trzęsie się i świeci przez ok. 1 s, potem złoty wybuch cząsteczek, konfetti, mocniejsze drgnięcie kamery, krótki błysk ekranu, wielki napis na środku ekranu |
| Mythic | + na pół sekundy zwolnione tempo (slow-motion przedmiotu), czerwone pioruny, specjalna muzyka-dżingiel |
| Secret | + ekran przyciemnia się, odliczanie „3…2…1”, tęczowa eksplozja, fajerwerki nad działką widoczne z całej mapy, ogłoszenie z nickiem, przedmiot zostaje na chwilę w powietrzu i się obraca |
Zasady:
- Napięcie (trzęsienie maszyny) pokazuj TYLKO, gdy naprawdę wypadło Legendary lub lepiej. Nie oszukuj gracza fałszywymi zapowiedziami.
- Przy każdym dropie od Rare wzwyż pokaż szansę: „1 na 1 000!” – to buduje dumę.
- Pierwszy raz zdobyty przedmiot dostaje pieczątkę „NEW!” i dźwięk odblokowania; licznik kolekcji (np. „Index 12/40”) skacze z animacją.
- Liczby monet „wyskakują” z przedmiotu przy sprzedaży (+150) i lecą do licznika na górze ekranu; licznik krótko się powiększa.
- Dźwięk każdej rzadkości jest inny i rozpoznawalny bez patrzenia.
- System „pity”: jeśli gracz przez 800 dropów nie dostał Legendary lub lepszego, następny drop to gwarantowany Legendary (pokaż pasek „Gwarantowany Legendary za: 137 dropów”). Licznik zapisuj w danych gracza. Gracz zawsze ma na co czekać.
- Wszystkie efekty trzymaj w jednym module (EffectsManager) z jedną tabelą ustawień na rzadkość, żebym mógł je łatwo stroić.
- OGŁOSZENIE NA CAŁY SERWER jest rzadkie i wyjątkowe. Pojawia się TYLKO, gdy:
  a) ktoś trafi przedmiot Secret, albo
  b) ktoś trafi mutację MEGA (Tęczowa, Kosmiczna) na przedmiocie Rare lub lepszym.
  Ogłoszenie: wielki napis u wszystkich z nickiem, nazwą, mutacją i szansą (np. „HUBERT trafił KOSMICZNĄ Rybkę (Legendary)! 1 na 1 000 000”), dźwięk, a nad działką tego gracza na chwilę pojawia się słup światła widoczny z całej mapy, żeby każdy mógł pobiec i zobaczyć.
- Efekty i dźwięki odtwarzaj po stronie KLIENTA (serwer tylko wysyła: kto, co, jaka rzadkość, jaka mutacja). Efekty cudzych dropów pokazuj słabiej niż własnych (oprócz ogłaszanych).
- Wydajność na telefonie: limit cząsteczek, efekty sprzątane po 3 s, ustawienie „Mniej efektów” w opcjach.

## 9. FIZYKA I ŚWIAT 3D – KAŻDY RUCH MA BYĆ SATYSFAKCJONUJĄCY
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

## 10. GRAFIKA I WYGLĄD
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

## 11. STYL GRAFICZNY – PODSUMOWANIE
Wszystko z klocków ze studsami (świat, maszyna, przedmioty, zwierzaki) + szachownica z dwóch odcieni + jaskrawe kolory + jasne słoneczne światło (jak Steal an Egg / Grow a Garden). Przedmioty i zwierzaki wyróżniają się kolorem i efektami. Duże, grube przyciski z czarnym obrysem i cieniem. Czcionka Lilita One / Fredoka. Rzadkości wyraźnie różnią się kolorem, poświatą i dźwiękiem. Secret ma tęczową poświatę, wstrząs ekranu i wyjątkowy dźwięk.

## 12. ULEPSZENIA MASZYNY (kupowane za monety, ceny rosną wykładniczo)
- Szybkość dropu (np. co 4 s → co 1 s)
- Szczęście (+10% Luck za poziom)
- Wartość przedmiotów (+%)
- Szybkość taśmy
- Dodatkowe dekoracje bazy (tylko wygląd, ale fajne do pokazania)

## 13. GABLOTA (kolekcja)
Gracz może zachować rzadki przedmiot zamiast go sprzedać i postawić na podeście w bazie. Na start 3 podesty; kolejne odblokowuje się za monety i rebirthy.
Każdy przedmiot w gablocie daje mały stały bonus do monet. Index (kolekcja) pokazuje wszystkie przedmioty i które już zdobyłem — to ma motywować do „zebrania wszystkich”.

## 14. DEVELOPER PRODUCTS (kupowane wielokrotnie)
- Boost szczęścia x2 na 15 minut
- Paczka monet (mała / średnia / duża, skalowana do postępu gracza)
- „Natychmiastowy drop Legendary+” (gwarantowany Legendary albo lepszy)
Obsłuż je przez MarketplaceService.ProcessReceipt POPRAWNIE: zapisz zakup w DataStore przed zwróceniem PurchaseGranted, nie dawaj nagrody dwa razy.

## 15. SPOŁECZNE
- +10% monet za każdego znajomego na serwerze (mam już skrypt BonusZnajomi — użyj atrybutu gracza „MnoznikZnajomi”).
- Ogłoszenia na cały serwer tylko przy Secret albo mutacji MEGA na przedmiocie Rare+ (sekcja 8).
- Ranking (leaderstats): Monety, Rebirths, Najrzadszy drop.
- Globalna tablica „Najrzadsze dropy dzisiaj” na spawnie.

## 16. ZASADY TECHNICZNE (bardzo ważne)
1. SERWER decyduje o wszystkim: losowanie (Random.new()), monety, zakupy, ulepszenia. Klient tylko pokazuje efekty i wysyła prośby („chcę kupić ulepszenie X”). Serwer zawsze sprawdza, czy gracz ma pieniądze i czy prośba ma sens. Nigdy nie ufaj wartościom od klienta.
2. Zapisywanie: DataStoreService z pcall i ponawianiem, UpdateAsync, autozapis co 2 minuty, zapis przy wyjściu gracza i w game:BindToClose. Wersjonuj dane (pole „wersja”), żeby przyszłe aktualizacje nie psuły zapisów. Zapisuj: monety, ulepszenia, rebirthy, ekwipunek (przedmioty z mutacjami), przedmioty w gablocie, Index (zdobyte przedmioty i mutacje), ustawienia auto-zachowywania, licznik pity, najrzadszy drop, kupione produkty.
3. Wydajność: maks. ok. 30 przedmiotów na taśmie na gracza; stare usuwaj. Przedmioty to małe modele z klocków (najlepiej do ok. 15 Partów każdy, trzymane jako gotowe szablony w ReplicatedStorage i klonowane), animowane po stronie klienta (sekcja 9), a serwer liczy tylko czas dojazdu.
4. UI: WSZYSTKO w Scale (procentach), nie w Offset, z UIAspectRatioConstraint dla ikon i TextScaled + UITextSizeConstraint dla tekstów. Gra musi wyglądać dobrze na TELEFONIE. Nie kładź przycisków w lewym dolnym rogu (joystick) ani w prawym dolnym (skok).
5. Kod modularny: ModuleScripty Config, Rarities, Items, DataManager, DropperManager, ConveyorManager, UpgradeManager, Multipliers, ProductManager, EffectsManager, Mutations, InventoryManager, FusionManager, Events, EventManager, RebirthManager, AnnouncementManager, CollectionManager + jeden RemoteEvents folder w ReplicatedStorage.
6. Każdy plik zaczyna się komentarzem: co robi i gdzie leży. Komentarze po polsku.

## 17. WERSJA NA START (MVP)
Na premierę wystarczą: 1 działka na gracza (serwer do 8 graczy), 1 maszyna, 7 rzadkości, 5 mutacji, 15–20 przedmiotów, ekwipunek i fuzja, 2 wydarzenia serwerowe, 4 ulepszenia + dekoracje, gablota z Indexem, rebirth, developer products i zapisywanie. Game passy dodamy na końcu (sekcja 18). Reszta w aktualizacjach co tydzień.
Nie wypuszczaj gry, dopóki drop Legendary+ nie daje prawdziwego „WOW” i gra nie wygląda ładnie na telefonie – to ważniejsze niż dodatkowe funkcje.

## 18. GAME PASSY – DO DODANIA NA KOŃCU (na razie NIE rób)
Game passy zaprojektujemy razem, gdy gra będzie gotowa. Założenia:
- Jak w popularnych grach: pierwszy pass ma być bardzo tani, „na zachętę”, np. 2x Luck za ok. 2 Robuxy; kolejne passy coraz droższe i mocniejsze.
- Teraz tylko przygotuj kod tak, żeby dodanie passów było łatwe: wszystkie mnożniki (Luck, monety, szybkość maszyny) liczone w jednym miejscu (Multipliers), a w ModuleScript Config zostaw pustą sekcję „GamePasses” z komentarzem.


════════════════════════════════════════
# CZĘŚĆ 2 – KROKI (rób po jednym, na moje polecenie)
════════════════════════════════════════
Każdy krok ma: CEL, CO ZROBIĆ i GOTOWE, GDY (jak sprawdzę, że działa). Numery w nawiasach to sekcje briefu.

## KROK 1: Świat, oświetlenie i działki
CEL: Zbuduj wygląd świata i działki graczy.
CO ZROBIĆ:
- Ustawienia Lighting, Atmosphere, Bloom, ColorCorrection i niebo (brief: 10 – Oświetlenie) z dokładnymi wartościami.
- Mapa w stylu z briefu (10, 11): działki-pasy po bokach oddzielone ścianami w szachownicę ze studsami, kolorowe centrum na środku (na razie proste).
- Skrypt, który przypisuje wolną działkę graczowi po wejściu i zwalnia ją po wyjściu; gracz pojawia się na swojej działce.
- ModuleScript Config z podstawowymi ustawieniami (na razie mało, będzie rosnąć).
GOTOWE, GDY: wchodzę do gry, stoję na swojej działce, świat jest jasny, kolorowy i w stylu klocków ze studsami; drugi gracz (Test → 2 gracze) dostaje inną działkę.

## KROK 2: Maszyna i wypadanie przedmiotów
CEL: Najważniejsza animacja w grze – ma być przyjemna do oglądania.
CO ZROBIĆ:
- Klockowa maszyna (Dropper) na działce z animacją pracy (brief: 9 – Świat żyje, 10 – Maszyna).
- Co X sekund serwer decyduje o dropie, a klient pokazuje PEŁNĄ animację wypadania: przygotowanie, wystrzał łukiem, lądowanie z odbiciem (brief: 9 – Wypadanie przedmiotu).
- Na razie jeden rodzaj przedmiotu (prosty klockowy model), bez rzadkości.
GOTOWE, GDY: patrzę na maszynę przez minutę i to jest przyjemne; żadne dwa dropy nie wyglądają identycznie; nic nie laguje.

## KROK 3: Taśma, sprzedawanie i monety
CEL: Przedmiot zamienia się w pieniądze w satysfakcjonujący sposób.
CO ZROBIĆ:
- Taśma z widocznym ruchem; przedmioty jadą po niej, kołyszą się (brief: 9 – Taśma).
- „Zjadacz” (piec/skarbonka) wciągający przedmioty z animacją (brief: 9 – Sprzedawanie).
- leaderstats Monety; serwer dodaje monety po dojechaniu przedmiotu (serwer liczy czas dojazdu).
- Monety wylatują z przedmiotu i lecą do licznika na górze ekranu.
GOTOWE, GDY: przedmioty same jadą i się sprzedają, monety rosną, licznik ładnie reaguje; maks. ok. 30 przedmiotów na taśmie.

## KROK 4: Rzadkości i losowanie
CEL: Każdy drop jest losowy.
CO ZROBIĆ:
- ModuleScript Rarities z tabelą i algorytmem z briefu (4).
- ModuleScript Items: 15–20 klockowych przedmiotów rozdzielonych na rzadkości (szablony w ReplicatedStorage).
- ModuleScript Multipliers z funkcją liczącą Luck i mnożnik monet (brief: 4).
- Kolor i poświata przedmiotu zależą od rzadkości; wartość przy sprzedaży = wartość × mnożnik rzadkości.
- Na czas testów: komenda/przycisk tylko w Studio do ustawienia wysokiego Luck, żeby zobaczyć rzadkie przedmioty.
GOTOWE, GDY: widzę różne przedmioty w różnych kolorach; rzadkie dają dużo więcej monet; w trybie testowym da się zobaczyć każdą rzadkość.

## KROK 5: Mutacje
CEL: Nawet zwykły drop może być ekscytujący.
CO ZROBIĆ:
- ModuleScript Mutations z tabelą z briefu (5); osobne losowanie mutacji przy każdym dropie.
- Wygląd każdej mutacji na przedmiocie (kolor/materiał, cząsteczki), działający na każdym przedmiocie z klocków.
- Wartość = bazowa × rzadkość × mutacja.
- Tryb testowy w Studio pozwala wymusić wybraną mutację.
GOTOWE, GDY: każda mutacja jest od razu rozpoznawalna wzrokiem na każdym przedmiocie, a mutowane przedmioty są warte więcej.

## KROK 6: Drabina efektów i ogłoszenia
CEL: Rzadki drop daje „WOW”. Ten krok dopracowujemy, aż będzie naprawdę satysfakcjonujący.
CO ZROBIĆ:
- EffectsManager z jedną tabelą ustawień na rzadkość i na mutację (brief: 5, 8).
- Wszystkie efekty z drabiny: dźwięki, cząsteczki, światło, kamera, napisy, napięcie przed Legendary+ (tylko gdy naprawdę wypadło), szansa „1 na X”; efekt „MUTACJA!”.
- Ogłoszenia serwerowe TYLKO przy Secret albo mutacji MEGA na przedmiocie Rare+ (brief: 8), ze słupem światła nad działką.
- Pasek pity „Gwarantowany Legendary za: X dropów” i sama gwarancja po stronie serwera.
GOTOWE, GDY: bez czytania napisów wiem, jak dobry był drop; Legendary+ i mutacje MEGA robią wrażenie; ogłoszenia pojawiają się tylko w opisanych sytuacjach; na telefonie nie laguje.

## KROK 7: Zapisywanie danych
CEL: Postęp się nie gubi.
CO ZROBIĆ:
- DataManager zgodny z briefem (16 – punkt 2): pcall, ponawianie, UpdateAsync, autozapis, BindToClose, pole „wersja”.
- Zapis wszystkich danych z listy w briefie (te, które już istnieją; resztę dodamy w kolejnych krokach).
GOTOWE, GDY: wychodzę i wracam (w Studio z włączonym dostępem do API) – monety i licznik pity są takie same; w Output nie ma błędów zapisu.

## KROK 8: Ulepszenia i budowanie działki
CEL: Gracz widzi swój postęp.
CO ZROBIĆ:
- Przyciski na ziemi z ceną, które zapadają się pod graczem (brief: 9 – Przyciski tycoona).
- 4 ulepszenia + dekoracje z briefu (12); ceny rosną wykładniczo; serwer sprawdza pieniądze.
- Kupione rzeczy wyrastają z ziemi lub spadają z nieba; maszyna zmienia wygląd po ulepszeniu.
- Poziomy ulepszeń zapisywane w danych.
GOTOWE, GDY: kupuję ulepszenie, widzę i słyszę efekt, maszyna działa szybciej/lepiej; po powrocie do gry ulepszenia zostają.

## KROK 9: Interfejs (UI)
CEL: Czytelny i ładny ekran, także na telefonie.
CO ZROBIĆ:
- Licznik monet, aktualny Luck, pasek pity, odliczanie do wydarzenia (na razie atrapa), przycisk sklepu/ulepszeń, okno ulepszeń, ustawienia (na razie: „Mniej efektów”).
- Styl z briefu (10 – UI); wszystko w Scale, animacje przycisków i okien (brief: 16 – punkt 4).
GOTOWE, GDY: w Test → Device na telefonie nic nie wychodzi poza ekran, nic nie zasłania joysticka ani skoku, przyciski są duże.

## KROK 10: Ekwipunek, gablota i Index
CEL: Powód, żeby zbierać, a nie tylko sprzedawać.
CO ZROBIĆ:
- Ekwipunek na 50 przedmiotów; decyzja przy dropie (sprzedać/zachować/do gabloty) + ustawienie auto-zachowywania (brief: 6).
- Gablota: 3 podesty na start, kolejne za monety; bonus do monet z gabloty przez Multipliers (brief: 13).
- Okno Index ze wszystkimi przedmiotami i zdobytymi mutacjami, pieczątka „NEW!”, licznik „Index X/Y”.
- Zapis ekwipunku, gabloty i Indexu.
GOTOWE, GDY: zachowuję przedmioty, stawiam rzadki w gablocie i dostaję bonus, Index pokazuje, co mam; wszystko zostaje po powrocie.

## KROK 11: Fuzja
CEL: Każdy drop ma znaczenie.
CO ZROBIĆ:
- Maszyna do fuzji na działce i okno wyboru przedmiotów z ekwipunku (brief: 6).
- Zasady: 5 takich samych → 1 losowy o rzadkość wyższy; dziedziczenie wspólnej mutacji; mała szansa na nową mutację; wszystko liczy serwer.
- Satysfakcjonująca animacja fuzji (wjeżdżanie po kolei, napięcie, wybuch, wyrzut nowego przedmiotu).
GOTOWE, GDY: łączę 5 przedmiotów, oglądanie fuzji jest ekscytujące, wynik zgadza się z zasadami i trafia do ekwipunku.

## KROK 12: Wydarzenia serwerowe
CEL: Na co czekać i po co zostać w grze.
CO ZROBIĆ:
- EventManager + ModuleScript Events; losowe wydarzenie co ok. 12 min, odliczanie w UI z nazwą nadchodzącego wydarzenia (brief: 7).
- Deszcz meteorów: spadające meteoryty z przedmiotami na całej mapie, zbieranie przez dotknięcie, serwer sprawdza odległość i kto pierwszy.
- Złota godzina: zmiana nieba i większe szanse na mutacje dla wszystkich.
- W Studio komenda testowa do natychmiastowego uruchomienia wydarzenia.
GOTOWE, GDY: wydarzenia startują same, wszyscy na serwerze je widzą, zmienia się niebo i zasady, a po czasie wszystko wraca do normy.

## KROK 13: Rebirth
CEL: Długi cel dla gracza.
CO ZROBIĆ:
- Przycisk/okno rebirtha z ceną; reset monet i ulepszeń (ekwipunek, gablota i Index zostają), stały mnożnik monet (brief: 3).
- Efektowna animacja rebirtha; zapis liczby rebirthów.
GOTOWE, GDY: robię rebirth, zaczynam od nowa z większym mnożnikiem, kolekcja zostaje, liczba rebirthów się zapisuje.

## KROK 14: Developer products
CEL: Pierwsze zarabianie.
CO ZROBIĆ:
- Produkty z briefu (14) z poprawnym ProcessReceipt (zapis przed PurchaseGranted, bez podwójnych nagród).
- Boost szczęścia z widocznym odliczaniem na ekranie (doliczany w Multipliers).
- ID produktów w Config (zera + komentarze, wpiszę sam).
GOTOWE, GDY: testowy zakup w Studio działa, nagroda przychodzi raz, boost się kończy po czasie.

## KROK 15: Społeczne i ranking
CEL: Gracze widzą się nawzajem i rywalizują.
CO ZROBIĆ:
- Bonus za znajomych z mojego skryptu (atrybut „MnoznikZnajomi”, doliczany w Multipliers) – brief: 15.
- leaderstats: Monety, Rebirths, Najrzadszy drop.
- Tablica „Najlepsze dropy dzisiaj” w centrum mapy (uwzględnia mutacje).
GOTOWE, GDY: ranking i tablica pokazują poprawne dane; bonus za znajomych zmienia ilość monet.

## KROK 16: Dopracowanie przed premierą
CEL: Gra gotowa do wypuszczenia.
CO ZROBIĆ:
- Działająca opcja „Mniej efektów”.
- Kody promocyjne (np. RELEASE = 10 000 monet), każdy do użycia raz na gracza.
- Przegląd wyglądu i wydajności na telefonie; poprawki znalezionych problemów.
- Lista kontrolna z briefu (17 – MVP): czy wszystko jest i czy drop Legendary+ oraz mutacje MEGA dają „WOW”.
GOTOWE, GDY: wszystko z MVP działa, gra dobrze wygląda i chodzi na telefonie – można publikować. Game passy robimy dopiero po tym (brief: 18).

## JAK MI ODPOWIADAĆ (przy każdym kroku)
- Przy każdym kroku podaj: listę plików, pełny kod każdego pliku (bez „…reszta kodu”), dokładne miejsce w Explorerze i jak przetestować krok w Studio (Play / Test → Device telefon).
- Jeśli coś wymaga zrobienia ręcznie w Studio (np. stworzenie Partu), opisz to krok po kroku.
- Po każdym kroku napisz krótko, co mogło pójść źle i jak to rozpoznać w oknie Output.
- Nie dodawaj rzeczy, o które nie prosiłem, zanim nie skończymy MVP.
- Przy krokach z efektami i grafiką zaproponuj, co jeszcze mogłoby zwiększyć satysfakcję lub poprawić wygląd, ale zrób to jako osobną listę propozycji.

Zacznij od kroku 1.

Na początek: przeczytaj brief, napisz podsumowanie i pytania, a potem czekaj na „zaczynaj krok 1”.
