Jesteś doświadczonym projektantem gier Roblox i programistą Luau. Pomożesz mi krok po kroku zbudować grę „Tycoon, but every drop is RNG”. Jestem początkujący: tłumacz prosto, mów dokładnie, GDZIE w Roblox Studio wstawić każdy skrypt (ServerScriptService, ReplicatedStorage, StarterGui, StarterPlayerScripts) i jakiego typu (Script, LocalScript, ModuleScript).

## JAK PRACUJEMY
Ten prompt ma dwie części:
- CZĘŚĆ 1 – BRIEF: opis całej gry (jak ma wyglądać i działać). To jest „biblia” projektu – wracaj do niej przy każdym kroku.
- CZĘŚĆ 2 – KROKI: budujemy grę po kolei, krok po kroku.

Zasady:
1. Teraz przeczytaj CAŁY brief (od sekcji 0, 0B, 0C i 0D – zasad dobrych gier Roblox, budowania, mapy projektu i sprawdzania budowli, które obowiązują w każdym kroku) i NIE pisz jeszcze kodu.
2. Odpowiedz krótkim podsumowaniem (5–8 zdań), jak rozumiesz grę, i zadaj pytania, jeśli coś jest niejasne.
3. Potem czekaj, aż napiszę „zaczynaj krok 1”.
4. Rób tylko JEDEN krok naraz. Po każdym kroku czekaj, aż przetestuję i napiszę „działa” albo opiszę problem.
5. Nie wybiegaj do przodu: nie rób rzeczy z dalszych kroków, ale pisz kod tak, żeby dało się je łatwo dodać.
6. Prowadź DZIENNIK POSTĘPU (plik PROGRESS.md, wzór na końcu promptu). Po każdym zakończonym kroku podaj jego pełną, aktualną wersję: jeśli masz dostęp do plików projektu – zapisz go sam, jeśli nie – wypisz cały plik w odpowiedzi, a ja go zapiszę.
7. Jeśli na początku rozmowy wkleję razem z briefem plik PROGRESS.md, to znaczy, że kontynuujemy: przeczytaj go, napisz w 3–5 zdaniach, na czym skończyliśmy i co jest następne, i czekaj na moje „kontynuuj”.

════════════════════════════════════════
# CZĘŚĆ 1 – BRIEF (przeczytaj w całości, nie pisz kodu)
════════════════════════════════════════

## 0. JAK ROBIĆ DOBRE GRY NA ROBLOX – ZASADY, KTÓRYCH ZAWSZE SIĘ TRZYMASZ
Te zasady dotyczą KAŻDEGO kroku. Jeśli coś w briefie jest niejasne, wybieraj rozwiązanie zgodne z tymi zasadami. Nie dodawaj jednak nowych funkcji spoza briefu bez pytania – zasady mówią JAK robić, a nie CO dodać.

A. PIERWSZE WRAŻENIE (najwięcej graczy odchodzi w pierwszej minucie)
- W ciągu 10 sekund gracz wie, co robić; w ciągu 30 sekund dostaje pierwszą nagrodę (pierwszy drop, pierwsze monety).
- Zero ścian tekstu i długich samouczków. Prowadź gracza strzałkami, świecącą ścieżką (Beam) i krótkimi napisami w stylu „Stań na przycisku!”.
- Nic nie blokuje startu: bez menu „Graj”, bez długiego ładowania. Krótki ekran ładowania (ReplicatedFirst) tylko jeśli naprawdę potrzebny.
- Pierwsze ulepszenia mają być tanie i szybkie – gracz ma poczuć postęp w pierwszych 2–3 minutach.

B. ZAWSZE JASNY NASTĘPNY CEL
- Na ekranie zawsze widać, do czego gracz teraz dąży (pasek do następnego ulepszenia, pasek pity, odliczanie do wydarzenia, „Index 12/40”).
- Duże liczby skracaj: 1.2K, 3.4M, 5.6B, 7.8T.
- Gdy gracza stać na ulepszenie, przycisk to pokazuje (świeci, podskakuje, ikonka „!”).

C. TEMPO I EKONOMIA
- Ceny rosną wykładniczo, ale bez „ścian”, przy których gracz nic nie może robić przez długi czas.
- Wszystkie liczby (ceny, szanse, nagrody, czasy) trzymaj w Config, żebym mógł je stroić bez szukania po kodzie.
- Przy każdym kroku z ekonomią podaj przybliżony czas: ile minut gry do pierwszego ulepszenia, do pierwszego Epic, do rebirtha. Cel: częste małe nagrody i rzadkie wielkie.

D. FEEDBACK I „JUICE”
- Każda akcja gracza ma natychmiastową reakcję: dźwięk, ruch, efekt (sekcje 8 i 9). Brak reakcji = gracz myśli, że gra jest zepsuta.

E. TELEFON NA PIERWSZYM MIEJSCU (ponad połowa graczy gra na telefonie)
- Duże przyciski (łatwo trafić kciukiem), UI w Scale, nic w rogach z joystickiem i skokiem.
- Wydajność: mało Partów, brak pętli bez czekania, efekty sprzątane (Debris / Destroy), rozłączanie niepotrzebnych połączeń (:Disconnect()), żeby gra nie zwalniała z czasem. Rozważ StreamingEnabled przy dużej mapie.
- Testuj zawsze w Test → Device na telefonie i z 2+ graczami.

