'use strict';
// ════════════════════════════════════════════════════════
//  AQ-10 — render and navigation
//  Scoring: AQ10_SCORE_IF_AGREE in data.js; calcAQ10() in scoring.js
// ════════════════════════════════════════════════════════

function renderAQ10() {
  const i    = S.aq10.idx;
  const qi   = S.aq10._order ? S.aq10._order[i] : i;
  const ans  = S.aq10.answers[qi];
  const qs   = AQ10_Q[LANG];
  const opts = AQ10_OPTS[LANG];

  const numLabel = document.getElementById('aq10-num-label');
  if (numLabel) numLabel.innerHTML = t('questionOf')(i + 1, 10);

  document.getElementById('aq10-bar').style.width  = (i / 10 * 100) + '%';
  document.getElementById('aq10-text').textContent = qs[qi];

  const prev = document.getElementById('aq10-prev');
  const next = document.getElementById('aq10-next');
  prev.disabled    = false;
  prev.textContent = t('prevBtn');
  next.disabled    = (ans === null);
  next.textContent = (i === 9) ? t('finishBtn') : t('nextBtn');

  const optsEl = document.getElementById('aq10-opts');
  optsEl.innerHTML = '';
  opts.forEach((label, oi) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (ans === oi ? ' sel' : '');
    btn.textContent = label;
    btn.onclick = () => { S.aq10.answers[qi] = oi; renderAQ10(); };
    optsEl.appendChild(btn);
  });
}
