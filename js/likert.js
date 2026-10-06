'use strict';
// ════════════════════════════════════════════════════════
//  LIKERT — shared renderer and scoring for ADEXI, SPQ-35 and MQ
//  Config in data-extra.js (LIKERT_TESTS); state in S[id]
// ════════════════════════════════════════════════════════

const LIKERT_IDS = ['adexi', 'spq', 'mq'];

function _lkCurrent(id) {
  const st = S[id];
  return st._order ? st._order[st.idx] : st.idx;
}

function renderLikert(id) {
  const cfg = LIKERT_TESTS[id];
  const st  = S[id];
  const len = cfg.items.it.length;
  const qi  = _lkCurrent(id);
  const ans = st.answers[qi];
  const opts = cfg.opts[LANG];
  // MQ "not applicable" is the last option and is stored as 0
  const valueOf = j => (cfg.naLast && j === opts.length - 1) ? 0 : j + 1;

  const el = document.getElementById('screen-' + id);
  if (!el) return;
  el.innerHTML = `
    <div class="card">
      <span class="badge ${cfg.badgeCls}">${t(id + 'Badge')}</span>
      <div class="q-header">
        <h2>${t('questionOf')(st.idx + 1, len)}</h2>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.round(st.idx / len * 100)}%"></div></div>
      </div>
      ${st.idx === 0 ? `<p style="font-size:12px;color:var(--text3);margin-bottom:16px">${t(cfg.instrKey)}</p>` : ''}
      <div class="question-text">${cfg.items[LANG][qi]}</div>
      <div class="options-list">
        ${opts.map((label, j) => `
          <button class="opt-btn${ans === valueOf(j) ? ' sel' : ''}${cfg.naLast && j === opts.length - 1 ? ' opt-na' : ''}"
                  onclick="NS.lkPick('${id}', ${valueOf(j)})">${label}</button>`).join('')}
      </div>
      <div class="q-nav">
        <button class="btn btn-outline" onclick="NS.lkPrev('${id}')">${t('prevBtn')}</button>
        <button class="btn btn-primary" onclick="NS.lkNext('${id}')" ${ans === null ? 'disabled' : ''}>
          ${st.idx === len - 1 ? t('finishBtn') : t('nextBtn')}
        </button>
      </div>
    </div>`;
}

function _lkComplete(id) {
  return S[id].answers.every(a => a !== null);
}

// ADEXI: answers 1-5. Official scoring uses subscale means; total range 14-70.
function calcADEXI() {
  if (!_lkComplete('adexi')) return null;
  const a = S.adexi.answers;
  const mean = idx => idx.reduce((s, i) => s + a[i], 0) / idx.length;
  return {
    total: a.reduce((s, v) => s + v, 0),
    wm:    mean(ADEXI_WM),
    inh:   mean(ADEXI_INH),
  };
}

// SPQ-35: stored 1-4 (strongly agree ... strongly disagree), scored 0-3 with reversed items.
// Range 0-105; lower means more sensitive.
function calcSPQ() {
  if (!_lkComplete('spq')) return null;
  // The last item is worded negatively only in Italian, so reversal depends on the language it was answered in
  const reversed = i => SPQ_REVERSED.includes(i) || (i === SPQ_IT_NEGATED && S.spq.lastItemLang === 'it');
  return S.spq.answers.reduce((s, v, i) => s + (reversed(i) ? 4 - v : v - 1), 0);
}

// MQ: stored 1-5 or 0 for not applicable; reversed items as 6 - value; mean of answered items
function calcMQ() {
  if (!_lkComplete('mq')) return null;
  let sum = 0, n = 0;
  S.mq.answers.forEach((v, i) => {
    if (v === 0) return;
    sum += MQ_REVERSED.includes(i) ? 6 - v : v;
    n++;
  });
  if (n === 0) return null;
  return { mean: sum / n, answered: n, total: sum };
}
