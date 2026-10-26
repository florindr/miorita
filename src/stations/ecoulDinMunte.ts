// src/stations/ecoulDinMunte.ts — Station 8: Ecoul din Munte (Category CLI)
// Targets Clitic Doubling and Prepositional Accusative "pe" with animate direct objects.
// Heritage speakers thinking in English omit the clitic and "pe" (e.g. saying "Am văzut Ion" instead of "L-am văzut pe Ion").
// Conforms to design.md & requirements.md (FR-STA-008, NFR-UX-002)

import { sound } from '../audio/synth';

export interface CliticItem {
  id: string;
  targetObject: string;      // "pe Ion", "pe Maria", "pe tata"
  englishOriginal: string;   // "I saw John", "I called Maria"
  trapSaid: string;          // "Am văzut Ion", "Am sunat Maria"
  cliticEcho: string;        // "L-", "-o", "Îl", "O", "Îi", "Le"
  authenticRom: string;      // "L-am văzut pe Ion"
  promptRo: string;          // "Când te întreabă bunicul dacă l-ai văzut pe Ion în curte:"
  options: string[];         // ["L-am văzut pe Ion", "Am văzut Ion", "Am văzut pe Ion"]
  hint: string;              // "Ecoul din munte repetă băiatul: «L-»! Zicem: «L-am văzut pe Ion»!"
  englishBridge: string;     // "English says 'I saw John'. Romanian requires an echo pronoun (L-) AND 'pe' when referring to a specific person."
}

export const CLITIC_ITEMS: CliticItem[] = [
  {
    id: 'CLI-01',
    targetObject: 'pe Ion',
    englishOriginal: 'I saw John in the park',
    trapSaid: 'Am văzut Ion în parc',
    cliticEcho: 'L-',
    authenticRom: 'L-am văzut pe Ion în parc',
    promptRo: 'L-ai întâlnit pe prietenul tău Ion la fotbal?',
    options: ['L-am văzut pe Ion în parc', 'Am văzut Ion în parc', 'Am văzut pe Ion în parc'],
    hint: 'Ecoul din munte strigă înainte: «L-»! Zicem: „L-am văzut pe Ion”!',
    englishBridge: 'English says "I saw John". Romanian must double the direct object with a clitic pronoun (L-) and use "pe": L-am văzut pe Ion.'
  },
  {
    id: 'CLI-02',
    targetObject: 'pe Maria',
    englishOriginal: 'I called Maria yesterday',
    trapSaid: 'Am chemat Maria ieri',
    cliticEcho: '-o',
    authenticRom: 'Am chemat-o pe Maria ieri',
    promptRo: 'Ai vorbit cu verișoara ta Maria la telefon?',
    options: ['Am chemat-o pe Maria ieri', 'Am chemat Maria ieri', 'O am chemat Maria'],
    hint: 'Pentru fete, ecoul adaugă «-o»: „Am chemat-o pe Maria”!',
    englishBridge: 'English says "I called Maria". Romanian attaches the feminine clitic "-o" to the auxiliary verb: Am chemat-o pe Maria.'
  },
  {
    id: 'CLI-03',
    targetObject: 'pe tata',
    englishOriginal: 'I am waiting for dad at school',
    trapSaid: 'Aștept tata la școală',
    cliticEcho: 'Îl',
    authenticRom: 'Îl aștept pe tata la școală',
    promptRo: 'Cine vine să te ia de la școală?',
    options: ['Îl aștept pe tata la școală', 'Aștept tata la școală', 'Aștept pe tata la școală'],
    hint: 'Înainte de verbul «aștept», ecoul șoptește «Îl»: „Îl aștept pe tata”!',
    englishBridge: 'English says "waiting for dad". Romanian places "Îl" before the present tense verb and adds "pe": Îl aștept pe tata.'
  },
  {
    id: 'CLI-04',
    targetObject: 'pe bunica',
    englishOriginal: 'I help grandma in the garden',
    trapSaid: 'Ajut bunica în grădină',
    cliticEcho: 'O',
    authenticRom: 'O ajut pe bunica în grădină',
    promptRo: 'Ce faci frumos sâmbătă dimineața?',
    options: ['O ajut pe bunica în grădină', 'Ajut bunica în grădină', 'Ajut pe bunica'],
    hint: 'Pentru bunica, punem sunetul dulce «O» în față: „O ajut pe bunica”!',
    englishBridge: 'English says "I help grandma". In Romanian, specific feminine persons require "O" before the verb: O ajut pe bunica.'
  },
  {
    id: 'CLI-05',
    targetObject: 'pe băieți',
    englishOriginal: 'I hear the boys playing football',
    trapSaid: 'Aud băieții jucând fotbal',
    cliticEcho: 'Îi',
    authenticRom: 'Îi aud pe băieți jucând fotbal',
    promptRo: 'Se aude gălăgie pe terenul de sport?',
    options: ['Îi aud pe băieți jucând fotbal', 'Aud băieții jucând fotbal', 'Aud pe băieți'],
    hint: 'Pentru mai mulți băieți, ecoul trimite «Îi»: „Îi aud pe băieți”!',
    englishBridge: 'For plural masculine people (the boys), Romanian requires the clitic "Îi" and "pe": Îi aud pe băieți.'
  }
];

