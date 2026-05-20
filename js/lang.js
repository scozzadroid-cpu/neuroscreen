'use strict';
// ════════════════════════════════════════════════════════
//  LANGUAGE — global lang state + translation helper
//  UI object is defined in ui.js (loaded after this file)
// ════════════════════════════════════════════════════════

let LANG = (() => {
  try {
    const s = localStorage.getItem('ns_pref_lang');
    if (s === 'it' || s === 'en') return s;
  } catch(e) {}
  return (navigator.language || 'it').toLowerCase().startsWith('it') ? 'it' : 'en';
})();

function t(k) {
  const v = UI[LANG][k];
  return v !== undefined ? v : k;
}
