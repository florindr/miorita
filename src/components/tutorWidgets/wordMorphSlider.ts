// src/components/tutorWidgets/wordMorphSlider.ts — W1: Atelierul de Transformare (CAS, ART, AGR)
// Interactive slider & tap-morph transforming English-shaped traps into inflected Romanian endings.

import { sound } from '../../audio/synth';
import type { WordMorphConfig, TutorWidgetResult } from './widgetTypes';

export class WordMorphSliderWidget {
  private container: HTMLElement;
  private config: WordMorphConfig;
  private onComplete?: (result: TutorWidgetResult) => void;
  private morphed = false;
  private sliderValue = 0;

  constructor(
    container: HTMLElement,
    config: WordMorphConfig,
    onComplete?: (result: TutorWidgetResult) => void
  ) {
    this.container = container;
    this.config = config;
    this.onComplete = onComplete;
    this.render();
  }

  public isMorphed(): boolean {
    return this.morphed;
  }

  public triggerMorph(): void {
    this.sliderValue = 100;
    this.morphed = true;
    sound.playBrassBell();
    sound.speakRomanian(this.config.morphedCorrectRo);
    this.render();
    if (this.onComplete) {
      this.onComplete({
        widgetType: 'WordMorphSlider',
        completed: true,
        attempts: 1,
        goldenStitches: 3,
        spokenOrTappedPhrase: this.config.morphedCorrectRo,
      });
    }
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-morph" data-widget="WordMorphSlider">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">✨ Atelierul de Transformare · ${this.config.category}</span>
          <span class="tutor-widget-reward">${this.morphed ? '🌟 +3 Ochiuri de Aur!' : 'Glisează sau atinge pentru a transforma'}</span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        <div class="tutor-morph-stage ${this.morphed ? 'is-morphed' : 'is-trap'}">
          <div class="tutor-morph-comparison">
            <div class="tutor-morph-box trap-box ${!this.morphed ? 'active' : 'faded'}">
              <div class="morph-box-label">🇬🇧 Forma după engleză (Capcană)</div>
              <div class="morph-box-phrase">${this.config.englishTrapRo}</div>
            </div>

            <div class="tutor-morph-arrow">${this.morphed ? '🌟➔' : '⚡➔'}</div>

            <div class="tutor-morph-box target-box ${this.morphed ? 'active' : ''}">
              <div class="morph-box-label">🇷🇴 Forma Românească Curată</div>
              <div class="morph-box-phrase">
                ${
                  this.morphed
                    ? `<span class="morph-stem">${this.config.stemText}</span><span class="morph-suffix-pill">${this.config.suffixHighlight}</span>`
                    : `<span class="morph-placeholder">Trage glisorul spre dreapta...</span>`
                }
              </div>
            </div>
          </div>

          <div class="tutor-morph-controls">
            <input
              type="range"
              id="wordMorphRange"
              class="tutor-morph-slider"
              min="0"
              max="100"
              value="${this.sliderValue}"
              aria-label="Glisor de transformare a cuvântului"
            />
            <div class="tutor-morph-buttons">
              <button type="button" id="wordMorphTapBtn" class="tutor-widget-primary-btn">
                ${this.morphed ? `🔊 Ascultă: „${this.config.morphedCorrectRo}”` : `✨ Transformă în „${this.config.morphedCorrectRo}”`}
              </button>
              <button type="button" id="wordMorphSlowBtn" class="tutor-widget-secondary-btn" title="Ascultă mai rar (0.85x)">
                🐢 Mai rar
              </button>
            </div>
          </div>

          ${
            this.morphed
              ? `
            <div class="tutor-widget-insight">
              <p class="insight-ro">💡 <strong>Secretul Meșterului:</strong> ${this.config.explanationRo}</p>
              <p class="insight-en">🌉 <em>UK Bridge:</em> ${this.config.bridgeEn}</p>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    const range = this.container.querySelector('#wordMorphRange') as HTMLInputElement | null;
    if (range) {
      range.addEventListener('input', () => {
        const val = parseInt(range.value, 10);
        this.sliderValue = val;
        if (val >= 70 && !this.morphed) {
          this.triggerMorph();
        }
      });
    }

    const tapBtn = this.container.querySelector('#wordMorphTapBtn');
    if (tapBtn) {
      tapBtn.addEventListener('click', () => {
        if (!this.morphed) {
          this.triggerMorph();
        } else {
          sound.playWoodenTap();
          sound.speakRomanian(this.config.morphedCorrectRo);
        }
      });
    }

    const slowBtn = this.container.querySelector('#wordMorphSlowBtn');
    if (slowBtn) {
      slowBtn.addEventListener('click', () => {
        sound.playWoodenTap();
        if ('speakRomanianSlow' in sound && typeof (sound as any).speakRomanianSlow === 'function') {
          (sound as any).speakRomanianSlow(this.config.morphedCorrectRo);
        } else {
          sound.speakRomanian(this.config.morphedCorrectRo);
        }
      });
    }
  }
}

