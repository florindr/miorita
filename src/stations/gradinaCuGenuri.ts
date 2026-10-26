// src/stations/gradinaCuGenuri.ts — Station 1: Grădina cu Genuri (Category GEN)
// Dynamic Romanian Vocabulary Dictionary & Dynamic Difficulty Adjustment (DDA) Engine
// Teaches the famous Romanian "un/doi, o/două, un/două" counting test.
// Tackles Tudor's interference error: "un casă" -> "o casă".

import { sound } from '../audio/synth';
import {
  DictionaryService,
  DictionaryEntry,
  WordDifficulty,
  WordGender,
  ROMANIAN_DICTIONARY,
} from '../content/dictionary';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

export interface GenderWord {
  singular: string;
  plural: string;
  gender: 'masculin' | 'feminin' | 'neutru';
  hint: string;
  englishBridge: string;
}

// Backward-compatibility export
export const SEED_WORDS: GenderWord[] = ROMANIAN_DICTIONARY.slice(0, 6).map((e) => ({
  singular: e.word,
  plural: `două ${e.plural}`,
  gender: e.gender,
  hint: e.hint,
  englishBridge: e.englishBridge,
}));

export class GradinaCuGenuriStation {
  private currentBatch: DictionaryEntry[] = [];
  private currentIndex = 0;
  private usedWordIds: string[] = [];
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

  private getCurrentLevel(): WordDifficulty {
    const profileId = this.getActiveProfileId();
    return AdaptiveEngine.getMastery(profileId, 'genuri').currentLevel;
  }

  /** Initialize a fresh random batch of 6 words calibrated to current difficulty */
  private initBatch(forcedLevel?: WordDifficulty) {
    const level = forcedLevel ?? this.getCurrentLevel();
    this.currentBatch = DictionaryService.getRandomBatch(6, level, this.usedWordIds);

    // Keep track of used words to avoid repeating them in subsequent rounds
    this.usedWordIds.push(...this.currentBatch.map((w) => w.id));
    if (this.usedWordIds.length > 50) {
      this.usedWordIds = this.usedWordIds.slice(-30);
    }

    this.currentIndex = 0;
    this.isRoundComplete = false;
  }

