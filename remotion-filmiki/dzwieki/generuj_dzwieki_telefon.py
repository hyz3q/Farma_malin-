"""Własna muzyka i efekty do animacji „PHONE vs GOALS” (60 s, 12 scen po 5 s).

Uruchom:  python dzwieki/generuj_dzwieki_telefon.py   (potrzebny numpy)
Korzysta z narzędzi z generuj_dzwieki.py. Pliki trafiają do public/dzwieki/.

Każda scena (5 s):  0–2 s spokój (cichy akord)  |  2–4.75 s UDERZENIE (bębny, bas, melodia)  |  4.75–5 s zassanie.
Tempo 120 BPM, więc uderzenie (2.0 s) wypada zawsze „na raz”.
Sceny 1–4 (telefon, stracony czas) są w molu i ciche, od 5 (START) muzyka przechodzi w dur i rośnie.
"""
import numpy as np

from generuj_dzwieki import B, NOTES, SR, env, hat, kick, noise, note, place, save, snare, t_axis

NOTES = dict(NOTES)
NOTES.update({"D3": 146.83, "D2": 73.42, "E2": 82.41, "B4": 493.88, "F5": 698.46, "A5": 880.0})

# (akord spokoju, bas spokoju, akordy smash [(uderzenie, nuty, bas)], melodia, siła 0..1)
MINOR = dict(
    calm=["A3", "C4", "E4"], calm_bass="A2",
    smash=[(0, ["A3", "C4", "E4"], "A2"), (2, ["F3", "A3", "C4"], "F2"), (4, ["G3", "B3", "D4"], "G2")],
    hook=[(0, "E5"), (1, "C5"), (2, "C5"), (3, "A4"), (4, "B4")],
)
MAJOR = dict(
    calm=["F3", "A3", "C4", "E4"], calm_bass="F2",
    smash=[(0, ["C4", "E4", "G4"], "C2"), (2, ["B3", "D4", "G4"], "G2"), (4, ["C4", "E4", "A4"], "A2")],
    hook=[(0, "E5"), (0.5, "G5"), (1, "E5"), (1.5, "D5"), (2, "D5"), (2.5, "E5"), (3, "G5"), (4, "E5"), (4.5, "C5")],
)


def scene_music(style, power):
    """5 s muzyki jednej sceny. power 0..1 – ile bębnów i jak głośno."""
    out = np.zeros(int(5 * SR))
    # spokój 0–2 s
    for n in style["calm"]:
        place(out, note(NOTES[n], 2.0, "pad", 0.12), 0.0)
    place(out, note(NOTES[style["calm_bass"]], 2.0, "pad", 0.12), 0.0)
    for h in range(4):
        place(out, hat() * 0.3, h * B)
    # uderzenie 2.0–4.75 s
    s0 = 2.0
    for beat, ch, bass in style["smash"]:
        for b in range(2 if beat < 4 else 1):
            for n in ch:
                place(out, note(NOTES[n], 0.45, "pluck", 0.2, 0.18), s0 + (beat + b) * B)
        place(out, note(NOTES[bass], 0.9, "bass", 0.5 + 0.15 * power, 0.3), s0 + beat * B)
        place(out, note(NOTES[bass] * 2, 0.4, "bass", 0.3, 0.15), s0 + (beat + 1.5) * B)
    for beat, n in style["hook"]:
        place(out, note(NOTES[n], 0.3, "square", 0.1 + 0.08 * power, 0.12), s0 + beat * B)
    for b in range(6):
        place(out, kick() * (0.7 + 0.3 * power), s0 + b * B)
        if b % 2 == 1:
            place(out, snare() * (0.5 + 0.5 * power), s0 + b * B)
    steps = 11 if power < 0.6 else 22  # w końcówce szybsze hi-haty
    for h in range(steps):
        place(out, hat() * (0.6 + 0.4 * power), s0 + h * (B / 2 if steps == 11 else B / 4))
    return out


def full_music():
    full = np.zeros(int(60 * SR))
    for i in range(12):
        style = MINOR if i < 4 else MAJOR
        power = 0.2 if i < 4 else min(1.0, 0.4 + (i - 4) * 0.09)
        place(full, scene_music(style, power), i * 5.0)
    # zakończenie: długi akord C-dur na ostatnich sekundach
    for n in ["C3", "G3", "C4", "E4", "G4"]:
        place(full, note(NOTES[n], 1.2, "pad", 0.15), 58.75)
    fade = np.clip((60 - t_axis(60)) / 0.6, 0, 1)
    return full * fade


# ------------------------------------------------------------- nowe efekty
def powiadomienie():  # „pling-pling” z telefonu
    out = np.zeros(int(0.45 * SR))
    place(out, note(NOTES["E5"] * 2, 0.3, "pluck", 1.0, 0.07), 0.0)
    place(out, note(NOTES["A5"] * 2, 0.3, "pluck", 1.0, 0.09), 0.1)
    return out


def tykanie():  # zegar 2 s, przyspiesza
    out = np.zeros(int(2.0 * SR))
    t = 0.0
    step = 0.25
    i = 0
    while t < 1.95:
        tk = noise(0.03) * env(int(0.03 * SR), 0.0005, 0.004)
        tk += np.sin(2 * np.pi * (2400 if i % 2 else 1800) * t_axis(0.03)) * env(int(0.03 * SR), 0.0005, 0.006)
        place(out, tk, t)
        t += step
        step = max(0.09, step * 0.9)
        i += 1
    return out


def wylacz():  # telefon gaśnie: opadający ton
    t = t_axis(0.5)
    f = 900 * np.exp(-t / 0.12) + 120
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.15)


def pisanie():  # ołówek – szybkie „szur”
    n = noise(0.5)
    sh = n - np.convolve(n, np.ones(8) / 8, mode="same")
    mod = 0.5 + 0.5 * np.sin(2 * np.pi * 14 * t_axis(0.5))
    return sh * mod * env(len(n), 0.01, 0.25)


def klocek():  # klocek ląduje: „tok”
    t = t_axis(0.18)
    f = 380 * np.exp(-t / 0.03) + 160
    tok = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.0008, 0.04)
    return tok + noise(0.18) * env(len(t), 0.0005, 0.01) * 0.4


def porazka():  # wieża się wali + smutne „wah-wah”
    out = np.zeros(int(1.4 * SR))
    for k, at in enumerate([0.0, 0.12, 0.22, 0.3]):
        place(out, klocek() * (1 - k * 0.15), at)
    for k, n in enumerate(["E4", "D4", "C4"]):
        place(out, note(NOTES[n], 0.35, "square", 0.35, 0.2), 0.45 + k * 0.3)
    return out


def final():  # zwycięski „ta-da!”
    out = np.zeros(int(1.6 * SR))
    for k, n in enumerate(["C5", "E5", "G5"]):
        place(out, note(NOTES[n], 0.25, "square", 0.6, 0.12), k * 0.09)
    for n in ["C5", "E5", "G5"]:
        place(out, note(NOTES[n] * 2, 1.2, "pluck", 0.4, 0.5), 0.3)
    return out


if __name__ == "__main__":
    save("telefon_muzyka.wav", full_music(), 0.8)
    save("powiadomienie.wav", powiadomienie(), 0.6)
    save("tykanie.wav", tykanie(), 0.6)
    save("wylacz.wav", wylacz(), 0.6)
    save("pisanie.wav", pisanie(), 0.5)
    save("klocek.wav", klocek(), 0.7)
    save("porazka.wav", porazka(), 0.7)
    save("final.wav", final(), 0.7)
