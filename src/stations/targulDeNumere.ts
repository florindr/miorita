// src/stations/targulDeNumere.ts — Station 7: Târgul de Numere (Category NUM)
// Targets the Romanian rule where numbers >= 20 require "de" (douăzeci de mere),
// whereas 1-19 take no preposition (nouăsprezece mere).
// English: "twenty apples" (no 'of') -> Tudor: "douăzeci mere" -> Romanian: "douăzeci DE mere".

import { sound } from '../audio/synth';

export interface NumberItem {
  id: string;
  numberWord: string;         // "20 (douăzeci)"
  noun: string;               // "mere"
  needsDe: boolean;           // true
  correctPhrase: string;      // "douăzeci de mere"
  hint: string;               // "De la 20 în sus, româna adaugă mereu «de» la cumpărături: douăzeci DE mere!"
  englishBridge: string;      // "In English you say '20 apples'. In Romanian, any number from 20 onwards takes 'de' ('douăzeci DE mere'). Numbers under 20 don't ('cinci mere')."
}

export const NUMBER_ITEMS: NumberItem[] = [
  {
    id: 'NUM-01',
    numberWord: '20 (douăzeci)',
    noun: 'mere',
    needsDe: true,
    correctPhrase: 'douăzeci de mere',
    hint: '20 e un număr mare! De la 20 în sus spunem: „douăzeci DE mere”!',
    englishBridge: 'English: "twenty apples". Romanian: "douăzeci DE mere". Remember the magic "DE" from 20 up!'
  },
  {
    id: 'NUM-02',
    numberWord: '5 (cinci)',
    noun: 'cărți',
    needsDe: false,
    correctPhrase: 'cinci cărți',
    hint: '5 e mai mic decât 20! Până la 19 nu punem „de”: zicem simplu „cinci cărți”!',
    englishBridge: 'Numbers under 20 do not take "de": "cinci cărți" (just like English "five books").'
  },
  {
    id: 'NUM-03',
    numberWord: '100 (o sută)',
    noun: 'mașini',
    needsDe: true,
    correctPhrase: 'o sută de mașini',
    hint: 'O sută e mult peste 20! Zicem: „o sută DE mașini”!',
    englishBridge: 'English: "one hundred cars". Romanian: "o sută DE mașini".'
  },
  {
    id: 'NUM-04',
    numberWord: '12 (douăsprezece)',
    noun: 'ouă',
    needsDe: false,
    correctPhrase: 'douăsprezece ouă',
    hint: '12 e sub 20! Nu punem „de”: spunem simplu „douăsprezece ouă”!',
    englishBridge: 'Twelve is under 20, so no "de": "douăsprezece ouă".'
  }
];

export class TargulDeNumereStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): NumberItem {
    return NUMBER_ITEMS[this.currentIndex % NUMBER_ITEMS.length];
  }

  speak(text: string) {
    sound.playWoodenTap();
    sound.speakRomanian(text);
  }

  render(container: HTMLElement) {
    const item = this.getCurrentItem();

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/targul_numere.jpg" alt="Târgul de Numere" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Târgul de Numere ⚖️🍎</h2>
          <p>Punem greutatea „DE” pe cântar sau lăsăm numărul simplu?</p>
        </div>

        <!-- Market Scale Visual -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center;">
          <div style="font-size: 38px; margin-bottom: 6px;">⚖️🧺</div>
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 8px;">
            Cumperi de la piață:
          </div>

          <div style="display: inline-flex; align-items: center; gap: 10px; background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 14px 28px; box-shadow: var(--soft-shadow); font-family: var(--font-serif); font-size: 28px; font-weight: bold;">
            <span style="color: var(--walnut);">${item.numberWord}</span>
            <span id="numSlot" style="background: var(--linen-pure); border: 2.5px dashed var(--walnut); border-radius: 6px; padding: 4px 16px; color: var(--gen-feminin); min-width: 60px; text-align: center;">
              ... ? ...
            </span>
            <span style="color: var(--ink-charcoal);">${item.noun}</span>
          </div>
        </div>

        <!-- 2 Big Choice Buttons: Cu DE vs Fără DE -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" id="numChoices">
          <button class="num-choice-btn" data-de="true" style="background: #FFF; border: 2.5px solid var(--gen-neutru); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--gen-neutru); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: var(--soft-shadow);">
            <span>⚖️ Pune „DE”</span>
            <span style="font-size: 13px; font-weight: normal; opacity: 0.85;">(pentru 20, 30, 100...)</span>
          </button>

          <button class="num-choice-btn" data-de="false" style="background: #FFF; border: 2.5px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--gen-masculin); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: var(--soft-shadow);">
            <span>🚫 Fără „DE”</span>
            <span style="font-size: 13px; font-weight: normal; opacity: 0.85;">(pentru 1 până la 19)</span>
          </button>
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula de la Târg: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Produse cântărite: ${this.currentIndex + 1} / ${NUMBER_ITEMS.length}</span>
          <div class="progress-dots">
            ${NUMBER_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.num-choice-btn');
    const slot = container.querySelector('#numSlot') as HTMLElement;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-de') === 'true';
        this.handleAttempt(choice, slot, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedDe: boolean, slot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedDe === item.needsDe) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      slot.textContent = item.needsDe ? 'DE' : '—';
      slot.style.background = 'var(--gen-neutru)';
      slot.style.color = '#FFF';

      this.score += 15;

      this.onStateChange({
        prompt: `Foarte bine! Zicem: <strong>${item.correctPhrase}</strong>! Cântarul a fost perfect echilibrat!`,
        score: this.score
      });

      this.speak(item.correctPhrase);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % NUMBER_ITEMS.length;
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