  getCurrentWord(): DictionaryEntry {
    if (!this.currentBatch.length || this.currentIndex >= this.currentBatch.length) {
      return ROMANIAN_DICTIONARY[0];
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
    const mastery = AdaptiveEngine.getMastery(profileId, 'genuri');

    if (this.isRoundComplete) {
      this.renderRoundComplete(container, profile.name, mastery.currentLevel, mastery.streak);
      return;
    }

    const word = this.getCurrentWord();

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/gradina_genuri.jpg" alt="Grădina cu Genuri" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="station-header">
          <h2>Grădina cu Genuri 🧺</h2>
          <p>Trage cuvântul în coșul potrivit, sau apasă direct pe coș!</p>
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

        <!-- Active Word Card to Sort -->
        <div class="active-word-stage">
          <div class="word-card" id="activeWordCard" draggable="true" role="button" tabindex="0">
            <div class="word-card-inner">
              <div class="word-card-primary">
                <span style="font-size: 32px;">${word.icon}</span>
                <span class="word-text">${word.word}</span>
                <button class="btn-audio" id="btnWordAudio" title="Ascultă cuvântul „${word.word}”" aria-label="Ascultă cuvântul">🔊</button>
              </div>
              <span class="word-english-hint">🇬🇧 ${word.english}</span>
            </div>
          </div>
        </div>

        <!-- Drop Target Baskets (Masculin, Feminin, Neutru) -->
        <div class="baskets-grid">
          <!-- Coș Masculin (Voroneț Blue) -->
          <div class="basket masculin" data-gender="masculin" role="button" tabindex="0" aria-label="Coș Masculin: un / doi">
            <span style="font-size: 32px;">🫐</span>
            <span class="basket-title">Masculin</span>
            <span class="basket-rule">un ... / doi ...</span>
            <span class="basket-cue">ex: un băiat, doi băieți</span>
          </div>

          <!-- Coș Feminin (Ie Red) -->
          <div class="basket feminin" data-gender="feminin" role="button" tabindex="0" aria-label="Coș Feminin: o / două">
            <span style="font-size: 32px;">🍎</span>
            <span class="basket-title">Feminin</span>
            <span class="basket-rule">o ... / două ...</span>
            <span class="basket-cue">ex: o fată, două fete</span>
          </div>

          <!-- Coș Neutru (Carpathian Sage Green) -->
          <div class="basket neutru" data-gender="neutru" role="button" tabindex="0" aria-label="Coș Neutru: un / două">
            <span style="font-size: 32px;">🍃</span>
            <span class="basket-title">Neutru</span>
            <span class="basket-rule">un ... / două ...</span>
            <span class="basket-cue">ex: un creion, două creioane</span>
          </div>
        </div>

        <!-- Podul Englez (Contrastive Learning & Sfatul Mioriței) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Sfatul lui Miorița: </strong>
            <span id="bridgeText">${word.englishBridge}</span>
          </div>
        </div>

        <!-- Progress Woven Band -->
        <div class="progress-container">
          <span>Progres rond ${this.roundCount}: ${this.currentIndex + 1} / ${this.currentBatch.length}</span>
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
    currentLevel: WordDifficulty,
    streak: number
  ) {
    const tierMeta = TIER_METAS[currentLevel];

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/gradina_genuri.jpg" alt="Grădina cu Genuri" onerror="this.parentElement.style.display='none';"/>
        </div>

        <div class="round-complete-stage">
          <div class="round-complete-icon">🧺 🎉</div>
          <h3>Rond Încheiat cu Bravură!</h3>
          <p>
            Bravo, <strong>${childName}</strong>! Ai cules și potrivit toate cele 6 cuvinte din acest rond din Grădina cu Genuri.
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
              🌱 Rond Nou (Alte 6 Cuvinte) ➔
            </button>
            <button id="btnReplayRound" class="btn-round-replay">
              🔄 Reia Acest Rond
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
        prompt: `Rondul ${this.roundCount} a început! 6 cuvinte noi te așteaptă în coșuri.`,
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
    const wordCard = container.querySelector('#activeWordCard') as HTMLElement;
    const btnAudio = container.querySelector('#btnWordAudio') as HTMLButtonElement;
    const baskets = container.querySelectorAll('.basket');
    const tierPills = container.querySelectorAll('.tier-pill');

    // Tier buttons
    tierPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const lvl = Number(pill.getAttribute('data-level')) as WordDifficulty;
        if (lvl && [1, 2, 3].includes(lvl)) {
          sound.playWoodenTap();
          AdaptiveEngine.setLevel(this.getActiveProfileId(), 'genuri', lvl);
          this.initBatch(lvl);
          this.render(container);
          this.onStateChange({
            prompt: `Ai selectat nivelul <strong>${TIER_METAS[lvl].badge}</strong>. Cuvintele s-au adaptat!`,
            score: this.score,
          });
        }
      });
    });

    // Audio click
    btnAudio?.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = this.getCurrentWord();
      this.speak(word.word);
    });

    // Drag-and-drop setup
    wordCard?.addEventListener('dragstart', (e) => {
      sound.playWoodenTap();
      e.dataTransfer?.setData('text/plain', this.getCurrentWord().gender);
    });

    baskets.forEach((basket) => {
      const targetGender = basket.getAttribute('data-gender') as WordGender;

      basket.addEventListener('dragover', (e) => {
        e.preventDefault();
        basket.classList.add('drag-over');
      });

      basket.addEventListener('dragleave', () => {
        basket.classList.remove('drag-over');
      });

      basket.addEventListener('drop', (e) => {
        e.preventDefault();
        basket.classList.remove('drag-over');
        this.handleAttempt(targetGender, wordCard);
      });

      // Direct tap support for tablets & touch devices
      basket.addEventListener('click', () => {
        this.handleAttempt(targetGender, wordCard);
      });
    });
  }

  private handleAttempt(selectedGender: WordGender, wordCard: HTMLElement | null) {
    const word = this.getCurrentWord();
    const profileId = this.getActiveProfileId();
    const profile = FamilyAuth.getActiveProfile();

    if (selectedGender === word.gender) {
      // SUCCESS!
      sound.playBrassBell();
      wordCard?.classList.add('pop-success');
      this.score += 10;

      // Update adaptive difficulty state
      const result = AdaptiveEngine.recordAttempt(profileId, 'genuri', true);

      // Speak counting rule
      const ruleSpoken =
        word.gender === 'feminin'
          ? `o ${word.word}, două ${word.plural}`
          : word.gender === 'masculin'
          ? `un ${word.word}, doi ${word.plural}`
          : `un ${word.word}, două ${word.plural}`;

      if (result.promoted) {
        const nextTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `🎉 <strong>URA! Nivel Nou deblocat!</strong> ${profile.name}, ai promovat la <strong>${nextTier.badge}</strong>! Zicem: <strong>${ruleSpoken}</strong>.`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Foarte bine! Zicem: <strong>${ruleSpoken}</strong>. Coșul ${word.gender} e mândru de tine!`,
          score: this.score,
        });
      }

      this.speak(ruleSpoken);

      setTimeout(() => {
        if (this.currentIndex >= this.currentBatch.length - 1) {
          this.isRoundComplete = true;
        } else {
          this.currentIndex++;
        }

        const appMain = this.containerElement || (document.querySelector('#stationRoot') as HTMLElement);
        if (appMain) {
          this.render(appMain);
        }
      }, 900);
    } else {
      // GENTLE Socratic Nudge (Zero negative buzzers)
      sound.playGentleNudge();
      wordCard?.classList.add('shake');
      setTimeout(() => wordCard?.classList.remove('shake'), 450);

      const result = AdaptiveEngine.recordAttempt(profileId, 'genuri', false);

      if (result.demoted) {
        const currentTier = TIER_METAS[result.currentLevel];
        this.onStateChange({
          prompt: `Aproape! ${word.hint} Miorița te ajută: am coborât puțin pasul la <strong>${currentTier.badge}</strong> ca să prinzi curaj!`,
          score: this.score,
        });
      } else {
        this.onStateChange({
          prompt: `Aproape! ${word.hint} Încearcă din nou!`,
          score: this.score,
        });
      }
    }
  }
}