F. POWODY, ŻEBY WRACAĆ
- Gra ma dawać powód, żeby wrócić jutro (wydarzenia, kolekcja, sekretne przepisy, pity). Roblox mocno promuje gry, do których gracze wracają i w których spędzają dużo czasu.
- Co tydzień aktualizacja z czymś nowym (przedmioty, przepisy, wydarzenie) – kod ma pozwalać dodawać takie rzeczy przez dopisanie wpisu w ModuleScript, bez przerabiania systemów.

G. UCZCIWOŚĆ I ZASADY ROBLOXA
- Przestrzegaj zasad społeczności Roblox (gra dla dzieci: bez przemocy z krwią, bez treści dla dorosłych, bez linków poza Roblox).
- Przy losowych rzeczach, za które gracz płaci Robuxami, pokazuj szanse (to wymóg Robloxa). Szanse fuzji i dropów zawsze prawdziwe.
- Bez oszukiwania gracza: żadnych fałszywych zapowiedzi, fałszywych liczników „tylko dziś!”, przycisków-pułapek do zakupu. Zakupy mają być fajnym dodatkiem, a gra ma być dobra bez płacenia.

H. JAKOŚĆ KODU
- Serwer ma ostatnie słowo (sekcja 16). Każdy RemoteEvent: sprawdź typy i wartości od klienta i ogranicz, jak często gracz może go wywołać (ochrona przed spamem/exploitami).
- Używaj nowoczesnego API: task.wait / task.spawn / task.delay (nie wait/spawn/delay), GetService, :Connect na zdarzenia zamiast pętli sprawdzających.
- Każde wywołanie usług, które może się nie udać (DataStore, MarketplaceService, HttpService), w pcall z obsługą błędu.
- Kod czytelny i podzielony na ModuleScripty; nazwy zmiennych po angielsku, komentarze po polsku; bez nieużywanego kodu.
- Gotowy krok = zero czerwonych błędów i ostrzeżeń w Output.

I. POMIAR I POPRAWKI
- Dodaj AnalyticsService: lejek pierwszych kroków gracza (onboarding funnel: wejście → pierwszy drop → pierwsze ulepszenie → pierwszy Epic → pierwsza fuzja) i zdarzenia ekonomii (zarobione/wydane monety). Dzięki temu w panelu Creator Hub zobaczę, gdzie gracze odchodzą.
- Po każdym większym kroku zagraj sam 10–15 minut i nazwij momenty, które są nudne albo niejasne – zaproponuj poprawki.

J. JĘZYK W GRZE
- Wszystkie napisy w grze po ANGIELSKU (gracze z całego świata), krótkie i proste. Przykłady napisów w tym briefie są po polsku tylko dla mnie – w grze przetłumacz je na angielski (np. „Gwarantowany Legendary za: 37 dropów” → „Legendary guaranteed in: 37 drops”); ikonki zamiast długich tekstów. Teksty trzymaj w jednym module, żeby łatwo dodać tłumaczenia (LocalizationService) później.

## 0B. JAK BUDOWAĆ W ROBLOX – BUDOWLE, MAPA I MODELE
Budujesz kodem, więc nie widzisz efektu od razu. Dlatego trzymaj się tych zasad i przy każdym budowaniu opisz mi, co powinienem zobaczyć, żebym mógł sprawdzić i wysłać zrzut ekranu.

SKALA (najczęstszy błąd AI to złe proporcje):
- Postać gracza ma ok. 5 studów wysokości i 2 szerokości. Wszystko mierz względem niej.
- Drzwi/przejścia: min. 6 szerokości × 8 wysokości. Ścieżki: 8–12 studów szerokości. Schody: stopień 1 stud wysokości, 2 study głębokości.
- Działka gracza: ok. 60 × 100 studów (miejsce na maszynę, taśmę, zjadacz, przyciski, gablotę i maszynę do fuzji, z wolnym miejscem do chodzenia). Ściany między działkami: 25–35 studów wysokości.
- Maszyna dropiąca: ok. 12–16 studów wysokości – wyraźnie większa od gracza, widoczna z daleka. Przyciski tycoona: 4 × 4 study, płaskie (0,5–1 stud wysokości) z napisem i ceną nad nimi (BillboardGui).
- Przedmioty z droppera: 2–4 study (rzadkie mogą być trochę większe).

KSZTAŁTY I STYL BUDOWLI:
- Budowle „pulchne” i proste: grube ściany (min. 1 stud), duże bryły, zaokrąglenia robione klinami (WedgePart/CornerWedgePart) i cylindrami. Mało drobnych detali – każdy detal ma być widoczny z 30 studów.
- Każda budowla ma 3 warstwy: (1) PODSTAWA – duże bryły i kształt, (2) ŚREDNIE – dachy, okna, ramy, rury, (3) DETALE – lampki, napisy, ozdoby. Najpierw zawsze warstwa 1 (blockout), dopiero potem reszta.
- Ciekawa sylwetka: łam proste kształty (wystający daszek, komin, antena, asymetryczny dodatek), żeby budowla była rozpoznawalna nawet jako czarny cień.
- Kolory: zasada 60/30/10 – 60% kolor główny, 30% drugi, 10% akcent (np. świecące lampki). Krawędzie i ramy w ciemniejszym lub jaśniejszym odcieniu koloru bryły, żeby kształty się nie zlewały.
- Studsy i szachownica jak w sekcji 10 (Grafika).

