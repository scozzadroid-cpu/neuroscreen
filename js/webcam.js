'use strict';
// ════════════════════════════════════════════════════════
//  WEBCAM / EYE TRACKING — MediaPipe FaceMesh
//  Phase 1 (30 s): EAR blink rate during mycelium reading.
//  Phase 2 (15 s): iris gaze stability during 3-D fixation.
//  EAR: Soukupová T, Čech J (2016). CVWW.
//  Blink norms: Bentivoglio AR, et al. (1997). Mov Disord.
//  Gaze stability: Falck-Ytter T, et al. (2013). J Autism Dev Disord.
// ════════════════════════════════════════════════════════

const EYE_L  = [362, 385, 387, 263, 373, 380];
const EYE_R  = [33,  160, 158, 133, 153, 144];
const IRIS_L = [468, 469, 470, 471, 472];
const IRIS_R = [473, 474, 475, 476, 477];

const PHASE_READ_MS    = 30000;
const PHASE_PURSUIT_MS = 15000;

// ── 3-D icosahedron (12 vertices, 30 edges) ─────────────
const _ICO_PHI = (1 + Math.sqrt(5)) / 2;
const _ICO_V   = [
  [ 0,  1,  _ICO_PHI], [ 0, -1,  _ICO_PHI],
  [ 0,  1, -_ICO_PHI], [ 0, -1, -_ICO_PHI],
  [ 1,  _ICO_PHI, 0],  [-1,  _ICO_PHI, 0],
  [ 1, -_ICO_PHI, 0],  [-1, -_ICO_PHI, 0],
  [ _ICO_PHI, 0,  1],  [-_ICO_PHI, 0,  1],
  [ _ICO_PHI, 0, -1],  [-_ICO_PHI, 0, -1],
].map(v => {
  const n = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return [v[0]/n, v[1]/n, v[2]/n];
});
const _ICO_E = [
  [0,1],[0,4],[0,5],[0,8],[0,9],
  [1,6],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,5],[2,10],[2,11],
  [3,6],[3,7],[3,10],[3,11],
  [4,5],[4,8],[4,10],
  [5,9],[5,11],
  [6,7],[6,8],[6,10],
  [7,9],[7,11],
  [8,10],[9,11],
];

let _previewStream = null;
let _shapeRAF      = null;

// ── Eye Aspect Ratio ─────────────────────────────────────
function earScore(landmarks, pts) {
  const p = i => landmarks[pts[i]];
  const d = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  return (d(p(1), p(5)) + d(p(2), p(4))) / (2 * d(p(0), p(3)));
}

