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
      <section style="max-width: 660px; margin: 12px auto; background: #FFFDF9; border: 2px solid var(--linen-dark); border-radius: 20px; padding: 26px 28px; box-shadow: 0 8px 28px rgba(62, 42, 30, 0.06); display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Quiet Minimal Top Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--linen-dark); padding-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 800; color: #7C6A58; text-transform: uppercase; letter-spacing: 0.04em;">
            ⚡ ${currentSetMeta ? currentSetMeta.title : 'Antrenament Rapid'} · ${this.currentIndex + 1} / ${this.items.length}
          </span>
          <span style="font-size: 12px; font-weight: 700; color: var(--walnut);">
            ${item.badge}
          </span>
        </div>

        <div>
          <h2 style="font-family: var(--font-serif); font-size: 21px; color: var(--walnut); margin: 0 0 4px 0;">
            ${item.title}
          </h2>
          <p style="font-size: 14px; color: #5C4E43; margin: 0;">${item.situation}</p>
        </div>

        <!-- The Trap Box -->
        <div style="background: var(--linen-card); border: 1.5px solid var(--linen-dark); border-radius: 14px; padding: 16px; text-align: center;">
          <div style="font-size: 12px; font-weight: 700; color: #8C5B3F; margin-bottom: 4px;">
            🇬🇧 Capcana gândită în engleză:
          </div>
          <div style="font-size: 19px; font-weight: 800; color: var(--gen-feminin);">
            „${item.englishTrap}” ❌
          </div>
        </div>

        <!-- Choice Buttons (with Golden Audio Halo if studio audio exists) -->
        <div style="display: flex; flex-direction: column; gap: 10px;" id="questChoices">
          ${item.options.map((opt) => {
            const hasAudio = sound.hasRecordedAudio(opt);
            const haloShadow = hasAudio
              ? '0 0 0 3px rgba(212, 160, 23, 0.32), 0 0 14px rgba(212, 160, 23, 0.42)'
              : 'none';
            return `
            <button class="quest-choice-btn" data-choice="${opt}" style="background: #FFF; border: 2px solid var(--walnut-light); box-shadow: ${haloShadow}; border-radius: 14px; padding: 14px 20px; font-family: var(--font-serif); font-size: 20px; font-weight: 800; color: var(--ink-charcoal); cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between;">
              <span>${opt}</span>
              <span style="font-size: 15px;">${hasAudio ? '🔊' : '➔'}</span>
            </button>
          `;
          }).join('')}
        </div>

        <div id="questInlineFeedback" style="display: none; border-radius: 10px; padding: 10px 14px; font-size: 14px; font-weight: 700;"></div>

        <!-- 1-Line Contrastive Note -->
        <div style="font-size: 12px; font-weight: 700; color: #5C4E43; background: var(--linen-card); padding: 8px 14px; border-radius: 10px;">
          🇬🇧 ${item.bridge}
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    const item = this.items[this.currentIndex];
    const buttons = container.querySelectorAll<HTMLButtonElement>('.quest-choice-btn');
    const feedbackEl = container.querySelector<HTMLDivElement>('#questInlineFeedback');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-choice') || '';

        if (chosen === item.authenticRom) {
          sound.playBrassBell();
          if (sound.hasRecordedAudio(item.authenticRom)) {
            sound.speakRomanian(item.authenticRom);
          }
          btn.style.borderColor = '#237A4B';
          btn.style.background = '#E6F6EC';

          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.background = '#E6F6EC';
            feedbackEl.style.color = '#1E6F3D';
            feedbackEl.textContent = `✓ Corect! Spunem „${item.authenticRom}”.`;
          }

          recordSrsAttempt(item.id, item.category, true);
          this.sessionScore += 20;
          this.correctCount++;

          this.onStateChange({
            prompt: `Corect! Spunem «<strong>${item.authenticRom}</strong>».`,
            score: this.sessionScore
          });

          setTimeout(() => {
            this.currentIndex++;
            this.render(container);
          }, 950);
        } else {
          sound.playGentleNudge();
          btn.style.borderColor = '#C0292B';
          btn.style.background = '#FDE8E8';
          btn.disabled = true;
          btn.style.opacity = '0.65';
          recordSrsAttempt(item.id, item.category, false);

          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.background = '#FFF6E8';
            feedbackEl.style.color = '#7A3E00';
            feedbackEl.textContent = `🤔 Nu este „${chosen}”. ${item.hint}`;
          }

          this.onStateChange({
            prompt: `Mai încearcă o dată: ${item.hint}`,
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
