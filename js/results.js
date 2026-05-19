'use strict';
// ════════════════════════════════════════════════════════
//  RESULTS — renders the final screening report
// ════════════════════════════════════════════════════════

function renderResults() {
  const aq10Score   = calcAQ10();
  const asrsScore   = calcASRS();
  const raads14Score = calcRAA14();
  const catqTotal   = calcCATQ();
  const catqSubs    = catqTotal !== null ? calcCATQSubs() : null;

  const c        = S.cpt;
  const nTargets = c.stimList.length > 0 ? c.stimList.filter(s => s.isTarget).length : 0;
  const nDist    = c.stimList.length - nTargets;
  const hitRate  = nTargets > 0 ? (c.hits / nTargets * 100).toFixed(0) : '—';
  const faRate   = nDist   > 0 ? (c.falseAlarms / nDist * 100).toFixed(0) : '—';
  const dprime   = c.stimList.length > 0
    ? calcDprime(c.hits, c.misses, c.falseAlarms, c.correctRejects) : null;
  const rtAvg    = c.reactionTimes.length > 0
    ? Math.round(c.reactionTimes.reduce((a, b) => a + b, 0) / c.reactionTimes.length) : null;

  const seenFaces = S.social.responses.filter(r => r !== 'elsewhere');
  const eyePct    = seenFaces.length > 0
    ? Math.round(S.social.responses.filter(r => r === 'eyes').length / seenFaces.length * 100) : null;
  const bpm       = S.eye.bpm ? S.eye.bpm.toFixed(1) : null;

  // ── Color + chip helpers ──────────────────────────────
  const aq10Color  = aq10Score  >= 6  ? 'var(--danger)' : aq10Score >= 4  ? 'var(--warn)' : 'var(--teal)';
  const asrsColor  = asrsScore  >= 4  ? 'var(--danger)' : 'var(--teal)';
  const raadsColor = raads14Score >= 14 ? (raads14Score >= 22 ? 'var(--danger)' : 'var(--warn)') : 'var(--teal)';

  const aq10Chip  = aq10Score  <= 3 ? ['chip-low', t('chipLow')] : aq10Score  <= 5 ? ['chip-mid', t('chipMid')] : ['chip-high', t('chipHigh')];
  const asrsChip  = asrsScore  <= 3 ? ['chip-low', t('chipLow')] : asrsScore  === 4 ? ['chip-mid', t('chipMid')] : ['chip-high', t('chipHigh')];
  const raadsChip = raads14Score < 14 ? ['chip-low', t('chipLow')] : raads14Score < 22 ? ['chip-mid', t('chipMid')] : ['chip-high', t('chipHigh')];

  // ── Interpretation functions ──────────────────────────
  function aq10Interp() {
    if (aq10Score <= 3) return t('aq10Low');
    if (aq10Score <= 5) return t('aq10Mid');
    return t('aq10High')(aq10Score);
  }
  function asrsInterp() {
    if (asrsScore <= 3) return t('asrsLow');
    if (asrsScore === 4) return t('asrsMid');
    return t('asrsHigh')(asrsScore);
  }
  function raadsInterp() {
    if (raads14Score < 14) return t('raads14Low');
    if (raads14Score < 22) return t('raads14Mid')(raads14Score);
    return t('raads14High')(raads14Score);
  }
  function catqInterp() {
    if (catqTotal === null) return '';
    return catqTotal >= CATQ_THRESHOLD ? t('catqHigh')(catqTotal) : t('catqLow')(catqTotal);
  }
  function profileText() {
    const asd      = aq10Score >= 6;
    const raads    = raads14Score >= 14;
    const adhd     = asrsScore >= 4;
    const catqHigh = catqTotal !== null && catqTotal >= CATQ_THRESHOLD;
    const impuls   = c.falseAlarms >= 6;
    const inattn   = nTargets > 0 && (c.hits / nTargets) < 0.7;
    if ((asd || raads) && adhd)  return t('profileBoth');
    if (asd && raads)            return catqHigh ? t('profileAsdMasked') : t('profileAsdOnly');
    if (!asd && raads)           return t('profileRaadsOnly');
    if (asd && !raads && catqHigh) return t('profileAsdMasked');
    if (asd && !raads)           return t('profileAsdOnly');
    if (!asd && !raads && adhd)  return t('profileAdhdOnly');
    if (impuls && !adhd)         return t('profileImpuls');
    if (inattn && !adhd)         return t('profileInattn');
    return t('profileNorm');
  }

  const showMaskingNote = aq10Score <= 5;

  // ── Render ────────────────────────────────────────────
  const el = document.getElementById('screen-results');
  el.innerHTML = `
    <div class="card">
      <span class="badge badge-purple">${t('badgeResults')}</span>
      <h2>${t('resultsTitle')}</h2>
      <p style="font-size:12px;color:var(--text3)">${new Date().toLocaleString(LANG === 'it' ? 'it-IT' : 'en-GB')}</p>

      <div class="result-grid result-grid-4">
        <div class="result-block">
          <div class="result-name">${t('aq10BlockName')}</div>
          <div class="result-score" style="color:${aq10Color}">${aq10Score}</div>
          <div class="result-max">/ 10</div>
          <div class="score-bar-wrap">
            <div class="score-bar"><div class="score-bar-fill purple" style="width:0%" id="bar-aq10"></div></div>
          </div>
          <span class="result-chip ${aq10Chip[0]}">${aq10Chip[1]}</span>
        </div>
        <div class="result-block">
          <div class="result-name">${t('asrsBlockName')}</div>
          <div class="result-score" style="color:${asrsColor}">${asrsScore}</div>
          <div class="result-max">/ 6</div>
          <div class="score-bar-wrap">
            <div class="score-bar"><div class="score-bar-fill teal" style="width:0%" id="bar-asrs"></div></div>
          </div>
          <span class="result-chip ${asrsChip[0]}">${asrsChip[1]}</span>
        </div>
        <div class="result-block">
          <div class="result-name">${t('raads14BlockName')}</div>
          <div class="result-score" style="color:${raadsColor}">${raads14Score}</div>
          <div class="result-max">/ 42</div>
          <div class="score-bar-wrap">
            <div class="score-bar"><div class="score-bar-fill warn" style="width:0%" id="bar-raads14"></div></div>
          </div>
          <span class="result-chip ${raadsChip[0]}">${raadsChip[1]}</span>
        </div>
        ${catqTotal !== null ? `
        <div class="result-block">
          <div class="result-name">${t('catqBlockName')}</div>
          <div class="result-score" style="color:${catqTotal >= CATQ_THRESHOLD ? 'var(--warn)' : 'var(--teal)'}">${catqTotal}</div>
          <div class="result-max">/ 175</div>
          <div class="score-bar-wrap">
            <div class="score-bar"><div class="score-bar-fill warn" style="width:0%" id="bar-catq"></div></div>
          </div>
          <span class="result-chip ${catqTotal >= CATQ_THRESHOLD ? 'chip-mid' : 'chip-low'}">${catqTotal >= CATQ_THRESHOLD ? t('chipHigh') : t('chipLow')}</span>
        </div>` : ''}
      </div>

      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('aq10Section')} ${aq10Chip[1]}</h3>
        <p style="font-size:13px">${aq10Interp()}</p>
        ${showMaskingNote ? `<p style="font-size:12px;color:var(--warn);margin-top:6px">${t('maskingNote')}</p>` : ''}
      </div>

      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('asrsSection')} ${asrsChip[1]}</h3>
        <p style="font-size:13px">${asrsInterp()}</p>
      </div>

      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('raads14Section')} ${raadsChip[1]}</h3>
        <p style="font-size:13px">${raadsInterp()}</p>
        <p style="font-size:11px;color:var(--text3);margin-top:4px">${t('raads14Domains')}</p>
      </div>

      ${catqTotal !== null ? `
      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('catqSection')}</h3>
        <p style="font-size:13px">${catqInterp()}</p>
        ${catqSubs ? `<p style="font-size:11px;color:var(--text3);margin-top:4px">${t('catqSubscales')(catqSubs.masking, catqSubs.assimilation, catqSubs.compensation)}</p>` : ''}
      </div>` : ''}

      ${c.stimList.length > 0 ? `
      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('cptResultBlock')}</h3>
        <div class="cpt-result-row">
          <div class="cpt-pill">${t('cptHitRate')} <span>${hitRate}%</span></div>
          <div class="cpt-pill">${t('cptFalseAlarms')} <span style="color:${c.falseAlarms >= 6 ? 'var(--danger)' : 'inherit'}">${c.falseAlarms} (${faRate}%)</span></div>
          ${rtAvg  ? `<div class="cpt-pill">${t('cptRtMedio')} <span>${rtAvg}ms</span></div>` : ''}
          ${dprime ? `<div class="cpt-pill">d' <span>${dprime}</span></div>` : ''}
        </div>
        <p style="font-size:12px;margin-top:8px">
          ${c.falseAlarms >= 6 ? t('cptFAHigh') : ''}
          ${nTargets > 0 && (c.hits / nTargets) < 0.7 ? t('cptHitLow') : ''}
          ${dprime && parseFloat(dprime) < 1.5 ? t('cptDprimeLow') : ''}
          ${c.falseAlarms < 6 && (nTargets === 0 || (c.hits / nTargets) >= 0.7) ? t('cptNorm') : ''}
        </p>
      </div>` : ''}

      ${eyePct !== null ? `
      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('socialResultBlock')}</h3>
        <p style="font-size:13px">
          ${t('socialEyePct')(eyePct, FACE_CONFIGS.length)}
          ${eyePct >= 60 ? t('socialHigh') : eyePct >= 40 ? t('socialMid') : t('socialLow')}
        </p>
      </div>` : ''}

      ${bpm !== null ? `
      <div class="card card-sm" style="margin-bottom:16px;background:var(--surf2)">
        <h3>${t('webcamResultBlock')}</h3>
        <p style="font-size:13px">
          ${t('blinkNorm')(bpm, S.eye.blinkCount, S.eye.duration.toFixed(0))}
          ${parseFloat(bpm) < 8 ? t('blinkLow') : parseFloat(bpm) > 28 ? t('blinkHigh') : t('blinkOk')}
        </p>
      </div>` : ''}

      <div class="profile-box">
        <h3>${t('profileBlock')}</h3>
        <p style="font-size:14px">${profileText()}</p>
      </div>

      <div class="disclaimer">${t('disclaimerResult')}</div>

      ${refsHTML()}

      <div class="actions-row">
        <button class="btn btn-outline" onclick="window.print()">${t('printBtn')}</button>
        <button class="btn btn-outline" onclick="NS.restart()">${t('restartBtn')}</button>
      </div>
    </div>
  `;

  // Animate score bars after render
  setTimeout(() => {
    const set = (id, val, max) => {
      const el = document.getElementById(id);
      if (el) el.style.width = (val / max * 100) + '%';
    };
    set('bar-aq10',    aq10Score,    10);
    set('bar-asrs',    asrsScore,    6);
    set('bar-raads14', raads14Score, RAADS14_MAX);
    if (catqTotal !== null) {
      // Map CAT-Q range 25-175 → 0-100%
      const pct = Math.max(0, (catqTotal - CATQ_MIN) / (CATQ_MAX - CATQ_MIN) * 100);
      const b = document.getElementById('bar-catq');
      if (b) b.style.width = pct + '%';
    }
  }, 100);
}
