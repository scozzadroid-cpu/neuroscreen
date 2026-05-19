'use strict';
// ════════════════════════════════════════════════════════
//  LANGUAGE — global lang state + translation helper
//  UI object is defined in ui.js (loaded after this file)
// ════════════════════════════════════════════════════════

let LANG = 'it';

function t(k) {
  const v = UI[LANG][k];
  return v !== undefined ? v : k;
}
