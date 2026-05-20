'use strict';
// ════════════════════════════════════════════════════════
//  STORAGE — localStorage session persistence
//  Key: ns_session_v1 | TTL: 7 days
// ════════════════════════════════════════════════════════

const _STORE_KEY = 'ns_session_v1';
const _STORE_TTL = 7 * 24 * 3600 * 1000;

function saveSession() {
  const snap = {
    savedAt:       Date.now(),
    lang:          LANG,
    extAq:         S.extAq,
    extAsrs:       S.extAsrs,
    currentScreen: S.currentScreen,
    aq10:    { idx: S.aq10.idx,    answers: [...S.aq10.answers]    },
    asrs:    { idx: S.asrs.idx,    answers: [...S.asrs.answers]    },
    raads14: { idx: S.raads14.idx, answers: [...S.raads14.answers] },
    catq:    { idx: S.catq.idx,    answers: [...S.catq.answers], skipped: S.catq.skipped },
    social:  { idx: S.social.idx,  responses: [...S.social.responses] },
    cptDone:       S.cptDone,
    socialDone:    S.socialDone,
    webcamSkipped: S.webcamSkipped,
    cpt: {
      hits: S.cpt.hits, misses: S.cpt.misses,
      falseAlarms: S.cpt.falseAlarms, correctRejects: S.cpt.correctRejects,
      reactionTimes: [...S.cpt.reactionTimes],
      stimList: S.cpt.stimList.map(s => ({ letter: s.letter, isTarget: s.isTarget })),
    },
    eye: { blinkCount: S.eye.blinkCount, duration: S.eye.duration, bpm: S.eye.bpm },
  };
  try { localStorage.setItem(_STORE_KEY, JSON.stringify(snap)); } catch(e) {}
}

function clearSession() {
  try { localStorage.removeItem(_STORE_KEY); } catch(e) {}
}

function _applySnapshot(snap) {
  LANG = snap.lang || 'it';
  S.extAq   = snap.extAq   || false;
  S.extAsrs = snap.extAsrs || false;
  if (snap.aq10)    Object.assign(S.aq10,    snap.aq10);
  if (snap.asrs)    Object.assign(S.asrs,    snap.asrs);
  if (snap.raads14) Object.assign(S.raads14, snap.raads14);
  if (snap.catq)    Object.assign(S.catq,    snap.catq);
  if (snap.social)  Object.assign(S.social,  snap.social);
  if (snap.cpt) {
    S.cpt.hits = snap.cpt.hits || 0;
    S.cpt.misses = snap.cpt.misses || 0;
    S.cpt.falseAlarms = snap.cpt.falseAlarms || 0;
    S.cpt.correctRejects = snap.cpt.correctRejects || 0;
    S.cpt.reactionTimes = snap.cpt.reactionTimes || [];
    S.cpt.stimList = snap.cpt.stimList || [];
  }
  if (snap.eye) {
    S.eye.blinkCount = snap.eye.blinkCount || 0;
    S.eye.duration   = snap.eye.duration   || 0;
    S.eye.bpm        = snap.eye.bpm        || 0;
  }
  S.cptDone       = snap.cptDone       || false;
  S.socialDone    = snap.socialDone    || false;
  S.webcamSkipped = snap.webcamSkipped || false;
}

function _restoreSession() {
  if (!window._pendingRestore) return;
  _applySnapshot(window._pendingRestore);
  window._pendingRestore = null;
  _dismissBanner();
  NS.setLang(LANG);
  showScreen('results');
  renderResults();
}

function _dismissBanner() {
  const b = document.getElementById('restore-banner');
  if (b) b.remove();
  window._pendingRestore = null;
}

function initStorageBanner() {
  let raw;
  try { raw = localStorage.getItem(_STORE_KEY); } catch(e) { return; }
  if (!raw) return;

  let snap;
  try { snap = JSON.parse(raw); } catch(e) { clearSession(); return; }
  if (!snap.savedAt || Date.now() - snap.savedAt > _STORE_TTL) { clearSession(); return; }

  const d = new Date(snap.savedAt).toLocaleString(
    (snap.lang || 'it') === 'it' ? 'it-IT' : 'en-GB'
  );

  const banner = document.createElement('div');
  banner.id = 'restore-banner';
  banner.innerHTML = `
    <div class="restore-inner">
      <span class="restore-text">💾 ${t('restoreBannerText')} — <em>${t('restoreDate')(d)}</em></span>
      <div class="restore-btns">
        <button class="btn btn-teal btn-sm" onclick="_restoreSession()">${t('restoreYes')}</button>
        <button class="btn btn-outline btn-sm" onclick="_dismissBanner()">${t('restoreNo')}</button>
      </div>
    </div>
  `;
  document.querySelector('header').insertAdjacentElement('afterend', banner);
  window._pendingRestore = snap;
}
