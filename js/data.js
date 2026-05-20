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
    "Con che frequenza hai difficoltà a completare i dettagli finali di un progetto, una volta finite le parti difficili?",
    "Con che frequenza hai difficoltà a organizzare le cose quando devi svolgere un compito che richiede ordine?",
    "Con che frequenza dimentichi appuntamenti o impegni?",
    "Quando devi svolgere un compito che richiede molto ragionamento, con che frequenza lo rimandi o eviti di iniziare?",
    "Con che frequenza ti agiti o tamburelli le dita/i piedi quando devi stare seduto/a a lungo?",
    "Con che frequenza ti senti eccessivamente attivo/a, come se fossi spinto/a da un motore?",
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
    "I neonati riconoscono il volto della madre già nelle prime ore dalla nascita. Il cervello è programmato per cercare facce ovunque — per questo vediamo volti nelle nuvole, nel legno venato e persino nel toast bruciato. Questo riflesso si chiama pareidolia.",
    "Nelle conversazioni il 70% del significato passa attraverso tono di voce, espressioni e gesti, non le parole. Per questo una telefonata è meno ricca di un incontro di persona, e la stessa frase può suonare completamente diversa a seconda del volto di chi la dice.",
    "In Giappone il contatto visivo prolungato è considerato aggressivo; in molte culture mediorientali evitare lo sguardo può sembrare disonesto. Eppure in entrambi i contesti le persone si capiscono benissimo — il cervello si adatta sorprendentemente bene alle regole non scritte del posto in cui si trova.",
    "C'è un'area del cervello — il giro fusiforme — che si occupa quasi solo di riconoscere volti. Se viene danneggiata si sviluppa la prosopoagnosia: l'incapacità di riconoscere i visi. Chi ne soffre impara a riconoscere le persone dalla voce, dall'andatura o dall'acconciatura — mai dal volto.",
    "Riusciamo a distinguere migliaia di volti diversi, ma le emozioni di base — gioia, tristezza, paura, sorpresa, rabbia, disgusto — si leggono allo stesso modo in tutto il mondo. Lo scoprì Paul Ekman negli anni '70 studiando popolazioni tribali non esposte ai media occidentali.",
    "Se ti mostro solo gli occhi di un volto noto, probabilmente lo riconosci subito. Ma se capovolgo la stessa foto diventa molto più difficile. Questo 'effetto Thatcher' dimostra che il cervello elabora i volti come unità coerenti, non come insiemi di parti.",
  ],
  en: [
    "Newborns can recognise their mother's face within the first hours of life. The brain is pre-wired to search for faces everywhere — which is why we see faces in clouds, wood grain and even burnt toast. This reflex is called pareidolia.",
    "In conversations, 70% of meaning is carried through tone of voice, expressions and gestures, not words. This is why a phone call feels less rich than a face-to-face meeting, and why the same sentence can mean something completely different depending on the face saying it.",
    "In Japan, prolonged eye contact is considered aggressive; in many Middle Eastern cultures, avoiding someone's gaze can seem dishonest. Yet people from both traditions navigate each other remarkably well — the brain adapts surprisingly fast to the unspoken rules of wherever it finds itself.",
    "There is a brain area — the fusiform gyrus — that deals almost exclusively with recognising faces. Damage it and you develop prosopagnosia: the inability to recognise faces. People with this condition learn to identify others by voice, gait or hairstyle — never by the face itself.",
    "We can distinguish thousands of individual faces, yet the six basic emotions — joy, sadness, fear, surprise, anger and disgust — are read the same way around the world. Paul Ekman discovered this in the 1970s by studying tribal populations with no exposure to Western media.",
    "If you see only the eyes of a familiar face, you'll probably recognise it straight away. But flip the same photo upside down and it becomes far harder. This 'Thatcher effect' shows that the brain processes faces as coherent wholes, not collections of parts.",
  ],
};

// CPT parameters — Rosvold et al. (1956); Conners (2004)
const CPT_CONSONANTS  = 'BCDFGHJKLMNPQRSTVWYZ'.split('');
const CPT_TARGET      = 'X';
const CPT_DURATION    = 60000;  // ms
const CPT_STIM_ON     = 400;    // ms stimulus visible
const CPT_ISI_START   = 1600;   // ms ISI at start (slow)
const CPT_ISI_END     = 350;    // ms ISI at maximum speed
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

// CAT-Q: Hull L, et al. (2019). J Autism Dev Disord, 49(3), 819–833. doi:10.1007/s10803-018-3720-5
// 25 items rated 1–7 (1=Strongly Disagree, 7=Strongly Agree). Range 25–175. Cut-off ≥100.
// Subscale item assignment per Hull et al. (2019) Table 2 — see calcCATQSubs() in scoring.js.
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

// Webcam test reading text — mycelium (fungal biology)
// Shown during Phase 1 (30 s blink-rate measurement)
const WEBCAM_TEXT = {
  it: 'Il cervello umano è notoriamente scarso nel vero multitasking. Quando crediamo di fare più cose contemporaneamente, in realtà passiamo rapidamente da un compito all\'altro — un processo chiamato "task switching" che consuma energia cognitiva. Il costo nascosto di ogni interruzione è significativo: dopo una distrazione, ci vogliono in media 23 minuti per tornare al livello massimo di concentrazione. Curiosamente, le persone tendono a sopravvalutare le proprie capacità: coloro che si dichiarano "ottimi multitasker" ottengono spesso i punteggi peggiori nei test di attenzione divisa. La buona notizia è che l\'attenzione è un muscolo — si allena, si affatica, e si riprende con il giusto riposo.',
  en: 'The human brain is notoriously poor at true multitasking. When we think we\'re doing several things at once, we\'re actually switching rapidly between tasks — a process called "task switching" that burns cognitive energy. The hidden cost of each interruption is significant: after a distraction, it takes an average of 23 minutes to return to peak concentration. Curiously, people tend to overestimate their own multitasking ability: those who describe themselves as "great multitaskers" often score worst on divided-attention tests. The good news is that attention is a muscle — it can be trained, it gets tired, and it recovers with the right rest.',
};

// Social attention face configurations — first-saccade paradigm
// skin: index into _FACE_PALETTES in social.js (0–5)
const FACE_CONFIGS = [
  { expr: 'happy',     gaze: 'direct',  skin: 0 },
  { expr: 'neutral',   gaze: 'direct',  skin: 2 },
  { expr: 'happy',     gaze: 'averted', skin: 4 },
  { expr: 'surprised', gaze: 'direct',  skin: 1 },
  { expr: 'sad',       gaze: 'direct',  skin: 3 },
  { expr: 'neutral',   gaze: 'averted', skin: 5 },
];
