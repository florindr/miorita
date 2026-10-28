// src/ai/mioritaTutorProxy.ts — Live Serverless Gemini Agentic Tutor Proxy for Miorița
// Uses the Clawey 11+ Gemini API key (.env GEMINI_API_KEY / GOOGLE_API_KEY) and models
// to drive real-time Socratic Romanian conversations + dynamic Full-Stage JS Visual Widget tool-calling.

import type { AnyTutorWidgetConfig } from '../components/tutorWidgets/widgetTypes';
import type {
  ColorCodedWordToken,
  ConversationalGrammarLesson,
  CoreGrammarPillarId,
  GrammarRoleType,
} from '../storage/grammarProficiencyStore';

export const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface TutorChatMessage {
  role: 'miorita' | 'tudor';
  text: string;
  phase?: number;
}

export interface AgenticTutorRequest {
  themeId: string;
  themeLabelRo: string;
  focusCategory: string;
  secondaryCategory: string;
  checkpointId: number;
  checkpointNameRo: string;
  turnCount: number;
  messages: TutorChatMessage[];
  tudorInput?: string;
  lessonNumber?: number;
  lessonTitleRo?: string;
  learningGoalRo?: string;
  englishTrapRo?: string;
  romanianTargetRo?: string;
  targetPhrasesRo?: string[];
  pillarId?: CoreGrammarPillarId;
  proficiencyScore?: number;
  proficiencyTier?: 'Ucenic' | 'Călător' | 'Meșter';
  recentMistakes?: string[];
}

export interface AgenticTutorResponse {
  mioritaReplyRo: string;
  questionRo: string;
  quickChips: string[];
  expectedVoiceTargets: string[];
  isCorrectOrGoodEffort: boolean;
  goldenStitchesAwarded: number;
  caughtError?: {
    said: string;
    correct: string;
    category: string;
  } | null;
  bridgeEn?: string;
  activeWidget: AnyTutorWidgetConfig;
  generatedGrammarLesson?: ConversationalGrammarLesson;
  parolaDeCina?: string;
  shouldAdvancePhase?: boolean;
  source: 'gemini-live' | 'fallback';
  modelUsed?: string;
}

