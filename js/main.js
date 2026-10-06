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
      case 'cati':    renderCATI();        break;
      case 'catq':    renderCATQ();        break;
      case 'adexi':
      case 'spq':
      case 'mq':      renderLikert(S.currentScreen); break;
      case 'tasks':   renderTasksScreen(); break;
      case 'webcam':
        if (!S.eye.running) {
          renderWebcamScreen();
          if (S.eye.phase === 'done') {
            const btns = document.getElementById('webcam-btns');
            if (btns) btns.innerHTML = `<button class="btn btn-primary" onclick="NS.goToResults()">${t('webcamResults')}</button>`;
          }
        }
        break;
      case 'results': renderResults();     break;
    }
  },

  start() {
    ALL_TEST_IDS.forEach(id => {
      const el = document.getElementById('sel-' + id);
      if (el) S.tests[id] = el.checked;
    });
    S.extAq   = document.getElementById('sel-ext-aq')?.checked   ?? false;
    S.extAsrs = document.getElementById('sel-ext-asrs')?.checked ?? false;
    S.socialGaze = document.getElementById('sel-ext-gaze')?.checked ?? false;
    if (S.tests.aq10) {
      const n = S.extAq ? AQ50_MAX : 10;
      S.aq10.answers = Array(n).fill(null);
      S.aq10._order  = _shuffleOrder(n);
    }
    if (S.tests.asrs) {
      const n = S.extAsrs ? 18 : 6;
      S.asrs.answers = Array(n).fill(null);
      S.asrs._order  = _shuffleOrder(n);
    }
    if (S.tests.raads14) S.raads14._order = _shuffleOrder(14);
    if (S.tests.cati)    S.cati._order    = _shuffleOrder(42);
    if (S.tests.catq)    S.catq._order    = _shuffleOrder(25);
    LIKERT_IDS.forEach(id => { if (S.tests[id]) S[id]._order = _shuffleOrder(S[id].answers.length); });
    S.guide = null;
    updateStepLabels();
    const first = nextScreen('welcome');
    showScreen(first);
    renderScreen(first);
  },

  updateDuration() { _updateDurationDisplay(); },

  // ── Initial guide ──────────────────────────────────────
  guideOpen:   guideOpen,
  guideClose:  guideClose,
  guideAnswer: guideAnswer,
  guideBack:   guideBack,
  guideApply:  guideApply,

  // ── ADEXI / SPQ-35 / MQ (shared Likert screens) ────────
  lkPick(id, val) {
    const qi = _lkCurrent(id);
    S[id].answers[qi] = val;
    if (id === 'spq' && qi === SPQ_IT_NEGATED) S.spq.lastItemLang = LANG;
    renderLikert(id);
  },
  lkPrev(id) {
    if (S[id].idx > 0) { S[id].idx--; renderLikert(id); }
    else { const p = prevScreen(id); showScreen(p); renderScreen(p); }
  },
  lkNext(id) {
    if (S[id].answers[_lkCurrent(id)] === null) return;
    if (S[id].idx < S[id].answers.length - 1) { S[id].idx++; renderLikert(id); }
    else { saveSession(); const n = nextScreen(id); showScreen(n); renderScreen(n); }
  },

  // ── AQ-10 ──────────────────────────────────────────────
  aq10Prev() {
    if (S.aq10.idx > 0) { S.aq10.idx--; renderAQ10(); }
    else { showScreen('welcome'); updateWelcomeScreen(); }
  },
  aq10Next() {
    const qi = S.aq10._order ? S.aq10._order[S.aq10.idx] : S.aq10.idx;
    if (S.aq10.answers[qi] === null) return;
    if (S.aq10.idx < S.aq10.answers.length - 1) { S.aq10.idx++; renderAQ10(); }
    else { saveSession(); const n = nextScreen('aq10'); showScreen(n); renderScreen(n); }
  },

  // ── ASRS ───────────────────────────────────────────────
  asrsPrev() {
    if (S.asrs.idx > 0) { S.asrs.idx--; renderASRS(); }
    else { const p = prevScreen('asrs'); showScreen(p); renderScreen(p); }
  },
  asrsNext() {
    const qi = S.asrs._order ? S.asrs._order[S.asrs.idx] : S.asrs.idx;
    if (S.asrs.answers[qi] === null) return;
    if (S.asrs.idx < S.asrs.answers.length - 1) { S.asrs.idx++; renderASRS(); }
    else { saveSession(); const n = nextScreen('asrs'); showScreen(n); renderScreen(n); }
  },

  // ── RAADS-14 ───────────────────────────────────────────
  raads14Pick(val) {
    const qi = S.raads14._order ? S.raads14._order[S.raads14.idx] : S.raads14.idx;
    S.raads14.answers[qi] = val;
    renderRAA14();
  },
  raads14Prev() {
    if (S.raads14.idx > 0) { S.raads14.idx--; renderRAA14(); }
    else { const p = prevScreen('raads14'); showScreen(p); renderScreen(p); }
  },
  raads14Next() {
    const qi = S.raads14._order ? S.raads14._order[S.raads14.idx] : S.raads14.idx;
    if (S.raads14.answers[qi] === null) return;
    if (S.raads14.idx < RAADS14_Q.it.length - 1) { S.raads14.idx++; renderRAA14(); }
    else { saveSession(); const n = nextScreen('raads14'); showScreen(n); renderScreen(n); }
  },

  // ── CATI ───────────────────────────────────────────────
  catiPick(val) {
    const qi = S.cati._order ? S.cati._order[S.cati.idx] : S.cati.idx;
    S.cati.answers[qi] = val;
    renderCATI();
  },
  catiPrev() {
    if (S.cati.idx > 0) { S.cati.idx--; renderCATI(); }
    else { const p = prevScreen('cati'); showScreen(p); renderScreen(p); }
  },
  catiNext() {
    const qi = S.cati._order ? S.cati._order[S.cati.idx] : S.cati.idx;
    if (S.cati.answers[qi] === null) return;
    if (S.cati.idx < CATI_Q.it.length - 1) { S.cati.idx++; renderCATI(); }
    else { saveSession(); const n = nextScreen('cati'); showScreen(n); renderScreen(n); }
  },

  // ── CAT-Q ──────────────────────────────────────────────
  catqPick(val) {
    const qi = S.catq._order ? S.catq._order[S.catq.idx] : S.catq.idx;
    S.catq.answers[qi] = val;
    renderCATQ();
  },
  catqPrev() {
    if (S.catq.idx > 0) { S.catq.idx--; renderCATQ(); }
    else { const p = prevScreen('catq'); showScreen(p); renderScreen(p); }
  },
  catqNext() {
    const qi = S.catq._order ? S.catq._order[S.catq.idx] : S.catq.idx;
    if (S.catq.answers[qi] === null) return;
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
  camFinishRead()  { if (S.eye.phase === 'reading') _startPursuitPhase(S.eye); },
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
    gazeStop();
    S.extAq = false;
    S.extAsrs = false;
    S.socialGaze = false;
    S.aq10    = { idx: 0, answers: Array(10).fill(null), _order: null };
    S.asrs    = { idx: 0, answers: Array(6).fill(null),  _order: null };
    S.raads14 = { idx: 0, answers: Array(14).fill(null), _order: null };
    S.catq    = { idx: 0, answers: Array(25).fill(null), skipped: false, _order: null };
    S.cati    = { idx: 0, answers: Array(42).fill(null), _order: null };
    S.adexi   = { idx: 0, answers: Array(14).fill(null), _order: null };
    S.spq     = { idx: 0, answers: Array(35).fill(null), _order: null, lastItemLang: null };
    S.mq      = { idx: 0, answers: Array(47).fill(null), _order: null };
    S.guide   = null;
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
