// src/components/casaGramaticii.ts — Școala din Sat (Casa Gramaticii)
// Interactive Theoretical Grammar Hub for Year 4 Heritage Learners (bridging with Romania Grade 4 curriculum).
// Explores the 5 Meșteri ai Vorbirii (Substantiv, Adjectiv, Verb, Pronume, Numeral) + Propoziția (Subiect & Predicat)
// and an Interactive Visual Syntax Explorer (Color Coded Parts of Speech).

import { sound } from '../audio/synth';

export type GrammarTopic = 'substantiv' | 'adjectiv' | 'verb' | 'pronume' | 'numeral' | 'propozitie' | 'detector';

export interface GrammarPillar {
  id: GrammarTopic;
  title: string;
  characterName: string;
  icon: string;
  badgeColor: string;
  tagline: string;
  englishSpagTerm: string;
  secretQuestion: string;
  story: string;
  rules: Array<{ title: string; desc: string; example: string }>;
  contrastWithEnglish: { english: string; romanian: string; explanation: string };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  stationAction?: { label: string; stationKey: string };
}

export const GRAMMAR_PILLARS: GrammarPillar[] = [
  // ==========================================
  // 1. SUBSTANTIVUL
  // ==========================================
  {
    id: 'substantiv',
    title: 'Substantivul',
    characterName: 'Moș Substantiv (Ciobănașul Botezător)',
    icon: '🔵 🧺',
    badgeColor: 'var(--gen-masculin)',
    tagline: 'Dă nume tuturor ființelor, lucrurilor și locurilor din sat!',
    englishSpagTerm: 'Noun',
    secretQuestion: '„Cine este? Ce este?”',
    story:
      'Când satul Mioriței a fost întemeiat, Moș Substantiv a primit o desagă plină cu etichete. El a mers peste tot și a numit fiecare lucru: lup, izvor, casă, munte și Tudor! Fără el, nu am ști cum să chemăm nimic pe nume.',
    rules: [
      {
        title: '1. Comun vs. Propriu',
        desc: 'Substantivul comun numește orice lucru obișnuit (scris cu literă mică). Substantivul propriu este numele unic (scris cu LITERĂ MARE!).',
        example: 'băiat, munte (comun) vs. Tudor, Carpați, Miorița (propriu)',
      },
      {
        title: '2. Numărul (Singular vs. Plural)',
        desc: 'Singular înseamnă că e un singur lucru pe munte. Plural înseamnă că sunt două sau mai multe!',
        example: 'un berbec (singular) ➔ doi berbeci (plural)',
      },
      {
        title: '3. Cele 3 Coșuri (Genurile)',
        desc: 'În română, lucrurile au gen: masculin (un/doi), feminin (o/două) și neutru (un/două)!',
        example: 'un lup / doi lupi (masculin) • o casă / două case (feminin) • un tren / două trenuri (neutru)',
      },
    ],
    contrastWithEnglish: {
      english: 'a dog, a table, London',
      romanian: 'un câine, o masă, Londra',
      explanation:
        'În engleză, obiectele sunt neutre și folosesc mereu „a” sau „it”. În română, fiecare substantiv are un gen muzical și se numără cu un/doi, o/două!',
    },
    quiz: {
      question: 'Care dintre următoarele este un substantiv PROPRIU (scris cu literă mare)?',
      options: ['copac', 'Tudor', 'minge', 'sat'],
      correctIndex: 1,
      explanation: 'Tudor este un substantiv propriu fiindcă este numele unui băiat minunat și se scrie cu majusculă!',
    },
    stationAction: { label: '🧺 Exersează la Grădina cu Genuri', stationKey: 'gen' },
  },

  // ==========================================
  // 2. ADJECTIVUL
  // ==========================================
  {
    id: 'adjectiv',
    title: 'Adjectivul',
    characterName: 'Zugravul Adjectiv (Pictorul Cameleon)',
    icon: '🟢 🎨',
    badgeColor: 'var(--gen-neutru)',
    tagline: 'Colorează și descrie substantivul prin dansul acordului!',
    englishSpagTerm: 'Adjective',
    secretQuestion: '„Ce fel de? Cum este? Care?”',
    story:
      'Zugravul Adjectiv umblă prin sat cu pensula în mână. Unde vede o căsuță, o face „albă” sau „luminoasă”. Unde vede un lup, îl face „fioros” sau „iute”. Dar are o regulă sacră: își schimbă haina exact după substantiv!',
    rules: [
      {
        title: 'Dansul Acordului (Marea Regulă)',
        desc: 'Adjectivul se acordă în gen și număr cu substantivul pe care îl însoțește. Dacă substantivul este fată, și adjectivul se face fetiță!',
        example: 'băiat harnic ➔ fată harnică • băieți harnici ➔ fete harnice',
      },
      {
        title: 'Unde stă adjectivul?',
        desc: 'În engleză adjectivul stă mereu în față (red apple). În română stă de obicei DUPĂ substantiv!',
        example: 'măr roșu (nu roșu măr) • câine cuminte (nu cuminte câine)',
      },
    ],
    contrastWithEnglish: {
      english: 'good boy, good girl, good books (good never changes)',
      romanian: 'băiat bun, fată bună, cărți bune (se schimbă mereu!)',
      explanation:
        'În engleză „good” rămâne neschimbat. În română, adjectivul este un cameleon fidel: bun ➔ bună ➔ buni ➔ bune.',
    },
    quiz: {
      question: 'Cum spunem corect despre mai multe fete?',
      options: ['fete cuminte', 'fete cuminți', 'fete cuminților'],
      correctIndex: 1,
      explanation: 'La plural feminin spunem: fete cuminți (adjectivul face dansul acordului la plural)!',
    },
    stationAction: { label: '🎨 Exersează la Atelierul de Culori', stationKey: 'agr' },
  },

  // ==========================================
  // 3. VERBUL
  // ==========================================
  {
    id: 'verb',
    title: 'Verbul',
    characterName: 'Morarul Verb (Motorul Propoziției)',
    icon: '🔴 ⚙️',
    badgeColor: 'var(--gen-feminin)',
    tagline: 'Fără el, satul stă pe loc! Arată acțiunea, starea și timpul.',
    englishSpagTerm: 'Verb',
    secretQuestion: '„Ce face? Ce a făcut? Ce va face?”',
    story:
      'Roata morii se învârte fără oprire. Morarul Verb este cel care macină, aleargă, gândește și trăiește. Fiecare propoziție are nevoie de un verb ca să aibă viață!',
    rules: [
      {
        title: '1. Cele 3 Timpuri (Ieri, Azi, Mâine)',
        desc: 'Trecut = ce s-a întâmplat ieri. Prezent = ce facem acum în această secundă. Viitor = ce vom face mâine.',
        example: 'Ieri am citit (trecut) • Azi citesc (prezent) • Mâine voi citi (viitor)',
      },
      {
        title: '2. Cele 6 Persoane',
        desc: 'Cine învârte moara? Eu (1 sg), Tu (2 sg), El/Ea (3 sg), Noi (1 pl), Voi (2 pl), Ei/Ele (3 pl).',
        example: 'eu merg, tu mergi, el merge, noi mergem, voi mergeți, ei merg',
      },
    ],
    contrastWithEnglish: {
      english: 'I read, you read, we read (identical)',
      romanian: 'eu citesc, tu citești, noi citim (terminații diferite)',
      explanation:
        'Pentru că fiecare persoană are o terminație proprie în română, adesea nu mai e nevoie să zicem „eu” sau „noi”: spunem direct „Citim o poveste”!',
    },
    quiz: {
      question: 'La ce timp este verbul din: „Ieri am alergat prin parc”?',
      options: ['Prezent (azi)', 'Trecut (ieri)', 'Viitor (mâine)'],
      correctIndex: 1,
      explanation: '„Am alergat” arată o acțiune terminată în trecut (ieri)!',
    },
    stationAction: { label: '🪨 Exersează la Poteca lui Să', stationKey: 'sub' },
  },

  // ==========================================
  // 4. PRONUMELE
  // ==========================================
  {
    id: 'pronume',
    title: 'Pronumele',
    characterName: 'Cascadorul Pronume (Dublura Secretă)',
    icon: '🟡 🦸',
    badgeColor: 'var(--gold-bell)',
    tagline: 'Ține locul substantivului ca să nu fim plictisitori!',
    englishSpagTerm: 'Pronoun',
    secretQuestion: '„Cine ține locul substantivului?”',
    story:
      'Dacă am spune: „Tudor a venit, Tudor a citit, Tudor s-a bucurat”, toată lumea ar căsca de plictiseală. De aceea a apărut Cascadorul Pronume: el sare în schemă și zice: „Tudor a venit. EL a citit și s-a bucurat!”',
    rules: [
      {
        title: 'Pronumele Personale',
        desc: 'Țin locul oamenilor și prietenilor noștri.',
        example: 'Eu, Tu, El, Ea (singular) • Noi, Voi, Ei, Ele (plural)',
      },
      {
        title: 'Pronumele de Politețe',
        desc: 'În limba română avem cuvinte de respect pentru bunici, învățători și adulți.',
        example: 'Dumneavoastră (respect pentru un adult sau mai mulți) • Dumneata',
      },
    ],
    contrastWithEnglish: {
      english: 'you (used for both friends and adults)',
      romanian: 'tu (pentru colegi/prieteni) vs. dumneavoastră (pentru adulți)',
      explanation:
        'În engleză folosești „you” pentru toată lumea. În română, când vorbești cu doamna învățătoare sau cu bunicul, folosești frumosul pronume de politețe „Dumneavoastră”.',
    },
    quiz: {
      question: 'Ce pronume îi ține locul Mioriței în propoziția: „...paște iarbă verde”?',
      options: ['El', 'Ea', 'Ei', 'Noi'],
      correctIndex: 1,
      explanation: 'Miorița este o oiță (feminin), așa că dublura ei este pronumele „Ea”!',
    },
    stationAction: { label: '🪣 Exersează la Fântâna Posesivelor', stationKey: 'pos' },
  },

  // ==========================================
  // 5. NUMERALUL
  // ==========================================
  {
    id: 'numeral',
    title: 'Numeralul',
    characterName: 'Negustorul Numeral (Cântarul din Târg)',
    icon: '🟣 ⚖️',
    badgeColor: '#7A4988',
    tagline: 'Numără cantitatea și arată ordinea la sosire!',
    englishSpagTerm: 'Numeral / Number',
    secretQuestion: '„Câți? Câte? Al câtelea? A câta?”',
    story:
      'La Târgul de Numere, Negustorul Numeral are o balanță din aramă și două sarcini mari: să numere berbecii și sacii (numeral cardinal) și să împartă medaliile la concurs (numeral ordinal)!',
    rules: [
      {
        title: '1. Cardinal vs. Ordinal',
        desc: 'Cardinal arată numărul exact (trei mere). Ordinal arată locul sau ordinea (al treilea măr).',
        example: 'doi băieți (cardinal) ➔ al doilea băiat (ordinal)',
      },
      {
        title: '2. Regula magică a lui DE',
        desc: 'Numerele sub 20 se spun simplu (cinci mere). De la 20 în sus, româna cere mereu „DE”!',
        example: 'nouăsprezece mere (fără de) ➔ douăzeci DE mere (cu DE!)',
      },
      {
        title: '3. Numere cu gen (doi vs. două)',
        desc: 'Numerele 1 și 2 își schimbă forma după gen: un băiat/o fată, doi băieți/două fete, doisprezece/douăsprezece.',
        example: 'doi câini (masculin) • două pisici (feminin)',
      },
    ],
    contrastWithEnglish: {
      english: 'twenty apples (no "of")',
      romanian: 'douăzeci DE mere (cere întotdeauna „DE”)',
      explanation:
        'Engleza nu pune niciodată „of” după numere. În română, de la 20 în sus, greutatea „DE” este obligatorie!',
    },
    quiz: {
      question: 'Cum cerem corect la piață 25 de morcovi?',
      options: ['douăzeci și cinci morcovi', 'douăzeci și cinci de morcovi', 'douăzeci cinci morcovi'],
      correctIndex: 1,
      explanation: 'Fiind peste 20, cerem: „douăzeci și cinci DE morcovi”!',
    },
    stationAction: { label: '⚖️ Exersează la Târgul de Numere', stationKey: 'num' },
  },

  // ==========================================
  // 6. PROPOZIȚIA (SUBIECT & PREDICAT)
  // ==========================================
  {
    id: 'propozitie',
    title: 'Propoziția',
    characterName: 'Paznicii Porții (Subiectul & Predicatul)',
    icon: '🧭 🏛️',
    badgeColor: 'var(--walnut)',
    tagline: 'Cine face acțiunea? (Subiect) + Ce face? (Predicat)',
    englishSpagTerm: 'Subject & Predicate',
    secretQuestion: '„Cine? (Subiectul) + Ce face? (Predicatul)”',
    story:
      'La intrarea în cetatea limbii române stau doi paznici strașnici: Paznicul Subiect și Paznicul Predicat. Nicio propoziție nu poate trece poarta dacă nu răspunde la cele două întrebări: Cine face fapta? și Ce face el?',
    rules: [
      {
        title: '1. Predicatul (Inima propoziției)',
        desc: 'Spune ce face subiectul. Este aproape întotdeauna exprimat printr-un VERB!',
        example: 'Tudor [CITEȘTE] o poveste.',
      },
      {
        title: '2. Subiectul (Eroul propoziției)',
        desc: 'Spune cine face acțiunea. Răspunde la întrebarea „Cine?”. Este de obicei un SUBSTANTIV sau PRONUME!',
        example: '[TUDOR] citește o poveste.',
      },
    ],
    contrastWithEnglish: {
      english: 'The sheep eats grass. (Subject: The sheep, Verb: eats)',
      romanian: 'Oița mănâncă iarbă. (Subiect: Oița, Predicat: mănâncă)',
      explanation:
        'Aici româna și engleza sunt surori bune! Cine face acțiunea este Subiectul (Subject), iar acțiunea însăși este Predicatul (Predicate/Verb).',
    },
    quiz: {
      question: 'Care este SUBIECTUL în propoziția: „Voinicul Tudor a învins balaurul”?',
      options: ['Voinicul Tudor', 'a învins', 'balaurul'],
      correctIndex: 0,
      explanation: 'Cine a învins balaurul? Voinicul Tudor! El este subiectul (eroul acțiunii)!',
    },
  },
];