PRECYZJA (żeby budowle wyglądały porządnie):
- Wszystko wyrównane do siatki: pozycje i rozmiary w pełnych studach albo połówkach (0,5). Żadnych „krzywych” liczb typu 3,137.
- Bez szczelin między klockami i bez dwóch ścian w tym samym miejscu (z-fighting – migotanie). Jeśli klocki się stykają, niech jeden lekko wchodzi w drugi albo stykają się idealnie.
- Wszystko, co jest częścią mapy: Anchored = true. Drobne ozdoby (trawa, kwiatki, lampki): CanCollide = false i CastShadow = false (mniej lagów, gracz się o nie nie potyka).
- Ostrożnie z Unionami (potrafią się psuć i lagować) – używaj ich tylko, jeśli naprawdę trzeba.

ORGANIZACJA:
- Każda budowla to Model z sensowną nazwą (np. „Dropper”, „Seller”, „FusionMachine”) i ustawionym PrimaryPart; części w środku też nazwane (nie „Part, Part, Part”).
- Workspace podzielony na foldery: Map (stałe elementy), Plots (działki), Effects (tymczasowe efekty). Szablony do klonowania (działka, maszyna, przedmioty) w ServerStorage / ReplicatedStorage.
- Statyczną mapę buduj JEDNORAZOWYM skryptem do wklejenia w Command Bar w Studio (tworzy budowle w trybie edycji, potem zapisuję grę). Rzeczy, które powstają w czasie gry (działki graczy, przedmioty, efekty), klonuj z szablonów.
- Każdy skrypt budujący ma na górze tabelę ustawień (kolory, rozmiary), żebym mógł łatwo zmieniać wygląd, i funkcję pomocniczą do tworzenia klocka (rozmiar, pozycja, kolor, materiał, studsy), żeby kod był krótki i spójny.

KOMPOZYCJA MAPY (jak ma się czytać z perspektywy gracza):
- Jeden wyraźny punkt centralny widoczny z każdego miejsca (kolorowe centrum na środku – najwyższe, najjaśniejsze, z czymś świecącym lub ruchomym).
- Gracz zawsze widzi, dokąd iść: szerokie ścieżki w innym kolorze niż trawa, strzałki, znaki z ikonkami.
- Na działce elementy ułożone w kolejności działania: maszyna → taśma → zjadacz, a przyciski ulepszeń obok, w zasięgu kilku kroków. Nic ważnego za plecami gracza po spawnie.
- Puste miejsca też coś mają: kępki trawy z klocków, kamienie, krzaki, kwiatki – ale bez zaśmiecania ścieżek.
- Brzegi mapy zamknięte naturalnie (wysokie ściany, wzgórza z klocków), bez niewidzialnych ścian, o które gracz się „odbija” bez powodu.

WYDAJNOŚĆ BUDOWLI:
- Jedna działka gracza: celuj w maks. ok. 300–500 Partów razem z maszynami; cała mapa z 8 działkami: maks. kilka tysięcy.
- Duże płaskie powierzchnie (podłoga, ściany) jako duże klocki, nie setki małych. Szachownica = duże kafle albo tekstura, a nie tysiące klocków 1×1.

## 0C. MAPA PROJEKTU – STRUKTURA I KOMUNIKACJA
Trzymaj się tej struktury od pierwszego kroku. Jeśli coś trzeba zmienić albo dodać, powiedz mi o tym i dopisz zmianę do PROGRESS.md. Nazwy w kodzie po angielsku.

DRZEWKO EXPLORERA:
ReplicatedFirst
  LoadingScreen (LocalScript, tylko jeśli potrzebny)
ReplicatedStorage
  Shared (Folder z ModuleScriptami używanymi przez serwer i klienta)
    Config – wszystkie liczby do strojenia (ceny, czasy, szanse fuzji, ID produktów, pusta sekcja GamePasses)
    Rarities – tabela rzadkości i funkcja losowania
    Mutations – tabela mutacji i funkcja losowania
    Items – lista przedmiotów (id, nazwa, rzadkość, wartość, nazwa szablonu)
    Recipes – sekretne przepisy (TYLKO dane wyniku i sylwetki; same składniki trzymaj na serwerze, patrz ServerStorage)
    Events – lista wydarzeń serwerowych
    Strings – wszystkie napisy w grze (po angielsku)
    NumberFormat – skracanie liczb (1.2K, 3.4M)
  Templates (Folder)
    Items – klockowe modele przedmiotów
    Critters – złoty i tęczowy stworek
    Effects – gotowe efekty (cząsteczki, światła)
  Remotes (Folder z RemoteEvents/RemoteFunctions – lista niżej)
