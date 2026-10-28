// src/audio/voiceRecognizer.ts — Bidirectional Voice Engine ("🎤 Spune tu!" Walkie-Talkie STT)
// Traces to: FR-AUD-002..005, Design §2.3
// Features:
// - Push-to-Talk ro-RO SpeechRecognition (continuous: false, interimResults: true, maxAlternatives: 5)
// - Inspects all 5 hypotheses for target Romanian inflection window while tolerating English loanwords
// - "Blame the Mountain Wind" (Vântul de la munte) 1-tap self-verification fallback after 2 unclear attempts

export interface VoiceMatchResult {
  matched: boolean;
  matchedHypothesis: string;
  confidence: number;
  usedMountainWindFallback?: boolean;
}

/**
 * Normalizes Romanian text for resilient STT comparison (strips punctuation, collapses whitespace,
 * and optionally folds diacritics when browser STT drops accents on short child utterances).
 */
export function normalizeRoTranscript(input: string, foldDiacritics = false): string {
  let s = input
    .toLowerCase()
    .replace(/[.,!?;:"„”«»'’()[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (foldDiacritics) {
    s = s
      .replace(/[ăâ]/g, 'a')
      .replace(/î/g, 'i')
      .replace(/[șş]/g, 's')
      .replace(/[țţ]/g, 't');
  }
  return s;
}

/**
 * Evaluates up to 5 STT hypotheses against expected Romanian target forms (`FR-AUD-003`).
 * Tolerates surrounding filler words or English loanwords (e.g. "Minecraft", "creeper", "penalty")
 * as long as any hypothesis contains the target Romanian grammatical form.
 */
export function evaluateSpeechHypotheses(
  hypotheses: string[],
  expectedTargets: string[]
): VoiceMatchResult {
  const cleanTargets = expectedTargets.filter((t) => t.trim().length > 0);
  if (cleanTargets.length === 0 || hypotheses.length === 0) {
    return { matched: false, matchedHypothesis: hypotheses[0] || '', confidence: 0 };
  }

  // Pass 1: Strict diacritic-aware substring/phrase match across all 5 alternatives
  for (const hyp of hypotheses) {
    const normHyp = normalizeRoTranscript(hyp, false);
    for (const target of cleanTargets) {
      const normTarget = normalizeRoTranscript(target, false);
      if (normHyp.includes(normTarget) || normTarget.includes(normHyp) && normHyp.length >= 4) {
        return { matched: true, matchedHypothesis: hyp, confidence: 0.95 };
      }
    }
  }

  // Pass 2: Diacritic-folded match across all 5 alternatives (for child voice / UK accent)
  for (const hyp of hypotheses) {
    const foldedHyp = normalizeRoTranscript(hyp, true);
    for (const target of cleanTargets) {
      const foldedTarget = normalizeRoTranscript(target, true);
      if (foldedHyp.includes(foldedTarget)) {
        return { matched: true, matchedHypothesis: hyp, confidence: 0.85 };
      }
    }
  }

  return { matched: false, matchedHypothesis: hypotheses[0] || '', confidence: 0.3 };
}

export class VoiceRecognizer {
  private recognition: any = null;
  private isListening = false;
  private unclearAttempts = 0;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public getUnclearAttempts(): number {
    return this.unclearAttempts;
  }

  public resetAttempts(): void {
    this.unclearAttempts = 0;
  }

  public shouldShowMountainWindFallback(): boolean {
    return !this.isSupported() || this.unclearAttempts >= 2;
  }

  /**
   * Starts a single Walkie-Talkie Push-to-Talk listening turn in `ro-RO` (`FR-AUD-002`).
   */
  public startWalkieTalkie(
    expectedTargets: string[],
    callbacks: {
      onInterim?: (transcript: string) => void;
      onResult: (result: VoiceMatchResult) => void;
      onMountainWindNeeded?: (messageRo: string) => void;
    }
  ): void {
    if (!this.isSupported()) {
      this.unclearAttempts = 2;
      if (callbacks.onMountainWindNeeded) {
        callbacks.onMountainWindNeeded(
          'Vântul de pe munte suflă tare azi în microfon! Spune cu voce tare și apasă butonul de mai jos:'
        );
      }
      return;
    }

    try {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRec();
      this.recognition.lang = 'ro-RO';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;

      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const resultItem = event.results?.[0];
        if (!resultItem) return;

        if (!resultItem.isFinal) {
          if (callbacks.onInterim) {
            callbacks.onInterim(resultItem[0]?.transcript || '');
          }
          return;
        }

        const hypotheses: string[] = [];
        for (let i = 0; i < resultItem.length; i++) {
          if (resultItem[i]?.transcript) {
            hypotheses.push(resultItem[i].transcript);
          }
        }

        const evalRes = evaluateSpeechHypotheses(hypotheses, expectedTargets);
        if (evalRes.matched) {
          this.unclearAttempts = 0;
          callbacks.onResult(evalRes);
        } else {
          this.unclearAttempts += 1;
          callbacks.onResult(evalRes);
          if (this.unclearAttempts >= 2 && callbacks.onMountainWindNeeded) {
            callbacks.onMountainWindNeeded(
              'Bate vântul pe munte și microfonul a fâșâit! Mai spune o dată sau apasă „Am spus cu voce tare!”'
            );
          }
        }
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        this.unclearAttempts += 1;
        if (callbacks.onMountainWindNeeded) {
          callbacks.onMountainWindNeeded(
            'Vântul din Carpați a bruiat stația! Poți încerca din nou sau apăsa „Am spus cu voce tare!”'
          );
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch {
      this.isListening = false;
      this.unclearAttempts = 2;
      if (callbacks.onMountainWindNeeded) {
        callbacks.onMountainWindNeeded(
          'Stația de munte are vânt puternic! Spune propoziția cu voce tare și apasă confirmarea.'
        );
      }
    }
  }

  public stopWalkieTalkie(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
  }
}

