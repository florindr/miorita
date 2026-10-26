// src/stations/fantanaPosesivelor.ts — Station 6: Fântâna cu Al-A-Ai-Ale (Category POS)
// Targets the tricky possessive article agreement in Romanian.
// English: "a friend of mine" -> Tudor: "un prieten a meu" (trap: English "a") -> Romanian: "un prieten AL meu".
// Mechanic: 4 wooden buckets at the well (al, a, ai, ale); Tudor draws water with the bucket matching the noun.

import { sound } from '../audio/synth';

export interface PossessiveItem {
  id: string;
  nounPhrase: string;        // "un prieten ..."
  pronoun: string;           // "... meu"
  correctBucket: 'al' | 'a' | 'ai' | 'ale';
  fullSentence: string;      // "un prieten al meu"
  hint: string;              // "Prieten e băiat (masculin singular), deci găleata este «al»: un prieten AL meu!"
  englishBridge: string;     // "English says 'a friend of mine'. Heritage kids copy the English 'a' and say 'un prieten a meu'. But Romanian matches the noun: un prieten AL meu."
}

export const POSSESSIVE_ITEMS: PossessiveItem[] = [
  {
    id: 'POS-01',
    nounPhrase: 'un prieten',
    pronoun: 'meu',
    correctBucket: 'al',
    fullSentence: 'un prieten al meu',
    hint: '„Prieten” este masculin (un prieten). Găleata lui este «AL»: un prieten AL meu!',
    englishBridge: 'Do not copy English "a friend"! Prieten is masculine, so it takes AL: un prieten AL meu.'
  },
  {
    id: 'POS-02',
    nounPhrase: 'o carte',
    pronoun: 'mea',
    correctBucket: 'a',
    fullSentence: 'o carte a mea',
    hint: '„Carte” este feminin (o carte). Găleata ei este «A»: o carte A mea!',
    englishBridge: 'Carte is feminine singular: o carte A mea.'
  },
  {
    id: 'POS-03',
    nounPhrase: 'colegii',
    pronoun: 'mei',
    correctBucket: 'ai',
    fullSentence: 'colegii ai mei',
    hint: '„Colegii” sunt băieți mulți (masculin plural). Găleata lor este «AI»: colegi AI mei!',
    englishBridge: 'Masculine plural nouns take AI: prieteni AI mei.'
  },
  {
    id: 'POS-04',
    nounPhrase: 'jucăriile',
    pronoun: 'mele',
    correctBucket: 'ale',
    fullSentence: 'jucăriile ale mele',
    hint: '„Jucăriile” sunt fete multe (feminin plural). Găleata lor este «ALE»: jucării ALE mele!',
    englishBridge: 'Feminine plural nouns take ALE: jucării ALE mele.'
  }
];

export class FantanaPosesivelorStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): PossessiveItem {
    return POSSESSIVE_ITEMS[this.currentIndex % POSSESSIVE_ITEMS.length];
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
          <img src="/art/stations/fantana_posesivelor.jpg" alt="Fântâna Posesivelor" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Fântâna cu Al-A-Ai-Ale 🪣</h2>
          <p>Scoate apă cu găleata care se potrivește cu substantivul!</p>
        </div>

        <!-- The Well Graphic and Phrase with Gap -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 24px 20px; text-align: center;">
          <div style="font-size: 38px; margin-bottom: 8px;">🪵⛲</div>
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 8px;">
            Alege găleata pentru:
          </div>

          <div style="display: inline-flex; align-items: center; gap: 10px; background: #FFF; border: 3px solid var(--walnut); border-radius: var(--radius-md); padding: 14px 28px; box-shadow: var(--soft-shadow); font-family: var(--font-serif); font-size: 26px; font-weight: bold;">
            <span>${item.nounPhrase}</span>
            <span id="bucketSlot" style="background: var(--linen-pure); border: 2.5px dashed var(--walnut); border-radius: 6px; padding: 4px 16px; color: var(--gen-feminin); min-width: 54px; text-align: center;">
              ... ? ...
            </span>
            <span>${item.pronoun}</span>
          </div>
        </div>

        <!-- 4 Wooden Bucket Options -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;" id="bucketGrid">
          <button class="bucket-btn" data-bucket="al" style="background: #FFF; border: 2.5px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 16px 12px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--gen-masculin); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: var(--soft-shadow);">
            <span>🪣</span>
            <span>al</span>
            <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">masc. sg.</span>
          </button>

          <button class="bucket-btn" data-bucket="a" style="background: #FFF; border: 2.5px solid var(--gen-feminin); border-radius: var(--radius-md); padding: 16px 12px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--gen-feminin); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: var(--soft-shadow);">
            <span>🪣</span>
            <span>a</span>
            <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">fem. sg.</span>
          </button>

          <button class="bucket-btn" data-bucket="ai" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 16px 12px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--walnut); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: var(--soft-shadow);">
            <span>🪣</span>
            <span>ai</span>
            <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">masc. pl.</span>
          </button>

          <button class="bucket-btn" data-bucket="ale" style="background: #FFF; border: 2.5px solid var(--gen-neutru); border-radius: var(--radius-md); padding: 16px 12px; font-family: var(--font-serif); font-size: 24px; font-weight: bold; color: var(--gen-neutru); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: var(--soft-shadow);">
            <span>🪣</span>
            <span>ale</span>
            <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">fem. pl.</span>
          </button>
        </div>

        <!-- Podul Englez -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Capcana lui „a friend”: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Găleți scoase: ${this.currentIndex + 1} / ${POSSESSIVE_ITEMS.length}</span>
          <div class="progress-dots">
            ${POSSESSIVE_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const buttons = container.querySelectorAll('.bucket-btn');
    const slot = container.querySelector('#bucketSlot') as HTMLElement;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const bucket = btn.getAttribute('data-bucket');
        this.handleAttempt(bucket || '', slot, btn as HTMLElement);
      });
    });
  }

  private handleAttempt(selectedBucket: string, slot: HTMLElement, btn: HTMLElement) {
    const item = this.getCurrentItem();

    if (selectedBucket === item.correctBucket) {
      // SUCCESS!
      sound.playBrassBell();
      btn.style.background = 'var(--gen-neutru-bg)';
      btn.style.borderColor = 'var(--gen-neutru)';
      slot.textContent = selectedBucket;
      slot.style.background = 'var(--gen-neutru)';
      slot.style.color = '#FFF';
      slot.style.borderStyle = 'solid';

      this.score += 15;

      this.onStateChange({
        prompt: `Excelent! Zicem: <strong>${item.fullSentence}</strong>! Găleata «${selectedBucket}» s-a potrivit la fântână!`,
        score: this.score
      });

      this.speak(item.fullSentence);

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % POSSESSIVE_ITEMS.length;
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
