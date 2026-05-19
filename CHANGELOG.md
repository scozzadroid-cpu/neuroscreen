# Changelog

All notable changes to NeuroScreen are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.7.0] — 2026-05-19

### Fixed

- **CAT-Q subscale scoring**: the previous equal 9/9/7 item split did not match the published subscale structure; corrected to Hull et al. (2019) Table 2 assignment — Assimilation 10 items (max 70), Compensation 8 items (max 56), Masking 7 items (max 49). Subscale labels and displayed maxima updated accordingly.

### Changed

- **Bibliography — collapsible**: the reference list is now hidden by default and revealed with a "▼ Show references / ▼ Mostra riferimenti" toggle button; a count of references is shown in the header. Reduces visual noise on the results page.
- **Results page — section dividers**: when both questionnaire results and objective task results are present, thin uppercase section labels ("Questionnaires" / "Objective tasks") separate the two groups, improving scan-ability.

---

## [1.6.0] — 2026-05-19

### Fixed

- **ASRS — Italian "tu" form**: all 6 Italian ASRS questions were using the formal "Lei" conjugation (`ha`, `deve`, `dimentica`, `si agita`, `si sente`); corrected to informal "tu" forms (`hai`, `devi`, `dimentichi`, `ti agiti`, `ti senti`, `fossi`).
- **Webcam ran twice**: `goToWebcam()` and the "Continue" buttons in `socialDone()` / `cptEnd()` always navigated to the webcam screen even when `S.eye.phase === 'done'`; they now redirect to Results when the webcam test has already been completed or skipped.

### Changed

- **Social attention reading delay**: base increased from 7 000 ms to 10 000 ms (window now 10–13 s) to give more time to genuinely engage with the distractor text.
- **Social attention — "Non ho letto" button**: pressing "↩ Mi sono distratto" no longer restarts the reading phase; instead it sets an `notRead` flag and immediately reveals the face + region buttons so the user can still record where they looked. Conversely, picking a region in the normal flow does not allow retroactively flagging the trial as unread. The `notRead` flag is stored on each response object for downstream analysis.

---

## [1.5.0] — 2026-05-19

### Added

- **CPT — wider late-response window**: the post-stimulus response window extended from 350 ms to 600 ms; clicking within this window now counts as a valid **hit** (incrementing both `c.hits` and `c.lateHits`) rather than a near-miss counted separately. Misses are no longer scored immediately when the stimulus disappears — they are resolved at the start of the next trial (or at `cptEnd()`) only if no late click was received.
- **CPT — no false alarms for post-stim non-target clicks**: clicking after a non-target letter has disappeared is silently ignored and does not increment `c.falseAlarms`; this removes a spurious error source at higher task speeds.

### Changed

