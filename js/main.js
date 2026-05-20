'use strict';
// ════════════════════════════════════════════════════════
//  PUBLIC API — window.NS exposes all user-facing actions
// ════════════════════════════════════════════════════════

window.NS = {
  setLang(lang) {
    if (lang !== 'it' && lang !== 'en') return;
    LANG = lang;
    try { localStorage.setItem('ns_pref_lang', lang); } catch(e) {}
    document.getElementById('html-root').lang = lang;
    document.getElementById('lang-it').classList.toggle('active', lang === 'it');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    updateStepLabels();
    updateWelcomeScreen();
    switch (S.currentScreen) {
      case 'aq10':    renderAQ10();        break;
      case 'asrs':    renderASRS();        break;
      case 'raads14': renderRAA14();       break;
      case 'catq':    renderCATQ();        break;
      case 'tasks':   renderTasksScreen(); break;
      case 'webcam':  renderWebcamScreen();break;
      case 'results': renderResults();     break;
    }
  },

  start() {
    ['aq10', 'asrs', 'raads14', 'catq', 'cpt', 'social', 'webcam'].forEach(id => {
      const el = document.getElementById('sel-' + id);
      if (el) S.tests[id] = el.checked;
    });
    updateStepLabels();
    const first = nextScreen('welcome');
    showScreen(first);
    renderScreen(first);
  },

  updateDuration() { _updateDurationDisplay(); },

  // ── AQ-10 ──────────────────────────────────────────────
  aq10Prev() {
    if (S.aq10.idx > 0) { S.aq10.idx--; renderAQ10(); }
    else { showScreen('welcome'); updateWelcomeScreen(); }
  },
  aq10Next() {
    if (S.aq10.answers[S.aq10.idx] === null) return;
    if (S.aq10.idx < 9) { S.aq10.idx++; renderAQ10(); }
    else { saveSession(); const n = nextScreen('aq10'); showScreen(n); renderScreen(n); }
  },

  // ── ASRS ───────────────────────────────────────────────
  asrsPrev() {
    if (S.asrs.idx > 0) { S.asrs.idx--; renderASRS(); }
    else { const p = prevScreen('asrs'); showScreen(p); renderScreen(p); }
  },
  asrsNext() {
    if (S.asrs.answers[S.asrs.idx] === null) return;
    if (S.asrs.idx < 5) { S.asrs.idx++; renderASRS(); }
    else { saveSession(); const n = nextScreen('asrs'); showScreen(n); renderScreen(n); }
  },

  // ── RAADS-14 ───────────────────────────────────────────
  raads14Pick(val) { S.raads14.answers[S.raads14.idx] = val; renderRAA14(); },
  raads14Prev() {
    if (S.raads14.idx > 0) { S.raads14.idx--; renderRAA14(); }
    else { const p = prevScreen('raads14'); showScreen(p); renderScreen(p); }
  },
  raads14Next() {
    if (S.raads14.answers[S.raads14.idx] === null) return;
    if (S.raads14.idx < RAADS14_Q.it.length - 1) { S.raads14.idx++; renderRAA14(); }
    else { saveSession(); const n = nextScreen('raads14'); showScreen(n); renderScreen(n); }
  },

  // ── CAT-Q ──────────────────────────────────────────────
  catqPick(val) { S.catq.answers[S.catq.idx] = val; renderCATQ(); },
  catqPrev() {
    if (S.catq.idx > 0) { S.catq.idx--; renderCATQ(); }
    else { const p = prevScreen('catq'); showScreen(p); renderScreen(p); }
  },
  catqNext() {
    if (S.catq.answers[S.catq.idx] === null) return;
    if (S.catq.idx < CATQ_Q.it.length - 1) { S.catq.idx++; renderCATQ(); }
    else { saveSession(); const n = nextScreen('catq'); showScreen(n); renderScreen(n); }
  },
  skipCatq() {
    S.catq.skipped = true;
    saveSession();
    const n = nextScreen('catq'); showScreen(n); renderScreen(n);
  },

  // ── CPT / Social ───────────────────────────────────────
  cptStart:       cptStart,
  cptRespond:     cptRespond,
  socialPick:     socialPick,
  socialDistracted: socialDistracted,

  // ── Webcam ─────────────────────────────────────────────
  goToWebcam() {
    if (S.tests.webcam && S.eye.phase !== 'done' && !S.webcamSkipped) {
      showScreen('webcam');
      renderWebcamScreen();
    } else {
      this.goToResults();
    }
  },
  camShowPreview:  camShowPreview,
  camStopPreview:  camStopPreview,
  camStart:        camStart,
  camCalibDone:    camCalibDone,
  skipWebcam() {
    S.webcamSkipped = true;
    if (S._socialPending) {
      S._socialPending = false;
      showScreen('tasks');
      const socialCard = document.getElementById('social-card');
      if (socialCard) socialCard.style.display = '';
      startSocialTest();
    } else {
      this.goToResults();
    }
  },

  // ── Results ────────────────────────────────────────────
  goToResults() { saveSession(); showScreen('results'); renderResults(); },

  // ── Restart ────────────────────────────────────────────
  restart() {
    clearSession();
    try {
      if (S.eye.camera)   S.eye.camera.stop();
      if (S.eye.faceMesh) S.eye.faceMesh.close();
    } catch(e) {}
    S.aq10    = { idx: 0, answers: Array(10).fill(null) };
    S.asrs    = { idx: 0, answers: Array(6).fill(null)  };
    S.raads14 = { idx: 0, answers: Array(14).fill(null) };
    S.catq    = { idx: 0, answers: Array(25).fill(null), skipped: false };
    S.cpt     = {
      running: false, stimList: [], stimIdx: 0,
      hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0, lateHits: 0,
      reactionTimes: [], stimOnAt: null, awaitingResponse: false,
      timerStart: null, _lastWasMissedTarget: false, _lateWindowEnd: 0,
    };
    S.social        = { idx: 0, responses: [] };
    S.eye           = {
      running: false, blinkCount: 0, trackStart: null, lastEAR: 1,
      inBlink: false, faceMesh: null, camera: null, initialized: false,
      duration: 0, bpm: 0,
      phase: 'idle', pursuitStart: null, gazePositions: [], gazeStdev: null,
      readStart: null, _calibSamples: [], _earThreshold: 0.21,
    };
    S.webcamSkipped  = false;
    S.cptDone        = false;
    S.socialDone     = false;
    S._socialPending = false;
    showScreen('welcome');
    updateWelcomeScreen();
  },
};

// Sync UI to detected/saved language
document.getElementById('html-root').lang = LANG;
document.getElementById('lang-it').classList.toggle('active', LANG === 'it');
document.getElementById('lang-en').classList.toggle('active', LANG === 'en');
updateStepLabels();
updateWelcomeScreen();
initStorageBanner();
