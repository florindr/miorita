// src/storage/adaptiveEngine.ts — Multi-Domain Dynamic Difficulty Adjustment (DDA) Engine
// Safe for kids under 13: automatic, gentle, non-punitive promotion & assistance.
// Scoped per active child profile and domain (e.g. 'genuri', 'articole', 'numere').

export type WordDifficulty = 1 | 2 | 3;

export interface TierMeta {
  level: WordDifficulty;
  label: string;
  badge: string;
  color: string;
  desc: string;
}

export const TIER_METAS: Record<WordDifficulty, TierMeta> = {
  1: {
    level: 1,
    label: 'Ucenic',
    badge: '🌱 Ucenic',
    color: 'var(--gen-neutru)',
    desc: 'Cuvinte clare cu terminații obișnuite (ex: casă, tren, băiat)',
  },
  2: {
    level: 2,
    label: 'Călător',
    badge: '🌿 Călător',
    color: 'var(--gen-masculin)',
    desc: 'Alternanțe de sunete și cuvinte în -e (ex: câine, carte, ou)',
  },
  3: {
    level: 3,
    label: 'Meșter Mare',
    badge: '⭐ Meșter Mare',
    color: 'var(--gold-bell)',
    desc: 'Capcane avansate și neutre înșelătoare (ex: perete, nume, ochi)',
  },
};

export interface DomainMastery {
  profileId: string;
  domain: string;
  currentLevel: WordDifficulty;
  streak: number;
  highestStreak: number;
  totalCorrect: number;
  totalAttempts: number;
  recentHistory: boolean[];
  lastUpdated: number;
}

export interface AdaptiveAttemptResult {
  promoted: boolean;
  demoted: boolean;
  currentLevel: WordDifficulty;
  streak: number;
  masteryPercentage: number;
}

class AdaptiveStorage {
  private static mem = new Map<string, string>();

  static getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return this.mem.get(key) || null;
      }
    }
    return this.mem.get(key) || null;
  }

  static setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {
        // fallback
      }
    }
    this.mem.set(key, value);
  }

  static removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return;
      } catch {
        // fallback
      }
    }
    this.mem.delete(key);
  }
}

export class AdaptiveEngine {
  private static getKey(profileId: string, domain: string): string {
    return `miorita_adaptive_${profileId || 'default'}_${domain}`;
  }

  /** Retrieve the current mastery profile for a child and domain */
  static getMastery(profileId: string, domain: string): DomainMastery {
    const key = this.getKey(profileId, domain);
    try {
      const saved = AdaptiveStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }

    const initial: DomainMastery = {
      profileId: profileId || 'default',
      domain,
      currentLevel: 1,
      streak: 0,
      highestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      recentHistory: [],
      lastUpdated: Date.now(),
    };

    return initial;
  }

  /** Save mastery record to local storage */
  private static saveMastery(record: DomainMastery): void {
    const key = this.getKey(record.profileId, record.domain);
    try {
      AdaptiveStorage.setItem(key, JSON.stringify(record));
    } catch {
      // storage quota or SSR safe
    }
  }

  /**
   * Record a child's attempt and automatically adjust difficulty:
   * - 3 consecutive correct -> promote to next level (max level 3)
   * - 2 consecutive errors on level 2 or 3 -> gently ease down one level to restore confidence
   */
  static recordAttempt(
    profileId: string,
    domain: string,
    isCorrect: boolean
  ): AdaptiveAttemptResult {
    const record = this.getMastery(profileId, domain);

    record.totalAttempts++;
    record.lastUpdated = Date.now();
    record.recentHistory.push(isCorrect);
    if (record.recentHistory.length > 10) {
      record.recentHistory.shift();
    }

    let promoted = false;
    let demoted = false;

    if (isCorrect) {
      record.totalCorrect++;
      record.streak++;
      if (record.streak > record.highestStreak) {
        record.highestStreak = record.streak;
      }

      // 3 consecutive correct answers -> Promote!
      if (record.streak >= 3 && record.currentLevel < 3) {
        record.currentLevel = (record.currentLevel + 1) as WordDifficulty;
        record.streak = 0; // Reset streak for the new challenge level
        promoted = true;
      }
    } else {
      record.streak = 0;

      // Check for 2 consecutive errors in recent history
      const recent = record.recentHistory.slice(-2);
      if (recent.length === 2 && recent[0] === false && recent[1] === false) {
        if (record.currentLevel > 1) {
          record.currentLevel = (record.currentLevel - 1) as WordDifficulty;
          demoted = true;
        }
      }
    }

    this.saveMastery(record);

    const masteryPercentage = record.totalAttempts > 0
      ? Math.round((record.totalCorrect / record.totalAttempts) * 100)
      : 0;

    return {
      promoted,
      demoted,
      currentLevel: record.currentLevel,
      streak: record.streak,
      masteryPercentage,
    };
  }

  /** Manually set difficulty level (e.g. from UI selector) */
  static setLevel(profileId: string, domain: string, level: WordDifficulty): void {
    const record = this.getMastery(profileId, domain);
    record.currentLevel = level;
    record.streak = 0;
    this.saveMastery(record);
  }

  /** Reset domain progress */
  static reset(profileId: string, domain: string): void {
    const key = this.getKey(profileId, domain);
    try {
      AdaptiveStorage.removeItem(key);
    } catch {
      // fallback
    }
  }
}
