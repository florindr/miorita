// src/components/syncStatusBadge.ts — Folk Sync Status Badge for Miorița Header
import { SyncEngine } from '../storage/syncEngine';
import type { SyncStatusState } from '../storage/syncTypes';

export class SyncStatusBadge {
  private element: HTMLButtonElement;
  private unsubscribe?: () => void;

  constructor() {
    this.element = document.createElement('button');
    this.element.id = 'syncStatusBadge';
    this.element.className = 'sync-status-badge';
    this.element.setAttribute('type', 'button');
    this.element.setAttribute('aria-label', 'Stare sincronizare progres');
    
    this.render(SyncEngine.getStatus());

    this.unsubscribe = SyncEngine.onStatusChange((status) => {
      this.render(status);
    });

    this.element.addEventListener('click', () => {
      SyncEngine.syncNow().catch(() => {});
    });
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  private render(status: SyncStatusState): void {
    let icon = '🐑';
    let text = 'Salvat';
    let statusClass = 'synced';
    let title = 'Conectat: Progresul și semnele de cusătură sunt salvate în nor';

    switch (status) {
      case 'syncing':
        icon = '🔄';
        text = 'Se așază...';
        statusClass = 'syncing';
        title = 'Se sincronizează progresul lui Tudor cu norul...';
        break;
      case 'offline':
        icon = '📡';
        text = 'Pe tabletă';
        statusClass = 'offline';
        title = 'Fără internet: Totul se salvează în siguranță pe tabletă';
        break;
      case 'error':
        icon = '⚠️';
        text = 'Reîncearcă';
        statusClass = 'error';
        title = 'Conexiune întreruptă. Apasă pentru a reîncerca sincronizarea.';
        break;
      case 'synced':
      default:
        icon = '🐑';
        text = 'Salvat';
        statusClass = 'synced';
        title = 'Conectat: Progresul și semnele de cusătură sunt salvate în nor';
        break;
    }

    this.element.title = title;
    this.element.className = `sync-status-badge status-${statusClass}`;
    this.element.innerHTML = `
      <span class="sync-icon ${status === 'syncing' ? 'spin' : ''}">${icon}</span>
      <span class="sync-text">${text}</span>
    `;
  }
}
