// src/storage/grammarProficiencyStore.ts — Minimalist Cumulative Nugget Engine
// Focuses on ONE atomic grammar nugget at a time, building mastery through 3-step repetition
// and slowly mixing in previously learned nuggets (generated on the fly by AI and stored locally).

export type GrammarRoleType =
  | 'substantiv'
  | 'adjectiv'
  | 'verb'
  | 'pronume'
  | 'numeral'
  | 'legatura';

export type CoreGrammarPillarId =
  | 'substantiv'
  | 'adjectiv'
  | 'verb'
  | 'pronume'
  | 'numeral'
  | 'propozitie';

export interface ColorCodedWordToken {
  word: string;
  role: GrammarRoleType;
  roleLabel: string;
  questionHook: string;
  explanation: string;
}

export interface ConversationalGrammarLesson {
  id: string;
  pillarId: CoreGrammarPillarId;
  nuggetIndex?: number;            // 1..10 cumulative nugget index
  stepInNugget?: 1 | 2 | 3;        // 1 = Discover (no quiz), 2 = Repeat, 3 = Mix with previous
  createdAt: string;
  source: 'curated' | 'gemini-ai';
  proficiencyTier: 'Ucenic' | 'Călător' | 'Meșter';
  titleRo: string;
  mioritaTheoryRo: string;         // 1-2 short, calm sentences explaining the single nugget
  secretFormulaRo: string;         // Short visual contrast: e.g. "the boy ➔ băiatul (-ul)"
  ukSpagBridgeEn: string;          // 1 short English bridge line
  sentenceFullText: string;
  colorCodedWords: ColorCodedWordToken[];
  testerQuestion: {
    questionRo: string;
    options: string[];
    correctIndex: number;
    explanationRo: string;
  };
  followUpPrompts: string[];
}

export interface PillarProficiencyState {
  pillarId: CoreGrammarPillarId;
  score: number;
  tier: 'Ucenic' | 'Călător' | 'Meșter';
  lessonsExplored: number;
  testerCorrect: number;
  testerAttempts: number;
  recentMistakes: string[];
}

export interface NuggetSpiralState {
  currentNuggetIndex: number;      // 1 to 10
  repInCurrentNugget: number;      // 0 = Discover, 1 = Repeat 1, 2 = Repeat 2 (Mix), 3 -> advances to next nugget!
  masteredNuggets: number[];       // e.g. [1, 2]
}

export interface GrammarProficiencyDatabase {
  version: 1;
  updatedAt: string;
  proficiencyByPillar: Record<CoreGrammarPillarId, PillarProficiencyState>;
  spiral: NuggetSpiralState;
  savedLessons: ConversationalGrammarLesson[];
}

export const ROLE_COLOR_MAP: Record<
  GrammarRoleType,
  { color: string; bg: string; badge: string; question: string }
> = {
  substantiv: {
    color: '#1E56A0',
    bg: '#EDF5FF',
    badge: '🔵 Substantiv',
    question: 'Cine? Ce?',
  },
  adjectiv: {
    color: '#237A4B',
    bg: '#EDFAF2',
    badge: '🟢 Adjectiv',
    question: 'Cum este?',
  },
  verb: {
    color: '#C0292B',
    bg: '#FFF0F0',
    badge: '🔴 Verb',
    question: 'Ce face?',
  },
  pronume: {
    color: '#B2720E',
    bg: '#FFF9E6',
    badge: '🟡 Pronume',
    question: 'Ține locul',
  },
  numeral: {
    color: '#6B3FA0',
    bg: '#F6F0FF',
    badge: '🟣 Numeral',
    question: 'Câți? Câte?',
  },
  legatura: {
    color: '#8C4A27',
    bg: '#FDF3EC',
    badge: '🟤 Legătură',
    question: 'Cuvânt-punte',
  },
};

export interface NuggetSpec {
  nuggetIndex: number;
  pillarId: CoreGrammarPillarId;
  categoryCode: string;
  titleRo: string;
  coreRuleRo: string;
  mixesWithRo: string;
}

