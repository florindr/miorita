// src/stations/stanaMioritei.ts — Stâna Mioriței & Covorul lui Tudor (FR-REW-001)
// Interactive woven Romanian folk rug (scoarță / lăvicer) and motif gallery that unlocks with progress.

import { STARTER_MOTIFS, renderMotifSVG } from '../motifs/motifRenderer';
import { sound } from '../audio/synth';

export class StanaMioriteiStation {
  private totalStitches: number;

  constructor(totalStitches: number) {
    this.totalStitches = totalStitches;
  }

  render(container: HTMLElement) {
    const rows = Math.min(12, Math.floor(this.totalStitches / 15) + 3);
    const unlockedCount = Math.min(STARTER_MOTIFS.length, Math.floor(this.totalStitches / 20) + 1);

    container.innerHTML = `
      <section class="station-card">
        <div class="station-banner">
          <img src="/art/stations/stana_mioritei.jpg" alt="Stâna Mioriței" onerror="this.parentElement.style.display='none';"/>
        </div>
        <div class="station-header">
          <h2>Stâna Mioriței & Covorul lui Tudor 🐑🧵</h2>
          <p>Fiecare răspuns corect adaugă fire și motive străvechi în lăvicerul tău!</p>
        </div>

        <div style="text-align: center; margin: 10px 0;">
          <div style="font-size: 16px; font-weight: 600; color: var(--walnut); margin-bottom: 12px;">
            Total cusături țesute: <strong>${this.totalStitches} ochiuri</strong>
          </div>

          <!-- The SVG Woven Rug (Scoarță Românească) -->
          <div style="background: #FDFBF7; border: 4px solid var(--walnut); border-radius: 8px; padding: 20px; box-shadow: var(--card-shadow); max-width: 600px; margin: 0 auto; position: relative;">
            
            <!-- Fringe on top -->
            <div style="display: flex; justify-content: space-around; margin-bottom: 8px;">
              ${Array.from({ length: 24 }).map(() => `<span style="display:inline-block; width:2px; height:14px; background:var(--walnut-light);"></span>`).join('')}
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
              ${Array.from({ length: 24 }).map(() => `<span style="display:inline-block; width:2px; height:14px; background:var(--walnut-light);"></span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Unlocked Motifs Gallery -->
        <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 20px; margin-top: 16px;">
          <h3 style="font-family: var(--font-serif); font-size: 18px; color: var(--walnut); margin-bottom: 12px; text-align: center;">
            🌟 Motive Tradiționale Deblocate (${unlockedCount} / ${STARTER_MOTIFS.length})
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px;">
            ${STARTER_MOTIFS.map((motif, idx) => {
              const isUnlocked = idx < unlockedCount;
              return `
                <div class="motif-card" data-motif="${motif.id}" style="background: ${isUnlocked ? '#FFF' : 'rgba(255,255,255,0.4)'}; border: 2px solid ${isUnlocked ? 'var(--walnut)' : 'var(--walnut-light)'}; border-radius: 8px; padding: 12px; text-align: center; cursor: ${isUnlocked ? 'pointer' : 'default'}; opacity: ${isUnlocked ? 1 : 0.6}; transition: transform 0.2s;">
                  <div style="min-height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    ${isUnlocked ? renderMotifSVG(motif, 7) : '<span style="font-size:32px;">🔒</span>'}
                  </div>
                  <div style="font-family: var(--font-serif); font-size: 14px; font-weight: bold; color: var(--walnut); margin-bottom: 4px;">
                    ${motif.nameRo}
                  </div>
                  <div style="font-size: 11px; color: #6E6259; line-height: 1.3;">
                    ${isUnlocked ? motif.description : `Se deblochează la ${(idx + 1) * 20} ochiuri`}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lada de Zestre (Folk Badges & Collectibles FR-REW-003) -->
        <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 20px; margin-top: 16px;">
          <h3 style="font-family: var(--font-serif); font-size: 18px; color: var(--walnut); margin-bottom: 4px; text-align: center;">
            🎁 Lada de Zestre a lui Tudor
          </h3>
          <p style="text-align: center; font-size: 13px; color: #6E6259; margin-bottom: 14px;">
            Insigne populare primite de la Miorița pe măsură ce stăpânești vorba curată:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
            ${FOLK_BADGES.map((b) => {
              const isEarned = this.totalStitches >= b.requiredStitches;
              return `
                <div class="badge-card" data-badge="${b.title}" style="background: ${isEarned ? '#FFF' : 'rgba(255,255,255,0.4)'}; border: 2px solid ${isEarned ? 'var(--gold-bell)' : 'var(--walnut-light)'}; border-radius: 8px; padding: 12px 8px; text-align: center; cursor: ${isEarned ? 'pointer' : 'default'}; opacity: ${isEarned ? 1 : 0.6}; transition: transform 0.2s;">
                  <div style="font-size: 32px; margin-bottom: 4px;">
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
        const id = card.getAttribute('data-motif');
        const motif = STARTER_MOTIFS.find((m) => m.id === id);
        if (motif) {
          sound.playBrassBell();
          sound.speakRomanian(`${motif.nameRo}. ${motif.description}`);
        }
      });
    });

    container.querySelectorAll('.badge-card').forEach((card) => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-badge');
        sound.playBrassBell();
        sound.speakRomanian(`Insigna ${title}! Ai adăugat-o în lada ta de zestre.`);
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
