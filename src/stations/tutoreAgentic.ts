// src/stations/tutoreAgentic.ts — Minimalist Single-Nugget Conversational Grammar Flow
// One calm card at a time:
// 1. Learn a single grammar nugget with a clean color-coded sentence (tap any word to see its role).
// 2. Verify understanding with 1 gentle question.
// 3. Repeat & slowly mix in previously learned nuggets (generated on the fly by Gemini AI and stored locally).

import { MioritaHud } from '../components/mioritaHud';
import { sound } from '../audio/synth';
import { VoiceRecognizer } from '../audio/voiceRecognizer';
import {
  TutorProgressManager,
  type TopicOption,
  type YearCheckpointSpec,
} from '../storage/tutorProgress';
import { recordSrsAttempt } from '../storage/srs';
import { saveCaietEntry } from '../components/caietulLuiTata';
import {
  buildTutorScenario,
  type TutorSessionScenario,
  type SocraticChoiceOption,
} from '../content/tutorScenarios';
import {
  getDailyLessonByNumber,
  type DailyLessonSlot,
} from '../content/yearSyllabus';
import {
  CUMULATIVE_NUGGET_LADDER,
  GrammarProficiencyStore,
  ROLE_COLOR_MAP,
  type ColorCodedWordToken,
  type ConversationalGrammarLesson,
  type CoreGrammarPillarId,
} from '../storage/grammarProficiencyStore';
import type { TutorChatMessage, AgenticTutorResponse } from '../ai/mioritaTutorProxy';

export type TutorSessionPhase =
  | 'phase1_hook'
  | 'phase2_story'
  | 'phase3_blitz'
  | 'phase4_reward';

export interface TutoreAgenticStationOptions {
  lessonNumber?: number;
  initialPillarId?: CoreGrammarPillarId;
  onOpenYearPlan?: () => void;
}

export class TutoreAgenticStation {
  private container: HTMLElement;
  private hud: MioritaHud;
  private onBackToMap?: () => void;
  private onStateUpdated?: () => void;
  private onOpenYearPlan?: () => void;

  // Backward-compatible state for unit tests
  private phase: TutorSessionPhase = 'phase1_hook';
  private activeLesson: DailyLessonSlot;
  private topicChoices: [TopicOption, TopicOption];
  private selectedTopic: TopicOption;
  private activeCheckpoint: YearCheckpointSpec;
  private isCheckpointBoss: boolean;
  private scenario: TutorSessionScenario;
  private storyTurnIndex = 0;

  // Minimalist Single-Nugget Flow State
  private currentPillarId: CoreGrammarPillarId = 'substantiv';
  private currentGrammarLesson: ConversationalGrammarLesson;
  private selectedWordIndex: number = 0;
  private showQuestionStep = false;          // Step A: Explore nugget & words -> Step B: 1 quick check
  private testerSolved = false;
  private wrongAttemptIndices: number[] = [];
  private lastWrongOptionText = '';
  private showAskInputDrawer = false;
  private showNuggetPickerDrawer = false;

  // Live Gemini AI State
  private isThinking = false;
  private chatHistory: TutorChatMessage[] = [];
  private agentTurnCount = 1;

  private goldenStitchesEarned = 0;
  private attemptCount = 0;
  private correctCount = 0;
  private caughtErrors: Array<{ said: string; correct: string; category: string }> = [];
  private wins: string[] = [];
  private sessionSaved = false;

  private voice = new VoiceRecognizer();
  private voiceFeedbackRo = '';

  constructor(
    container: HTMLElement,
    hud: MioritaHud,
    onBackToMap?: () => void,
    onStateUpdated?: () => void,
    options?: TutoreAgenticStationOptions
  ) {
    this.container = container;
    this.hud = hud;
    this.onBackToMap = onBackToMap;
    this.onStateUpdated = onStateUpdated;
    this.onOpenYearPlan = options?.onOpenYearPlan;

    const state = TutorProgressManager.getState();
    const defaultLessonNum = Math.max(1, Math.min(96, state.totalSessionsCompleted + 1));
    this.activeLesson = getDailyLessonByNumber(options?.lessonNumber || defaultLessonNum);
    this.activeCheckpoint = TutorProgressManager.getCheckpointById(this.activeLesson.checkpointId);
    this.isCheckpointBoss =
      this.activeLesson.lessonNumber % 8 === 0 || TutorProgressManager.isCheckpointBossReady();
    this.topicChoices = TutorProgressManager.getTopicChoices();
    this.selectedTopic = this.topicChoices[0];

    this.scenario = buildTutorScenario(
      this.activeLesson.category,
      this.activeCheckpoint.secondaryCategory,
      this.selectedTopic.id
    );
    this.scenario.parolaDeCina = this.activeLesson.parolaDeCinaRo;

    const currentNugget = GrammarProficiencyStore.getCurrentNuggetSpec();
    this.currentPillarId = options?.initialPillarId || currentNugget.pillarId;
    this.currentGrammarLesson = GrammarProficiencyStore.getStarterLessonForNugget(
      currentNugget.nuggetIndex
    );
    this.selectedWordIndex = 0;

    this.render();
  }

