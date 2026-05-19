# Changelog

All notable changes to NeuroScreen are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.1.0] — 2026-05-19

### Added

**Webcam eye tracking — two-phase test**
- New **setup screen** before the test: privacy notice ("webcam never recorded, processing is 100 % local"), three setup tips (clean camera, good lighting, 50 cm distance), and a description of the two phases
- **Webcam preview**: live video feed to check framing and lighting before the test starts; back / start buttons
- **Phase 1 — Reading (30 s)**: mycelium biology text displayed while blink rate is measured via Eye Aspect Ratio (EAR); purple EAR landmark dots overlaid on the live feed; animated progress bar
- **Phase 2 — Gaze stability (15 s)**: wireframe icosahedron rendered in 3D (canvas, perspective projection) rotates continuously; user fixates on a central dot; iris landmarks 468–477 (MediaPipe refined) tracked each frame; gaze positions normalised by face width and accumulated in `S.eye.gazePositions`
- Gaze stability σ (combined x + y standard deviation of normalised iris positions) stored as `S.eye.gazeStdev` and shown in the final report with a Stable / Moderate / Unstable interpretation
- Live metric row expands from 3 to 4 columns when the gaze-detection card becomes available in Phase 2
- `vercel.json` for zero-config Vercel deployment with security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy: camera=(self)`)

**Other**
- `WEBCAM_TEXT` constant in `data.js` — bilingual (IT/EN) mycelium paragraph for Phase 1
- `NS.camShowPreview` and `NS.camStopPreview` exposed on the public namespace
- New translation keys: `webcamPrivacy`, `webcamSetupTitle/Clean/Light/Dist`, `webcamPhasesTitle`, `webcamPhase1/2Desc`, `webcamPreviewBtn/Title/Hint`, `webcamStartTest`, `webcamReadLabel`, `webcamShapeLabel`, `webcamActiveRead`, `webcamActivePursuit`, `gazeStability`, `gazeStabLabel`, `gazeStab_ok/mod/low`

### Fixed

- **Welcome screen blank on first load** — `updateWelcomeScreen()` was never called at startup; test-selection grid was invisible until the user clicked a language button
- **Back button disabled at Q1 (AQ-10 and ASRS)** — `prev.disabled = (i === 0)` blocked back-navigation to the previous screen; changed to `prev.disabled = false` (RAADS-14 and CAT-Q were already correct)
- **`profileText()` wrong narrative for masked ASD** — `profileAsdMasked` (which says "AQ-10 low…") was also triggered when AQ-10 was high but CAT-Q was elevated; reordered conditions so `profileAsdMasked` only fires when both AQ-10 and RAADS-14 are below threshold
- **Social attention: `socialEyePct` showed wrong face count** — passed `FACE_CONFIGS.length` (constant 6) instead of `seenFaces.length`; if any trial was answered "looking elsewhere" the denominator was wrong
- **Dynamic button label after CPT / social test** — "Eye Tracking (opzionale)" button was shown even when the webcam test was disabled; label now reads "Continua → Eye Tracking (opzionale)" or "Continua → Risultati" depending on `S.tests.webcam`

### Changed

- `webcamTitle`: "Analisi Blink Rate via Webcam" → "Analisi Blink Rate e Sguardo via Webcam"
- `webcamMeta` / `webcamShort`: updated to reflect 45-second two-phase test
- `webcamStart`: label changed from "Avvia webcam (30s)" to "Inizia il test →"
- `S.eye` state extended with `phase`, `pursuitStart`, `gazePositions`, `gazeStdev`

---

## [1.0.0] — 2026-05-17

### Added

- Initial release: AQ-10, ASRS-v1.1 Part A, RAADS-14, CAT-Q (optional), CPT task, Social Attention task, Webcam blink-rate test
- Bilingual UI (IT / EN) with live language switching
- Score bars, colour-coded chips, combined profile narrative
- Session persistence via `localStorage` with restore banner
- `start.ps1` local HTTP server helper for Windows
- Scientific references block with DOIs
- Print-friendly report
