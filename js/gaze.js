'use strict';
// ════════════════════════════════════════════════════════
//  GAZE — optional webcam gaze estimation for the social test
//  WebGazer.js (Papoutsaki et al. 2016), loaded at runtime from CDN.
//  Precision is low (typically 100-200 px); results are experimental.
// ════════════════════════════════════════════════════════

const _gaze = {
  ready: false,
  collecting: false,
  buf: [],
  precisionPx: null,
};

function _onGaze(data) {
  if (!data || !_gaze.collecting) return;
  _gaze.buf.push({ x: data.x, y: data.y, t: performance.now() });
}

async function gazeInit() {
  if (_gaze.ready) return true;
  try {
    if (typeof window.webgazer === 'undefined') await loadScript(WEBGAZER_SRC);
    const wg = window.webgazer;
    wg.saveDataAcrossSessions(false);
    wg.setRegression('ridge').setGazeListener(_onGaze);
    await wg.begin();
    wg.showPredictionPoints(false);
    wg.showFaceOverlay(false);
    wg.showFaceFeedbackBox(true);
    wg.showVideoPreview(true);
    if (wg.applyKalmanFilter) wg.applyKalmanFilter(true);
    _gaze.ready = true;
    return true;
  } catch (e) {
    console.warn('Gaze init failed', e);
    gazeStop();
    return false;
  }
}

// 9-point click calibration followed by a 3-second accuracy check on the centre point
function gazeCalibrate(container, onDone) {
  const pts = [[10, 10], [50, 10], [90, 10], [10, 50], [50, 50], [90, 50], [10, 90], [50, 90], [90, 90]];
  const CLICKS = 5;
  const layer = document.createElement('div');
  layer.className = 'gaze-calib';
  layer.innerHTML = `<p class="gaze-calib-text">${t('gazeCalibInstr')}</p>`;
  document.body.appendChild(layer);

  let done = 0;
  pts.forEach(([px, py]) => {
    const dot = document.createElement('button');
    dot.className = 'gaze-dot';
    dot.style.left = px + '%';
    dot.style.top  = py + '%';
    let n = 0;
    dot.onclick = () => {
      n++;
      dot.style.opacity = String(1 - n / (CLICKS + 1));
      if (n >= CLICKS) {
        dot.disabled = true;
        dot.style.visibility = 'hidden';
        if (++done === pts.length) _gazeAccuracyCheck(layer, onDone);
      }
    };
    layer.appendChild(dot);
  });
}

function _gazeAccuracyCheck(layer, onDone) {
  layer.innerHTML = `<p class="gaze-calib-text">${t('gazeCheckInstr')}</p><div class="gaze-dot gaze-dot-target" style="left:50%;top:50%"></div>`;
  window.webgazer.removeMouseEventListeners();
  setTimeout(() => {
    _gaze.buf = [];
    _gaze.collecting = true;
    setTimeout(() => {
      _gaze.collecting = false;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const d = _gaze.buf.map(p => Math.hypot(p.x - cx, p.y - cy));
      _gaze.precisionPx = d.length ? Math.round(d.reduce((a, b) => a + b, 0) / d.length) : null;
      _gaze.buf = [];
      layer.remove();
      onDone(_gaze.precisionPx);
    }, 2000);
  }, 1000);
}

function gazeHidePreview() {
  try {
    window.webgazer.showVideoPreview(false);
    window.webgazer.showFaceFeedbackBox(false);
  } catch (e) {}
}

function gazeBeginTrial() {
  if (!_gaze.ready) return;
  _gaze.buf = [];
  _gaze.collecting = true;
}

// Classifies samples relative to the face SVG currently on screen
function gazeEndTrial() {
  if (!_gaze.ready) return null;
  _gaze.collecting = false;
  const svg = document.querySelector('#face-svg svg, #face-svg img');
  const samples = _gaze.buf;
  _gaze.buf = [];
  if (!svg || samples.length === 0) return { first: 'none', eyeDwell: null, n: 0 };

  const r = svg.getBoundingClientRect();
  const sx = 220 / r.width, sy = 270 / r.height;
  const regionOf = p => {
    const x = (p.x - r.left) * sx, y = (p.y - r.top) * sy;
    const f = GAZE_REGIONS.face;
    if (((x - f.cx) / f.rx) ** 2 + ((y - f.cy) / f.ry) ** 2 > 1) return 'off';
    const inBox = b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;
    if (inBox(GAZE_REGIONS.eyes))  return 'eyes';
    if (inBox(GAZE_REGIONS.mouth)) return 'mouth';
    return 'face';
  };
  const regions = samples.map(regionOf);
  const onFace = regions.filter(g => g !== 'off');
  const first = onFace.length ? onFace[0] : 'off';
  const eyeDwell = onFace.length ? Math.round(onFace.filter(g => g === 'eyes').length / onFace.length * 100) : null;
  return { first, eyeDwell, n: samples.length };
}

function gazeStop() {
  _gaze.collecting = false;
  _gaze.ready = false;
  try { if (window.webgazer) window.webgazer.end(); } catch (e) {}
  document.querySelectorAll('.gaze-calib').forEach(el => el.remove());
}
