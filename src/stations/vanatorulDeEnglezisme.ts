// src/stations/vanatorulDeEnglezisme.ts — Station 3: Vânătorul de Englezisme (Category CLQ)
// Targets English calques and false friends that heritage kids use because they think in English.
// Examples: "sunt 8 ani" (I am 8), "face sens" (makes sense), "sunt rece" (I am cold), "am luat un duș" (took a shower).

import { sound } from '../audio/synth';
import { shuffleArray } from '../utils/shuffle';

export interface CalqueItem {
  id: string;
  englishOriginal: string;    // "I am 8 years old"
  calqueSaid: string;          // "Eu sunt 8 ani" (the trap)
  calquePart: string;          // "sunt"
  authenticRom: string;        // "Am 8 ani"
  promptContext: string;       // "Când te întreabă cineva câți ani ai, cum spui?"
  options: string[];           // ["Am 8 ani", "Sunt 8 ani", "Fac 8 ani"]
  hint: string;                // "În română nu «suntem» anii, ci îi «avem»! Eu am 8 ani!"
  englishBridge: string;       // "English says 'I am 8'. Romanian says 'Am 8 ani' (literally: I have 8 years)."
}

export const CALQUE_ITEMS: CalqueItem[] = [
  {
    id: 'CLQ-01',
    englishOriginal: 'I am 8 years old',
    calqueSaid: 'Eu sunt 8 ani',
    calquePart: 'sunt',
    authenticRom: 'Am 8 ani',
    promptContext: 'Câți ani ai, Tudor?',
    options: ['Am 8 ani', 'Sunt 8 ani', 'Fac 8 ani'],
    hint: 'În română nu zicem „eu sunt 8 ani”. Îi avem în buzunar: „Am 8 ani”!',
    englishBridge: 'English says "I am 8". Romanian uses the verb a avea (to have): "Am 8 ani".'
  },
  {
    id: 'CLQ-02',
    englishOriginal: 'That makes sense',
    calqueSaid: 'Asta face sens',
    calquePart: 'face sens',
    authenticRom: 'Are sens',
    promptContext: 'Când înțelegi o explicație bună, ce zici?',
    options: ['Are sens', 'Face sens', 'Dă sens'],
    hint: 'Sensul nu se fabrică (nu se «face»). Sensul se «are»! Are sens!',
    englishBridge: '"Makes sense" is an English idiom. Romanian says "Are sens" (it has sense).'
  },
  {
    id: 'CLQ-03',
    englishOriginal: 'I am cold',
    calqueSaid: 'Eu sunt rece',
    calquePart: 'sunt rece',
    authenticRom: 'Mi-e frig',
    promptContext: 'Când ninge afară și tremuri, cum spui?',
    options: ['Mi-e frig', 'Sunt rece', 'Am frig'],
    hint: 'Dacă zici „sunt rece”, înseamnă că ești ca o înghețată! Zicem: „Mi-e frig”!',
    englishBridge: '"I am cold" translated literally means your body is ice. To say you feel cold, say "Mi-e frig".'
  },
  {
    id: 'CLQ-04',
    englishOriginal: 'I took a shower',
    calqueSaid: 'Am luat un duș',
    calquePart: 'luat un duș',
    authenticRom: 'Am făcut un duș',
    promptContext: 'După antrenamentul de fotbal:',
    options: ['Am făcut un duș', 'Am luat un duș', 'Am băut un duș'],
    hint: 'Nu putem lua dușul în brațe și pleca cu el! Zicem „Am făcut un duș”!',
    englishBridge: 'English says "take a shower". Romanian says "a face un duș" (to make/do a shower).'
  },
  {
    id: 'CLQ-05',
    englishOriginal: 'I live here for 3 years',
    calqueSaid: 'Locuiesc aici pentru 3 ani',
    calquePart: 'pentru 3 ani',
    authenticRom: 'de 3 ani',
    promptContext: 'Cât timp ai stat la Londra?',
    options: ['Locuiesc aici de 3 ani', 'Locuiesc aici pentru 3 ani', 'Locuiesc aici la 3 ani'],
    hint: 'Timpul care curge din trecut folosește „de”, nu „pentru”: „de 3 ani”!',
    englishBridge: 'For duration starting in the past, English uses "for 3 years". Romanian uses "de 3 ani" (never pentru).'
  }
];

export class VanatorulDeEnglezismeStation {
  private currentIndex = 0;
  private score = 0;
  private currentOptions: string[] = [];
  private lastQuestionIndex = -1;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): CalqueItem {
    return CALQUE_ITEMS[this.currentIndex % CALQUE_ITEMS.length];
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
          <img src="/art/stations/vanatorul_englezisme.jpg" alt="Vânătorul de Englezisme" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Vânătorul de Englezisme 🦅</h2>
          <p>Găsește expresia românească adevărată și scapă de capcana din engleză!</p>
        </div>

        <!-- The English Trap Context -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 6px;">
            Situație: <em>${item.promptContext}</em>
          </div>
          <div style="font-size: 13px; color: #8C5B3F; margin-bottom: 12px;">
            🇬🇧 Cum gândește engleza: <strong>"${item.englishOriginal}"</strong>
          </div>
          <div style="font-size: 20px; font-weight: bold; color: var(--gen-feminin); background: rgba(178, 58, 46, 0.08); display: inline-block; padding: 6px 18px; border-radius: 8px; border: 1px dashed var(--gen-feminin);">
            Capcana: „${item.calqueSaid}” ❌
          </div>
        </div>

        <!-- 3 Choice Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="choicesContainer">
          ${this.currentOptions.map((opt) => `
            <button class="calque-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s;">
              <span>${opt}</span>
              <span style="font-size: 18px; opacity: 0.5;">👉</span>
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>De ce se întâmplă asta? </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Englezisme vânate: ${this.currentIndex + 1} / ${CALQUE_ITEMS.length}</span>
          <div class="progress-dots">
            ${CALQUE_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.calque-choice-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        this.handleAttempt(choice || '', btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedChoice: string, btnElement: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedChoice.includes(item.authenticRom)) {
      // SUCCESS!
      sound.playBrassBell();
      btnElement.style.background = 'var(--gen-neutru-bg)';
      btnElement.style.borderColor = 'var(--gen-neutru)';
      btnElement.style.color = 'var(--gen-neutru)';
      btnElement.classList.add('pop-success');

      this.score += 20;

      this.onStateChange({
        prompt: `Excelent, Tudor! Zicem: <strong>${item.authenticRom}</strong>! Ai prins englezismul!`,
        score: this.score
      });

      this.speak(item.authenticRom);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % CALQUE_ITEMS.length;
        const root = document.querySelector('#stationRoot') as HTMLElement;
        if (root) this.render(root);
      }, 1000);
    } else {
      // Socratic Nudge
      sound.playGentleNudge();
      btnElement.classList.add('shake');
      setTimeout(() => btnElement.classList.remove('shake'), 450);

      this.onStateChange({
        prompt: `Atenție! ${item.hint}`,
        score: this.score
      });
    }
  }
}
