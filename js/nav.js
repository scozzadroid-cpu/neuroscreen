'use strict';
// ════════════════════════════════════════════════════════
//  NAVIGATION — screen switching, step-bar, welcome render
// ════════════════════════════════════════════════════════

const SCREENS = ['welcome', 'aq10', 'asrs', 'raads14', 'catq', 'tasks', 'webcam', 'results'];

function showScreen(name) {
  S.currentScreen = name;
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.toggle('active', id === name);

    const st = document.getElementById('step-' + id);
    if (!st) return;
    st.classList.remove('active', 'done');
    const cur = SCREENS.indexOf(name);
    const idx = SCREENS.indexOf(id);
    if (idx === cur)    st.classList.add('active');
    else if (idx < cur) st.classList.add('done');
  });
}

// Returns the next enabled screen after `after`
function nextScreen(after) {
  const order = ['welcome', 'aq10', 'asrs', 'raads14', 'catq', 'tasks', 'webcam', 'results'];
  const idx = order.indexOf(after);
  for (let i = idx + 1; i < order.length; i++) {
    const s = order[i];
    if (s === 'results') return 'results';
    if (s === 'tasks') { if (S.tests.cpt || S.tests.social) return 'tasks'; continue; }
    if (S.tests[s]) return s;
  }
  return 'results';
}

// Returns the previous enabled screen before `before`
function prevScreen(before) {
  const order = ['aq10', 'asrs', 'raads14', 'catq', 'tasks', 'webcam'];
  const idx = order.indexOf(before);
  for (let i = idx - 1; i >= 0; i--) {
    const s = order[i];
    if (s === 'tasks') { if (S.tests.cpt || S.tests.social) return 'tasks'; continue; }
    if (S.tests[s]) return s;
  }
  return 'welcome';
}

// Renders the content of the given screen
function renderScreen(name) {
  switch (name) {
    case 'welcome': updateWelcomeScreen(); break;
    case 'aq10':
      { const b = document.getElementById('aq10-badge'); if (b) b.textContent = t(S.extended ? 'badgeAq50' : 'badgeAq10'); }
      renderAQ10(); break;
    case 'asrs':
      { const b = document.getElementById('asrs-badge'); if (b) b.textContent = t(S.extended ? 'badgeAsrs18' : 'badgeAsrs'); }
      renderASRS(); break;
    case 'raads14': renderRAA14();         break;
    case 'catq':    renderCATQ();          break;
    case 'tasks':   renderTasksScreen();   break;
    case 'webcam':  renderWebcamScreen();  break;
    case 'results': renderResults();       break;
  }
}

function updateStepLabels() {
  const defs = [
    { id: 'step-welcome',  key: null,      lb: () => LANG === 'it' ? 'Benvenuto' : 'Welcome'   },
    { id: 'step-aq10',     key: 'aq10',    lb: () => S.extended ? 'AQ-50' : 'AQ-10'           },
    { id: 'step-asrs',     key: 'asrs',    lb: () => S.extended ? 'ASRS-18' : 'ASRS'          },
    { id: 'step-raads14',  key: 'raads14', lb: () => 'RAADS-14'                                },
    { id: 'step-catq',     key: 'catq',    lb: () => 'CAT-Q'                                   },
    { id: 'step-tasks',    key: 'tasks',   lb: () => LANG === 'it' ? 'Task' : 'Tasks'          },
    { id: 'step-webcam',   key: 'webcam',  lb: () => 'Webcam'                                  },
    { id: 'step-results',  key: null,      lb: () => LANG === 'it' ? 'Risultati' : 'Results'   },
  ];
  let n = 1;
  defs.forEach(d => {
    const el = document.getElementById(d.id);
    if (!el) return;
    const show = d.key === null ||
                 (d.key === 'tasks' ? (S.tests.cpt || S.tests.social) : S.tests[d.key]);
    el.style.display = show ? '' : 'none';
    if (show) el.textContent = `${n++} · ${d.lb()}`;
  });
}

function hasAnyResult() {
  if (S.tests.aq10    && S.aq10.answers.every(a => a !== null))                      return true;
  if (S.tests.asrs    && S.asrs.answers.every(a => a !== null))                      return true;
  if (S.tests.raads14 && S.raads14.answers.every(a => a !== null))                   return true;
  if (S.tests.catq    && !S.catq.skipped && S.catq.answers.every(a => a !== null))   return true;
  if (S.cptDone)                 return true;
  if (S.socialDone)              return true;
  if (S.eye.phase === 'done')    return true;
  return false;
}