// Interactive Visual Syntax Explorer sample sentences
export interface SyntaxWord {
  word: string;
  role: 'substantiv' | 'adjectiv' | 'verb' | 'pronume' | 'numeral' | 'legatura';
  roleLabel: string;
  color: string;
  explanation: string;
}

export interface SyntaxSentence {
  id: string;
  fullText: string;
  words: SyntaxWord[];
}

export const SYNTAX_SENTENCES: SyntaxSentence[] = [
  {
    id: 'SENT-01',
    fullText: 'Miorița năzdrăvană păzește trei stâni vechi.',
    words: [
      { word: 'Miorița', role: 'substantiv', roleLabel: 'Substantiv Propriu', color: 'var(--gen-masculin)', explanation: 'Numele oiței (Subiect, feminin singular)' },
      { word: 'năzdrăvană', role: 'adjectiv', roleLabel: 'Adjectiv', color: 'var(--gen-neutru)', explanation: 'Arată cum este oița (acord feminin singular)' },
      { word: 'păzește', role: 'verb', roleLabel: 'Verb (Predicat)', color: 'var(--gen-feminin)', explanation: 'Arată acțiunea: ce face Miorița? Timpul prezent' },
      { word: 'trei', role: 'numeral', roleLabel: 'Numeral Cardinal', color: '#7A4988', explanation: 'Arată numărul exact de stâni (câte stâni?)' },
      { word: 'stâni', role: 'substantiv', roleLabel: 'Substantiv Comun', color: 'var(--gen-masculin)', explanation: 'Nume de locuri la plural (feminin plural)' },
      { word: 'vechi', role: 'adjectiv', roleLabel: 'Adjectiv', color: 'var(--gen-neutru)', explanation: 'Arată cum sunt stânile (acord plural)' },
    ],
  },
  {
    id: 'SENT-02',
    fullText: 'Tudor scrie o poveste frumoasă în caietul lui.',
    words: [
      { word: 'Tudor', role: 'substantiv', roleLabel: 'Substantiv Propriu', color: 'var(--gen-masculin)', explanation: 'Numele băiatului (Subiectul acțiunii)' },
      { word: 'scrie', role: 'verb', roleLabel: 'Verb (Predicat)', color: 'var(--gen-feminin)', explanation: 'Acțiunea: ce face Tudor? Timpul prezent' },
      { word: 'o poveste', role: 'substantiv', roleLabel: 'Substantiv Comun', color: 'var(--gen-masculin)', explanation: 'Ce scrie? Un substantiv feminin' },
      { word: 'frumoasă', role: 'adjectiv', roleLabel: 'Adjectiv', color: 'var(--gen-neutru)', explanation: 'Cum este povestea? Acord feminin singular' },
      { word: 'în', role: 'legatura', roleLabel: 'Prepoziție', color: '#8C5B3F', explanation: 'Punct de legătură care arată locul' },
      { word: 'caietul', role: 'substantiv', roleLabel: 'Substantiv Hotărât', color: 'var(--gen-masculin)', explanation: 'Substantiv articulat cu -ul' },
      { word: 'lui', role: 'pronume', roleLabel: 'Pronume Posesiv', color: 'var(--gold-bell)', explanation: 'Al cui este caietul? Al lui!' },
    ],
  },
  {
    id: 'SENT-03',
    fullText: 'Noi mâncăm douăzeci de mere dulci la bunica.',
    words: [
      { word: 'Noi', role: 'pronume', roleLabel: 'Pronume Personal', color: 'var(--gold-bell)', explanation: 'Persoana I plural: cine mănâncă? Noi!' },
      { word: 'mâncăm', role: 'verb', roleLabel: 'Verb (Predicat)', color: 'var(--gen-feminin)', explanation: 'Ce facem noi? Timpul prezent' },
      { word: 'douăzeci de', role: 'numeral', roleLabel: 'Numeral cu „DE”', color: '#7A4988', explanation: 'Peste 20: cere cuvântul „DE”!' },
      { word: 'mere', role: 'substantiv', roleLabel: 'Substantiv Comun', color: 'var(--gen-masculin)', explanation: 'Nume de fructe (neutru plural)' },
      { word: 'dulci', role: 'adjectiv', roleLabel: 'Adjectiv', color: 'var(--gen-neutru)', explanation: 'Cum sunt merele? Acord plural' },
      { word: 'la bunica', role: 'substantiv', roleLabel: 'Substantiv cu Prepoziție', color: 'var(--gen-masculin)', explanation: 'Unde mâncăm? La bunica!' },
    ],
  },
];

