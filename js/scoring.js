'use strict';
// ════════════════════════════════════════════════════════
//  SCORING — validated scoring algorithms
// ════════════════════════════════════════════════════════

function calcAQ10() {
  return AQ10_Q.it.reduce((sum, _, i) => {
    const ans = S.aq10.answers[i];
    if (ans === null) return sum;
    const scored = AQ10_SCORE_IF_AGREE[i] ? (ans <= 1 ? 1 : 0) : (ans >= 2 ? 1 : 0);
    return sum + scored;
  }, 0);
}

function calcASRS() {
  return ASRS_Q.it.reduce((sum, _, i) => {
    const ans = S.asrs.answers[i];
    if (ans === null) return sum;
    return sum + (ans >= ASRS_THRESH[i] ? 1 : 0);
  }, 0);
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
