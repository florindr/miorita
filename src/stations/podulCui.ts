// src/stations/podulCui.ts — Station 2: Podul „A cui? Cui?” (Category CAS)
// Dynamic Romanian Case Bank & Dynamic Difficulty Adjustment (DDA) Engine
// Directly tackles Tudor's English-interference habit: using "la" ("casa la bunica")
// instead of Genitive/Dative inflection ("casa bunicii", "mingea băiatului").
// Mechanic: Snap the wooden tile ending onto the bridge plank so Miorița can cross to Bunica's cottage!

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';
import {
  CaseItem,
  CaseService,
  CASE_BANK,
  CaseDifficulty,
} from '../content/caseBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

// Backward-compatibility export
export const CASE_ITEMS: CaseItem[] = CASE_BANK.slice(0, 5);

export class PodulCuiStation {
  private currentBatch: CaseItem[] = [];
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

  private getCurrentLevel(): CaseDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'cui').currentLevel as CaseDifficulty;
  }

  /** Initialize a fresh random batch of 5 planks calibrated to current difficulty */
  private initBatch(forcedLevel?: CaseDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = CaseService.getRandomBatch(5, level, this.usedItemIds);

    // Track used items to avoid repeating them in subsequent rounds
    this.usedItemIds.push(...this.currentBatch.map((i) => i.id));
    if (this.usedItemIds.length > 40) {
      this.usedItemIds = this.usedItemIds.slice(-20);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
    this.lastItemIndex = -1;
  }

  getCurrentItem(): CaseItem {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return CASE_BANK[0];
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
    const mastery = AdaptiveEngine.getMastery(profileId, 'cui');

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
          <img src="/art/stations/podul_cui.jpg" alt="Podul A cui? Cui?" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Podul „A cui? Cui?” 🪵</h2>
          <p>Pune scândura potrivită la pod ca Miorița să ajungă la căsuța Bunicii!</p>
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

        <!-- The Broken Wooden Bridge Graphic -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 22px 20px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.06);">
          <div style="font-size: 14px; color: var(--walnut); margin-bottom: 8px;">
            ⚠️ Cum zice engleza: <del style="color: var(--gen-feminin); font-weight:700;">${item.englishShape}</del>
          </div>
          <div style="font-family: var(--font-serif); font-size: 26px; font-weight: bold; color: var(--ink-charcoal);">
            ${item.promptSentence}
          </div>

          <!-- Bridge Plank Fitting Area -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: 18px;">
            <div style="background: var(--walnut); color: #FFF; padding: 12px 24px; border-radius: 8px 0 0 8px; font-size: 24px; font-weight: bold; font-family: var(--font-serif); display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 26px;">${item.icon}</span>
              <span>${item.stem}</span>
            </div>
            <div id="plankDropZone" style="border: 2.5px dashed var(--walnut); background: rgba(255,255,255,0.85); min-width: 95px; height: 53px; border-radius: 0 8px 8px 0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; font-family: var(--font-serif); color: var(--gen-neutru); transition: all 0.2s ease;">
              ?
            </div>
          </div>
        </div>

        <!-- Option Tiles (Scânduri de lemn) -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;" id="tilesContainer">
          ${this.currentOptions
            .map(
              (opt) => `
            <button class="plank-tile" data-ending="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: 8px; padding: 14px 28px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 52px; box-shadow: 0 4px 10px rgba(43, 38, 34, 0.08); transition: transform 0.15s, background 0.15s;">
              ${opt}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Podul Englez (Contrastive Learning & Sfatul Mioriței) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Sfatul lui Miorița: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Container -->
        <div class="progress-container">
          <span>Scânduri reparate (Runda ${this.roundCount}): ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
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
    currentLevel: CaseDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/podul_cui.jpg" alt="Podul A cui? Cui?" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">🪵 🎉 🐑</div>
          <h3>Podul a Fost Reparat cu Bravură!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai fixat toate cele 5 scânduri la pod, iar Miorița a trecut cu bine pârâul spre căsuța Bunicii!
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
              🪵 Pod Nou (Alte 5 Scânduri) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Acest Pod
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
        prompt: `Runda ${this.roundCount} a început! 5 scânduri noi trebuie potrivite la pod.`,
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
    const tiles = container.querySelectorAll('.plank-tile');
    const dropZone = container.querySelector('#plankDropZone') as HTMLElement;
    const tierPills = container.querySelectorAll('.tier-pill');

    // Tier pills manual selection
    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as CaseDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'cui', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong> pentru Podul Cui! Scândurile s-au adaptat.`,
            score: this.score,
          });
        }
      });
    });

    // Option tiles click
    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const ending = tile.getAttribute('data-ending');
        this.handleAttempt(ending || '', dropZone, tile as HTMLButtonElement);
      });
    });
  }

  private handleAttempt(selectedEnding: string, dropZone: HTMLElement, tile: HTMLButtonElement) {
    const item = this.getCurrentItem();
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (selectedEnding === item.correctEnding) {
      // SUCCESS!
      sound.playBrassBell();
      tile.style.background = 'var(--gen-neutru)';
      tile.style.color = '#FFF';
      tile.style.borderColor = 'var(--gen-neutru)';

      dropZone.textContent = selectedEnding;
      dropZone.style.background = 'var(--gen-neutru)';
      dropZone.style.color = '#FFF';
      dropZone.style.borderStyle = 'solid';

      this.score += 15;
      const fullPhrase = item.correctAnswer;

      const result = AdaptiveEngine.recordAttempt(profileId, 'cui', true);

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>URA! Nivel Nou la Pod!</strong> ${profile.name}, ai avansat la <strong>${nextTier.badge}</strong>! Zicem: <strong>${fullPhrase}</strong>!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Minunat! Zicem: <strong>${fullPhrase}</strong> (niciodată „${item.englishShape}”)! Podul ține!`,
          score: this.score,
        });
      }

      this.speak(fullPhrase);

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
      dropZone.textContent = selectedEnding;
      dropZone.style.color = 'var(--gen-feminin)';
      dropZone.classList.add('shake');

      const result = AdaptiveEngine.recordAttempt(profileId, 'cui', false);

      setTimeout(() => {
        dropZone.classList.remove('shake');
        dropZone.textContent = '?';
        dropZone.style.color = 'var(--gen-neutru)';
      }, 500);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Aproape! ${item.hint} Miorița te ajută: coborâm la nivelul <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Aproape! ${item.hint} Încearcă altă scândură!`,
          score: this.score,
        });
      }
    }
  }
}