  // ============================================================================
  // Programmatic API (Preserved for Unit Tests)
  // ============================================================================

  public getCurrentPhase(): TutorSessionPhase {
    return this.phase;
  }

  public getScenario(): TutorSessionScenario {
    return this.scenario;
  }

  public getActiveLesson(): DailyLessonSlot {
    return this.activeLesson;
  }

  public getCurrentGrammarLesson(): ConversationalGrammarLesson {
    return this.currentGrammarLesson;
  }

  public chooseTopicAndStartPhase2(topicId: string): void {
    const chosen =
      this.topicChoices.find((t) => t.id === topicId) || this.topicChoices[0];
    this.selectedTopic = chosen;
    this.phase = 'phase2_story';
    this.goldenStitchesEarned += 2;
    sound.playBrassBell();
    this.render();
  }

  public handleStoryChoice(choice: SocraticChoiceOption): void {
    this.attemptCount += 1;
    if (choice.isCorrect) {
      this.correctCount += 1;
      this.goldenStitchesEarned += 2;
      this.wins.push(choice.labelRo);
      sound.playBrassBell();
      this.hud.speak(choice.mioritaRecastRo, 'celebrating');
      if (this.storyTurnIndex + 1 < this.scenario.storyTurns.length) {
        this.storyTurnIndex += 1;
      }
    } else {
      sound.playGentleNudge();
      if (choice.englishTrapSaid) {
        this.caughtErrors.push({
          said: choice.englishTrapSaid,
          correct: this.scenario.storyTurns[this.storyTurnIndex]?.expectedVoiceTargets[0] || '',
          category: this.scenario.focusCategory,
        });
      }
      this.hud.speak(choice.mioritaRecastRo, 'thinking');
    }
    this.render();
  }

  public advanceToPhase3(): void {
    this.phase = 'phase3_blitz';
    sound.playWoodenTap();
    this.render();
  }

  public handleBlitzChoice(choice: SocraticChoiceOption): void {
    const card = this.scenario.blitzCards[0];
    if (!card) return;
    this.attemptCount += 1;
    recordSrsAttempt(card.cardId, card.category, choice.isCorrect, {
      contextTheme: this.selectedTopic.id,
    });
    if (choice.isCorrect) {
      this.correctCount += 1;
      this.goldenStitchesEarned += 2;
      sound.playBrassBell();
    } else {
      sound.playGentleNudge();
    }
    this.render();
  }

  public advanceToPhase4AndSave(): void {
    this.phase = 'phase4_reward';
    if (!this.sessionSaved) {
      this.sessionSaved = true;
      for (const err of this.caughtErrors) {
        if (err.said && err.correct) {
          saveCaietEntry({
            said: err.said,
            correct: err.correct,
            category: err.category as any,
            source: 'tutor',
          });
        }
      }
      TutorProgressManager.recordCompletedSession({
        theme: this.selectedTopic.id,
        focusCategory: this.scenario.focusCategory,
        secondaryCategory: this.scenario.secondaryCategory,
        widgetsUsed: ['ColorCodedGrammarExplorer'],
        goldenStitchesEarned: Math.max(6, this.goldenStitchesEarned),
        correctCount: Math.max(1, this.correctCount),
        attemptCount: Math.max(1, this.attemptCount),
        caughtErrors: this.caughtErrors,
        wins: this.wins,
        parolaDeCina: this.scenario.parolaDeCina,
        completedCheckpointQuest: this.isCheckpointBoss,
      });
      sound.playBrassBell();
      if (this.onStateUpdated) this.onStateUpdated();
    }
    this.render();
  }

  // ============================================================================
  // Minimalist Cumulative Nugget Progression & AI Generation
  // ============================================================================

