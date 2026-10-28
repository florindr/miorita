// src/storage/db.ts — Local-First IndexedDB Engine with Delta Sync Support
// Conforms to Section 3.2 in design.md (attempts, srs, caiet, rug, settings)

import type { DomainDelta, MioritaDomain } from './syncTypes';

const DB_NAME = 'miorita_local_db';
const DB_VERSION = 1;

export class MioritaDB {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  static openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. attempts store
        if (!db.objectStoreNames.contains('attempts')) {
          const attemptsStore = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
          attemptsStore.createIndex('category', 'category', { unique: false });
          attemptsStore.createIndex('ts', 'ts', { unique: false });
        }

        // 2. srs store
        if (!db.objectStoreNames.contains('srs')) {
          const srsStore = db.createObjectStore('srs', { keyPath: 'itemId' });
          srsStore.createIndex('dueAt', 'dueAt', { unique: false });
        }

        // 3. caiet store
        if (!db.objectStoreNames.contains('caiet')) {
          const caietStore = db.createObjectStore('caiet', { keyPath: 'id', autoIncrement: true });
          caietStore.createIndex('category', 'category', { unique: false });
          caietStore.createIndex('ts', 'ts', { unique: false });
        }

        // 4. rug singleton store
        if (!db.objectStoreNames.contains('rug')) {
          db.createObjectStore('rug', { keyPath: 'key' });
        }

        // 5. settings singleton store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // 6. tutor_progress singleton store
        if (!db.objectStoreNames.contains('tutor_progress')) {
          db.createObjectStore('tutor_progress', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /** Record a learning attempt */
  static async recordAttempt(data: {
    itemId: string;
    category: string;
    correct: boolean;
    retries?: number;
    ms?: number;
  }): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('attempts', 'readwrite');
      const store = tx.objectStore('attempts');
      store.add({
        ...data,
        retries: data.retries ?? 0,
        ms: data.ms ?? 0,
        ts: Date.now(),
        clientUpdatedAt: Date.now(),
      });
      this.bumpVersion('attempts');
    } catch {
      // Fallback in environments without IDB
      const key = 'miorita_attempts_fallback';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...data, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
  }

  /** Save or update SRS Leitner item */
  static async saveSrs(item: {
    itemId: string;
    box: number;
    dueAt: string;
    lapses: number;
  }): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('srs', 'readwrite');
      tx.objectStore('srs').put({
        ...item,
        clientUpdatedAt: Date.now(),
      });
      this.bumpVersion('srs');
    } catch {
      const cards = JSON.parse(localStorage.getItem('miorita_srs_cards') || '{}');
      cards[item.itemId] = { ...item, nextReviewDate: item.dueAt };
      localStorage.setItem('miorita_srs_cards', JSON.stringify(cards));
    }
  }

  /** Log parent or agentic tutor error observation to Caietul lui Tata */
  static async addCaietEntry(entry: {
    said: string;
    correct: string;
    category: string;
    source: 'home' | 'gem' | 'tutor';
    itemId?: string;
  }): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('caiet', 'readwrite');
      tx.objectStore('caiet').add({
        ...entry,
        ts: Date.now(),
        clientUpdatedAt: Date.now(),
      });
      this.bumpVersion('caiet');
    } catch {
      const key = 'miorita_caiet_entries';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ ...entry, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(list));
    }
  }

  /** Save Tudor's Woven Rug progress */
  static async saveRug(rug: {
    stitchCount: number;
    unlockedMotifs: string[];
    rows: number;
  }): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('rug', 'readwrite');
      tx.objectStore('rug').put({
        key: 'main',
        ...rug,
        clientUpdatedAt: Date.now(),
      });
      this.bumpVersion('rug');
    } catch {
      localStorage.setItem('miorita_rug_state', JSON.stringify(rug));
    }
  }

  /** Save 1-Year Agentic Tutor Progress state */
  static async saveTutorProgress(progress: Record<string, any>): Promise<void> {
    try {
      const db = await this.openDB();
      if (db.objectStoreNames.contains('tutor_progress')) {
        const tx = db.transaction('tutor_progress', 'readwrite');
        tx.objectStore('tutor_progress').put({
          key: 'main',
          ...progress,
          clientUpdatedAt: Date.now(),
        });
      }
      this.bumpVersion('tutor_progress');
    } catch {
      localStorage.setItem('miorita_tutor_progress', JSON.stringify(progress));
    }
  }

  /** Get domain version for delta tracking */
  static getDomainVersion(domain: MioritaDomain): number {
    try {
      const versions = JSON.parse(localStorage.getItem('miorita_domain_versions') || '{}');
      return versions[domain] || 0;
    } catch {
      return 0;
    }
  }

  /** Bump domain version upon mutation */
  private static bumpVersion(domain: MioritaDomain): void {
    try {
      const versions = JSON.parse(localStorage.getItem('miorita_domain_versions') || '{}');
      versions[domain] = (versions[domain] || 0) + 1;
      localStorage.setItem('miorita_domain_versions', JSON.stringify(versions));
    } catch {}
  }

  /** Collect deltas ready to push to Cloudflare D1 */
  static async collectDeltas(): Promise<DomainDelta[]> {
    const deltas: DomainDelta[] = [];
    const domains: MioritaDomain[] = ['attempts', 'srs', 'caiet', 'rug', 'settings', 'tutor_progress'];

    for (const domain of domains) {
      const version = this.getDomainVersion(domain);
      if (version > 0) {
        deltas.push({
          domain,
          version,
          payload: { syncedAt: Date.now() },
          clientUpdatedAt: Date.now(),
        });
      }
    }

    return deltas;
  }
}
