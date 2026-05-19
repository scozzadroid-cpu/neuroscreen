'use strict';
// ════════════════════════════════════════════════════════
//  ASRS-v1.1 Part A — render and navigation
//  Scoring: ASRS_THRESH in data.js; calcASRS() in scoring.js
// ════════════════════════════════════════════════════════

function renderASRS() {
  const i    = S.asrs.idx;
  const ans  = S.asrs.answers[i];
  const qs   = ASRS_Q[LANG];
  const opts = ASRS_OPTS[LANG];

  const numLabel = document.getElementById('asrs-num-label');
  if (numLabel) numLabel.innerHTML = t('questionOf')(i + 1, 6);

  document.getElementById('asrs-bar').style.width  = (i / 6 * 100) + '%';
  document.getElementById('asrs-text').textContent = qs[i];

  const prev = document.getElementById('asrs-prev');
  const next = document.getElementById('asrs-next');
  prev.disabled    = (i === 0);
  prev.textContent = t('prevBtn');
  next.disabled    = (ans === null);
  next.textContent = (i === 5) ? t('finishBtn') : t('nextBtn');

  const optsEl = document.getElementById('asrs-opts');
  optsEl.innerHTML = '';
  opts.forEach((label, oi) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (ans === oi ? ' sel' : '');
    btn.textContent = label;
    btn.onclick = () => { S.asrs.answers[i] = oi; renderASRS(); };
    optsEl.appendChild(btn);
  });
}
