// src/stations/potecaLuiSa.ts — Station 5: Poteca lui Să (Category SUB)
// Dynamic Romanian Subjunctive Bank & Dynamic Difficulty Adjustment (DDA) Engine
// Targets omission of the subjunctive particle "să" after modal/volitional verbs.
// English: "I want to go" -> Tudor: "vreau merg" -> Romanian: "vreau SĂ merg".
// Mechanic: Stepping stones across the mountain brook; Miorița hops onto each correct stone.

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';
import {
  SubjunctiveItem,
  SubjunctiveService,
  SUBJUNCTIVE_BANK,
  SubjunctiveDifficulty,
} from '../content/subjunctiveBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

// Backward-compatibility export
export const SUBJUNCTIVE_ITEMS: SubjunctiveItem[] = SUBJUNCTIVE_BANK.slice(0, 4);

export class PotecaLuiSaStation {
  private currentBatch: SubjunctiveItem[] = [];
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

  private getCurrentLevel(): SubjunctiveDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'subjunctiv').currentLevel as SubjunctiveDifficulty;
  }

  /** Initialize a fresh random batch of 5 items calibrated to current difficulty */
  private initBatch(forcedLevel?: SubjunctiveDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = SubjunctiveService.getRandomBatch(5, level, this.usedItemIds);

    // Track used items to avoid repeating them in subsequent rounds
    this.usedItemIds.push(...this.currentBatch.map((i) => i.id));
    if (this.usedItemIds.length > 40) {
      this.usedItemIds = this.usedItemIds.slice(-20);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
    this.lastItemIndex = -1;
  }

  getCurrentItem(): SubjunctiveItem {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return SUBJUNCTIVE_BANK[0];
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
    const mastery = AdaptiveEngine.getMastery(profileId, 'subjunctiv');

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
          <img src="/art/stations/poteca_sa.jpg" alt="Poteca lui Să" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Poteca lui Să 🪨</h2>
          <p>Alege piatra de râu potrivită ca Miorița să sară pârâul!</p>
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

        <!-- The Stepping Stones Brook Area -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.06);">
          <div style="font-size: 32px; margin-bottom: 6px;">${item.icon}</div>
          <div style="font-size: 14px; color: var(--walnut); margin-bottom: 8px;">
            ⚠️ Cum zice engleza: <del style="color: var(--gen-feminin); font-weight: 700;">„${item.englishShape}”</del>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 14px; flex-wrap: wrap;">
            <div style="background: var(--walnut); color: #FFF; padding: 12px 24px; border-radius: 20px; font-family: var(--font-serif); font-size: 26px; font-weight: bold; box-shadow: var(--soft-shadow);">
              ${item.triggerVerb}
            </div>
            <div id="stoneDrop" style="background: rgba(255,255,255,0.9); border: 2.5px dashed var(--gen-neutru); color: var(--gen-neutru); padding: 12px 26px; border-radius: 20px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; min-width: 140px; transition: all 0.2s ease;">
              ... ? ...
            </div>
          </div>
        </div>

        <!-- Stepping Stone Options -->
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;" id="stoneOptions">
          ${this.currentOptions
            .map(
              (opt) => `
            <button class="stepping-stone-btn" data-stone="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: 18px; padding: 14px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s, background 0.15s;">
              ${opt}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula Pietrelor: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Container -->
        <div class="progress-container">
          <span>Pietre trecute (Pasul ${this.roundCount}): ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
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
    currentLevel: SubjunctiveDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/poteca_sa.jpg" alt="Poteca lui Să" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">🪨 🎉 🐑</div>
          <h3>Pârâul a Fost Trecut cu Bravură!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai sărit pe toate cele 5 pietre fermecate „SĂ”, iar Miorița a ajuns teafără pe celălalt mal!
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
              🪨 Potecă Nouă (Alte 5 Pietre) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Această Potecă
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
        prompt: `Pasul ${this.roundCount} a început! 5 pietre noi așteaptă să fie sărite.`,
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
    const buttons = container.querySelectorAll('.stepping-stone-btn');
    const stoneDrop = container.querySelector('#stoneDrop') as HTMLElement;
    const tierPills = container.querySelectorAll('.tier-pill');

    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as SubjunctiveDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'subjunctiv', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong> pentru Poteca lui Să!`,
            score: this.score,
          });
        }
      });
    });

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stone = btn.getAttribute('data-stone');
        this.handleAttempt(stone || '', stoneDrop, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedStone: string, dropSlot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (selectedStone === item.correctPhrase) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      btn.style.color = 'var(--gen-neutru)';
      dropSlot.textContent = selectedStone;
      dropSlot.style.background = 'var(--gen-neutru)';
      dropSlot.style.color = '#FFF';
      dropSlot.style.borderStyle = 'solid';

      this.score += 15;

      const result = AdaptiveEngine.recordAttempt(profileId, 'subjunctiv', true);

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>Nivel Nou pe Potecă!</strong> ${profile.name}, ai avansat la <strong>${nextTier.badge}</strong>! Zicem: <strong>${item.fullCorrect}</strong>!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Bravo! Zicem: <strong>${item.fullCorrect}</strong>! Ai sărit pârâul pe piatra «SĂ»!`,
          score: this.score,
        });
      }

      this.speak(item.fullCorrect);

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
      // Socratic Nudge
      sound.playGentleNudge();
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 450);

      const result = AdaptiveEngine.recordAttempt(profileId, 'subjunctiv', false);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Aproape! ${item.hint} Miorița te ajută: coborâm la nivelul <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Aproape! ${item.hint}`,
          score: this.score,
        });
      }
    }
  }
}
