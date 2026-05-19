'use strict';
// ════════════════════════════════════════════════════════
//  SOCIAL ATTENTION TEST — first-saccade paradigm
//  Klin A, Jones W, et al. (2002). Am J Psychiatry.
//  Jones W, Klin A. (2013). Nature, 504, 427-431.
// ════════════════════════════════════════════════════════

let _socialReadTimeout    = null;
let _currentTrialUnread   = false;

// Skin/hair/iris palettes for face diversity
const _FACE_PALETTES = [
  { skin: '#FDEBD0', dark: '#D4A574', hair: '#3D2B1F', iris: '#6B4E3D', brow: '#3D2B1F', lip: '#C87878' },
  { skin: '#F5CBA7', dark: '#C99B6D', hair: '#5C3D2E', iris: '#7B5C4F', brow: '#5C3D2E', lip: '#C06055' },
  { skin: '#E8A87C', dark: '#C07840', hair: '#2C1810', iris: '#8B6040', brow: '#2C1810', lip: '#B05040' },
  { skin: '#C68642', dark: '#9A6020', hair: '#1A0A00', iris: '#6B3A2A', brow: '#1A0A00', lip: '#984030' },
  { skin: '#8D5524', dark: '#6A3A10', hair: '#0D0600', iris: '#3D2010', brow: '#0D0600', lip: '#783028' },
  { skin: '#F0D9C0', dark: '#C8A880', hair: '#8B7355', iris: '#7B9AA0', brow: '#8B7355', lip: '#C87878' },
];

// Generates a detailed SVG face with expression and gaze direction
function makeFaceSVG(expr, gaze, skinIdx) {
  const p  = _FACE_PALETTES[skinIdx % _FACE_PALETTES.length] || _FACE_PALETTES[0];
  const dx = (gaze === 'averted') ? -11 : 0;

  const mouths = {
    happy:     `M 62 162 Q 100 182 138 162`,
    neutral:   `M 70 165 Q 100 170 130 165`,
    sad:       `M 62 172 Q 100 155 138 172`,
    surprised: `M 88 158 Q 88 178 100 180 Q 112 178 112 158 Q 112 148 100 146 Q 88 148 88 158`,
  };

  const lx = 78, rx = 142, ey = 115;

  return `<svg width="220" height="270" viewBox="0 0 220 270" xmlns="http://www.w3.org/2000/svg">
    <!-- Hair / head top -->
    <ellipse cx="110" cy="58"  rx="92" ry="60" fill="${p.hair}"/>
    <!-- Face oval -->
    <ellipse cx="110" cy="150" rx="90" ry="108" fill="${p.skin}"/>
    <!-- Hair overlap cover so hair only shows above forehead -->
    <rect x="20" y="58" width="180" height="30" fill="${p.skin}"/>
    <!-- Ears -->
    <ellipse cx="21"  cy="148" rx="14" ry="19" fill="${p.skin}"/>
    <ellipse cx="199" cy="148" rx="14" ry="19" fill="${p.skin}"/>
    <path d="M 23 135 Q 14 148 23 161" stroke="${p.dark}" stroke-width="1.5" fill="none"/>
    <path d="M 197 135 Q 206 148 197 161" stroke="${p.dark}" stroke-width="1.5" fill="none"/>
    <!-- Eyebrows -->
    <path d="M 57 97 Q 78 89 99 93"   stroke="${p.brow}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 121 93 Q 142 89 163 97" stroke="${p.brow}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Eye whites -->
    <ellipse cx="${lx}" cy="${ey}" rx="22" ry="15" fill="white"/>
    <ellipse cx="${rx}" cy="${ey}" rx="22" ry="15" fill="white"/>
    <!-- Irises -->
    <circle cx="${lx+dx}" cy="${ey}" r="10" fill="${p.iris}"/>
    <circle cx="${rx+dx}" cy="${ey}" r="10" fill="${p.iris}"/>
    <!-- Pupils -->
    <circle cx="${lx+dx}" cy="${ey}" r="5.5" fill="#100800"/>
    <circle cx="${rx+dx}" cy="${ey}" r="5.5" fill="#100800"/>
    <!-- Eye highlights -->
    <circle cx="${lx+dx-3}" cy="${ey-3}" r="2.5" fill="white"/>
    <circle cx="${rx+dx-3}" cy="${ey-3}" r="2.5" fill="white"/>
    <!-- Upper eyelid line -->
    <path d="M ${lx-22} ${ey-6} Q ${lx} ${ey-16} ${lx+22} ${ey-6}" stroke="${p.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M ${rx-22} ${ey-6} Q ${rx} ${ey-16} ${rx+22} ${ey-6}" stroke="${p.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Nose bridge + nostrils -->
    <path d="M 105 128 L 100 155" stroke="${p.dark}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 115 128 L 120 155" stroke="${p.dark}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 96 158 Q 100 163 110 162 Q 120 163 124 158" stroke="${p.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Mouth -->
    <path d="${mouths[expr] || mouths.neutral}" stroke="${p.lip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${expr === 'happy' ? `<path d="M 62 162 Q 100 182 138 162" stroke="none" fill="rgba(200,80,70,0.12)"/>` : ''}
  </svg>`;
}

