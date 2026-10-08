"""Ścieżka dźwiękowa do animacji „ISKRA” (12 s) – jeden plik public/dzwieki/iskra.wav.

Uruchom:  python dzwieki/generuj_dzwieki_iskra.py   (potrzebny numpy)
100 BPM, takt = 0.6 s. Dźwięk prowadzi obraz:
  0.0–2.4  zimna noc: niski szum-akord (mol), ciche „bicie serca”, pling z telefonu
  2.4      telefon gaśnie: „tunk” + opadający bas, potem tylko trzaski iskry
  3.0–3.6  narastający świst, 3.6–4.2 iskra leci w kamerę, 4.2 uderzenie
  4.2–7.8  schody: na każdy takt wyższa nuta + bęben (budowanie napięcia)
  7.8      szczyt: wielkie uderzenie i błysk
  8.4–12   wschód słońca: ciepły akord dur, dzwoneczki, wyciszenie
"""
import numpy as np

from generuj_dzwieki import NOTES, SR, env, kick, lowpass, noise, note, place, save, t_axis

NOTES = dict(NOTES)
NOTES.update({"D2": 73.42, "E2": 82.41, "D3": 146.83, "B4": 493.88, "A5": 880.0, "C6": 1046.5, "D5": 587.33})
BEAT = 0.6
LEN = 12.0


def sweep(sec, up=True, k0=0.01, k1=0.5):
    n = noise(sec)
    t = t_axis(sec) / sec
    k = k0 + (k1 - k0) * (t if up else 1 - t) ** 2
    y = np.empty_like(n)
    acc = 0.0
    for i, v in enumerate(n):
        acc += k[i] * (v - acc)
        y[i] = acc
    return y * (t if up else 1 - t) ** 1.5


def boom(sec=2.0, f0=36):
    t = t_axis(sec)
    f = f0 + 120 * np.exp(-t / 0.06)
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.6)
    n = noise(sec)
    crash = (n - lowpass(n, 0.25)) * env(len(t), 0.001, 0.9) * 0.3
    return b + crash


def crackle(sec):
    out = np.zeros(int(sec * SR))
    rng = np.random.default_rng(3)
    for at in np.sort(rng.uniform(0, sec, int(sec * 22))):
        c = noise(0.01) * env(int(0.01 * SR), 0.0002, 0.002) * rng.uniform(0.3, 1)
        place(out, c, at)
    return out


def build():
    mix = np.zeros(int(LEN * SR))
    # 1) zimna noc
    for n in ["A2", "E3", "C4"]:
        place(mix, note(NOTES[n], 2.5, "pad", 0.16), 0.0)
    for b in range(4):
        place(mix, kick() * 0.35, b * BEAT)  # ciche „bicie serca”
    place(mix, note(NOTES["E5"] * 2, 0.3, "pluck", 0.12, 0.08), 0.9)
    place(mix, note(NOTES["A5"] * 2, 0.3, "pluck", 0.12, 0.08), 1.0)
    # 2) telefon gaśnie
    t = t_axis(0.8)
    drop = np.sin(2 * np.pi * np.cumsum(220 * np.exp(-t / 0.15) + 40) / SR) * env(len(t), 0.001, 0.3)
    place(mix, drop * 0.7, 2.4)
    place(mix, crackle(1.8) * 0.35, 2.4)
    place(mix, note(NOTES["A2"], 1.2, "pad", 0.1), 2.4)
    # 3) świst w kamerę
    place(mix, sweep(1.2) * 0.6, 3.0)
    place(mix, boom(1.2, 44) * 0.6, 4.2)
    # 4) schody – na każdy takt wyższa nuta
    climb = ["C4", "D4", "E4", "G4", "A4", "C5"]
    for k, n in enumerate(climb):
        at = 4.2 + k * BEAT
        place(mix, note(NOTES[n], 0.6, "pluck", 0.45, 0.3), at)
        place(mix, note(NOTES[n] * 2, 0.4, "pluck", 0.15, 0.2), at)
        place(mix, kick() * (0.5 + k * 0.08), at)
        place(mix, note(NOTES[["C2", "C2", "A2", "A2", "F2", "G2"][k]], 0.6, "bass", 0.35, 0.3), at)
    for n in ["C3", "G3", "E4"]:
        place(mix, note(NOTES[n], 3.6, "pad", 0.08), 4.2)
    place(mix, sweep(0.9, k1=0.6) * 0.5, 6.9)
    # 5) szczyt
    place(mix, boom(2.5, 34) * 0.9, 7.8)
    # 6) wschód słońca
    for n in ["C3", "G3", "C4", "E4", "G4"]:
        place(mix, note(NOTES[n], 4.0, "pad", 0.14), 8.0)
    for k, n in enumerate(["G4", "C5", "E5", "D5", "C5"]):
        place(mix, note(NOTES[n] * 2, 0.9, "pluck", 0.12, 0.45), 8.6 + k * BEAT)
    fade = np.clip((LEN - t_axis(LEN)) / 0.8, 0, 1)
    return mix * fade


if __name__ == "__main__":
    save("iskra.wav", build(), 0.85)
