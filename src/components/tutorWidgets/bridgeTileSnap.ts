// src/components/tutorWidgets/bridgeTileSnap.ts — W3: Podul de Cuvinte (SUB, NUM, POS, CLI)
// Stream-crossing bridge where Tudor snaps the missing connector tile into place so Miorița can hop across.

import { sound } from '../../audio/synth';
import type { BridgeTileSnapConfig, TutorWidgetResult } from './widgetTypes';

export class BridgeTileSnapWidget {
  private container: HTMLElement;
  private config: BridgeTileSnapConfig;
  private onComplete?: (result: TutorWidgetResult) => void;
  private snapped = false;
  private attempts = 0;
  private gentleHintShown = false;
  private options: string[];

  constructor(
    container: HTMLElement,
    config: BridgeTileSnapConfig,
    onComplete?: (result: TutorWidgetResult) => void
  ) {
    this.container = container;
    this.config = config;
    this.onComplete = onComplete;
    this.options = [config.correctTile, ...config.distractorTiles];
    this.render();
  }

  public isSnapped(): boolean {
    return this.snapped;
  }

  public selectTile(tile: string): void {
    if (this.snapped) return;
    this.attempts += 1;

    if (tile.trim().toLowerCase() === this.config.correctTile.trim().toLowerCase()) {
      this.snapped = true;
      this.gentleHintShown = false;
      sound.playBrassBell();
      sound.speakRomanian(this.config.fullSentenceRo);
      this.render();
      if (this.onComplete) {
        this.onComplete({
          widgetType: 'BridgeTileSnap',
          completed: true,
          attempts: this.attempts,
          goldenStitches: 3,
          spokenOrTappedPhrase: this.config.fullSentenceRo,
        });
      }
    } else {
      this.gentleHintShown = true;
      sound.playGentleNudge();
      this.render();
    }
  }

  private render(): void {
    const tilesHtml = this.options
      .map(
        (tile) => `
        <button
          type="button"
          class="bridge-plank-btn ${this.snapped && tile === this.config.correctTile ? 'is-correct' : ''}"
          data-tile="${tile}"
          ${this.snapped ? 'disabled' : ''}
        >
          🪵 ${tile}
        </button>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-bridge" data-widget="BridgeTileSnap">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">🌉 Podul de Cuvinte · ${this.config.category}</span>
          <span class="tutor-widget-reward">${this.snapped ? '🌟 +3 Ochiuri de Aur!' : 'Alege scândura potrivită'}</span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        <div class="bridge-stream-stage ${this.snapped ? 'bridge-complete' : ''}">
          <div class="bridge-bank left-bank">
            <span class="miorita-hopper">${this.snapped ? '🌿' : '🐑'}</span>
            <span class="bank-phrase">${this.config.leftBankRo}</span>
          </div>

          <div class="bridge-gap-slot ${this.snapped ? 'is-filled' : 'is-open'}">
            ${this.snapped ? `<span class="snapped-plank">✨ ${this.config.correctTile} ✨</span>` : `<span class="gap-question">?</span>`}
          </div>

          <div class="bridge-bank right-bank">
            <span class="bank-phrase">${this.config.rightBankRo}</span>
            <span class="miorita-hopper">${this.snapped ? '🐑🎉' : '⛰️'}</span>
          </div>
        </div>

        <div class="bridge-plank-choices">
          ${tilesHtml}
        </div>

        ${
          this.gentleHintShown && !this.snapped
            ? `
          <div class="tutor-widget-nudge">
            🐑 <em>Hai să mai ascultăm o dată!</em> ${this.config.explanationRo}
          </div>
        `
            : ''
        }

        ${
          this.snapped
            ? `
          <div class="tutor-widget-insight">
            <p class="insight-ro">🌟 <strong>Podul e gata:</strong> „${this.config.fullSentenceRo}” — ${this.config.explanationRo}</p>
          </div>
        `
            : ''
        }
      </div>
    `;

    this.container.querySelectorAll('.bridge-plank-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tile = (btn as HTMLElement).getAttribute('data-tile') || '';
        this.selectTile(tile);
      });
    });
  }
}

