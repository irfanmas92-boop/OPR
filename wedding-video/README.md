# Video Pengantin (27.5 s, 9:16)

Reel walimatulurus 1080×1920, 30 fps, dibina dengan Remotion (React) daripada 9 foto majlis.

## Babak
| Masa | Babak | Foto | Teks |
|---|---|---|---|
| 0.0–3.0 s | Bingkai gerbang emas mengembang ke skrin penuh | p9 | WALIMATULURUS · *Raja Sehari* · "Sebuah kisah cinta bermula" |
| 3.0–6.0 s | Potret penuh, zum perlahan | p6 | *Dua Hati* · "satu ikatan, satu janji" |
| 6.0–12.0 s | Kad cetak bersegi, 3 foto doa bertukar | p4, p3, p5 | *Barakallahu Lakuma* · "Diiringi doa, semoga diberkati & disatukan dalam kebaikan" |
| 12.0–15.0 s | Potret penuh, zum keluar | p8 | *Bahagia* · "itu bila kita bersama" |
| 15.0–21.0 s | 2 cetakan foto keluarga meluncur masuk + kilat kamera | p2, p1 | *Restu Keluarga* · "Kebahagiaan yang dikongsi bersama" |
| 21.0–27.5 s | Finale, kelopak bunga lebat | p7 | SELAMAT *Pengantin Baru* · "Semoga bahagia hingga ke Jannah" · BARAKALLAHU LAKUMA |

Lapisan sepanjang video: zarah bokeh emas, kelopak bunga gugur, kilauan cahaya (light leak) pada setiap potongan, vignet hangat.

## Bunyi
`audio.py` mensintesis semua bunyi (tiada bahan berhak cipta), diselaraskan dengan `src/timeline.json`:
- Muzik: piano arpeggio 80 BPM (D–A–Bm–G), pad, bass, melodi loceng, shaker + kick lembut, kemuncak pada finale, penutup G→D.
- SFX: kilauan pembukaan, chime pada setiap tajuk, whoosh + shimmer pada setiap potongan, swish pertukaran foto doa, shutter kamera pada foto keluarga, chime besar pada "Pengantin Baru".

## Fail
- `out/Pengantin_v1.mp4` — muzik + SFX
- `out/Pengantin_v1_sfx_sahaja.mp4` — SFX sahaja, untuk letak muzik sendiri dalam CapCut

## Guna muzik CapCut
Buka `Pengantin_v1_sfx_sahaja.mp4` dalam CapCut → Audio → Muzik, cari contohnya: "wedding piano", "romantic acoustic", "nasyid pengantin", "selamat pengantin baru". Turunkan muzik ~ -6 dB di bawah SFX; potongan babak jatuh pada 3, 6, 12, 15 dan 21 s (sesuai untuk tempo 80 atau 120 BPM).

## Render semula
```
npm i
python3 audio.py
npx remotion render src/index.ts Wedding out/Pengantin_v2.mp4 --browser-executable=<chrome-headless-shell>
```
