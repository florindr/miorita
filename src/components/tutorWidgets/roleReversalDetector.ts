// src/components/tutorWidgets/roleReversalDetector.ts — W4: Profesorul Tudor (FR-TUT-006)
// Role-reversal empowerment widget: Miorița makes a silly English-interference mistake on purpose,
// and Tudor taps the funny word(s) to catch and fix Miorița's error for double golden stitches!

import { sound } from '../../audio/synth';
import type { RoleReversalConfig, TutorWidgetResult } from './widgetTypes';

export class RoleReversalDetectorWidget {
  private container: HTMLElement;
  private config: RoleReversalConfig;
  private onComplete?: (result: TutorWidgetResult) => void;
  private caught = false;
  private attempts = 0;
  private showGentleHint = false;

  constructor(
    container: HTMLElement,
    config: RoleReversalConfig,
    onComplete?: (result: TutorWidgetResult) => void
  ) {
    this.container = container;
    this.config = config;
    this.onComplete = onComplete;
    this.render();
  }

  public isCaught(): boolean {
    return this.caught;
  }

  public tapWordIndex(idx: number): void {
    if (this.caught) return;
    this.attempts += 1;

    if (this.config.mistakeWordIndices.includes(idx)) {
      this.caught = true;
      this.showGentleHint = false;
      sound.playBrassBell();
      sound.speakRomanian(this.config.fullCorrectedSentenceRo);
      this.render();
      if (this.onComplete) {
        this.onComplete({
          widgetType: 'RoleReversalDetector',
          completed: true,
          attempts: this.attempts,
          goldenStitches: 4, // Double golden stitches for catching Miorița!
          spokenOrTappedPhrase: this.config.fullCorrectedSentenceRo,
        });
      }
    } else {
      this.showGentleHint = true;
      sound.playGentleNudge();
      this.render();
    }
  }

  private render(): void {
    const wordsHtml = this.config.mioritaQuoteWords
      .map((word, idx) => {
        const isMistake = this.config.mistakeWordIndices.includes(idx);
        const stateClass = this.caught && isMistake ? 'is-caught-mistake' : '';
        return `
          <button
            type="button"
            class="profesor-word-pill ${stateClass}"
            data-word-idx="${idx}"
            ${this.caught ? 'disabled' : ''}
          >
            ${this.caught && isMistake ? `❌ ${word}` : word}
          </button>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-profesor" data-widget="RoleReversalDetector">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">🎓 Profesorul Tudor · Prinde greșeala Mioriței!</span>
          <span class="tutor-widget-reward">
            ${this.caught ? '🌟🌟 +4 Ochiuri de Aur (Premiu Dublu)!' : 'Atinge cuvântul năstrușnic!'}
          </span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        <div class="profesor-miorita-blunder">
          <div class="blunder-avatar">🐑💭 <em>Miorița a încurcat vorbele ca-n engleză:</em></div>
          <div class="profesor-words-row">
            ${wordsHtml}
          </div>
        </div>

        ${
          this.showGentleHint && !this.caught
            ? `
          <div class="tutor-widget-nudge">
            🔎 <em>Uită-te cu lupa la partea care sună ca tradusă din engleză:</em> caută zona cu <strong>„${this.config.mistakePhraseRo}”</strong>!
          </div>
        `
            : ''
        }

        ${
          this.caught
            ? `
          <div class="profesor-stamp-box">
            <div class="stamp-badge">✅ REPARAT DE PROFESORUL TUDOR</div>
            <div class="stamp-comparison">
              <span class="stamp-old">„${this.config.mistakePhraseRo}”</span>
              <span class="stamp-arrow">➔</span>
              <span class="stamp-new">„${this.config.correctedPhraseRo}”</span>
            </div>
            <div class="stamp-full-sentence">🔊 <strong>Propoziția corectă:</strong> „${this.config.fullCorrectedSentenceRo}”</div>
            <p class="insight-ro">💡 ${this.config.explanationRo}</p>
          </div>
        `
            : ''
        }
      </div>
    `;

    this.container.querySelectorAll('.profesor-word-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).getAttribute('data-word-idx') || '0', 10);
        this.tapWordIndex(idx);
      });
    });
  }
}