// ── Icosahedron wireframe renderer ───────────────────────
function _drawShape(canvas, t) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = Math.min(W, H) * 0.38;
  ctx.clearRect(0, 0, W, H);

  const ay = t * 0.65, ax = t * 0.28;
  const cay = Math.cos(ay), say = Math.sin(ay);
  const cax = Math.cos(ax), sax = Math.sin(ax);

  const proj = _ICO_V.map(([x, y, z]) => {
    const x1 =  x * cay + z * say;
    const z1 = -x * say + z * cay;
    const y2 =  y * cax - z1 * sax;
    const z2 =  y * sax + z1 * cax;
    const d  = z2 + 2.8;
    return { sx: cx + scale * x1 / d, sy: cy + scale * y2 / d, z: z2 };
  });

  _ICO_E.forEach(([a, b]) => {
    const pa = proj[a], pb = proj[b];
    const alpha = (0.2 + 0.65 * ((pa.z + pb.z) / 2 + 1) / 2).toFixed(2);
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.strokeStyle = `rgba(124,107,236,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Fixation target at centre
  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(124,107,236,0.85)'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();
}

// ── Instructions screen ──────────────────────────────────
function renderWebcamScreen() {
  const el     = document.getElementById('screen-webcam');
  const onHTTP = location.protocol.startsWith('http');

  el.innerHTML = `
    <div class="card" id="wcam-card">
      <span class="badge badge-teal">${t('badgeWebcam')}</span>
      <h2>${t('webcamTitle')}</h2>
      ${!onHTTP ? `<div class="server-notice">${t('webcamNoHTTP')}</div>` : ''}

      <!-- SETUP INSTRUCTIONS -->
      <div id="wcam-setup">
        <div class="webcam-privacy-box">🔒 ${t('webcamPrivacy')}</div>

        <p class="webcam-section-label">${t('webcamSetupTitle')}</p>
        <ul class="webcam-tips">
          <li>${t('webcamSetupClean')}</li>
          <li>${t('webcamSetupLight')}</li>
          <li>${t('webcamSetupDist')}</li>
        </ul>

        <p class="webcam-section-label" style="margin-top:16px">${t('webcamPhasesTitle')}</p>
        <ul class="webcam-tips">
          <li>${t('webcamPhase1Desc')}</li>
          <li>${t('webcamPhase2Desc')}</li>
        </ul>

        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px">
          ${onHTTP ? `
            <button class="btn btn-outline" id="cam-preview-btn" onclick="NS.camShowPreview()">${t('webcamPreviewBtn')}</button>
            <button class="btn btn-primary"  id="cam-start-btn"  onclick="NS.camStart()">${t('webcamStart')}</button>
          ` : ''}
          <button class="btn btn-outline" onclick="NS.skipWebcam()">${t('webcamSkip')}</button>
        </div>
      </div>

      <!-- WEBCAM PREVIEW -->
      <div id="wcam-preview" style="display:none">
        <p style="font-size:14px;color:var(--text2);margin:0 0 12px">${t('webcamPreviewTitle')}</p>
        <div style="display:inline-block;border-radius:8px;overflow:hidden;background:#111;line-height:0">
          <video id="cam-video-preview" autoplay muted playsinline
            style="width:320px;height:240px;display:block;transform:scaleX(-1)"></video>
        </div>
        <p style="font-size:13px;color:var(--text2);margin:10px 0 18px">${t('webcamPreviewHint')}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-outline" onclick="NS.camStopPreview(false)">${t('prevBtn')}</button>
          <button class="btn btn-primary"  onclick="NS.camStopPreview(true)">${t('webcamStartTest')}</button>
          <button class="btn btn-outline" onclick="NS.skipWebcam()">${t('webcamSkip')}</button>
        </div>
      </div>

      <!-- TEST (phases 1 & 2) -->
      <div id="wcam-test" style="display:none">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
          <div style="position:relative;width:160px;height:120px;flex-shrink:0">
            <video id="cam-video" autoplay muted playsinline
              style="width:160px;height:120px;border-radius:6px;background:#111;display:block;object-fit:cover"></video>
            <canvas id="cam-canvas" width="160" height="120"
              style="position:absolute;top:0;left:0;width:160px;height:120px;pointer-events:none"></canvas>
          </div>
          <span id="cam-status"
            style="font-size:12px;color:var(--text2);line-height:1.5;flex:1">${t('webcamLoading')}</span>
        </div>

        <!-- Phase 1: reading -->
        <div id="wcam-reading">
          <p style="font-size:11px;font-weight:700;color:var(--teal2);letter-spacing:.07em;text-transform:uppercase;margin:0 0 8px">
            ${t('webcamReadLabel')}
          </p>
          <div class="reading-text" id="wcam-text"></div>
          <div class="reading-bar-wrap" style="margin-top:10px">
            <div class="reading-bar-fill" id="wcam-bar"></div>
          </div>
        </div>

        <!-- Phase 2: 3-D shape -->
        <div id="wcam-shape-wrap" style="display:none;text-align:center;margin-top:4px">
          <p style="font-size:11px;font-weight:700;color:var(--teal2);letter-spacing:.07em;text-transform:uppercase;margin:0 0 10px">
            ${t('webcamShapeLabel')}
          </p>
          <canvas id="shape-canvas" width="280" height="280"
            style="border-radius:12px;background:var(--surf2);display:inline-block"></canvas>
          <div class="reading-bar-wrap" style="margin-top:10px">
            <div class="reading-bar-fill" id="wcam-bar2"></div>
          </div>
        </div>

        <!-- Live metrics -->
        <div class="metric-row" id="cam-metrics" style="display:none">
          <div class="metric-card">
            <div class="metric-val" id="m-blinks">—</div>
            <div class="metric-lbl">${t('blinkTotal')}</div>
          </div>
          <div class="metric-card">
            <div class="metric-val" id="m-bpm">—</div>
            <div class="metric-lbl">${t('blinkPerMin')}</div>
          </div>
          <div class="metric-card">
            <div class="metric-val" id="m-ear">—</div>
            <div class="metric-lbl">${t('earMean')}</div>
          </div>
          <div class="metric-card" id="m-gaze-card" style="display:none">
            <div class="metric-val" id="m-gaze">—</div>
            <div class="metric-lbl">${t('gazeStability')}</div>
          </div>
        </div>
      </div>

      <div id="webcam-btns" style="margin-top:12px"></div>
    </div>
  `;
}

// ── Webcam preview ───────────────────────────────────────
async function camShowPreview() {
  const btn = document.getElementById('cam-preview-btn');
  if (btn) { btn.disabled = true; btn.textContent = '…'; }

  try {
    _previewStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: 'user' },
    });
    document.getElementById('cam-video-preview').srcObject = _previewStream;
  } catch (_) {
    if (btn) { btn.disabled = false; btn.textContent = t('webcamPreviewBtn'); }
    return;
  }

  document.getElementById('wcam-setup').style.display   = 'none';
  document.getElementById('wcam-preview').style.display = '';
}

function camStopPreview(startTest) {
  if (_previewStream) {
    _previewStream.getTracks().forEach(tk => tk.stop());
    _previewStream = null;
  }
  document.getElementById('wcam-preview').style.display = 'none';
  if (startTest) {
    camStart();
  } else {
    document.getElementById('wcam-setup').style.display = '';
    const btn = document.getElementById('cam-preview-btn');
    if (btn) btn.disabled = false;
  }
}

// ── Main test entry ──────────────────────────────────────
async function camStart() {
  if (_previewStream) {
    _previewStream.getTracks().forEach(tk => tk.stop());
    _previewStream = null;
  }

  const startBtn   = document.getElementById('cam-start-btn');
  const previewBtn = document.getElementById('cam-preview-btn');
  if (startBtn)   startBtn.disabled   = true;
  if (previewBtn) previewBtn.disabled = true;

  document.getElementById('wcam-setup').style.display = 'none';
  document.getElementById('wcam-test').style.display  = '';
  document.getElementById('cam-status').textContent   = t('webcamLoading');

  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js');

  document.getElementById('cam-status').textContent = t('webcamInit');

  const videoEl  = document.getElementById('cam-video');
  const canvasEl = document.getElementById('cam-canvas');
  const ctx      = canvasEl.getContext('2d');
  const e        = S.eye;

  e.blinkCount    = 0;
  e.lastEAR       = 1;
  e.inBlink       = false;
  e.trackStart    = null;
  e.phase         = 'reading';
  e.pursuitStart  = null;
  e.gazePositions = [];
  e.gazeStdev     = null;

  const EAR_THRESH = 0.21;
  const EAR_CONSEC = 2;
  let   earBuf     = 0;
  const earHistory = [];

  const faceMesh = new window.FaceMesh({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${f}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1, refineLandmarks: true,
    minDetectionConfidence: 0.5, minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(results => {
    ctx.clearRect(0, 0, 160, 120);
    if (!e.trackStart) return;

    if (!results.multiFaceLandmarks || !results.multiFaceLandmarks.length) {
      document.getElementById('cam-status').textContent = t('webcamNoFace');
      return;
    }

    const lm   = results.multiFaceLandmarks[0];
    const earL = earScore(lm, EYE_L);
    const earR = earScore(lm, EYE_R);
    const ear  = (earL + earR) / 2;

    earHistory.push(ear);
    if (earHistory.length > 90) earHistory.shift();

    if (ear < EAR_THRESH) {
      earBuf++;
      if (earBuf >= EAR_CONSEC && !e.inBlink) { e.blinkCount++; e.inBlink = true; }
    } else { earBuf = 0; e.inBlink = false; }

    const elapsed = (performance.now() - e.trackStart) / 1000;
    const earAvg  = earHistory.length
      ? (earHistory.reduce((a, b) => a + b, 0) / earHistory.length).toFixed(3) : '—';
    const bpmLive = elapsed > 0 ? (e.blinkCount / elapsed * 60).toFixed(1) : '—';

    document.getElementById('m-blinks').textContent = e.blinkCount;
    document.getElementById('m-bpm').textContent    = bpmLive;
    document.getElementById('m-ear').textContent    = earAvg;

    if (e.phase === 'reading') {
      const remSec = Math.max(0, Math.ceil(PHASE_READ_MS / 1000 - elapsed));
      document.getElementById('cam-status').textContent = t('webcamActiveRead')(remSec);

      ctx.fillStyle = '#7c6bec';
      [...EYE_L, ...EYE_R].forEach(idx => {
        const pt = lm[idx];
        ctx.beginPath(); ctx.arc(pt.x * 160, pt.y * 120, 2, 0, Math.PI * 2); ctx.fill();
      });

      if (elapsed * 1000 >= PHASE_READ_MS) _startPursuitPhase(e);

    } else if (e.phase === 'pursuit') {
      const pursuitElapsed = (performance.now() - e.pursuitStart) / 1000;
      const remSec = Math.max(0, Math.ceil(PHASE_PURSUIT_MS / 1000 - pursuitElapsed));
      document.getElementById('cam-status').textContent = t('webcamActivePursuit')(remSec);

      if (lm.length > 477) {
        const avg = pts => ({
          x: pts.reduce((s, i) => s + lm[i].x, 0) / pts.length,
          y: pts.reduce((s, i) => s + lm[i].y, 0) / pts.length,
        });
        const cl = avg(IRIS_L), cr = avg(IRIS_R);
        const gx = (cl.x + cr.x) / 2, gy = (cl.y + cr.y) / 2;
        const ow = Math.abs(lm[33].x - lm[263].x);
        if (ow > 0.01) e.gazePositions.push({ x: gx / ow, y: gy / ow });

        const gazeCard = document.getElementById('m-gaze-card');
        if (gazeCard && gazeCard.style.display === 'none') {
          gazeCard.style.display = '';
          document.getElementById('cam-metrics').style.gridTemplateColumns = 'repeat(4,1fr)';
        }
        document.getElementById('m-gaze').textContent = e.gazePositions.length;

        ctx.fillStyle = '#e74c3c';
        [...IRIS_L, ...IRIS_R].forEach(idx => {
          const pt = lm[idx];
          ctx.beginPath(); ctx.arc(pt.x * 160, pt.y * 120, 1.5, 0, Math.PI * 2); ctx.fill();
        });
      }

      if (pursuitElapsed * 1000 >= PHASE_PURSUIT_MS) camStop();
    }
  });

  e.faceMesh = faceMesh;
  const camera = new window.Camera(videoEl, {
    onFrame: async () => { if (e.running) await faceMesh.send({ image: videoEl }); },
    width: 160, height: 120,
  });

  await camera.start();
  e.camera     = camera;
  e.running    = true;
  e.trackStart = performance.now();

  document.getElementById('cam-metrics').style.display = 'grid';

  const wcamText = document.getElementById('wcam-text');
  if (wcamText) wcamText.textContent = WEBCAM_TEXT[LANG];
  const bar = document.getElementById('wcam-bar');
  if (bar) {
    bar.style.transition = `width ${PHASE_READ_MS}ms linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));
  }
}

