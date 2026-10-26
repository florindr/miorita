// src/stations/moaraCuArticole.ts — Station 4: Moara cu Articole (Category ART)
// Dynamic Romanian Article Bank & Dynamic Difficulty Adjustment (DDA) Engine
// Targets postposed definite articles (-ul, -le, -a, -ea, -ua, -ii) and the tricky preposition rule
// (e.g. "pe masă" vs "pe masa mare", "în clasă" vs "în clasa mea").

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';
import {
  ArticleItem,
  ArticleService,
  ARTICLE_BANK,
  ArticleDifficulty,
} from '../content/articleBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

// Backward-compatibility export
export const ARTICLE_ITEMS: ArticleItem[] = ARTICLE_BANK.slice(0, 5);

export class MoaraCuArticoleStation {
  private currentBatch: ArticleItem[] = [];
  private currentIndex = 0;
  private usedItemIds: string[] = [];
  private score = 0;
  private roundCount = 1;
  private isRoundComplete = false;
  private currentOptions: string[] = [];
  private lastItemIndex = -1;
  private containerElement: HTMLElement | null = null;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
    this.initBatch();
  }

  private getActiveProfileId(): string {
    return FamilyAuth.getActiveProfile().id;
  }

  private getCurrentLevel(): ArticleDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'articole').currentLevel as ArticleDifficulty;
  }

  /** Initialize a fresh random batch of 6 words calibrated to current difficulty */
  private initBatch(forcedLevel?: ArticleDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = ArticleService.getRandomBatch(6, level, this.usedItemIds);

    // Track used items to avoid repeating them in subsequent rounds
    this.usedItemIds.push(...this.currentBatch.map((i) => i.id));
    if (this.usedItemIds.length > 50) {
      this.usedItemIds = this.usedItemIds.slice(-25);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
    this.lastItemIndex = -1;
  }

  getCurrentItem(): ArticleItem {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return ARTICLE_BANK[0];
    }
    return this.currentBatch[this.currentIndex];
  }

  speak(text: string) {
    sound.playWoodenTap();
    sound.speakRomanian(text);
  }

  render(container: HTMLElement) {
    this.containerElement = container;
    const profile = FamilyAuth.getActiveProfile();
    const profileId = profile.id;
    const mastery = AdaptiveEngine.getMastery(profileId, 'articole');

    if (this.isRoundComplete) {
      this.renderRoundComplete(container, profile.name, mastery.currentLevel, mastery.streak);
      return;
    }

    const item = this.getCurrentItem();
    if (this.lastItemIndex !== this.currentIndex) {
      this.currentOptions = shuffleArray(item.options);
      this.lastItemIndex = this.currentIndex;
    }

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/moara_articole.jpg" alt="Moara cu Articole" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Moara cu Articole 🌾</h2>
          <p>Măcinați cuvântul simplu și alegeți articolul hotărât potrivit!</p>
        </div>

        <!-- DDA Adaptive Level Bar & Tiers Selector -->
        <div class="station-difficulty-bar">
          <div class="difficulty-tiers-row" role="tablist" aria-label="Nivele de dificultate">
            <button class="tier-pill tier-1 ${mastery.currentLevel === 1 ? 'active' : ''}" data-level="1" title="${TIER_METAS[1].desc}">
              ${TIER_METAS[1].badge}
            </button>
            <button class="tier-pill tier-2 ${mastery.currentLevel === 2 ? 'active' : ''}" data-level="2" title="${TIER_METAS[2].desc}">
              ${TIER_METAS[2].badge}
            </button>
            <button class="tier-pill tier-3 ${mastery.currentLevel === 3 ? 'active' : ''}" data-level="3" title="${TIER_METAS[3].desc}">
              ${TIER_METAS[3].badge}
            </button>
          </div>
          <div class="difficulty-streak-row">
            <span class="streak-badge">🔥 Serie: ${mastery.streak} corecte</span>
            <span>${
              mastery.currentLevel < 3
                ? `Încă ${3 - (mastery.streak % 3)} răspunsuri corecte până la următorul nivel`
                : `⭐ Nivel Maxim de Maestru!`
            }</span>
          </div>
        </div>

        <!-- Animated Water Mill Visual Stage -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center; position: relative; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.06);">
          <div style="font-size: 38px; margin-bottom: 8px;">⚙️🌾</div>
          <div style="font-size: 16px; color: var(--walnut); margin-bottom: 12px; font-weight: 600;">
            ${item.promptContext}
          </div>

          <div style="display: inline-flex; align-items: center; gap: 10px; background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 14px 28px; box-shadow: var(--soft-shadow);">
            <span style="font-size: 28px;">${item.icon}</span>
            <span style="font-family: var(--font-serif); font-size: 28px; font-weight: bold; color: var(--ink-charcoal);">
              ${item.bareWord}
            </span>
            <span id="articleSlot" style="background: var(--linen-pure); border: 2px dashed var(--walnut); border-radius: 6px; padding: 4px 14px; font-family: var(--font-serif); font-size: 24px; color: var(--gen-feminin); min-width: 50px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
              ?
            </span>
          </div>
        </div>

        <!-- Article Chute Options -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;" id="articleOptions">
          ${this.currentOptions
            .map(
              (opt) => `
            <button class="article-chute-btn" data-art="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 14px 26px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s, background 0.15s;">
              ${opt}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Podul Englez (Regula Morarului) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula Morarului: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Container -->
        <div class="progress-container">
          <span>Cuvinte măcinate (Sacul ${this.roundCount}): ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
          <div class="progress-dots">
            ${this.currentBatch
              .map(
                (_, i) =>
                  `<span class="dot ${i < this.currentIndex ? 'done' : ''} ${i === this.currentIndex ? 'current' : ''}"></span>`
              )
              .join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private renderRoundComplete(
    container: HTMLElement,
    childName: string,
    currentLevel: ArticleDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/moara_articole.jpg" alt="Moara cu Articole" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">⚙️ 🎉 🌾</div>
          <h3>Făina a Fost Măcinată cu Succes!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai cernut și potrivit toate cele 6 cuvinte din acest sac de grâu de la Moară!
          </p>

          <div class="round-stats-box">
            <div class="round-stat-pill">
              <span>Scor Total</span>
              <span class="round-stat-val">${this.score} ⭐</span>
            </div>
            <div class="round-stat-pill">
              <span>Nivel Adaptat</span>
              <span class="round-stat-val" style="font-size: 16px;">${tierMeta.badge}</span>
            </div>
            <div class="round-stat-pill">
              <span>Serie de Succes</span>
              <span class="round-stat-val">${streak} 🔥</span>
            </div>
          </div>

          <div class="round-actions-row">
            <button id="btnNextRound" class="btn-round-next">
              🌾 Sac Nou (Alte 6 Cuvinte) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Acest Sac
            </button>
          </div>
        </div>
      </section>
    `;

    const btnNext = container.querySelector('#btnNextRound') as HTMLButtonElement;
    const btnReplay = container.querySelector('#btnReplayRound') as HTMLButtonElement;

    btnNext?.addEventListener('click', () => {
      sound.playBrassBell();
      this.roundCount++;
      this.initBatch();
      this.render(container);
      this.onStateChange({
        prompt: `Sacul ${this.roundCount} a sosit la moară! 6 cuvinte noi așteaptă să fie măcinate.`,
        score: this.score,
      });
    });

    btnReplay?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.currentIndex = 0;
      this.isRoundComplete = false;
      this.render(container);
    });
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.article-chute-btn');
    const slot = container.querySelector('#articleSlot') as HTMLElement;
    const tierPills = container.querySelectorAll('.tier-pill');

    // Tier pills
    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as ArticleDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'articole', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong> pentru Moara cu Articole!`,
            score: this.score,
          });
        }
      });
    });

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-art');
        this.handleAttempt(selected || '', slot, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedArt: string, slot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (selectedArt === item.correctArticle) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      btn.style.color = 'var(--gen-neutru)';

      const displayEnding = selectedArt.startsWith('-') ? selectedArt : '✓';
      slot.textContent = displayEnding;
      slot.style.background = 'var(--gen-neutru)';
      slot.style.color = '#FFF';
      slot.style.borderStyle = 'solid';

      this.score += 15;

      const result = AdaptiveEngine.recordAttempt(profileId, 'articole', true);

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>Nivel Nou la Moară!</strong> ${profile.name}, ai promovat la <strong>${nextTier.badge}</strong>! Zicem: <strong>${item.articledWord}</strong>!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Foarte bine! Zicem: <strong>${item.articledWord}</strong>! Moara a cernut cuvântul perfect!`,
          score: this.score,
        });
      }

      this.speak(item.articledWord);

      setTimeout(() => {
        if (this.currentIndex >= this.currentBatch.length - 1) {
          this.isRoundComplete = true;
        } else {
          this.currentIndex++;
        }

        const root = this.containerElement || (document.querySelector('#stationRoot') as HTMLElement);
        if (root) this.render(root);
      }, 950);
    } else {
      // Socratic Nudge (Zero negative buzzers)
      sound.playGentleNudge();
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 450);

      const result = AdaptiveEngine.recordAttempt(profileId, 'articole', false);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Aproape! ${item.hint} Miorița te ajută: coborâm la nivelul <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Aproape! ${item.hint} Încearcă din nou!`,
          score: this.score,
        });
      }
    }
  }
}
