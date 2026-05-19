'use strict';
// ════════════════════════════════════════════════════════
//  SOCIAL ATTENTION TEST — first-saccade paradigm
//  Klin A, Jones W, et al. (2002). Am J Psychiatry.
//  Jones W, Klin A. (2013). Nature, 504, 427-431.
// ════════════════════════════════════════════════════════

// Generates a minimal SVG face with expression and gaze direction
function makeFaceSVG(expr, gaze) {
  const mouths = {
    happy:     'M 68 158 Q 100 178 132 158',
    neutral:   'M 73 162 Q 100 167 127 162',
    sad:       'M 68 170 Q 100 152 132 170',
    surprised: 'M 86 158 Q 100 175 114 158',
  };
  const dx = (gaze === 'averted') ? -8 : 0;
  return `<svg width="220" height="260" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="110" cy="138" rx="96" ry="115" fill="#f4c89a"/>
    <ellipse cx="110"  cy="50" rx="96" ry="55"  fill="#8d5524"/>
    <rect x="14" y="50" width="192" height="22" fill="#f4c89a"/>
    <path d="M 58 88 Q 78 80 98 86"   stroke="#5c3d2e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 122 86 Q 142 80 162 88" stroke="#5c3d2e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="78"  cy="108" rx="19" ry="13" fill="white"/>
    <circle  cx="${78+dx}"  cy="108" r="8"   fill="#5c3d2e"/>
    <circle  cx="${78+dx}"  cy="108" r="4"   fill="#1a0900"/>
    <circle  cx="${75+dx}"  cy="105" r="2.5" fill="white"/>
    <ellipse cx="142" cy="108" rx="19" ry="13" fill="white"/>
    <circle  cx="${142+dx}" cy="108" r="8"   fill="#5c3d2e"/>
    <circle  cx="${142+dx}" cy="108" r="4"   fill="#1a0900"/>
    <circle  cx="${139+dx}" cy="105" r="2.5" fill="white"/>
    <ellipse cx="110" cy="145" rx="8"  ry="6"  fill="#e8a87c"/>
    <path d="${mouths[expr] || mouths.neutral}" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function startSocialTest() {
  S.social.idx       = 0;
  S.social.responses = [];
  renderSocialTrial();
}

function renderSocialTrial() {
  const area = document.getElementById('social-area');
  const i    = S.social.idx;
  if (i >= FACE_CONFIGS.length) { socialDone(); return; }

  const cfg  = FACE_CONFIGS[i];
  const text = READING_TEXTS[LANG][i % READING_TEXTS[LANG].length];

  area.innerHTML = `
    <div class="reading-phase" id="reading-phase">
      <div class="reading-trial-num">${t('trialOf')(i + 1, FACE_CONFIGS.length)}</div>
      <p class="reading-label">${t('readLabel')}</p>
      <div class="reading-text">${text}</div>
      <p class="reading-hint">${t('readHint')}</p>
      <div class="reading-bar-wrap">
        <div class="reading-bar-fill" id="reading-bar"></div>
      </div>
    </div>

    <div id="face-container" style="display:none">
      <p style="font-size:13px;margin-bottom:8px;text-align:center;color:var(--text3)">
        ${t('faceOf')(i + 1, FACE_CONFIGS.length)}
      </p>
      <div class="face-wrap">
        <div id="face-svg">${makeFaceSVG(cfg.expr, cfg.gaze)}</div>
        <div id="face-overlay"></div>
      </div>
    </div>

    <p id="region-prompt" style="text-align:center;font-size:14px;color:var(--text2);display:none">
      ${t('whereFirst')}
    </p>
    <div class="face-regions" id="region-btns" style="display:none">
      <button class="region-btn" onclick="NS.socialPick('eyes')">${t('regionEyes')}</button>
      <button class="region-btn" onclick="NS.socialPick('nose')">${t('regionNose')}</button>
      <button class="region-btn" onclick="NS.socialPick('mouth')">${t('regionMouth')}</button>
      <button class="region-btn" onclick="NS.socialPick('other')">${t('regionOther')}</button>
      <button class="region-btn region-btn-wide" onclick="NS.socialPick('elsewhere')">${t('regionElsewhere')}</button>
    </div>
  `;

  const delay = 3000 + Math.random() * 2000;
  const bar   = document.getElementById('reading-bar');
  bar.style.transition = `width ${delay}ms linear`;
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));

  setTimeout(() => {
    const readingEl = document.getElementById('reading-phase');
    if (readingEl) readingEl.style.display = 'none';
    const container = document.getElementById('face-container');
    if (container) container.style.display = '';

    const overlay = document.getElementById('face-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay) overlay.style.opacity = '1'; }, 800);
    }

    setTimeout(() => {
      const prompt = document.getElementById('region-prompt');
      const btns   = document.getElementById('region-btns');
      if (prompt) prompt.style.display = '';
      if (btns)   btns.style.display   = 'grid';
    }, 800 + 250);
  }, delay);
}

function socialPick(region) {
  S.social.responses.push(region);
  S.social.idx++;
  if (S.social.idx < FACE_CONFIGS.length) renderSocialTrial();
  else socialDone();
}

function socialDone() {
  S.socialDone = true;
  const area     = document.getElementById('social-area');
  const seen     = S.social.responses.filter(r => r !== 'elsewhere');
  const eyeCount = S.social.responses.filter(r => r === 'eyes').length;
  const eyePct   = seen.length > 0 ? Math.round(eyeCount / seen.length * 100) : 0;
  const skipped  = S.social.responses.filter(r => r === 'elsewhere').length;

  area.innerHTML = `
    <p style="text-align:center;color:var(--teal2);font-weight:600;margin:16px 0">
      ${t('socialDoneText')(eyePct, seen.length, skipped)}
    </p>
    <p style="font-size:13px;text-align:center">${t('socialSaved')}</p>
    <div style="text-align:center;margin-top:20px">
      <button class="btn btn-primary" onclick="NS.goToWebcam()">${t('continueWebcam')}</button>
    </div>
  `;
}
