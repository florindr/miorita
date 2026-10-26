// src/stations/moaraCuArticole.ts — Station 4: Moara cu Articole (Category ART)
// Targets postposed definite articles (-ul, -le, -a, -ea) and the tricky preposition rule
// (e.g. "pe masă" vs "pe masa mare", "în clasă" vs "în clasa mea").

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';

export interface ArticleItem {
  id: string;
  bareWord: string;          // "câine"
  promptContext: string;     // "Am văzut..."
  correctArticle: string;    // "-le"
  articledWord: string;      // "câinele"
  options: string[];         // ["-le", "-ul", "-a", "fără articol"]
  hint: string;              // "Câine se termină în «e», așa că la hotărât primește «-le»: câinele!"
  englishBridge: string;     // "In English 'the' is a separate word in front ('the dog'). In Romanian, it glues to the end: câine + le = câinele."
  isPrepositionTrap?: boolean;
}

export const ARTICLE_ITEMS: ArticleItem[] = [
  {
    id: 'ART-01',
    bareWord: 'câine',
    promptContext: 'Am ieșit în parc și am văzut...',
    correctArticle: '-le',
    articledWord: 'câinele',
    options: ['-le', '-ul', '-a', '-ua'],
    hint: 'Câine se termină în «e». Articolul lui este «-le»: câinele!',
    englishBridge: 'English puts "the" first ("the dog"). Romanian sticks it to the back: câinele.'
  },
  {
    id: 'ART-02',
    bareWord: 'băiat',
    promptContext: 'Unde a plecat...',
    correctArticle: '-ul',
    articledWord: 'băiatul',
    options: ['-ul', '-le', '-a', '-l'],
    hint: 'Băiat se termină în consoană. Adăugăm «-ul»: băiatul!',
    englishBridge: 'Masculine consonant words take -ul: băiatul (the boy).'
  },
  {
    id: 'ART-03',
    bareWord: 'carte',
    promptContext: 'Am deschis...',
    correctArticle: '-a',
    articledWord: 'cartea',
    options: ['-a', '-ul', '-le', '-ea'],
    hint: 'O carte devine „cartea”! Se aude un «a» limpede la sfârșit!',
    englishBridge: 'Feminine words ending in -e change to -ea: carte -> cartea.'
  },
  {
    id: 'ART-04',
    bareWord: 'masă',
    promptContext: 'Punem farfuria pe...',
    correctArticle: 'masă (fără articol)',
    articledWord: 'pe masă',
    options: ['masă (fără articol)', 'masa (cu articol)'],
    hint: 'Capcană englezească! După „pe”, dacă nu e un adjectiv, nu punem articol: „pe masă”!',
    englishBridge: 'English says "on the table". But Romanian says "pe masă" (no article after simple prepositions like pe, în, la) unless an adjective follows ("pe masa mare").',
    isPrepositionTrap: true
  },
  {
    id: 'ART-05',
    bareWord: 'casă',
    promptContext: 'Mergem în...',
    correctArticle: 'casă (fără articol)',
    articledWord: 'în casă',
    options: ['casă (fără articol)', 'casa (cu articol)'],
    hint: 'După „în”, spunem simplu „în casă” (nu „în casa”)!',
    englishBridge: 'English says "into the house". Romanian says "în casă" without the definite article.',
    isPrepositionTrap: true
  }
];

export class MoaraCuArticoleStation {
  private currentIndex = 0;
  private score = 0;
  private currentOptions: string[] = [];
  private lastQuestionIndex = -1;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): ArticleItem {
    return ARTICLE_ITEMS[this.currentIndex % ARTICLE_ITEMS.length];
  }

  speak(text: string) {
    sound.playWoodenTap();
    sound.speakRomanian(text);
  }

  render(container: HTMLElement) {
    const item = this.getCurrentItem();
    if (this.lastQuestionIndex !== this.currentIndex) {
      this.currentOptions = shuffleArray(item.options);
      this.lastQuestionIndex = this.currentIndex;
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

        <!-- Animated Water Mill Visual -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center; position: relative;">
          <div style="font-size: 36px; margin-bottom: 8px;">⚙️🌾</div>
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 6px;">
            ${item.promptContext}
          </div>
          <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 12px 28px; box-shadow: var(--soft-shadow);">
            <span style="font-family: var(--font-serif); font-size: 28px; font-weight: bold; color: var(--ink-charcoal);">
              ${item.bareWord}
            </span>
            <span id="articleSlot" style="background: var(--linen-pure); border: 2px dashed var(--walnut); border-radius: 6px; padding: 4px 12px; font-family: var(--font-serif); font-size: 24px; color: var(--gen-feminin); min-width: 44px;">
              ?
            </span>
          </div>
        </div>

        <!-- Article Chute Options -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;" id="articleOptions">
          ${this.currentOptions.map(opt => `
            <button class="article-chute-btn" data-art="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 16px 28px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 50px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s;">
              ${opt}
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula Morarului: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Cuvinte măcinate: ${this.currentIndex + 1} / ${ARTICLE_ITEMS.length}</span>
          <div class="progress-dots">
            ${ARTICLE_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.article-chute-btn');
    const slot = container.querySelector('#articleSlot') as HTMLElement;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-art');
        this.handleAttempt(selected || '', slot, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedArt: string, slot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedArt === item.correctArticle) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      btn.style.color = 'var(--gen-neutru)';
      slot.textContent = selectedArt === 'masă (fără articol)' || selectedArt === 'casă (fără articol)' ? '✓' : selectedArt;
      slot.style.background = 'var(--gen-neutru)';
      slot.style.color = '#FFF';

      this.score += 15;

      this.onStateChange({
        prompt: `Foarte bine! Zicem: <strong>${item.articledWord}</strong>! Moara a măcinat cuvântul perfect!`,
        score: this.score
      });

      this.speak(item.articledWord);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % ARTICLE_ITEMS.length;
        const root = document.querySelector('#stationRoot') as HTMLElement;
        if (root) this.render(root);
      }, 1000);
    } else {
      // Socratic Nudge
      sound.playGentleNudge();
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 450);

      this.onStateChange({
        prompt: `Aproape! ${item.hint}`,
        score: this.score
      });
    }
  }
}