export const MIORITA_AGENTIC_SYSTEM_PROMPT = `
Ești Miorița, o profesoară de gramatică caldă, prietenoasă și povestitoare din Carpați, ghidul conversațional al lui Tudor (8 ani, Year 4 în Londra, cu ADHD, vorbitor de română acasă dar care gândește în engleză).

ABORDARE PEDAGOGICĂ: CONSTRUIREA CUNOȘTINȚELOR PRIN CONVERSAȚIE ȘI CUVINTE COLORATE (MAI PUȚINĂ TESTARE, MAI MULTĂ ÎNȚELEGERE!):
1. Vorbește în limba română autentică, caldă și clară, cu diacritice corecte cu virgulă dedesubt (ș, ț, ă, â, î).
2. Explică-i lui Tudor *DE CE* și *CUM* funcționează gramatica română în mod conversațional ("mioritaReplyRo", 2-3 propoziții clare și prietenoase), comparând mereu cu ce știe el de la școala din Londra ("bridgeEn") și arătând formula secretă ("secretFormulaRo", ex: "🇬🇧 the boy's ball ➔ 🇷🇴 mingea băiatului (-ului)").
3. La fiecare răspuns, construiește o PROPOZIȚIE INTERACTIVĂ PE CULORI ("sentenceFullText" + "colorCodedWords") unde fiecare cuvânt sau grup scurt din propoziție are un rol gramatical colorat:
   - "substantiv" (🔵 Substantiv — Cine? Ce? A cui?)
   - "adjectiv" (🟢 Adjectiv — Cum este? Ce fel de?)
   - "verb" (🔴 Verb / Predicat — Ce face?)
   - "pronume" (🟡 Pronume — Cine ține locul?)
   - "numeral" (🟣 Numeral — Câți? Câte?)
   - "legatura" (🟤 Punte / Legătură — să, de, pe, a/al/ai/ale, în, la)
   Fiecare element din "colorCodedWords" trebuie să explice pe înțelesul unui copil de 8 ani funcția cuvântului și de ce are acea terminație/formă!
   IMPORTANT PENTRU AUDIO ÎN CONTEXT: Include în "colorCodedWords" (ca token exact în câmpul "word") cel puțin 1-2 cuvinte sau expresii din vocabularul nostru înregistrat în studio, potrivite cu lecția curentă:
   • Genuri/Substantive: "un câine", "o casă", "un tren", "o carte", "un scaun", "un pom", "două case", "două trenuri", "doi câini", "două scaune", "două cărți", "doi pomi"
   • Articol hotărât: "băiatul", "câinele", "cartea", "pe masă"
   • Posesie (A cui?): "casa bunicii", "mingea băiatului", "cartea fetei", "mamei"
   • Adjectiv: "o mașină roșie", "doi câini albi", "creionul albastru", "trei mere verzi", "casa frumoasă"
   • Verbe cu SĂ: "vreau să merg afară", "pot să te ajut", "îmi place să desenez", "trebuie să mănânc supa"
   • Numerale: "cinci cărți", "doisprezece prieteni", "douăzeci de mere", "treizeci și cinci de oițe"
   • Persoane cu PE: "l-am văzut pe Ion", "am chemat-o pe Maria", "îl aștept pe tata", "o ajut pe bunica", "îi aud pe băieți"
   • Posesive & Expresii: "un prieten al meu", "o carte a mea", "colegii ai mei", "jucăriile ale mele", "am 8 ani", "are sens", "mi-e frig", "am făcut un duș"
4. După ce ai construit cunoștințele și propoziția pe culori, adaugă O SINGURĂ întrebare scurtă de verificare a înțelegerii ("testerQuestion" cu 2-3 opțiuni, "correctIndex" și "explanationRo" clară, fără cuvinte de laudă la început).
5. Adaptează complexitatea la nivelul de competență al lui Tudor ("Ucenic" = propoziții simple de 4-5 cuvinte; "Călător" = propoziții cu acord și genitiv/conjunctiv; "Meșter" = propoziții bogate cu dublare clitică și expresii idiomatice).

Răspunde STRICT cu un obiect JSON valid având următoarea structură:
{
  "titleRo": "Titlul scurt și atractiv al explicației gramaticale",
  "mioritaReplyRo": "Explicația conversațională caldă a Mioriței (2-3 propoziții care predau regula, fără a-l testa din prima!).",
  "secretFormulaRo": "🇬🇧 Capcană/Engleză: ... ➔ 🇷🇴 Română: ... (explicația codiței/regulii)",
  "bridgeEn": "1-sentence UK Year 4 SPaG contrast explaining how English vs Romanian works.",
  "sentenceFullText": "Propoziția completă în română analizată pe culori.",
  "colorCodedWords": [
    {
      "word": "Cuvântul",
      "role": "substantiv",
      "roleLabel": "Substantiv Articulat (-ul)",
      "questionHook": "Cine?",
      "explanation": "Explicație scurtă și clară a funcției cuvântului în propoziție."
    }
  ],
  "testerQuestion": {
    "questionRo": "Întrebare prietenoasă pentru a verifica dacă Tudor a înțeles regula explicată mai sus.",
    "options": ["Opțiunea A", "Opțiunea B", "Opțiunea C"],
    "correctIndex": 1,
    "explanationRo": "Explicația clară a regulii (FĂRĂ cuvinte de laudă precum Bravo/Corect/Excelent la început, doar explicația: ex. Spunem „o casă” cu „o”, deci este feminin)."
  },
  "questionRo": "Întrebare deschisă de conversație sau curiozitate pentru Tudor.",
  "quickChips": ["Explică-mi un alt exemplu!", "Cum se schimbă la plural?", "Fă o propoziție cu Minecraft!"],
  "expectedVoiceTargets": ["propoziția corectă"],
  "isCorrectOrGoodEffort": true,
  "goldenStitchesAwarded": 3,
  "caughtError": null,
  "activeWidget": { ... },
  "parolaDeCina": "O propoziție frumoasă de spus lui Tata!"
}
`.trim();

