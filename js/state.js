'use strict';
// ════════════════════════════════════════════════════════
//  STATE — single mutable application state object
// ════════════════════════════════════════════════════════

function _shuffleOrder(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const S = {
  aq10: { idx: 0, answers: Array(10).fill(null), _order: null },
  asrs: { idx: 0, answers: Array(6).fill(null),  _order: null },

  cpt: {
    running: false, stimList: [], stimIdx: 0,
    hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0, lateHits: 0,
    reactionTimes: [], stimOnAt: null, awaitingResponse: false,
    timerStart: null, _lastWasMissedTarget: false, _lateWindowEnd: 0,
  },

  raads14: { idx: 0, answers: Array(14).fill(null), _order: null },
  catq:    { idx: 0, answers: Array(25).fill(null), skipped: false, _order: null },
  cati:    { idx: 0, answers: Array(42).fill(null), _order: null },
  adexi:   { idx: 0, answers: Array(14).fill(null), _order: null },
  spq:     { idx: 0, answers: Array(35).fill(null), _order: null, lastItemLang: null },
  mq:      { idx: 0, answers: Array(47).fill(null), _order: null },
  guide:   null,

  social: { idx: 0, responses: [] },

  eye: {
    running: false, blinkCount: 0, trackStart: null, lastEAR: 1,
    inBlink: false, faceMesh: null, camera: null, initialized: false,
    duration: 0, bpm: 0,
    phase: 'idle', pursuitStart: null, gazePositions: [], gazeStdev: null,
    readStart: null, _calibSamples: [], _earThreshold: 0.21,
  },

  webcamSkipped:  false,
  socialDone:     false,
  cptDone:        false,
  _socialPending: false,
  currentScreen:  'welcome',
  // Defaults: validated screeners plus CATI; trait measures and experimental tasks are opt-in
  tests: { aq10: true, asrs: true, adexi: false, raads14: true, cati: true, catq: false, spq: false, mq: false, cpt: false, social: false, webcam: false },
  extAq: false, extAsrs: false, socialGaze: false,
};
