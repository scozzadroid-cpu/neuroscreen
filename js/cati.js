'use strict';
// ════════════════════════════════════════════════════════
//  CATI — Comprehensive Autistic Trait Inventory (English et al. 2021)
//  Scoring: CATI_* in data.js; calcCATI() in scoring.js
// ════════════════════════════════════════════════════════

function renderCATI() {
  const i   = S.cati.idx;
  const qi  = S.cati._order ? S.cati._order[i] : i;
  const len = CATI_Q.it.length;
  const ans = S.cati.answers[qi]; // 1-5 or null

  const numLbl = document.getElementById('cati-num-label');
  if (numLbl) numLbl.innerHTML = t('questionOf')(i + 1, len);

  const bar = document.getElementById('cati-bar');
  if (bar) bar.style.width = Math.round(i / len * 100) + '%';

  const txt = document.getElementById('cati-text');
  if (txt) txt.textContent = CATI_Q[LANG][qi];

  const noteEl = document.getElementById('cati-note');
  if (noteEl) {
    noteEl.innerHTML = i === 0
      ? `<p style="font-size:12px;color:var(--text3);margin-bottom:16px">${t('catiInstr')}</p>`
      : '';
  }

  const optsEl = document.getElementById('cati-opts');
  if (optsEl) {
    optsEl.innerHTML = CATI_OPTS[LANG].map((label, j) => `
      <button class="opt-btn${ans === j + 1 ? ' sel' : ''}" onclick="NS.catiPick(${j + 1})">${label}</button>
    `).join('');
  }

  const prevBtn = document.getElementById('cati-prev');
  if (prevBtn) { prevBtn.disabled = false; prevBtn.textContent = t('prevBtn'); }

  const nextBtn = document.getElementById('cati-next');
  if (nextBtn) {
    nextBtn.disabled = ans === null;
    nextBtn.textContent = i === len - 1 ? t('finishBtn') : t('nextBtn');
  }
}
