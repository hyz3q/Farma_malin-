"""Generuje WŁASNE dźwięki do animacji „Motywacja” (bez cudzej muzyki – wszystko syntezowane).

Uruchom:  python dzwieki/generuj_dzwieki.py   (potrzebny numpy)
Pliki trafiają do public/dzwieki/*.wav

Pętla animacji ma 5 s. Licząc od uderzenia napisu (u = 0):
  u 0.00–2.75  UDERZENIE (smash)  – bębny, bas, melodia
  u 2.75–3.00  ZASSANIE (implode)
  u 3.00–5.00  SPOKÓJ (calm)      – cichy akord, klik kursora, iskierka
Tempo 120 BPM -> 1 uderzenie = 0.5 s, więc smash zaczyna się zawsze „na raz”.
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "dzwieki")
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.005, d=0.2, curve=1.0):
    """Atak + wykładnicze wygaszanie."""
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return att * np.exp(-t / d) ** curve


def note(freq, sec, kind="pluck", vol=1.0, decay=0.25):
    t = t_axis(sec)
    if kind == "pluck":  # ciepły „pianinkowy” dźwięk
        s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
        e = env(len(t), 0.004, decay)
    elif kind == "square":  # retro-melodia
        s = np.sign(np.sin(2 * np.pi * freq * t)) * 0.5 + 0.5 * np.sin(2 * np.pi * freq * t)
        e = env(len(t), 0.003, decay)
    elif kind == "bass":
        s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sign(np.sin(2 * np.pi * freq * t))
        e = env(len(t), 0.004, decay)
    elif kind == "pad":  # miękka plama dźwięku (lekko rozstrojona)
        s = sum(np.sin(2 * np.pi * freq * k * t) for k in (0.997, 1.0, 1.003)) / 3
        e = np.clip(t / 0.25, 0, 1) * np.clip((sec - t) / 0.3, 0, 1)
    return s * e * vol


def place(buf, sound, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sound))
    buf[i:j] += sound[: j - i]


def lowpass(x, k=0.15):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc)
        y[i] = acc
    return y


def noise(sec):
    return rng.uniform(-1, 1, int(sec * SR))


def save(name, x, peak=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print("zapisano", name, f"{len(x) / SR:.2f}s")


# ------------------------------------------------------------- perkusja
def kick():
    t = t_axis(0.35)
    f = 50 + 110 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.12)


def snare():
    t = t_axis(0.25)
    return (noise(0.25) * 0.7 + 0.4 * np.sin(2 * np.pi * 190 * t)) * env(len(t), 0.002, 0.07)


def hat():
    n = noise(0.06)
    return (n - lowpass(n, 0.5)) * env(len(n), 0.001, 0.015)


# ------------------------------------------------------------- MUZYKA (5 s pętla)
B = 0.5  # jedno uderzenie przy 120 BPM
NOTES = {"C3": 130.81, "E3": 164.81, "F3": 174.61, "G3": 196.0, "A3": 220.0, "B3": 246.94,
         "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.0, "A4": 440.0,
         "C5": 523.25, "D5": 587.33, "E5": 659.25, "G5": 783.99,
         "C2": 65.41, "F2": 87.31, "G2": 98.0, "A2": 110.0}


def music_loop():
    loop = np.zeros(int(5 * SR))
    # SMASH: akordy C – G – Am (motywujące, „do przodu”)
    chords = [(0, ["C4", "E4", "G4"], "C2"), (2, ["B3", "D4", "G4"], "G2"), (4, ["C4", "E4", "A4"], "A2")]
    for beat, ch, bass in chords:
        for b in range(2 if beat < 4 else 1):
            for n in ch:
                place(loop, note(NOTES[n], 0.45, "pluck", 0.22, 0.18), (beat + b) * B)
        place(loop, note(NOTES[bass], 0.9, "bass", 0.55, 0.3), beat * B)
        place(loop, note(NOTES[bass] * 2, 0.4, "bass", 0.3, 0.15), (beat + 1.5) * B)
    # melodia (hook)
    hook = [(0, "E5"), (0.5, "G5"), (1, "E5"), (1.5, "D5"), (2, "D5"), (2.5, "E5"), (3, "G5"), (4, "E5"), (4.5, "C5")]
    for beat, n in hook:
        place(loop, note(NOTES[n], 0.3, "square", 0.16, 0.12), beat * B)
    # bębny w smash (0 .. 5.5 uderzenia)
    for b in range(6):
        place(loop, kick(), b * B)
        if b % 2 == 1:
            place(loop, snare(), b * B)
    for h in range(11):
        place(loop, hat(), h * B / 2)
    # SPOKÓJ: cichy akord F (u 3.0 – 5.0)
    for n in ["F3", "A3", "C4", "E4"]:
        place(loop, note(NOTES[n], 2.0, "pad", 0.13), 3.0)
    for i, n in enumerate(["C5", "A4", "F4", "A4"]):  # delikatne „pozytywki”
        place(loop, note(NOTES[n], 0.5, "pluck", 0.08, 0.25), 3.1 + i * B)
    for h in range(4):  # cichutkie tykanie
        place(loop, hat() * 0.35, 3.0 + h * B)
    return loop


def music_full():
    """15 s filmu: pętla zaczyna się od smash, a smash w filmie jest w 1.0 s, 6.0 s, 11.0 s."""
    loop = music_loop()
    full = np.zeros(int(15 * SR))
    for start in (-4.0, 1.0, 6.0, 11.0):
        a = int(start * SR)
        seg = loop
        if a < 0:
            seg, a = loop[-a:], 0
        j = min(len(full), a + len(seg))
        full[a:j] += seg[: j - a]
    fade = np.clip((15 - t_axis(15)) / 0.3, 0, 1)
    return full * fade


# ------------------------------------------------------------- EFEKTY
def klik():
    t = t_axis(0.08)
    return (noise(0.08) * 0.5 + np.sin(2 * np.pi * 2200 * t)) * env(len(t), 0.0005, 0.008)


def narastanie():  # świst rosnący przed uderzeniem (0.6 s)
    t = t_axis(0.6)
    n = noise(0.6)
    k = 0.02 + 0.5 * (t / 0.6) ** 2
    y = np.empty_like(n)
    acc = 0.0
    for i, v in enumerate(n):
        acc += k[i] * (v - acc)
        y[i] = acc
    return y * (t / 0.6) ** 2


def uderzenie():  # mocny „BUM” napisu
    t = t_axis(1.2)
    f = 40 + 140 * np.exp(-t / 0.05)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.35)
    crash = noise(1.2)
    crash = (crash - lowpass(crash, 0.3)) * env(len(t), 0.001, 0.4) * 0.35
    return boom + crash


def pyk(freq):  # wyskakujące przedmioty
    t = t_axis(0.12)
    f = freq * (1 + 1.5 * np.exp(-t / 0.02))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.035)


def pyki():
    out = np.zeros(int(0.5 * SR))
    for i, fr in enumerate([520, 700, 610, 880, 760]):
        place(out, pyk(fr), i * 0.07)
    return out


def zassanie():  # odwrócony świst + „tup”
    sw = narastanie()  # świst rośnie aż do „tup”
    t = t_axis(0.35)
    f = 900 * np.exp(-t / 0.08) + 80
    gul = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.08)
    out = np.zeros(int(0.95 * SR))
    place(out, sw * 0.6, 0.0)
    place(out, gul, 0.6)
    return out


def dzwonek():  # iskierka „ding”
    out = np.zeros(int(0.9 * SR))
    for f, v in [(NOTES["E5"] * 2, 0.6), (NOTES["G5"] * 2, 0.4), (NOTES["C5"] * 4, 0.3)]:
        t = t_axis(0.9)
        out += np.sin(2 * np.pi * f * t) * env(len(t), 0.002, 0.25) * v
    return out


if __name__ == "__main__":
    save("muzyka.wav", music_full(), 0.8)
    save("klik.wav", klik(), 0.7)
    save("narastanie.wav", narastanie(), 0.6)
    save("uderzenie.wav", uderzenie(), 0.95)
    save("pyki.wav", pyki(), 0.5)
    save("zassanie.wav", zassanie(), 0.7)
    save("dzwonek.wav", dzwonek(), 0.5)
