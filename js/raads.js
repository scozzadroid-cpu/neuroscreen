'use strict';
// ════════════════════════════════════════════════════════
//  RAADS-14 — renderer for Ritvo Autism Asperger Diagnostic Scale
// ════════════════════════════════════════════════════════

function renderRAA14() {
  const i   = S.raads14.idx;
  const qi  = S.raads14._order ? S.raads14._order[i] : i;
  const len = RAADS14_Q.it.length;
  const ans = S.raads14.answers[qi];
  const pct = Math.round((i + 1) / len * 100);

  const numLbl = document.getElementById('raads14-num-label');
  if (numLbl) numLbl.innerHTML = t('questionOf')(i + 1, len);

  const numEl = document.getElementById('raads14-num');
  if (numEl) numEl.textContent = i + 1;

  const bar = document.getElementById('raads14-bar');
  if (bar) bar.style.width = pct + '%';

  const txt = document.getElementById('raads14-text');
  if (txt) txt.textContent = RAADS14_Q[LANG][qi];

  // Render instruction note on first question
  const noteEl = document.getElementById('raads14-note');
  if (noteEl) {
    noteEl.innerHTML = i === 0
      ? `<p style="font-size:12px;color:var(--text3);margin-bottom:16px">${t('raadsInstr')}</p>`
      : '';
  }

  const opts = RAADS14_OPTS[LANG];
  const container = document.getElementById('raads14-opts');
  if (container) {
    container.innerHTML = opts.map((opt, j) => `
      <button class="opt-btn${ans === j ? ' sel' : ''}" onclick="NS.raads14Pick(${j})">${opt}</button>
    `).join('');
  }

  const prevBtn = document.getElementById('raads14-prev');
  if (prevBtn) prevBtn.disabled = false;

  const nextBtn = document.getElementById('raads14-next');
  if (nextBtn) {
    nextBtn.disabled = ans === null;
    nextBtn.textContent = i === len - 1 ? t('finishBtn') : t('nextBtn');
  }
}
