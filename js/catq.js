'use strict';
// ════════════════════════════════════════════════════════
//  CAT-Q — renderer for Camouflaging Autistic Traits Questionnaire
// ════════════════════════════════════════════════════════

function renderCATQ() {
  const i   = S.catq.idx;
  const qi  = S.catq._order ? S.catq._order[i] : i;
  const len = CATQ_Q.it.length;
  const ans = S.catq.answers[qi]; // 1-7 or null

  const numEl = document.getElementById('catq-num');
  if (numEl) numEl.textContent = i + 1;

  const bar = document.getElementById('catq-bar');
  if (bar) bar.style.width = Math.round((i + 1) / len * 100) + '%';

  const txt = document.getElementById('catq-text');
  if (txt) txt.textContent = CATQ_Q[LANG][qi];

  // Instruction + note on first question
  const instrEl = document.getElementById('catq-instr');
  if (instrEl) {
    instrEl.innerHTML = i === 0
      ? `<p style="font-size:12px;color:var(--text3);margin-bottom:16px">${t('catqInstr')}</p>`
      : '';
  }

  // 7-point Likert scale
  const optsEl = document.getElementById('catq-opts');
  if (optsEl) {
    optsEl.innerHTML = `
      <div class="likert-anchors">
        <span>${t('catqDisagree')}</span>
        <span>${t('catqAgree')}</span>
      </div>
      <div class="likert-btns">
        ${[1,2,3,4,5,6,7].map(v => `
          <button class="likert-btn${ans === v ? ' sel' : ''}" onclick="NS.catqPick(${v})">${v}</button>
        `).join('')}
      </div>
    `;
  }

  const prevBtn = document.getElementById('catq-prev');
  if (prevBtn) prevBtn.disabled = false;

  const nextBtn = document.getElementById('catq-next');
  if (nextBtn) {
    nextBtn.disabled = ans === null;
    nextBtn.textContent = i === len - 1 ? t('finishBtn') : t('nextBtn');
  }

  const skipBtn = document.getElementById('catq-skip');
  if (skipBtn) skipBtn.textContent = t('catqSkipBtn');
}
