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
      it: 'Allison C, Auyeung B, Baron-Cohen S. (2012). <em>Toward Brief "Red Flags" for Autism Screening: The Short Autism Spectrum Quotient and the Short Quantitative Checklist for Autism in Toddlers in 1,000 Cases and 3,000 Controls.</em> J Am Acad Child Adolesc Psychiatry, 51(2), 202–212.',
      en: 'Allison C, Auyeung B, Baron-Cohen S. (2012). <em>Toward Brief "Red Flags" for Autism Screening: The Short Autism Spectrum Quotient and the Short Quantitative Checklist for Autism in Toddlers in 1,000 Cases and 3,000 Controls.</em> J Am Acad Child Adolesc Psychiatry, 51(2), 202–212.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=allison+auyeung+baron-cohen+AQ-10+2012',
    },
    // ── ASRS ───────────────────────────────────────────
    {
      badge: 'ASRS', cls: 'ref-badge-teal',
      it: 'Kessler RC, Adler L, Ames M, Demler O, et al. (2005). <em>The World Health Organization Adult ADHD Self-Report Scale (ASRS): A Short Screening Scale for Use in the General Population.</em> Psychological Medicine, 35(2), 245–256. <em>(Fonte dei valori 68.7% sensibilità / 99.5% specificità della Parte A.)</em>',
      en: 'Kessler RC, Adler L, Ames M, Demler O, et al. (2005). <em>The World Health Organization Adult ADHD Self-Report Scale (ASRS): A Short Screening Scale for Use in the General Population.</em> Psychological Medicine, 35(2), 245–256. <em>(Source of the 68.7% sensitivity / 99.5% specificity figures for Part A.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=kessler+ASRS+ADHD+self+report+scale+2005',
    },
    {
      badge: 'ASRS', cls: 'ref-badge-teal',
      it: 'Kessler RC, Adler LA, Gruber MJ, Sarawate CA, Spencer T, Van Brunt DL. (2007). <em>Validity of the World Health Organization Adult ADHD Self-Report Scale (ASRS) Screener in a Representative Sample of Health Plan Members.</em> Int J Methods Psychiatr Res, 16(2), 52–65. <em>(Validazione successiva in un campione di iscritti a un piano sanitario.)</em>',
      en: 'Kessler RC, Adler LA, Gruber MJ, Sarawate CA, Spencer T, Van Brunt DL. (2007). <em>Validity of the World Health Organization Adult ADHD Self-Report Scale (ASRS) Screener in a Representative Sample of Health Plan Members.</em> Int J Methods Psychiatr Res, 16(2), 52–65. <em>(Follow-up validation in a health plan member sample.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/17623385/',
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
      it: 'Ritvo RA, Ritvo ER, Guthrie D, Ritvo MJ, Hufnagel DH, McMahon W, Tonge B, Mataix-Cols D, Jassi A, Attwood T, Eloff J. (2011). <em>The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R): A Scale to Assist the Diagnosis of Autism Spectrum Disorder in Adults: An International Validation Study.</em> J Autism Dev Disord, 41(8), 1076–1089.',
      en: 'Ritvo RA, Ritvo ER, Guthrie D, Ritvo MJ, Hufnagel DH, McMahon W, Tonge B, Mataix-Cols D, Jassi A, Attwood T, Eloff J. (2011). <em>The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R): A Scale to Assist the Diagnosis of Autism Spectrum Disorder in Adults: An International Validation Study.</em> J Autism Dev Disord, 41(8), 1076–1089.',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=ritvo+autism+asperger+diagnostic+scale+RAADS-R+2011',
    },
    {
      badge: 'RAADS-14', cls: '',
      it: 'Eriksson JM, Andersen LMJ, Bejerot S. (2013). <em>RAADS-14 Screen: Validity of a Screening Tool for Autism Spectrum Disorder in an Adult Psychiatric Population.</em> Mol Autism, 4(1), 49. <em>(Sensibilità 97%; specificità variabile 46–95% a seconda del gruppo di confronto; soglia ≥14/42.)</em>',
      en: 'Eriksson JM, Andersen LMJ, Bejerot S. (2013). <em>RAADS-14 Screen: Validity of a Screening Tool for Autism Spectrum Disorder in an Adult Psychiatric Population.</em> Mol Autism, 4(1), 49. <em>(Sensitivity 97%; specificity varies 46–95% depending on the comparison group; threshold ≥14/42.)</em>',
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
      it: 'Hull L, Mandy W, Lai MC, Baron-Cohen S, Allison C, Smith P, Petrides KV. (2019). <em>Development and Validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).</em> J Autism Dev Disord, 49(3), 819–833. <em>(Nessuna soglia diagnostica validata; subscale: Compensazione 9 item, Masking 8 item, Assimilazione 8 item.)</em>',
      en: 'Hull L, Mandy W, Lai MC, Baron-Cohen S, Allison C, Smith P, Petrides KV. (2019). <em>Development and Validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).</em> J Autism Dev Disord, 49(3), 819–833. <em>(No validated diagnostic cut-off; subscales: Compensation 9 items, Masking 8 items, Assimilation 8 items.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=hull+mandy+lai+CAT-Q+camouflaging+2019',
    },
    // ── CATI ───────────────────────────────────────────
    {
      badge: 'CATI', cls: '',
      it: 'English MCW, Gignac GE, Visser TAW, Whitehouse AJO, Enns JT, Maybery MT. (2021). <em>The Comprehensive Autistic Trait Inventory (CATI): development and validation of a new measure of autistic traits in the general population.</em> Mol Autism, 12(1), 37. <em>(Cut-off di ricerca ≥134: sensibilità 82.7%, specificità 79.0%. Licenza CC BY 4.0.)</em>',
      en: 'English MCW, Gignac GE, Visser TAW, Whitehouse AJO, Enns JT, Maybery MT. (2021). <em>The Comprehensive Autistic Trait Inventory (CATI): development and validation of a new measure of autistic traits in the general population.</em> Mol Autism, 12(1), 37. <em>(Research cut-off ≥134: sensitivity 82.7%, specificity 79.0%. CC BY 4.0 licence.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=english+comprehensive+autistic+trait+inventory+CATI+2021',
    },
    {
      badge: 'CATI', cls: '',
      it: 'English MCW, et al. (2025). <em>Psychometric Evaluation of the Comprehensive Autistic Trait Inventory in Autistic and Non-Autistic Adults.</em> Autism, 29(12). <em>(Struttura a sei fattori confermata; invarianza per stato autistico e genere.)</em>',
      en: 'English MCW, et al. (2025). <em>Psychometric Evaluation of the Comprehensive Autistic Trait Inventory in Autistic and Non-Autistic Adults.</em> Autism, 29(12). <em>(Six-factor structure confirmed; invariance across autism status and gender.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=psychometric+evaluation+comprehensive+autistic+trait+inventory+autistic+non-autistic+adults',
    },
    {
      badge: 'AQ', cls: '',
      it: 'Ashwood KL, Gillan N, Horder J, et al. (2016). <em>Predicting the diagnosis of autism in adults using the Autism-Spectrum Quotient (AQ) questionnaire.</em> Psychol Med, 46(12), 2595–2604. <em>(Limiti dell\'AQ negli adulti inviati a valutazione specialistica.)</em>',
      en: 'Ashwood KL, Gillan N, Horder J, et al. (2016). <em>Predicting the diagnosis of autism in adults using the Autism-Spectrum Quotient (AQ) questionnaire.</em> Psychol Med, 46(12), 2595–2604. <em>(Limits of the AQ in adults referred for specialist assessment.)</em>',
      search: 'https://pubmed.ncbi.nlm.nih.gov/?term=ashwood+predicting+diagnosis+autism+adults+autism-spectrum+quotient+2016',
    },
    // ── Webcam gaze ────────────────────────────────────
    {
      badge: 'Gaze', cls: 'ref-badge-teal',
      it: 'Papoutsaki A, Sangkloy P, Laskey J, Daskalova N, Huang J, Hays J. (2016). <em>WebGazer: Scalable Webcam Eye Tracking Using User Interactions.</em> IJCAI 2016, 3839–3845.',
      en: 'Papoutsaki A, Sangkloy P, Laskey J, Daskalova N, Huang J, Hays J. (2016). <em>WebGazer: Scalable Webcam Eye Tracking Using User Interactions.</em> IJCAI 2016, 3839–3845.',
      search: 'https://scholar.google.com/scholar?q=WebGazer+Scalable+Webcam+Eye+Tracking+Using+User+Interactions',
    },
    {
      badge: 'Gaze', cls: 'ref-badge-teal',
      it: 'Yang X, Krajbich I. (2021). <em>Webcam-based online eye-tracking for behavioral research.</em> Judgm Decis Mak, 16(6), 1485–1505.',
      en: 'Yang X, Krajbich I. (2021). <em>Webcam-based online eye-tracking for behavioral research.</em> Judgm Decis Mak, 16(6), 1485–1505.',
      search: 'https://scholar.google.com/scholar?q=Webcam-based+online+eye-tracking+for+behavioral+research+Yang+Krajbich',
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