export class CasaGramaticiiModal {
  private container: HTMLElement;
  private onClose: () => void;
  private onNavigateStation?: (stationKey: string) => void;
  private currentTopic: GrammarTopic = 'substantiv';
  private currentSentenceIndex = 0;
  private activeWordInfo: SyntaxWord | null = null;
  private quizAnswered: Record<string, number> = {};

  constructor(
    container: HTMLElement,
    onClose: () => void,
    onNavigateStation?: (stationKey: string) => void
  ) {
    this.container = container;
    this.onClose = onClose;
    this.onNavigateStation = onNavigateStation;
  }

  render() {
    this.container.innerHTML = `
      <div class="grammar-modal-backdrop" style="position: fixed; inset: 0; background: rgba(43, 38, 34, 0.65); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(3px); animation: floatIn 0.2s ease;">
        <div class="grammar-modal-card" style="background: var(--linen-pure); border: 3px solid var(--walnut); border-radius: var(--radius-lg); width: 100%; max-width: 860px; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 18px;">
          
          <!-- Top Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--linen-dark); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 34px;">🏫</span>
              <div>
                <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--walnut); margin: 0;">Școala din Sat — Casa Gramaticii</h2>
                <p style="font-size: 13px; color: #6C5B4F; margin: 2px 0 0 0;">Părțile de vorbire și secretele limbii române pe înțelesul lui Tudor</p>
              </div>
            </div>
            <button id="btnCloseGrammar" style="background: var(--linen-card); border: 1.5px solid var(--walnut); border-radius: 999px; width: 38px; height: 38px; font-size: 16px; font-weight: bold; cursor: pointer; color: var(--walnut); display: flex; align-items: center; justify-content: center; min-height: 38px;">
              ✕
            </button>
          </div>

          <!-- Grammar Navigation Tabs -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
            <button class="grammar-tab-btn ${this.currentTopic === 'substantiv' ? 'active' : ''}" data-topic="substantiv" style="border-color: var(--gen-masculin);">
              🔵 Substantivul
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'adjectiv' ? 'active' : ''}" data-topic="adjectiv" style="border-color: var(--gen-neutru);">
              🟢 Adjectivul
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'verb' ? 'active' : ''}" data-topic="verb" style="border-color: var(--gen-feminin);">
              🔴 Verbul
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'pronume' ? 'active' : ''}" data-topic="pronume" style="border-color: var(--gold-bell);">
              🟡 Pronumele
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'numeral' ? 'active' : ''}" data-topic="numeral" style="border-color: #7A4988;">
              🟣 Numeralul
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'propozitie' ? 'active' : ''}" data-topic="propozitie" style="border-color: var(--walnut);">
              🧭 Propoziția
            </button>
            <button class="grammar-tab-btn ${this.currentTopic === 'detector' ? 'active' : ''}" data-topic="detector" style="background: rgba(212, 160, 23, 0.2); border-color: var(--gold-bell); font-weight: 800;">
              🔬 Detectorul de Cuvinte
            </button>
          </div>

          <!-- Main Body Content -->
          <div id="grammarContentRoot">
            ${this.renderActiveContent()}
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderActiveContent(): string {
    if (this.currentTopic === 'detector') {
      return this.renderDetectorContent();
    }

    const pillar = GRAMMAR_PILLARS.find((p) => p.id === this.currentTopic);
    if (!pillar) return '';

    const answeredIndex = this.quizAnswered[pillar.id];
    const isAnswered = answeredIndex !== undefined;
    const isCorrect = isAnswered && answeredIndex === pillar.quiz.correctIndex;

    return `
      <div style="display: flex; flex-direction: column; gap: 18px; animation: floatIn 0.2s ease;">
        
        <!-- Meșter Character Sheet Banner -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 18px 20px; display: flex; align-items: flex-start; gap: 16px;">
          <div style="font-size: 44px; line-height: 1; flex-shrink: 0; background: #FFF; padding: 10px; border-radius: var(--radius-md); border: 2px solid var(--linen-dark);">
            ${pillar.icon}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--walnut); margin: 0;">
                ${pillar.characterName}
              </h3>
              <span style="background: #FFF; border: 1.5px solid ${pillar.badgeColor}; color: ${pillar.badgeColor}; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">
                🇬🇧 SPaG: ${pillar.englishSpagTerm}
              </span>
            </div>
            <p style="font-size: 14px; color: #5C402B; margin: 4px 0 8px 0; font-weight: 600;">
              „${pillar.tagline}”
            </p>
            <div style="font-size: 13px; color: #6C5B4F; line-height: 1.45;">
              ${pillar.story}
            </div>
          </div>
        </div>