export const CUMULATIVE_NUGGET_LADDER: NuggetSpec[] = [
  {
    nuggetIndex: 1,
    pillarId: 'substantiv',
    categoryCode: 'GEN',
    titleRo: 'Pepita 1: Substantivul (un / o)',
    coreRuleRo: 'Cuvintele care numesc ființe și lucruri au gen: masculin (un lup), feminin (o casă) sau neutru (un tren).',
    mixesWithRo: 'Punctul de plecare: doar substantive simple.',
  },
  {
    nuggetIndex: 2,
    pillarId: 'substantiv',
    categoryCode: 'ART',
    titleRo: 'Pepita 2: Codița „the” la final (-ul / -a)',
    coreRuleRo: 'În engleză pui „the” în față (the wolf, the house). În română îl lipim la final: lupul, casa!',
    mixesWithRo: 'Amestecă Pepita 1 (Substantivul) + Pepita 2 (-ul / -a).',
  },
  {
    nuggetIndex: 3,
    pillarId: 'adjectiv',
    categoryCode: 'AGR',
    titleRo: 'Pepita 3: Adjectivul stă DUPĂ substantiv',
    coreRuleRo: 'Cuvântul care arată „cum este” (adjectivul) stă după substantiv și îi copiază genul: lup bun, casă bună.',
    mixesWithRo: 'Amestecă Substantivul (-ul/-a) + Adjectivul.',
  },
  {
    nuggetIndex: 4,
    pillarId: 'verb',
    categoryCode: 'SUB',
    titleRo: 'Pepita 4: Verbul — Motorul propoziției (Ce face?)',
    coreRuleRo: 'Verbul arată acțiunea: Cineva (Subiectul) + face ceva (Verbul): Lupul aleargă. Casa strălucește.',
    mixesWithRo: 'Amestecă Substantivul + Adjectivul + Verbul.',
  },
  {
    nuggetIndex: 5,
    pillarId: 'substantiv',
    categoryCode: 'CAS',
    titleRo: 'Pepita 5: Codița „A cui?” (-ii / -ului)',
    coreRuleRo: 'Când ceva aparține cuiva, nu spunem „la”: bunica ➔ casa bunicii (-ii), băiatul ➔ mingea băiatului (-ului).',
    mixesWithRo: 'Amestecă Substantivul + Verbul + Codița posesiei (-ii/-ului).',
  },
  {
    nuggetIndex: 6,
    pillarId: 'verb',
    categoryCode: 'SUB',
    titleRo: 'Pepita 6: Puntea „SĂ” între două verbe',
    coreRuleRo: 'Când avem două verbe (I want to go), le legăm mereu cu puntea „să”: Vreau să merg!',
    mixesWithRo: 'Amestecă Verbul + Puntea „să” + Substantivul + Adjectivul.',
  },
  {
    nuggetIndex: 7,
    pillarId: 'numeral',
    categoryCode: 'NUM',
    titleRo: 'Pepita 7: Doi vs. Două la plural',
    coreRuleRo: 'Numărul 2 își schimbă forma: „doi” pentru masculin (doi lupi), dar „două” pentru feminin și neutru (două case, două trenuri).',
    mixesWithRo: 'Amestecă Numeralul + Substantivul + Adjectivul la plural.',
  },
  {
    nuggetIndex: 8,
    pillarId: 'numeral',
    categoryCode: 'NUM',
    titleRo: 'Pepita 8: Puntea „DE” la numere mari (≥ 20)',
    coreRuleRo: 'Sub 20 legăm direct (zece mere). De la 20 în sus punem puntea „de”: douăzeci de mere!',
    mixesWithRo: 'Amestecă Verbul + Numeralul cu „de” + Substantivul.',
  },
  {
    nuggetIndex: 9,
    pillarId: 'pronume',
    categoryCode: 'CLI',
    titleRo: 'Pepita 9: Pronumele și „PE” pentru persoane',
    coreRuleRo: 'Când acțiunea cade pe o persoană, punem „pe” și un mic pronume-ecou: L-am văzut pe tata / Am ajutat-o pe bunica.',
    mixesWithRo: 'Amestecă Pronumele + Verbul + Puntea „pe” + Substantivul.',
  },
  {
    nuggetIndex: 10,
    pillarId: 'propozitie',
    categoryCode: 'CLQ',
    titleRo: 'Pepita 10: Expresii românești cu „A avea”',
    coreRuleRo: 'În română nu „suntem” ani și nu „facem” sens: Eu AM 8 ani și ideea ARE sens!',
    mixesWithRo: 'Amestecă toate cele 10 pepite într-o propoziție completă.',
  },
];

export const PILLAR_META: Array<{
  id: CoreGrammarPillarId;
  labelRo: string;
  shortDescRo: string;
  icon: string;
  color: string;
  categoryCode: string;
}> = [
  {
    id: 'substantiv',
    labelRo: 'Substantivul',
    shortDescRo: 'Cine? Ce? A cui?',
    icon: '🔵',
    color: '#1E56A0',
    categoryCode: 'CAS',
  },
  {
    id: 'adjectiv',
    labelRo: 'Adjectivul',
    shortDescRo: 'Cum este?',
    icon: '🟢',
    color: '#237A4B',
    categoryCode: 'AGR',
  },
  {
    id: 'verb',
    labelRo: 'Verbul',
    shortDescRo: 'Ce face?',
    icon: '🔴',
    color: '#C0292B',
    categoryCode: 'SUB',
  },
  {
    id: 'pronume',
    labelRo: 'Pronumele',
    shortDescRo: 'Ține locul',
    icon: '🟡',
    color: '#B2720E',
    categoryCode: 'POS',
  },
  {
    id: 'numeral',
    labelRo: 'Numeralul',
    shortDescRo: 'Câți? Câte?',
    icon: '🟣',
    color: '#6B3FA0',
    categoryCode: 'NUM',
  },
  {
    id: 'propozitie',
    labelRo: 'Propoziția',
    shortDescRo: 'Subiect & Predicat',
    icon: '🧭',
    color: '#5C402B',
    categoryCode: 'CLQ',
  },
];

