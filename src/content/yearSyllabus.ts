// src/content/yearSyllabus.ts — Structured 1-Year Curriculum of 96 Daily 10-Minute Lesson Slots
// Organizes the 1-Year Horizon (4 Seasons, 52 Weeks, 12 Popasuri) into concrete 10-minute lesson slots
// (2 core 10-min lessons/week × 48 weeks + 4 seasonal review weeks = 96 structured 10-minute lessons).

export interface TenMinuteSlotBreakdown {
  min0to2Ro: string;   // Warm-up & Today's Secret Rule
  min2to5Ro: string;   // Guided Socratic Dialogue with Miorița
  min5to8Ro: string;   // Interactive Visual Widget & Profesorul Tudor
  min8to10Ro: string;  // SRS Consolidation & Parola de Cină
}

export interface DailyLessonSlot {
  lessonNumber: number;        // 1 to 96
  weekNumber: number;          // 1 to 48 (spanning the 1-year horizon)
  slotInWeek: 1 | 2;           // Sesiunea 1 sau 2 din săptămână (10 min)
  seasonId: 1 | 2 | 3 | 4;
  checkpointId: number;        // 1 to 12 (8 lessons per Popas)
  lessonInCheckpoint: number;  // 1 to 8
  isBossCheckpoint: boolean;   // Lesson 8 of each Popas is the Checkpoint Boss-Quest
  durationMinutes: 10;
  category: string;
  grammarPillar: string;
  titleRo: string;
  learningGoalRo: string;
  englishTrapRo: string;
  romanianTargetRo: string;
  targetPhrasesRo: string[];
  recommendedWidget:
    | 'WordMorphSlider'
    | 'CalqueZapper'
    | 'BridgeTileSnap'
    | 'RoleReversalDetector'
    | 'GenderBasketMini';
  parolaDeCinaRo: string;
  tenMinutePlan: TenMinuteSlotBreakdown;
}

interface CheckpointLessonSeed {
  checkpointId: number;
  seasonId: 1 | 2 | 3 | 4;
  category: string;
  grammarPillar: string;
  lessons: Array<{
    titleRo: string;
    learningGoalRo: string;
    englishTrapRo: string;
    romanianTargetRo: string;
    targetPhrasesRo: string[];
    recommendedWidget: DailyLessonSlot['recommendedWidget'];
    parolaDeCinaRo: string;
  }>;
}