        <!-- Secret Question Pill -->
        <div style="background: #FFF; border-left: 4px solid ${pillar.badgeColor}; padding: 10px 16px; border-radius: 0 var(--radius-md) var(--radius-md) 0; box-shadow: var(--soft-shadow); font-size: 14px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🕵️‍♂️</span>
          <span><strong>Întrebarea de detectiv:</strong> Când vrei să găsești acest meșter într-o propoziție, întreabă: <span style="color:${pillar.badgeColor}; font-weight: bold; font-size: 16px;">${pillar.secretQuestion}</span></span>
        </div>

        <!-- Secret Rules List -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          ${pillar.rules
            .map(
              (r) => `
            <div style="background: #FFF; border: 1.5px solid var(--linen-dark); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 6px;">
              <strong style="color: var(--walnut); font-size: 15px;">${r.title}</strong>
              <span style="font-size: 13px; color: #6C5B4F; line-height: 1.4;">${r.desc}</span>
              <div style="background: var(--linen-pure); border: 1px dashed var(--walnut-light); padding: 6px 10px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--ink-charcoal); margin-top: auto;">
                Exemplu: ${r.example}
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Contrast with English Box -->
        <div style="background: #FFFDF7; border: 2px solid var(--gold-bell); border-radius: var(--radius-md); padding: 14px 18px; font-size: 13px; line-height: 1.45; color: var(--walnut);">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; margin-bottom: 4px; font-size: 14px;">
            <span>🇬🇧🇷🇴</span>
            <span>Puntea Bilingvă (Cum e la școală în Londra vs. în România):</span>
          </div>
          <div>${pillar.contrastWithEnglish.explanation}</div>
        </div>

        <!-- Interactive Mini-Quiz -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;">
          <div style="font-weight: 700; font-size: 15px; color: var(--walnut); display: flex; align-items: center; gap: 6px;">
            <span>🎯</span>
            <span>Mini-Test de Detectiv: ${pillar.quiz.question}</span>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${pillar.quiz.options
              .map(
                (opt, idx) => `
              <button class="grammar-quiz-option-btn ${
                isAnswered
                  ? idx === pillar.quiz.correctIndex
                    ? 'correct'
                    : idx === answeredIndex
                    ? 'wrong'
                    : ''
                  : ''
              }" data-index="${idx}" ${isAnswered ? 'disabled' : ''} style="background: #FFF; border: 2px solid var(--walnut); border-radius: var(--radius-md); padding: 10px 18px; font-weight: bold; font-size: 15px; cursor: pointer; min-height: 44px; transition: all 0.15s ease;">
                ${opt}
              </button>
            `
              )
              .join('')}
          </div>

          ${
            isAnswered
              ? `
            <div style="background: ${isCorrect ? 'var(--gen-neutru-bg)' : '#FDE8E8'}; border: 1.5px solid ${isCorrect ? 'var(--gen-neutru)' : 'var(--gen-feminin)'}; color: ${isCorrect ? 'var(--gen-neutru)' : 'var(--gen-feminin)'}; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>${isCorrect ? '🎉 Bravo, Tudor!' : '💡 Sfatul Mioriței:'}</span>
              <span>${pillar.quiz.explanation}</span>
            </div>
          `
              : ''
          }
        </div>

        <!-- Action Button to Station -->
        ${
          pillar.stationAction
            ? `
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-go-to-station" data-station="${pillar.stationAction.stationKey}" style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 12px 22px; font-weight: bold; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--soft-shadow); min-height: 48px;">
              <span>${pillar.stationAction.label}</span>
              <span>➔</span>
            </button>
          </div>
        `
            : ''
        }

      </div>
    `;
  }

