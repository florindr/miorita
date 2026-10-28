import { MioritaDB } from '../storage/db';
import { SyncEngine } from '../storage/syncEngine';
import { TutorProgressManager } from '../storage/tutorProgress';
import {
  GrammarProficiencyStore,
  CUMULATIVE_NUGGET_LADDER,
} from '../storage/grammarProficiencyStore';
import { sound } from '../audio/synth';

export interface CaietEntry {
  id: string;
  said: string;
  correct: string;
  category: 'GEN' | 'CAS' | 'CLQ' | 'ART' | 'AGR' | 'POS' | 'SUB' | 'NUM' | 'CLI' | 'ORD';
  date: string;
  source: 'home' | 'gem' | 'tutor';
}

const STORAGE_KEY = 'miorita_caiet_entries';

export function getCaietEntries(): CaietEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCaietEntry(entry: Omit<CaietEntry, 'id' | 'date'>) {
  const entries = getCaietEntries();
  const newEntry: CaietEntry = {
    ...entry,
    id: 'C-' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

  // Persist to local-first IndexedDB and schedule cloud sync
  void MioritaDB.addCaietEntry({
    said: entry.said,
    correct: entry.correct,
    category: entry.category,
    source: entry.source
  }).then(() => {
    void SyncEngine.syncNow();
  });

  return newEntry;
}

export interface CaietModalOptions {
  onSelectNugget?: (nuggetIndex: number) => void;
  onOpenFullSyllabus?: () => void;
}

export class CaietulLuiTataModal {
  private container: HTMLElement;
  private onClose: () => void;
  private options?: CaietModalOptions;
  private activeTab: 'jurnal' | 'plan' = 'jurnal';

  constructor(container: HTMLElement, onClose: () => void, options?: CaietModalOptions) {
    this.container = container;
    this.onClose = onClose;
    this.options = options;
  }

  render() {
    const entries = getCaietEntries();
    const tutorState = TutorProgressManager.getState();
    const latestSession = tutorState.recentSessions[0];
    const spiral = GrammarProficiencyStore.getSpiralState();
    const activeNugget = GrammarProficiencyStore.getCurrentNuggetSpec();

    this.container.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(43, 38, 34, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;">
        <div style="background: var(--linen-pure); border: 3px solid var(--walnut); border-radius: var(--radius-lg); width: 100%; max-width: 780px; max-height: 90vh; overflow-y: auto; padding: 26px; box-shadow: 0 12px 36px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 18px;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--linen-dark); padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2 style="font-family: var(--font-serif); font-size: 22px; color: var(--walnut); margin: 0;">
                📓 Caietul lui Tata & Controlul Planului
              </h2>
              <p style="font-size: 12px; color: #7C6A58; margin: 2px 0 0 0;">
                Pepita activă a lui Tudor: <strong>${activeNugget.titleRo}</strong> (Pasul ${spiral.repInCurrentNugget + 1}/3)
              </p>
            </div>
            <button id="btnCloseCaiet" style="background: var(--linen-card); border: 1.5px solid var(--walnut); border-radius: 50%; width: 36px; height: 36px; font-size: 16px; cursor: pointer;">✕</button>
          </div>

          <!-- Parent Tabs -->
          <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--linen-dark); padding-bottom: 10px;">
            <button type="button" class="caiet-tab-btn" data-caiet-tab="jurnal" style="background: ${this.activeTab === 'jurnal' ? 'var(--walnut)' : 'var(--linen-card)'}; color: ${this.activeTab === 'jurnal' ? '#FFF' : 'var(--walnut)'}; border: 1.5px solid var(--walnut-light); border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 800; cursor: pointer;">
              ✏️ Jurnal de Greșeli & Recast (${entries.length})
            </button>
            <button type="button" class="caiet-tab-btn" data-caiet-tab="plan" style="background: ${this.activeTab === 'plan' ? 'var(--walnut)' : 'var(--linen-card)'}; color: ${this.activeTab === 'plan' ? '#FFF' : 'var(--walnut)'}; border: 1.5px solid var(--walnut-light); border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 800; cursor: pointer;">
              🧭 Cele 10 Pepite & Planul de 1 An
            </button>
          </div>

          ${
            this.activeTab === 'plan'
              ? `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: var(--linen-card); border: 1.5px solid var(--linen-dark); border-radius: 12px; padding: 14px 16px;">
                <div>
                  <strong style="font-size: 14px; color: var(--walnut);">Progresul Cumulativ pe Pepite (${spiral.masteredNuggets.length} / 10 stăpânite)</strong>
                  <div style="font-size: 12px; color: #6E6259;">Alege orice pepită de mai jos pentru a o seta ca lecție curentă pentru Tudor:</div>
                </div>
                ${
                  this.options?.onOpenFullSyllabus
                    ? `
                  <button type="button" id="btnOpenFullSyllabusFromCaiet" style="background: #FFF; border: 1.5px solid var(--walnut); border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 800; color: var(--walnut); cursor: pointer;">
                    🗓️ Vezi Programa Detaliată (96 Lecții) ➔
                  </button>
                `
                    : ''
                }
              </div>

              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${CUMULATIVE_NUGGET_LADDER.map((n) => {
                  const isCurrent = n.nuggetIndex === activeNugget.nuggetIndex;
                  const isMastered = spiral.masteredNuggets.includes(n.nuggetIndex);
                  const prof = GrammarProficiencyStore.getProficiency(n.pillarId);
                  return `
                    <div style="background: ${isCurrent ? '#FFFDF4' : '#FFF'}; border: 2px solid ${isCurrent ? 'var(--gold-bell)' : 'var(--linen-dark)'}; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                      <div style="flex: 1; min-width: 240px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 13px; font-weight: 800; color: var(--walnut);">
                            ${isMastered ? '✅ ' : isCurrent ? '🎯 ' : ''}${n.titleRo}
                          </span>
                          <span style="font-size: 11px; font-weight: 700; color: #7C6A58; background: var(--linen-card); padding: 2px 8px; border-radius: 999px;">
                            Scor pilon: ${prof.score}%
                          </span>
                        </div>
                        <div style="font-size: 12px; color: #5C4E43; margin-top: 3px;">
                          ${n.coreRuleRo}
                        </div>
                      </div>
                      <button
                        type="button"
                        class="parent-select-nugget-btn"
                        data-nugget-idx="${n.nuggetIndex}"
                        style="background: ${isCurrent ? 'var(--gold-bell)' : 'var(--walnut)'}; color: #FFF; border: none; border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 800; cursor: pointer;"
                      >
                        ${isCurrent ? 'Pepita Activă' : 'Activează ➔'}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `
              : `
            <!-- Agentic Tutor Live Sync Banner (FR-CAIET-003/004) -->
            <div style="background: linear-gradient(135deg, #FFF7E6, #FBF2DE); border: 1.5px solid #C8902E; border-radius: 12px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <strong style="font-family: var(--font-serif); font-size: 15px; color: var(--walnut);">
                  🐑 Sinteza Sesiunilor (${tutorState.totalSessionsCompleted} sesiuni parcurse · 🔥 ${tutorState.presence.sessionsThisWeek}/2 săpt. asta)
                </strong>
              </div>
              ${
                latestSession
                  ? `
                <div style="font-size: 13px; color: var(--walnut); margin-top: 6px;">
                  🍽️ <strong>Parola de Cină (${latestSession.date}):</strong>
                  <span style="font-weight: 700; color: #1E5B99;">„${latestSession.parolaDeCina}”</span>
                </div>
              `
                  : `<div style="font-size: 12px; color: #6E6259; margin-top: 4px;">Greșelile prinse de Miorița și cele adăugate de tine apar mai jos și sunt prioritizate automat în pepite.</div>`
              }
            </div>

            <!-- Quick 10s Error Logger Form -->
            <div style="background: var(--linen-card); border-radius: 12px; padding: 16px;">
              <h3 style="font-family: var(--font-serif); font-size: 16px; margin: 0 0 10px 0; color: var(--walnut);">
                ✏️ Adaugă o greșeală auzită în casă (10 secunde):
              </h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div>
                  <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Ce a zis Tudor:</label>
                  <input type="text" id="inputSaid" placeholder="ex: casa la bunica" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--walnut-light); border-radius: 8px; font-size: 14px;" />
                </div>
                <div>
                  <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Forma corectă:</label>
                  <input type="text" id="inputCorrect" placeholder="ex: casa bunicii" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--walnut-light); border-radius: 8px; font-size: 14px;" />
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; gap: 6px; align-items: center;">
                  <span style="font-size: 12px; font-weight: 700;">Categorie:</span>
                  <select id="selectCategory" style="padding: 7px 10px; border: 1.5px solid var(--walnut-light); border-radius: 8px; font-weight: 600; font-size: 13px;">
                    <option value="CAS">CAS (Genitiv/Dativ - casa bunicii)</option>
                    <option value="GEN">GEN (Genul - un casă, doi trenuri)</option>
                    <option value="CLQ">CLQ (Englezisme - sunt 8 ani)</option>
                    <option value="ART">ART (Articol - câinele, pe masă)</option>
                    <option value="SUB">SUB (Să - vreau să merg)</option>
                    <option value="POS">POS (Posesiv - un prieten al meu)</option>
                    <option value="NUM">NUM (Numerale - 20 de mașini)</option>
                    <option value="CLI">CLI (Clitic - l-am văzut pe Ion)</option>
                    <option value="AGR">AGR (Acord - o mașină roșie)</option>
                    <option value="ORD">ORD (Topică - mașina roșie)</option>
                  </select>
                </div>

                <button id="btnSaveQuick" style="background: var(--gen-neutru); color: #FFF; border: none; border-radius: 999px; padding: 9px 18px; font-weight: 800; font-size: 13px; cursor: pointer;">
                  Salvează în Caiet ✓
                </button>
              </div>
            </div>

            <!-- Logged Errors History -->
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 16px; color: var(--walnut); margin: 0 0 10px 0;">
                📋 Greșeli înregistrate recent (${entries.length}):
              </h3>
              <div style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;" id="entriesList">
                ${entries.length === 0 ? '<p style="font-size: 13px; color: #888;">Nicio greșeală înregistrată încă.</p>' : ''}
                ${entries.map(e => `
                  <div style="background: #FFF; border: 1.5px solid var(--linen-dark); border-radius: 8px; padding: 9px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <span style="background: rgba(178, 58, 46, 0.1); color: var(--gen-feminin); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-right: 8px;">${e.category}</span>
                      <del style="color: var(--gen-feminin);">${e.said}</del>
                      <span style="margin: 0 6px;">➔</span>
                      <strong style="color: var(--gen-neutru);">${e.correct}</strong>
                    </div>
                    <span style="font-size: 11px; color: #999;">${e.date}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Weekly Parent Insights & Dinner Recast Card -->
            <div style="background: var(--linen-card); border-left: 4px solid var(--gen-masculin); border-radius: 10px; padding: 14px 16px;">
              <h3 style="font-family: var(--font-serif); font-size: 15px; color: var(--walnut); margin: 0 0 6px 0;">
                📊 Tehnica Recasting la Cină (Fără corectare directă)
              </h3>
              <p style="font-size: 12px; color: #5C4E43; line-height: 1.45; margin: 0;">
                Când Tudor spune <em>„Mergem la casa la bunica?”</em>, răspunde-i natural: <em>„Da, mergem <strong>la casa bunicii</strong>!”</em> — fără să îi spui că a greșit.
              </p>
            </div>
          `
          }

        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    this.container.querySelector('#btnCloseCaiet')?.addEventListener('click', () => {
      this.container.innerHTML = '';
      this.onClose();
    });

    this.container.querySelectorAll('.caiet-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playWoodenTap();
        const tab = (btn as HTMLElement).getAttribute('data-caiet-tab') as 'jurnal' | 'plan';
        if (tab) {
          this.activeTab = tab;
          this.render();
        }
      });
    });

    this.container.querySelectorAll('.parent-select-nugget-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).getAttribute('data-nugget-idx'));
        if (idx >= 1) {
          GrammarProficiencyStore.setActiveNugget(idx);
          sound.playBrassBell();
          this.container.innerHTML = '';
          this.onClose();
          if (this.options?.onSelectNugget) {
            this.options.onSelectNugget(idx);
          }
        }
      });
    });

    this.container.querySelector('#btnOpenFullSyllabusFromCaiet')?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.container.innerHTML = '';
      this.onClose();
      if (this.options?.onOpenFullSyllabus) {
        this.options.onOpenFullSyllabus();
      }
    });

    const inputSaid = this.container.querySelector('#inputSaid') as HTMLInputElement | null;
    const inputCorrect = this.container.querySelector('#inputCorrect') as HTMLInputElement | null;
    const selectCategory = this.container.querySelector('#selectCategory') as HTMLSelectElement | null;

    if (inputSaid && selectCategory) {
      inputSaid.addEventListener('input', () => {
        const text = inputSaid.value.toLowerCase();
        if (text.includes(' la ') || text.includes('lui ') || text.includes('casa ')) {
          selectCategory.value = 'CAS';
        } else if (text.includes('sunt 8') || text.includes('face sens') || text.includes('sunt rece')) {
          selectCategory.value = 'CLQ';
        } else if (text.includes('un cas') || text.includes('doi tren')) {
          selectCategory.value = 'GEN';
        } else if (text.includes('pe masa') || text.includes('în casa')) {
          selectCategory.value = 'ART';
        }
      });
    }

    this.container.querySelector('#btnSaveQuick')?.addEventListener('click', () => {
      if (!inputSaid?.value || !inputCorrect?.value || !selectCategory) return;
      saveCaietEntry({
        said: inputSaid.value,
        correct: inputCorrect.value,
        category: selectCategory.value as any,
        source: 'home'
      });
      this.render();
    });
  }
}
