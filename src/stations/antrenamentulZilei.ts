// src/stations/antrenamentulZilei.ts — Daily SRS Quest & 10 Comprehensive Sets (Like Clawey Papers 1-10)
// Designed for Tudor's ADHD focus window (≤3 min, high praise, golden stitches).
// Allows choosing either the Daily Quick Quest (5 prioritized items) or any of the 10 Quest Sets (10 items each).

import { sound } from '../audio/synth';
import { recordSrsAttempt } from '../storage/srs';
import { getCaietEntries } from '../components/caietulLuiTata';
import { QUEST_SETS, type QuestQuestion } from '../content/questSets';
import { shuffleArray } from '../utils/shuffle';

export class AntrenamentulZileiStation {
  private items: QuestQuestion[] = [];
  private currentIndex = 0;
  private correctCount = 0;
  private onStateChange: (state: { prompt: string; score: number }) => void;
  private onFinished: () => void;
  private sessionScore = 0;
  private selectedSet: number | 'daily' = 'daily';

  constructor(
    onStateChange: (state: { prompt: string; score: number }) => void,
    onFinished: () => void
  ) {
    this.onStateChange = onStateChange;
    this.onFinished = onFinished;
    this.loadSet('daily');
  }

  public loadSet(setId: number | 'daily') {
    this.selectedSet = setId;
    this.currentIndex = 0;
    this.correctCount = 0;
    this.sessionScore = 0;

    if (setId === 'daily') {
      const caiet = getCaietEntries();
      const dynamicItems: QuestQuestion[] = [];

      // 1. Prioritize parent-logged home errors
      caiet.slice(0, 3).forEach((entry, idx) => {
        dynamicItems.push({
          id: 'CAIET-' + (entry.id || idx),
          setId: 0,
          setName: 'Caietul lui Tata',
          category: (entry.category as any) || 'CLQ',
          badge: '📓 Din Caietul lui Tata',
          title: 'Capcană de acasă',
          situation: 'Când vorbim în familie:',
          englishTrap: entry.said,
          authenticRom: entry.correct,
          options: shuffleArray([entry.correct, entry.said]),
          hint: `Tata a notat că forma românească frumoasă este: «${entry.correct}»!`,
          bridge: 'This was practiced at home with Dad. Focus on the authentic Romanian phrasing.'
        });
      });

      // 2. Fill remainder up to 5 items with Set 1 questions
      const fillers = QUEST_SETS[0].questions.slice(0, 5 - dynamicItems.length);
      this.items = [...dynamicItems, ...fillers].map((q) => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    } else {
      const found = QUEST_SETS.find((s) => s.id === setId);
      if (found) {
        this.items = found.questions.map((q) => ({
          ...q,
          options: shuffleArray(q.options)
        }));
      }
    }
  }

  render(container: HTMLElement) {
    if (this.currentIndex >= this.items.length) {
      this.renderCompletionScreen(container);
      return;
    }

    const item = this.items[this.currentIndex];
    const currentSetMeta = typeof this.selectedSet === 'number' 
      ? QUEST_SETS.find((s) => s.id === this.selectedSet) 
      : null;

    container.innerHTML = `
      <section class="station-card" style="border-color: var(--gold-bell); box-shadow: 0 8px 24px rgba(212, 160, 23, 0.15);">
        <div class="station-banner" style="border-color: var(--gold-bell);">
          <img src="/art/village.jpg" alt="Satul Mioriței" onerror="this.parentElement.style.display='none';"/>
        </div>

        <!-- 10 Question Sets Selector Strip (Like Clawey Papers 1-10) -->
        <div style="background: var(--linen-card); padding: 12px 14px; border-radius: var(--radius-md); border: 1.5px solid var(--linen-dark);">
          <div style="font-size: 13px; font-weight: 700; color: var(--walnut); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <span>📜 Alege Sesiunea (10 Seturi de Antrenament ca în Clawey):</span>
            <span style="font-size: 11px; font-weight: 800; background: var(--gold-bell); color: #FFF; padding: 2px 8px; border-radius: 999px;">
              ${this.currentIndex + 1} / ${this.items.length} întrebări
            </span>
          </div>
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none;" id="setPicker">
            <button class="set-pill-btn" data-set="daily" style="background: ${this.selectedSet === 'daily' ? 'var(--gold-bell)' : '#FFF'}; color: ${this.selectedSet === 'daily' ? '#FFF' : 'var(--walnut)'}; border: 1.5px solid var(--gold-bell); border-radius: 999px; padding: 6px 14px; font-weight: bold; font-size: 13px; white-space: nowrap; cursor: pointer; transition: transform 0.1s;">
              ⚡ Zilnic (3 min)
            </button>
            ${QUEST_SETS.map((s) => `
              <button class="set-pill-btn" data-set="${s.id}" style="background: ${this.selectedSet === s.id ? 'var(--walnut)' : '#FFF'}; color: ${this.selectedSet === s.id ? '#FFF' : 'var(--walnut)'}; border: 1.5px solid var(--walnut-light); border-radius: 999px; padding: 6px 14px; font-weight: bold; font-size: 13px; white-space: nowrap; cursor: pointer; transition: transform 0.1s;" title="${s.title}: ${s.subtitle}">
                ${s.icon} Setul ${s.id}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="station-header">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(212, 160, 23, 0.15); border: 1.5px solid var(--gold-bell); padding: 4px 14px; border-radius: 999px; font-weight: 700; font-size: 13px; color: #8A6500; margin-bottom: 8px;">
            <span>${currentSetMeta ? currentSetMeta.title : '⚡ Antrenament Recomandat (SRS)'}</span>
            <span>•</span>
            <span>Întrebarea ${this.currentIndex + 1} din ${this.items.length}</span>
          </div>
          <h2>${item.badge}: ${item.title}</h2>
          <p>${item.situation}</p>
        </div>

        <!-- The Trap Box -->
        <div style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 14px; color: #8C5B3F; margin-bottom: 6px;">
            🇬🇧 Capcana gândită în engleză:
          </div>
          <div style="font-size: 21px; font-weight: bold; color: var(--gen-feminin); background: rgba(178, 58, 46, 0.08); display: inline-block; padding: 6px 18px; border-radius: 8px; border: 1px dashed var(--gen-feminin);">
            „${item.englishTrap}” ❌
          </div>
        </div>

        <!-- 3 Interactive Choice Buttons -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="questChoices">
          ${item.options.map((opt) => `
            <button class="quest-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2.5px solid var(--walnut); border-radius: var(--radius-md); padding: 18px 24px; font-family: var(--font-serif); font-size: 22px; font-weight: bold; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; min-height: 52px; box-shadow: var(--soft-shadow); transition: transform 0.15s, border-color 0.15s;">
              <span>${opt}</span>
              <span style="font-size: 18px; opacity: 0.6;">👉</span>
            </button>
          `).join('')}
        </div>

        <!-- Contrastive Bridge Box -->
        <div class="bridge-box">
          <span class="bridge-flag">🇬🇧</span>
          <div>
            <strong>Gândirea englezească vs românească: </strong>
            <span>${item.bridge}</span>
          </div>
        </div>

        <!-- Progress Footer -->
        <div class="progress-bar">
          <span>Progres ${currentSetMeta ? 'Setul ' + currentSetMeta.id : 'Zilnic'}: ${this.currentIndex + 1} / ${this.items.length}</span>
          <div class="dots">
            ${this.items.map((_, i) => `<span class="dot ${i < this.currentIndex ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    // 1. Set picker events
    container.querySelectorAll<HTMLButtonElement>('.set-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playWoodenTap();
        const setVal = btn.getAttribute('data-set');
        const newSet = setVal === 'daily' ? 'daily' : parseInt(setVal!, 10);
        this.loadSet(newSet);
        this.render(container);
      });
    });

    // 2. Choice buttons
    const item = this.items[this.currentIndex];
    const buttons = container.querySelectorAll<HTMLButtonElement>('.quest-choice-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-choice');

        if (chosen === item.authenticRom) {
          sound.playBrassBell();
          sound.speakRomanian(item.authenticRom);
          btn.style.borderColor = 'var(--gen-neutru)';
          btn.style.background = '#E8F5E9';

          recordSrsAttempt(item.id, item.category, true);
          this.sessionScore += 20;
          this.correctCount++;

          this.onStateChange({
            prompt: `Minunat, Tudor! 🌟 Zicem: «<strong>${item.authenticRom}</strong>». Ai adăugat un fir de aur pe covor!`,
            score: this.sessionScore
          });

          setTimeout(() => {
            this.currentIndex++;
            this.render(container);
          }, 1100);
        } else {
          sound.playGentleNudge();
          btn.style.borderColor = 'var(--gen-feminin)';
          btn.style.background = '#FFEBEE';
          recordSrsAttempt(item.id, item.category, false);

          this.onStateChange({
            prompt: `Aproape, Tudor! 🐑 ${item.hint}`,
            score: this.sessionScore
          });
        }
      });
    });
  }

  private renderCompletionScreen(container: HTMLElement) {
    sound.playBrassBell();
    const currentSetMeta = typeof this.selectedSet === 'number' 
      ? QUEST_SETS.find((s) => s.id === this.selectedSet) 
      : null;
    const setName = currentSetMeta ? currentSetMeta.title : 'Antrenamentul Zilnic';

    this.onStateChange({
      prompt: `🎉 <strong>Bravo, Tudor!</strong> Ai terminat ${setName}! Ai adăugat ${this.correctCount} ochiuri de aur pe covor!`,
      score: this.sessionScore
    });

    container.innerHTML = `
      <section class="station-card" style="text-align: center; border-color: var(--gold-bell); padding: 36px 24px;">
        <div style="font-size: 64px; margin-bottom: 12px; animation: popSuccess 0.5s ease;">
          🏆🧵
        </div>
        
        <h2 style="font-family: var(--font-serif); font-size: 28px; color: var(--walnut); margin-bottom: 8px;">
          ${setName} Finalizat!
        </h2>
        
        <p style="font-size: 16px; color: #6C5B4F; max-width: 520px; margin: 0 auto 24px; line-height: 1.5;">
          Ai rezolvat întrebările cu brio! Limba română se așază curat și melodios, fără capcanele traduse din engleză.
        </p>

        <div style="display: inline-flex; gap: 24px; background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 16px 32px; margin-bottom: 28px;">
          <div>
            <div style="font-size: 28px; font-weight: bold; color: var(--gold-bell); font-family: var(--font-serif);">
              +${this.sessionScore}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: var(--walnut);">Puncte Aur</div>
          </div>
          <div style="border-left: 1.5px solid var(--walnut-light);"></div>
          <div>
            <div style="font-size: 28px; font-weight: bold; color: var(--gen-neutru); font-family: var(--font-serif);">
              ${this.correctCount}/${this.items.length}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: var(--walnut);">Fire de Aur Țesute</div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
          <button id="btnTryNextSet" style="background: var(--gold-bell); color: #FFF; border: none; border-radius: 999px; padding: 14px 28px; font-family: var(--font-serif); font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: var(--soft-shadow);">
            Alege Alt Set 📜
          </button>
          <button id="btnBackToVillage" style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 14px 28px; font-family: var(--font-serif); font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: var(--soft-shadow);">
            Harta Satului 🗺️
          </button>
        </div>
      </section>
    `;

    container.querySelector('#btnTryNextSet')?.addEventListener('click', () => {
      sound.playWoodenTap();
      const nextId = typeof this.selectedSet === 'number' && this.selectedSet < 10 
        ? this.selectedSet + 1 
        : 1;
      this.loadSet(nextId);
      this.render(container);
    });

    container.querySelector('#btnBackToVillage')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.onFinished();
    });
  }
}