  private cleanDisplay(text: string, stripLeadingPraise = false): string {
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

  /**
   * Highlights any quoted words/phrases in the theory paragraph that have a real
   * studio-recorded audio clip with an interactive Golden Halo pill (`🔊 „...”`).
   */
  private renderTheoryWithAudioHalos(rawText: string): string {
    const clean = this.cleanDisplay(rawText);
    return clean.replace(/„([^”]+)”|'([^']+)'/g, (_fullMatch, g1, g2) => {
      const phrase = (g1 || g2 || '').trim();
      if (phrase && sound.hasRecordedAudio(phrase)) {
        const safeAttr = phrase.replace(/"/g, '&quot;');
        return `<button type="button" class="inline-audio-halo" data-audio-phrase="${safeAttr}" title="Atinge pentru a auzi pronunția" style="display: inline-flex; align-items: center; gap: 4px; background: #FFFDF4; border: 1.5px solid #D4A017; box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.25), 0 0 10px rgba(212, 160, 23, 0.35); border-radius: 999px; padding: 1px 9px; margin: 0 2px; font-family: inherit; font-size: 0.95em; font-weight: 800; color: var(--walnut); cursor: pointer; vertical-align: baseline;"><span style="font-size: 12px;">🔊</span>„${phrase}”</button>`;
      }
      return `„${phrase}”`;
    });
  }

  public selectNugget(nuggetIndex: number): void {
    const spec = GrammarProficiencyStore.setActiveNugget(nuggetIndex);
    this.currentPillarId = spec.pillarId;
    this.currentGrammarLesson = GrammarProficiencyStore.getStarterLessonForNugget(spec.nuggetIndex);
    this.selectedWordIndex = 0;
    this.showQuestionStep = false;
    this.testerSolved = false;
    this.wrongAttemptIndices = [];
    this.lastWrongOptionText = '';
    this.showNuggetPickerDrawer = false;
    sound.playWoodenTap();
    this.render();
  }

  public answerTesterQuestion(optionIndex: number): void {
    if (this.testerSolved || this.wrongAttemptIndices.includes(optionIndex)) return;
    this.attemptCount += 1;

    const q = this.currentGrammarLesson.testerQuestion;
    const isCorrect = optionIndex === q.correctIndex;
    const chosenText = this.cleanDisplay(q.options[optionIndex] || '');

    if (isCorrect) {
      this.testerSolved = true;
      if (this.wrongAttemptIndices.length === 0) {
        GrammarProficiencyStore.recordTesterAnswer(this.currentPillarId, true);
      }
      this.correctCount += 1;
      this.goldenStitchesEarned += 3;
      this.wins.push(chosenText);
      sound.playBrassBell();
      if (sound.hasRecordedAudio(chosenText)) {
        sound.speakRomanian(chosenText);
      }
    } else {
      this.wrongAttemptIndices.push(optionIndex);
      this.lastWrongOptionText = chosenText;
      GrammarProficiencyStore.recordTesterAnswer(this.currentPillarId, false, chosenText);
      const correctOption = this.cleanDisplay(q.options[q.correctIndex] || '');
      const nuggetSpec = GrammarProficiencyStore.getCurrentNuggetSpec();
      if (chosenText && correctOption) {
        saveCaietEntry({
          said: chosenText,
          correct: correctOption,
          category: (nuggetSpec.categoryCode || 'CAS') as any,
          source: 'tutor',
        });
      }
      sound.playGentleNudge();
    }

    if (this.onStateUpdated) this.onStateUpdated();
    this.render();
  }

  public async advanceToNextRepetitionOrNugget(customQuestionRo?: string): Promise<void> {
    if (this.isThinking) return;

    const wasCorrectOnFirstTry = this.wrongAttemptIndices.length === 0;

    const spiralStep = customQuestionRo
      ? {
          nuggetSpec: GrammarProficiencyStore.getCurrentNuggetSpec(),
          repInCurrentNugget: GrammarProficiencyStore.getSpiralState().repInCurrentNugget,
          advancedToNewNugget: false,
        }
      : GrammarProficiencyStore.advanceSpiralStep(wasCorrectOnFirstTry);

    const activeSpec = spiralStep.nuggetSpec;
    this.currentPillarId = activeSpec.pillarId;

    // If we just unlocked a brand-new nugget (rep === 0 and not a custom question), load its clean starter card first!
    if (spiralStep.advancedToNewNugget && !customQuestionRo) {
      this.currentGrammarLesson = GrammarProficiencyStore.getStarterLessonForNugget(
        activeSpec.nuggetIndex
      );
      this.selectedWordIndex = 0;
      this.showQuestionStep = false;
      this.testerSolved = false;
      this.wrongAttemptIndices = [];
      this.lastWrongOptionText = '';
      sound.playBrassBell();
      this.render();
      return;
    }

    // Otherwise, generate a fresh repetition card via Gemini AI that repeats the current nugget
    // and slowly mixes in previously learned nuggets (1..activeSpec.nuggetIndex - 1)!
    const previousNuggets = CUMULATIVE_NUGGET_LADDER.filter(
      (n) => n.nuggetIndex < activeSpec.nuggetIndex
    )
      .map((n) => n.titleRo)
      .join(', ');

    const promptForAi =
      customQuestionRo ||
      `Suntem la ${activeSpec.titleRo} (Repetiția ${spiralStep.repInCurrentNugget + 1} din 3). Regula de bază: "${activeSpec.coreRuleRo}". ${
        previousNuggets
          ? `Amestecă ușor și natural cu ce am învățat deja (${previousNuggets}).`
          : 'Păstrează propoziția foarte simplă (3-4 cuvinte).'
      } Dă-mi un exemplu nou, scurt și clar pe culori, urmat de o întrebare simplă de verificare!`;

    this.isThinking = true;
    this.render();

    const prof = GrammarProficiencyStore.getProficiency(this.currentPillarId);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: this.currentPillarId,
          themeLabelRo: activeSpec.titleRo,
          focusCategory: activeSpec.categoryCode,
          secondaryCategory: this.activeCheckpoint.secondaryCategory,
          checkpointId: this.activeCheckpoint.checkpointId,
          checkpointNameRo: activeSpec.titleRo,
          turnCount: this.agentTurnCount,
          messages: this.chatHistory,
          tudorInput: promptForAi,
          lessonNumber: activeSpec.nuggetIndex,
          lessonTitleRo: activeSpec.titleRo,
          learningGoalRo: `${activeSpec.coreRuleRo} (${activeSpec.mixesWithRo})`,
          pillarId: this.currentPillarId,
          proficiencyScore: prof.score,
          proficiencyTier: prof.tier,
          recentMistakes: prof.recentMistakes,
        }),
      });

      if (response.ok) {
        const data: AgenticTutorResponse = await response.json();
        this.isThinking = false;

        if (data.generatedGrammarLesson) {
          data.generatedGrammarLesson.nuggetIndex = activeSpec.nuggetIndex;
          data.generatedGrammarLesson.stepInNugget = (spiralStep.repInCurrentNugget + 1) as 1 | 2 | 3;
          this.currentGrammarLesson = data.generatedGrammarLesson;
          GrammarProficiencyStore.saveGeneratedLesson(data.generatedGrammarLesson);
        }

        this.selectedWordIndex = 0;
        this.showQuestionStep = false;
        this.testerSolved = false;
        this.wrongAttemptIndices = [];
        this.lastWrongOptionText = '';
        this.showAskInputDrawer = false;
        this.goldenStitchesEarned += 3;
        this.agentTurnCount += 1;

        if (!this.sessionSaved && this.agentTurnCount >= 3) {
          this.sessionSaved = true;
          TutorProgressManager.recordCompletedSession({
            theme: this.currentPillarId,
            focusCategory: activeSpec.categoryCode,
            secondaryCategory: this.activeCheckpoint.secondaryCategory,
            widgetsUsed: ['MinimalistNuggetCard'],
            goldenStitchesEarned: Math.max(6, this.goldenStitchesEarned),
            correctCount: Math.max(1, this.correctCount),
            attemptCount: Math.max(1, this.attemptCount),
            caughtErrors: this.caughtErrors,
            wins: this.wins,
            parolaDeCina: this.currentGrammarLesson.sentenceFullText,
            completedCheckpointQuest: false,
          });
        }

        sound.playBrassBell();
        if (this.onStateUpdated) this.onStateUpdated();
        this.render();
        return;
      }
    } catch {
      // Offline fallback: cycle to next starter nugget
    }

    this.isThinking = false;
    const nextFallbackIdx =
      activeSpec.nuggetIndex < CUMULATIVE_NUGGET_LADDER.length ? activeSpec.nuggetIndex + 1 : 1;
    this.selectNugget(nextFallbackIdx);
  }

  // ============================================================================
  // Minimalist Single-Card Renderer
  // ============================================================================

  private render(): void {
    const spiral = GrammarProficiencyStore.getSpiralState();
    const nuggetSpec = GrammarProficiencyStore.getCurrentNuggetSpec();
    const lesson = this.currentGrammarLesson;
    const activeWord: ColorCodedWordToken | undefined =
      lesson.colorCodedWords[this.selectedWordIndex] || lesson.colorCodedWords[0];
    const activeRoleStyle = activeWord
      ? ROLE_COLOR_MAP[activeWord.role] || ROLE_COLOR_MAP.substantiv
      : ROLE_COLOR_MAP.substantiv;

    const cleanExplanation = this.cleanDisplay(lesson.testerQuestion.explanationRo, true);
    const hasWrongAttempt = this.wrongAttemptIndices.length > 0 && !this.testerSolved;

    // Count how many words in the color-coded sentence have recorded studio audio
    const playableSentenceWords = lesson.colorCodedWords
      .map((w) => this.cleanDisplay(w.word))
      .filter((w) => sound.hasRecordedAudio(w));

    const repDots = [0, 1, 2]
      .map((idx) => {
        const filled = idx <= spiral.repInCurrentNugget;
        return `<span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${
          filled ? 'var(--gold-bell)' : '#E0D6C8'
        };"></span>`;
      })
      .join('');

    this.container.innerHTML = `
      <div class="tutore-agentic-stage" data-station="tutore_agentic" data-phase="${this.phase}" data-parola="${this.scenario.parolaDeCina}" style="max-width: 660px; margin: 12px auto; padding: 0 8px;">
        
        <!-- THE SINGLE MINIMALIST FOCUS CARD -->
        <div style="background: #FFFDF9; border: 2px solid var(--linen-dark); border-radius: 20px; padding: 28px 30px; box-shadow: 0 8px 28px rgba(62, 42, 30, 0.06); display: flex; flex-direction: column; gap: 22px;">
          
          <!-- Quiet Minimal Top Meta Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid var(--linen-dark); padding-bottom: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 12px; font-weight: 800; color: #7C6A58; text-transform: uppercase; letter-spacing: 0.04em;">
                ${nuggetSpec.titleRo}
              </span>
              <span style="display: inline-flex; align-items: center; gap: 5px;" title="3 pași de repetiție pentru această pepită">
                ${repDots}
              </span>
            </div>

            <button
              type="button"
              id="btnSpeakCard"
              title="Cuvintele cu halou auriu 🔊 pot fi ascultate când le atingi!"
              style="background: #FFFDF4; border: 1.5px solid #D4A017; box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.22), 0 0 10px rgba(212, 160, 23, 0.28); border-radius: 999px; padding: 5px 12px; font-size: 11px; font-weight: 800; color: var(--walnut); cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"
            >
              <span>🔊</span>
              <span>${playableSentenceWords.length > 0 ? 'Halou Auriu = Cuvânt cu voce' : 'Ascultă propoziția'}</span>
            </button>
          </div>

          ${
            this.isThinking
              ? `
            <div style="padding: 36px 16px; text-align: center; font-size: 16px; font-weight: 700; color: #8A5A00;">
              🐑✨ Miorița pregătește următoarea propoziție...
            </div>
          `
              : `
            <!-- 1. THE NUGGET EXPLANATION (1-2 calm sentences, with inline Golden Halo on playable phrases) -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <p style="font-size: 17px; line-height: 1.65; color: var(--ink-charcoal); margin: 0;">
                ${this.renderTheoryWithAudioHalos(lesson.mioritaTheoryRo)}
              </p>
              <div style="font-size: 13px; font-weight: 700; color: #5C4E43; background: var(--linen-card); padding: 8px 14px; border-radius: 10px; align-self: flex-start;">
                ${this.cleanDisplay(lesson.secretFormulaRo)}
              </div>
            </div>

            <!-- 2. THE COLOR-CODED SENTENCE (Words with studio audio glow with an explicit Golden Halo + 🔊 badge) -->
            <div style="display: flex; flex-direction: column; gap: 12px; background: #FFFFFF; border: 2px solid var(--linen-dark); border-radius: 16px; padding: 22px 18px;">
              <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                ${lesson.colorCodedWords
                  .map((w, idx) => {
                    const style = ROLE_COLOR_MAP[w.role] || ROLE_COLOR_MAP.substantiv;
                    const isSelected = idx === this.selectedWordIndex;
                    const cleanWord = this.cleanDisplay(w.word);
                    const hasAudio = sound.hasRecordedAudio(cleanWord);
                    const haloShadow = hasAudio
                      ? '0 0 0 4px rgba(212, 160, 23, 0.34), 0 0 16px rgba(212, 160, 23, 0.48)'
                      : 'none';
                    return `
                      <button
                        type="button"
                        class="color-coded-word-btn ${hasAudio ? 'has-audio-halo' : ''}"
                        data-word-idx="${idx}"
                        title="${hasAudio ? `🔊 Atinge pentru a auzi „${cleanWord}” și explicația` : `Atinge pentru a vedea rolul cuvântului „${cleanWord}”`}"
                        style="position: relative; background: ${isSelected ? style.bg : '#FFF'}; border: 2.5px solid ${style.color}; box-shadow: ${haloShadow}; border-radius: 12px; padding: 10px 16px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; transform: ${isSelected ? 'translateY(-2px)' : 'none'}; transition: all 0.15s ease;"
                      >
                        ${
                          hasAudio
                            ? `<span style="position: absolute; top: -9px; right: -9px; background: #FFFDF0; border: 1.5px solid #D4A017; box-shadow: 0 2px 6px rgba(212, 160, 23, 0.4); border-radius: 999px; padding: 1px 6px; font-size: 11px; font-weight: 800; color: #8A5A00; line-height: 1.2;">🔊</span>`
                            : ''
                        }
                        <span style="font-family: var(--font-serif); font-size: 23px; font-weight: 800; color: var(--ink-charcoal);">
                          ${cleanWord}
                        </span>
                        <span style="font-size: 10px; font-weight: 800; color: ${style.color}; text-transform: uppercase;">
                          ${this.cleanDisplay(w.roleLabel)}
                        </span>
                      </button>
                    `;
                  })
                  .join('')}
              </div>

              <!-- 1-Line Word Function Explanation -->
              ${
                activeWord
                  ? `
                <div style="text-align: center; font-size: 14px; color: var(--ink-charcoal); background: ${activeRoleStyle.bg}; border-radius: 10px; padding: 10px 14px; border: 1px solid ${activeRoleStyle.color};">
                  <strong style="color: ${activeRoleStyle.color};">„${this.cleanDisplay(activeWord.word)}” (${this.cleanDisplay(activeWord.questionHook)}):</strong> ${this.cleanDisplay(activeWord.explanation)}
                </div>
              `
                  : ''
              }
            </div>

            <!-- 3. ONE FOCUSED ACTION AT THE BOTTOM (Explore first -> Then 1 gentle check) -->
            ${
              !this.showQuestionStep
                ? `
              <div style="display: flex; justify-content: flex-end; padding-top: 4px;">
                <button
                  type="button"
                  id="btnRevealCheck"
                  style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 12px 24px; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(62, 42, 30, 0.15);"
                >
                  Am înțeles · Verifică rapid ➔
                </button>
              </div>
            `
                : `
              <div style="border-top: 1px dashed var(--linen-dark); padding-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 15px; font-weight: 800; color: var(--walnut);">
                  ${this.cleanDisplay(lesson.testerQuestion.questionRo)}
                </div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  ${lesson.testerQuestion.options
                    .map((opt, idx) => {
                      const isCorrectOpt = idx === lesson.testerQuestion.correctIndex;
                      const isWrongAttempted = this.wrongAttemptIndices.includes(idx);
                      let btnBg = '#FFF';
                      let btnBorder = 'var(--walnut-light)';
                      if (this.testerSolved && isCorrectOpt) {
                        btnBg = '#E6F6EC';
                        btnBorder = '#237A4B';
                      } else if (isWrongAttempted) {
                        btnBg = '#FDE8E8';
                        btnBorder = '#C0292B';
                      }
                      const isDisabled = this.testerSolved || isWrongAttempted;
                      return `
                        <button
                          type="button"
                          class="tester-option-btn"
                          data-tester-idx="${idx}"
                          ${isDisabled ? 'disabled' : ''}
                          style="background: ${btnBg}; border: 2px solid ${btnBorder}; border-radius: 999px; padding: 10px 20px; font-size: 15px; font-weight: 800; color: var(--walnut); opacity: ${isWrongAttempted && !this.testerSolved ? '0.65' : '1'}; cursor: ${isDisabled ? 'default' : 'pointer'};"
                        >
                          ${this.cleanDisplay(opt)}
                        </button>
                      `;
                    })
                    .join('')}
                </div>

                ${
                  hasWrongAttempt
                    ? `
                  <div style="background: #FFF6E8; border: 1.5px solid #D9822B; border-radius: 10px; padding: 10px 14px; font-size: 14px; font-weight: 700; color: #7A3E00;">
                    🤔 Nu este „${this.lastWrongOptionText}”. Indiciu: ${cleanExplanation} — Alege varianta corectă de mai sus!
                  </div>
                `
                    : ''
                }

                ${
                  this.testerSolved
                    ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 4px;">
                    <span style="font-size: 14px; font-weight: 700; color: #1E6F3D;">
                      ✓ Corect! ${cleanExplanation}
                    </span>
                    <button
                      type="button"
                      id="btnNextRepetition"
                      style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 11px 22px; font-size: 14px; font-weight: 800; cursor: pointer;"
                    >
                      Continuă ➔
                    </button>
                  </div>
                `
                    : ''
                }
              </div>
            `
            }
          `
          }

        </div>

        <!-- QUIET, UNOBTRUSIVE FOOTER LINKS BELOW THE CARD -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 6px; font-size: 12px; color: #7C6A58; flex-wrap: wrap; gap: 8px;">
          <button
            type="button"
            id="btnToggleNuggetPicker"
            style="background: transparent; border: none; color: #7C6A58; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;"
          >
            🧭 Schimbă pepita (${nuggetSpec.nuggetIndex}/10)
          </button>

          <button
            type="button"
            id="btnToggleAskDrawer"
            style="background: transparent; border: none; color: #7C6A58; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;"
          >
            💬 Întreab-o pe Miorița
          </button>

          ${
            this.onOpenYearPlan
              ? `
            <button
              type="button"
              id="btnOpenYearPlanFromStudio"
              style="background: transparent; border: none; color: #7C6A58; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;"
            >
              📖 Fișe & Plan
            </button>
          `
              : ''
          }
          ${
            this.onBackToMap
              ? `
            <button
              type="button"
              id="btnBackToMapFromTutor"
              style="background: transparent; border: none; color: #7C6A58; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;"
            >
              🗺️ Hartă
            </button>
          `
              : ''
          }
        </div>

        <!-- Optional Compact Nugget Picker (Only visible when clicked) -->
        ${
          this.showNuggetPickerDrawer
            ? `
          <div style="background: #FFF; border: 1.5px solid var(--linen-dark); border-radius: 14px; padding: 12px; display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
            ${CUMULATIVE_NUGGET_LADDER.map(
              (n) => `
              <button
                type="button"
                class="nugget-jump-btn"
                data-nugget-idx="${n.nuggetIndex}"
                style="background: ${n.nuggetIndex === nuggetSpec.nuggetIndex ? 'var(--walnut)' : 'var(--linen-pure)'}; color: ${n.nuggetIndex === nuggetSpec.nuggetIndex ? '#FFF' : 'var(--walnut)'}; border: 1px solid var(--linen-dark); border-radius: 8px; padding: 6px 10px; font-size: 12px; font-weight: 700; cursor: pointer;"
              >
                ${spiral.masteredNuggets.includes(n.nuggetIndex) ? '✓ ' : ''}${n.titleRo}
              </button>
            `
            ).join('')}
          </div>
        `
            : ''
        }

        <!-- Optional Compact Question Input (Only visible when clicked) -->
        ${
          this.showAskInputDrawer
            ? `
          <form id="tutorFreeTextForm" style="display: flex; gap: 8px; margin-bottom: 10px;">
            <input
              type="text"
              id="tutorFreeTextInput"
              placeholder="Scrie o întrebare sau o temă (ex: Minecraft, fotbal)..."
              style="flex: 1; padding: 10px 14px; border: 1.5px solid var(--walnut-light); border-radius: 999px; font-size: 14px; background: #FFF;"
            />
            <button
              type="button"
              id="btnWalkieTalkie"
              style="background: var(--linen-card); border: 1.5px solid var(--linen-dark); border-radius: 999px; padding: 8px 12px; font-size: 13px; cursor: pointer;"
            >
              🎤
            </button>
            <button
              type="submit"
              style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 800; cursor: pointer;"
            >
              Trimite
            </button>
          </form>
          ${this.voiceFeedbackRo ? `<div style="font-size:12px; color:#7C6A58; text-align:center;">${this.voiceFeedbackRo}</div>` : ''}
        `
            : ''
        }

      </div>
    `;

    this.bindStageEvents();
  }

  private bindStageEvents(): void {
    // Speak playable words on the current card in context order
    this.container.querySelector('#btnSpeakCard')?.addEventListener('click', () => {
      const playableWords = this.currentGrammarLesson.colorCodedWords
        .map((w) => this.cleanDisplay(w.word))
        .filter((w) => sound.hasRecordedAudio(w));

      if (playableWords.length > 0) {
        playableWords.forEach((word, i) => {
          setTimeout(() => {
            sound.speakRomanian(word);
          }, i * 1150);
        });
      } else {
        sound.speakRomanian(this.cleanDisplay(this.currentGrammarLesson.sentenceFullText));
      }
    });

    // Tap any inline Golden Halo phrase inside the theory text to hear its studio pronunciation
    this.container.querySelectorAll('.inline-audio-halo').forEach((btn) => {
      btn.addEventListener('click', () => {
        const phrase = (btn as HTMLElement).getAttribute('data-audio-phrase');
        if (phrase) {
          sound.speakRomanian(phrase);
        }
      });
    });

    // Tap any color-coded word to view its 1-line role explanation (and hear it if it has a Golden Halo)
    this.container.querySelectorAll('.color-coded-word-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).getAttribute('data-word-idx'));
        this.selectedWordIndex = idx;
        const wordObj = this.currentGrammarLesson.colorCodedWords[idx];
        sound.playWoodenTap();
        if (wordObj) {
          const cleanWord = this.cleanDisplay(wordObj.word);
          if (sound.hasRecordedAudio(cleanWord)) {
            sound.speakRomanian(cleanWord);
          }
        }
        this.render();
      });
    });

    // Reveal the 1 verification question after exploring the nugget
    this.container.querySelector('#btnRevealCheck')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.showQuestionStep = true;
      this.render();
    });

    // Answer the verification question
    this.container.querySelectorAll('.tester-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).getAttribute('data-tester-idx'));
        this.answerTesterQuestion(idx);
      });
    });

    // Advance to the next repetition / nugget
    this.container.querySelector('#btnNextRepetition')?.addEventListener('click', () => {
      void this.advanceToNextRepetitionOrNugget();
    });

    // Quiet footer toggles
    this.container.querySelector('#btnToggleNuggetPicker')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.showNuggetPickerDrawer = !this.showNuggetPickerDrawer;
      this.showAskInputDrawer = false;
      this.render();
    });

    this.container.querySelector('#btnToggleAskDrawer')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.showAskInputDrawer = !this.showAskInputDrawer;
      this.showNuggetPickerDrawer = false;
      this.render();
    });

    this.container.querySelector('#btnOpenYearPlanFromStudio')?.addEventListener('click', () => {
      sound.playWoodenTap();
      if (this.onOpenYearPlan) this.onOpenYearPlan();
    });

    this.container.querySelector('#btnBackToMapFromTutor')?.addEventListener('click', () => {
      sound.playWoodenTap();
      if (this.onBackToMap) this.onBackToMap();
    });

    // Jump to a specific nugget
    this.container.querySelectorAll('.nugget-jump-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).getAttribute('data-nugget-idx'));
        if (idx >= 1) this.selectNugget(idx);
      });
    });

    // Optional Ask Miorița form
    const freeForm = this.container.querySelector('#tutorFreeTextForm') as HTMLFormElement | null;
    const freeInput = this.container.querySelector('#tutorFreeTextInput') as HTMLInputElement | null;
    if (freeForm && freeInput) {
      freeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = freeInput.value.trim();
        if (!val) return;
        freeInput.value = '';
        void this.advanceToNextRepetitionOrNugget(val);
      });
    }

    this.container.querySelector('#btnWalkieTalkie')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.voiceFeedbackRo = '🎙️ Ascult...';
      this.render();
      this.voice.startWalkieTalkie([this.currentGrammarLesson.sentenceFullText], {
        onResult: (res) => {
          if (res.matchedHypothesis && res.matchedHypothesis.trim().length > 1) {
            this.voiceFeedbackRo = '';
            void this.advanceToNextRepetitionOrNugget(res.matchedHypothesis);
          }
        },
      });
    });
  }
}