export class EcoulDinMunteStation {
  private currentIndex = 0;
  private score = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;

  constructor(onStateChange: (state: { prompt: string; score: number }) => void) {
    this.onStateChange = onStateChange;
  }

  getCurrentItem(): CliticItem {
    return CLITIC_ITEMS[this.currentIndex % CLITIC_ITEMS.length];
  }

  render(container: HTMLElement) {
    const item = this.getCurrentItem();

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/ecoul_munte.jpg" alt="Ecoul din Munte" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Ecoul din Munte ⛰️</h2>
          <p>Muntele Carpaților are un ecou fermecat: repetă persoana cu „L-”, „-o” sau „Îl” și nu uită niciodată de „pe”!</p>
        </div>

        <!-- The Mountain Context & Trap -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 15px; color: var(--walnut); margin-bottom: 6px;">
            Întrebare: <em>${item.promptRo}</em>
          </div>
          <div style="font-size: 13px; color: #8C5B3F; margin-bottom: 12px;">
            🇬🇧 Cum gândește engleza: <strong>"${item.englishOriginal}"</strong>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span style="font-size: 18px; font-weight: bold; color: var(--gen-feminin); background: rgba(178, 58, 46, 0.08); padding: 6px 16px; border-radius: 8px; border: 1px dashed var(--gen-feminin);">
              Fără ecou (greșit): „${item.trapSaid}” ❌
            </span>
            <span style="font-size: 18px; font-weight: bold; color: var(--gen-masculin); background: rgba(30, 91, 153, 0.08); padding: 6px 16px; border-radius: 8px; border: 1px dashed var(--gen-masculin);">
              Sunetul ecoului: <strong>${item.cliticEcho}</strong> 📢
            </span>
          </div>
        </div>

        <!-- Interactive Choice Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="choicesContainer">
          ${item.options.map((opt) => `
            <button class="clitic-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 21px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s;">
              <span>${opt}</span>
              <span style="font-size: 18px; opacity: 0.6;">⛰️ 👉</span>
            </button>
          `).join('')}
        </div>

        <!-- Podul Englez (Contrastive Bridge) -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Secretul ecoului românesc: </strong>
            <span>${item.englishBridge}</span>
          </div>
        </div>

        <div class="progress-container">
          <span>Ecouri rezolvate: ${this.currentIndex + 1} / ${CLITIC_ITEMS.length}</span>
          <div class="progress-dots">
            ${CLITIC_ITEMS.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const item = this.getCurrentItem();
    const buttons = container.querySelectorAll<HTMLButtonElement>('.clitic-choice-btn');

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
            prompt: `Bravo! ⛰️ Ecoul a sunat perfect: «${item.authenticRom}»!`,
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
            prompt: `Aproape! ⛰️ ${item.hint}`,
            score: this.score
          });
        }
      });
    });
  }
}
