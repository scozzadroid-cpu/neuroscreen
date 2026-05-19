'use strict';
// ════════════════════════════════════════════════════════
//  SCIENTIFIC DATA — question banks, constants, configs
// ════════════════════════════════════════════════════════

// AQ-10: Allison C, Auyeung B, Baron-Cohen S. (2012). J Child Psychol Psychiatry.
// Original AQ: Baron-Cohen S, et al. (2001). J Autism Dev Disord.
const AQ10_Q = {
  it: [
    "Noto spesso piccoli suoni che gli altri non sentono",
    "Di solito mi concentro più sul quadro complessivo anziché sui piccoli dettagli",
    "Riesco facilmente a fare più cose contemporaneamente",
    "Se vengo interrotto/a, riesco facilmente a riprendere quello che stavo facendo",
    "Mi è facile cogliere le sfumature di quello che qualcuno mi sta dicendo",
    "Riconosco quando chi mi sta ascoltando si sta annoiando",
    "Quando leggo una storia, fatico a capire le intenzioni dei personaggi",
    "Mi piace raccogliere informazioni su categorie di cose (auto, uccelli, piante...)",
    "Riesco facilmente a capire cosa sente una persona guardandola in viso",
    "Faccio fatica a capire le intenzioni delle persone",
  ],
  en: [
    "I often notice small sounds when others do not",
    "I usually concentrate more on the whole picture, rather than the small details",
    "I find it easy to do more than one thing at once",
    "If there is an interruption, I can switch back to what I was doing very quickly",
    "I find it easy to 'read between the lines' when someone is talking to me",
    "I know how to tell if someone listening to me is getting bored",
    "When I'm reading a story, I find it difficult to work out the characters' intentions",
    "I like to collect information about categories of things (e.g. types of car, types of bird, types of plant, etc.)",
    "I find it easy to work out what someone is thinking or feeling just by looking at their face",
    "I find it difficult to work out people's intentions",
  ],
};

const AQ10_OPTS = {
  it: ["Decisamente d'accordo", "Leggermente d'accordo", "Leggermente in disaccordo", "Decisamente in disaccordo"],
  en: ["Definitely agree", "Slightly agree", "Slightly disagree", "Definitely disagree"],
};

// true = point scored if agree (opt 0-1); false = point scored if disagree (opt 2-3)
const AQ10_SCORE_IF_AGREE = [true, false, false, false, false, false, true, true, false, true];

// ASRS-v1.1 Part A: Kessler RC, et al. (2005). Psychol Med. doi:10.1017/S0033291704002892
const ASRS_Q = {
  it: [
    "Con che frequenza ha difficoltà a completare i dettagli finali di un progetto, una volta finite le parti difficili?",
    "Con che frequenza ha difficoltà a organizzare le cose quando deve svolgere un compito che richiede ordine?",
    "Con che frequenza dimentica appuntamenti o impegni?",
    "Quando deve svolgere un compito che richiede molto ragionamento, con che frequenza lo rimanda o evita di iniziare?",
    "Con che frequenza si agita o tamburella le dita/i piedi quando deve stare seduto/a a lungo?",
    "Con che frequenza si sente eccessivamente attivo/a e come se fosse spinto/a da un motore?",
  ],
  en: [
    "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    "How often do you have problems remembering appointments or obligations?",
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
  ],
};

const ASRS_OPTS = {
  it: ["Mai", "Raramente", "A volte", "Spesso", "Molto spesso"],
  en: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
};

// Items 0-2: score if response >= 2 (Sometimes+); Items 3-5: score if response >= 3 (Often+)
const ASRS_THRESH = [2, 2, 2, 3, 3, 3];