  private renderDetectorContent(): string {
    const sentence = SYNTAX_SENTENCES[this.currentSentenceIndex];

    return `
      <div style="display: flex; flex-direction: column; gap: 18px; animation: floatIn 0.2s ease;">
        
        <!-- Detector Banner -->
        <div style="background: #FFFDF7; border: 2px solid var(--gold-bell); border-radius: var(--radius-md); padding: 16px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 20px; color: var(--walnut); margin: 0;">
                🔬 Detectorul Vizual de Părți de Vorbire
              </h3>
              <p style="font-size: 13px; color: #6C5B4F; margin: 4px 0 0 0;">
                Apasă pe fiecare cuvânt colorat pentru a-i descoperi rolul în propoziție!
              </p>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <button id="btnPrevSentence" style="background: #FFF; border: 1.5px solid var(--walnut); border-radius: var(--radius-sm); padding: 6px 12px; font-size: 13px; font-weight: bold; cursor: pointer;">
                ◀ Propoziția anterioară
              </button>
              <button id="btnNextSentence" style="background: #FFF; border: 1.5px solid var(--walnut); border-radius: var(--radius-sm); padding: 6px 12px; font-size: 13px; font-weight: bold; cursor: pointer;">
                Următoarea ▶
              </button>
            </div>
          </div>
        </div>

        <!-- Color Legend -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; font-size: 12px; font-weight: 700;">
          <span style="display: inline-flex; align-items: center; gap: 4px; background: #FFF; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--gen-masculin); color: var(--gen-masculin);">🔵 Substantiv</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; background: #FFF; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--gen-neutru); color: var(--gen-neutru);">🟢 Adjectiv</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; background: #FFF; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--gen-feminin); color: var(--gen-feminin);">🔴 Verb</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; background: #FFF; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--gold-bell); color: var(--gold-bell);">🟡 Pronume</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; background: #FFF; padding: 4px 10px; border-radius: 999px; border: 1.5px solid #7A4988; color: #7A4988;">🟣 Numeral</span>
        </div>

        <!-- Interactive Sentence Stage -->
        <div style="background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 28px 20px; text-align: center; box-shadow: var(--soft-shadow);">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; align-items: center;">
            ${sentence.words
              .map(
                (w, i) => `
              <button class="syntax-word-btn ${this.activeWordInfo?.word === w.word ? 'selected' : ''}" data-word-idx="${i}" style="background: var(--linen-pure); border: 2.5px solid ${w.color}; border-radius: var(--radius-md); padding: 12px 18px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; transition: all 0.15s ease; min-height: 52px; display: inline-flex; flex-direction: column; align-items: center; gap: 2px;">
                <span>${w.word}</span>
                <span style="font-size: 10px; font-family: system-ui; text-transform: uppercase; color: ${w.color}; letter-spacing: 0.5px;">${w.roleLabel}</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Word Info Dossier -->
        ${
          this.activeWordInfo
            ? `
          <div style="background: var(--linen-card); border: 2px solid ${this.activeWordInfo.color}; border-radius: var(--radius-md); padding: 16px 20px; animation: popSuccess 0.3s ease; display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 32px; flex-shrink: 0;">🔎</div>
            <div>
              <div style="font-size: 16px; font-weight: bold; color: var(--walnut);">
                Buletin gramatical: <span style="color: ${this.activeWordInfo.color}; font-size: 20px;">„${this.activeWordInfo.word}”</span> — ${this.activeWordInfo.roleLabel}
              </div>
              <div style="font-size: 14px; color: #5C402B; margin-top: 4px;">
                ${this.activeWordInfo.explanation}
              </div>
            </div>
          </div>
        `
            : `
          <div style="text-align: center; color: #8C5B3F; font-size: 14px; padding: 10px;">
            👆 Atinge orice cuvânt din propoziție pentru a vedea analiza lui!
          </div>
        `
        }

      </div>
    `;
  }

  private bindEvents() {
    const btnClose = this.container.querySelector('#btnCloseGrammar');
    btnClose?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.container.innerHTML = '';
      this.onClose();
    });

    // Tab buttons
    const tabButtons = this.container.querySelectorAll('.grammar-tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playWoodenTap();
        this.currentTopic = btn.getAttribute('data-topic') as GrammarTopic;
        this.activeWordInfo = null;
        this.render();
      });
    });

    // Mini-quiz options
    const quizButtons = this.container.querySelectorAll('.grammar-quiz-option-btn');
    quizButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        const pillar = GRAMMAR_PILLARS.find((p) => p.id === this.currentTopic);
        if (pillar) {
          this.quizAnswered[pillar.id] = idx;
          if (idx === pillar.quiz.correctIndex) {
            sound.playBrassBell();
          } else {
            sound.playGentleNudge();
          }
          this.render();
        }
      });
    });

    // Go to station button
    const btnStation = this.container.querySelector('.btn-go-to-station');
    btnStation?.addEventListener('click', () => {
      const station = btnStation.getAttribute('data-station');
      if (station && this.onNavigateStation) {
        sound.playBrassBell();
        this.container.innerHTML = '';
        this.onClose();
        this.onNavigateStation(station);
      }
    });

    // Syntax sentence prev / next
    const btnPrev = this.container.querySelector('#btnPrevSentence');
    const btnNext = this.container.querySelector('#btnNextSentence');

    btnPrev?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.currentSentenceIndex =
        (this.currentSentenceIndex - 1 + SYNTAX_SENTENCES.length) % SYNTAX_SENTENCES.length;
      this.activeWordInfo = null;
      this.render();
    });

    btnNext?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.currentSentenceIndex = (this.currentSentenceIndex + 1) % SYNTAX_SENTENCES.length;
      this.activeWordInfo = null;
      this.render();
    });

    // Syntax word click
    const wordButtons = this.container.querySelectorAll('.syntax-word-btn');
    wordButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playWoodenTap();
        const idx = Number(btn.getAttribute('data-word-idx'));
        const sentence = SYNTAX_SENTENCES[this.currentSentenceIndex];
        this.activeWordInfo = sentence.words[idx] || null;
        this.render();
      });
    });
  }
}
