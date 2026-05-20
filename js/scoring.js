'use strict';
// ════════════════════════════════════════════════════════
//  SCORING — validated scoring algorithms
// ════════════════════════════════════════════════════════

// Accessors — return the active question set based on extended mode
function _aqQ()      { return S.extended ? AQ50_Q   : AQ10_Q; }
function _aqScore()  { return S.extended ? AQ50_SCORE_IF_AGREE : AQ10_SCORE_IF_AGREE; }
function _asrsQ()    { return S.extended ? ASRS_FULL_Q : ASRS_Q; }
function _asrsT()    { return S.extended ? ASRS_FULL_THRESH    : ASRS_THRESH; }

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
  if (!S.extended) return null;
  return ASRS_FULL_THRESH.slice(6).reduce((sum, t, i) => {
    const ans = S.asrs.answers[6 + i];
    if (ans === null) return sum;
    return sum + (ans >= t ? 1 : 0);
  }, 0);
}

// Extended-only: dimensional total (sum of all 18 answers, 0-4 each, range 0-72).
function calcASRSTotal() {
  if (!S.extended) return null;
  return S.asrs.answers.reduce((sum, a) => sum + (a !== null ? a : 0), 0);
}

// RAADS-14: sum of all 14 responses (0-3 each). Range 0-42. Threshold ≥14.
function calcRAA14() {
  return RAADS14_Q.it.reduce((sum, _, i) => {
    const a = S.raads14.answers[i];
    return sum + (a !== null ? a : 0);
  }, 0);
}

// CAT-Q: sum of 25 responses (1-7 each). Range 25-175. Threshold ≥100.
// Returns null if skipped or incomplete.
function calcCATQ() {
  if (S.catq.skipped) return null;
  if (!S.catq.answers.every(a => a !== null)) return null;
  return S.catq.answers.reduce((sum, a) => sum + a, 0);
}

// CAT-Q subscale sums — Hull et al. (2019) Table 2 item assignment:
// Assimilation (10 items, max 70): fitting in / imitating others
// Compensation  (8 items, max 56): learned scripts and strategies
// Masking       (7 items, max 49): hiding internal experiences / performing
function calcCATQSubs() {
  const a = S.catq.answers;
  const sum = idxs => idxs.reduce((s, i) => s + (a[i] || 0), 0);
  return {
    assimilation: sum([0, 1, 2, 7, 9, 10, 12, 13, 14, 24]),
    compensation: sum([8, 16, 17, 18, 19, 20, 22, 23]),
    masking:      sum([3, 4, 5, 6, 11, 15, 21]),
  };
}

// Signal Detection Theory d-prime with log-linear correction for extreme hit/FA rates
// Green & Swets (1966); Macmillan & Creelman (2005)
function calcDprime(hits, misses, fas, crs) {
  const totalTgt = hits + misses;
  const totalDis = fas + crs;
  if (totalTgt === 0 || totalDis === 0) return null;
  const hr = Math.max(0.01, Math.min(0.99, hits / totalTgt));
  const fr = Math.max(0.01, Math.min(0.99, fas  / totalDis));
  return (zNorm(hr) - zNorm(fr)).toFixed(2);
}

// Inverse normal CDF approximation — Abramowitz & Stegun (1964) formula 26.2.17
function zNorm(p) {
  const c  = [2.515517, 0.802853, 0.010328];
  const d  = [1.432788, 0.189269, 0.001308];
  const t2 = Math.sqrt(-2 * Math.log(p <= 0.5 ? p : 1 - p));
  const z  = t2 - (c[0] + c[1]*t2 + c[2]*t2*t2) / (1 + d[0]*t2 + d[1]*t2*t2 + d[2]*t2*t2*t2);
  return p <= 0.5 ? -z : z;
}
