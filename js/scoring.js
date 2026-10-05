'use strict';
// ════════════════════════════════════════════════════════
//  SCORING — validated scoring algorithms
// ════════════════════════════════════════════════════════

// Accessors — return the active question set based on extended mode
function _aqQ()      { return S.extAq   ? AQ50_Q            : AQ10_Q; }
function _aqScore()  { return S.extAq   ? AQ50_SCORE_IF_AGREE : AQ10_SCORE_IF_AGREE; }
function _asrsQ()    { return S.extAsrs ? ASRS_FULL_Q        : ASRS_Q; }
function _asrsT()    { return S.extAsrs ? ASRS_FULL_THRESH   : ASRS_THRESH; }

function calcAQ10() {
  const q = _aqQ();
  const key = _aqScore();
  return q.it.reduce((sum, _, i) => {
    const ans = S.aq10.answers[i];
    if (ans === null) return sum;
    return sum + (key[i] ? (ans <= 1 ? 1 : 0) : (ans >= 2 ? 1 : 0));
  }, 0);
}

// Always returns Part A score (items 0-5, clinically validated threshold ≥4).
function calcASRS() {
  return ASRS_THRESH.reduce((sum, t, i) => {
    const ans = S.asrs.answers[i];
    if (ans === null) return sum;
    return sum + (ans >= t ? 1 : 0);
  }, 0);
}

// Extended-only: Part B positive count (items 6-17, threshold ≥3 each).
function calcASRSPartB() {
  if (!S.extAsrs) return null;
  return ASRS_FULL_THRESH.slice(6).reduce((sum, t, i) => {
    const ans = S.asrs.answers[6 + i];
    if (ans === null) return sum;
    return sum + (ans >= t ? 1 : 0);
  }, 0);
}

// Extended-only: dimensional total (sum of all 18 answers, 0-4 each, range 0-72).
function calcASRSTotal() {
  if (!S.extAsrs) return null;
  return S.asrs.answers.reduce((sum, a) => sum + (a !== null ? a : 0), 0);
}

// RAADS-14: sum of 14 responses (0-3 each), item 6 reverse-scored. Range 0-42. Threshold >=14.
function _raadsItem(i) {
  const a = S.raads14.answers[i];
  if (a === null || a === undefined) return 0;
  return RAADS14_REVERSED.includes(i) ? 3 - a : a;
}

function calcRAA14() {
  return RAADS14_Q.it.reduce((sum, _, i) => sum + _raadsItem(i), 0);
}

function calcRAADSSubs() {
  const sum = idxs => idxs.reduce((acc, i) => acc + _raadsItem(i), 0);
  return {
    mentalizing:   sum(RAADS14_DOMAINS.mentalizing),
    socialAnxiety: sum(RAADS14_DOMAINS.socialAnxiety),
    sensory:       sum(RAADS14_DOMAINS.sensory),
  };
}

// CAT-Q: sum of 25 responses (1-7 each). Range 25-175. No validated cut-off; 100 is an informal reference.
// Returns null if skipped or incomplete.
function calcCATQ() {
  if (S.catq.skipped) return null;
  if (!S.catq.answers.every(a => a !== null)) return null;
  return S.catq.answers.reduce((sum, a) => sum + a, 0);
}

// CAT-Q subscale sums. This app's items are localized paraphrases of Hull et al.
// (2019), not the verbatim English instrument, so item-for-item correspondence to
// the published Table 2 cannot be assumed; items below are assigned to the
// subscale their content matches, keeping the published item counts per subscale:
// Compensation (9 items, max 63): learned scripts / rehearsed strategies
// Masking       (8 items, max 56): hiding internal experience / "performing"
// Assimilation  (8 items, max 56): imitating or fitting in with others
function calcCATQSubs() {
  const a = S.catq.answers;
  const sum = idxs => idxs.reduce((s, i) => s + (a[i] || 0), 0);
  return {
    compensation: sum([9, 11, 16, 17, 18, 19, 20, 22, 23]),
    masking:      sum([1, 2, 3, 4, 5, 6, 15, 21]),
    assimilation: sum([0, 7, 8, 10, 12, 13, 14, 24]),
  };
}

// Signal Detection Theory d-prime; extreme hit/FA rates are clamped to [0.01, 0.99]
// Green & Swets (1966); Macmillan & Creelman (2005)
function calcDprime(hits, misses, fas, crs) {
  const totalTgt = hits + misses;
  const totalDis = fas + crs;
  if (totalTgt === 0 || totalDis === 0) return null;
  const hr = Math.max(0.01, Math.min(0.99, hits / totalTgt));
  const fr = Math.max(0.01, Math.min(0.99, fas  / totalDis));
  return (zNorm(hr) - zNorm(fr)).toFixed(2);
}

// Inverse normal CDF approximation — Abramowitz & Stegun (1964) formula 26.2.23
function zNorm(p) {
  const c  = [2.515517, 0.802853, 0.010328];
  const d  = [1.432788, 0.189269, 0.001308];
  const t2 = Math.sqrt(-2 * Math.log(p <= 0.5 ? p : 1 - p));
  const z  = t2 - (c[0] + c[1]*t2 + c[2]*t2*t2) / (1 + d[0]*t2 + d[1]*t2*t2 + d[2]*t2*t2*t2);
  return p <= 0.5 ? -z : z;
}

// ASRS Part A continuous score: sum of items 0-5 (0-4 each). Range 0-24, threshold >=14.
function calcASRSContinuous() {
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    const a = S.asrs.answers[i];
    if (a === null || a === undefined) return null;
    sum += a;
  }
  return sum;
}

// CATI: responses stored as 1-5, reverse-scored items as 6 - value. Null if incomplete.
function _catiItem(i) {
  const a = S.cati.answers[i];
  return CATI_REVERSED.includes(i) ? 6 - a : a;
}

function calcCATI() {
  if (!S.cati.answers.every(a => a !== null)) return null;
  return S.cati.answers.reduce((sum, _, i) => sum + _catiItem(i), 0);
}

function calcCATISubs() {
  if (!S.cati.answers.every(a => a !== null)) return null;
  const out = {};
  Object.keys(CATI_SUBSCALES).forEach(k => {
    out[k] = CATI_SUBSCALES[k].reduce((sum, i) => sum + _catiItem(i), 0);
  });
  return out;
}
