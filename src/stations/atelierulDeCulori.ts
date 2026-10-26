// src/stations/atelierulDeCulori.ts — Station 9: Atelierul de Culori (Categories AGR & ORD)
// Targets Adjective Agreement in gender/number and postposed Romanian word order (noun + adjective).
// English leaves adjectives invariable ("red car", "red cars") and preposed ("red car").
// Romanian requires inflection (roșu, roșie, roșii) and postposition ("mașina roșie").
// Conforms to design.md & requirements.md (FR-STA-009, NFR-UX-002)

import { sound } from '../audio/synth';

export interface AgreementItem {
  id: string;
  category: 'AGR' | 'ORD';
  nounRo: string;            // "o mașină", "doi câini", "creionul", "mere"
  englishPhrase: string;     // "a red car", "two white dogs", "the blue pencil"
  englishTrap: string;       // "o mașină roșu", "doi câini alb", "albastrul creion"
  trapReason: string;        // "Genul nepotrivit" sau "Topica englezească"
  authenticRom: string;      // "o mașină roșie", "doi câini albi", "creionul albastru"
  options: string[];         // 3 choices
  hint: string;              // Short <=2 sentence hint
  englishBridge: string;     // Contrastive explanation
}

export const AGREEMENT_ITEMS: AgreementItem[] = [
  {
    id: 'AGR-01',
    category: 'AGR',
    nounRo: 'o mașină (feminin)',
    englishPhrase: 'a red car',
    englishTrap: 'o mașină roșu',
    trapReason: 'În engleză „red” nu se schimbă niciodată!',
    authenticRom: 'o mașină roșie',
    options: ['o mașină roșie', 'o mașină roșu', 'o mașină roșii'],
    hint: 'Mașina e feminină (o mașină). Culoarea ei se îmbracă în fustă roșie: „o mașină roșie”!',
    englishBridge: 'English "red" never changes (red car, red cars). Romanian adjectives must match feminine nouns: o mașină roșie.'
  },
  {
    id: 'AGR-02',
    category: 'AGR',
    nounRo: 'doi câini (masculin plural)',
    englishPhrase: 'two white dogs',
    englishTrap: 'doi câini alb',
    trapReason: 'Engleza nu pune plural pe culori („white”)!',
    authenticRom: 'doi câini albi',
    options: ['doi câini albi', 'doi câini alb', 'doi câini albe'],
    hint: 'Avem doi câini băieți (plural). Adăugăm «-i»: „doi câini albi”!',
    englishBridge: 'English says "white dogs" (white has no plural). Romanian adds plural agreement to adjectives: doi câini albi.'
  },
  {
    id: 'ORD-01',
    category: 'ORD',
    nounRo: 'creionul + albastru',
    englishPhrase: 'the blue pencil',
    englishTrap: 'albastrul creion',
    trapReason: 'Engleza pune culoarea înainte („blue pencil”)!',
    authenticRom: 'creionul albastru',
    options: ['creionul albastru', 'albastrul creion', 'albastră creionul'],
    hint: 'În română punem întâi lucrul pe care îl vedem, apoi culoarea: „creionul albastru”!',
    englishBridge: 'English places adjectives before the noun ("blue pencil"). Romanian naturally places adjectives AFTER the noun: "creionul albastru".'
  },
  {
    id: 'AGR-03',
    category: 'AGR',
    nounRo: 'mere (neutru plural)',
    englishPhrase: 'green apples',
    englishTrap: 'mere verde',
    trapReason: 'Engleza zice „green” pentru un măr sau zece mere!',
    authenticRom: 'mere verzi',
    options: ['mere verzi', 'mere verde', 'mere verzii'],
    hint: 'La plural, verde se preface în verzi: „mere verzi”!',
    englishBridge: 'Green is "verde" for singular, but turns into "verzi" for plural nouns: mere verzi.'
  },
  {
    id: 'ORD-02',
    category: 'ORD',
    nounRo: 'casa + frumoasă',
    englishPhrase: 'the beautiful house',
    englishTrap: 'frumoasa casă (folosit de obicei ca „casa frumoasă”)',
    trapReason: 'În vorbirea de zi cu zi, substantivul vine primul!',
    authenticRom: 'casa cea frumoasă',
    options: ['casa frumoasă', 'frumoasă casa', 'frumosul casă'],
    hint: 'Așază întâi casa, apoi cum este ea: „casa frumoasă”!',
    englishBridge: 'English says "beautiful house". Natural everyday Romanian puts the noun first: "casa frumoasă".'
  }
];

export class AtelierulDeCuloriStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): AgreementItem {
    return AGREEMENT_ITEMS[this.currentIndex % AGREEMENT_ITEMS.length];
  }

  render(container: HTMLElement) {
    const item = this.getCurrentItem();

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/atelierul_culori.jpg" alt="Atelierul de Culori" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Atelierul de Culori și Meșteșuguri 🎨</h2>
          <p>Potrivește culorile cu haina substantivului: acordul de gen, număr și ordinea cuvintelor!</p>
        </div>

        <!-- The Artisan Studio Context & Trap -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 6px;">
            Obiectul de vopsit: <strong>${item.nounRo}</strong>
          </div>
          <div style="font-size: 13px; color: #8C5B3F; margin-bottom: 12px;">
            🇬🇧 În engleză: <strong>"${item.englishPhrase}"</strong> • <em>${item.trapReason}</em>
          </div>
          <div style="display: inline-block; font-size: 19px; font-weight: bold; color: var(--gen-feminin); background: rgba(178, 58, 46, 0.08); padding: 6px 18px; border-radius: 8px; border: 1px dashed var(--gen-feminin);">
            Capcana: „${item.englishTrap}” ❌
          </div>
        </div>

        <!-- Interactive Choice Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="choicesContainer">
          ${item.options.map((opt) => `
            <button class="agr-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 21px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s;">
              <span>${opt}</span>
              <span style="font-size: 18px; opacity: 0.6;">🎨 👉</span>
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez (Contrastive Bridge) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Regula meșterului român: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Potriviri realizate: ${this.currentIndex + 1} / ${AGREEMENT_ITEMS.length}</span>
          <div class="progress-dots">
            ${AGREEMENT_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const item = this.getCurrentItem();
    const buttons = container.querySelectorAll<HTMLButtonElement>('.agr-choice-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-choice');

        if (chosen === item.authenticRom) {
          sound.playBrassBell();
          sound.speakRomanian(item.authenticRom);
          btn.style.borderColor = 'var(--gen-neutru)';
          btn.style.background = '#E8F5E9';

          this.score += 10;
          this.onStateChange({
            prompt: `Superb! 🎨 Haina se potrivește de minune: «${item.authenticRom}»!`,
            score: this.score
          });

          setTimeout(() => {
            this.currentIndex++;
            this.render(container);
          }, 1200);
        } else {
          sound.playGentleNudge();
          btn.style.borderColor = 'var(--gen-feminin)';
          btn.style.background = '#FFEBEE';

          this.onStateChange({
            prompt: `Aproape! 🎨 ${item.hint}`,
            score: this.score
          });
        }
      });
    });
  }
}
