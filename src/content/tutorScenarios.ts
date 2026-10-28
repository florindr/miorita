// src/content/tutorScenarios.ts — Contextual Novelty Generator for the 10-Min Agentic Tutor
// Traces to: FR-TUT-001..006, FR-SRS-004, FR-GAM-005

import type {
  AnyTutorWidgetConfig,
  RoleReversalConfig,
} from '../components/tutorWidgets/widgetTypes';
import { TUTOR_TOPIC_CATALOG } from '../storage/tutorProgress';

export interface SocraticChoiceOption {
  labelRo: string;
  isCorrect: boolean;
  englishTrapSaid?: string;
  mioritaRecastRo: string;
}

export interface SocraticStoryTurn {
  mioritaSpeechRo: string;     // Strictly <= 2 short sentences!
  questionRo: string;
  expectedVoiceTargets: string[];
  choices: SocraticChoiceOption[];
}

export interface BlitzNoveltyCard {
  cardId: string;
  category: string;
  mioritaPromptRo: string;     // Strictly <= 2 short sentences!
  expectedVoiceTargets: string[];
  choices: SocraticChoiceOption[];
}

export interface TutorSessionScenario {
  themeId: string;
  themeLabelRo: string;
  themeEmoji: string;
  focusCategory: string;
  secondaryCategory: string;
  storyTurns: SocraticStoryTurn[];
  conceptWidget: AnyTutorWidgetConfig;
  roleReversalWidget: RoleReversalConfig;
  blitzCards: BlitzNoveltyCard[];
  parolaDeCina: string;
}

const THEME_FLAVOR: Record<string, { placeRo: string; heroRo: string; prizeRo: string }> = {
  minecraft: {
    placeRo: 'Cetatea de Diamant din Minecraft',
    heroRo: 'golemul de fier',
    prizeRo: 'blocul de smarald',
  },
  fotbal: {
    placeRo: 'Stadionul din Poiana Mioriței',
    heroRo: 'căpitanul echipei',
    prizeRo: 'cupa de aur',
  },
  animale: {
    placeRo: 'Poteca Vulturilor din Carpați',
    heroRo: 'cățelul ciobănesc',
    prizeRo: 'clopoțelul de argint',
  },
  mister_carpati: {
    placeRo: 'Peștera cu Cristale Luminoase',
    heroRo: 'străjerul muntelui',
    prizeRo: 'cheia străveche',
  },
  scoala: {
    placeRo: 'Laboratorul de Invenții al Școlii',
    heroRo: 'roboțelul năstrușnic',
    prizeRo: 'bateria solară',
  },
  legende: {
    placeRo: 'Castelul din Vârful Norilor',
    heroRo: 'balaurul cel blând',
    prizeRo: 'pana fermecată',
  },
};

