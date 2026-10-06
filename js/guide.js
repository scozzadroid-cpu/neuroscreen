'use strict';
// ════════════════════════════════════════════════════════
//  GUIDE — short initial quiz that suggests which tests to run
//  Routing only: answers are not scored and never reach the results
// ════════════════════════════════════════════════════════

// Minutes per test, shared with the duration counter on the welcome screen
const TEST_MINUTES = { aq10: 3, asrs: 2, adexi: 4, raads14: 5, cati: 7, catq: 7, spq: 6, mq: 8, cpt: 1, social: 3, webcam: 1 };
const ALL_TEST_IDS = ['aq10', 'asrs', 'adexi', 'raads14', 'cati', 'catq', 'spq', 'mq', 'cpt', 'social', 'webcam'];

// Question keys in order; option counts come from the translation tables
const GUIDE_QUESTIONS = ['focus', 'time', 'masking', 'sensory', 'exec', 'absorb', 'experimental'];

function guideOpen()  { S.guide = { step: 0, answers: {} }; renderGuide(); }
function guideClose() { S.guide = null; renderGuide(); }

function guideAnswer(key, value) {
  S.guide.answers[key] = value;
  S.guide.step++;
  renderGuide();
}

function guideBack() {
  if (S.guide.step > 0) S.guide.step--;
  renderGuide();
}

// Builds the recommendation from the answers: ordered candidates, then trimmed to the time budget
function guideRecommend(a) {
  const autism = a.focus === 0 || a.focus === 2 || a.focus === 3;
  const adhd   = a.focus === 1 || a.focus === 2 || a.focus === 3;
  const yes    = k => a[k] === 0;
  const budget = [15, 30, 60][a.time];

  const cand = [];
  const add = (id, prio, reason) => cand.push({ id, prio, reason });
  if (autism) add('raads14', 1, 'raads14');
  if (adhd)   add('asrs', 1, 'asrs');
  if (autism) add('cati', 2, 'cati');
  if (yes('exec') || (adhd && !autism)) add('adexi', yes('exec') ? 2 : 4, yes('exec') ? 'adexiYes' : 'adexi');
  if (yes('masking')) add('catq', 3, 'catq');
  if (yes('sensory')) add('spq', 4, 'spq');
  if (yes('absorb'))  add('mq', 5, 'mq');
  if (autism && a.time === 2) add('aq10', 6, 'aq10');
  if (yes('experimental')) {
    add('cpt', 7, 'cpt');
    add('social', 8, 'social');
    add('webcam', 9, 'webcam');
  }
  cand.sort((x, y) => x.prio - y.prio);

  const picked = [], later = [];
  let minutes = 0;
  cand.forEach(c => {
    const m = TEST_MINUTES[c.id];
    if (c.prio === 1 || minutes + m <= budget) { picked.push(c); minutes += m; }
    else later.push(c);
  });
  return { picked, later, minutes };
}

function guideApply() {
  const rec = guideRecommend(S.guide.answers);
  ALL_TEST_IDS.forEach(id => { S.tests[id] = rec.picked.some(c => c.id === id); });
  S.guide = null;
  updateWelcomeScreen();
  const grid = document.getElementById('wlc-test-grid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _testName(id) {
  const names = { aq10: 'AQ-10', asrs: 'ASRS-v1.1', adexi: 'ADEXI', raads14: 'RAADS-14', cati: 'CATI', catq: 'CAT-Q',
                  spq: 'SPQ-35', mq: 'MQ', cpt: 'CPT', social: t('socialTestName'), webcam: t('webcamTestName') };
  return names[id];
}

function renderGuide() {
  const el = document.getElementById('wlc-guide');
  if (!el) return;
  const g = S.guide;

  if (!g) {
    el.innerHTML = `
      <div class="guide-box guide-closed">
        <div>
          <div class="guide-title">${t('guideTitle')}</div>
          <p class="guide-sub">${t('guideIntro')}</p>
        </div>
        <button class="btn btn-teal btn-sm" onclick="NS.guideOpen()">${t('guideStart')}</button>
      </div>`;
    return;
  }

  if (g.step < GUIDE_QUESTIONS.length) {
    const key  = GUIDE_QUESTIONS[g.step];
    const opts = t('guideOpts_' + key);
    el.innerHTML = `
      <div class="guide-box">
        <div class="guide-head">
          <span class="guide-count">${t('guideStep')(g.step + 1, GUIDE_QUESTIONS.length)}</span>
          <button class="guide-link" onclick="NS.guideClose()">${t('guideCancel')}</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.round(g.step / GUIDE_QUESTIONS.length * 100)}%"></div></div>
        <p class="guide-q">${t('guideQ_' + key)}</p>
        <div class="guide-opts">
          ${opts.map((o, j) => `<button class="opt-btn${g.answers[key] === j ? ' sel' : ''}" onclick="NS.guideAnswer('${key}', ${j})">${o}</button>`).join('')}
        </div>
        ${g.step > 0 ? `<button class="guide-link" onclick="NS.guideBack()">${t('prevBtn')}</button>` : ''}
      </div>`;
    return;
  }

  const rec  = guideRecommend(g.answers);
  const item = c => `<li><strong>${_testName(c.id)}</strong> <span class="guide-min">${TEST_MINUTES[c.id]} min</span><br><span class="guide-why">${t('guideWhy_' + c.reason)}</span></li>`;
  el.innerHTML = `
    <div class="guide-box">
      <div class="guide-head">
        <span class="guide-title">${t('guideResultTitle')(rec.minutes)}</span>
        <button class="guide-link" onclick="NS.guideClose()">${t('guideCancel')}</button>
      </div>
      <ul class="guide-list">${rec.picked.map(item).join('')}</ul>
      ${rec.later.length ? `
        <p class="guide-later-title">${t('guideLater')}</p>
        <ul class="guide-list guide-list-later">${rec.later.map(item).join('')}</ul>` : ''}
      <p class="guide-note">${t('guideNote')}</p>
      <div class="guide-actions">
        <button class="btn btn-primary btn-sm" onclick="NS.guideApply()">${t('guideApply')}</button>
        <button class="btn btn-outline btn-sm" onclick="NS.guideOpen()">${t('guideRedo')}</button>
      </div>
    </div>`;
}