// Social attention distractor reading texts — Klin et al. (2002)
const READING_TEXTS = {
  it: [
    "La capacità di riconoscere i volti umani si sviluppa fin dai primissimi giorni di vita. I neonati preferiscono guardare schemi simili a volti rispetto ad altri stimoli visivi complessi.",
    "Nelle conversazioni quotidiane, una parte consistente della comunicazione avviene attraverso il linguaggio del corpo e le espressioni facciali, più che attraverso le sole parole pronunciate.",
    "Alcune culture considerano il contatto visivo diretto un segno di rispetto e attenzione, mentre in altre tradizioni può essere interpretato in modo diverso a seconda del contesto sociale.",
    "La ricerca in neuroscienze ha identificato un'area cerebrale dedicata quasi esclusivamente al riconoscimento dei volti: il giro fusiforme facciale, situato nella corteccia temporale inferiore.",
    "Studi longitudinali mostrano che la capacità di interpretare le espressioni facciali rimane relativamente stabile nel corso della vita, anche durante le fasi di sviluppo più tardive.",
    "Il fenomeno dell'effetto di superiorità del volto descrive la tendenza del cervello a riconoscere un volto nella sua interezza più facilmente rispetto a singole parti facciali isolate.",
  ],
  en: [
    "The ability to recognise human faces develops within the very first days of life. Newborns prefer looking at face-like patterns over other complex visual stimuli.",
    "In everyday conversations, a substantial part of communication occurs through body language and facial expressions, rather than through spoken words alone.",
    "Some cultures regard direct eye contact as a sign of respect and attention, while in other traditions it may be interpreted differently depending on the social context.",
    "Neuroscience research has identified a brain area dedicated almost exclusively to face recognition: the fusiform face area, located in the inferior temporal cortex.",
    "Longitudinal studies show that the ability to interpret facial expressions remains relatively stable throughout life, even during later developmental stages.",
    "The face superiority effect describes the brain's tendency to recognise a face as a whole more easily than its individual parts in isolation.",
  ],
};

// CPT parameters — Rosvold et al. (1956); Conners (2004)
const CPT_CONSONANTS  = 'BCDFGHJKLMNPQRSTVWYZ'.split('');
const CPT_TARGET      = 'X';
const CPT_DURATION    = 60000;  // ms
const CPT_STIM_ON     = 250;    // ms stimulus visible
const CPT_ISI         = 750;    // ms inter-stimulus interval
const CPT_TARGET_RATE = 0.25;   // 25% targets

// RAADS-14: Eriksson JM, Andersen MJ, Bejerot S. (2013). Mol Autism, 4(1), 49.
// Derived from RAADS-R (Ritvo et al. 2011). 4 domains: Language (0-2), Social (3-8),
// Sensory-Motor (9-11), Circumscribed Interests (12-13).
// Responses: 0=Never true, 1=True only young (<16), 2=True only now (≥16), 3=True now & young
// All items score in autistic direction. Cut-off ≥14 / 42.
const RAADS14_Q = {
  it: [
    "Quando entro in un negozio e il commesso dice 'Posso aiutarla?', non so cosa rispondere",
    "Non sono sicuro/a di quando tocca a me parlare in una conversazione",
    "Raramente cambio il volume della voce in base al contesto (es. concerto vs. conversazione intima)",
    "Non sono mai riuscito/a a capire come integrarmi con i miei coetanei",
    "Trovo molto difficile lavorare e funzionare in gruppo",
    "Faccio fatica a capire cosa stia pensando l'altra persona mentre parliamo",
    "Non riesco a capire quando qualcuno sta flirtando con me",
    "Non so bene come comportarmi nelle situazioni sociali",
    "Faccio fatica a capire cosa gli altri si aspettano da me",
    "Alcune texture che non disturbano gli altri mi risultano molto offensive al tatto",
    "Certi suoni mi disturbano fortemente o mi causano quasi dolore, mentre gli altri sembrano non esserne influenzati",
    "Ho difficoltà nella coordinazione fisica o tendo a muovermi in modo impacciato",
    "Sono sempre stato/a ossessionato/a da determinati argomenti o interessi",
    "Mi turbo molto quando le mie routine o abitudini vengono cambiate improvvisamente",
  ],
  en: [
    "When I go to a store and the clerk says, 'May I help you?', I just don't know what to say",
    "I am not sure when it is my turn to talk while having a conversation",
    "I rarely change my speech volume based on the setting (e.g. concert vs. intimate conversation)",
    "I have never been able to figure out how to fit in with my peers",
    "It is very difficult for me to work and function in groups",
    "It is hard for me to figure out what other people are thinking when we are talking",
    "I cannot tell when someone is flirting with me",
    "I am not sure how to act in social situations",
    "It is difficult to figure out what other people expect of me",
    "Some ordinary textures that do not bother others feel very offensive when they touch my skin",
    "Some sounds drive me to distraction or even cause me pain when other people seem unaffected",
    "I have difficulties with physical coordination or tend to move clumsily",
    "I have always been obsessed with certain topics or interests",
    "I get very upset when my routines or habits are suddenly changed",
  ],
};

const RAADS14_OPTS = {
  it: [
    "Mai vero",
    "Vero solo da giovane (prima dei 16 anni)",
    "Vero solo ora (16 anni o più)",
    "Vero ora e quando ero giovane",
  ],
  en: [
    "Never true",
    "True only when I was young (under 16)",
    "True only now (16 or older)",
    "True now and when I was young",
  ],
};

const RAADS14_MAX       = 42;
const RAADS14_THRESHOLD = 14;

