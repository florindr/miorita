// src/stations/podulCui.ts — Station 2: Podul „A cui? Cui?” (Category CAS)
// Directly tackles Tudor's English-interference habit: using "la" ("casa la bunica")
// instead of Genitive/Dative inflection ("casa bunicii", "mingea băiatului").
// Mechanic: Snap the wooden tile ending onto the bridge plank so Miorița can cross to Bunica's cottage!

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';

export interface CaseItem {
  id: string;
  englishShape: string;      // e.g. "The grandma's house (Tudor: casa la bunica)"
  promptSentence: string;    // e.g. "Aceasta este casa..."
  stem: string;              // "bunic"
  correctEnding: string;     // "-ii"
  correctAnswer: string;     // "casa bunicii"
  options: string[];         // ["-ii", "-a", "-ului", "-elor"]
  hint: string;              // "Bunica e fată. La fete adăugăm adesea -ii (casa bunicii)!"
  englishBridge: string;     // "English uses 'at/to' or 's (grandma's). Romanian inflects the noun ending: bunica -> bunicii."
}

export const CASE_ITEMS: CaseItem[] = [
  {
    id: 'CAS-01',
    englishShape: 'casa la bunica (grandma\'s house)',
    promptSentence: 'Aceasta este casa...',
    stem: 'bunic',
    correctEnding: '-ii',
    correctAnswer: 'casa bunicii',
    options: ['-ii', '-a', '-ului', '-elor'],
    hint: 'Zicem „casa bunicii”! Nu punem „la”. Bunica se transformă în bunicii!',
    englishBridge: 'In English you say "grandma\'s house". English-dominant kids often say "casa la bunica". Romanian attaches -ii: casa bunicii.'
  },
  {
    id: 'CAS-02',
    englishShape: 'mingea la băiat (the boy\'s ball)',
    promptSentence: 'Aceasta este mingea...',
    stem: 'băiat',
    correctEnding: '-ului',
    correctAnswer: 'mingea băiatului',
    options: ['-ului', '-ei', '-ii', '-ilor'],
    hint: 'Băiatul e băiețel! La băieți se aude „-ului”: mingea băiatului!',
    englishBridge: 'For masculine nouns (băiat), possession ends in -ului (mingea băiatului, never mingea la băiat).'
  },
  {
    id: 'CAS-03',
    englishShape: 'i-am dat la mama (I gave to mum)',
    promptSentence: 'I-am dat o floare...',
    stem: 'mam',
    correctEnding: '-ei',
    correctAnswer: 'i-am dat mamei',
    options: ['-ei', '-a', '-ului', '-ilor'],
    hint: 'Cui i-am dat? Mamei! Mama primește floarea și devine „mamei”!',
    englishBridge: 'Dative case (giving to someone): "mamei", not "la mama".'
  },
  {
    id: 'CAS-04',
    englishShape: 'jucăria la pisică (the cat\'s toy)',
    promptSentence: 'Aceasta este jucăria...',
    stem: 'pisic',
    correctEnding: '-ii',
    correctAnswer: 'jucăria pisicii',
    options: ['-ii', '-ei', '-ului', '-a'],
    hint: 'Pisica devine pisicii! Jucăria pisicii!',
    englishBridge: 'Feminine possession: pisica -> pisicii.'
  },
  {
    id: 'CAS-05',
    englishShape: 'mașina la tata (dad\'s car)',
    promptSentence: 'Ne plimbăm cu mașina...',
    stem: 'tat',
    correctEnding: '-ălui',
    correctAnswer: 'mașina tatălui',
    options: ['-ălui', '-ei', '-ii', '-ilor'],
    hint: 'Tata e domn! Zicem „mașina tatălui”!',
    englishBridge: 'Possession with tata: tatălui.'
  }
];

export class PodulCuiStation {
  private currentIndex = 0;
  private score = 0;
  private currentOptions: string[] = [];
  private lastQuestionIndex = -1;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): CaseItem {
    return CASE_ITEMS[this.currentIndex % CASE_ITEMS.length];
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
          <img src="/art/stations/podul_cui.jpg" alt="Podul A cui? Cui?" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Podul „A cui? Cui?” 🪵</h2>
          <p>Pune scândura potrivită la pod ca Miorița să ajungă la căsuță!</p>
        </div>

        <!-- The Broken Wooden Bridge Graphic -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 20px; text-align: center; position: relative; overflow: hidden;">
          <div style="font-size: 14px; color: var(--walnut); margin-bottom: 8px;">
            ⚠️ Cum zice engleza: <del style="color: var(--gen-feminin); font-weight:600;">${item.englishShape}</del>
          </div>
          <div style="font-family: var(--font-serif); font-size: 26px; font-weight: bold; color: var(--ink-charcoal);">
            ${item.promptSentence}
          </div>

          <!-- Bridge Plank Fitting Area -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: 18px;">
            <div style="background: var(--walnut); color: #FFF; padding: 12px 24px; border-radius: 8px 0 0 8px; font-size: 24px; font-weight: bold; font-family: var(--font-serif);">
              ${item.stem}
            </div>
            <div id="plankDropZone" style="border: 2.5px dashed var(--walnut); background: rgba(255,255,255,0.8); min-width: 90px; height: 53px; border-radius: 0 8px 8px 0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; font-family: var(--font-serif); color: var(--gen-neutru);">
              ?
            </div>
          </div>
        </div>

        <!-- Option Tiles -->
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;" id="tilesContainer">
          ${this.currentOptions.map((opt) => `
            <button class="plank-tile" data-ending="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: 8px; padding: 14px 28px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 48px; box-shadow: 0 4px 8px rgba(0,0,0,0.08); transition: transform 0.15s, background 0.15s;">
              ${opt}
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Capcana englezească: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Scânduri reparate: ${this.currentIndex + 1} / ${CASE_ITEMS.length}</span>
          <div class="progress-dots">
            ${CASE_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const tiles = container.querySelectorAll('.plank-tile');
    const dropZone = container.querySelector('#plankDropZone') as HTMLElement;

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const ending = tile.getAttribute('data-ending');
        this.handleAttempt(ending || '', dropZone);
      });
    });
  }

  private handleAttempt(selectedEnding: string, dropZone: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedEnding === item.correctEnding) {
      // SUCCESS!
      sound.playBrassBell();
      dropZone.textContent = selectedEnding;
      dropZone.style.background = 'var(--gen-neutru)';
      dropZone.style.color = '#FFF';
      dropZone.style.borderStyle = 'solid';

      this.score += 15;
      const fullPhrase = `${item.correctAnswer}`;

      this.onStateChange({
        prompt: `Minunat! Zicem: <strong>${fullPhrase}</strong> (niciodată „${item.englishShape}”)! Podul ține!`,
        score: this.score
      });

      this.speak(fullPhrase);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % CASE_ITEMS.length;
        const root = document.querySelector('#stationRoot') as HTMLElement;
        if (root) this.render(root);
      }, 1000);
    } else {
      // Socratic Nudge
      sound.playGentleNudge();
      dropZone.textContent = selectedEnding;
      dropZone.style.color = 'var(--gen-feminin)';
      dropZone.classList.add('shake');
      setTimeout(() => {
        dropZone.classList.remove('shake');
        dropZone.textContent = '?';
        dropZone.style.color = 'var(--gen-neutru)';
      }, 500);

      this.onStateChange({
        prompt: `Aproape! ${item.hint} Încearcă altă scândură!`,
        score: this.score
      });
    }
  }
}