- **CPT button label**: "Premi — è X!" / "Press — it's X!" → **"Clicca qui" / "Click here"**.
- **CPT instruction text** (`cptInstr`): rewritten to be more game-like and less clinical.
- **CPT note** (`cptNote`): condensed to a single punchy sentence.
- **Social attention instruction** (`socialInstr`): shorter and more direct.
- **RAADS-14 instruction** (`raadsInstr`): warmer, encourages trusting first instinct.
- **CAT-Q instruction** (`catqInstr`): simplified scale description.
- **Welcome screen short descriptions** (`aq10Short` / `asrsShort` / … / `webcamShort`): rewritten to be punchier and more engaging; academic citation strings removed from these one-liners.
- **Webcam reading text** (`WEBCAM_TEXT`): replaced dry mycelium biology paragraph with an engaging piece about attention, multitasking and the "task switching" cognitive cost — thematically relevant to the app.
- **Social attention reading texts** (`READING_TEXTS`): all six passages rewritten as accessible brain-science curiosities about faces (pareidolia, prosopagnosia, the Thatcher effect, Ekman's universal emotions, etc.) rather than academic summaries; maintains thematic link to the face-recognition paradigm.
- **Restore banner background** (`#restore-banner`): changed from `rgba(124,107,236,.12)` (nearly transparent, invisible on dark background) to `var(--surf2)` — now clearly visible.

---

## [1.4.0] — 2026-05-19

### Added

- **Social test — "Mi sono distratto" button**: during the reading phase the user can press "↩ Mi sono distratto / I got distracted — retry" to cancel the current countdown and restart the same trial from scratch; the in-flight `setTimeout` is cancelled and the reading bar resets, preserving the validity of the first-saccade measurement.
- **Social test — diverse SVG faces**: `makeFaceSVG()` completely redesigned with detailed eye anatomy (sclera, iris, pupil, upper-eyelid line, highlight), arched eyebrows, ear detail, nose bridge with nostrils, and expression-specific mouth shapes including a closed oval for "surprised"; six skin-tone/hair palettes (`_FACE_PALETTES`) assigned per trial via `skin` index in `FACE_CONFIGS` — fair, light, medium, tan, dark, and fair-grey-hair.
- **Persistent restart button** `↺` in the header (always visible, styled with danger hover); replaces the need to reach the results screen to restart.
- **Webcam required before social attention test**: if both webcam and social attention tests are enabled and webcam has not yet been completed (nor skipped), the app now redirects to the webcam screen first — from `cptEnd()` (after CPT) and from `renderTasksScreen()` (social-only path). After webcam completes or is skipped, the social test starts automatically (`S._socialPending` flag).
- **`hasAnyResult()`** helper in `nav.js` — returns `true` if at least one questionnaire, CPT, social, or webcam test has been completed.

### Changed

- **Social reading delay**: `3000 + rand(2000)` ms → `7000 + rand(3000)` ms (7–10 s); gives users enough time to genuinely engage with the distractor text before the face appears.
- **"Skip → Go to results" button on webcam screen** is now hidden when no test result exists yet (`hasAnyResult()` false) and the webcam is not in a pending-social flow; prevents navigating to an empty results page.

---

## [1.3.0] — 2026-05-19

### Added

- **CPT speed ramp**: ISI now starts at 1600 ms (slow, comfortable) and linearly decreases to 350 ms (fast) over the 60 s test; stimulus-on time stays constant at 400 ms. Stimulus count estimated from the average ISI (~43 trials). Progress bar continues to reflect elapsed time.
- **`profileNoQuestionnaires` narrative**: when no questionnaire was completed, the profile box shows a clear message instead of a misleading "typical range" assessment.

### Fixed

- **Results show only completed tests**: score blocks (AQ-10, ASRS, RAADS-14, CAT-Q) and their interpretation cards are now hidden when the corresponding test was disabled or skipped. Profile text, masking note, and score-bar animation all respect `S.tests.*` flags.
- **Webcam results hidden when bpm = 0**: check changed from falsy `S.eye.bpm ?` to `S.eye.phase === 'done'`; the webcam section now shows even if no blinks were recorded during the test.
- **CPT button label not intuitive**: "TAP / SPAZIO" → "Premi — è X!" / "Press — it's X!" — label now says *when* to press, not just *how*.

### Changed

- `CPT_ISI = 750` removed; replaced by `CPT_ISI_START = 1600` and `CPT_ISI_END = 350`.

---

## [1.2.0] — 2026-05-19

### Added

**Webcam — EAR calibration phase**
- New **Phase 0 (calibration)** inserted before the reading phase: FaceMesh starts immediately and collects EAR samples; button is enabled once the face is stable (≥ 25 frames)
- User is instructed to look normally, close their eyes once, then press the button; the personalised EAR threshold is computed as the midpoint between their minimum EAR (eyes closed) and the 85th-percentile EAR (eyes open baseline)
- Falls back to the default threshold (0.21) if the open/closed spread is < 0.04 (e.g. poor lighting or very small face)
- Setup screen description updated from two phases to three phases (calibration + reading + gaze)
- `NS.camCalibDone` exposed on the public namespace
- New translation keys: `webcamCalibTitle`, `webcamCalibInstr`, `webcamCalibBtn`, `webcamCalibWaiting`, `webcamCalibReady`, `webcamPhase3Desc`
- New state fields on `S.eye`: `readStart`, `_calibSamples`, `_earThreshold`
- BPM now computed from `readStart` (start of reading phase) instead of camera-start, excluding calibration time

**CPT — late-hit detection and wider response window**
- `CPT_STIM_ON` increased from 250 ms to 400 ms — letters stay visible longer, giving more time to react
- After a missed target, a 350 ms **late window** opens during the ISI; pressing during this window counts as a `lateHit` instead of a false alarm
- Late hits shown in amber in the inline CPT result and in the final report under the label "Quasi giusti / Near misses"
- `#cpt-letter.late-hit` CSS class added (amber border + background) for visual feedback
- New state field `S.cpt.lateHits`; new translation key `cptLateHits`

### Changed

- `webcamPhasesTitle` updated to "tre fasi / three phases"

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
