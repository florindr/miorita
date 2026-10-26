// src/stations/gradinaCuGenuri.ts — Station 1: Grădina cu Genuri (Category GEN)
// Teaches the famous Romanian "un/doi, o/două, un/două" counting test.
// Tackles Tudor's interference error: "un casă" -> "o casă".

import { sound } from '../audio/synth';

export interface GenderWord {
  singular: string;
  plural: string;
  gender: 'masculin' | 'feminin' | 'neutru';
  hint: string;
  englishBridge: string;
}

export const SEED_WORDS: GenderWord[] = [
  {
    singular: 'casă',
    plural: 'două case',
    gender: 'feminin',
    hint: 'Zicem „o casă, două case”. Ascultă cum se potrivește!',
    englishBridge: 'English uses "a house". Romanian treats houses as feminine: o casă (never un casă).'
  },
  {
    singular: 'tren',
    plural: 'două trenuri',
    gender: 'neutru',
    hint: 'Numărăm: „un tren” (ca un băiat), dar la plural „două trenuri” (ca fetele)! E neutru!',
    englishBridge: 'Neuter nouns act masculine in singular (un tren) and feminine in plural (două trenuri).'
  },
  {
    singular: 'câine',
    plural: 'doi câini',
    gender: 'masculin',
    hint: 'Numărăm: „un câine, doi câini”. Băiețesc!',
    englishBridge: 'Living male animals are masculine: un câine, doi câini.'
  },
  {
    singular: 'scaun',
    plural: 'două scaune',
    gender: 'neutru',
    hint: 'Numărăm: „un scaun, două scaune”. Înainte e un, apoi două!',
    englishBridge: 'Furniture is often neuter: un scaun, două scaune.'
  },
  {
    singular: 'carte',
    plural: 'două cărți',
    gender: 'feminin',
    hint: 'Numărăm: „o carte, două cărți”. Fetițesc!',
    englishBridge: 'Books are feminine in Romanian: o carte, două cărți.'
  },
  {
    singular: 'pom',
    plural: 'doi pomi',
    gender: 'masculin',
    hint: 'Numărăm: „un pom, doi pomi”. Rămâne masculin!',
    englishBridge: 'Trees in Romanian are masculine: un pom, doi pomi.'
  }
];

export class GradinaCuGenuriStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentWord(): GenderWord {
    return SEED_WORDS[this.currentIndex % SEED_WORDS.length];
  }

  speak(text: string) {
    sound.playWoodenTap();
    sound.speakRomanian(text);
  }


  render(container: HTMLElement) {
    const word = this.getCurrentWord();

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/gradina_genuri.jpg" alt="Grădina cu Genuri" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Grădina cu Genuri 🧺</h2>
          <p>Trage cuvântul în coșul potrivit, sau apasă pe coș!</p>
        </div>

        <div class="active-word-stage">
          <div class="word-card" id="activeWordCard" draggable="true">
            <span>🌱</span>
            <span class="word-text">${word.singular}</span>
            <button class="btn-audio" id="btnWordAudio" title="Ascultă cuvântul" aria-label="Ascultă cuvântul">🔊</button>
          </div>
        </div>

        <div class="baskets-grid">
          <!-- Coș Masculin (Voroneț Blue) -->
          <div class="basket masculin" data-gender="masculin" role="button" tabindex="0">
            <span style="font-size: 28px;">🫐</span>
            <span class="basket-title">Masculin</span>
            <span class="basket-rule">un ... / doi ...</span>
            <span class="basket-cue">ex: un băiat, doi băieți</span>
          </div>

          <!-- Coș Feminin (Ie Red) -->
          <div class="basket feminin" data-gender="feminin" role="button" tabindex="0">
            <span style="font-size: 28px;">🍎</span>
            <span class="basket-title">Feminin</span>
            <span class="basket-rule">o ... / două ...</span>
            <span class="basket-cue">ex: o fată, două fete</span>
          </div>

          <!-- Coș Neutru (Carpathian Sage Green) -->
          <div class="basket neutru" data-gender="neutru" role="button" tabindex="0">
            <span style="font-size: 28px;">🍃</span>
            <span class="basket-title">Neutru</span>
            <span class="basket-rule">un ... / două ...</span>
            <span class="basket-cue">ex: un creion, două creioane</span>
          </div>
        </div>

        <!-- Podul Englez (Contrastive Learning) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Sfatul lui Miorița: </strong>
            <span id="bridgeText">${word.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Progres rond: ${this.currentIndex + 1} / ${SEED_WORDS.length}</span>
          <div class="progress-dots">
            ${SEED_WORDS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const wordCard = container.querySelector('#activeWordCard') as HTMLElement;
    const btnAudio = container.querySelector('#btnWordAudio') as HTMLButtonElement;
    const baskets = container.querySelectorAll('.basket');

    // Audio click
    btnAudio?.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = this.getCurrentWord();
      this.speak(word.singular);
    });

    // Touch/click drag-and-drop setup
    wordCard?.addEventListener('dragstart', (e) => {
      sound.playWoodenTap();
      e.dataTransfer?.setData('text/plain', this.getCurrentWord().gender);
    });

    baskets.forEach((basket) => {
      const targetGender = basket.getAttribute('data-gender');

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
        this.handleAttempt(targetGender as any, wordCard);
      });

      // Direct tap support for tablets
      basket.addEventListener('click', () => {
        this.handleAttempt(targetGender as any, wordCard);
      });
    });
  }

  private handleAttempt(selectedGender: 'masculin' | 'feminin' | 'neutru', wordCard: HTMLElement) {
    const word = this.getCurrentWord();

    if (selectedGender === word.gender) {
      // SUCCESS!
      sound.playBrassBell();
      wordCard.classList.add('pop-success');
      this.score += 10;

      const ruleSpoken = word.gender === 'feminin' ? `o ${word.singular}, ${word.plural}` :
                         word.gender === 'masculin' ? `un ${word.singular}, ${word.plural}` :
                         `un ${word.singular}, ${word.plural}`;

      this.onStateChange({
        prompt: `Foarte bine! Zicem: <strong>${ruleSpoken}</strong>. Coșul ${word.gender} e mândru de tine!`,
        score: this.score
      });

      this.speak(ruleSpoken);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % SEED_WORDS.length;
        const appMain = document.querySelector('#stationRoot') as HTMLElement;
        if (appMain) {
          this.render(appMain);
        }
      }, 900);
    } else {
      // GENTLE Socratic NUDGE (Zero negative buzzers)
      sound.playGentleNudge();
      wordCard.classList.add('shake');
      setTimeout(() => wordCard.classList.remove('shake'), 450);

      this.onStateChange({
        prompt: `Aproape! ${word.hint} Încearcă din nou!`,
        score: this.score
      });
    }
  }
}
