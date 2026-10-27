// src/stations/vanatorulDeEnglezisme.ts — Station 3: Vânătorul de Englezisme (Category CLQ)
// Dynamic Romanian Calque Bank & Dynamic Difficulty Adjustment (DDA) Engine
// Targets English calques and false friends that heritage kids use because they think in English.
// Examples: "sunt 8 ani" (I am 8), "face sens" (makes sense), "sunt rece" (I am cold), "am luat un duș" (took a shower).

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';
import {
  CalqueItem,
  CalqueService,
  CALQUE_BANK,
  CalqueDifficulty,
} from '../content/calqueBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

// Backward-compatibility export
export const CALQUE_ITEMS: CalqueItem[] = CALQUE_BANK.slice(0, 5);

export class VanatorulDeEnglezismeStation {
  private currentBatch: CalqueItem[] = [];
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

  private getCurrentLevel(): CalqueDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'englezisme').currentLevel as CalqueDifficulty;
  }

  /** Initialize a fresh random batch of 5 calques calibrated to current difficulty */
  private initBatch(forcedLevel?: CalqueDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = CalqueService.getRandomBatch(5, level, this.usedItemIds);

    // Track used items to avoid repeating them in subsequent rounds
    this.usedItemIds.push(...this.currentBatch.map((i) => i.id));
    if (this.usedItemIds.length > 40) {
      this.usedItemIds = this.usedItemIds.slice(-20);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
    this.lastItemIndex = -1;
  }

  getCurrentItem(): CalqueItem {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return CALQUE_BANK[0];
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
    const mastery = AdaptiveEngine.getMastery(profileId, 'englezisme');

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
          <img src="/art/stations/vanatorul_englezisme.jpg" alt="Vânătorul de Englezisme" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Vânătorul de Englezisme 🦅</h2>
          <p>Găsește expresia românească adevărată și scapă de capcana din engleză!</p>
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

        <!-- The English Trap Context -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 22px 20px; text-align: center; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.06);">
          <div style="font-size: 32px; margin-bottom: 6px;">${item.icon}</div>
          <div style="font-size: 16px; color: var(--walnut); margin-bottom: 8px; font-weight: 600;">
            Situație: <em>${item.promptContext}</em>
          </div>
          <div style="font-size: 14px; color: #8C5B3F; margin-bottom: 12px;">
            🇬🇧 Cum gândește engleza: <strong>"${item.englishOriginal}"</strong>
          </div>
          <div style="font-size: 20px; font-weight: bold; color: var(--gen-feminin); background: rgba(178, 58, 46, 0.08); display: inline-block; padding: 8px 22px; border-radius: 8px; border: 1.5px dashed var(--gen-feminin);">
            Capcana mot-à-mot: „${item.calqueSaid}” ❌
          </div>
        </div>

        <!-- 3 Choice Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="choicesContainer">
          ${this.currentOptions
            .map(
              (opt) => `
            <button class="calque-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 16px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s, background 0.15s;">
              <span>${opt}</span>
              <span style="font-size: 18px; opacity: 0.5;">👉</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Podul Englez (Sfatul Mioriței) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>De ce se întâmplă asta? </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Container -->
        <div class="progress-container">
          <span>Englezisme vânate (Runda ${this.roundCount}): ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
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
    currentLevel: CalqueDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/vanatorul_englezisme.jpg" alt="Vânătorul de Englezisme" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">🦅 🎉 🏹</div>
          <h3>Vânătoare Încheiată cu Succes!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai ochit și corectat toate cele 5 capcane din engleză din această rundă!
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
              🦅 Rond Nou (Alte 5 Englezisme) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Această Vânătoare
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
        prompt: `Runda ${this.roundCount} a început! 5 capcane noi te provoacă.`,
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
    const buttons = container.querySelectorAll('.calque-choice-btn');
    const tierPills = container.querySelectorAll('.tier-pill');

    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as CalqueDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'englezisme', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong> pentru Vânătorul de Englezisme!`,
            score: this.score,
          });
        }
      });
    });

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        this.handleAttempt(choice || '', btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedChoice: string, btnElement: HTMLElement) {
    const item = this.getCurrentItem();
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (selectedChoice.includes(item.authenticRom) || item.authenticRom.includes(selectedChoice)) {
      // SUCCESS!
      sound.playBrassBell();
      btnElement.style.background = 'var(--gen-neutru-bg)';
      btnElement.style.borderColor = 'var(--gen-neutru)';
      btnElement.style.color = 'var(--gen-neutru)';
      btnElement.classList.add('pop-success');

      this.score += 20;

      const result = AdaptiveEngine.recordAttempt(profileId, 'englezisme', true);

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>Nivel Nou la Vânătoare!</strong> ${profile.name}, ai avansat la <strong>${nextTier.badge}</strong>! Zicem curat românește: <strong>${item.authenticRom}</strong>!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Excelent, ${profile.name}! Zicem: <strong>${item.authenticRom}</strong>! Ai ochit englezismul!`,
          score: this.score,
        });
      }

      this.speak(item.authenticRom);

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
      btnElement.classList.add('shake');
      setTimeout(() => btnElement.classList.remove('shake'), 450);

      const result = AdaptiveEngine.recordAttempt(profileId, 'englezisme', false);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Atenție! ${item.hint} Miorița te ajută: coborâm la nivelul <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Atenție! ${item.hint}`,
          score: this.score,
        });
      }
    }
  }
}