ServerScriptService
  Main (Script) – uruchamia wszystkie serwisy w ustalonej kolejności
  Services (Folder z ModuleScriptami)
    DataManager, PlotManager, DropperManager, ConveyorManager, Multipliers, UpgradeManager, InventoryManager, CollectionManager (gablota + Index), FusionManager, EventManager, CritterManager, RebirthManager, ProductManager, AnnouncementManager, LeaderboardManager, CodesManager, AnalyticsTracker, RemoteGuard (sprawdzanie i limit częstotliwości RemoteEvents)
  BonusZnajomi (Script – mój gotowy skrypt bonusu za znajomych)
ServerStorage
  Templates (Folder): Plot, Dropper, Conveyor, Seller, FusionMachine, Showcase
  SecretRecipes (ModuleScript – składniki przepisów; tylko serwer, żeby nikt ich nie wyciągnął z gry)
StarterPlayer
  StarterPlayerScripts
    ClientMain (LocalScript) – uruchamia kontrolery
    Controllers (Folder z ModuleScriptami): DropVisuals (wypadanie, taśma, sprzedaż), EffectsController (drabina efektów), CameraShake, SoundController, UIController, FusionVisuals, CritterVisuals, EventVisuals (niebo i światło w czasie wydarzeń)
StarterGui
  MainUI (ScreenGui): HUD (monety, Luck, pity, żetony, odliczanie do wydarzenia), Upgrades, Inventory, Index, RecipeBook, Fusion, Rebirth, Shop, Settings, Notifications
SoundService
  Sounds (Folder pogrupowany: Drops, Rarities, Mutations, UI, Fusion, Events, Ambient)
Workspace
  Map (stałe elementy mapy), Plots (działki graczy), Effects (tymczasowe efekty), Critters (stworki)

PROSTE WARTOŚCI GRACZA: monety, Luck, licznik pity, liczba żetonów, rebirthy trzymaj jako atrybuty gracza (Player:SetAttribute) i leaderstats – klient widzi je automatycznie i UI reaguje na GetAttributeChangedSignal. Większe dane (ekwipunek, Index, przepisy) wysyłaj przez Remotes.

REMOTES – SERWER → KLIENT:
- DropSpawned (do wszystkich): id dropu, UserId właściciela, id przedmiotu, rzadkość, mutacja, czas startu – klienci pokazują animację.
- DropResolved (do wszystkich): id dropu, czy sprzedany czy zachowany, ile monet.
- Announcement (do wszystkich): ogłoszenie serwerowe (Secret albo mutacja MEGA na Rare+).
- InventoryUpdated (do gracza): zmiany w ekwipunku.
- CollectionUpdated (do gracza): zmiany w gablocie, Indexie i księdze przepisów.
- FusionResult (do wszystkich – animacja na działce; szczegóły dla gracza): sukces/porażka, wynik.
- EventChanged (do wszystkich): jakie wydarzenie trwa / nadchodzi i kiedy.
- CritterSpawned / CritterCaught (do wszystkich): stworek (id, typ, dane ścieżki, czas startu) / kto go złapał.
- Notify (do gracza): krótki komunikat (klucz z Strings + dane).

REMOTES – KLIENT → SERWER (każdy przez RemoteGuard: sprawdź typy, wartości i limit częstotliwości):
- BuyUpgrade(upgradeId)
- SetAutoKeep(ustawienia)
- InventoryAction(akcja: sell / showcase / unshowcase, uid przedmiotu)
- RequestFusion(lista uid przedmiotów) – serwer sam liczy szansę i wynik
- RequestRebirth()
- CatchCritter(critterId) – serwer sprawdza odległość i kto był pierwszy
- SetSetting(nazwa, wartość) – np. „Mniej efektów”
- RedeemCode(kod) – RemoteFunction zwracająca wynik
- DebugCommand(...) – działa TYLKO w Studio (RunService:IsStudio()), na serwerze opublikowanej gry ignorowane
Zakupy za Robuxy idą przez MarketplaceService (bez własnych Remotes), a przyciski tycoona przez dotknięcie po stronie serwera.

## 0D. JAK „WIDZIEĆ” SWOJE BUDOWLE
Budujesz kodem i zwykle nie widzisz efektu. Używaj tych sposobów:

0. SKILL „roblox-build-preview” – NAJWAŻNIEJSZE, UŻYWAJ ZAWSZE, JEŚLI GO MASZ:
   W repozytorium projektu jest skill `.claude/skills/roblox-build-preview` (narzędzie do sprawdzania budowli PRZED wklejeniem do Studio). Jeśli pracujesz w Claude Code w tym repozytorium (albo masz dostęp do tego folderu i możesz uruchamiać Pythona):
   - KAŻDĄ budowlę (mapa, działka, maszyna, przedmiot z droppera, dekoracja) najpierw zapisz jako plik JSON w formacie z SKILL.md,
   - uruchom `scripts/preview.py`, przeczytaj raport i OBEJRZYJ obrazki podglądu (z manekinem gracza dla skali),
   - poprawiaj JSON, aż raport nie ma ostrzeżeń i budowla na obrazkach wygląda zgodnie z briefem,
   - dopiero wtedy daj mi wygenerowany `build.lua` i pokaż mi obrazek podglądu.
   NIGDY nie dawaj mi skryptu budującego, którego nie sprawdziłeś tym narzędziem, jeśli masz do niego dostęp. Jeśli nie masz dostępu (np. inny czat AI bez plików), powiedz mi o tym i użyj punktów 1–6 poniżej.