function updateWelcomeScreen() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('wlc-badge',        t('badgeWelcome'));
  set('wlc-subtitle',     t('appSubtitle'));
  set('wlc-disclaimer',   t('disclaimerText'));
  set('wlc-oss',          t('ossNotice'));
  set('wlc-select-title', t('selectTests'));
  set('wlc-start',        t('startBtn'));
  set('aq10-badge',       t('badgeAq10'));
  set('asrs-badge',       t('badgeAsrs'));
  set('raads14-badge',    t('badgeRaads'));
  set('catq-badge',       t('badgeCatq'));
  set('wlc-ext-label',    t('extendedLabel'));
  set('wlc-ext-desc',     t('extendedDesc'));

  const tests = [
    { id: 'aq10',    icon: '🧩', name: 'AQ-10',             meta: t('aq10Meta'),    desc: t('aq10Short')    },
    { id: 'asrs',    icon: '⚡', name: 'ASRS-v1.1',         meta: t('asrsMeta'),   desc: t('asrsShort')   },
    { id: 'raads14', icon: '🔍', name: 'RAADS-14',          meta: t('raadsMeta'),  desc: t('raadsShort')  },
    { id: 'catq',    icon: '🎭', name: 'CAT-Q',             meta: t('catqMeta'),   desc: t('catqShort')   },
    { id: 'cpt',     icon: '🎯', name: 'CPT Task',          meta: t('cptMeta'),    desc: t('cptShort')    },
    { id: 'social',  icon: '👁️', name: t('socialTestName'), meta: t('socialMeta'), desc: t('socialShort') },
    { id: 'webcam',  icon: '📹', name: t('webcamTestName'), meta: t('webcamMeta'), desc: t('webcamShort') },
  ];

  const grid = document.getElementById('wlc-test-grid');
  if (grid) {
    grid.innerHTML = tests.map(tc => `
      <div class="test-card">
        <div class="test-card-header">
          <label class="ts-toggle">
            <input type="checkbox" id="sel-${tc.id}" ${S.tests[tc.id] ? 'checked' : ''}
                   onchange="NS.updateDuration()">
            <span class="ts-slider"></span>
          </label>
          <div>
            <div class="test-card-title">${tc.icon} ${tc.name}</div>
            <div class="test-card-meta">${tc.meta}</div>
          </div>
        </div>
        <p class="test-card-desc">${tc.desc}</p>
      </div>
    `).join('');
  }

  _updateDurationDisplay();
}

function _updateDurationDisplay() {
  const ext = document.getElementById('sel-extended')?.checked ?? false;
  const durs = { aq10: ext ? 15 : 3, asrs: ext ? 6 : 2, raads14: 5, catq: 7, cpt: 1, social: 3, webcam: 1 };
  let total = 0;
  Object.keys(durs).forEach(id => {
    const el = document.getElementById('sel-' + id);
    total += (el ? el.checked : S.tests[id]) ? durs[id] : 0;
  });
  const el = document.getElementById('wlc-duration');
  if (el) el.innerHTML = t('durationLabel')(Math.max(1, total));
  // Update AQ and ASRS card titles/metas live
  const aqTitle = document.querySelector('#sel-aq10')?.closest('.test-card')?.querySelector('.test-card-title');
  if (aqTitle) aqTitle.textContent = `\u{1F9E9} ${ext ? 'AQ-50' : 'AQ-10'}`;
  const aqMeta  = document.querySelector('#sel-aq10')?.closest('.test-card')?.querySelector('.test-card-meta');
  if (aqMeta)  aqMeta.textContent  = t(ext ? 'aq50Meta' : 'aq10Meta');
  const asrsTitle = document.querySelector('#sel-asrs')?.closest('.test-card')?.querySelector('.test-card-title');
  if (asrsTitle) asrsTitle.textContent = `⚡ ${ext ? 'ASRS-18' : 'ASRS-v1.1'}`;
  const asrsMeta  = document.querySelector('#sel-asrs')?.closest('.test-card')?.querySelector('.test-card-meta');
  if (asrsMeta)  asrsMeta.textContent  = t(ext ? 'asrs18Meta' : 'asrsMeta');
}
