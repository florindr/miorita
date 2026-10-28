// src/components/tutorWidgets/genderBasketMini.ts — W5: Trei Coșuri Rapide (GEN)
// Compact 3-item rapid gender sort into Un-Doi (M), O-Două (F), and Un-Două (Neutru).

import { sound } from '../../audio/synth';
import type { GenderBasketMiniConfig, TutorWidgetResult } from './widgetTypes';

export class GenderBasketMiniWidget {
  private container: HTMLElement;
  private config: GenderBasketMiniConfig;
  private onComplete?: (result: TutorWidgetResult) => void;
  private currentIndex = 0;
  private attempts = 0;
  private showHint = false;
  private completed = false;

  constructor(
    container: HTMLElement,
    config: GenderBasketMiniConfig,
    onComplete?: (result: TutorWidgetResult) => void
  ) {
    this.container = container;
    this.config = config;
    this.onComplete = onComplete;
    this.render();
  }

  public isCompleted(): boolean {
    return this.completed;
  }

  public chooseGender(gender: 'M' | 'F' | 'N'): void {
    if (this.completed) return;
    this.attempts += 1;
    const item = this.config.items[this.currentIndex];
    if (!item) return;

    if (item.gender === gender) {
      this.showHint = false;
      sound.playWoodenTap();
      sound.speakRomanian(item.countedRo);
      this.currentIndex += 1;

      if (this.currentIndex >= this.config.items.length) {
        this.completed = true;
        sound.playBrassBell();
        this.render();
        if (this.onComplete) {
          this.onComplete({
            widgetType: 'GenderBasketMini',
            completed: true,
            attempts: this.attempts,
            goldenStitches: 3,
            spokenOrTappedPhrase: item.countedRo,
          });
        }
      } else {
        this.render();
      }
    } else {
      this.showHint = true;
      sound.playGentleNudge();
      sound.speakRomanian(item.countedRo);
      this.render();
    }
  }

  private render(): void {
    const item = this.config.items[this.currentIndex];

    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-baskets" data-widget="GenderBasketMini">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">🧺 Trei Coșuri Rapide · GEN</span>
          <span class="tutor-widget-reward">
            ${this.completed ? '🌟 +3 Ochiuri de Aur!' : `Coșul ${this.currentIndex + 1} / ${this.config.items.length}`}
          </span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        ${
          !this.completed && item
            ? `
          <div class="mini-basket-token">
            <span class="token-emoji">${item.emoji}</span>
            <span class="token-word">${item.nounRo}</span>
            <button type="button" id="miniTokenListenBtn" class="tutor-widget-secondary-btn">
              🔊 Ascultă indiciul
            </button>
          </div>

          <div class="mini-baskets-grid">
            <button type="button" class="mini-basket-btn basket-m" data-gender="M">
              <span class="basket-title">🪵 Un — Doi</span>
              <span class="basket-sub">Masculin</span>
            </button>
            <button type="button" class="mini-basket-btn basket-f" data-gender="F">
              <span class="basket-title">🌸 O — Două</span>
              <span class="basket-sub">Feminin</span>
            </button>
            <button type="button" class="mini-basket-btn basket-n" data-gender="N">
              <span class="basket-title">🚂 Un — Două</span>
              <span class="basket-sub">Neutru</span>
            </button>
          </div>

          ${
            this.showHint
              ? `
            <div class="tutor-widget-nudge">
              🐑 <em>Numără cu Miorița:</em> <strong>„${item.countedRo}”</strong>!
            </div>
          `
              : ''
          }
        `
            : `
          <div class="tutor-widget-insight">
            <p class="insight-ro">🎉 <strong>Toate coșurile sunt pline!</strong> Ai sortat: ${this.config.items
              .map((i) => `<em>${i.countedRo}</em>`)
              .join(' · ')}.</p>
          </div>
        `
        }
      </div>
    `;

    const listenBtn = this.container.querySelector('#miniTokenListenBtn');
    if (listenBtn && item) {
      listenBtn.addEventListener('click', () => {
        sound.playWoodenTap();
        sound.speakRomanian(item.countedRo);
      });
    }

    this.container.querySelectorAll('.mini-basket-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = (btn as HTMLElement).getAttribute('data-gender') as 'M' | 'F' | 'N';
        this.chooseGender(g);
      });
    });
  }
}

