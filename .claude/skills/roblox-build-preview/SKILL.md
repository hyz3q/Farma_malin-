---
name: roblox-build-preview
description: Sprawdza i rysuje budowlę Roblox (mapa, maszyna, przedmiot, dekoracja z klocków) ZANIM użytkownik wklei ją do Roblox Studio. Użyj ZAWSZE przed oddaniem użytkownikowi skryptu, który buduje coś z Partów – zapisz budowlę jako JSON, uruchom scripts/preview.py, obejrzyj obrazki i raport, popraw błędy, i dopiero wtedy daj wygenerowany build.lua. Triggers: budowla, model z klocków, mapa, działka, maszyna, dropper, dekoracja, „zbuduj w Roblox”, skrypt budujący do Command Bar.
---

# Podgląd budowli Roblox przed Studio

Budujesz kodem i nie widzisz Studio. Ten skill daje Ci „oczy”: z jednego pliku JSON robi
raport problemów, rysunki z kilku stron (z manekinem gracza dla skali) i gotowy skrypt Luau.

## Kiedy używać
Za każdym razem, zanim dasz użytkownikowi skrypt, który tworzy klocki w Studio
(mapa, działka, maszyna, przedmiot z droppera, budynek, dekoracja). Nie oddawaj takiego
skryptu bez przejścia pętli poniżej.

## Pętla pracy (obowiązkowa)
1. **Plan**: krótko ustal bryły i wymiary (zasady skali: gracz ≈ 5 studów wysokości).
2. **JSON**: zapisz budowlę jako plik JSON (format niżej), np. `builds/dropper.json`.
3. **Uruchom**:
   ```bash
   python .claude/skills/roblox-build-preview/scripts/preview.py builds/dropper.json --out builds/dropper_preview
   ```
   (Wymaga Pillow: `pip install pillow`. Widoki: `--views front,right,top,iso,back,left`.)
4. **Przeczytaj** `report.txt` i **obejrzyj** `preview_sheet.png` (narzędziem do czytania plików/obrazów).
   Opisz sobie, co widzisz: proporcje względem manekina, sylwetka, kolory, czy coś odstaje.
5. **Popraw JSON** i wróć do kroku 3, aż:
   - raport ma 0 ostrzeżeń ⚠ (albo każde zostawione ostrzeżenie świadomie wyjaśniasz użytkownikowi),
   - budowla na obrazkach wygląda zgodnie z briefem (styl, skala, czytelność).
   Zwykle potrzeba 2–3 rund. Nie oddawaj pierwszej wersji bez obejrzenia.
6. **Oddaj** użytkownikowi `build.lua` (gotowy skrypt do Command Bar) i pokaż `preview_sheet.png`,
   żeby wiedział, czego się spodziewać. Pliki JSON i podgląd zostaw w repozytorium.

## Format JSON
```json
{
  "name": "Dropper",
  "studs": true,
  "expect": { "height": [12, 16] },
  "checks": { "maxParts": 500, "grid": 0.5 },
  "parts": [
    { "name": "Base", "size": [10, 1, 10], "pos": [0, 0.5, 0], "color": "#5E656D" },
    { "name": "Hopper", "shape": "Wedge", "size": [6, 2, 3], "pos": [0, 12.5, 1.5], "color": "#FFC93C" },
    { "name": "Pipe", "shape": "Cylinder", "size": [6, 1, 1], "pos": [4.5, 5, 2], "rot": [0, 0, 90], "color": "#8E969F" },
    { "name": "Lamp", "shape": "Ball", "size": [1, 1, 1], "pos": [2.5, 12, -2], "color": "#7CFC00", "material": "Neon", "canCollide": false, "castShadow": false }
  ]
}
```
Pola klocka:
- `name` – zawsze sensowna nazwa (raport ostrzega przy braku).
- `shape` – `Block` (domyślnie), `Wedge`, `Cylinder`, `Ball`. Jak w Roblox: Wedge ma pełną wysokość z tyłu (+Z) i skos do przodu (−Z); Cylinder ma oś wzdłuż X (obróć `rot: [0,0,90]`, żeby stał pionowo).
- `size` [X, Y, Z] i `pos` [X, Y, Z] – środek klocka, względem środka budowli na ziemi (Y=0 to ziemia). Przód budowli patrzy w −Z.
- `rot` [X, Y, Z] w stopniach – jak `CFrame.Angles` (Roblox).
- `color` `#RRGGBB`, `material` (nazwa z Enum.Material, np. `Plastic`, `SmoothPlastic`, `Neon`, `Wood`, `Glass`), `transparency` 0–1.
- `studs` (domyślnie z góry pliku) – studsy na górze klocka.
- `canCollide`, `castShadow` – dla drobnych ozdób ustaw `false`.
- `allowFloating: true` – dla rzeczy, które celowo wiszą w powietrzu (lampy, chmurki), żeby raport nie ostrzegał.
Pola budowli:
- `expect` – oczekiwane wymiary całości, np. `"height": [12, 16]`, `"width": [..]`, `"depth": [..]`; raport ostrzeże, jeśli wyjdą poza zakres.
- `checks` – progi: `maxParts` (500), `grid` (0.5), `minSize` (0.2), `gapWarn` (0.25).

## Co sprawdza raport
- liczba klocków vs limit; rozmiar całości i wysokość w „wysokościach gracza”; zgodność z `expect`,
- klocki poza siatką, bardzo małe, bez nazwy,
- duplikaty w tym samym miejscu, migotanie (z-fighting) wspólnych ścian o różnych kolorach,
- małe szczeliny między klockami, klocki wiszące w powietrzu,
- kolory z udziałem procentowym (zasada 60/30/10) i zbyt wiele kolorów.

## Ograniczenia (powiedz o nich użytkownikowi, jeśli mają znaczenie)
- Rysunek to uproszczony podgląd: bez studsów, tekstur, cieni i prawdziwego światła Roblox; przy
  bardzo skomplikowanych nakładających się bryłach kolejność rysowania może się czasem pomylić.
- Kształty: tylko Block, Wedge, Cylinder, Ball (bez CornerWedge, MeshPart, Union).
- Ostateczne sprawdzenie i tak robi użytkownik w Studio (narzędzia InspektorBudowli i KameraPodglad w `roblox-skrypty/`).

Przykład: `examples/dropper.json`.
