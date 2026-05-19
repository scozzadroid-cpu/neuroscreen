'use strict';
// ════════════════════════════════════════════════════════
//  STATE — single mutable application state object
// ════════════════════════════════════════════════════════

const S = {
  aq10: { idx: 0, answers: Array(10).fill(null) },
  asrs: { idx: 0, answers: Array(6).fill(null)  },

  cpt: {
    running: false, stimList: [], stimIdx: 0,
    hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0,
    reactionTimes: [], stimOnAt: null, awaitingResponse: false,
    timerStart: null,
  },

  raads14: { idx: 0, answers: Array(14).fill(null) },
  catq:    { idx: 0, answers: Array(25).fill(null), skipped: false },

  social: { idx: 0, responses: [] },

  eye: {
    running: false, blinkCount: 0, trackStart: null, lastEAR: 1,
    inBlink: false, faceMesh: null, camera: null, initialized: false,
    duration: 0, bpm: 0,
    phase: 'idle', pursuitStart: null, gazePositions: [], gazeStdev: null,
  },

  webcamSkipped: false,
  socialDone:    false,
  cptDone:       false,
  currentScreen: 'welcome',
  tests: { aq10: true, asrs: true, raads14: true, catq: true, cpt: true, social: true, webcam: true },
};
