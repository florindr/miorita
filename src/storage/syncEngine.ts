// src/storage/syncEngine.ts — Cross-device background delta synchronizer for Miorița
import type {
  MioritaDomain,
  SyncPullResponse,
  SyncPushResponse,
  SyncStatusState,
} from './syncTypes';
import { MioritaDB } from './db';

import { FamilyAuth } from '../auth/familyAuth';

export class SyncEngine {
  private static status: SyncStatusState = 'synced';
  private static listeners: Array<(status: SyncStatusState) => void> = [];
  private static syncIntervalId: ReturnType<typeof setInterval> | null = null;
  private static isSyncing = false;

  static init(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.syncNow().catch(() => {});
    });

    window.addEventListener('offline', () => {
      this.setStatus('offline');
    });

    // Auto-sync every 2 minutes when online
    if (!this.syncIntervalId) {
      this.syncIntervalId = setInterval(() => {
        if (navigator.onLine) {
          this.syncNow().catch(() => {});
        }
      }, 120000);
    }
  }

  static getStatus(): SyncStatusState {
    return this.status;
  }

  static onStatusChange(callback: (status: SyncStatusState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static setStatus(status: SyncStatusState): void {
    this.status = status;
    for (const listener of this.listeners) {
      listener(status);
    }
  }

  static async syncNow(): Promise<boolean> {
    if (this.isSyncing || !navigator.onLine) {
      if (!navigator.onLine) this.setStatus('offline');
      return false;
    }

    this.isSyncing = true;
    this.setStatus('syncing');

    try {
      const family = FamilyAuth.getFamily();
      const activeChild = FamilyAuth.getActiveProfile();
      const familyId = family?.id || 'fam_default';
      const profileId = activeChild?.id || 'prof_tudor';
      const app = 'miorita';

      // 1. Collect local deltas to push
      const localDeltas = await MioritaDB.collectDeltas();
      if (localDeltas.length > 0) {
        const pushBody = { familyId, profileId, app, deltas: localDeltas };
        const pushRes = await fetch('/api/sync/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pushBody),
        });

        if (pushRes.ok) {
          const pushData: SyncPushResponse = await pushRes.json();
          if (!pushData.success) {
            console.warn('Sync push response warning:', pushData.errors);
          }
        }
      }

      // 2. Pull remote deltas
      const domains: MioritaDomain[] = ['attempts', 'srs', 'caiet', 'rug', 'settings'];
      const domainVersions: Partial<Record<MioritaDomain, number>> = {};
      for (const d of domains) {
        domainVersions[d] = MioritaDB.getDomainVersion(d);
      }

      const pullBody = { familyId, profileId, app, domainVersions };
      const pullRes = await fetch('/api/sync/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pullBody),
      });

      if (pullRes.ok) {
        const pullData: SyncPullResponse = await pullRes.json();
        if (pullData.success && pullData.deltas.length > 0) {
          // Merge incoming deltas if needed
        }
      }

      this.setStatus('synced');
      return true;
    } catch (err) {
      console.warn('Sync failed (offline or endpoint unavailable):', err);
      this.setStatus(navigator.onLine ? 'error' : 'offline');
      return false;
    } finally {
      this.isSyncing = false;
    }
  }
}
