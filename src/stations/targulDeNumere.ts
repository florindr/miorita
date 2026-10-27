// src/stations/targulDeNumere.ts — Station 7: Târgul de Numere (Category NUM)
// Dynamic Romanian Number Bank & Dynamic Difficulty Adjustment (DDA) Engine
// Targets:
// 1. Numbers >= 20 require "de" (douăzeci de mere), whereas 1-19 take no preposition (nouăsprezece mere).
// 2. Gender of numerals (doi/două, doisprezece/douăsprezece).
// 3. Ordinal numerals (primul/prima, al doilea/a doua).

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';
import {
  NumberItem,
  NumberService,
  NUMBER_BANK,
  NumberDifficulty,
} from '../content/numberBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

// Backward-compatibility export
export const NUMBER_ITEMS: NumberItem[] = NUMBER_BANK.slice(0, 4);

export class TargulDeNumereStation {
  private currentBatch: NumberItem[] = [];
  private currentIndex = 0;
  private usedItemIds: string[] = [];
  private score = 0;
  private roundCount = 1;
  private isRoundComplete = false;
  private containerElement: HTMLElement | null = null;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
    this.initBatch();
  }

  private getActiveProfileId(): string {
    return FamilyAuth.getActiveProfile().id;
  }

  private getCurrentLevel(): NumberDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'numere').currentLevel as NumberDifficulty;
  }

  /** Initialize a fresh random batch of 5 items calibrated to current difficulty */
  private initBatch(forcedLevel?: NumberDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = NumberService.getRandomBatch(5, level, this.usedItemIds);

    // Track used items to avoid repeating them in subsequent rounds
    this.usedItemIds.push(...this.currentBatch.map((i) => i.id));
    if (this.usedItemIds.length > 40) {
      this.usedItemIds = this.usedItemIds.slice(-20);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
  }

  getCurrentItem(): NumberItem {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return NUMBER_BANK[0];
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
    const mastery = AdaptiveEngine.getMastery(profileId, 'numere');

    if (this.isRoundComplete) {
      this.renderRoundComplete(container, profile.name, mastery.currentLevel, mastery.streak);
      return;
    }

    const item = this.getCurrentItem();
    const isDeMode = item.category === 'de_rule';
    const shuffledOptions = shuffleArray(item.options);

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/targul_numere.jpg" alt="Târgul de Numere" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Târgul de Numere ⚖️🍎</h2>
          <p>Potrivește cantitatea pe cântar ca un negustor iscusit!</p>
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

        <!-- Market Scale Visual -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.06);">
          <div style="font-size: 38px; margin-bottom: 6px;">⚖️🧺</div>
          <div style="font-size: 16px; color: var(--walnut); margin-bottom: 12px; font-weight: 600;">
            La tarabă ceri:
          </div>

          <div style="display: inline-flex; align-items: center; gap: 10px; background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 14px 28px; box-shadow: var(--soft-shadow); font-family: var(--font-serif); font-size: 26px; font-weight: bold; flex-wrap: wrap; justify-content: center;">
            <span style="font-size: 28px;">${item.icon}</span>
            <span style="color: var(--walnut);">${item.numberDisplay}</span>
            ${
              isDeMode
                ? `<span id="numSlot" style="background: var(--linen-pure); border: 2.5px dashed var(--walnut); border-radius: 6px; padding: 4px 16px; color: var(--gen-feminin); min-width: 60px; text-align: center; transition: all 0.2s ease;">
                    ... ? ...
                   </span>`
                : `<span style="color: #8C5B3F;">➔</span>`
            }
            <span style="color: var(--ink-charcoal);">${item.noun}</span>
          </div>
        </div>

        <!-- Choice Buttons -->
        <div style="display: grid; grid-template-columns: ${isDeMode ? '1fr 1fr' : 'repeat(auto-fit, minmax(220px, 1fr))'}; gap: 16px;" id="numChoices">
          ${
            isDeMode
              ? `
                <button class="num-choice-btn" data-choice="de" style="background: #FFF; border: 2.5px solid var(--gen-neutru); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--gen-neutru); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: var(--soft-shadow); min-height: 52px; transition: transform 0.15s, background 0.15s;">
                  <span>⚖️ Pune „DE”</span>
                  <span style="font-size: 13px; font-weight: normal; opacity: 0.85;">(pentru 20, 30, 100...)</span>
                </button>

                <button class="num-choice-btn" data-choice="node" style="background: #FFF; border: 2.5px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--gen-masculin); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: var(--soft-shadow); min-height: 52px; transition: transform 0.15s, background 0.15s;">
                  <span>🚫 Fără „DE”</span>
                  <span style="font-size: 13px; font-weight: normal; opacity: 0.85;">(pentru 1 până la 19)</span>
                </button>
              `
              : shuffledOptions
                  .map(
                    (opt) => `
                <button class="num-option-btn" data-phrase="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 16px 22px; font-family: var(--font-serif); font-size: 20px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--soft-shadow); min-height: 52px; transition: transform 0.15s, border-color 0.15s, background 0.15s;">
                  ${opt}
                </button>
              `
                  )
                  .join('')
          }
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula de la Târg: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Container -->
        <div class="progress-container">
          <span>Produse cântărite (Târgul ${this.roundCount}): ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
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
    currentLevel: NumberDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/targul_numere.jpg" alt="Târgul de Numere" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">⚖️ 🎉 🍎</div>
          <h3>Cântărire Încheiată cu Bravură!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai cântărit și numărat corect toate cele 5 comenzi de la Târgul de Numere!
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
              ⚖️ Târg Nou (Alte 5 Cântăriri) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Acest Târg
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
        prompt: `Târgul ${this.roundCount} s-a deschis! 5 produse noi te așteaptă la cântar.`,
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
    const tierPills = container.querySelectorAll('.tier-pill');
    const deButtons = container.querySelectorAll('.num-choice-btn');
    const optionButtons = container.querySelectorAll('.num-option-btn');
    const slot = container.querySelector('#numSlot') as HTMLElement;

    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as NumberDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'numere', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong> pentru Târgul de Numere!`,
            score: this.score,
          });
        }
      });
    });

    deButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isDe = btn.getAttribute('data-choice') === 'de';
        this.handleDeAttempt(isDe, slot, btn as HTMLElement);
      });
    });

    optionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const phrase = btn.getAttribute('data-phrase');
        this.handlePhraseAttempt(phrase || '', btn as HTMLElement);
      });
    });
  }

  private handleDeAttempt(selectedDe: boolean, slot: HTMLElement | null, btn: HTMLElement) {
    const item = this.getCurrentItem();
    const isCorrect = selectedDe === item.needsDe;

    this.processOutcome(isCorrect, item.correctPhrase, item.hint, btn, () => {
      if (slot) {
        slot.textContent = item.needsDe ? 'DE' : '—';
        slot.style.background = 'var(--gen-neutru)';
        slot.style.color = '#FFF';
        slot.style.borderStyle = 'solid';
      }
    });
  }

  private handlePhraseAttempt(selectedPhrase: string, btn: HTMLElement) {
    const item = this.getCurrentItem();
    const isCorrect = selectedPhrase === item.correctPhrase;

    this.processOutcome(isCorrect, item.correctPhrase, item.hint, btn);
  }

  private processOutcome(
    isCorrect: boolean,
    correctPhrase: string,
    hint: string,
    btn: HTMLElement,
    onSuccessVisual?: () => void
  ) {
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (isCorrect) {
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      btn.style.color = 'var(--gen-neutru)';
      if (onSuccessVisual) onSuccessVisual();

      this.score += 15;

      const result = AdaptiveEngine.recordAttempt(profileId, 'numere', true);

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>Nivel Nou la Târg!</strong> ${profile.name}, ai promovat la <strong>${nextTier.badge}</strong>! Zicem: <strong>${correctPhrase}</strong>!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Foarte bine! Zicem: <strong>${correctPhrase}</strong>! Cântarul este perfect echilibrat!`,
          score: this.score,
        });
      }

      this.speak(correctPhrase);

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
      sound.playGentleNudge();
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 450);

      const result = AdaptiveEngine.recordAttempt(profileId, 'numere', false);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Aproape! ${hint} Miorița te ajută: coborâm la nivelul <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Aproape! ${hint} Încearcă din nou!`,
          score: this.score,
        });
      }
    }
  }
}