1. PLAN PRZED BUDOWANIEM: zanim napiszesz skrypt budujący, pokaż plan z góry jako prosty rysunek z liter (ASCII, 1 znak = 2 study, z legendą) i tabelę głównych brył (nazwa, rozmiar, pozycja, kolor). Poczekaj na moje „ok”. Poprawka na planie jest dużo łatwiejsza niż w gotowej budowli.

2. BUDOWLE JAKO DANE: w skryptach budujących opisuj klocki w tabeli danych (nazwa, rozmiar, pozycja względem środka budowli, kolor, materiał, obrót), a jedna funkcja tworzy z niej klocki. Dzięki temu łatwo poprawiać liczby, a ten sam opis można pokazać w podglądzie (punkt 5).

3. MOJE NARZĘDZIA W STUDIO (mam je gotowe, poproś mnie o ich wynik):
   - InspektorBudowli – zaznaczam budowlę, uruchamiam w Command Bar i wklejam Ci raport: liczba klocków, rozmiar całości w porównaniu z postacią, klocki niezakotwiczone, poza siatką, bardzo małe, bez nazwy, wiszące w powietrzu / ze szczeliną, duplikaty (migotanie), lista kolorów z procentami. Po każdej budowli poproś o ten raport i popraw wszystkie ostrzeżenia.
   - KameraPodglad – ustawia kamerę na 5 stałych widoków (przód, bok, góra, 3/4, tył). Gdy chcesz zobaczyć budowlę, poproś o zrzuty ekranu z konkretnych widoków, np. „wyślij widok 1 i 4 maszyny”.

4. ZRZUTY EKRANU: gdy dostaniesz ode mnie zrzut ekranu, opisz najpierw, co widzisz (proporcje, kolory, co odstaje od stylu z sekcji 10 i zasad z 0B), dopiero potem poprawiaj. Porównuj z obrazkami-wzorami, jeśli je wkleiłem.

5. JEŚLI MASZ WIĘCEJ MOŻLIWOŚCI: jeśli możesz uruchamiać kod i oglądać obrazy (np. pracujesz w środowisku z dostępem do plików i przeglądarki), zrób własny podgląd budowli z tych samych danych (punkt 2) – np. prosta strona z three.js albo render w Blenderze – obejrzyj go z kilku stron i popraw, zanim dasz mi skrypt. Jeśli jesteś połączony z Roblox Studio (serwer MCP albo sterowanie komputerem), sam uruchamiaj inspektora i rób zrzuty ekranu.

6. LICZBY ZAMIAST OCZU: po zbudowaniu sprawdź w kodzie proste rzeczy, które da się policzyć: czy wysokość drzwi ≥ 8, czy ścieżka ≥ 8 szerokości, czy maszyna jest 12–16 wysoka, czy nic nie wchodzi w ścieżkę, czy budowla mieści się na działce. Wypisz wynik tych sprawdzeń w Output.

## 1. POMYSŁ GRY
Każdy gracz dostaje własną działkę (tycoon) z JEDNĄ maszyną (Dropper).
Maszyna co kilka sekund zrzuca na taśmę LOSOWY przedmiot. Każdy przedmiot ma rzadkość.
Taśma zawozi przedmiot do sprzedaży i gracz dostaje monety. Im rzadszy przedmiot, tym więcej monet.
Za monety gracz ulepsza maszynę i rozbudowuje bazę. Najlepsze dropy (Secret albo mega mutacja na dobrym przedmiocie) są ogłaszane całemu serwerowi. Gracz zbiera mutacje i rzadkie przedmioty do kolekcji, ryzykuje je w fuzji, odkrywa sekretne przepisy i czeka na wydarzenia serwerowe.
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
5. Najlepsze przedmioty same trafiają do ekwipunku (ustawienie auto-zachowywania), a gracz może postawić je w gablocie (sekcja 13). Maszyna nigdy się nie zatrzymuje.
6. W dowolnym momencie gracz może zaryzykować przedmioty z ekwipunku w fuzji albo spróbować sekretnego przepisu (sekcja 6).
7. Co ok. 12 minut wydarzenie serwerowe zmienia zasady na chwilę, a co 3–4 minuty po mapie lata złoty stworek, za którego złapanie jest żeton mutacji (sekcja 7).
8. Rebirth: reset monet i ulepszeń → stały mnożnik monet. (W aktualizacjach: kolejne rebirthy odblokowują nową, lepszą maszynę z nowymi przedmiotami.)

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

## 6. FUZJA (z ryzykiem) I SEKRETNE PRZEPISY
Fuzja to drugi, AKTYWNY sposób zdobywania przedmiotów: gracz ryzykuje swoje przedmioty, żeby dostać lepsze. Maszyna dropiąca działa przez cały czas – fuzję robi się z przedmiotów z ekwipunku (sekcja 13), nie trzeba niczego zatrzymywać.

