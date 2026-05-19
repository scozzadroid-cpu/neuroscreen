'use strict';
// ════════════════════════════════════════════════════════
//  TASKS SCREEN — outer shell HTML (CPT + Social cards)
//  CPT logic: cpt.js  |  Social logic: social.js
// ════════════════════════════════════════════════════════

function renderTasksScreen() {
  const hasCpt    = S.tests.cpt;
  const hasSocial = S.tests.social;
  const el = document.getElementById('screen-tasks');

  el.innerHTML = `
    ${hasCpt ? `
    <div class="card" id="cpt-card">
      <span class="badge badge-warn">${t('badgeCpt')}</span>
      <h2>${t('cptTitle')}</h2>
      <p>${t('cptInstr')}</p>
      <p style="font-size:13px">${t('cptNote')}</p>

      <div class="cpt-box" id="cpt-area">
        <div class="timer-wrap" id="cpt-timer-wrap" style="display:none">
          <div class="timer-bar">
            <div class="timer-fill" id="cpt-timer-fill" style="width:100%"></div>
          </div>
          <div class="timer-label" id="cpt-timer-label">60s</div>
        </div>

        <div id="cpt-letter">?</div>
        <div class="cpt-instruction" id="cpt-instr">${t('cptReady')}</div>

        <button class="btn btn-primary btn-lg" id="cpt-respond-btn"
                onclick="NS.cptRespond()" disabled style="display:none">
          ${t('cptTap')}
        </button>

        <div class="cpt-stats" id="cpt-live-stats" style="display:none">
          <div class="cpt-stat">
            <div class="cpt-stat-val" id="cpt-live-hits">0</div>
            <div class="cpt-stat-lbl">${t('cptCorrect')}</div>
          </div>
          <div class="cpt-stat">
            <div class="cpt-stat-val" id="cpt-live-fa">0</div>
            <div class="cpt-stat-lbl">${t('cptFA')}</div>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin-top:16px">
        <button class="btn btn-primary" id="cpt-start-btn" onclick="NS.cptStart()">
          ${t('cptStart')}
        </button>
      </div>
    </div>
    ` : ''}

    <div class="card" id="social-card" style="${hasCpt ? 'display:none' : ''}">
      <span class="badge badge-purple">${t('badgeSocial')}</span>
      <h2>${t('socialTitle')}</h2>
      <p>${t('socialInstr')}</p>
      <p style="font-size:13px">${t('socialNote')}</p>
      <div id="social-area"></div>
    </div>
  `;

  // If CPT is disabled, start social directly
  if (!hasCpt && hasSocial) {
    startSocialTest();
  }
}