export const STARTER_CONVERSATIONAL_LESSONS: ConversationalGrammarLesson[] = [
  // Nugget 1 — Step 1: Just Substantiv (un / o) with recorded studio audio words!
  {
    id: 'nugget-1-step-1',
    pillarId: 'substantiv',
    nuggetIndex: 1,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:00:00Z',
    source: 'curated',
    proficiencyTier: 'Ucenic',
    titleRo: 'Pepita 1: Substantivul (un / o)',
    mioritaTheoryRo:
      'Orice ființă sau lucru are un nume numit Substantiv (🔵). În română numărăm masculinul și neutrul cu „un” (un câine, un tren) și femininul cu „o” (o casă, o carte).',
    secretFormulaRo: '🇬🇧 a dog, a house, a train ➔ 🇷🇴 un câine, o casă, un tren',
    ukSpagBridgeEn: 'English uses "a" for everything; Romanian uses "un" (masculine/neuter) and "o" (feminine).',
    sentenceFullText: 'Un câine vede o casă și un tren.',
    colorCodedWords: [
      {
        word: 'Un câine',
        role: 'substantiv',
        roleLabel: 'Substantiv (Masculin)',
        questionHook: 'Cine?',
        explanation: 'Substantiv masculin — se numără cu „un” (un câine, doi câini).',
      },
      {
        word: 'vede',
        role: 'verb',
        roleLabel: 'Verb (Acțiune)',
        questionHook: 'Ce face?',
        explanation: 'Arată acțiunea din propoziție.',
      },
      {
        word: 'o casă',
        role: 'substantiv',
        roleLabel: 'Substantiv (Feminin)',
        questionHook: 'Ce vede?',
        explanation: 'Substantiv feminin — se numără cu „o” (o casă, două case).',
      },
      {
        word: 'un tren',
        role: 'substantiv',
        roleLabel: 'Substantiv (Neutru)',
        questionHook: 'Ce mai vede?',
        explanation: 'Substantiv neutru — la singular ia „un” (un tren, două trenuri).',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spunem în română „a book” (cuvântul „carte” este feminin)?',
      options: ['un carte', 'o carte'],
      correctIndex: 1,
      explanationRo: '„Carte” este de genul feminin, deci spunem „o carte”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu simplu!', 'Continuă'],
  },
  // Nugget 2 — Step 1: Definite article at the end (-ul / -a)
  {
    id: 'nugget-2-step-1',
    pillarId: 'substantiv',
    nuggetIndex: 2,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:02:00Z',
    source: 'curated',
    proficiencyTier: 'Ucenic',
    titleRo: 'Pepita 2: Codița „the” la final (-ul / -a)',
    mioritaTheoryRo:
      'În engleză pui „the” în fața cuvântului (the boy, the book). În română lipim „the” chiar la sfârșitul substantivului: băiatul (-ul), cartea (-a)!',
    secretFormulaRo: '🇬🇧 the boy / the book ➔ 🇷🇴 băiatul (-ul) / cartea (-a)',
    ukSpagBridgeEn: 'Romanian attaches "the" as an ending (-ul, -le, or -a) instead of a word in front.',
    sentenceFullText: 'Băiatul pune cartea pe masă.',
    colorCodedWords: [
      {
        word: 'Băiatul',
        role: 'substantiv',
        roleLabel: 'Substantiv + „-ul”',
        questionHook: 'Cine?',
        explanation: '„Băiat” + codița „-ul” înseamnă „the boy” (un băiat anume).',
      },
      {
        word: 'pune',
        role: 'verb',
        roleLabel: 'Verb (Acțiune)',
        questionHook: 'Ce face?',
        explanation: 'Acțiunea pe care o face băiatul.',
      },
      {
        word: 'cartea',
        role: 'substantiv',
        roleLabel: 'Substantiv + „-a”',
        questionHook: 'Ce pune?',
        explanation: 'Din „o carte” devine „cartea” (cu „-a” la final = the book).',
      },
      {
        word: 'pe masă',
        role: 'substantiv',
        roleLabel: 'Prepoziție + Substantiv',
        questionHook: 'Unde?',
        explanation: 'După prepoziția „pe”, spunem simplu „pe masă”.',
      },
    ],
    testerQuestion: {
      questionRo: 'Dacă „un câine” înseamnă „a dog”, cum spunem „the dog”?',
      options: ['the câine', 'câinele'],
      correctIndex: 1,
      explanationRo: 'Lipim articolul hotărât „-le” la finalul cuvântului: „câinele”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu cu -ul și -a!', 'Continuă'],
  },
  // Nugget 3 — Step 1: Adjective after noun + agreement
  {
    id: 'nugget-3-step-1',
    pillarId: 'adjectiv',
    nuggetIndex: 3,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:04:00Z',
    source: 'curated',
    proficiencyTier: 'Ucenic',
    titleRo: 'Pepita 3: Adjectivul (🟢) stă DUPĂ substantiv',
    mioritaTheoryRo:
      'Cuvântul verde (🟢 Adjectivul) arată cum este un lucru. În română el stă după substantiv și îi copiază genul: creionul albastru, dar o mașină roșie și casa frumoasă!',
    secretFormulaRo: '🇬🇧 blue pencil / red car ➔ 🇷🇴 creionul albastru / o mașină roșie',
    ukSpagBridgeEn: 'Adjectives come after the noun in Romanian and match its gender and number.',
    sentenceFullText: 'Băiatul vede o mașină roșie și casa frumoasă.',
    colorCodedWords: [
      {
        word: 'Băiatul',
        role: 'substantiv',
        roleLabel: 'Substantiv (-ul)',
        questionHook: 'Cine?',
        explanation: 'Amintim Pepita 2: „băiat” + „-ul” (the boy).',
      },
      {
        word: 'vede',
        role: 'verb',
        roleLabel: 'Verb',
        questionHook: 'Ce face?',
        explanation: 'Acțiunea propoziției.',
      },
      {
        word: 'o mașină roșie',
        role: 'adjectiv',
        roleLabel: 'Substantiv + Adjectiv (-ie)',
        questionHook: 'Ce fel de mașină?',
        explanation: 'Adjectivul „roșie” stă după „mașină” și se acordă la feminin!',
      },
      {
        word: 'casa frumoasă',
        role: 'adjectiv',
        roleLabel: 'Substantiv + Adjectiv (-ă)',
        questionHook: 'Cum este casa?',
        explanation: 'Din „frumos” devine „frumoasă” ca să se potrivească cu „casa”.',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spunem corect în română „the blue pencil”?',
      options: ['albastru creionul', 'creionul albastru'],
      correctIndex: 1,
      explanationRo: 'Mai întâi spunem substantivul („creionul”) și apoi culoarea („albastru”).',
    },
    followUpPrompts: ['Mai arată-mi o propoziție!', 'Continuă'],
  },
  // Nugget 4 — Step 1: Verb (Motorul propoziției)
  {
    id: 'nugget-4-step-1',
    pillarId: 'verb',
    nuggetIndex: 4,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:06:00Z',
    source: 'curated',
    proficiencyTier: 'Ucenic',
    titleRo: 'Pepita 4: Verbul (🔴) — Motorul acțiunii',
    mioritaTheoryRo:
      'Cuvântul roșu (🔴 Verbul) arată ce face subiectul. Fiecare propoziție are un erou (Cine?) și o acțiune (Ce face?): Câinele aleargă lângă un pom!',
    secretFormulaRo: '🇬🇧 The dog runs ➔ 🇷🇴 Câinele (Cine?) + aleargă (Ce face?)',
    ukSpagBridgeEn: 'Every sentence pairs a Subject noun with an Action verb.',
    sentenceFullText: 'Câinele aleargă lângă un pom.',
    colorCodedWords: [
      {
        word: 'Câinele',
        role: 'substantiv',
        roleLabel: 'Substantiv (-le)',
        questionHook: 'Cine aleargă?',
        explanation: 'Subiectul propoziției (un câine ➔ câinele).',
      },
      {
        word: 'aleargă',
        role: 'verb',
        roleLabel: 'Verb (Prezent)',
        questionHook: 'Ce face câinele?',
        explanation: 'Motorul propoziției — arată acțiunea de acum.',
      },
      {
        word: 'lângă',
        role: 'legatura',
        roleLabel: 'Prepoziție',
        questionHook: 'Unde?',
        explanation: 'Arată locul.',
      },
      {
        word: 'un pom',
        role: 'substantiv',
        roleLabel: 'Substantiv (Masculin)',
        questionHook: 'Lângă ce?',
        explanation: 'Substantiv masculin (un pom, doi pomi).',
      },
    ],
    testerQuestion: {
      questionRo: 'Care cuvânt arată ACȚIUNEA (Verbul 🔴) în propoziția de mai sus?',
      options: ['Câinele', 'aleargă', 'un pom'],
      correctIndex: 1,
      explanationRo: '„Aleargă” răspunde la întrebarea „Ce face?” și este verbul propoziției.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu!', 'Continuă'],
  },
  // Nugget 5 — Possessive Genitive (-ii / -ului)
  {
    id: 'nugget-5-step-1',
    pillarId: 'substantiv',
    nuggetIndex: 5,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:08:00Z',
    source: 'curated',
    proficiencyTier: 'Călător',
    titleRo: 'Pepita 5: Codița „A cui?” (-ii și -ului)',
    mioritaTheoryRo:
      'Când întrebăm „A cui este?”, nu folosim cuvântul „la”. Schimbăm codița posesorului: bunica ➔ casa bunicii (-ii), iar băiatul ➔ mingea băiatului (-ului)!',
    secretFormulaRo: '🇬🇧 the boy’s ball / grandma’s house ➔ 🇷🇴 mingea băiatului / casa bunicii',
    ukSpagBridgeEn: 'Instead of apostrophe + s, Romanian uses the ending -ii (feminine) or -ului (masculine).',
    sentenceFullText: 'Mingea băiatului este la casa bunicii.',
    colorCodedWords: [
      {
        word: 'Mingea băiatului',
        role: 'substantiv',
        roleLabel: 'Substantiv cu „-ului” (A cui?)',
        questionHook: 'A cui minge?',
        explanation: 'Codița masculină „-ului” arată că mingea aparține băiatului!',
      },
      {
        word: 'este',
        role: 'verb',
        roleLabel: 'Verb (Prezent)',
        questionHook: 'Ce face / Unde se află?',
        explanation: 'Verbul propoziției.',
      },
      {
        word: 'la',
        role: 'legatura',
        roleLabel: 'Prepoziție de loc',
        questionHook: 'Unde?',
        explanation: 'Arată direcția sau locul („at”), nu posesia!',
      },
      {
        word: 'casa bunicii',
        role: 'substantiv',
        roleLabel: 'Substantiv cu „-ii” (A cui?)',
        questionHook: 'A cui casă?',
        explanation: 'Din „bunica” devine „bunicii” cu terminația „-ii”!',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spunem corect „the girl’s book” (cartea aparține fetei)?',
      options: ['cartea la fată', 'cartea fetei'],
      correctIndex: 1,
      explanationRo: 'Pentru feminin („fată”), schimbăm finalul cuvântului: „cartea fetei”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu cu -ii și -ului!', 'Continuă'],
  },
  // Nugget 6 — Bridge "SĂ"
  {
    id: 'nugget-6-step-1',
    pillarId: 'verb',
    nuggetIndex: 6,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:10:00Z',
    source: 'curated',
    proficiencyTier: 'Călător',
    titleRo: 'Pepita 6: Puntea „SĂ” (🟤) între două verbe',
    mioritaTheoryRo:
      'Când două verbe vin unul după altul (ca în engleză „I want to go”), în română așezăm mereu puntea „SĂ” între ele: vreau să merg afară!',
    secretFormulaRo: '🇬🇧 I want to go / I like to draw ➔ 🇷🇴 vreau să merg / îmi place să desenez',
    ukSpagBridgeEn: 'Romanian connects two verbs using "să" where English uses "to".',
    sentenceFullText: 'Eu vreau să merg afară și pot să te ajut.',
    colorCodedWords: [
      {
        word: 'Eu',
        role: 'pronume',
        roleLabel: 'Pronume (Subiect)',
        questionHook: 'Cine?',
        explanation: 'Persoana care vorbește.',
      },
      {
        word: 'vreau să merg afară',
        role: 'verb',
        roleLabel: 'Verb 1 + Puntea „SĂ” + Verb 2',
        questionHook: 'Ce vreau să fac?',
        explanation: 'Puntea „să” leagă verbul „vreau” de verbul „merg”!',
      },
      {
        word: 'și',
        role: 'legatura',
        roleLabel: 'Cuvânt de legătură',
        questionHook: 'Ce unește?',
        explanation: 'Unește cele două părți ale propoziției.',
      },
      {
        word: 'pot să te ajut',
        role: 'verb',
        roleLabel: 'Verb 1 + Puntea „SĂ” + Verb 2',
        questionHook: 'Ce pot să fac?',
        explanation: 'Din nou, puntea „să” stă între „pot” și „ajut”!',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spunem în română „I like to draw”?',
      options: ['Îmi place desenez', 'Îmi place să desenez'],
      correctIndex: 1,
      explanationRo: 'Punem puntea „să” înaintea celui de-al doilea verb: „Îmi place să desenez”.',
    },
    followUpPrompts: ['Mai arată-mi o propoziție cu să!', 'Continuă'],
  },
  // Nugget 7 — Numeral Doi vs Două
  {
    id: 'nugget-7-step-1',
    pillarId: 'numeral',
    nuggetIndex: 7,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:12:00Z',
    source: 'curated',
    proficiencyTier: 'Călător',
    titleRo: 'Pepita 7: Numeralul (🟣) — Doi vs. Două',
    mioritaTheoryRo:
      'În română, numărul 2 are două forme: „doi” pentru masculin (doi câini albi), dar „două” pentru feminin și neutru (două case, două trenuri)!',
    secretFormulaRo: '🇬🇧 two white dogs / two trains ➔ 🇷🇴 doi câini albi / două trenuri',
    ukSpagBridgeEn: 'The number 2 changes to "doi" (masculine) or "două" (feminine/neuter).',
    sentenceFullText: 'Doi câini albi văd două trenuri și trei mere verzi.',
    colorCodedWords: [
      {
        word: 'Doi câini albi',
        role: 'numeral',
        roleLabel: 'Masculin Plural (Doi)',
        questionHook: 'Câți câini?',
        explanation: 'Pentru masculin plural numărăm cu „doi” și adjectivul ia „-i” („câini albi”).',
      },
      {
        word: 'văd',
        role: 'verb',
        roleLabel: 'Verb (Prezent)',
        questionHook: 'Ce fac?',
        explanation: 'Acțiunea propoziției.',
      },
      {
        word: 'două trenuri',
        role: 'numeral',
        roleLabel: 'Neutru Plural (Două)',
        questionHook: 'Câte trenuri?',
        explanation: 'La plural, neutrul și femininul se numără cu „două” („două trenuri”).',
      },
      {
        word: 'trei mere verzi',
        role: 'adjectiv',
        roleLabel: 'Numeral + Substantiv + Adjectiv',
        questionHook: 'Câte și ce fel de mere?',
        explanation: 'De la 3 în sus forma e aceeași: „trei mere verzi”.',
      },
    ],
    testerQuestion: {
      questionRo: 'Dacă la singular spunem „un scaun” (neutru), cum numărăm 2 scaune?',
      options: ['doi scaune', 'două scaune'],
      correctIndex: 1,
      explanationRo: 'Substantivele neutre primesc „două” la plural: „două scaune”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu!', 'Continuă'],
  },
  // Nugget 8 — Numeral >= 20 with "DE"
  {
    id: 'nugget-8-step-1',
    pillarId: 'numeral',
    nuggetIndex: 8,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:14:00Z',
    source: 'curated',
    proficiencyTier: 'Călător',
    titleRo: 'Pepita 8: Puntea „DE” la numere mari (≥ 20)',
    mioritaTheoryRo:
      'Pentru numerele de la 1 la 19 legăm direct substantivul (cinci cărți). De la 20 în sus, așezăm mereu puntea „DE”: douăzeci de mere!',
    secretFormulaRo: 'Sub 20: „cinci cărți” ➔ De la 20 în sus: „douăzeci DE mere”',
    ukSpagBridgeEn: 'Numbers 20 and above require the preposition "de" before the noun in Romanian.',
    sentenceFullText: 'Băiatul are cinci cărți și douăzeci de mere.',
    colorCodedWords: [
      {
        word: 'Băiatul',
        role: 'substantiv',
        roleLabel: 'Substantiv (-ul)',
        questionHook: 'Cine?',
        explanation: 'Subiectul propoziției.',
      },
      {
        word: 'are',
        role: 'verb',
        roleLabel: 'Verb (Prezent)',
        questionHook: 'Ce face?',
        explanation: 'Verbul „a avea”.',
      },
      {
        word: 'cinci cărți',
        role: 'numeral',
        roleLabel: 'Numeral sub 20 (fără DE)',
        questionHook: 'Câte cărți?',
        explanation: 'Numărul 5 este sub 20, deci nu punem „de”.',
      },
      {
        word: 'douăzeci de mere',
        role: 'numeral',
        roleLabel: 'Numeral ≥ 20 (cu „DE”)',
        questionHook: 'Câte mere?',
        explanation: 'Fiindcă 20 este ≥ 20, punem obligatoriu puntea „de”!',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum numărăm corect 35 de oițe pe munte?',
      options: ['treizeci și cinci oițe', 'treizeci și cinci de oițe'],
      correctIndex: 1,
      explanationRo: '35 este peste 20, deci folosim puntea „de”: „treizeci și cinci de oițe”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu!', 'Continuă'],
  },
  // Nugget 9 — Pronumele & Pe
  {
    id: 'nugget-9-step-1',
    pillarId: 'pronume',
    nuggetIndex: 9,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:15:00Z',
    source: 'curated',
    proficiencyTier: 'Meșter',
    titleRo: 'Pepita 9: Pronumele (🟡) și puntea „PE” pentru persoane',
    mioritaTheoryRo:
      'Când vedem sau ajutăm o persoană anume, punem cuvântul „PE” în fața ei și un mic pronume-ecou („l-” sau „o”) lângă verb: L-am văzut pe Ion și o ajut pe bunica!',
    secretFormulaRo: '🇬🇧 I saw Ion / I help grandma ➔ 🇷🇴 L-am văzut pe Ion / O ajut pe bunica',
    ukSpagBridgeEn: 'Specific human objects use "pe" plus a short pronoun echo ("l-" or "o").',
    sentenceFullText: 'L-am văzut pe Ion și o ajut pe bunica.',
    colorCodedWords: [
      {
        word: 'L-am văzut pe Ion',
        role: 'pronume',
        roleLabel: 'Ecoul „L-” + Verb + „pe Ion”',
        questionHook: 'Pe cine am văzut?',
        explanation: 'Pentru masculin punem ecoul „L-” și prepoziția „pe” în fața numelui „Ion”!',
      },
      {
        word: 'și',
        role: 'legatura',
        roleLabel: 'Legătură',
        questionHook: 'Ce unește?',
        explanation: 'Unește cele două acțiuni.',
      },
      {
        word: 'o ajut pe bunica',
        role: 'pronume',
        roleLabel: 'Ecoul „o” + Verb + „pe bunica”',
        questionHook: 'Pe cine ajut?',
        explanation: 'Pentru feminin punem ecoul „o” înainte de verb și „pe bunica”!',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spunem în română „I am waiting for dad”?',
      options: ['Aștept tata', 'Îl aștept pe tata'],
      correctIndex: 1,
      explanationRo: 'Pentru o persoană de gen masculin („tata”), punem ecoul „Îl” și puntea „pe”: „Îl aștept pe tata”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu!', 'Continuă'],
  },
  // Nugget 10 — Propozitie & Calques
  {
    id: 'nugget-10-step-1',
    pillarId: 'propozitie',
    nuggetIndex: 10,
    stepInNugget: 1,
    createdAt: '2026-10-28T10:18:00Z',
    source: 'curated',
    proficiencyTier: 'Meșter',
    titleRo: 'Pepita 10: Expresii românești cu „A avea” (Am 8 ani, are sens)',
    mioritaTheoryRo:
      'În engleză spui „I am 8 years old” și „it makes sense”. În română însă folosim verbul „a avea”: Eu am 8 ani și ideea are sens!',
    secretFormulaRo: '🇬🇧 I am 8 / makes sense ➔ 🇷🇴 Am 8 ani / are sens',
    ukSpagBridgeEn: 'Romanian uses "to have" (a avea) for age and making sense.',
    sentenceFullText: 'Eu am 8 ani și cartea a mea are sens.',
    colorCodedWords: [
      {
        word: 'Eu',
        role: 'pronume',
        roleLabel: 'Pronume (Subiect)',
        questionHook: 'Cine?',
        explanation: 'Persoana care vorbește.',
      },
      {
        word: 'am 8 ani',
        role: 'verb',
        roleLabel: 'Verbul „a avea” + Vârsta',
        questionHook: 'Câți ani am?',
        explanation: 'Pentru vârstă folosim mereu „am / are”, nu „sunt / este”!',
      },
      {
        word: 'o carte a mea',
        role: 'substantiv',
        roleLabel: 'Substantiv + Posesiv („a mea”)',
        questionHook: 'Ce lucru?',
        explanation: 'Substantiv feminin însoțit de posesivul „a mea”.',
      },
      {
        word: 'are sens',
        role: 'verb',
        roleLabel: 'Expresie cu „a avea”',
        questionHook: 'Ce face?',
        explanation: 'În română spunem „are sens”, nu „face sens”!',
      },
    ],
    testerQuestion: {
      questionRo: 'Cum spui corect în română „It is cold to me / I am cold”?',
      options: ['Eu sunt frig', 'Mi-e frig'],
      correctIndex: 1,
      explanationRo: 'În română spunem „Mi-e frig” (sau „Mi-e foame / Mi-e sete”), nu „sunt frig”.',
    },
    followUpPrompts: ['Mai dă-mi un exemplu!', 'Continuă'],
  },
];

const STORAGE_KEY = 'miorita_ai_grammar_lessons_v2';

function computeTier(score: number): 'Ucenic' | 'Călător' | 'Meșter' {
  if (score >= 75) return 'Meșter';
  if (score >= 45) return 'Călător';
  return 'Ucenic';
}

function createInitialDb(): GrammarProficiencyDatabase {
  const proficiencyByPillar: Record<CoreGrammarPillarId, PillarProficiencyState> = {
    substantiv: { pillarId: 'substantiv', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
    adjectiv: { pillarId: 'adjectiv', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
    verb: { pillarId: 'verb', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
    pronume: { pillarId: 'pronume', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
    numeral: { pillarId: 'numeral', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
    propozitie: { pillarId: 'propozitie', score: 35, tier: 'Ucenic', lessonsExplored: 1, testerCorrect: 0, testerAttempts: 0, recentMistakes: [] },
  };

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    proficiencyByPillar,
    spiral: {
      currentNuggetIndex: 1,
      repInCurrentNugget: 0,
      masteredNuggets: [],
    },
    savedLessons: [...STARTER_CONVERSATIONAL_LESSONS],
  };
}

export class GrammarProficiencyStore {
  static load(): GrammarProficiencyDatabase {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GrammarProficiencyDatabase;
        if (parsed && parsed.proficiencyByPillar && Array.isArray(parsed.savedLessons)) {
          if (!parsed.spiral) {
            parsed.spiral = {
              currentNuggetIndex: 1,
              repInCurrentNugget: 0,
              masteredNuggets: [],
            };
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    const initial = createInitialDb();
    this.save(initial);
    return initial;
  }

  static save(db: GrammarProficiencyDatabase): void {
    db.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Ignore quota errors
    }
  }

  static getSpiralState(): NuggetSpiralState {
    return this.load().spiral;
  }

  static getCurrentNuggetSpec(): NuggetSpec {
    const spiral = this.getSpiralState();
    return (
      CUMULATIVE_NUGGET_LADDER.find((n) => n.nuggetIndex === spiral.currentNuggetIndex) ||
      CUMULATIVE_NUGGET_LADDER[0]
    );
  }

  static setActiveNugget(nuggetIndex: number): NuggetSpec {
    const db = this.load();
    const clamped = Math.max(1, Math.min(CUMULATIVE_NUGGET_LADDER.length, nuggetIndex));
    db.spiral.currentNuggetIndex = clamped;
    db.spiral.repInCurrentNugget = 0;
    this.save(db);
    return this.getCurrentNuggetSpec();
  }

  static advanceSpiralStep(wasCorrect: boolean): {
    nuggetSpec: NuggetSpec;
    repInCurrentNugget: number;
    advancedToNewNugget: boolean;
  } {
    const db = this.load();
    let advancedToNewNugget = false;

    if (wasCorrect) {
      db.spiral.repInCurrentNugget += 1;
      if (db.spiral.repInCurrentNugget >= 3) {
        if (!db.spiral.masteredNuggets.includes(db.spiral.currentNuggetIndex)) {
          db.spiral.masteredNuggets.push(db.spiral.currentNuggetIndex);
        }
        db.spiral.currentNuggetIndex =
          db.spiral.currentNuggetIndex < CUMULATIVE_NUGGET_LADDER.length
            ? db.spiral.currentNuggetIndex + 1
            : 1;
        db.spiral.repInCurrentNugget = 0;
        advancedToNewNugget = true;
      }
    }
    this.save(db);
    return {
      nuggetSpec: this.getCurrentNuggetSpec(),
      repInCurrentNugget: db.spiral.repInCurrentNugget,
      advancedToNewNugget,
    };
  }

  static getStarterLessonForNugget(nuggetIndex: number): ConversationalGrammarLesson {
    const db = this.load();
    const exact = db.savedLessons.find((l) => l.nuggetIndex === nuggetIndex);
    if (exact) return exact;
    const spec =
      CUMULATIVE_NUGGET_LADDER.find((n) => n.nuggetIndex === nuggetIndex) ||
      CUMULATIVE_NUGGET_LADDER[0];
    const byPillar = db.savedLessons.find((l) => l.pillarId === spec.pillarId);
    return byPillar || STARTER_CONVERSATIONAL_LESSONS[0];
  }

  static getProficiency(pillarId: CoreGrammarPillarId): PillarProficiencyState {
    const db = this.load();
    return db.proficiencyByPillar[pillarId] || createInitialDb().proficiencyByPillar[pillarId];
  }

  static getLessonsForPillar(pillarId: CoreGrammarPillarId): ConversationalGrammarLesson[] {
    const db = this.load();
    const list = db.savedLessons.filter((l) => l.pillarId === pillarId);
    if (list.length === 0) {
      const fallback = STARTER_CONVERSATIONAL_LESSONS.filter((l) => l.pillarId === pillarId);
      return fallback.length > 0 ? fallback : [STARTER_CONVERSATIONAL_LESSONS[0]];
    }
    return list;
  }

  static recordTesterAnswer(
    pillarId: CoreGrammarPillarId,
    isCorrect: boolean,
    mistakeSaid?: string
  ): PillarProficiencyState {
    const db = this.load();
    const state = db.proficiencyByPillar[pillarId] || createInitialDb().proficiencyByPillar.substantiv;
    state.testerAttempts += 1;
    if (isCorrect) {
      state.testerCorrect += 1;
      state.score = Math.min(100, state.score + 12);
    } else {
      state.score = Math.max(20, state.score - 4);
      if (mistakeSaid && !state.recentMistakes.includes(mistakeSaid)) {
        state.recentMistakes = [mistakeSaid, ...state.recentMistakes].slice(0, 5);
      }
    }
    state.tier = computeTier(state.score);
    db.proficiencyByPillar[pillarId] = state;
    this.save(db);
    return state;
  }

  static saveGeneratedLesson(lesson: ConversationalGrammarLesson): void {
    const db = this.load();
    const state = db.proficiencyByPillar[lesson.pillarId];
    if (state) {
      state.lessonsExplored += 1;
      state.score = Math.min(100, state.score + 5);
      state.tier = computeTier(state.score);
    }
    const exists = db.savedLessons.some((l) => l.id === lesson.id);
    if (!exists) {
      db.savedLessons.push(lesson);
    }
    this.save(db);
  }
}
