"""Ścieżka dźwiękowa SHOWREELA (24 s, 120 BPM) – jeden plik public/dzwieki/reel.wav.

Uruchom:  python dzwieki/generuj_dzwieki_reel.py   (potrzebny numpy)
Każda część ma własne dźwięki zgrane z obrazem (czasy w sekundach = klatka / 30):
  0–2 intro (pyk, rozciągnięcie, litery) · 2–5 typografia (uderzenia, automat, iris)
  5–9 kształty (boing przy morfie, piłka) · 9–12 płyn (bulgot, bez bębnów)
  12–15 cząsteczki (migotanie, wiatr) · 15–19 3D (zejście basu, pełne bębny)
  19–21 dane (tykanie licznika) · 21–24 outro (zassanie, pyk, akord)
"""
import numpy as np

from generuj_dzwieki import NOTES, SR, env, hat, kick, lowpass, noise, note, place, save, snare, t_axis

LEN = 24.0
BEAT = 0.5
N = dict(NOTES)
N.update({"D2": 73.42, "E2": 82.41, "D3": 146.83, "B4": 493.88, "A5": 880.0, "C6": 1046.5, "D5": 587.33, "E6": 1318.5})


def sweep(sec, up=True, k0=0.01, k1=0.55):
    n = noise(sec)
    t = t_axis(sec) / sec
    k = k0 + (k1 - k0) * (t if up else 1 - t) ** 2
    y = np.empty_like(n)
    acc = 0.0
    for i, v in enumerate(n):
        acc += k[i] * (v - acc)
        y[i] = acc
    return y * (t if up else 1 - t) ** 1.5


def chirp(f0, f1, sec, vol=1.0, d=0.15):
    t = t_axis(sec)
    f = f0 * (f1 / f0) ** (t / sec)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, d) * vol


def impact(sec=0.6, f0=50):
    t = t_axis(sec)
    f = f0 + 140 * np.exp(-t / 0.04)
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.18)
    n = noise(sec)
    return b + (n - lowpass(n, 0.3)) * env(len(t), 0.001, 0.05) * 0.5


def tick(freq=2400, vol=0.5):
    t = t_axis(0.03)
    return np.sin(2 * np.pi * freq * t) * env(len(t), 0.0005, 0.006) * vol