// CAT-Q: Hull L, et al. (2019). J Autism Dev Disord, 49(3), 819–833.
// 25 items across 3 subscales: Masking (0-8), Assimilation (9-17), Compensation (18-24).
// Rated 1–7 (1=Strongly Disagree, 7=Strongly Agree). Range 25–175. Cut-off ≥100.
const CATQ_Q = {
  it: [
    "Quando sono in pubblico, cerco di comportarmi in modo 'normale' per adattarmi",
    "Monitoro il mio comportamento per assicurarmi di sembrare adeguato/a",
    "Adatto il mio linguaggio del corpo per renderlo appropriato alla situazione",
    "Cerco di sembrare sicuro/a di me, anche quando mi sento a disagio nelle situazioni sociali",
    "Nelle situazioni sociali, sento di 'recitare una parte'",
    "Nascondo le mie difficoltà di interazione sociale in pubblico",
    "Indosso una 'maschera' sociale",
    "Cerco di comportarmi come gli altri, anche se non mi viene naturale",
    "Parlo di argomenti appropriati alla situazione, anche se preferirei parlare d'altro",
    "Studio continuamente le conversazioni e il comportamento degli altri per capire le regole sociali",
    "Mi impegno molto per conformarmi alle aspettative delle persone che mi circondano",
    "Faccio fatica a capire le regole sociali delle diverse situazioni",
    "Cambio il mio comportamento in base alla situazione sociale in cui mi trovo",
    "Presto molta attenzione a come si comportano gli altri nelle situazioni sociali per imitarli",
    "Mi impegno per fare quello che gli altri si aspettano da me",
    "Nelle situazioni sociali recito una parte, anziché comportarmi in modo naturale",
    "Cerco di seguire le regole e le convenzioni sociali quando non sono sicuro/a di cosa fare",
    "Mi preparo in anticipo pensando a cosa dire o come comportarmi prima di un evento sociale",
    "Ho sviluppato strategie per compensare le mie difficoltà nelle situazioni sociali",
    "Ho un repertorio di 'copioni' per diverse situazioni sociali che mi aiutano ad affrontarle",
    "Quando parlo con qualcuno, uso frasi e espressioni studiate in anticipo",
    "Devo pensare consapevolmente alle mie espressioni facciali quando parlo con qualcuno",
    "Uso strategie che ho sviluppato per rendere i miei movimenti e le espressioni facciali più naturali",
    "Ho studiato come interagire con gli altri e utilizzo le informazioni raccolte",
    "Imito consapevolmente le espressioni facciali e i gesti degli altri quando interagisco",
  ],
  en: [
    "When in public, I try to act 'normal' to fit in",
    "I monitor my behaviour to make sure it seems appropriate",
    "I adjust my body language to make it seem appropriate to the situation I am in",
    "I try to appear confident, even when I feel uncomfortable in social situations",
    "In social situations, I feel like I am performing",
    "I hide my difficulties with social interaction in public",
    "I wear a social 'mask'",
    "I try to act like other people, even if it doesn't feel natural",
    "I talk about subjects appropriate for the situation, even if I would prefer to talk about something else",
    "I am always studying other people's conversations and behaviour to understand the social rules",
    "I try hard to fit in with the people around me",
    "I have to try hard to understand the social rules of different situations",
    "I change my behaviour depending on the social situation I am in",
    "I pay close attention to how other people behave in social situations so that I can copy them",
    "I work hard to ensure I do what other people expect of me",
    "I put on a performance in social situations, rather than behaving naturally",
    "I try to follow social rules and conventions in situations where I am unsure of the right thing to do",
    "I prepare in advance by thinking about what I will say or how to behave before a social event",
    "I have developed strategies to compensate for my difficulties in social situations",
    "I have built up a collection of 'scripts' for different social situations to help me cope",
    "When talking to people, I use practised phrases and expressions",
    "I have to consciously think about my facial expressions when I am talking to people",
    "I use strategies that I have developed to make my movements and facial expressions seem more natural",
    "I have researched how to interact with other people, and I use the information I have gathered",
    "I consciously copy other people's facial expressions and gestures when interacting with them",
  ],
};

const CATQ_MIN       = 25;
const CATQ_MAX       = 175;
const CATQ_THRESHOLD = 100;

// Social attention face configurations — first-saccade paradigm
const FACE_CONFIGS = [
  { expr: 'happy',     gaze: 'direct'  },
  { expr: 'neutral',   gaze: 'direct'  },
  { expr: 'happy',     gaze: 'averted' },
  { expr: 'surprised', gaze: 'direct'  },
  { expr: 'sad',       gaze: 'direct'  },
  { expr: 'neutral',   gaze: 'averted' },
];