export function buildTutorScenario(
  focusCategory: string,
  secondaryCategory: string,
  themeId: string
): TutorSessionScenario {
  const topicMeta =
    TUTOR_TOPIC_CATALOG.find((t) => t.id === themeId) || TUTOR_TOPIC_CATALOG[0];
  const flavor = THEME_FLAVOR[themeId] || THEME_FLAVOR.minecraft;

  switch (focusCategory) {
    case 'GEN':
      return {
        themeId,
        themeLabelRo: topicMeta.labelRo,
        themeEmoji: topicMeta.emoji,
        focusCategory: 'GEN',
        secondaryCategory,
        storyTurns: [
          {
            mioritaSpeechRo: `Am ajuns în ${flavor.placeRo}! Văd un tren rapid și o casă mare.`,
            questionRo: 'Cum numărăm corect în românește când sunt două trenuri?',
            expectedVoiceTargets: ['un tren, două trenuri', 'două trenuri'],
            choices: [
              {
                labelRo: '🚂 un tren, două trenuri',
                isCorrect: true,
                mioritaRecastRo: 'Bravo, Tudor! Trenul este neutru: un tren la început, două trenuri când sunt mai multe!',
              },
              {
                labelRo: '🚂 un tren, doi trenuri',
                isCorrect: false,
                englishTrapSaid: 'doi trenuri',
                mioritaRecastRo: 'Aproape! Ascultă cum sună la neutru: „un tren, două trenuri”.',
              },
            ],
          },
          {
            mioritaSpeechRo: `Lângă ${flavor.heroRo} am găsit un scaun de lemn și o carte veche!`,
            questionRo: 'Cum spunem corect pentru „carte”?',
            expectedVoiceTargets: ['o carte, două cărți', 'o carte'],
            choices: [
              {
                labelRo: '📖 o carte, două cărți',
                isCorrect: true,
                mioritaRecastRo: 'Excelent! „O carte, două cărți” — este feminin!',
              },
              {
                labelRo: '📖 un carte, două cărți',
                isCorrect: false,
                englishTrapSaid: 'un carte',
                mioritaRecastRo: 'Hai să mai ascultăm o dată: spunem „o carte, două cărți”!',
              },
            ],
          },
        ],
        conceptWidget: {
          type: 'GenderBasketMini',
          titleRo: `Sortează proviziile din ${flavor.placeRo} în cele 3 coșuri!`,
          items: [
            { nounRo: 'câine', gender: 'M', countedRo: 'un câine, doi câini', emoji: '🐕' },
            { nounRo: 'casă', gender: 'F', countedRo: 'o casă, două case', emoji: '🏡' },
            { nounRo: 'tren', gender: 'N', countedRo: 'un tren, două trenuri', emoji: '🚂' },
          ],
        },
        roleReversalWidget: {
          type: 'RoleReversalDetector',
          titleRo: 'Profesorul Tudor: Prinde greșeala de gen a Mioriței!',
          category: 'GEN',
          mioritaQuoteWords: ['Am', 'găsit', 'un', 'carte', 'secretă', 'în', 'turn!'],
          mistakeWordIndices: [2, 3],
          mistakePhraseRo: 'un carte',
          correctedPhraseRo: 'o carte',
          fullCorrectedSentenceRo: 'Am găsit o carte secretă în turn!',
          explanationRo: '„Carte” se numără cu „o carte, două cărți” (feminin), nu cu „un”!',
        },
        blitzCards: [
          {
            cardId: 'GEN-SCAUN',
            category: 'GEN',
            mioritaPromptRo: `În ${flavor.placeRo} sunt două scaune. Cum numărăm de la unu la două?`,
            expectedVoiceTargets: ['un scaun, două scaune', 'două scaune'],
            choices: [
              {
                labelRo: '🪑 un scaun, două scaune',
                isCorrect: true,
                mioritaRecastRo: 'Perfect! Scaunul este neutru: un scaun, două scaune!',
              },
              {
                labelRo: '🪑 un scaun, doi scaune',
                isCorrect: false,
                englishTrapSaid: 'doi scaune',
                mioritaRecastRo: 'La neutru spunem „un scaun, două scaune”!',
              },
            ],
          },
        ],
        parolaDeCina: 'Am găsit un tren, două trenuri și o carte secretă!',
      };

    case 'CLQ':
      return {
        themeId,
        themeLabelRo: topicMeta.labelRo,
        themeEmoji: topicMeta.emoji,
        focusCategory: 'CLQ',
        secondaryCategory,
        storyTurns: [
          {
            mioritaSpeechRo: `În ${flavor.placeRo}, paznicul ne întreabă câți ani avem și dacă ne este frig!`,
            questionRo: 'Cum îi răspunzi în română curată că ai 8 ani?',
            expectedVoiceTargets: ['am 8 ani', 'am opt ani', 'eu am opt ani'],
            choices: [
              {
                labelRo: '🎂 Eu am 8 ani!',
                isCorrect: true,
                mioritaRecastRo: 'Minunat! În română „avem” anii în desagă: „Eu am 8 ani!”',
              },
              {
                labelRo: '🎂 Eu sunt 8 ani!',
                isCorrect: false,
                englishTrapSaid: 'sunt 8 ani',
                mioritaRecastRo: 'În engleză zicem „I am 8”, dar în română spunem „Eu am 8 ani!”',
              },
            ],
          },
          {
            mioritaSpeechRo: `Planul lui Tudor pentru a lua ${flavor.prizeRo} este foarte deștept!`,
            questionRo: 'Cum spunem în română pentru „It makes sense”?',
            expectedVoiceTargets: ['are sens', 'planul are sens'],
            choices: [
              {
                labelRo: '💡 Planul are sens!',
                isCorrect: true,
                mioritaRecastRo: 'Exact! În română lucrurile „au sens”, nu „fac sens”!',
              },
              {
                labelRo: '💡 Planul face sens!',
                isCorrect: false,
                englishTrapSaid: 'face sens',
                mioritaRecastRo: 'Hai să reparăm capcana din engleză: în română spunem „are sens”!',
              },
            ],
          },
        ],
        conceptWidget: {
          type: 'CalqueZapper',
          titleRo: `Repară mesajele din ${flavor.placeRo} cu Prinzătorul de Englezisme!`,
          category: 'CLQ',
          calqueBubbleRo: 'Eu sunt 8 ani, sunt rece și planul face sens!',
          naturalBubbleRo: 'Eu am 8 ani, mi-e frig și planul are sens!',
          zappedKeywords: [
            { trap: 'sunt 8 ani', fix: 'am 8 ani' },
            { trap: 'sunt rece', fix: 'mi-e frig' },
            { trap: 'face sens', fix: 'are sens' },
          ],
          explanationRo: 'În română spunem „am 8 ani”, „mi-e frig” și „are sens”.',
          bridgeEn: 'English uses "be 8 / be cold / make sense", while Romanian uses "have 8 years / to-me is cold / has sense".',
        },
        roleReversalWidget: {
          type: 'RoleReversalDetector',
          titleRo: 'Profesorul Tudor: Miorița a tradus din engleză!',
          category: 'CLQ',
          mioritaQuoteWords: ['Mă', 'duc', 'să', 'iau', 'un', 'duș', 'cald!'],
          mistakeWordIndices: [3, 4, 5],
          mistakePhraseRo: 'iau un duș',
          correctedPhraseRo: 'fac un duș',
          fullCorrectedSentenceRo: 'Mă duc să fac un duș cald!',
          explanationRo: 'În română „facem un duș” și „facem o poză”, nu le „luăm” ca în engleză!',
        },
        blitzCards: [
          {
            cardId: 'CLQ-FRIG',
            category: 'CLQ',
            mioritaPromptRo: 'Bate vântul înghețat pe vârful muntelui! Cum spui că simți frigul?',
            expectedVoiceTargets: ['mi-e frig', 'îmi este frig'],
            choices: [
              {
                labelRo: '🧣 Mi-e frig!',
                isCorrect: true,
                mioritaRecastRo: 'Bravo! „Mi-e frig” (și când ți-e foame: „Mi-e foame”)!',
              },
              {
                labelRo: '🧣 Sunt rece!',
                isCorrect: false,
                englishTrapSaid: 'sunt rece',
                mioritaRecastRo: 'Gheața este rece, dar noi spunem „Mi-e frig”!',
              },
            ],
          },
        ],
        parolaDeCina: 'Eu am 8 ani, mi-e foame și planul nostru are sens!',
      };

    case 'SUB':
      return {
        themeId,
        themeLabelRo: topicMeta.labelRo,
        themeEmoji: topicMeta.emoji,
        focusCategory: 'SUB',
        secondaryCategory,
        storyTurns: [
          {
            mioritaSpeechRo: `Am ajuns la puntea din ${flavor.placeRo}! ${flavor.heroRo} ne face cu mâna.`,
            questionRo: 'Cum legăm cele două acțiuni: „Vreau ... merg afară”?',
            expectedVoiceTargets: ['vreau să merg afară', 'vreau să merg'],
            choices: [
              {
                labelRo: '🌉 Vreau să merg afară!',
                isCorrect: true,
                mioritaRecastRo: 'Super! Cuvântul fermecat „să” este puntea dintre două verbe!',
              },
              {
                labelRo: '🌉 Vreau merg afară!',
                isCorrect: false,
                englishTrapSaid: 'vreau merg',
                mioritaRecastRo: 'Nu uita puntea fermecată „să”: „Vreau să merg afară!”',
              },
            ],
          },
        ],
        conceptWidget: {
          type: 'BridgeTileSnap',
          titleRo: `Așază scândura cu „SĂ” pe podul din ${flavor.placeRo}!`,
          category: 'SUB',
          leftBankRo: 'Eu pot',
          rightBankRo: 'te ajut la cetate!',
          correctTile: 'să',
          distractorTiles: ['la', 'de'],
          fullSentenceRo: 'Eu pot să te ajut la cetate!',
          explanationRo: 'Între două verbe (pot, vreau, trebuie, îmi place) punem mereu puntea „să”!',
        },
        roleReversalWidget: {
          type: 'RoleReversalDetector',
          titleRo: 'Profesorul Tudor: Unde a uitat Miorița puntea „să”?',
          category: 'SUB',
          mioritaQuoteWords: ['Îmi', 'place', 'desenez', 'hărți', 'de', 'munte!'],
          mistakeWordIndices: [1, 2],
          mistakePhraseRo: 'place desenez',
          correctedPhraseRo: 'place să desenez',
          fullCorrectedSentenceRo: 'Îmi place să desenez hărți de munte!',
          explanationRo: 'După „îmi place”, „vreau” sau „trebuie”, verbul al doilea are nevoie de „să”!',
        },
        blitzCards: [
          {
            cardId: 'SUB-MANANC',
            category: 'SUB',
            mioritaPromptRo: 'Masa e gata la stână! Cum spui corect cu „trebuie”?',
            expectedVoiceTargets: ['trebuie să mănânc supa', 'trebuie să mănânc'],
            choices: [
              {
                labelRo: '🍲 Trebuie să mănânc supa!',
                isCorrect: true,
                mioritaRecastRo: 'Excelent! „Trebuie să mănânc supa!”',
              },
              {
                labelRo: '🍲 Trebuie mănânc supa!',
                isCorrect: false,
                englishTrapSaid: 'trebuie mănânc',
                mioritaRecastRo: 'Punem puntea „să”: „Trebuie să mănânc supa!”',
              },
            ],
          },
        ],
        parolaDeCina: 'Vreau să te ajut la masă și îmi place să povestesc!',
      };

    default:
      // Covers CAS, ART, CLI, POS, NUM, AGR, ORD with rich WordMorphSlider & RoleReversalDetector
      return {
        themeId,
        themeLabelRo: topicMeta.labelRo,
        themeEmoji: topicMeta.emoji,
        focusCategory,
        secondaryCategory,
        storyTurns: [
          {
            mioritaSpeechRo: `În ${flavor.placeRo}, am găsit casa bunicii și mingea băiatului!`,
            questionRo: 'Cum spunem în românește „grandma’s house” (A cui casă)?',
            expectedVoiceTargets: ['casa bunicii'],
            choices: [
              {
                labelRo: '🏡 casa bunicii',
                isCorrect: true,
                mioritaRecastRo: 'Bravo, Tudor! Terminația „-ii” arată a cui este casa: „casa bunicii”!',
              },
              {
                labelRo: '🏡 casa la bunica',
                isCorrect: false,
                englishTrapSaid: 'casa la bunica',
                mioritaRecastRo: 'În loc de „la”, lipim codița de aur „-ii”: „casa bunicii”!',
              },
            ],
          },
          {
            mioritaSpeechRo: `Iar lângă poartă este ${flavor.heroRo} cu mingea băiatului!`,
            questionRo: 'Cum spunem corect „the boy’s ball”?',
            expectedVoiceTargets: ['mingea băiatului'],
            choices: [
              {
                labelRo: '⚽ mingea băiatului',
                isCorrect: true,
                mioritaRecastRo: 'Minunat! Pentru masculin punem „-ului”: „mingea băiatului”!',
              },
              {
                labelRo: '⚽ mingea la băiat',
                isCorrect: false,
                englishTrapSaid: 'mingea la băiat',
                mioritaRecastRo: 'Ascultă codița „-ului”: „mingea băiatului”!',
              },
            ],
          },
        ],
        conceptWidget: {
          type: 'WordMorphSlider',
          titleRo: `Transformă cuvintele pe Podul din ${flavor.placeRo}!`,
          category: focusCategory,
          englishTrapRo: 'casa la bunica',
          morphedCorrectRo: 'casa bunicii',
          stemText: 'casa bunic',
          suffixHighlight: '-ii',
          explanationRo: 'Când întrebăm „A cui?”, cuvântul primește terminația „-ii” (bunicii, mamei, fetei) sau „-ului” (băiatului).',
          bridgeEn: 'Instead of "of / to" or apostrophe-s, Romanian glues the possession ending (-ii / -ului) onto the owner word.',
        },
        roleReversalWidget: {
          type: 'RoleReversalDetector',
          titleRo: 'Profesorul Tudor: Prinde greșeala Mioriței!',
          category: 'CAS',
          mioritaQuoteWords: ['Am', 'dus', 'cartea', 'la', 'fata', 'la', 'școală!'],
          mistakeWordIndices: [3, 4],
          mistakePhraseRo: 'cartea la fata',
          correctedPhraseRo: 'cartea fetei',
          fullCorrectedSentenceRo: 'Am dus cartea fetei la școală!',
          explanationRo: 'A cui carte? „Cartea fetei” (cu terminația „-ei”), nu „la fata”!',
        },
        blitzCards: [
          {
            cardId: 'CAS-MAMEI',
            category: 'CAS',
            mioritaPromptRo: 'I-am dat o floare mamei. Cui i-am dat floarea?',
            expectedVoiceTargets: ['mamei', 'i-am dat mamei'],
            choices: [
              {
                labelRo: '🌸 I-am dat floarea mamei!',
                isCorrect: true,
                mioritaRecastRo: 'Perfect! „Mamei” răspunde la întrebarea „Cui?”.',
              },
              {
                labelRo: '🌸 I-am dat floarea la mama!',
                isCorrect: false,
                englishTrapSaid: 'la mama',
                mioritaRecastRo: 'Spunem „I-am dat floarea mamei”!',
              },
            ],
          },
        ],
        parolaDeCina: 'Bunica face gogoși calde în casa bunicii!',
      };
  }
}