const CHECKPOINT_SEEDS: CheckpointLessonSeed[] = [
  // =========================================================================
  // SEASON 1: TOAMNA ÎN SATUL MIORIȚEI (Weeks 1–12 · Lessons 1–24)
  // =========================================================================
  {
    checkpointId: 1,
    seasonId: 1,
    category: 'GEN',
    grammarPillar: 'Moș Substantiv (Genul)',
    lessons: [
      {
        titleRo: 'Masculinul la Stână: Un — Doi',
        learningGoalRo: 'Numărăm ființele și lucrurile masculine cu „un” la singular și „doi” la plural.',
        englishTrapRo: 'un câine, două câini',
        romanianTargetRo: 'un câine, doi câini',
        targetPhrasesRo: ['un câine, doi câini', 'un berbec, doi berbeci', 'un pom, doi pomi'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'La stână sunt un câine și doi berbeci voinici!',
      },
      {
        titleRo: 'Femininul în Livadă: O — Două',
        learningGoalRo: 'Descoperim substantivele feminine care încep cu „o” și devin „două” la plural.',
        englishTrapRo: 'un casă, doi case',
        romanianTargetRo: 'o casă, două case',
        targetPhrasesRo: ['o casă, două case', 'o carte, două cărți', 'o minge, două mingi'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'Am desenat o casă mare și două cărți colorate!',
      },
      {
        titleRo: 'Secretul Neutrului: Un la început, Două la plural!',
        learningGoalRo: 'Stăpânim genul neutru (cameleonul românesc): „un” la singular, dar „două” la plural.',
        englishTrapRo: 'un tren, doi trenuri',
        romanianTargetRo: 'un tren, două trenuri',
        targetPhrasesRo: ['un tren, două trenuri', 'un scaun, două scaune', 'un măr, două mere'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'În gară așteaptă un tren lung și două trenuri rapide!',
      },
      {
        titleRo: 'Obiectele din Casa Bunicii (Neutru vs Feminin)',
        learningGoalRo: 'Deosebim obiectele din casă: „un pahar, două pahare” față de „o cană, două căni”.',
        englishTrapRo: 'doi pahare și un cană',
        romanianTargetRo: 'două pahare și o cană',
        targetPhrasesRo: ['un pahar, două pahare', 'o cană, două căni', 'un pat, două paturi'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Pun pe masă două pahare și o cană cu lapte!',
      },
      {
        titleRo: 'Animalele din Carpați pe Căprării de Gen',
        learningGoalRo: 'Potrivim rapid genul animalelor din pădure și de la stână.',
        englishTrapRo: 'un vulpe și doi păsări',
        romanianTargetRo: 'o vulpe și două păsări',
        targetPhrasesRo: ['un urs, doi urși', 'o vulpe, două vulpi', 'un cuib, două cuiburi'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'Am văzut un urs, două vulpi și două cuiburi în brad!',
      },
      {
        titleRo: 'La Școală și în Ghiozdan (Terminația -uri)',
        learningGoalRo: 'Observăm cum multe cuvinte neutre primesc codița „-uri” la plural.',
        englishTrapRo: 'doi creioane și doi jocuri',
        romanianTargetRo: 'două creioane și două jocuri',
        targetPhrasesRo: ['un creion, două creioane', 'un joc, două jocuri', 'un bloc, două blocuri'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'În ghiozdan am două creioane și două jocuri noi!',
      },
      {
        titleRo: 'Profesorul Tudor: Capcanele de Gen ale Mioriței',
        learningGoalRo: 'Tudor devine profesor și repară greșelile intenționate de gen ale Mioriței.',
        englishTrapRo: 'Am cumpărat un minge și doi trenuri',
        romanianTargetRo: 'Am cumpărat o minge și două trenuri',
        targetPhrasesRo: ['o minge', 'două trenuri', 'o floare, două flori'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Azi am fost Profesorul Mioriței și am reparat toate genurile!',
      },
      {
        titleRo: '🏆 Popasul 1 (Misiune de Meșter): Livada cu Genuri',
        learningGoalRo: 'Marea provocare a Popasului 1: sortăm fără greșeală masculin, feminin și neutru.',
        englishTrapRo: 'un carte, doi scaune',
        romanianTargetRo: 'o carte, două scaune',
        targetPhrasesRo: ['un câine, doi câini', 'o carte, două cărți', 'un scaun, două scaune'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'Am cucerit Popasul 1: Livada cu Genuri!',
      },
    ],
  },
  {
    checkpointId: 2,
    seasonId: 1,
    category: 'CLQ',
    grammarPillar: 'Morarul Verb (Expresii cu A Avea)',
    lessons: [
      {
        titleRo: 'Câți ani avem în desagă? („Am 8 ani”)',
        learningGoalRo: 'În română vârsta se exprimă cu verbul „a avea” („am 8 ani”), niciodată cu „a fi”.',
        englishTrapRo: 'Eu sunt 8 ani',
        romanianTargetRo: 'Eu am 8 ani',
        targetPhrasesRo: ['Eu am 8 ani', 'Tu câți ani ai?', 'Sora mea are 10 ani'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Eu am 8 ani și sunt voinic!',
      },
      {
        titleRo: 'Când bate vântul pe munte: „Mi-e frig” și „Mi-e cald”',
        learningGoalRo: 'Exprimăm frigul și căldura cu „mi-e frig / mi-e cald”, nu „sunt rece / cald”.',
        englishTrapRo: 'Sunt rece afară',
        romanianTargetRo: 'Mi-e frig afară',
        targetPhrasesRo: ['Mi-e frig', 'Mi-e cald', 'Ți-e frig la mâini?'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Afară bate vântul și mi-e frig la nas, dar în casă mi-e cald!',
      },
      {
        titleRo: 'La masa ciobănească: „Mi-e foame” și „Mi-e sete”',
        learningGoalRo: 'Spunem „mi-e foame”, „mi-e sete” și „mi-e somn” în mod natural.',
        englishTrapRo: 'Sunt foame și sunt sete',
        romanianTargetRo: 'Mi-e foame și mi-e sete',
        targetPhrasesRo: ['Mi-e foame', 'Mi-e sete', 'Mi-e somn'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Tata, mi-e o foame de lup și mi-e sete!',
      },
      {
        titleRo: 'Idei deștepte: „Are sens!” (Nu „face sens”)',
        learningGoalRo: 'Înlocuim calcul englezesc „face sens” cu forma românească „are sens”.',
        englishTrapRo: 'Asta face sens',
        romanianTargetRo: 'Asta are sens',
        targetPhrasesRo: ['Planul tău are sens!', 'Nu are niciun sens', 'Acum totul are sens'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Planul nostru de azi chiar are sens!',
      },
      {
        titleRo: 'Ce „facem” în română: „Fac un duș” și „Fac o poză”',
        learningGoalRo: 'Folosim verbul „a face” pentru duș și fotografii („fac un duș”, „fac o poză”).',
        englishTrapRo: 'Iau un duș și iau o poză',
        romanianTargetRo: 'Fac un duș și fac o poză',
        targetPhrasesRo: ['Am făcut un duș cald', 'Hai să facem o poză!', 'Am făcut un pas înainte'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'După fotbal am făcut un duș și am făcut o poză haioasă!',
      },
      {
        titleRo: 'Cum călătorim: „Mergem cu autobuzul / cu trenul”',
        learningGoalRo: 'Spunem „merg cu autobuzul / iau trenul” și „dau un test” (nu „iau un test”).',
        englishTrapRo: 'Am luat un test la școală',
        romanianTargetRo: 'Am dat un test la școală',
        targetPhrasesRo: ['Am dat un test ușor', 'Mergem cu trenul', 'Îți țin pumnii!'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Azi la școală am dat un test și a fost super!',
      },
      {
        titleRo: 'Profesorul Tudor: Roboțelul din Londra încurcă vorbele',
        learningGoalRo: 'Prindem 3 englezisme ascunse în povestea Mioriței.',
        englishTrapRo: 'Sunt 8 ani, sunt rece și iau o poză',
        romanianTargetRo: 'Am 8 ani, mi-e frig și fac o poză',
        targetPhrasesRo: ['am 8 ani', 'mi-e frig', 'fac o poză'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'L-am învățat pe roboțel să spună: am 8 ani și mi-e frig!',
      },
      {
        titleRo: '🏆 Popasul 2 (Misiune de Meșter): Vânătoarea de Toamnă',
        learningGoalRo: 'Stăpânim toate expresiile românești fără traducere mot-à-mot din engleză.',
        englishTrapRo: 'Sunt 8 ani și planul face sens',
        romanianTargetRo: 'Am 8 ani și planul are sens',
        targetPhrasesRo: ['am 8 ani', 'mi-e foame', 'are sens', 'fac un duș'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Am cucerit Popasul 2: Vânătoarea de Englezisme!',
      },
    ],
  },
  {
    checkpointId: 3,
    seasonId: 1,
    category: 'CAS',
    grammarPillar: 'Moș Substantiv (A cui? Cui?)',
    lessons: [
      {
        titleRo: 'Podul Posesiei Feminine: „Casa bunicii” (-ii / -ei)',
        learningGoalRo: 'Răspundem la întrebarea „A cui?” lipind terminația „-ii” sau „-ei” (fără „la”).',
        englishTrapRo: 'casa la bunica',
        romanianTargetRo: 'casa bunicii',
        targetPhrasesRo: ['casa bunicii', 'cartea fetei', 'rochia mamei'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Mergem în vizită la casa bunicii!',
      },
      {
        titleRo: 'Podul Posesiei Masculine: „Mingea băiatului” (-ului)',
        learningGoalRo: 'Adăugăm codița „-ului” pentru posesorul masculin („băiatului”, „câinelui”).',
        englishTrapRo: 'mingea la băiat',
        romanianTargetRo: 'mingea băiatului',
        targetPhrasesRo: ['mingea băiatului', 'osul câinelui', 'fluierul ciobanului'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Mingea băiatului a intrat direct în poartă!',
      },
      {
        titleRo: 'Numele de Persoane: „Lui Tudor” vs „Mariei”',
        learningGoalRo: 'Punem „lui” în fața numelor de băieți („lui Tudor”), dar schimbăm finalul la fete („Mariei”).',
        englishTrapRo: 'bicicleta la Tudor și păpușa la Maria',
        romanianTargetRo: 'bicicleta lui Tudor și păpușa Mariei',
        targetPhrasesRo: ['bicicleta lui Tudor', 'jocul lui Andrei', 'cartea Mariei'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Aceasta este bicicleta lui Tudor și cartea Mariei!',
      },
      {
        titleRo: 'Întrebarea „Cui?” (Dativul Darurilor): „I-am dat mamei”',
        learningGoalRo: 'Când oferim ceva sau spunem ceva cuiva, răspundem la „Cui?” („mamei”, „bunicului”).',
        englishTrapRo: 'I-am dat o floare la mama',
        romanianTargetRo: 'I-am dat o floare mamei',
        targetPhrasesRo: ['I-am dat o floare mamei', 'Îi spun bunicului o poveste', 'Dă-i apă câinelui'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'I-am dat o îmbrățișare mamei și i-am spus o glumă bunicului!',
      },
      {
        titleRo: 'Moara cu Articole Hotărâte: „Câinele” și „Băiatul”',
        learningGoalRo: 'În română articolul „the” se lipește la coada cuvântului (-ul, -le, -a).',
        englishTrapRo: 'Câine aleargă în curte',
        romanianTargetRo: 'Câinele aleargă în curte',
        targetPhrasesRo: ['Câinele aleargă', 'Băiatul construiește', 'Fata citește cartea'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Câinele păzește stâna și băiatul cântă la fluier!',
      },
      {
        titleRo: 'Secretul Prepozițiilor: „Pe masă” vs „Pe masa mare”',
        learningGoalRo: 'După „pe, în, la, sub” substantivul simplu stă nearticulat („pe masă”, „în casă”).',
        englishTrapRo: 'Cartea este pe masa',
        romanianTargetRo: 'Cartea este pe masă',
        targetPhrasesRo: ['pe masă', 'în casă', 'la școală', 'sub pat'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am pus cartea pe masă când am ajuns în casă!',
      },
      {
        titleRo: 'Profesorul Tudor: Repară Podul „A cui? Cui?”',
        learningGoalRo: 'Descoperim și reparăm greșelile Mioriței la genitiv și articol.',
        englishTrapRo: 'Am pus cheia la bunica pe masa',
        romanianTargetRo: 'Am pus cheia bunicii pe masă',
        targetPhrasesRo: ['cheia bunicii', 'pe masă', 'mingea băiatului'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am pus cheia bunicii pe masă!',
      },
      {
        titleRo: '🏆 Popasul 3 (Misiune de Meșter): Podul Bunicii',
        learningGoalRo: 'Finalizăm Sezonul de Toamnă stăpânind „A cui?”, „Cui?” și articolul hotărât!',
        englishTrapRo: 'casa la bunica și mingea la băiat',
        romanianTargetRo: 'casa bunicii și mingea băiatului',
        targetPhrasesRo: ['casa bunicii', 'mingea băiatului', 'i-am dat mamei', 'pe masă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am trecut cu brio Podul Bunicii și am terminat Sezonul de Toamnă!',
      },
    ],
  },

  // =========================================================================
  // SEASON 2: IARNA LA GURA SOBII (Weeks 13–24 · Lessons 25–48)
  // =========================================================================
  {
    checkpointId: 4,
    seasonId: 2,
    category: 'SUB',
    grammarPillar: 'Morarul Verb (Puntea lui SĂ)',
    lessons: [
      {
        titleRo: 'Puntea Fermecată „SĂ”: „Vreau să merg”',
        learningGoalRo: 'Legăm două verbe cu puntea „să” după „vreau”.',
        englishTrapRo: 'Vreau merg afară',
        romanianTargetRo: 'Vreau să merg afară',
        targetPhrasesRo: ['Vreau să merg afară', 'Vreau să construiesc', 'Vreau să văd'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Vreau să merg în parc și vreau să mă joc!',
      },
      {
        titleRo: 'Puterea lui „Pot să”: „Eu pot să te ajut!”',
        learningGoalRo: 'Folosim puntea „să” după verbul „a putea”.',
        englishTrapRo: 'Pot ajut la masă',
        romanianTargetRo: 'Pot să te ajut la masă',
        targetPhrasesRo: ['Pot să te ajut', 'Poți să vii aici?', 'Putem să câștigăm'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Tata, pot să te ajut să pregătim masa!',
      },
      {
        titleRo: 'Regula lui „Trebuie să”: „Trebuie să mănânc supa”',
        learningGoalRo: 'Păstrăm puntea „să” după „trebuie”.',
        englishTrapRo: 'Trebuie plec acum',
        romanianTargetRo: 'Trebuie să plec acum',
        targetPhrasesRo: ['Trebuie să mănânc', 'Trebuie să plecăm', 'Trebuie să fim atenți'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Trebuie să ne spălăm pe mâini înainte de cină!',
      },
      {
        titleRo: 'Bucuria lui „Îmi place să”: „Îmi place să desenez”',
        learningGoalRo: 'Folosim „să” după „îmi place” atunci când urmează o acțiune.',
        englishTrapRo: 'Îmi place joc fotbal',
        romanianTargetRo: 'Îmi place să joc fotbal',
        targetPhrasesRo: ['Îmi place să joc fotbal', 'Îmi place să desenez', 'Îmi place să înot'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Îmi place să joc fotbal și să construiesc în Minecraft!',
      },
      {
        titleRo: 'Când plecăm cu un scop: „Mă duc să...” și „Vin să...”',
        learningGoalRo: 'Unim verbele de mișcare cu scopul lor prin „să”.',
        englishTrapRo: 'Mă duc aduc mingea',
        romanianTargetRo: 'Mă duc să aduc mingea',
        targetPhrasesRo: ['Mă duc să aduc mingea', 'Vin să văd ce faci', 'Alerg să prind trenul'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Mă duc să aduc farfuriile la masă!',
      },
      {
        titleRo: 'Cum se schimbă verbul pentru „El / Ea” după „SĂ”',
        learningGoalRo: 'Observăm cum după „să” verbul își schimbă ușor codița la persoana a III-a („să meargă”, „să facă”).',
        englishTrapRo: 'El vrea să merge',
        romanianTargetRo: 'El vrea să meargă',
        targetPhrasesRo: ['El vrea să meargă', 'Ea vrea să facă un tort', 'Câinele vrea să doarmă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Miorița vrea să meargă pe munte și să facă o cabană!',
      },
      {
        titleRo: 'Profesorul Tudor: Pietrele lipsă de pe Poteca Zăpezii',
        learningGoalRo: 'Tudor repară propozițiile în care Miorița a uitat puntea „să”.',
        englishTrapRo: 'Vreau merg la munte și pot schiez',
        romanianTargetRo: 'Vreau să merg la munte și pot să schiez',
        targetPhrasesRo: ['vreau să merg', 'pot să schiez', 'îmi place să alerg'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am pus toate pietrele cu „să” pe Poteca Zăpezii!',
      },
      {
        titleRo: '🏆 Popasul 4 (Misiune de Meșter): Poteca Zăpezii',
        learningGoalRo: 'Trecem puntea de iarnă unind verbele cu „să” fără ezitare.',
        englishTrapRo: 'Vreau construiesc și trebuie câștig',
        romanianTargetRo: 'Vreau să construiesc și trebuie să câștig',
        targetPhrasesRo: ['vreau să construiesc', 'pot să ajut', 'trebuie să mergem', 'el vrea să meargă'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am cucerit Popasul 4: Poteca Zăpezii!',
      },
    ],
  },
  {
    checkpointId: 5,
    seasonId: 2,
    category: 'CLI',
    grammarPillar: 'Cascadorul Pronume (Ecoul PE + Clitic)',
    lessons: [
      {
        titleRo: 'Prepoziția „PE” pentru Persoane: „Pe Ion”, „Pe Mama”',
        learningGoalRo: 'Când acțiunea cade pe o persoană, punem „pe” în fața ei.',
        englishTrapRo: 'Am văzut Ion în parc',
        romanianTargetRo: 'L-am văzut pe Ion în parc',
        targetPhrasesRo: ['pe Ion', 'pe tata', 'pe bunica', 'pe Tudor'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Astăzi l-am văzut pe tata zâmbind!',
      },
      {
        titleRo: 'Ecoul Masculin la Prezent: „Îl văd pe tata” / „Îl aștept”',
        learningGoalRo: 'Dublăm persoana masculină cu pronumele-ecou „îl” înaintea verbului.',
        englishTrapRo: 'Aștept pe tata la școală',
        romanianTargetRo: 'Îl aștept pe tata la școală',
        targetPhrasesRo: ['Îl aștept pe tata', 'Îl ajut pe bunicul', 'Îl aud pe câine'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Îl ajut pe tata și îl ascult cu drag!',
      },
      {
        titleRo: 'Ecoul Feminin la Prezent: „O ajut pe bunica”',
        learningGoalRo: 'Pentru persoane feminine la prezent, ecoul din față este „o”.',
        englishTrapRo: 'Ajut bunica în grădină',
        romanianTargetRo: 'O ajut pe bunica în grădină',
        targetPhrasesRo: ['O ajut pe bunica', 'O văd pe mama', 'O chem pe Maria'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'O ajut pe mama și o îmbrățișez pe bunica!',
      },
      {
        titleRo: 'Ecoul Masculin la Trecut: „L-am văzut pe Tudor!”',
        learningGoalRo: 'La trecut, ecoul masculin se leagă cu cratimă la început: „L-am văzut”.',
        englishTrapRo: 'Am văzut pe Tudor la fotbal',
        romanianTargetRo: 'L-am văzut pe Tudor la fotbal',
        targetPhrasesRo: ['L-am văzut pe Ion', 'L-am chemat pe Andrei', 'L-am găsit pe cățel'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'L-am văzut pe cățel alergând prin zăpadă!',
      },
      {
        titleRo: 'Sorocul Codiței „-O” la Trecut: „Am văzut-o pe Maria!”',
        learningGoalRo: 'La trecut feminin, „-o” sare la coada verbului: „Am văzut-o”, „Am chemat-o”!',
        englishTrapRo: 'O am văzut pe Maria',
        romanianTargetRo: 'Am văzut-o pe Maria',
        targetPhrasesRo: ['Am văzut-o pe Maria', 'Am chemat-o pe bunica', 'Am ajutat-o pe mama'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am chemat-o pe Miorița și am ajutat-o pe mama!',
      },
      {
        titleRo: 'Ecoul de Plural: „Îi aud pe băieți” / „Le văd pe fete”',
        learningGoalRo: 'La plural folosim „îi” (masculin) și „le” (feminin) împreună cu „pe”.',
        englishTrapRo: 'Aud băieții jucând fotbal',
        romanianTargetRo: 'Îi aud pe băieți jucând fotbal',
        targetPhrasesRo: ['Îi aud pe băieți', 'Îi chem pe prieteni', 'Le văd pe oițe'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Îi aud pe prieteni râzând în curte!',
      },
      {
        titleRo: 'Profesorul Tudor: Unde s-a pierdut Ecoul din Munte?',
        learningGoalRo: 'Tudor prinde propozițiile fără „pe” și fără dublare clitică.',
        englishTrapRo: 'Am văzut Ion și am chemat Maria',
        romanianTargetRo: 'L-am văzut pe Ion și am chemat-o pe Maria',
        targetPhrasesRo: ['l-am văzut pe Ion', 'am chemat-o pe Maria'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'L-am văzut pe Ion și am chemat-o pe Maria la joacă!',
      },
      {
        titleRo: '🏆 Popasul 5 (Misiune de Meșter): Ecoul Carpaților',
        learningGoalRo: 'Stăpânim ecoul pronumelor („îl, o, l-am, am ...-o”) și prepoziția „pe”.',
        englishTrapRo: 'Ajut tata și am văzut bunica',
        romanianTargetRo: 'Îl ajut pe tata și am văzut-o pe bunica',
        targetPhrasesRo: ['îl ajut pe tata', 'o ajut pe mama', 'l-am văzut pe Ion', 'am văzut-o pe bunica'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am cucerit Popasul 5: Ecoul Carpaților!',
      },
    ],
  },
  {
    checkpointId: 6,
    seasonId: 2,
    category: 'NUM',
    grammarPillar: 'Negustorul Numeral & Posesivele (DE, AL/A/AI/ALE)',
    lessons: [
      {
        titleRo: 'Numerele Mici (1–19): Direct lângă cuvânt!',
        learningGoalRo: 'De la 1 la 19 numărăm direct, fără „de” („cinci mere”, „doisprezece berbeci”).',
        englishTrapRo: 'doisprezece de prieteni',
        romanianTargetRo: 'doisprezece prieteni',
        targetPhrasesRo: ['cinci cărți', 'zece blocuri', 'doisprezece prieteni', 'unsprezece jucători'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Pe teren sunt unsprezece jucători și cinci mingi!',
      },
      {
        titleRo: 'Pragul lui 20: Cântarul cu „DE” („Douăzeci de mere”)',
        learningGoalRo: 'De la 20 în sus punem puntea „de” între număr și substantiv!',
        englishTrapRo: 'douăzeci mere și treizeci oițe',
        romanianTargetRo: 'douăzeci de mere și treizeci de oițe',
        targetPhrasesRo: ['douăzeci de mere', 'treizeci și cinci de oițe', 'o sută de puncte'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am adunat douăzeci de diamante și o sută de puncte!',
      },
      {
        titleRo: 'Unu vs Două la Numerele Compuse (Douăzeci și două)',
        learningGoalRo: 'Potrivim „douăzeci și unu / douăzeci și două” după genul cuvântului.',
        englishTrapRo: 'douăzeci și doi de cărți',
        romanianTargetRo: 'douăzeci și două de cărți',
        targetPhrasesRo: ['douăzeci și două de cărți', 'douăzeci și unu de băieți', 'douăsprezece case'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am citit douăzeci și două de pagini din carte!',
      },
      {
        titleRo: 'Găleata Masculină și Feminină: „AL meu” vs „A mea”',
        learningGoalRo: 'Alegem „al” pentru un obiect masculin/neutru și „a” pentru unul feminin.',
        englishTrapRo: 'o carte al meu',
        romanianTargetRo: 'o carte a mea',
        targetPhrasesRo: ['un prieten al meu', 'o carte a mea', 'un câine al nostru'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Acesta este un prieten al meu și o invenție a mea!',
      },
      {
        titleRo: 'Gălețile de Plural: „AI mei” vs „ALE mele”',
        learningGoalRo: 'Folosim „ai” pentru plural masculin și „ale” pentru plural feminin și neutru!',
        englishTrapRo: 'jucăriile al meu',
        romanianTargetRo: 'jucăriile ale mele',
        targetPhrasesRo: ['doi colegi ai mei', 'două jucării ale mele', 'două trenuri ale noastre'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'La petrecere vin toți prietenii ai mei cu jocurile ale lor!',
      },
      {
        titleRo: 'Târgul Combinat: Numere Mari și Posesive',
        learningGoalRo: 'Combinăm regula lui „20 de...” cu „al, a, ai, ale”.',
        englishTrapRo: 'douăzeci blocuri al meu',
        romanianTargetRo: 'douăzeci de blocuri ale mele',
        targetPhrasesRo: ['douăzeci de blocuri ale mele', 'treizeci de cărți ale noastre', 'cinci prieteni ai mei'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am construit cetatea cu douăzeci de blocuri ale mele!',
      },
      {
        titleRo: 'Profesorul Tudor: Negustorul Încurcă-Numere',
        learningGoalRo: 'Tudor repară greșelile Mioriței la Târgul de Iarnă.',
        englishTrapRo: 'Am douăzeci oițe și o carte al meu',
        romanianTargetRo: 'Am douăzeci de oițe și o carte a mea',
        targetPhrasesRo: ['douăzeci de oițe', 'o carte a mea', 'un prieten al meu'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'La Târgul de Iarnă am cântărit douăzeci de oițe!',
      },
      {
        titleRo: '🏆 Popasul 6 (Misiune de Meșter): Târgul de Iarnă',
        learningGoalRo: 'Încheiem Sezonul de Iarnă stăpânind „20 de...” și „al, a, ai, ale”.',
        englishTrapRo: 'treizeci mere și un prieten a mea',
        romanianTargetRo: 'treizeci de mere și un prieten al meu',
        targetPhrasesRo: ['douăzeci de mere', 'un prieten al meu', 'o carte a mea', 'jucăriile ale mele'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am cucerit Popasul 6 și am terminat Sezonul de Iarnă!',
      },
    ],
  },

  // =========================================================================
  // SEASON 3: PRIMĂVARA MEȘTERILOR (Weeks 25–36 · Lessons 49–72)
  // =========================================================================
  {
    checkpointId: 7,
    seasonId: 3,
    category: 'AGR',
    grammarPillar: 'Zugravul Adjectiv (Acordul și Topica)',
    lessons: [
      {
        titleRo: 'Ordinea Românească: Substantivul ÎNAINTEA Culorii!',
        learningGoalRo: 'În română spunem mai întâi lucrul și apoi culoarea („mașina roșie”, nu „roșie mașină”).',
        englishTrapRo: 'albastru creion și roșie mașină',
        romanianTargetRo: 'creionul albastru și mașina roșie',
        targetPhrasesRo: ['creionul albastru', 'mașina roșie', 'casa frumoasă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Mi-am ales creionul albastru și mașina roșie!',
      },
      {
        titleRo: 'Acordul la Singular: „Un băiat bun” vs „O fată bună”',
        learningGoalRo: 'Adjectivul primește „-ă” sau „-e” când însoțește un cuvânt feminin.',
        englishTrapRo: 'o casă frumos și o minge mic',
        romanianTargetRo: 'o casă frumoasă și o minge mică',
        targetPhrasesRo: ['o casă frumoasă', 'o minge mică', 'o pâine caldă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Bunica a scos din cuptor o pâine caldă și gustoasă!',
      },
      {
        titleRo: 'Acordul la Plural Masculin și Feminin: „Albi” vs „Albe”',
        learningGoalRo: 'La plural masculin adjectivul se termină în „-i” („câini albi”), iar la feminin în „-e” („flori albe”).',
        englishTrapRo: 'doi câini alb și două flori alb',
        romanianTargetRo: 'doi câini albi și două flori albe',
        targetPhrasesRo: ['doi câini albi', 'două flori albe', 'trei brazi înalți'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Pe plai sunt doi câini albi și multe flori albe!',
      },
      {
        titleRo: 'Acordul la Plural Neutru: „Două trenuri rapide”',
        learningGoalRo: 'La plural, cuvintele neutre primesc adjective cu terminația feminină „-e” („două mere roșii / dulci”).',
        englishTrapRo: 'două scaune confortabili',
        romanianTargetRo: 'două scaune confortabile',
        targetPhrasesRo: ['două trenuri rapide', 'două scaune mici', 'trei mere verzi'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am mâncat trei mere verzi și crocante!',
      },
      {
        titleRo: 'Culorile care se schimbă și culorile neschimbătoare',
        learningGoalRo: 'Exersăm „roșu / roșie / roșii”, „verde / verzi” și „roz / mov” (care nu se schimbă).',
        englishTrapRo: 'o mașină roșu și două mere verde',
        romanianTargetRo: 'o mașină roșie și două mere verzi',
        targetPhrasesRo: ['o mașină roșie', 'două mere verzi', 'două flori roz'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'În grădină am văzut o mașină roșie și două mere verzi!',
      },
      {
        titleRo: 'Două Însușiri în Aceeași Propoziție',
        learningGoalRo: 'Potrivim atât ordinea, cât și acordul în propoziții bogate.',
        englishTrapRo: 'Am o mare casă alb',
        romanianTargetRo: 'Am o casă mare și albă',
        targetPhrasesRo: ['o casă mare și albă', 'un câine mic și jucăuș', 'două săbii lungi și strălucitoare'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'În Minecraft am construit o cetate mare și puternică!',
      },
      {
        titleRo: 'Profesorul Tudor: Pensula Încurcată a Zugravului',
        learningGoalRo: 'Tudor repară acordurile și ordinea adjectivelor greșite de Miorița.',
        englishTrapRo: 'Văd doi câini alb și o roșie mașină',
        romanianTargetRo: 'Văd doi câini albi și o mașină roșie',
        targetPhrasesRo: ['doi câini albi', 'o mașină roșie', 'trei mere verzi'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am reparat pensula Zugravului: doi câini albi și o mașină roșie!',
      },
      {
        titleRo: '🏆 Popasul 7 (Misiune de Meșter): Atelierul Primăverii',
        learningGoalRo: 'Stăpânim acordul și ordinea adjectivelor în toate cele trei genuri.',
        englishTrapRo: 'verde mere și casă frumos',
        romanianTargetRo: 'mere verzi și casă frumoasă',
        targetPhrasesRo: ['o mașină roșie', 'doi câini albi', 'trei mere verzi', 'casa frumoasă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am cucerit Popasul 7: Atelierul Primăverii!',
      },
    ],
  },
  {
    checkpointId: 8,
    seasonId: 3,
    category: 'CAS',
    grammarPillar: 'Cetatea Propoziției (Subiect & Predicat)',
    lessons: [
      {
        titleRo: 'Inima Propoziției: Predicatul (Ce face?)',
        learningGoalRo: 'Găsim verbul-predicat în orice propoziție răspunzând la întrebarea „Ce face?”.',
        englishTrapRo: 'Vreau merg la cetate',
        romanianTargetRo: 'Vreau să merg la cetate',
        targetPhrasesRo: ['Miorița aleargă', 'Tudor construiește', 'Băieții joacă fotbal'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Predicatul este inima propoziției și răspunde la „Ce face?”!',
      },
      {
        titleRo: 'Căpitanul Propoziției: Subiectul (Cine?)',
        learningGoalRo: 'Descoperim subiectul întrebând „Cine face acțiunea?” și îl acordăm cu predicatul.',
        englishTrapRo: 'Băieții aleargă repede și câștig',
        romanianTargetRo: 'Băieții aleargă repede și câștigă',
        targetPhrasesRo: ['Tudor râde', 'Câinii latră', 'Fetele cântă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Subiectul este căpitanul propoziției și răspunde la „Cine?”!',
      },
      {
        titleRo: 'Legătura dintre Subiect, Predicat și „A cui?”',
        learningGoalRo: 'Îmbogățim subiectul cu un atribut în genitiv („Câinele bunicului păzește stâna”).',
        englishTrapRo: 'Câinele la bunicu păzește stâna',
        romanianTargetRo: 'Câinele bunicului păzește stâna',
        targetPhrasesRo: ['Câinele bunicului păzește', 'Mingea băiatului sare', 'Casa bunicii strălucește'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Câinele bunicului păzește toată stâna!',
      },
      {
        titleRo: 'Propoziția cu Dublare Clitică și „PE”',
        learningGoalRo: 'Construim propoziții complete cu Subiect + Predicat + Complement cu „pe”.',
        englishTrapRo: 'Tudor a văzut Ion la poartă',
        romanianTargetRo: 'Tudor l-am văzut / l-a văzut pe Ion la poartă',
        targetPhrasesRo: ['Tudor îl ajută pe tata', 'Miorița o cheamă pe bunica', 'L-am văzut pe căpitan'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Tudor îl ajută pe tata în fiecare seară!',
      },
      {
        titleRo: 'Propoziții Compuse cu Puntea „SĂ”',
        learningGoalRo: 'Unim două predicate cu „să” în propoziții de aventură.',
        englishTrapRo: 'Prietenii mei vor construiesc un turn',
        romanianTargetRo: 'Prietenii mei vor să construiască un turn',
        targetPhrasesRo: ['Prietenii vor să joace', 'Noi putem să construim', 'Vreau să-l ajut pe tata'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Prietenii mei vor să construiască un turn înalt!',
      },
      {
        titleRo: 'Propoziții Bogate cu Zugravul Adjectiv și Genitiv',
        learningGoalRo: 'Combinăm adjectivul și posesia („Mașina roșie a băiatului”).',
        englishTrapRo: 'Roșie mașină la băiat',
        romanianTargetRo: 'Mașina roșie a băiatului',
        targetPhrasesRo: ['mașina roșie a băiatului', 'casa albă a bunicii', 'câinele voinic al ciobanului'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Mașina roșie a băiatului este cea mai rapidă!',
      },
      {
        titleRo: 'Profesorul Tudor: Paznicul Cetății Propoziției',
        learningGoalRo: 'Tudor verifică și repară propozițiile încurcate de la poarta cetății.',
        englishTrapRo: 'Câinele la bunica vrea merge în grădină',
        romanianTargetRo: 'Câinele bunicii vrea să meargă în grădină',
        targetPhrasesRo: ['câinele bunicii', 'vrea să meargă', 'în grădină'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Câinele bunicii vrea să meargă în grădină!',
      },
      {
        titleRo: '🏆 Popasul 8 (Misiune de Meșter): Cetatea Propoziției',
        learningGoalRo: 'Construim propoziții românești impecabile cu Subiect, Predicat, Genitiv și „Să”.',
        englishTrapRo: 'Mingea la băiat vrea intră în poartă',
        romanianTargetRo: 'Mingea băiatului vrea să intre în poartă',
        targetPhrasesRo: ['mingea băiatului', 'casa bunicii', 'vreau să merg', 'l-am văzut pe Ion'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am cucerit Popasul 8: Cetatea Propoziției!',
      },
    ],
  },
  {
    checkpointId: 9,
    seasonId: 3,
    category: 'ART',
    grammarPillar: 'Detectorul de Cuvinte & Diacriticele (ș, ț, ă, â, î)',
    lessons: [
      {
        titleRo: 'Sunetul și Litera „Ă”: „Casă” vs „Casa”',
        learningGoalRo: 'Auzim și vedem diferența dintre „o casă” (nearticulat, cu ă) și „casa” (articulat, cu a).',
        englishTrapRo: 'Am desenat o casa și am intrat în casa',
        romanianTargetRo: 'Am desenat o casă și am intrat în casă',
        targetPhrasesRo: ['o casă — casa', 'o masă — masa', 'o fată — fata'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am desenat o casă cu „ă” și am pus foaia pe masă!',
      },
      {
        titleRo: 'Virgulițele de Aur: „Ș” și „Ț” („Școală, Țară, Munți”)',
        learningGoalRo: 'Recunoaștem sunetele românești „ș” (ca în școală, roșie) și „ț” (ca în țară, băieți).',
        englishTrapRo: 'scoala și baieti',
        romanianTargetRo: 'școală și băieți',
        targetPhrasesRo: ['la școală', 'mașină roșie', 'oiță drăguță', 'munți înalți'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Școala, oița și munții au diacritice românești de aur!',
      },
      {
        titleRo: 'Gemenele cu Căciulă: „Î” la început, „Â” în mijloc!',
        learningGoalRo: 'Descoperim regula simplă: scriem „î” la începutul cuvântului („în, începe”) și „â” înăuntru („câine, pâine, român”).',
        englishTrapRo: 'caine și paine',
        romanianTargetRo: 'câine și pâine',
        targetPhrasesRo: ['câine', 'pâine caldă', 'mână', 'începe în pădure'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Scriem „î” la început în „începe”, dar „â” în mijloc la „câine” și „pâine”!',
      },
      {
        titleRo: 'Prepoziția fără Articol vs Cu Adjectiv: „Pe masă” vs „Pe masa rotundă”',
        learningGoalRo: 'Când adăugăm o însușire după substantiv, articolul se întoarce: „pe masă” ➔ „pe masa mare”!',
        englishTrapRo: 'pe masă mare',
        romanianTargetRo: 'pe masa mare',
        targetPhrasesRo: ['pe masă ➔ pe masa mare', 'în casă ➔ în casa bunicii', 'la școală ➔ la școala noastră'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Punem farfuria pe masă, adică pe masa mare din bucătărie!',
      },
      {
        titleRo: 'Articolul la Plural: „Băieții” (cu doi -i) și „Fetele” (-le)',
        learningGoalRo: 'Observăm cum pluralul masculin articulat primește al doilea „-i” („băieți ➔ băieții”).',
        englishTrapRo: 'Băieți joacă în curte',
        romanianTargetRo: 'Băieții joacă în curte',
        targetPhrasesRo: ['băieții joacă', 'câinii aleargă', 'fetele cântă', 'trenurile pleacă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Toți băieții și toate fetele se joacă în curte!',
      },
      {
        titleRo: 'Detectorul celor 5 Meșteri ai Vorbirii',
        learningGoalRo: 'Identificăm rapid Substantivul, Adjectivul, Verbul, Pronumele și Numeralul într-o propoziție.',
        englishTrapRo: 'Doi câini alb aleargă',
        romanianTargetRo: 'Doi câini albi aleargă',
        targetPhrasesRo: ['Doi (numeral) câini (substantiv) albi (adjectiv) aleargă (verb)'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Azi am folosit Detectorul de Cuvinte pentru toți cei 5 Meșteri ai Vorbirii!',
      },
      {
        titleRo: 'Profesorul Tudor: Pergamentul cu Diacritice și Articole',
        learningGoalRo: 'Reparăm textul încurcat al Mioriței.',
        englishTrapRo: 'Caine aleargă în casa bunicii și stă pe masa',
        romanianTargetRo: 'Câinele aleargă în casa bunicii și stă pe masă',
        targetPhrasesRo: ['câinele', 'în casa bunicii', 'pe masă'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Câinele aleargă în casa bunicii și se uită pe masă!',
      },
      {
        titleRo: '🏆 Popasul 9 (Misiune de Meșter): Cronicarul cu Diacritice',
        learningGoalRo: 'Încheiem Sezonul de Primăvară ca adevărați Cronicari ai Vorbei Scrise și Rostite!',
        englishTrapRo: 'pe masa și în casa',
        romanianTargetRo: 'pe masă și în casă (sau în casa bunicii)',
        targetPhrasesRo: ['pe masă', 'pe masa mare', 'câinele', 'băieții'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Am cucerit Popasul 9 și am terminat Sezonul de Primăvară!',
      },
    ],
  },

  // =========================================================================
  // SEASON 4: VARA PE CRESTELE CARPAȚILOR (Weeks 37–48 · Lessons 73–96)
  // =========================================================================
  {
    checkpointId: 10,
    seasonId: 4,
    category: 'CLQ',
    grammarPillar: 'Izvorul Expresiilor Românești (Meșter Mare)',
    lessons: [
      {
        titleRo: 'Expresii de Curaj și Noroc: „Îți țin pumnii!” și „Baftă!”',
        learningGoalRo: 'Înlocuim „cross my fingers” cu expresia românească „îți țin pumnii!”.',
        englishTrapRo: 'Îmi încrucișez degetele pentru tine',
        romanianTargetRo: 'Îți țin pumnii!',
        targetPhrasesRo: ['Îți țin pumnii!', 'Multă baftă la meci!', 'Am avut noroc'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Tata, mâine îți țin pumnii la serviciu!',
      },
      {
        titleRo: 'Timpul și Vremea: „De două ore” și „Plouă cu găleata”',
        learningGoalRo: 'Exprimăm durata și vremea cu expresii neaoșe românești.',
        englishTrapRo: 'Plouă pisici și câini',
        romanianTargetRo: 'Plouă cu găleata!',
        targetPhrasesRo: ['Plouă cu găleata', 'E soare cu dinți', 'Te aștept de zece minute'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'La Londra uneori plouă cu găleata, dar azi e vreme frumoasă!',
      },
      {
        titleRo: 'Verbele Reflexive de Zi cu Zi: „Mă joc”, „Mă gândesc”, „Mă bucur”',
        learningGoalRo: 'Nu uităm pronumele „mă / te / se” la verbele reflexive românești.',
        englishTrapRo: 'Eu joc cu prietenii și gândesc la vacanță',
        romanianTargetRo: 'Mă joc cu prietenii și mă gândesc la vacanță',
        targetPhrasesRo: ['Mă joc în parc', 'Mă gândesc la bunici', 'Mă bucur să te văd'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Mă bucur când mă joc cu prietenii mei!',
      },
      {
        titleRo: 'Cum cerem politicos și cum mulțumim ca un Boier',
        learningGoalRo: 'Folosim „Te rog frumos”, „Cu multă plăcere” și „Să-ți fie de bine!”.',
        englishTrapRo: 'Ești binevenit la masă',
        romanianTargetRo: 'Cu plăcere! / Să-ți fie de bine!',
        targetPhrasesRo: ['Cu multă plăcere!', 'Poftă bună!', 'Să-ți fie de bine!'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Poftă bună la cină și să vă fie de bine!',
      },
      {
        titleRo: 'Trecutul, Prezentul și Viitorul („Am mers — Merg — O să merg”)',
        learningGoalRo: 'Trecem ușor de la trecut la viitorul vorbit cu „o să...”.',
        englishTrapRo: 'Mâine mergem construim o cabană',
        romanianTargetRo: 'Mâine o să construim o cabană',
        targetPhrasesRo: ['Ieri am construit', 'Azi construiesc', 'Mâine o să construiesc'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Ieri am învățat, azi exersez, iar mâine o să fiu Meșter Mare!',
      },
      {
        titleRo: 'Proverbe Scurte pe Înțelesul lui Tudor',
        learningGoalRo: 'Descoperim umorul din vorbele bătrânești („Cine se trezește de dimineață, departe ajunge”).',
        englishTrapRo: 'Pasărea devreme prinde viermele',
        romanianTargetRo: 'Cine se trezește de dimineață, departe ajunge!',
        targetPhrasesRo: ['Cine se trezește de dimineață, departe ajunge', 'Unde-s mulți, puterea crește'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Unde-s mulți, puterea crește în familia noastră!',
      },
      {
        titleRo: 'Profesorul Tudor la Izvorul Proverbelor',
        learningGoalRo: 'Reparăm expresiile traduse din engleză de Miorița.',
        englishTrapRo: 'Eu joc afară, sunt rece și îmi încrucișez degetele',
        romanianTargetRo: 'Mă joc afară, mi-e frig și îți țin pumnii',
        targetPhrasesRo: ['mă joc afară', 'mi-e frig', 'îți țin pumnii'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Mă joc afară și îți țin pumnii să câștigi!',
      },
      {
        titleRo: '🏆 Popasul 10 (Misiune de Meșter): Izvorul Proverbelor',
        learningGoalRo: 'Stăpânim expresiile românești autentice la nivelul Meșter Mare.',
        englishTrapRo: 'Sunt 8 ani, face sens și joc cu prietenii',
        romanianTargetRo: 'Am 8 ani, are sens și mă joc cu prietenii',
        targetPhrasesRo: ['am 8 ani', 'are sens', 'mă joc cu prietenii', 'îți țin pumnii'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Am cucerit Popasul 10: Izvorul Proverbelor!',
      },
    ],
  },
  {
    checkpointId: 11,
    seasonId: 4,
    category: 'CAS',
    grammarPillar: 'Sfatul Bătrânilor (Repararea Capcanelor Multiple)',
    lessons: [
      {
        titleRo: 'Provocarea Dublă #1: Genitiv + Puntea „Să”',
        learningGoalRo: 'Combinăm „A cui?” și „să” în aceeași frază de aventură.',
        englishTrapRo: 'Vreau merg la casa la bunica',
        romanianTargetRo: 'Vreau să merg la casa bunicii',
        targetPhrasesRo: ['Vreau să merg la casa bunicii', 'Pot să repar bicicleta băiatului'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'În weekend vreau să merg la casa bunicii!',
      },
      {
        titleRo: 'Provocarea Dublă #2: Numere cu „DE” + Posesive',
        learningGoalRo: 'Folosim împreună „20 de...” și „al, a, ai, ale”.',
        englishTrapRo: 'Douăzeci prieteni al meu',
        romanianTargetRo: 'Douăzeci de prieteni ai mei',
        targetPhrasesRo: ['douăzeci de prieteni ai mei', 'treizeci de cărți ale noastre'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am douăzeci de blocuri de aur ale mele!',
      },
      {
        titleRo: 'Provocarea Dublă #3: Dublarea cu „PE” + Adjectiv Acordat',
        learningGoalRo: 'Îmbinăm ecoul clitic („l-am văzut pe...”) cu adjectivele acordate.',
        englishTrapRo: 'Am văzut câinele albă la bunicu',
        romanianTargetRo: 'L-am văzut pe câinele alb al bunicului',
        targetPhrasesRo: ['L-am văzut pe prietenul meu bun', 'Am văzut-o pe oița albă a Mioriței'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'L-am văzut pe cățelul cel alb al bunicului!',
      },
      {
        titleRo: 'Provocarea Dublă #4: Englezisme + Conjunctivul „Să”',
        learningGoalRo: 'Exprimăm vârsta, senzațiile și dorințele într-o singură poveste.',
        englishTrapRo: 'Sunt 8 ani, sunt foame și vreau mănânc',
        romanianTargetRo: 'Am 8 ani, mi-e foame și vreau să mănânc',
        targetPhrasesRo: ['Am 8 ani și vreau să învăț', 'Mi-e foame și vreau să mănânc gogoși'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Am 8 ani, mi-e foame și vreau să mănânc ceva bun!',
      },
      {
        titleRo: 'Provocarea Dublă #5: Genul Neutru + Topica Culorilor',
        learningGoalRo: 'Numărăm la neutru și așezăm culoarea după substantiv.',
        englishTrapRo: 'doi roșii trenuri și un albastru scaun',
        romanianTargetRo: 'două trenuri roșii și un scaun albastru',
        targetPhrasesRo: ['două trenuri roșii', 'un scaun albastru', 'două mere verzi'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'În gară sunt două trenuri roșii și un vagon albastru!',
      },
      {
        titleRo: 'Provocarea Dublă #6: Prepoziții + Dativul „Cui?”',
        learningGoalRo: 'Folosim corect „pe masă / în casă” împreună cu „i-am dat mamei”.',
        englishTrapRo: 'I-am lăsat la mama un bilet pe masa',
        romanianTargetRo: 'I-am lăsat mamei un bilet pe masă',
        targetPhrasesRo: ['I-am lăsat mamei un bilet pe masă', 'I-am dus bunicului ceaiul în cameră'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'I-am lăsat mamei un desen frumos pe masă!',
      },
      {
        titleRo: 'Profesorul Tudor în Sfatul Bătrânilor',
        learningGoalRo: 'Tudor corectează o scrisoare întreagă scrisă de Miorița cu capcane din engleză.',
        englishTrapRo: 'Am mers la casa la bunica să văd doi trenuri',
        romanianTargetRo: 'Am mers la casa bunicii să văd două trenuri',
        targetPhrasesRo: ['la casa bunicii', 'să văd', 'două trenuri'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am mers la casa bunicii să văd două trenuri rapide!',
      },
      {
        titleRo: '🏆 Popasul 11 (Misiune de Meșter): Sfatul Bătrânilor',
        learningGoalRo: 'Trecem testul Sfatului Bătrânilor rezolvând capcane combinate.',
        englishTrapRo: 'Vreau merg la casa la bunica cu douăzeci prieteni',
        romanianTargetRo: 'Vreau să merg la casa bunicii cu douăzeci de prieteni',
        targetPhrasesRo: ['vreau să merg', 'casa bunicii', 'douăzeci de prieteni'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am cucerit Popasul 11: Sfatul Bătrânilor!',
      },
    ],
  },
  {
    checkpointId: 12,
    seasonId: 4,
    category: 'CLQ',
    grammarPillar: 'Marea Sărbătoare a Stânei (Sinteza de 1 An)',
    lessons: [
      {
        titleRo: 'Marea Recapitulare #1: Genurile și Culorile Satului',
        learningGoalRo: 'Sărbătorim stăpânirea genurilor (`GEN`) și a acordului adjectivelor (`AGR`/`ORD`).',
        englishTrapRo: 'doi verde mere și un mare casă',
        romanianTargetRo: 'două mere verzi și o casă mare',
        targetPhrasesRo: ['un câine alb, doi câini albi', 'o casă mare, două case mari', 'un tren rapid, două trenuri rapide'],
        recommendedWidget: 'GenderBasketMini',
        parolaDeCinaRo: 'Știu toate cele trei genuri și toate culorile în românește!',
      },
      {
        titleRo: 'Marea Recapitulare #2: Podul Genitivului și Moara Articolelor',
        learningGoalRo: 'Sărbătorim stăpânirea lui „A cui? Cui?” (`CAS`) și a articolelor (`ART`).',
        englishTrapRo: 'mingea la băiat este pe masa',
        romanianTargetRo: 'mingea băiatului este pe masă',
        targetPhrasesRo: ['casa bunicii', 'mingea băiatului', 'i-am dat mamei', 'pe masă'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Mingea băiatului și plăcintele bunicii sunt pe masă!',
      },
      {
        titleRo: 'Marea Recapitulare #3: Puntea lui „Să” și Ecoul din Munte',
        learningGoalRo: 'Sărbătorim stăpânirea conjunctivului (`SUB`) și a dublării cu „pe” (`CLI`).',
        englishTrapRo: 'Vreau ajut tata și am văzut bunica',
        romanianTargetRo: 'Vreau să-l ajut pe tata și am văzut-o pe bunica',
        targetPhrasesRo: ['vreau să merg', 'pot să te ajut', 'l-am văzut pe tata', 'am văzut-o pe bunica'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Vreau să-l ajut pe tata și mă bucur că am văzut-o pe bunica!',
      },
      {
        titleRo: 'Marea Recapitulare #4: Târgul de Numere și Fântâna Posesivelor',
        learningGoalRo: 'Sărbătorim stăpânirea lui „20 de...” (`NUM`) și a lui „al, a, ai, ale” (`POS`).',
        englishTrapRo: 'douăzeci cărți al meu',
        romanianTargetRo: 'douăzeci de cărți ale mele',
        targetPhrasesRo: ['douăzeci de mere', 'un prieten al meu', 'o carte a mea', 'jucăriile ale mele'],
        recommendedWidget: 'BridgeTileSnap',
        parolaDeCinaRo: 'Am douăzeci de povești românești ale mele!',
      },
      {
        titleRo: 'Marea Recapitulare #5: Vânătorul de Englezisme la Nivel Maxim',
        learningGoalRo: 'Sărbătorim vorbirea naturală fără traduceri din engleză (`CLQ`).',
        englishTrapRo: 'Sunt 8 ani, sunt rece și asta face sens',
        romanianTargetRo: 'Am 8 ani, mi-e frig și asta are sens',
        targetPhrasesRo: ['am 8 ani', 'mi-e foame', 'are sens', 'fac o poză', 'îți țin pumnii'],
        recommendedWidget: 'CalqueZapper',
        parolaDeCinaRo: 'Vorbesc românește curat: am 8 ani și totul are sens!',
      },
      {
        titleRo: 'Marea Recapitulare #6: Povestitorul din Carpați',
        learningGoalRo: 'Tudor creează propria poveste în română folosind toate armele de Meșter Mare.',
        englishTrapRo: 'Am mers la munte vedea casa la bunica',
        romanianTargetRo: 'Am mers la munte să văd casa bunicii',
        targetPhrasesRo: ['Am mers la munte să văd casa bunicii', 'L-am chemat pe prietenul meu'],
        recommendedWidget: 'WordMorphSlider',
        parolaDeCinaRo: 'Sunt un adevărat povestitor din Carpați!',
      },
      {
        titleRo: 'Profesorul Tudor: Examenul Final al Mioriței',
        learningGoalRo: 'Tudor îi dă nota 10 Mioriței după ce îi repară ultima glumă gramaticală.',
        englishTrapRo: 'Sunt 9 ani și vreau merg la casa la bunica',
        romanianTargetRo: 'Am 9 ani și vreau să merg la casa bunicii',
        targetPhrasesRo: ['am 9 ani', 'vreau să merg', 'la casa bunicii'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Am reparat ultima glumă a Mioriței ca un Profesor Adevărat!',
      },
      {
        titleRo: '🏆 Popasul 12 (Marea Finală de 1 An): Sărbătoarea Stânei și Covorul Domnesc',
        learningGoalRo: 'Încununăm călătoria de 1 an prin Carpați (96 de lecții de 10 minute) și țesem ultimul rând de aur pe Covorul Domnesc!',
        englishTrapRo: 'Toate capcanele din engleză au fost învinse!',
        romanianTargetRo: 'Vorbesc românește curat, mândru și cu bucurie!',
        targetPhrasesRo: ['Vorbesc românește cu drag!', 'Casa bunicii', 'Vreau să povestesc', 'Am 8 ani'],
        recommendedWidget: 'RoleReversalDetector',
        parolaDeCinaRo: 'Tata, am terminat toată Călătoria de 1 An cu Miorița — sunt Mare Meșter al Limbii Române!',
      },
    ],
  },
];

export const YEAR_SYLLABUS_96_LESSONS: DailyLessonSlot[] = (() => {
  const slots: DailyLessonSlot[] = [];
  let globalLessonNum = 1;

  for (const cp of CHECKPOINT_SEEDS) {
    cp.lessons.forEach((l, idx) => {
      const lessonInCp = idx + 1;
      const weekNum = Math.ceil(globalLessonNum / 2);
      const slotInWeek: 1 | 2 = globalLessonNum % 2 === 1 ? 1 : 2;

      slots.push({
        lessonNumber: globalLessonNum,
        weekNumber: weekNum,
        slotInWeek,
        seasonId: cp.seasonId,
        checkpointId: cp.checkpointId,
        lessonInCheckpoint: lessonInCp,
        isBossCheckpoint: lessonInCp === 8,
        durationMinutes: 10,
        category: cp.category,
        grammarPillar: cp.grammarPillar,
        titleRo: l.titleRo,
        learningGoalRo: l.learningGoalRo,
        englishTrapRo: l.englishTrapRo,
        romanianTargetRo: l.romanianTargetRo,
        targetPhrasesRo: l.targetPhrasesRo,
        recommendedWidget: l.recommendedWidget,
        parolaDeCinaRo: l.parolaDeCinaRo,
        tenMinutePlan: {
          min0to2Ro: `Min 0–2 (Descoperirea): Regula zilei — de ce spunem „${l.romanianTargetRo}” (și nu „${l.englishTrapRo}”).`,
          min2to5Ro: `Min 2–5 (Dialog AI cu Miorița): Exersăm în poveste expresiile: ${l.targetPhrasesRo.join(' · ')}.`,
          min5to8Ro: `Min 5–8 (Atelier Vizual & Profesorul Tudor): Joc interactiv ${l.recommendedWidget} + prinde greșeala Mioriței.`,
          min8to10Ro: `Min 8–10 (Răsplata & Parola de Cină): Țesem ochiurile de aur și pregătim parola: „${l.parolaDeCinaRo}”.`,
        },
      });

      globalLessonNum += 1;
    });
  }

  return slots;
})();

export function getDailyLessonByNumber(lessonNumber: number): DailyLessonSlot {
  const clamped = Math.max(1, Math.min(96, lessonNumber));
  return YEAR_SYLLABUS_96_LESSONS[clamped - 1] || YEAR_SYLLABUS_96_LESSONS[0];
}

export function getLessonsForCheckpoint(checkpointId: number): DailyLessonSlot[] {
  return YEAR_SYLLABUS_96_LESSONS.filter((l) => l.checkpointId === checkpointId);
}

export function getLessonsForSeason(seasonId: 1 | 2 | 3 | 4): DailyLessonSlot[] {
  return YEAR_SYLLABUS_96_LESSONS.filter((l) => l.seasonId === seasonId);
}
