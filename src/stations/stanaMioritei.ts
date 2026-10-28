// src/stations/stanaMioritei.ts — Stâna Mioriței & Covorul lui Tudor (FR-REW-001)
// Interactive woven Romanian folk rug (scoarță / lăvicer) and motif gallery that unlocks with progress.

import { STARTER_MOTIFS, renderMotifSVG } from '../motifs/motifRenderer';
import { sound } from '../audio/synth';
import { GrammarProficiencyStore, CUMULATIVE_NUGGET_LADDER } from '../storage/grammarProficiencyStore';

export class StanaMioriteiStation {
  private totalStitches: number;

  constructor(totalStitches: number) {
    this.totalStitches = totalStitches;
  }

  render(container: HTMLElement) {
    const rows = Math.min(12, Math.floor(this.totalStitches / 15) + 3);
    const unlockedCount = Math.min(STARTER_MOTIFS.length, Math.floor(this.totalStitches / 20) + 1);
    const spiral = GrammarProficiencyStore.getSpiralState();

    container.innerHTML = `
      <section style="max-width: 720px; margin: 12px auto; background: #FFFDF9; border: 2px solid var(--linen-dark); border-radius: 20px; padding: 26px 28px; box-shadow: 0 8px 28px rgba(62, 42, 30, 0.06); display: flex; flex-direction: column; gap: 22px;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--linen-dark); padding-bottom: 12px;">
          <div>
            <h2 style="font-family: var(--font-serif); font-size: 22px; color: var(--walnut); margin: 0;">
              🧵 Covorul lui Tudor
            </h2>
            <p style="font-size: 13px; color: #7C6A58; margin: 2px 0 0 0;">
              Fiecare pepită învățată adaugă fire și motive tradiționale în covorul tău!
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: var(--linen-card); border: 1px solid var(--linen-dark); border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 800; color: var(--walnut);">
              🌟 Pepite: ${spiral.masteredNuggets.length} / ${CUMULATIVE_NUGGET_LADDER.length}
            </span>
            <span style="background: #FFFDF0; border: 1.5px solid var(--gold-bell); border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 800; color: #8A5A00;">
              🔔 ${this.totalStitches} ochiuri
            </span>
          </div>
        </div>

        <div style="text-align: center;">
          <!-- The SVG Woven Rug (Scoarță Românească) -->
          <div style="background: #FDFBF7; border: 3px solid var(--walnut); border-radius: 12px; padding: 18px; max-width: 560px; margin: 0 auto; position: relative;">
            
            <!-- Fringe on top -->
            <div style="display: flex; justify-content: space-around; margin-bottom: 8px;">
              ${Array.from({ length: 24 }).map(() => `<span style="display:inline-block; width:2px; height:12px; background:var(--walnut-light);"></span>`).join('')}
            </div>

            <svg viewBox="0 0 300 ${rows * 20}" width="100%" height="${rows * 20}" style="display: block; border-radius: 4px;">
              <defs>
                <pattern id="woolThread" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#FAF5EB" />
                  <line x1="0" y1="0" x2="10" y2="10" stroke="#DFD3BF" stroke-width="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#woolThread)" />

              <!-- Woven Rows of Folk Cross-Stitch Motifs -->
              ${Array.from({ length: rows }).map((_, r) => {
                const isRed = r % 3 === 0;
                const isBlue = r % 3 === 1;
                const strokeColor = isRed ? '#B23A2E' : (isBlue ? '#2F5D8A' : '#5E7D53');

                return `
                  <g transform="translate(10, ${r * 20 + 10})">
                    ${Array.from({ length: 14 }).map((_, c) => `
                      <path d="M ${c * 20} 0 L ${c * 20 + 10} 10 M ${c * 20 + 10} 0 L ${c * 20} 10" 
                            stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="square" />
                    `).join('')}
                  </g>
                `;
              }).join('')}
            </svg>

            <!-- Fringe on bottom -->
            <div style="display: flex; justify-content: space-around; margin-top: 8px;">
              ${Array.from({ length: 24 }).map(() => `<span style="display:inline-block; width:2px; height:12px; background:var(--walnut-light);"></span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Unlocked Motifs Gallery -->
        <div style="background: var(--linen-card); border-radius: 14px; padding: 18px;">
          <h3 style="font-family: var(--font-serif); font-size: 16px; color: var(--walnut); margin: 0 0 12px 0;">
            🌟 Motive Tradiționale Deblocate (${unlockedCount} / ${STARTER_MOTIFS.length})
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 12px;">
            ${STARTER_MOTIFS.map((motif, idx) => {
              const isUnlocked = idx < unlockedCount;
              return `
                <div class="motif-card" data-motif="${motif.id}" style="background: ${isUnlocked ? '#FFF' : 'rgba(255,255,255,0.4)'}; border: 1.5px solid ${isUnlocked ? 'var(--walnut)' : 'var(--linen-dark)'}; border-radius: 10px; padding: 10px; text-align: center; cursor: ${isUnlocked ? 'pointer' : 'default'}; opacity: ${isUnlocked ? 1 : 0.6};">
                  <div style="min-height: 76px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    ${isUnlocked ? renderMotifSVG(motif, 6) : '<span style="font-size:26px;">🔒</span>'}
                  </div>
                  <div style="font-family: var(--font-serif); font-size: 13px; font-weight: bold; color: var(--walnut); margin-bottom: 2px;">
                    ${motif.nameRo}
                  </div>
                  <div style="font-size: 11px; color: #6E6259; line-height: 1.3;">
                    ${isUnlocked ? motif.description : `La ${(idx + 1) * 20} ochiuri`}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lada de Zestre (Folk Badges & Collectibles FR-REW-003) -->
        <div style="background: var(--linen-card); border-radius: 14px; padding: 18px;">
          <h3 style="font-family: var(--font-serif); font-size: 16px; color: var(--walnut); margin: 0 0 10px 0;">
            🎁 Lada de Zestre
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 10px;">
            ${FOLK_BADGES.map((b) => {
              const isEarned = this.totalStitches >= b.requiredStitches;
              return `
                <div class="badge-card" data-badge="${b.title}" style="background: ${isEarned ? '#FFF' : 'rgba(255,255,255,0.4)'}; border: 1.5px solid ${isEarned ? 'var(--gold-bell)' : 'var(--linen-dark)'}; border-radius: 10px; padding: 10px 8px; text-align: center; cursor: ${isEarned ? 'pointer' : 'default'}; opacity: ${isEarned ? 1 : 0.6};">
                  <div style="font-size: 28px; margin-bottom: 4px;">
                    ${isEarned ? b.icon : '🔒'}
                  </div>
                  <div style="font-family: var(--font-serif); font-size: 13px; font-weight: bold; color: var(--walnut); margin-bottom: 2px;">
                    ${b.title}
                  </div>
                  <div style="font-size: 11px; color: #6E6259;">
                    ${isEarned ? b.desc : `La ${b.requiredStitches} ochiuri`}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
  }

  private bindEvents(container: HTMLElement) {
    container.querySelectorAll('.motif-card').forEach((card) => {
      card.addEventListener('click', () => {
        sound.playBrassBell();
      });
    });

    container.querySelectorAll('.badge-card').forEach((card) => {
      card.addEventListener('click', () => {
        sound.playBrassBell();
      });
    });
  }
}

export interface FolkBadge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  requiredStitches: number;
}

export const FOLK_BADGES: FolkBadge[] = [
  { id: 'pastor', icon: '🐑', title: 'Păstorul Cuvintelor', desc: 'Prima sesiune în satul românesc', requiredStitches: 10 },
  { id: 'mester', icon: '🧶', title: 'Meșterul Țesător', desc: 'Primul motiv tradițional descifrat', requiredStitches: 20 },
  { id: 'vanator', icon: '🦅', title: 'Vânătorul Iscusit', desc: 'Englezisme vânate și înlocuite', requiredStitches: 40 },
  { id: 'podar', icon: '🪵', title: 'Meșterul Podului', desc: 'Stăpânirea formelor „casa bunicii”', requiredStitches: 60 },
  { id: 'clitic', icon: '⛰️', title: 'Ecoul Carpaților', desc: 'Dublarea pronumelor cu «pe»', requiredStitches: 80 },
  { id: 'boier', icon: '👑', title: 'Boierul Vorbelor Curate', desc: 'Peste 100 de ochiuri de lăvicer', requiredStitches: 100 }
];