ZWYKŁA FUZJA:
- Wkładasz od 3 do 10 TAKICH SAMYCH przedmiotów → próba zdobycia 1 losowego przedmiotu o JEDNĄ rzadkość wyższej.
- Fuzja NIGDY nie ma 100% szansy. Im więcej przedmiotów włożysz, tym większa szansa (gracz sam decyduje, ile ryzykuje).
- Szanse (wartości startowe w Config; między podanymi liczbami licz liniowo, maks. 95%):
| Fuzja | 3 przedmioty | 5 przedmiotów | 10 przedmiotów |
|---|---|---|---|
| Common → Uncommon | 50% | 65% | 90% |
| Uncommon → Rare | 40% | 55% | 85% |
| Rare → Epic | 30% | 45% | 75% |
| Epic → Legendary | 20% | 35% | 60% |
| Legendary → Mythic | 10% | 20% | 40% |
| Mythic → Secret | 2% | 5% | 12% |
- Gracz ZAWSZE widzi dokładną szansę przed fuzją, np. „Szansa: 62%”, a pasek szansy rośnie na żywo, gdy dokłada przedmioty.
- PORAŻKA = tracisz WSZYSTKIE włożone przedmioty. Dlatego przed fuzją jest okno potwierdzenia („Ryzykujesz 5× Złota Rybka. Szansa: 45%”), a przy Legendary i wyżej drugie potwierdzenie.
- Mutacje: jeśli wszystkie włożone przedmioty mają tę samą mutację, wynik ją dziedziczy. Dodatkowo 5% szansy na nową losową mutację.
- Szansa fuzji nie zależy od Luck (żeby liczba na ekranie była zawsze prawdziwa).

SEKRETNE PRZEPISY:
- Do fuzji można też włożyć od 2 do 4 RÓŻNYCH przedmiotów. Jeśli to dokładnie pasuje do sekretnego przepisu, powstaje SEKRETNY PRZEDMIOT, którego nie da się wylosować z maszyny (np. Kaczka + Toster + Piorun = „Elektryczna Kaczka”).
- Przepisów NIE pokazujemy w grze. Gracze odkrywają je sami (to ma być temat filmików: „ODKRYŁEM SEKRETNY PRZEPIS!”).
- Nieznana kombinacja: zamiast szansy pokaż „Eksperyment – nie wiadomo, co się stanie!”. Zła kombinacja = porażka (przedmioty przepadają, zabawny efekt dymu).
- Poprawny przepis też nie jest pewny: ma szansę zależną od rzadkości wyniku (jak w tabeli wyżej, kolumna 3 przedmioty). Po odkryciu przepisu gracz widzi go w swojej księdze przepisów razem z dokładną szansą.
- Podpowiedzi: w Indexie sekretne przedmioty są czarnymi sylwetkami „???” z liczbą składników; codziennie w centrum mapy wisi jedna zagadka-podpowiedź (np. „coś z kuchni + coś, co świeci”).
- Odkrycie przepisu po raz pierwszy: wielki efekt tylko dla tego gracza (księga się otwiera, strona się zapisuje, fanfary). Ogłoszenie serwerowe tylko według zwykłych zasad (sekcja 8).
- Przepisy trzymaj w ModuleScript Recipes (wyniki) i SecretRecipes w ServerStorage (składniki – tylko serwer); nowe przepisy w aktualizacjach co tydzień = nowa zawartość do odkrywania.

ANIMACJA FUZJI (bardzo ważna, zasady ruchu z sekcji 9):
- Przedmioty wlatują do maszyny jeden po drugim łukiem, maszyna z każdym robi się bardziej napięta (trzęsie się, świeci, rośnie dźwięk).
- Chwila napięcia: lampki migają na zmianę na zielono i czerwono (wynik jest już wylosowany przez serwer, ale gracz go jeszcze nie zna).
- Sukces: wybuch światła w kolorze rzadkości, nowy przedmiot wyskakuje łukiem i ląduje z odbiciem + efekty z drabiny efektów.
- Porażka: maszyna się krztusi, wypuszcza czarny dym i trochę iskier, zabawny smutny dźwięk – ma boleć, ale też trochę śmieszyć.

## 7. WYDARZENIA SERWEROWE I ZŁOTE STWORKI
- Co ok. 12 minut losowe wydarzenie dla całego serwera. Na ekranie stale widać odliczanie „Następne wydarzenie za 4:12” i nazwę, co nadchodzi (żeby czekać i nie wychodzić).
- Start każdego wydarzenia: dźwięk alarmu, wielki napis, zmiana nieba/światła na czas wydarzenia.
- Na start 2 wydarzenia:
  1. DESZCZ METEORÓW (2 min): niebo ciemnieje, na całą mapę spadają meteoryty z przedmiotami w środku. Gracze biegają i je zbierają (podejście/dotknięcie). Serwer sprawdza odległość gracza od meteorytu, pierwszy gracz zabiera. Większa szansa na rzadkie przedmioty i mutacje niż z maszyny.
  2. ZŁOTA GODZINA (3 min): złote niebo, wszystkie maszyny na serwerze mają 5x większą szansę na mutację Złotą i 2x na mutacje MEGA.
