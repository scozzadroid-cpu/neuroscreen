'use strict';
// ════════════════════════════════════════════════════════
//  CPT — Continuous Performance Test logic
//  Rosvold et al. (1956); Conners CK (2004)
//  Parameters: CPT_* constants in data.js
// ════════════════════════════════════════════════════════

let _cptTimeout = null;

function buildCPTStimList() {
  const total = Math.floor(CPT_DURATION / (CPT_STIM_ON + CPT_ISI));
  const nTgt  = Math.round(total * CPT_TARGET_RATE);
  const list  = [];
  for (let i = 0; i < nTgt; i++)         list.push({ letter: CPT_TARGET, isTarget: true  });
  for (let i = 0; i < total - nTgt; i++) {
    const l = CPT_CONSONANTS[Math.floor(Math.random() * CPT_CONSONANTS.length)];
    list.push({ letter: l, isTarget: false });
  }
  // Fisher-Yates shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function cptStart() {
  const c = S.cpt;
  c.running        = true;
  c.stimList       = buildCPTStimList();
  c.stimIdx        = 0;
  c.hits           = 0;
  c.misses         = 0;
  c.falseAlarms    = 0;
  c.correctRejects = 0;
  c.reactionTimes  = [];
  c.timerStart     = performance.now();

  document.getElementById('cpt-start-btn').style.display   = 'none';
  document.getElementById('cpt-respond-btn').style.display = '';
  document.getElementById('cpt-respond-btn').disabled      = false;
  document.getElementById('cpt-timer-wrap').style.display  = '';
  document.getElementById('cpt-live-stats').style.display  = 'flex';

  document.addEventListener('keydown', cptKeyHandler);
  cptNextStim();
}

function cptKeyHandler(e) {
  if (e.code === 'Space' && S.cpt.running) { e.preventDefault(); cptRespond(); }
}

function cptNextStim() {
  const c = S.cpt;
  if (!c.running) return;
  if (c.stimIdx >= c.stimList.length) { cptEnd(); return; }

  const stim  = c.stimList[c.stimIdx];
  const el    = document.getElementById('cpt-letter');
  const instr = document.getElementById('cpt-instr');

  el.textContent     = stim.letter;
  el.className       = stim.isTarget ? 'target-shown' : '';
  c.stimOnAt         = performance.now();
  c.awaitingResponse = true;
  instr.textContent  = stim.isTarget ? t('cptPressSpace') : t('cptDontPress');

  const elapsed = performance.now() - c.timerStart;
  const pct     = Math.max(0, 100 - (elapsed / CPT_DURATION) * 100);
  const remSec  = Math.max(0, Math.ceil((CPT_DURATION - elapsed) / 1000));
  document.getElementById('cpt-timer-fill').style.width  = pct + '%';
  document.getElementById('cpt-timer-label').textContent = remSec + 's';

  _cptTimeout = setTimeout(() => {
    if (!c.running) return;
    if (c.awaitingResponse) {
      if (stim.isTarget) c.misses++;
      else               c.correctRejects++;
    }
    el.textContent     = '';
    el.className       = '';
    c.awaitingResponse = false;
    c.stimIdx++;
    _cptTimeout = setTimeout(cptNextStim, CPT_ISI);
  }, CPT_STIM_ON);
}

function cptRespond() {
  const c    = S.cpt;
  if (!c.running) return;

  const now  = performance.now();
  const stim = c.stimList[c.stimIdx];
  const el   = document.getElementById('cpt-letter');

  if (c.awaitingResponse && stim) {
    if (stim.isTarget) {
      c.hits++;
      c.reactionTimes.push(now - c.stimOnAt);
      el.className = 'hit';
    } else {
      c.falseAlarms++;
      el.className = 'false-alarm';
    }
    c.awaitingResponse = false;
  } else if (!c.awaitingResponse && c.stimIdx > 0) {
    const prev = c.stimList[c.stimIdx - 1];
    if (prev && !prev.isTarget) c.falseAlarms++;
  }

  document.getElementById('cpt-live-hits').textContent = c.hits;
  document.getElementById('cpt-live-fa').textContent   = c.falseAlarms;
}

function cptEnd() {
  const c = S.cpt;
  c.running = false;
  clearTimeout(_cptTimeout);
  document.removeEventListener('keydown', cptKeyHandler);

  document.getElementById('cpt-respond-btn').disabled     = true;
  document.getElementById('cpt-letter').textContent       = '✓';
  document.getElementById('cpt-letter').className         = 'hit';
  document.getElementById('cpt-instr').textContent        = t('cptDone');
  S.cptDone = true;

  setTimeout(() => {
    const nTargets = c.stimList.filter(s => s.isTarget).length;
    const hitRate  = nTargets > 0 ? (c.hits / nTargets * 100).toFixed(0) : 0;
    const faRate   = (c.stimList.length - nTargets) > 0
      ? (c.falseAlarms / (c.stimList.length - nTargets) * 100).toFixed(0) : 0;
    const rt = c.reactionTimes.length > 0
      ? Math.round(c.reactionTimes.reduce((a, b) => a + b, 0) / c.reactionTimes.length) : null;

    document.getElementById('cpt-card').innerHTML = `
      <span class="badge badge-warn">${t('cptBadgeDone')}</span>
      <h2>${t('cptResultTitle')}</h2>
      <div class="cpt-result-row">
        <div class="cpt-pill">${t('cptCorrect')} <span>${c.hits}/${nTargets}</span></div>
        <div class="cpt-pill">${t('cptHitRate')} <span>${hitRate}%</span></div>
        <div class="cpt-pill">${t('cptFalseAlarms')} <span>${c.falseAlarms} (${faRate}%)</span></div>
        ${rt ? `<div class="cpt-pill">${t('cptRtMedio')} <span>${rt}ms</span></div>` : ''}
      </div>
      <p style="font-size:13px;margin-top:8px">${t('cptSaved')}</p>
    `;

    if (S.tests.social) {
      document.getElementById('social-card').style.display = '';
      startSocialTest();
    } else {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'text-align:center;margin-top:16px';
      wrap.innerHTML = `<button class="btn btn-primary" onclick="NS.goToWebcam()">${t('continueWebcam')}</button>`;
      document.getElementById('cpt-card').appendChild(wrap);
    }
  }, 1200);
}
