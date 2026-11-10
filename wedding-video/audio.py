"""Synthesised soundtrack for the wedding reel (no copyrighted material).

Reads src/timeline.json so every SFX lands on the exact frame of its visual cue.
Outputs:
  public/audio/mix.wav       music + SFX (used by the "Wedding" composition)
  public/audio/sfx_only.wav  SFX only  (for adding your own CapCut music)
  public/audio/music_only.wav
"""
import json
import wave

import numpy as np

SR = 44100
TL = json.load(open('src/timeline.json'))
FPS = TL['fps']
DUR = TL['total'] / FPS
N = int(DUR * SR) + SR  # 1 s tail, trimmed at the end
rng = np.random.default_rng(7)

BPM = 80
BEAT = 60 / BPM          # 0.75 s
BAR = BEAT * 4           # 3.0 s == 90 frames


def f2s(fr):
    return fr / FPS


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def buf():
    return np.zeros((2, N))


def add(dst, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    dst[0, i:i + len(sig)] += sig * gain * l * 1.414
    dst[1, i:i + len(sig)] += sig * gain * r * 1.414


def lp_fast(x, cutoff):
    # 2nd-order-ish low-pass applied in the frequency domain
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def hp_fast(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))


# ------------------------------------------------------------------ instruments
def piano(freq, dur=2.5, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for h in range(1, 8):
        fh = freq * h * (1 + 0.0004 * h * h)
        if fh > 16000:
            break
        s += (1 / h ** 1.6) * np.sin(2 * np.pi * fh * t + rng.random() * 0.3) * np.exp(-t * (0.9 + 0.55 * h))
    att = np.minimum(1, t / 0.004)
    hammer = rng.standard_normal(len(t)) * np.exp(-t * 90) * 0.04
    rel = np.minimum(1, (dur - t) / 0.08)
    return (s * att + hammer) * rel * vel * 0.32


def bell(freq, dur=3.0, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 1.6)
         + 0.45 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 3.2)
         + 0.25 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 6)
         + 0.12 * np.sin(2 * np.pi * freq * 8.93 * t) * np.exp(-t * 9))
    return s * np.minimum(1, t / 0.002) * vel * 0.22


def pad(freqs, dur, vel=1.0, attack=1.0, release=1.2, bright=6):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        for det in (-0.004, 0.0, 0.0035):
            ff = f * (1 + det)
            vib = 1 + 0.002 * np.sin(2 * np.pi * 5.1 * t)
            ph = 2 * np.pi * ff * np.cumsum(vib) / SR
            for h in range(1, bright + 1):
                s += (1 / h ** 1.3) * np.sin(h * ph)
    env = np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (dur - t) / release))
    return s * env * vel * 0.018 / len(freqs)


def bass(freq, dur, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
    env = np.minimum(1, t / 0.03) * np.exp(-t * 0.6) * np.minimum(1, (dur - t) / 0.15)
    return s * env * vel * 0.30


def kick_soft(vel=1.0):
    t = np.arange(int(0.45 * SR)) / SR
    f = 46 + 70 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    return s * vel * 0.45


def shaker(vel=1.0):
    t = np.arange(int(0.12 * SR)) / SR
    n = hp_fast(rng.standard_normal(len(t)), 6000)
    return n * (t / 0.02 * np.exp(1 - t / 0.02)) * vel * 0.05


# ------------------------------------------------------------------ SFX
def whoosh(dur=0.7, vel=1.0, up=True):
    t = np.arange(int(dur * SR)) / SR
    n = rng.standard_normal(len(t))
    # sweeping band: mix of low/high passed noise by envelope
    lo = lp_fast(n, 900)
    hi = lp_fast(n, 4000)
    x = t / dur
    sweep = x if up else 1 - x
    s = lo * (1 - sweep) + hi * sweep
    env = np.sin(np.pi * np.clip(x, 0, 1)) ** 2
    return s * env * vel * 0.55


def shimmer(dur=1.6, vel=1.0, base=1760):
    out = np.zeros(int(dur * SR))
    for k in range(26):
        f = base * 2 ** (rng.integers(0, 24) / 12) * (1 + rng.random() * 0.01)
        st = int(rng.random() * (dur - 0.5) * SR)
        g = bell(f, 0.6, 0.35 + rng.random() * 0.4)
        out[st:st + len(g)] += g[: len(out) - st]
    t = np.arange(len(out)) / SR
    return out * np.minimum(1, (dur - t) / 0.3) * vel * 0.6


def chime(vel=1.0):
    # D major sparkle arpeggio, quick
    out = np.zeros(int(2.2 * SR))
    for i, n in enumerate([86, 90, 93, 98]):
        g = bell(midi(n), 1.8, 0.8)
        st = int(i * 0.055 * SR)
        out[st:st + len(g)] += g[: len(out) - st]
    return out * vel


def shutter(vel=1.0):
    t = np.arange(int(0.18 * SR)) / SR
    n = hp_fast(rng.standard_normal(len(t)), 2500)
    c1 = n * np.exp(-t * 160)
    c2 = np.roll(n * np.exp(-t * 120), int(0.055 * SR)) * 0.8
    thunk = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 60) * 0.4
    return (c1 + c2 + thunk) * vel * 0.5


