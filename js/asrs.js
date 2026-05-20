'use strict';
// ════════════════════════════════════════════════════════
//  ASRS-v1.1 Part A — render and navigation
//  Scoring: ASRS_THRESH in data.js; calcASRS() in scoring.js
// ════════════════════════════════════════════════════════

function renderASRS() {
  const i    = S.asrs.idx;
  const qi   = S.asrs._order ? S.asrs._order[i] : i;
  const ans  = S.asrs.answers[qi];
  const qs   = _asrsQ()[LANG];
  const opts = ASRS_OPTS[LANG];
  const len  = qs.length;

  const noteEl = document.getElementById('asrs-note');
  if (noteEl) {
    noteEl.innerHTML = (i === 0 && S.extAsrs)
      ? `<p style="font-size:12px;color:var(--text3);margin-bottom:16px">${t('asrs18Instr')}</p>`
      : '';
  }

  const numLabel = document.getElementById('asrs-num-label');
  if (numLabel) numLabel.innerHTML = t('questionOf')(i + 1, len);

  document.getElementById('asrs-bar').style.width  = (i / len * 100) + '%';
  document.getElementById('asrs-text').textContent = qs[qi];

  const prev = document.getElementById('asrs-prev');
  const next = document.getElementById('asrs-next');
  prev.disabled    = false;
  prev.textContent = t('prevBtn');
  next.disabled    = (ans === null);
  next.textContent = (i === len - 1) ? t('finishBtn') : t('nextBtn');

  const optsEl = document.getElementById('asrs-opts');
  optsEl.innerHTML = '';
  opts.forEach((label, oi) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (ans === oi ? ' sel' : '');
    btn.textContent = label;
    btn.onclick = () => { S.asrs.answers[qi] = oi; renderASRS(); };
    optsEl.appendChild(btn);
  });
}
