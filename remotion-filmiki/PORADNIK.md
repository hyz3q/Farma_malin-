# Remotion – poradnik (filmiki do gry robione kodem)

Remotion to narzędzie, w którym filmiki robi się kodem (React). Dzięki temu Claude może je
tworzyć, poprawiać i renderować za Ciebie – także w sesji w chmurze.

## Co już jest zrobione (przez Claude)
- Projekt Remotion w folderze `remotion-filmiki/` (Remotion 4.0.534, React 19, TypeScript).
- Oficjalne skille Remotion dla Claude Code w `.claude/skills/remotion-*` (zainstalowane poleceniem
  `npx skills add remotion-dev/skills`). Claude sam z nich korzysta, gdy prosisz o filmik.
- Czcionka Lilita One (licencja OFL) w `public/fonts/`.
- Dwa filmiki:
  - `PromoTikTok` – 15 s, 1080×1920 (TikTok / Shorts / Reels), reklama gry: maszyna, dropy, LEGENDARY, SECRET, „PLAY NOW”.
  - `Motywacja` – 15 s, 1080×1080, 12 fps, styl vintage-plakatu jak wzór (@mondayschallenge #27): pętla 5 s
    spokój → uderzenie tytułu → zassanie.
  - `TelefonVsCele` – 60 s, 1080×1920, 12 fps, ten sam styl: 12 scen po 5 s („SCROLL.” → „PHONE DOWN / GOALS UP”),
    własna muzyka (najpierw mol, od sceny START dur i coraz mocniej) + efekty. Teksty scen: tablica `SCENES`
    w `src/TelefonVsCele.tsx`, dźwięki: `dzwieki/generuj_dzwieki_telefon.py`. Wspólny styl: `src/vintage.tsx`.
  - `Iskra` – 12 s, 1080×1920, 30 fps, styl „filmowy motion design” (inspiracja, nie kopia): ciemne gradienty,
    poświata, 1 symbol na ujęcie, ujęcia różnej długości. Dźwięk: `dzwieki/generuj_dzwieki_iskra.py`.
- Gotowe pliki MP4 (też `gotowe/telefon-vs-cele.mp4`): `gotowe/promo-tiktok.mp4`, `gotowe/motywacja.mp4`, porównanie ze wzorem `gotowe/porownanie_z_wzorem.png`.

## Linki
- Strona Remotion: https://www.remotion.dev
- Dokumentacja (start): https://www.remotion.dev/docs/
- Remotion + AI / Claude Code (skille): https://www.remotion.dev/docs/ai/skills
- Licencja (darmowa dla osób prywatnych i firm do 3 osób): https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
- Node.js (potrzebny na komputerze, wersja LTS): https://nodejs.org
- Visual Studio Code (wygodny edytor): https://code.visualstudio.com
- Claude Code: https://claude.com/claude-code (sesja w chmurze: https://claude.ai/code)

## Jak uruchomić na swoim komputerze (raz)
1. Zainstaluj **Node.js LTS** z https://nodejs.org (instalator „Next, Next, Finish”).
2. Pobierz repozytorium (GitHub Desktop albo `git clone`) i przejdź na gałąź z tymi plikami.
3. Otwórz terminal w folderze `remotion-filmiki` i wpisz:
   ```
   npm install
   ```
4. Podgląd na żywo (Remotion Studio – otworzy się w przeglądarce):
   ```
   npm run dev
   ```
   Po lewej wybierasz filmik (`PromoTikTok` albo `Motywacja`), po prawej zmieniasz teksty (props) i od razu widzisz efekt.
5. Zapis do MP4:
   ```
   npx remotion render PromoTikTok out/promo.mp4
   npx remotion render Motywacja out/motywacja.mp4
   ```

## Jak pracować z Claude
- **W sesji w chmurze** (tak jak teraz): napisz np. „zrób filmik o nowym update z mutacjami” – Claude zmieni kod,
  wyrenderuje MP4 i wyśle Ci plik. Podglądu na żywo (Studio) w chmurze nie zobaczysz, ale dostajesz gotowe filmy i klatki.
- **Na komputerze w Claude Code**: uruchom `npm run dev` w jednym terminalu, a `claude` w drugim (w folderze repozytorium).
  Claude edytuje kod, a Ty od razu widzisz zmiany w Studio.
- Dobre prośby: podaj format (TikTok pionowy / kwadrat), długość, tekst na ekranie, i wklej filmik-wzór – Claude
  porówna tempo, kolory i układ klatka po klatce (tak powstała „Motywacja”).

## Muzyka i dźwięk
„Motywacja” ma własne dźwięki – muzykę i efekty wygenerował kod `dzwieki/generuj_dzwieki.py` (zero cudzej muzyki,
więc nie ma problemu z prawami autorskimi). Pliki leżą w `public/dzwieki/`:
- `muzyka.wav` – 120 BPM, bębny i melodia w czasie uderzenia napisu, cichy akord w czasie spokoju,
- `klik.wav`, `narastanie.wav`, `uderzenie.wav`, `pyki.wav`, `zassanie.wav`, `dzwonek.wav` – efekty zgrane z obrazem.
Czasy efektów są w tablicy `SFX` w `src/Motywacja.tsx` (głośność: `volume`). Żeby zmienić brzmienie, popraw
skrypt i uruchom `python dzwieki/generuj_dzwieki.py` (potrzebny `pip install numpy`).
Do TikToka możesz też wyciszyć tę muzykę i dodać modny dźwięk w aplikacji. Nie używaj cudzej muzyki bez prawa do niej.

## Zmienianie tekstów bez kodu
W `src/Root.tsx` są `defaultProps` – np. `title`, `subtitle`, `handle`, `cta`, `gameName`. Zmień tekst w cudzysłowie
i zapisz – albo zrób to suwakiem/polem w Remotion Studio.
