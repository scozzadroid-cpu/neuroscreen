'use strict';
// ════════════════════════════════════════════════════════
//  SCIENTIFIC REFERENCES — clickable PubMed/Scholar links
//  Each ref: badge, badge CSS class, it/en text, search URL
// ════════════════════════════════════════════════════════

function toggleRefs() {
  const wrap = document.getElementById('refs-list-wrap');
  const btn  = document.getElementById('refs-toggle-btn');
  if (!wrap || !btn) return;
  const hidden = wrap.style.display === 'none';
  wrap.style.display = hidden ? '' : 'none';
  btn.textContent    = hidden ? t('refsHide') : t('refsShow');
}

function refsHTML() {
  const refs = [
    // ── AQ-10 ──────────────────────────────────────────
    {
      badge: 'AQ-10', cls: '',
      it: 'Baron-Cohen S, Wheelwright S, Skinner R, Martin J, Clubley E. (2001). <em>The Autism-Spectrum Quotient (AQ): Evidence from Asperger Syndrome/High-Functioning Autism, Males and Females, Scientists and Mathematicians.</em> J Autism Dev Disord, 31(1), 5–17.',
      en: 'Baron-Cohen S, Wheelwright S, Skinner R, Martin J, Clubley E. (2001). <em>The Autism-Spectrum Quotient (AQ): Evidence from Asperger Syndrome/High-Functioning Autism, Males and Females, Scientists and Mathematicians.</em> J Autism Dev Disord, 31(1), 5–17.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=baron-cohen+autism+spectrum+quotient+AQ+2001',
    },
    {
      badge: 'AQ-10', cls: '',
      it: 'Allison C, Auyeung B, Baron-Cohen S. (2012). <em>Toward Brief "Red Flags" for Autism Screening: The Short Autism Spectrum Quotient and the Short Quantitative Checklist for Autism in Toddlers in 1,000 Cases and 3,000 Controls.</em> J Child Psychol Psychiatry, 53(4), 458–467.',
      en: 'Allison C, Auyeung B, Baron-Cohen S. (2012). <em>Toward Brief "Red Flags" for Autism Screening: The Short Autism Spectrum Quotient and the Short Quantitative Checklist for Autism in Toddlers in 1,000 Cases and 3,000 Controls.</em> J Child Psychol Psychiatry, 53(4), 458–467.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=allison+auyeung+baron-cohen+AQ-10+2012',
    },
    // ── ASRS ───────────────────────────────────────────
    {
      badge: 'ASRS', cls: 'ref-badge-teal',
      it: 'Kessler RC, Adler L, Ames M, Demler O, et al. (2005). <em>The World Health Organization Adult ADHD Self-Report Scale (ASRS): A Short Screening Scale for Use in the General Population.</em> Psychological Medicine, 35(2), 245–256.',
      en: 'Kessler RC, Adler L, Ames M, Demler O, et al. (2005). <em>The World Health Organization Adult ADHD Self-Report Scale (ASRS): A Short Screening Scale for Use in the General Population.</em> Psychological Medicine, 35(2), 245–256.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=kessler+ASRS+ADHD+self+report+scale+2005',
    },
    // ── CPT ────────────────────────────────────────────
    {
      badge: 'CPT', cls: 'ref-badge-warn',
      it: 'Rosvold HE, Mirsky AF, Sarason I, Bransome ED, Beck LH. (1956). <em>A continuous performance test of brain damage.</em> Journal of Consulting Psychology, 20(5), 343–350. | Conners CK. (2004). <em>Conners\' Continuous Performance Test II.</em> MHS.',
      en: 'Rosvold HE, Mirsky AF, Sarason I, Bransome ED, Beck LH. (1956). <em>A continuous performance test of brain damage.</em> Journal of Consulting Psychology, 20(5), 343–350. | Conners CK. (2004). <em>Conners\' Continuous Performance Test II.</em> MHS.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=continuous+performance+test+CPT+attention+ADHD+Conners',
    },
    // ── Social attention ───────────────────────────────
    {
      badge: 'Social', cls: '',
      it: 'Klin A, Jones W, Schultz R, Volkmar F, Cohen D. (2002). <em>Defining and quantifying the social phenotype in autism.</em> Am J Psychiatry, 159(6), 895–908.',
      en: 'Klin A, Jones W, Schultz R, Volkmar F, Cohen D. (2002). <em>Defining and quantifying the social phenotype in autism.</em> Am J Psychiatry, 159(6), 895–908.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=klin+jones+schultz+social+phenotype+autism+2002',
    },
    {
      badge: 'Social/Dev', cls: '',
      it: 'Jones W, Klin A. (2013). <em>Attention to eyes is present but in decline in 2–6-month-old infants later diagnosed with autism.</em> Nature, 504(7480), 427–431.',
      en: 'Jones W, Klin A. (2013). <em>Attention to eyes is present but in decline in 2–6-month-old infants later diagnosed with autism.</em> Nature, 504(7480), 427–431.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=jones+klin+attention+eyes+infants+autism+nature+2013',
    },
    // ── Eye Tracking / EAR ─────────────────────────────
    {
      badge: 'EAR', cls: 'ref-badge-teal',
      it: 'Soukupová T, Čech J. (2016). <em>Real-Time Eye Blink Detection using Facial Landmarks.</em> 21st Computer Vision Winter Workshop (CVWW), Rimske Toplice, Slovenia.',
      en: 'Soukupová T, Čech J. (2016). <em>Real-Time Eye Blink Detection using Facial Landmarks.</em> 21st Computer Vision Winter Workshop (CVWW), Rimske Toplice, Slovenia.',
      search: 'https://scholar.google.com/scholar?q=soukupova+cech+eye+blink+detection+facial+landmarks+2016',
    },
    {
      badge: 'Eye/ASD', cls: 'ref-badge-teal',
      it: 'Frazier TW, Strauss M, Klingemier EW, et al. (2017). <em>A meta-analysis of gaze differences to social and nonsocial information between individuals with and without autism.</em> J Am Acad Child Adolesc Psychiatry, 56(7), 546–555.',
      en: 'Frazier TW, Strauss M, Klingemier EW, et al. (2017). <em>A meta-analysis of gaze differences to social and nonsocial information between individuals with and without autism.</em> J Am Acad Child Adolesc Psychiatry, 56(7), 546–555.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=frazier+gaze+social+autism+meta-analysis+2017',
    },
    // ── Blink rate norms ───────────────────────────────
    {
      badge: 'Blink norm', cls: 'ref-badge-teal',
      it: 'Bentivoglio AR, Bressman SB, Cassetta E, Carretta D, Tonali P, Albanese A. (1997). <em>Analysis of blink rate patterns in normal subjects.</em> Mov Disord, 12(6), 1028–1034. <em>(Riferimento normativo: 12–20 blink/min negli adulti a riposo.)</em>',
      en: 'Bentivoglio AR, Bressman SB, Cassetta E, Carretta D, Tonali P, Albanese A. (1997). <em>Analysis of blink rate patterns in normal subjects.</em> Mov Disord, 12(6), 1028–1034. <em>(Normative reference: 12–20 blinks/min in resting adults.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=bentivoglio+blink+rate+patterns+normal+subjects+1997',
    },
    // ── RAADS-R / RAADS-14 ─────────────────────────────
    {
      badge: 'RAADS-R', cls: '',
      it: 'Ritvo RA, Ritvo ER, Guthrie D, Yuwiler A, Ritvo MJ, Weisbender L. (2011). <em>The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R): A Scale to Assist the Diagnosis of Autism Spectrum Disorder in Adults.</em> J Autism Dev Disord, 41(8), 1076–1089.',
      en: 'Ritvo RA, Ritvo ER, Guthrie D, Yuwiler A, Ritvo MJ, Weisbender L. (2011). <em>The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R): A Scale to Assist the Diagnosis of Autism Spectrum Disorder in Adults.</em> J Autism Dev Disord, 41(8), 1076–1089.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=ritvo+autism+asperger+diagnostic+scale+RAADS-R+2011',
    },
    {
      badge: 'RAADS-14', cls: '',
      it: 'Eriksson JM, Andersen MJ, Bejerot S. (2013). <em>RAADS-14 Screen: Validity of a Screening Tool for Autism Spectrum Disorder in an Adult Psychiatric Population.</em> Mol Autism, 4(1), 49. <em>(Sensibilità ~91%, specificità ~84%; soglia ≥14/42.)</em>',
      en: 'Eriksson JM, Andersen MJ, Bejerot S. (2013). <em>RAADS-14 Screen: Validity of a Screening Tool for Autism Spectrum Disorder in an Adult Psychiatric Population.</em> Mol Autism, 4(1), 49. <em>(Sensitivity ~91%, specificity ~84%; threshold ≥14/42.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=eriksson+andersen+bejerot+RAADS-14+2013',
    },
    // ── Camouflaging / Masking ─────────────────────────
    {
      badge: 'Masking', cls: '',
      it: 'Hull L, Petrides KV, Allison C, Smith P, Baron-Cohen S, Lai MC, Mandy W. (2017). <em>Putting on My Best Normal: Social Camouflaging in Adults with Autism Spectrum Conditions.</em> J Autism Dev Disord, 47(8), 2519–2534.',
      en: 'Hull L, Petrides KV, Allison C, Smith P, Baron-Cohen S, Lai MC, Mandy W. (2017). <em>Putting on My Best Normal: Social Camouflaging in Adults with Autism Spectrum Conditions.</em> J Autism Dev Disord, 47(8), 2519–2534.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=hull+mandy+camouflaging+autism+adults+2017',
    },
    {
      badge: 'CAT-Q', cls: '',
      it: 'Hull L, Mandy W, Lai MC, Baron-Cohen S, Allison C, Smith P, Petrides KV. (2019). <em>Development and Validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).</em> J Autism Dev Disord, 49(3), 819–833. <em>(Soglia ≥100/175; subscale: Masking, Assimilazione, Compensazione.)</em>',
      en: 'Hull L, Mandy W, Lai MC, Baron-Cohen S, Allison C, Smith P, Petrides KV. (2019). <em>Development and Validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).</em> J Autism Dev Disord, 49(3), 819–833. <em>(Threshold ≥100/175; subscales: Masking, Assimilation, Compensation.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=hull+mandy+lai+CAT-Q+camouflaging+2019',
    },
    // ── AuDHD comorbidity ──────────────────────────────
    {
      badge: 'AuDHD', cls: 'ref-badge-teal',
      it: 'Antshel KM, Zhang-James Y, Faraone SV. (2013). <em>The comorbidity of ADHD and autism spectrum disorder.</em> Expert Rev Neurother, 13(10), 1117–1128.',
      en: 'Antshel KM, Zhang-James Y, Faraone SV. (2013). <em>The comorbidity of ADHD and autism spectrum disorder.</em> Expert Rev Neurother, 13(10), 1117–1128.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=antshel+zhang-james+faraone+ADHD+autism+comorbidity+2013',
    },
    // ── Sensory processing ─────────────────────────────
    {
      badge: 'Sensory', cls: 'ref-badge-warn',
      it: 'Marco EJ, Hinkley LBN, Hill SS, Nagarajan SS. (2011). <em>Sensory processing in autism: a review of neurophysiologic findings.</em> Pediatr Res, 69(5 Pt 2), 48R–54R.',
      en: 'Marco EJ, Hinkley LBN, Hill SS, Nagarajan SS. (2011). <em>Sensory processing in autism: a review of neurophysiologic findings.</em> Pediatr Res, 69(5 Pt 2), 48R–54R.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=marco+hinkley+sensory+processing+autism+neurophysiologic+2011',
    },
  ];

  const items = refs.map(r => `
    <li>
      <span class="ref-badge ${r.cls}">${r.badge}</span>
      ${r[LANG]}
      <a href="${r.search}" target="_blank" rel="noopener" class="ref-link">PubMed ↗</a>
    </li>`).join('');

  return `
    <div class="card card-sm refs-block" style="margin-bottom:16px;background:var(--surf2)">
      <div class="refs-header">
        <h3>${t('refsTitle')} <span style="font-size:11px;font-weight:400;color:var(--text3)">(${refs.length})</span></h3>
        <button id="refs-toggle-btn" class="refs-toggle-btn" onclick="toggleRefs()">${t('refsShow')}</button>
      </div>
      <div id="refs-list-wrap" style="display:none">
        <ul class="refs-list" style="margin-top:12px">${items}</ul>
      </div>
    </div>`;
}