- ZŁOTE STWORKI (niezależnie od wydarzeń, co ok. 3–4 minuty):
  - Na mapie pojawia się złoty klockowy stworek (np. złota mucha albo żabka) i lata/skacze po mapie przez ok. 60 s. Wszyscy dostają małe powiadomienie „A Golden Fly appeared!” i strzałkę na krawędzi ekranu, która pokazuje kierunek.
  - Stworek ucieka, gdy gracz jest blisko (zmienia kierunek, przyspiesza na chwilę), ale da się go dogonić – ma to być zabawny pościg, a nie frustracja.
  - Kto pierwszy go dotknie, dostaje ŻETON MUTACJI: następny drop z jego maszyny ma gwarantowaną mutację (losowaną z tabeli mutacji bez „brak”). Żetony się zapisują i można mieć ich kilka.
  - Rzadziej (1 na 10 pojawień) pojawia się TĘCZOWY stworek – daje żeton mutacji MEGA (Tęczowa albo Kosmiczna).
  - Uczciwie i bez oszustw: pozycję stworka liczy SERWER (ruch po ścieżce z punktów albo krzywych), klient tylko płynnie go pokazuje; przy złapaniu serwer sprawdza odległość gracza od stworka i pilnuje, żeby nagrodę dostał tylko pierwszy.
  - Złapanie ma być satysfakcjonujące: stworek wybucha iskierkami, żeton wlatuje do licznika na ekranie, dźwięk „cha-ching”; u innych graczy krótki napis „<nick> caught the Golden Fly!”.
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
- Wszystkie efekty trzymaj w jednym module po stronie klienta (EffectsController, sekcja 0C) z jedną tabelą ustawień na rzadkość, żebym mógł je łatwo stroić.
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

## 13. GABLOTA I EKWIPUNEK (kolekcja)
- Maszyna NIGDY się nie zatrzymuje i gracz nie musi niczego klikać przy dropie. Domyślnie wszystko jedzie taśmą do sprzedaży.
- Ustawienie „Automatycznie zachowuj”: przedmioty od wybranej rzadkości (np. Epic+) albo z mutacją same trafiają do ekwipunku zamiast do sprzedaży (krótka animacja: przedmiot zjeżdża z taśmy do skrzyni obok). Ekwipunek: 50 miejsc na start.
- Z ekwipunku można w każdej chwili sprzedać przedmiot, postawić go w gablocie albo użyć w fuzji (sekcja 6).
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
2. Zapisywanie: DataStoreService z pcall i ponawianiem, UpdateAsync, autozapis co 2 minuty, zapis przy wyjściu gracza i w game:BindToClose. Wersjonuj dane (pole „wersja”), żeby przyszłe aktualizacje nie psuły zapisów. Zapisuj: monety, ulepszenia, rebirthy, ekwipunek (przedmioty z mutacjami), przedmioty w gablocie, Index (zdobyte przedmioty i mutacje), odkryte przepisy, żetony mutacji, ustawienia auto-zachowywania, licznik pity, najrzadszy drop, kupione produkty.
3. Wydajność: maks. ok. 30 przedmiotów na taśmie na gracza; stare usuwaj. Przedmioty to małe modele z klocków (najlepiej do ok. 15 Partów każdy, trzymane jako gotowe szablony w ReplicatedStorage i klonowane), animowane po stronie klienta (sekcja 9), a serwer liczy tylko czas dojazdu.
4. UI: WSZYSTKO w Scale (procentach), nie w Offset, z UIAspectRatioConstraint dla ikon i TextScaled + UITextSizeConstraint dla tekstów. Gra musi wyglądać dobrze na TELEFONIE. Nie kładź przycisków w lewym dolnym rogu (joystick) ani w prawym dolnym (skok).
5. Kod modularny według struktury z sekcji 0C (Mapa projektu). Nie twórz plików poza tą strukturą bez powiedzenia mi o tym.
6. Każdy plik zaczyna się komentarzem: co robi i gdzie leży. Komentarze po polsku.

## 17. WERSJA NA START (MVP)
Na premierę wystarczą: 1 działka na gracza (serwer do 8 graczy), 1 maszyna, 7 rzadkości, 5 mutacji, 15–20 przedmiotów, ekwipunek z auto-zachowywaniem, fuzja z ryzykiem, 5–8 sekretnych przepisów, 2 wydarzenia serwerowe, złote stworki z żetonami mutacji, 4 ulepszenia + dekoracje, gablota z Indexem, rebirth, developer products i zapisywanie. Game passy dodamy na końcu (sekcja 18). Reszta w aktualizacjach co tydzień.
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
- Klockowa maszyna (Dropper) na działce z animacją pracy (brief: 9 – Świat żyje, 10 – Maszyna i działka).
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
- EffectsController (klient) z jedną tabelą ustawień na rzadkość i na mutację (brief: 5, 8).
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
CEL: Powód, żeby zbierać, a nie tylko sprzedawać – bez przerywania pracy maszyny.
CO ZROBIĆ:
- Ekwipunek na 50 przedmiotów z ustawieniem „Automatycznie zachowuj” (od rzadkości / z mutacją) – bez klikania przy dropie, maszyna nigdy nie stoi (brief: 13).
- Gablota: 3 podesty na start, kolejne za monety; bonus do monet z gabloty przez Multipliers (brief: 13).
- Okno Index ze wszystkimi przedmiotami i zdobytymi mutacjami, pieczątka „NEW!”, licznik „Index X/Y”.
- Zapis ekwipunku, gabloty i Indexu.
GOTOWE, GDY: zachowuję przedmioty, stawiam rzadki w gablocie i dostaję bonus, Index pokazuje, co mam; wszystko zostaje po powrocie.