def build():
    mix = np.zeros(int(LEN * SR))
    # --------------------------------------------- muzyka: bas i akordy (Am F C G, 1 akord = 1 takt = 2 s)
    prog = [("A2", ["A3", "C4", "E4"]), ("F2", ["F3", "A3", "C4"]), ("C2", ["G3", "C4", "E4"]), ("G2", ["G3", "B3", "D4"])]
    for bar in range(12):
        t0 = bar * 2.0
        bass, ch = prog[bar % 4]
        calm = 9.0 <= t0 < 12.0  # płyn – spokojniej
        if t0 >= 21.0:
            continue
        for b in range(4):
            at = t0 + b * BEAT
            place(mix, note(N[bass], 0.45, "bass", 0.35 if not calm else 0.2, 0.2), at)
            if t0 >= 2.0:
                place(mix, note(N[bass] * 2, 0.2, "bass", 0.15, 0.08), at + 0.25)
        for n in ch:
            place(mix, note(N[n], 2.0, "pad", 0.07), t0)
    # bębny: od 2 s; bez bębnów w części płyn (9–12); najmocniej w 3D (15–19)
    for i in range(int(LEN / BEAT)):
        at = i * BEAT
        if at < 2.0 or 9.0 <= at < 12.0 or at >= 21.0:
            continue
        loud = 1.0 if 15.0 <= at < 19.0 else 0.75
        place(mix, kick() * loud, at)
        if i % 2 == 1:
            place(mix, snare() * 0.7 * loud, at)
        place(mix, hat() * 0.5, at + 0.25)
        if 15.0 <= at < 19.0:
            place(mix, hat() * 0.35, at + 0.125)
            place(mix, hat() * 0.35, at + 0.375)
    # --------------------------------------------- 01 intro
    place(mix, chirp(300, 900, 0.12, 0.6, 0.05), 0.0)  # pyk – kropka
    place(mix, sweep(0.4, True) * 0.5, 0.5)  # rozciąganie w kreskę
    for i in range(6):
        place(mix, tick(1800 + i * 200, 0.6), (28 + i * 2) / 30)  # litery
    place(mix, impact(0.6, 60) * 0.7, 0.93)
    # --------------------------------------------- 02 typografia
    for i in range(5):
        place(mix, impact(0.4, 70) * 0.8, 2.0 + i * 0.4)
        place(mix, tick(3000, 0.4), 2.0 + i * 0.4)
    gap = 0.03
    t = 4.0
    while t < 4.53:
        place(mix, tick(2600, 0.45), t)
        t += gap
        gap *= 1.18
    place(mix, note(N["E6"], 0.6, "pluck", 0.35, 0.2), 4.55)  # „ding” – automat stanął
    place(mix, sweep(0.4, True) * 0.6, 4.62)  # iris
    # --------------------------------------------- 03 kształty
    for k in range(5):
        place(mix, chirp(220, 660, 0.35, 0.45, 0.12), 5.0 + k * 0.8)  # boing przy morfie
    for k in range(4):
        place(mix, chirp(160, 60, 0.15, 0.6, 0.05), 5.0 + k * 1.0)  # piłka uderza w ziemię
    place(mix, sweep(0.55, True, k1=0.7) * 0.7, 8.45)  # whip-pan
    # --------------------------------------------- 04 płyn
    rng = np.random.default_rng(11)
    for at in np.sort(rng.uniform(9.1, 11.0, 9)):
        place(mix, chirp(rng.uniform(180, 300), rng.uniform(500, 800), 0.12, 0.35, 0.05), at)  # bulgot
    place(mix, sweep(0.9, True) * 0.5, 11.0)
    place(mix, chirp(600, 120, 0.4, 0.6, 0.15), 11.9)  # „glup” – zalanie ekranu
    # --------------------------------------------- 05 cząsteczki
    for k in range(18):
        place(mix, note(N["E6"] * (1 + (k % 3) * 0.25), 0.4, "pluck", 0.07, 0.15), 12.25 + k * 0.06)  # migotanie
    place(mix, sweep(1.0, False, k1=0.35) * 0.6, 14.05)  # wiatr
    # --------------------------------------------- 06 3D
    place(mix, impact(1.4, 32) * 1.0, 15.0)  # zejście basu
    place(mix, sweep(0.8, True) * 0.4, 16.2)
    place(mix, impact(0.6, 55) * 0.6, 17.0)  # kryształ ląduje
    # --------------------------------------------- 07 dane
    for k in range(24):
        place(mix, tick(2200 + k * 30, 0.35), 19.0 + 1.2 * (1 - (1 - k / 24) ** 2))
    for k in range(5):
        place(mix, chirp(400 + k * 80, 700 + k * 80, 0.1, 0.3, 0.04), 19.13 + k * 0.13)
    # --------------------------------------------- 08 outro
    place(mix, sweep(0.47, True) * 0.6, 21.0)  # zassanie do kropki
    place(mix, chirp(300, 900, 0.12, 0.6, 0.05), 21.47)  # pyk
    place(mix, impact(0.8, 50) * 0.8, 21.8)
    for n in ["A3", "C4", "E4", "A4", "C5"]:
        place(mix, note(N[n], 2.2, "pad", 0.12), 21.8)
    place(mix, note(N["A4"] * 2, 1.5, "pluck", 0.25, 0.6), 21.8)
    fade = np.clip((LEN - t_axis(LEN)) / 0.8, 0, 1)
    return mix * fade


if __name__ == "__main__":
    save("reel.wav", build(), 0.85)
