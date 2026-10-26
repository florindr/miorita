import { MioritaDB } from '../storage/db';
import { SyncEngine } from '../storage/syncEngine';

export interface CaietEntry {
  id: string;
  said: string;
  correct: string;
  category: 'GEN' | 'CAS' | 'CLQ' | 'ART' | 'AGR' | 'POS' | 'SUB' | 'NUM' | 'CLI' | 'ORD';
  date: string;
  source: 'home' | 'gem';
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

export class CaietulLuiTataModal {
  private container: HTMLElement;
  private onClose: () => void;

  constructor(container: HTMLElement, onClose: () => void) {
    this.container = container;
    this.onClose = onClose;
  }

  render() {
    const entries = getCaietEntries();

    this.container.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(43, 38, 34, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;">
        <div style="background: var(--linen-pure); border: 3px solid var(--walnut); border-radius: var(--radius-lg); width: 100%; max-width: 760px; max-height: 90vh; overflow-y: auto; padding: 28px; box-shadow: 0 12px 36px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 20px;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--walnut-light); padding-bottom: 12px;">
            <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--walnut); margin: 0;">
              📓 Caietul lui Tata & Import Gem
            </h2>
            <button id="btnCloseCaiet" style="background: var(--linen-card); border: 2px solid var(--walnut); border-radius: 50%; width: 36px; height: 36px; font-size: 18px; cursor: pointer;">✕</button>
          </div>

          <!-- Quick 10s Error Logger Form -->
          <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 18px;">
            <h3 style="font-family: var(--font-serif); font-size: 17px; margin-bottom: 12px; color: var(--walnut);">
              ✏️ Adaugă o greșeală auzită în casă (10 secunde):
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Ce a zis Tudor:</label>
                <input type="text" id="inputSaid" placeholder="ex: am fost la casa la bunica" style="width: 100%; padding: 10px 14px; border: 2px solid var(--walnut-light); border-radius: 8px; font-size: 15px;" />
              </div>
              <div>
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Forma corectă:</label>
                <input type="text" id="inputCorrect" placeholder="ex: la casa bunicii" style="width: 100%; padding: 10px 14px; border: 2px solid var(--walnut-light); border-radius: 8px; font-size: 15px;" />
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; gap: 6px; align-items: center;">
                <span style="font-size: 13px; font-weight: 600;">Categorie:</span>
                <select id="selectCategory" style="padding: 8px 12px; border: 2px solid var(--walnut-light); border-radius: 8px; font-weight: 600;">
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

              <button id="btnSaveQuick" style="background: var(--gen-neutru); color: #FFF; border: none; border-radius: 8px; padding: 10px 20px; font-weight: bold; font-size: 15px; cursor: pointer;">
                Salvează în Caiet ✓
              </button>
            </div>
          </div>

          <!-- Gem JSON Import Section -->
          <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 18px;">
            <h3 style="font-family: var(--font-serif); font-size: 17px; margin-bottom: 8px; color: var(--walnut);">
              📥 Importă sinteza din sesiunea Gemini Gem (PENTRU TATA):
            </h3>
            <p style="font-size: 13px; color: #6E6259; margin-bottom: 10px;">
              Lipește mai jos blocul JSON dat de Miorița la sfârșitul conversației vocale:
            </p>
            <textarea id="jsonInput" rows="3" placeholder='{"miorita_import": 1, "errors": [{"said": "casa la bunica", "correct": "casa bunicii", "category": "CAS"}]}' style="width: 100%; padding: 10px; border: 2px solid var(--walnut-light); border-radius: 8px; font-family: monospace; font-size: 13px;"></textarea>
            <div style="text-align: right; margin-top: 8px;">
              <button id="btnImportJson" style="background: var(--gen-masculin); color: #FFF; border: none; border-radius: 8px; padding: 8px 18px; font-weight: bold; font-size: 14px; cursor: pointer;">
                Importă Greșelile
              </button>
            </div>
          </div>

          <!-- Logged Errors History & Recast Tips -->
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 18px; color: var(--walnut); margin-bottom: 12px;">
              📋 Greșeli înregistrate recent (${entries.length}):
            </h3>
            <div style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;" id="entriesList">
              ${entries.length === 0 ? '<p style="font-size: 14px; color: #888;">Nicio greșeală înregistrată încă. Adaugă una mai sus!</p>' : ''}
              ${entries.map(e => `
                <div style="background: #FFF; border: 1.5px solid var(--walnut-light); border-radius: 8px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="background: rgba(178, 58, 46, 0.1); color: var(--gen-feminin); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 8px;">${e.category}</span>
                    <del style="color: var(--gen-feminin);">${e.said}</del>
                    <span style="margin: 0 6px;">➔</span>
                    <strong style="color: var(--gen-neutru);">${e.correct}</strong>
                  </div>
                  <span style="font-size: 12px; color: #999;">${e.date}</span>
                </div>
              `).join('')}
          <!-- Weekly Parent Insights & Dinner Recast Card (FR-CAIET-004) -->
          <div style="background: var(--linen-card); border-left: 4px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <h3 style="font-family: var(--font-serif); font-size: 17px; color: var(--walnut); margin: 0;">
                📊 Foaia de Duminică & Tehnici Recast la Masă
              </h3>
              <span style="font-size: 12px; background: rgba(30, 91, 153, 0.12); color: var(--gen-masculin); font-weight: bold; padding: 2px 8px; border-radius: 4px;">
                Ghid pentru Florin
              </span>
            </div>
            
            <p style="font-size: 13px; color: #5C4E43; line-height: 1.45; margin-bottom: 12px;">
              <strong>Principiul Recasting (Fără corectare directă):</strong> La cină sau în mașină, nu-i spune lui Tudor «Nu se zice așa!». În schimb, validează mesajul și repetă propoziția lui în mod natural, integrând forma corectă românească.
            </p>

            <div style="background: #FFF; border: 1.5px solid var(--walnut-light); border-radius: 8px; padding: 12px 14px; font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
              <div style="color: var(--walnut);">
                💬 <strong>Exemplu Recast 1 (Vârstă):</strong><br/>
                <em>Tudor:</em> „Tati, eu sunt 8 ani și colegul meu e 9.”<br/>
                <em>Florin (Recast):</em> „Da, tati, <strong>ai 8 ani</strong> deja! Ce repede ai crescut de când aveai 7 ani!”
              </div>
              <div style="border-top: 1px dashed var(--walnut-light);"></div>
              <div style="color: var(--walnut);">
                💬 <strong>Exemplu Recast 2 (Posesie):</strong><br/>
                <em>Tudor:</em> „Mergem mâine la casa la bunica?”<br/>
                <em>Florin (Recast):</em> „Sigur, mergem <strong>la casa bunicii</strong>! Ne așteaptă cu gogoși calde.”
              </div>
              <div style="border-top: 1px dashed var(--walnut-light);"></div>
              <div style="color: var(--walnut);">
                💬 <strong>Exemplu Recast 3 (Dublare clitică):</strong><br/>
                <em>Tudor:</em> „Am văzut Ion în pauză la școală.”<br/>
                <em>Florin (Recast):</em> „Aaa, <strong>l-ai văzut pe Ion</strong>? Și ce v-ați jucat împreună?”
              </div>
            </div>
          </div>

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

    const inputSaid = this.container.querySelector('#inputSaid') as HTMLInputElement;
    const inputCorrect = this.container.querySelector('#inputCorrect') as HTMLInputElement;
    const selectCategory = this.container.querySelector('#selectCategory') as HTMLSelectElement;

    // Keyword heuristics for auto-suggesting category
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

    this.container.querySelector('#btnSaveQuick')?.addEventListener('click', () => {
      if (!inputSaid.value || !inputCorrect.value) return;
      saveCaietEntry({
        said: inputSaid.value,
        correct: inputCorrect.value,
        category: selectCategory.value as any,
        source: 'home'
      });
      this.render();
    });

    this.container.querySelector('#btnImportJson')?.addEventListener('click', () => {
      const textarea = this.container.querySelector('#jsonInput') as HTMLTextAreaElement;
      try {
        const parsed = JSON.parse(textarea.value);
        if (parsed.errors && Array.isArray(parsed.errors)) {
          parsed.errors.forEach((err: any) => {
            saveCaietEntry({
              said: err.said || '',
              correct: err.correct || '',
              category: err.category || 'CAS',
              source: 'gem'
            });
          });
          alert(`Succes! S-au importat ${parsed.errors.length} greșeli din sesiunea Gem!`);
          this.render();
        }
      } catch {
        alert('Formatul JSON nu a putut fi citit. Asigură-te că copiezi blocul de cod dat de Miorița.');
      }
    });
  }
}