function startSocialTest() {
  S.social.idx       = 0;
  S.social.responses = [];
  renderSocialTrial();
}

function renderSocialTrial() {
  if (_socialReadTimeout) { clearTimeout(_socialReadTimeout); _socialReadTimeout = null; }
  _currentTrialUnread = false;

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
      <div style="margin-top:12px;text-align:right">
        <button class="btn btn-sm region-btn-wide" onclick="NS.socialDistracted()" style="font-size:12px;padding:6px 14px">
          ${t('socialDistracted')}
        </button>
      </div>
    </div>

    <div id="face-container" style="display:none">
      <p style="font-size:13px;margin-bottom:8px;text-align:center;color:var(--text3)">
        ${t('faceOf')(i + 1, FACE_CONFIGS.length)}
      </p>
      <div class="face-wrap">
        <div id="face-svg">${makeFaceSVG(cfg.expr, cfg.gaze, cfg.skin || 0)}</div>
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

  const delay = 10000 + Math.random() * 3000;
  const bar   = document.getElementById('reading-bar');
  bar.style.transition = `width ${delay}ms linear`;
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));

  _socialReadTimeout = setTimeout(() => {
    _socialReadTimeout = null;
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

function socialDistracted() {
  if (_socialReadTimeout) { clearTimeout(_socialReadTimeout); _socialReadTimeout = null; }
  _currentTrialUnread = true;

  const readingEl = document.getElementById('reading-phase');
  if (readingEl) readingEl.style.display = 'none';

  const container = document.getElementById('face-container');
  if (container) container.style.display = '';

  const overlay = document.getElementById('face-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => { if (overlay) overlay.style.opacity = '1'; }, 400);
  }
  setTimeout(() => {
    const prompt = document.getElementById('region-prompt');
    const btns   = document.getElementById('region-btns');
    if (prompt) prompt.style.display = '';
    if (btns)   btns.style.display   = 'grid';
  }, 650);
}

function socialPick(region) {
  S.social.responses.push({ region, notRead: _currentTrialUnread });
  _currentTrialUnread = false;
  S.social.idx++;
  if (S.social.idx < FACE_CONFIGS.length) renderSocialTrial();
  else socialDone();
}

function socialDone() {
  S.socialDone = true;
  const area     = document.getElementById('social-area');
  const regionOf = r => (typeof r === 'string' ? r : r.region);
  const seen     = S.social.responses.filter(r => regionOf(r) !== 'elsewhere');
  const eyeCount = S.social.responses.filter(r => regionOf(r) === 'eyes').length;
  const eyePct   = seen.length > 0 ? Math.round(eyeCount / seen.length * 100) : 0;
  const skipped  = S.social.responses.filter(r => regionOf(r) === 'elsewhere').length;
  const webcamPending = S.tests.webcam && S.eye.phase !== 'done' && !S.webcamSkipped;

  area.innerHTML = `
    <p style="text-align:center;color:var(--teal2);font-weight:600;margin:16px 0">
      ${t('socialDoneText')(eyePct, seen.length, skipped)}
    </p>
    <p style="font-size:13px;text-align:center">${t('socialSaved')}</p>
    <div style="text-align:center;margin-top:20px">
      <button class="btn btn-primary" onclick="NS.goToWebcam()">${webcamPending ? t('continueWebcam') : t('goToResults')}</button>
    </div>
  `;
}