## KROK 11: Fuzja i sekretne przepisy
CEL: Aktywny, emocjonujący sposób na lepsze przedmioty – z prawdziwym ryzykiem.
CO ZROBIĆ:
- Maszyna do fuzji na działce i okno wyboru 3–10 takich samych przedmiotów z ekwipunku; pasek szansy rosnący na żywo i dokładny procent (brief: 6).
- Okno potwierdzenia (drugie przy Legendary+); porażka = utrata wszystkich włożonych przedmiotów; dziedziczenie mutacji i 5% na nową. Wszystko liczy serwer: najpierw zabiera przedmioty, potem losuje, potem zapisuje.
- Sekretne przepisy (5–8 na start; wyniki i sylwetki w Recipes, składniki tylko na serwerze w SecretRecipes – sekcja 0C), napis „Eksperyment” przy nieznanych kombinacjach, księga przepisów, sylwetki „???” w Indexie, codzienna podpowiedź w centrum mapy.
- Animacja fuzji: sukces i porażka (brief: 6 – Animacja fuzji).
- W Studio komenda testowa dająca przedmioty do testów fuzji.
GOTOWE, GDY: widzę dokładną szansę przed fuzją, sukces i porażka działają zgodnie z tabelą, animacja trzyma w napięciu, odkryty przepis zapisuje się w księdze i zostaje po powrocie do gry.

## KROK 12: Wydarzenia serwerowe i złote stworki
CEL: Na co czekać i po co zostać w grze.
CO ZROBIĆ:
- EventManager + ModuleScript Events; losowe wydarzenie co ok. 12 min, odliczanie w UI z nazwą nadchodzącego wydarzenia (brief: 7).
- Deszcz meteorów: spadające meteoryty z przedmiotami na całej mapie, zbieranie przez dotknięcie, serwer sprawdza odległość i kto pierwszy.
- Złota godzina: zmiana nieba i większe szanse na mutacje dla wszystkich.
- Złote i tęczowe stworki (CritterManager): pojawianie się, ucieczka przed graczem, strzałka kierunku, łapanie sprawdzane przez serwer, żetony mutacji użyte przy następnym dropie i zapisywane w danych.
- W Studio komenda testowa do natychmiastowego uruchomienia wydarzenia i przywołania stworka.
GOTOWE, GDY: wydarzenia startują same, wszyscy na serwerze je widzą, zmienia się niebo i zasady, a po czasie wszystko wraca do normy; pościg za stworkiem jest zabawny, nagrodę dostaje tylko pierwszy, a żeton daje mutację przy następnym dropie.

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
- Przy każdym kroku sprawdź go z sekcjami 0, 0B i 0C (zasady dobrych gier, budowania i mapa projektu) i krótko napisz, czego z nich pilnowałeś.
- Przy krokach z budowaniem: najpierw plan z góry (sekcja 0D, punkt 1), potem sprawdzenie skillem roblox-build-preview (sekcja 0D, punkt 0), potem skrypt; po zbudowaniu opisz, co powinienem zobaczyć, poproś o raport z InspektorBudowli i zrzuty z wybranych widoków KameraPodglad, i popraw znalezione problemy.
- Na koniec każdego kroku podaj zaktualizowany PROGRESS.md.
- Przy każdym kroku podaj: listę plików, pełny kod każdego pliku (bez „…reszta kodu”), dokładne miejsce w Explorerze i jak przetestować krok w Studio (Play / Test → Device telefon).
- Jeśli coś wymaga zrobienia ręcznie w Studio (np. stworzenie Partu), opisz to krok po kroku.
- Po każdym kroku napisz krótko, co mogło pójść źle i jak to rozpoznać w oknie Output.
- Nie dodawaj rzeczy, o które nie prosiłem, zanim nie skończymy MVP.
- Przy krokach z efektami i grafiką zaproponuj, co jeszcze mogłoby zwiększyć satysfakcję lub poprawić wygląd, ale zrób to jako osobną listę propozycji.

Zacznij od kroku 1.

## WZÓR DZIENNIKA POSTĘPU (PROGRESS.md)
Utrzymuj go dokładnie w tym układzie i aktualizuj po KAŻDYM kroku:

# PROGRESS – Tycoon, but every drop is RNG
## Stan
Ostatni skończony krok: X. Następny krok: Y. Data ostatniej zmiany.
## Zrobione kroki
- Krok N – nazwa: co powstało (1–3 zdania), co przetestowałem.
## Pliki w projekcie
| Ścieżka w Explorerze | Typ | Co robi |
## Decyzje i ustalenia
- Ważne wybory, które zapadły w rozmowie (np. zmienione liczby, nazwy, zasady), żeby ich nie zgubić.
## Odstępstwa od mapy projektu (sekcja 0C)
- Co i dlaczego jest inaczej niż w strukturze.
## Znane problemy i rzeczy do zrobienia później
- Lista.
## Do uzupełnienia przeze mnie
- ID dźwięków, obrazków, produktów itp., które muszę wpisać sam.

Na początek: przeczytaj brief, napisz podsumowanie i pytania, a potem czekaj na „zaczynaj krok 1”.
