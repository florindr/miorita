// src/components/tutorWidgets/calqueZapper.ts — W2: Prinzătorul de Englezisme (CLQ, ORD)
// Interactive speech-bubble zapper where Tudor taps each English calque chip to morph it into golden Romanian.

import { sound } from '../../audio/synth';
import type { CalqueZapperConfig, TutorWidgetResult } from './widgetTypes';

export class CalqueZapperWidget {
  private container: HTMLElement;
  private config: CalqueZapperConfig;
  private onComplete?: (result: TutorWidgetResult) => void;
  private zappedIndices: Set<number> = new Set();

  constructor(
    container: HTMLElement,
    config: CalqueZapperConfig,
    onComplete?: (result: TutorWidgetResult) => void
  ) {
    this.container = container;
    this.config = config;
    this.onComplete = onComplete;
    this.render();
  }

  public isAllZapped(): boolean {
    return this.zappedIndices.size >= this.config.zappedKeywords.length;
  }

  public zapKeyword(idx: number): void {
    if (this.zappedIndices.has(idx)) return;
    this.zappedIndices.add(idx);
    const kw = this.config.zappedKeywords[idx];

    if (this.isAllZapped()) {
      sound.playBrassBell();
      sound.speakRomanian(this.config.naturalBubbleRo);
      this.render();
      if (this.onComplete) {
        this.onComplete({
          widgetType: 'CalqueZapper',
          completed: true,
          attempts: this.zappedIndices.size,
          goldenStitches: 3,
          spokenOrTappedPhrase: this.config.naturalBubbleRo,
        });
      }
    } else {
      sound.playWoodenTap();
      if (kw) sound.speakRomanian(kw.fix);
      this.render();
    }
  }

  private render(): void {
    const allDone = this.isAllZapped();

    const chipsHtml = this.config.zappedKeywords
      .map((kw, idx) => {
        const isZapped = this.zappedIndices.has(idx);
        return `
          <button
            type="button"
            class="calque-zap-chip ${isZapped ? 'is-zapped' : 'is-trap'}"
            data-zap-idx="${idx}"
          >
            <span class="zap-chip-icon">${isZapped ? '🌟' : '⚡'}</span>
            <span class="zap-chip-text">${isZapped ? kw.fix : `${kw.trap} ➔ ?`}</span>
          </button>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-zapper" data-widget="CalqueZapper">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">⚡ Prinzătorul de Englezisme · ${this.config.category}</span>
          <span class="tutor-widget-reward">
            ${allDone ? '🌟 +3 Ochiuri de Aur!' : `Prinse: ${this.zappedIndices.size} / ${this.config.zappedKeywords.length}`}
          </span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        <div class="calque-bubble-display ${allDone ? 'is-repaired' : 'is-calque'}">
          <div class="bubble-speaker">
            ${allDone ? '🐑 Miorița (Română Curată):' : '🤖 Roboțelul din Londra (Tradus cuvânt cu cuvânt):'}
          </div>
          <div class="bubble-sentence">
            „${allDone ? this.config.naturalBubbleRo : this.config.calqueBubbleRo}”
          </div>
        </div>

        <div class="calque-zap-instruction">
          ${allDone ? '🎉 Bravo! Ai transformat toate englezismele în română curată!' : '👇 Atinge fiecare capcană de mai jos ca s-o repari cu fulgerul de aur:'}
        </div>

        <div class="calque-zap-grid">
          ${chipsHtml}
        </div>

        ${
          allDone
            ? `
          <div class="tutor-widget-insight">
            <p class="insight-ro">💡 <strong>De ce?</strong> ${this.config.explanationRo}</p>
            <p class="insight-en">🌉 <em>UK Bridge:</em> ${this.config.bridgeEn}</p>
          </div>
        `
            : ''
        }
      </div>
    `;

    this.container.querySelectorAll('.calque-zap-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).getAttribute('data-zap-idx') || '0', 10);
        this.zapKeyword(idx);
      });
    });
  }
}

