// src/components/tutorWidgets/checkpointTrailWidget.ts — W6: Harta de 1 An & Focul de la Stână
// End-of-session & Stâna Mioriței visual showing Focul de la Stână, 12-Checkpoint Carpathian trail, and Parola de Cină.

import { TutorProgressManager } from '../../storage/tutorProgress';
import { sound } from '../../audio/synth';
import type { CheckpointTrailConfig } from './widgetTypes';

export class CheckpointTrailWidget {
  private container: HTMLElement;
  private config: CheckpointTrailConfig;

  constructor(container: HTMLElement, config: CheckpointTrailConfig) {
    this.container = container;
    this.config = config;
    this.render();
  }

  private getCampfireBadge(): { icon: string; label: string; desc: string } {
    switch (this.config.campfireState) {
      case 'super_scantei':
        return {
          icon: '🔥🔥✨',
          label: 'Super-Scântei (Lână de Aur!)',
          desc: `${this.config.sessionsThisWeek} sesiuni săptămâna aceasta — Focul strălucește cu scântei de aur!`,
        };
      case 'blazing':
        return {
          icon: '🔥🔥',
          label: 'Foc Voioc (Ținta de ≥2x atinsă!)',
          desc: `${this.config.sessionsThisWeek} / 2 sesiuni săptămâna aceasta — Ai câștigat Steaua Stânei!`,
        };
      case 'glowing':
        return {
          icon: '🔥',
          label: 'Jar Cald (1 / 2 săptămâna aceasta)',
          desc: 'Încă o sesiune de 10 minute săptămâna asta și aprindem Focul cel Mare!',
        };
      default:
        return {
          icon: '🪵✨',
          label: 'Vatra Stânei te așteaptă',
          desc: '2 sesiuni scurte pe săptămână țin focul cald la stână (fără nicio penalizare!).',
        };
    }
  }

  private render(): void {
    const allCheckpoints = TutorProgressManager.getAllCheckpoints();
    const fire = this.getCampfireBadge();

    const trailNodesHtml = allCheckpoints
      .map((cp) => {
        const isDone = this.config.completedCheckpoints.includes(cp.checkpointId);
        const isCurrent = cp.checkpointId === this.config.currentCheckpointId && !isDone;
        const statusClass = isDone ? 'cp-done' : isCurrent ? 'cp-active' : 'cp-locked';
        const icon = isDone ? '🌟' : isCurrent ? '🐑' : '🔒';
        return `
          <div class="carpathian-trail-node ${statusClass}" title="${cp.nameRo} (${cp.primaryCategory})">
            <div class="trail-node-badge">${icon} P${cp.checkpointId}</div>
            <div class="trail-node-title">${cp.nameRo.replace(/^Popasul \d+:\s*/, '')}</div>
            <div class="trail-node-meta">${cp.primaryCategory} · ${cp.requiredSessions} ses.</div>
          </div>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="tutor-widget-card tutor-widget-trail" data-widget="CheckpointTrailWidget">
        <div class="tutor-widget-header">
          <span class="tutor-widget-badge">🏔️ Călătoria de 1 An prin Carpați · Sezonul ${this.config.currentSeason}</span>
          <span class="tutor-widget-reward">🌟 +${this.config.goldenStitchesEarned} Ochiuri de Aur țesute!</span>
        </div>

        <h3 class="tutor-widget-title">${this.config.titleRo}</h3>

        <div class="trail-campfire-banner state-${this.config.campfireState}">
          <div class="campfire-icon-large">${fire.icon}</div>
          <div class="campfire-info">
            <div class="campfire-title">Focul de la Stână: ${fire.label}</div>
            <div class="campfire-desc">${fire.desc}</div>
          </div>
        </div>

        <div class="carpathian-trail-grid">
          ${trailNodesHtml}
        </div>

        ${
          this.config.parolaDeCina
            ? `
          <div class="parola-de-cina-card">
            <div class="parola-header">🍽️ Parola Secretă de Cină pentru Tata:</div>
            <div class="parola-phrase">„${this.config.parolaDeCina}”</div>
            <button type="button" id="listenParolaBtn" class="tutor-widget-secondary-btn">
              🔊 Ascultă Parola de Cină
            </button>
          </div>
        `
            : ''
        }
      </div>
    `;

    const listenBtn = this.container.querySelector('#listenParolaBtn');
    if (listenBtn && this.config.parolaDeCina) {
      listenBtn.addEventListener('click', () => {
        sound.playWoodenTap();
        sound.speakRomanian(this.config.parolaDeCina);
      });
    }
  }
}