export class MioritaTutorProxy {
  static async handleChatTurn(
    req: AgenticTutorRequest,
    apiKey: string = process.env['GEMINI_API_KEY'] || process.env['GOOGLE_API_KEY'] || ''
  ): Promise<{ status: number; body: AgenticTutorResponse | { error: string } }> {
    if (!apiKey) {
      return {
        status: 503,
        body: { error: 'GEMINI_API_KEY is not configured.' },
      };
    }

    const transcriptText = (req.messages || [])
      .slice(-8)
      .map((m) => `${m.role === 'tudor' ? 'Tudor' : 'Miorița'}: "${m.text}"`)
      .join('\n');

    const pillarId: CoreGrammarPillarId = req.pillarId || 'substantiv';
    const profTier = req.proficiencyTier || 'Ucenic';
    const profScore = req.proficiencyScore ?? 35;

    const userPrompt = `
PROFILUL DE COMPETENȚĂ AL LUI TUDOR:
- Capitolul gramatical curent: ${pillarId.toUpperCase()} (${req.themeLabelRo || req.focusCategory})
- Nivelul de competență al lui Tudor: ${profTier} (Scor: ${profScore}/100)
- Capcane recente de clarificat: ${(req.recentMistakes || []).join(', ') || 'niciuna încă'}
- Lecția de referință: #${req.lessonNumber || 1} — ${req.lessonTitleRo || req.checkpointNameRo}
- Obiectiv gramatical: ${req.learningGoalRo || `Înțelegerea funcției cuvintelor și a regulii pentru ${req.focusCategory}`}
- Contrast Engleză vs. Română: ${req.englishTrapRo || 'traducerea mot-à-mot'} ➔ ${req.romanianTargetRo || 'forma românească autentică'}

ISTORICUL CONVERSAȚIEI:
${transcriptText || '(Începutul lecției conversaționale)'}

MESAJUL / CEREREA LUI TUDOR:
"${req.tudorInput || 'Explică-mi o regulă nouă de gramatică cu o propoziție pe culori!'}"

Construiește acum o lecție conversațională interactivă adaptată nivelului "${profTier}" (cu explicație caldă, formulă secretă, punte cu engleza, o propoziție complet analizată pe culori în "colorCodedWords" cu minimum 4 cuvinte/grupuri și o întrebare scurtă de verificare în "testerQuestion")!
`.trim();

    const requestBody = {
      system_instruction: {
        parts: [{ text: MIORITA_AGENTIC_SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.45,
        topP: 0.9,
        response_mime_type: 'application/json',
      },
    };

    let lastError = '';
    for (const model of GEMINI_MODELS) {
      try {
        const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          lastError = `${model} (${response.status}): ${await response.text()}`;
          continue;
        }

        const geminiJson: any = await response.json();
        const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        const parsed = JSON.parse(rawText);
        const normalizedWidget = this.ensureValidWidget(parsed.activeWidget, req.focusCategory, req.themeLabelRo);
        const generatedLesson = this.normalizeGrammarLesson(parsed, pillarId, profTier);

        let normalizedError: { said: string; correct: string; category: string } | null = null;
        if (parsed.caughtError) {
          if (typeof parsed.caughtError === 'string') {
            normalizedError = {
              said: parsed.caughtError,
              correct:
                (Array.isArray(parsed.expectedVoiceTargets) && parsed.expectedVoiceTargets[0]) ||
                (normalizedWidget as any).morphedCorrectRo ||
                'forma corectă',
              category: req.focusCategory,
            };
          } else if (typeof parsed.caughtError === 'object' && parsed.caughtError.said) {
            normalizedError = {
              said: String(parsed.caughtError.said),
              correct: String(
                parsed.caughtError.correct ||
                  (Array.isArray(parsed.expectedVoiceTargets) && parsed.expectedVoiceTargets[0]) ||
                  'forma corectă'
              ),
              category: String(parsed.caughtError.category || req.focusCategory),
            };
          }
        }

        const body: AgenticTutorResponse = {
          mioritaReplyRo:
            parsed.mioritaReplyRo ||
            generatedLesson.mioritaTheoryRo,
          questionRo:
            parsed.questionRo ||
            generatedLesson.testerQuestion.questionRo,
          quickChips:
            Array.isArray(parsed.quickChips) && parsed.quickChips.length > 0
              ? parsed.quickChips.slice(0, 3)
              : generatedLesson.followUpPrompts,
          expectedVoiceTargets:
            Array.isArray(parsed.expectedVoiceTargets) && parsed.expectedVoiceTargets.length > 0
              ? parsed.expectedVoiceTargets
              : [generatedLesson.sentenceFullText],
          isCorrectOrGoodEffort: parsed.isCorrectOrGoodEffort !== false,
          goldenStitchesAwarded:
            typeof parsed.goldenStitchesAwarded === 'number' ? parsed.goldenStitchesAwarded : 3,
          caughtError: normalizedError,
          bridgeEn: parsed.bridgeEn || generatedLesson.ukSpagBridgeEn,
          activeWidget: normalizedWidget,
          generatedGrammarLesson: generatedLesson,
          parolaDeCina:
            parsed.parolaDeCina || generatedLesson.sentenceFullText,
          source: 'gemini-live',
          modelUsed: model,
        };

        return { status: 200, body };
      } catch (err: any) {
        lastError = `${model} error: ${err?.message}`;
      }
    }

    return {
      status: 502,
      body: { error: `All Gemini models failed: ${lastError}` },
    };
  }

  private static ensureValidWidget(
    raw: any,
    focusCategory: string,
    themeLabelRo: string
  ): AnyTutorWidgetConfig {
    if (raw && typeof raw === 'object' && typeof raw.type === 'string') {
      if (
        raw.type === 'WordMorphSlider' &&
        raw.englishTrapRo &&
        raw.morphedCorrectRo
      ) {
        return {
          type: 'WordMorphSlider',
          titleRo: raw.titleRo || `Atelierul de Transformare · ${themeLabelRo}`,
          category: raw.category || focusCategory,
          englishTrapRo: String(raw.englishTrapRo),
          morphedCorrectRo: String(raw.morphedCorrectRo),
          stemText: String(raw.stemText || raw.morphedCorrectRo.slice(0, -2)),
          suffixHighlight: String(raw.suffixHighlight || raw.morphedCorrectRo.slice(-2)),
          explanationRo: String(raw.explanationRo || 'Observă terminația românească de la sfârșit!'),
          bridgeEn: String(raw.bridgeEn || 'Romanian changes the word ending to show possession or definiteness.'),
        };
      }

      if (
        raw.type === 'CalqueZapper' &&
        raw.calqueBubbleRo &&
        raw.naturalBubbleRo &&
        Array.isArray(raw.zappedKeywords) &&
        raw.zappedKeywords.length > 0
      ) {
        return {
          type: 'CalqueZapper',
          titleRo: raw.titleRo || `Prinzătorul de Englezisme · ${themeLabelRo}`,
          category: raw.category || focusCategory,
          calqueBubbleRo: String(raw.calqueBubbleRo),
          naturalBubbleRo: String(raw.naturalBubbleRo),
          zappedKeywords: raw.zappedKeywords.map((k: any) => ({
            trap: String(k.trap || 'sunt 8 ani'),
            fix: String(k.fix || 'am 8 ani'),
          })),
          explanationRo: String(raw.explanationRo || 'În română nu traducem cuvânt cu cuvânt din engleză.'),
          bridgeEn: String(raw.bridgeEn || 'Natural Romanian expression vs literal English calque.'),
        };
      }

      if (
        raw.type === 'BridgeTileSnap' &&
        raw.leftBankRo &&
        raw.rightBankRo &&
        raw.correctTile
      ) {
        return {
          type: 'BridgeTileSnap',
          titleRo: raw.titleRo || `Podul de Cuvinte · ${themeLabelRo}`,
          category: raw.category || focusCategory,
          leftBankRo: String(raw.leftBankRo),
          rightBankRo: String(raw.rightBankRo),
          correctTile: String(raw.correctTile),
          distractorTiles: Array.isArray(raw.distractorTiles) ? raw.distractorTiles.map(String) : ['la', 'cu'],
          fullSentenceRo: String(raw.fullSentenceRo || `${raw.leftBankRo} ${raw.correctTile} ${raw.rightBankRo}`),
          explanationRo: String(raw.explanationRo || 'Cuvântul de legătură unește cele două maluri ale propoziției!'),
        };
      }

      if (
        raw.type === 'RoleReversalDetector' &&
        Array.isArray(raw.mioritaQuoteWords) &&
        raw.mioritaQuoteWords.length > 1 &&
        Array.isArray(raw.mistakeWordIndices) &&
        raw.mistakeWordIndices.length > 0
      ) {
        return {
          type: 'RoleReversalDetector',
          titleRo: raw.titleRo || 'Profesorul Tudor: Prinde greșeala Mioriței!',
          category: raw.category || focusCategory,
          mioritaQuoteWords: raw.mioritaQuoteWords.map(String),
          mistakeWordIndices: raw.mistakeWordIndices.map(Number),
          mistakePhraseRo: String(raw.mistakePhraseRo || 'greșeala'),
          correctedPhraseRo: String(raw.correctedPhraseRo || 'forma corectă'),
          fullCorrectedSentenceRo: String(raw.fullCorrectedSentenceRo || raw.mioritaQuoteWords.join(' ')),
          explanationRo: String(raw.explanationRo || 'Bravo, Profesorul Tudor! Ai prins capcana Mioriței!'),
        };
      }

      if (
        raw.type === 'GenderBasketMini' &&
        Array.isArray(raw.items) &&
        raw.items.length > 0
      ) {
        return {
          type: 'GenderBasketMini',
          titleRo: raw.titleRo || `Trei Coșuri Rapide · ${themeLabelRo}`,
          items: raw.items.map((it: any) => ({
            nounRo: String(it.nounRo || 'tren'),
            gender: it.gender === 'M' || it.gender === 'F' || it.gender === 'N' ? it.gender : 'N',
            countedRo: String(it.countedRo || 'un tren, două trenuri'),
            emoji: String(it.emoji || '🚂'),
          })),
        };
      }
    }

    // Default fallback widget if model returned an incomplete widget schema
    return {
      type: 'WordMorphSlider',
      titleRo: `Atelierul de Transformare · ${themeLabelRo}`,
      category: focusCategory,
      englishTrapRo: 'casa la bunica',
      morphedCorrectRo: 'casa bunicii',
      stemText: 'casa bunic',
      suffixHighlight: '-ii',
      explanationRo: 'Adăugăm terminația „-ii” ca să arătăm a cui este casa!',
      bridgeEn: 'Romanian uses the genitive suffix -ii instead of "la".',
    };
  }

  private static cleanMarkdownAndPraise(text: string, stripLeadingPraise = false): string {
    let cleaned = String(text || '')
      .replace(/\*\*([^*]+)\*\*/g, '„$1”')
      .replace(/\*([^*]+)\*/g, '„$1”')
      .trim();

    if (stripLeadingPraise) {
      cleaned = cleaned
        .replace(
          /^(bravo[^.!?:]*[.!?:]\s*|excelent[^.!?:]*[.!?:]\s*|super[^.!?:]*[.!?:]\s*|corect[^.!?:]*[.!?:]\s*|minunat[^.!?:]*[.!?:]\s*|exact[^.!?:]*[.!?:]\s*|foarte bine[^.!?:]*[.!?:]\s*)+/i,
          ''
        )
        .trim();
    }
    return cleaned;
  }

  private static normalizeGrammarLesson(
    parsed: any,
    pillarId: CoreGrammarPillarId,
    profTier: 'Ucenic' | 'Călător' | 'Meșter'
  ): ConversationalGrammarLesson {
    const validRoles: GrammarRoleType[] = [
      'substantiv',
      'adjectiv',
      'verb',
      'pronume',
      'numeral',
      'legatura',
    ];

    let words: ColorCodedWordToken[] = [];
    if (Array.isArray(parsed?.colorCodedWords) && parsed.colorCodedWords.length > 0) {
      words = parsed.colorCodedWords.map((w: any) => {
        const rawRole = String(w?.role || 'substantiv').toLowerCase() as GrammarRoleType;
        const role: GrammarRoleType = validRoles.includes(rawRole) ? rawRole : 'substantiv';
        return {
          word: this.cleanMarkdownAndPraise(w?.word || 'Cuvânt'),
          role,
          roleLabel: this.cleanMarkdownAndPraise(w?.roleLabel || role.toUpperCase()),
          questionHook: this.cleanMarkdownAndPraise(w?.questionHook || 'Ce rol are?'),
          explanation: this.cleanMarkdownAndPraise(
            w?.explanation || 'Acest cuvânt ne ajută să construim propoziția corect în română.'
          ),
        };
      });
    } else {
      words = [
        {
          word: 'Tudor',
          role: 'substantiv',
          roleLabel: 'Substantiv Propriu (Subiect)',
          questionHook: 'Cine?',
          explanation: 'Eroul propoziției care face acțiunea.',
        },
        {
          word: 'vizitează',
          role: 'verb',
          roleLabel: 'Verb (Predicat)',
          questionHook: 'Ce face?',
          explanation: 'Arată acțiunea la timpul prezent.',
        },
        {
          word: 'cetatea',
          role: 'substantiv',
          roleLabel: 'Substantiv Articulat (-a)',
          questionHook: 'Ce vizitează?',
          explanation: 'Substantiv feminin cu articolul hotărât la final.',
        },
        {
          word: 'veche',
          role: 'adjectiv',
          roleLabel: 'Adjectiv Acordat',
          questionHook: 'Ce fel de cetate?',
          explanation: 'Descrie substantivul și stă după el.',
        },
      ];
    }

    const rawTester = parsed?.testerQuestion;
    const options =
      Array.isArray(rawTester?.options) && rawTester.options.length >= 2
        ? rawTester.options.map(String)
        : ['cetatea bunicii', 'cetatea la bunica', 'bunica cetate'];
    const correctIndex =
      typeof rawTester?.correctIndex === 'number' &&
      rawTester.correctIndex >= 0 &&
      rawTester.correctIndex < options.length
        ? rawTester.correctIndex
        : 0;

    return {
      id: `ai-${pillarId}-${Date.now()}`,
      pillarId,
      createdAt: new Date().toISOString(),
      source: 'gemini-ai',
      proficiencyTier: profTier,
      titleRo: this.cleanMarkdownAndPraise(parsed?.titleRo || 'Secretul Cuvintelor Românești'),
      mioritaTheoryRo: this.cleanMarkdownAndPraise(
        parsed?.mioritaReplyRo ||
          'În limba română, cuvintele își schimbă terminația ca să se lege armonios între ele!'
      ),
      secretFormulaRo: this.cleanMarkdownAndPraise(
        parsed?.secretFormulaRo ||
          '🇬🇧 Engleză: ordinea fixă ➔ 🇷🇴 Română: codițele cuvintelor arată legătura!'
      ),
      ukSpagBridgeEn: this.cleanMarkdownAndPraise(
        parsed?.bridgeEn ||
          'Compare how English uses separate helper words while Romanian uses word endings and agreement.'
      ),
      sentenceFullText: this.cleanMarkdownAndPraise(
        parsed?.sentenceFullText || words.map((w) => w.word).join(' ')
      ),
      colorCodedWords: words,
      testerQuestion: {
        questionRo: this.cleanMarkdownAndPraise(
          rawTester?.questionRo ||
            parsed?.questionRo ||
            'Care dintre variantele de mai jos urmează regula pe care am descoperit-o?'
        ),
        options: options.map((o: string) => this.cleanMarkdownAndPraise(o)),
        correctIndex,
        explanationRo: this.cleanMarkdownAndPraise(
          rawTester?.explanationRo ||
            'Spunem forma aceasta deoarece respectă regula de acord și terminație din română.',
          true
        ),
      },
      followUpPrompts:
        Array.isArray(parsed?.quickChips) && parsed.quickChips.length > 0
          ? parsed.quickChips.slice(0, 3).map(String)
          : [
              'Mai arată-mi o propoziție pe culori!',
              'Cum se schimbă această regulă la plural?',
              'Dă-mi un exemplu cu jocuri sau sport!',
            ],
    };
  }
}