def riser(dur=1.6, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    n = rng.standard_normal(len(t))
    s = hp_fast(n, 1500) * (t / dur) ** 2.5
    tone = np.sin(2 * np.pi * np.cumsum(300 + 900 * (t / dur) ** 2) / SR) * (t / dur) ** 3 * 0.25
    return (s * 0.5 + tone) * vel


# ------------------------------------------------------------------ MUSIC
music = buf()
# D  A  Bm  G | D  A  G  D(finale) | G->D
prog = [
    (62, [62, 66, 69]),  # D
    (57, [57, 61, 64]),  # A
    (59, [59, 62, 66]),  # Bm
    (55, [55, 59, 62]),  # G
    (62, [62, 66, 69]),  # D
    (57, [57, 61, 64]),  # A
    (55, [55, 59, 62]),  # G
    (62, [62, 66, 69]),  # D  (finale bloom)
    (55, [55, 59, 62]),  # G -> D handled below
]
arp_pat = [0, 7, 12, 16, 19, 16, 12, 7]  # semitone offsets from chord root (major)
for b, (root, tri) in enumerate(prog):
    t0 = b * BAR
    minor = b == 2
    pat = [0, 7, 12, 15, 19, 15, 12, 7] if minor else arp_pat
    base = root - 12 if root > 60 else root
    vel_bar = [0.55, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 1.0, 0.9][b]
    if b < 8:
        for i, off in enumerate(pat):
            add(music, piano(midi(base + 12 + off), 2.2, vel_bar * (0.95 if i % 2 == 0 else 0.75)),
                t0 + i * BEAT / 2, 0.9, pan=-0.25 + 0.5 * (i % 2))
    # pad
    pv = [0.6, 0.7, 0.8, 0.85, 0.9, 1.0, 1.1, 1.4, 1.2][b]
    add(music, pad([midi(n) for n in tri], BAR + 1.0, pv, attack=0.9, bright=5 if b < 7 else 7), t0, 1.0)
    # bass from bar 1
    if b >= 1 and b < 8:
        add(music, bass(midi(root - 24 if root > 60 else root - 12), BAR * 0.5 + 0.1, 0.9), t0)
        add(music, bass(midi(root - 24 if root > 60 else root - 12), BAR * 0.5 + 0.1, 0.7), t0 + BAR / 2)
    # soft percussion: shaker from bar 2, kick from bar 4 (heartbeat feel)
    if 2 <= b < 7:
        for i in range(8):
            add(music, shaker(1.0 if i % 2 else 0.6), t0 + i * BEAT / 2, 1.0, pan=0.3)
    if 4 <= b < 7:
        add(music, kick_soft(0.8), t0)
        add(music, kick_soft(0.55), t0 + BEAT * 0.5)
        add(music, kick_soft(0.8), t0 + BEAT * 2)

# melody (bell-piano), beats
melody = [
    (1, [(76, 2), (74, 1), (73, 1)]),
    (2, [(74, 2), (78, 2)]),
    (3, [(79, 1), (78, 1), (76, 1), (74, 1)]),
    (4, [(78, 2), (76, 1), (74, 1)]),
    (5, [(76, 2), (81, 2)]),
    (6, [(83, 1.5), (81, 0.5), (79, 1), (78, 1)]),
    (7, [(81, 4)]),
    (8, [(79, 2), (78, 2)]),
]
for b, notes in melody:
    t = b * BAR
    for n, beats in notes:
        v = 0.9 if b < 7 else 1.15
        add(music, piano(midi(n), beats * BEAT + 1.6, v), t, 1.0, pan=0.05)
        add(music, bell(midi(n + 12), 2.0, 0.25 * v), t, 1.0, pan=0.2)
        t += beats * BEAT

# finale: glockenspiel sparkles + G -> D plagal ending
fin = 7 * BAR
for i in range(16):
    n = [86, 90, 93, 98, 93, 90][i % 6]
    add(music, bell(midi(n), 1.5, 0.35), fin + i * BEAT / 2, 1.0, pan=(-0.4 if i % 2 else 0.4))
end = 8 * BAR
add(music, pad([midi(n) for n in [55, 59, 62, 67]], 1.6, 1.2), end)
add(music, pad([midi(n) for n in [62, 66, 69, 74]], 2.2, 1.3, attack=0.4), end + BEAT * 2)
for n in [50, 62, 66, 69, 74]:
    add(music, piano(midi(n), 3.0, 0.8), end + BEAT * 2, 1.0)
add(music, riser(1.4, 0.35), fin - 1.4)


# ------------------------------------------------------------------ SFX cues
sfx = buf()
S = {s['id']: s for s in TL['scenes']}
cuts = [s['start'] for s in TL['scenes'][1:]]

add(sfx, shimmer(2.2, 0.6, base=1320), 0.0)               # opening glow
add(sfx, chime(0.55), f2s(14))                            # "Raja Sehari"
add(sfx, whoosh(0.9, 0.7, up=True), f2s(S['arch']['end'] - 26))  # arch expands
for c in cuts:
    add(sfx, whoosh(0.6, 0.55), f2s(c) - 0.38, pan=rng.uniform(-0.4, 0.4))
    add(sfx, shimmer(1.2, 0.35), f2s(c) - 0.05)
for id_, off in [('dua-hati', 10), ('doa', 8), ('bahagia', 10), ('keluarga', 6)]:
    add(sfx, chime(0.4), f2s(S[id_]['start'] + off), pan=0.1)
for sw in S['doa']['switches']:
    add(sfx, whoosh(0.45, 0.45, up=False), f2s(sw) - 0.22, pan=-0.3)
for sh in S['keluarga']['shutters']:
    add(sfx, shutter(0.9), f2s(sh) - 0.01)
    add(sfx, whoosh(0.5, 0.4), f2s(sh) - 0.45, pan=0.4)
add(sfx, chime(0.75), f2s(S['finale']['start'] + 44))       # "Pengantin Baru"
add(sfx, shimmer(2.5, 0.55, base=1760), f2s(S['finale']['start'] + 40))
add(sfx, shimmer(2.0, 0.35, base=2093), f2s(S['finale']['start'] + 110))


# ------------------------------------------------------------------ reverb + mix
def reverb(x, secs=2.4, wet=0.28, seed=1):
    r = np.random.default_rng(seed)
    L = int(secs * SR)
    t = np.arange(L) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = r.standard_normal(L) * np.exp(-t * 3.2)
        ir = lp_fast(ir, 5000)
        ir /= np.sqrt(np.sum(ir ** 2))
        n = len(x[ch]) + L
        y = np.fft.irfft(np.fft.rfft(x[ch], n) * np.fft.rfft(ir, n), n)[: len(x[ch])]
        out[ch] = x[ch] * (1 - wet) + y * wet
    return out


music = reverb(music, 2.6, 0.32, 1)
sfx = reverb(sfx, 1.8, 0.2, 2)

n_out = int(DUR * SR)


def finish(x, peak=0.85):
    x = x[:, :n_out].copy()
    t = np.arange(n_out) / SR
    fade = np.minimum(1, t / 0.4) * np.minimum(1, (DUR - t) / 1.2)
    x *= fade
    x = np.tanh(x * 1.2)
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def write(name, x):
    y = (np.clip(x, -1, 1) * 32767).astype(np.int16).T.copy()
    w = wave.open(f'public/audio/{name}.wav', 'wb')
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(y.tobytes())
    w.close()
    print(name, 'peak dB', round(20 * np.log10(np.max(np.abs(x))), 2))


mn = music / (np.max(np.abs(music)) + 1e-9)
sn = sfx / (np.max(np.abs(sfx)) + 1e-9)
write('music_only', finish(mn, 0.85))
write('sfx_only', finish(sn * 0.8, 0.8))
write('mix', finish(mn * 0.62 + sn * 0.42, 0.86))
