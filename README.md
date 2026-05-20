# NeuroScreen

**Non-clinical neurodevelopmental screening for autistic traits and ADHD in adults.**

NeuroScreen runs entirely in the browser — no server, no accounts, no data collection. All processing stays on your device.

---

## What it includes

| Test | What it measures | Threshold |
|------|-----------------|-----------|
| **AQ-10** | Autism Spectrum Quotient — short form (Baron-Cohen 2012) | ≥ 6 / 10 |
| **AQ-50** *(extended)* | Full AQ — original 50-item scale (Baron-Cohen 2001) | ≥ 32 / 50 |
| **ASRS-v1.1 Part A** | Adult ADHD self-report, WHO-validated (Kessler 2005) | ≥ 4 / 6 |
| **ASRS-18** *(extended)* | Full ASRS Parts A+B — Part A screener + 12 dimensional items | ≥ 4 / 6 (A) · ≥ 3 / 12 (B) |
| **RAADS-14** | Ritvo Autism & Asperger Diagnostic Scale, 4 domains (Eriksson 2013) | ≥ 14 / 42 |
| **CAT-Q** *(optional)* | Camouflaging Autistic Traits — masking, assimilation, compensation (Hull 2019) | ≥ 100 / 175 |
| **CPT** | Continuous Performance Test — sustained attention & impulsivity (Rosvold 1956) | objective |
| **Social Attention** | First-saccade paradigm with SVG faces (Klin 2002) | objective |
| **Eye Tracking** *(optional)* | 2-phase webcam test via MediaPipe FaceMesh: blink rate (30 s) + gaze stability on a 3D rotating shape (15 s) | requires HTTPS |

Every test is individually toggleable. AQ-50 and ASRS-18 are extended versions of AQ-10 and ASRS — each activated by a small toggle inside their respective card on the welcome screen. CAT-Q and Eye Tracking are off by default for shorter sessions.

---

## How to run

### Local (no install)

```powershell
# Windows — run the included helper
.\start.ps1
# then open http://localhost:8080
```

The webcam test requires `http://` or `https://` — it will not work on `file://`.

### Deploy to Vercel

1. Fork this repo on GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import your fork
3. Preset: **Other** — no build command, no output directory
4. Deploy

The included `vercel.json` adds security headers (`X-Frame-Options`, `Permissions-Policy: camera=(self)`, etc.).

---

## Webcam eye tracking

The webcam module uses **MediaPipe FaceMesh** (loaded from CDN, ~8 MB) and runs two phases:

1. **Reading phase (30 s)** — a paragraph about mycelium biology is displayed. Blink rate is measured via the Eye Aspect Ratio (EAR) method while you read naturally.
2. **Gaze stability phase (15 s)** — a wireframe icosahedron rotates in 3D. You fixate on the central dot; iris landmark variance is recorded as a proxy for fixation stability.

A webcam preview is available before the test starts.

**Privacy:** the video stream is processed frame-by-frame using WebAssembly — it is never captured, recorded, or transmitted anywhere.

---

## Results

At the end, a combined report shows:

- Scores for each questionnaire with colour-coded chips (Low / Borderline / High)
- CPT hit rate, false-alarm rate, mean RT, and d′
- Social attention eye-region fixation percentage
- Blink rate (bpm), mean EAR, and gaze stability σ
- A combined narrative profile (ASD, ADHD, AuDHD, masked ASD, or typical range)
- Full scientific references with DOIs

The report can be printed via the browser's print dialog.

---

## Scientific references

- Baron-Cohen S, et al. (2001). *J Autism Dev Disord*, 31(1), 5–17.
- Allison C, Auyeung B, Baron-Cohen S. (2012). *J Child Psychol Psychiatry*, 53(4), 377–384.
- Kessler RC, et al. (2005). *Psychol Med*, 35(2), 245–256.
- Eriksson JM, Andersen MJ, Bejerot S. (2013). *Mol Autism*, 4(1), 49.
- Hull L, et al. (2019). *J Autism Dev Disord*, 49(3), 819–833.
- Rosvold HE, et al. (1956). *J Consult Psychol*, 20(5), 343–350.
- Klin A, Jones W, et al. (2002). *Am J Psychiatry*, 159(6), 895–908.
- Jones W, Klin A. (2013). *Nature*, 504, 427–431.
- Soukupová T, Čech J. (2016). *CVWW 2016*.
- Bentivoglio AR, et al. (1997). *Mov Disord*, 12(6), 1028–1034.
- Falck-Ytter T, et al. (2013). *J Autism Dev Disord*, 43(1), 246–253.

---

## Disclaimer

**NeuroScreen is not a diagnostic tool.** Scores are indicative only and do not replace evaluation by a qualified neuropsychiatrist or clinical psychologist. If you have concerns about neurodevelopmental conditions, please seek a professional assessment.

Sensitivity and specificity figures are those reported in the validation studies cited above; real-world performance varies with population and context.

---

## Privacy

- No data is sent to any server
- No cookies, no analytics, no tracking scripts
- Session data is optionally stored in `localStorage` for restore-on-reload only
- The webcam stream never leaves your device

---

## License

MIT
