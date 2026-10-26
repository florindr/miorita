// src/stations/potecaLuiSa.ts — Station 5: Poteca lui Să (Category SUB)
// Targets omission of the subjunctive particle "să" after modal/volitional verbs.
// English: "I want to go" -> Tudor: "vreau merg" -> Romanian: "vreau SĂ merg".
// Mechanic: Stepping stones across the mountain brook; Miorița hops onto each correct stone.

import { sound } from '../audio/synth';

export interface SubjunctiveItem {
  id: string;
  englishShape: string;       // "I want to play" (Tudor: vreau joc)
  triggerVerb: string;        // "Vreau..."
  correctPhrase: string;      // "să mă joc"
  fullCorrect: string;        // "Vreau să mă joc"
  options: string[];          // ["să mă joc", "mă joc", "să joc", "joc"]
  hint: string;               // "După «vreau», româna cere mereu puntea fermecată «SĂ»: vreau SĂ mă joc!"
  englishBridge: string;      // "English uses 'to' ('want to play'). In Romanian, that link is the word 'SĂ' + subjunctive verb."
}

export const SUBJUNCTIVE_ITEMS: SubjunctiveItem[] = [
  {
    id: 'SUB-01',
    englishShape: 'vreau merg afară (I want to go out)',
    triggerVerb: 'Vreau...',
    correctPhrase: 'să merg afară',
    fullCorrect: 'Vreau să merg afară',
    options: ['să merg afară', 'merg afară', 'mergând afară', 'la merg'],
    hint: 'Nu uita pasul fermecat „SĂ”! Zicem: „Vreau SĂ merg afară”!',
    englishBridge: 'English "want to go" becomes "vreau să merg". Never omit "să" after vreau, pot, trebuie.'
  },
  {
    id: 'SUB-02',
    englishShape: 'trebuie mănânc supa (I have to eat the soup)',
    triggerVerb: 'Trebuie...',
    correctPhrase: 'să mănânc supa',
    fullCorrect: 'Trebuie să mănânc supa',
    options: ['să mănânc supa', 'mănânc supa', 'la mâncat', 'mâncat'],
    hint: 'Trebuie ce? Trebuie SĂ mănânc supa!',
    englishBridge: 'English says "have to eat". Romanian says "trebuie SĂ mănânc".'
  },
  {
    id: 'SUB-03',
    englishShape: 'pot ajut (I can help)',
    triggerVerb: 'Eu pot...',
    correctPhrase: 'să te ajut',
    fullCorrect: 'Eu pot să te ajut',
    options: ['să te ajut', 'te ajut', 'ajut', 'la ajutor'],
    hint: 'Puiul de piatră este „să”: „Pot SĂ te ajut”!',
    englishBridge: 'English "can help" omits "to", which confuses kids! Romanian always needs "pot SĂ te ajut".'
  },
  {
    id: 'SUB-04',
    englishShape: 'îmi place desenez (I like to draw)',
    triggerVerb: 'Îmi place...',
    correctPhrase: 'să desenez',
    fullCorrect: 'Îmi place să desenez',
    options: ['să desenez', 'desenez', 'desenat', 'la desen'],
    hint: 'După „îmi place”, punem mereu „să”: „Îmi place SĂ desenez”!',
    englishBridge: 'English "like to draw" requires "să desenez" in Romanian.'
  }
];

export class PotecaLuiSaStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): SubjunctiveItem {
    return SUBJUNCTIVE_ITEMS[this.currentIndex % SUBJUNCTIVE_ITEMS.length];
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
          <img src="/art/stations/poteca_sa.jpg" alt="Poteca lui Să" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Poteca lui Să 🪨</h2>
          <p>Alege piatra de râu potrivită ca Miorița să sară pârâul!</p>
        </div>

        <!-- The Stepping Stones Brook Area -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center;">
          <div style="font-size: 14px; color: var(--walnut); margin-bottom: 6px;">
            ⚠️ Capcana englezească: <del style="color: var(--gen-feminin); font-weight: 600;">„${item.englishShape}”</del>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 14px; flex-wrap: wrap;">
            <div style="background: var(--walnut); color: #FFF; padding: 12px 22px; border-radius: 20px; font-family: var(--font-serif); font-size: 26px; font-weight: bold;">
              ${item.triggerVerb}
            </div>
            <div id="stoneDrop" style="background: rgba(255,255,255,0.9); border: 2.5px dashed var(--gen-neutru); color: var(--gen-neutru); padding: 12px 24px; border-radius: 20px; font-family: var(--font-serif); font-size: 26px; font-weight: bold; min-width: 140px;">
              ... ? ...
            </div>
          </div>
        </div>

        <!-- Stepping Stone Options -->
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;" id="stoneOptions">
          ${item.options.map(opt => `
            <button class="stepping-stone-btn" data-stone="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: 18px; padding: 14px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--walnut); cursor: pointer; min-height: 48px; box-shadow: var(--soft-shadow); transition: transform 0.15s;">
              ${opt}
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula Pietrelor: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Pietre trecute: ${this.currentIndex + 1} / ${SUBJUNCTIVE_ITEMS.length}</span>
          <div class="progress-dots">
            ${SUBJUNCTIVE_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.stepping-stone-btn');
    const stoneDrop = container.querySelector('#stoneDrop') as HTMLElement;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stone = btn.getAttribute('data-stone');
        this.handleAttempt(stone || '', stoneDrop, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedStone: string, dropSlot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedStone === item.correctPhrase) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      btn.style.color = 'var(--gen-neutru)';
      dropSlot.textContent = selectedStone;
      dropSlot.style.background = 'var(--gen-neutru)';
      dropSlot.style.color = '#FFF';

      this.score += 15;

      this.onStateChange({
        prompt: `Bravo! Zicem: <strong>${item.fullCorrect}</strong>! Ai sărit pârâul pe piatra «SĂ»!`,
        score: this.score
      });

      this.speak(item.fullCorrect);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % SUBJUNCTIVE_ITEMS.length;
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
