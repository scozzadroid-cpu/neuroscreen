'use strict';
// ════════════════════════════════════════════════════════
//  WEBCAM / EYE TRACKING — MediaPipe FaceMesh + EAR blink
//  EAR method: Soukupová T, Čech J (2016). CVWW.
//  Blink rate norms: Bentivoglio AR, et al. (1997). Mov Disord.
// ════════════════════════════════════════════════════════

// FaceMesh 468-point landmark indices for eye contours
const EYE_L = [362, 385, 387, 263, 373, 380];
const EYE_R = [33,  160, 158, 133, 153, 144];

// Eye Aspect Ratio: (d(p1,p5) + d(p2,p4)) / (2 * d(p0,p3))
function earScore(landmarks, pts) {
  const p = (i) => landmarks[pts[i]];
  const d = (a, b) => {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
  };
  return (d(p(1), p(5)) + d(p(2), p(4))) / (2 * d(p(0), p(3)));
}

function renderWebcamScreen() {
  const el     = document.getElementById('screen-webcam');
  const onHTTP = location.protocol.startsWith('http');

  el.innerHTML = `
    <div class="card">
      <span class="badge badge-teal">${t('badgeWebcam')}</span>
      <h2>${t('webcamTitle')}</h2>

      ${!onHTTP ? `<div class="server-notice">${t('webcamNoHTTP')}</div>` : ''}

      <p>${t('webcamDesc')}</p>
      <ul style="margin:8px 0 16px;padding-left:20px;font-size:14px;color:var(--text2)">
        <li>${t('webcamBlink')}</li>
        <li>${t('webcamEAR')}</li>
        <li>${t('webcamGaze')}</li>
      </ul>

      <div id="webcam-area">
        ${onHTTP ? `
          <div id="webcam-wrap" style="display:none">
            <video id="cam-video" autoplay muted playsinline></video>
            <canvas id="cam-canvas" width="320" height="240"></canvas>
            <span class="cam-status" id="cam-status">${t('webcamLoading')}</span>
          </div>
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
          </div>
        ` : ''}
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px" id="webcam-btns">
        ${onHTTP ? `<button class="btn btn-primary" id="cam-start-btn" onclick="NS.camStart()">${t('webcamStart')}</button>` : ''}
        <button class="btn btn-outline" onclick="NS.skipWebcam()">${t('webcamSkip')}</button>
      </div>
    </div>
  `;
}

async function camStart() {
  const btn = document.getElementById('cam-start-btn');
  if (btn) btn.disabled = true;

  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js');

  document.getElementById('webcam-wrap').style.display  = '';
  document.getElementById('cam-metrics').style.display  = 'grid';
  document.getElementById('cam-status').textContent     = t('webcamInit');

  const videoEl  = document.getElementById('cam-video');
  const canvasEl = document.getElementById('cam-canvas');
  const ctx      = canvasEl.getContext('2d');
  const e        = S.eye;

  e.blinkCount = 0; e.lastEAR = 1; e.inBlink = false; e.trackStart = null;

  const EAR_THRESH  = 0.21;
  const EAR_CONSEC  = 2;
  let   earBuf      = 0;
  const earHistory  = [];

  const faceMesh = new window.FaceMesh({
    locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${f}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1, refineLandmarks: true,
    minDetectionConfidence: 0.5, minTrackingConfidence: 0.5,
  });

  faceMesh.onResults((results) => {
    ctx.clearRect(0, 0, 320, 240);
    if (!e.trackStart) return;

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
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

    ctx.fillStyle = '#7c6bec';
    [...EYE_L, ...EYE_R].forEach(idx => {
      const pt = lm[idx];
      ctx.beginPath();
      ctx.arc(pt.x * 320, pt.y * 240, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    const elapsed = (performance.now() - e.trackStart) / 1000;
    const bpm     = elapsed > 0 ? (e.blinkCount / elapsed * 60).toFixed(1) : '—';
    const earAvg  = earHistory.length > 0
      ? (earHistory.reduce((a, b) => a + b, 0) / earHistory.length).toFixed(3) : '—';

    document.getElementById('m-blinks').textContent  = e.blinkCount;
    document.getElementById('m-bpm').textContent     = bpm;
    document.getElementById('m-ear').textContent     = earAvg;
    document.getElementById('cam-status').textContent =
      t('webcamActive')(Math.ceil(Math.max(0, 30 - elapsed)));

    if (elapsed >= 30) camStop();
  });

  e.faceMesh = faceMesh;
  const camera = new window.Camera(videoEl, {
    onFrame: async () => { await faceMesh.send({ image: videoEl }); },
    width: 320, height: 240,
  });

  await camera.start();
  e.camera     = camera;
  e.running    = true;
  e.trackStart = performance.now();
  document.getElementById('cam-status').textContent = t('webcamActive')(30);
}

function camStop() {
  const e = S.eye;
  if (!e.running) return;
  e.running = false;
  if (e.camera)   e.camera.stop();
  if (e.faceMesh) e.faceMesh.close();

  const elapsed = e.trackStart ? (performance.now() - e.trackStart) / 1000 : 0;
  e.duration    = elapsed;
  e.bpm         = elapsed > 0 ? e.blinkCount / elapsed * 60 : 0;

  document.getElementById('cam-status').textContent = t('webcamDone');
  const btns = document.getElementById('webcam-btns');
  if (btns) btns.innerHTML = `
    <button class="btn btn-primary" onclick="NS.goToResults()">${t('webcamResults')}</button>
  `;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