// ── Phase 2: gaze stability on 3-D shape ────────────────
function _startPursuitPhase(e) {
  if (e.phase !== 'reading') return;
  e.phase        = 'pursuit';
  e.pursuitStart = performance.now();

  const readDiv   = document.getElementById('wcam-reading');
  const shapeWrap = document.getElementById('wcam-shape-wrap');
  if (readDiv)   readDiv.style.display   = 'none';
  if (shapeWrap) shapeWrap.style.display = '';

  const bar2 = document.getElementById('wcam-bar2');
  if (bar2) {
    bar2.style.transition = `width ${PHASE_PURSUIT_MS}ms linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar2.style.width = '100%'; }));
  }

  const shapeCanvas = document.getElementById('shape-canvas');
  let lastTime = performance.now(), shapeTime = 0;

  function animateShape(now) {
    shapeTime += (now - lastTime) / 1000;
    lastTime = now;
    if (shapeCanvas) _drawShape(shapeCanvas, shapeTime);
    if (e.phase === 'pursuit' && e.running) _shapeRAF = requestAnimationFrame(animateShape);
  }
  _shapeRAF = requestAnimationFrame(animateShape);
}

// ── Stop and compute results ─────────────────────────────
function camStop() {
  const e = S.eye;
  if (!e.running) return;
  e.running = false;
  e.phase   = 'done';

  if (_shapeRAF) { cancelAnimationFrame(_shapeRAF); _shapeRAF = null; }
  if (e.camera)   e.camera.stop();
  if (e.faceMesh) e.faceMesh.close();

  const totalElapsed = e.trackStart ? (performance.now() - e.trackStart) / 1000 : 0;
  e.duration = totalElapsed;
  e.bpm      = totalElapsed > 0 ? e.blinkCount / totalElapsed * 60 : 0;

  if (e.gazePositions.length > 5) {
    const xs   = e.gazePositions.map(p => p.x);
    const ys   = e.gazePositions.map(p => p.y);
    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std  = arr => {
      const m = mean(arr);
      return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
    };
    e.gazeStdev = std(xs) + std(ys);
  }

  const statusEl = document.getElementById('cam-status');
  if (statusEl) statusEl.textContent = t('webcamDone');

  const btns = document.getElementById('webcam-btns');
  if (btns) btns.innerHTML = `
    <button class="btn btn-primary" onclick="NS.goToResults()">${t('webcamResults')}</button>
  `;
}

// ── Script loader ────────────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
