'use strict';
// ════════════════════════════════════════════════════════
//  CPT — Continuous Performance Test logic
//  Rosvold et al. (1956); Conners CK (2004)
//  Parameters: CPT_* constants in data.js
// ════════════════════════════════════════════════════════

let _cptTimeout  = null;
let _cptHardStop = null;

function buildCPTStimList() {
  const avgISI = (CPT_ISI_START + CPT_ISI_END) / 2;
  const total  = Math.floor(CPT_DURATION / (CPT_STIM_ON + avgISI));
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
  c.running               = true;
  c.stimList              = buildCPTStimList();
  c.stimIdx               = 0;
  c.hits                  = 0;
  c.misses                = 0;
  c.falseAlarms           = 0;
  c.correctRejects        = 0;
  c.lateHits              = 0;
  c.reactionTimes         = [];
  c.timerStart            = performance.now();
  c._lastWasMissedTarget  = false;
  c._lateWindowEnd        = 0;

  document.getElementById('cpt-start-btn').style.display   = 'none';
  document.getElementById('cpt-respond-btn').style.display = '';
  document.getElementById('cpt-respond-btn').disabled      = false;
  document.getElementById('cpt-timer-wrap').style.display  = '';
  document.getElementById('cpt-live-stats').style.display  = 'flex';

  document.addEventListener('keydown', cptKeyHandler);
  _cptHardStop = setTimeout(() => { if (S.cpt.running) cptEnd(); }, CPT_DURATION);
  cptNextStim();
}

function cptKeyHandler(e) {
  if (e.code === 'Space' && S.cpt.running) { e.preventDefault(); cptRespond(); }
}

function cptNextStim() {
  const c = S.cpt;
  // Resolve late window from previous trial: if user never clicked, it's a miss
  if (c._lastWasMissedTarget) {
    c.misses++;
    c._lastWasMissedTarget = false;
  }
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
      if (stim.isTarget) {
        // Don't score miss yet — open a late-response window first
        c._lastWasMissedTarget = true;
        c._lateWindowEnd       = performance.now() + 600;
      } else {
        c.correctRejects++;
        c._lastWasMissedTarget = false;
      }
    } else {
      c._lastWasMissedTarget = false;
    }
    el.textContent     = '';
    el.className       = '';
    c.awaitingResponse = false;
    c.stimIdx++;
    const prog   = Math.min(1, (performance.now() - c.timerStart) / CPT_DURATION);
    const isiNow = Math.round(CPT_ISI_START + (CPT_ISI_END - CPT_ISI_START) * prog);
    _cptTimeout  = setTimeout(cptNextStim, isiNow);
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
    c.awaitingResponse         = false;
    c._lastWasMissedTarget     = false;
  } else if (!c.awaitingResponse) {
    if (c._lastWasMissedTarget && now < c._lateWindowEnd) {
      // Count as a valid hit (scored late but within window)
      c.hits++;
      c.lateHits++;
      c._lastWasMissedTarget = false;
      el.className = 'late-hit';
    }
    // Clicking after a non-target passed is not counted as a false alarm
  }

  document.getElementById('cpt-live-hits').textContent = c.hits;
  document.getElementById('cpt-live-fa').textContent   = c.falseAlarms;
}

function _buildCptResultHTML() {
  const c        = S.cpt;
  const nTargets = c.stimList.filter(s => s.isTarget).length;
  const hitRate  = nTargets > 0 ? (c.hits / nTargets * 100).toFixed(0) : 0;
  const faRate   = (c.stimList.length - nTargets) > 0
    ? (c.falseAlarms / (c.stimList.length - nTargets) * 100).toFixed(0) : 0;
  const rt = c.reactionTimes.length > 0
    ? Math.round(c.reactionTimes.reduce((a, b) => a + b, 0) / c.reactionTimes.length) : null;
  return `
    <span class="badge badge-warn">${t('cptBadgeDone')}</span>
    <h2>${t('cptResultTitle')}</h2>
    <div class="cpt-result-row">
      <div class="cpt-pill">${t('cptCorrect')} <span>${c.hits}/${nTargets}</span></div>
      <div class="cpt-pill">${t('cptHitRate')} <span>${hitRate}%</span></div>
      <div class="cpt-pill">${t('cptFalseAlarms')} <span>${c.falseAlarms} (${faRate}%)</span></div>
      ${rt ? `<div class="cpt-pill">${t('cptRtMedio')} <span>${rt}ms</span></div>` : ''}
      ${c.lateHits > 0 ? `<div class="cpt-pill">${t('cptLateHits')} <span style="color:var(--warn)">${c.lateHits}</span></div>` : ''}
    </div>
    <p style="font-size:13px;margin-top:8px">${t('cptSaved')}</p>
  `;
}

function cptEnd() {
  const c = S.cpt;
  // Resolve any pending late window from the last trial
  if (c._lastWasMissedTarget) {
    c.misses++;
    c._lastWasMissedTarget = false;
  }
  c.running = false;
  clearTimeout(_cptTimeout);
  clearTimeout(_cptHardStop); _cptHardStop = null;
  document.removeEventListener('keydown', cptKeyHandler);

  document.getElementById('cpt-respond-btn').disabled     = true;
  document.getElementById('cpt-letter').textContent       = '✓';
  document.getElementById('cpt-letter').className         = 'hit';
  document.getElementById('cpt-instr').textContent        = t('cptDone');
  S.cptDone = true;

  setTimeout(() => {
    document.getElementById('cpt-card').innerHTML = _buildCptResultHTML();

    if (S.tests.social) {
      if (S.tests.webcam && S.eye.phase !== 'done' && !S.webcamSkipped) {
        S._socialPending = true;
        showScreen('webcam');
        renderWebcamScreen();
      } else {
        document.getElementById('social-card').style.display = '';
        startSocialTest();
      }
    } else {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'text-align:center;margin-top:16px';
      const _webcamPending = S.tests.webcam && S.eye.phase !== 'done' && !S.webcamSkipped;
      wrap.innerHTML = `<button class="btn btn-primary" onclick="NS.goToWebcam()">${_webcamPending ? t('continueWebcam') : t('goToResults')}</button>`;
      document.getElementById('cpt-card').appendChild(wrap);
    }
  }, 1200);
}
