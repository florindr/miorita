// src/storage/tutorProgress.ts — 1-Year Horizon State Manager, Focul de la Stână & Novelty Guard
// Traces to: FR-HOR-001..004, FR-GAM-001..005, FR-TRK-001..003

import seedProgressJson from '../../content/tutor/tudor-progress.json';
import yearPlanJson from '../../content/tutor/year-plan.json';
import { MioritaDB } from './db';

export type CampfireState = 'unlit' | 'glowing' | 'blazing' | 'super_scantei';

export interface TutorCategoryProgress {
  category: string;
  tier: 1 | 2 | 3;
  attempts: number;
  correct: number;
  srsBoxes: Record<string, number>;
  lastPracticedDate: string | null;
}

export interface TutorSessionLog {
  sessionId: string;
  date: string;
  durationMinutes: number;
  theme: string;
  focusCategory: string;
  secondaryCategory?: string;
  widgetsUsed: string[];
  goldenStitchesEarned: number;
  checkpointUnlocked?: number;
  caughtErrors: Array<{ said: string; correct: string; category: string }>;
  wins: string[];
  parolaDeCina: string;
}

export interface TutorYearProgress {
  schemaVersion: 2;
  learnerName: string;
  learnerAge: number;
  yearGroup: string;
  tutorModel: 'gemini-argon';
  horizonStartDate: string;
  horizonTargetEndDate: string;
  currentSeason: 1 | 2 | 3 | 4;
  currentCheckpointId: number; // 1..12
  completedCheckpoints: number[];
  totalSessionsCompleted: number;
  totalMinutesPracticed: number;
  totalGoldenStitches: number;
  unlockedMotifs: string[];
  unlockedBadges: string[];
  presence: {
    currentWeekIso: string;
    sessionsThisWeek: number;
    weeklyTarget: 2;
    campfireState: CampfireState;
    totalWeeksMetTarget: number;
    goldenWoolBonus: number;
    lastSessionDate: string | null;
  };
  noveltyState: {
    recentThemes: string[];
    recentWidgets: string[];
  };
  categories: Record<string, TutorCategoryProgress>;
  recentSessions: TutorSessionLog[];
}

export interface YearCheckpointSpec {
  checkpointId: number;
  nameRo: string;
  weeks: string;
  requiredSessions: number;
  primaryCategory: string;
  secondaryCategory: string;
  grammarPillar: string;
  recommendedWidgets: string[];
  unlockMotifId: string;
  unlockBadgeId: string;
  bossQuestPrompt: string;
}

export interface YearSeasonSpec {
  seasonId: 1 | 2 | 3 | 4;
  nameRo: string;
  subtitleRo: string;
  weeks: string;
  primaryCategories: string[];
  checkpoints: YearCheckpointSpec[];
}

export interface TopicOption {
  id: string;
  labelRo: string;
  emoji: string;
  hookRo: string;
}

export const TUTOR_TOPIC_CATALOG: TopicOption[] = [
  {
    id: 'minecraft',
    labelRo: 'Cetatea din Minecraft',
    emoji: '⛏️',
    hookRo: 'Construim o cetate secretă din blocuri de diamant și apărăm satul de creeperi!',
  },
  {
    id: 'fotbal',
    labelRo: 'Finala de Fotbal a Berbecilor',
    emoji: '⚽',
    hookRo: 'Arbitrăm marea finală de fotbal din Poiana Mioriței și batem lovitura de departajare!',
  },
  {
    id: 'animale',
    labelRo: 'Patrula Animalelor din Carpați',
    emoji: '🦅',
    hookRo: 'Plecăm în patrulă cu vulturul, ursul cafeniu și cățelul ciobănesc pe poteca de munte!',
  },
  {
    id: 'mister_carpati',
    labelRo: 'Comoara din Peștera de Cristal',
    emoji: '🔮',
    hookRo: 'Descoperim harta unei comori străvechi ascunse în Peștera cu Cristale Luminoase!',
  },
  {
    id: 'scoala',
    labelRo: 'Invenția Trăsnită de la Școală',
    emoji: '🚀',
    hookRo: 'Construim un roboțel-ghiozdan la clubul de știință care vorbește românește!',
  },
  {
    id: 'legende',
    labelRo: 'Legenda Zmeului Încurcă-Vorbe',
    emoji: '🐉',
    hookRo: 'Îl păcălim pe Zmeul Încurcă-Vorbe care a amestecat cuvintele din satul bunicii!',
  },
];

const STORAGE_KEY = 'miorita_tutor_progress';

/**
 * Computes ISO-8601 week string `YYYY-Www` for a given date.
 */
export function getIsoWeekString(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T12:00:00Z') : new Date(dateInput);
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Computes whole calendar days elapsed between two `YYYY-MM-DD` strings.
 */
export function daysBetweenDates(earlierDateStr: string | null, laterDateStr: string): number {
  if (!earlierDateStr) return 0;
  const d1 = new Date(earlierDateStr + 'T00:00:00Z').getTime();
  const d2 = new Date(laterDateStr + 'T00:00:00Z').getTime();
  if (Number.isNaN(d1) || Number.isNaN(d2)) return 0;
  return Math.max(0, Math.round((d2 - d1) / 86400000));
}

export class TutorProgressManager {
  static getYearPlan(): { seasons: YearSeasonSpec[] } {
    return yearPlanJson as unknown as { seasons: YearSeasonSpec[] };
  }

  static getAllCheckpoints(): YearCheckpointSpec[] {
    const plan = this.getYearPlan();
    return plan.seasons.flatMap((s) => s.checkpoints);
  }

  static getCheckpointById(checkpointId: number): YearCheckpointSpec {
    const all = this.getAllCheckpoints();
    return all.find((c) => c.checkpointId === checkpointId) || all[0];
  }

  static getSeasonForCheckpoint(checkpointId: number): YearSeasonSpec {
    const plan = this.getYearPlan();
    for (const season of plan.seasons) {
      if (season.checkpoints.some((c) => c.checkpointId === checkpointId)) {
        return season;
      }
    }
    return plan.seasons[0];
  }

  static getState(referenceDateStr?: string): TutorYearProgress {
    let state: TutorYearProgress;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state = JSON.parse(raw);
      } else {
        state = JSON.parse(JSON.stringify(seedProgressJson)) as TutorYearProgress;
      }
    } catch {
      state = JSON.parse(JSON.stringify(seedProgressJson)) as TutorYearProgress;
    }

    // Check if the ISO week rolled over (non-punitive weekly reset of weekly counter only)
    const todayStr = referenceDateStr || new Date().toISOString().split('T')[0];
    const currentWeekIso = getIsoWeekString(todayStr);
    if (state.presence.currentWeekIso !== currentWeekIso) {
      state.presence.currentWeekIso = currentWeekIso;
      state.presence.sessionsThisWeek = 0;
      state.presence.campfireState = 'unlit';
      this.saveState(state);
    }

    return state;
  }

  static saveState(state: TutorYearProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    MioritaDB.saveTutorProgress(state).catch(() => {});
  }

  static resetToSeed(): TutorYearProgress {
    const fresh = JSON.parse(JSON.stringify(seedProgressJson)) as TutorYearProgress;
    this.saveState(fresh);
    return fresh;
  }

  /**
   * Warm Re-Entry (FR-GAM-004):
   * Returns true if Tudor has been away for >= 4 days.
   * Never penalizes or mentions missed days; triggers an extra-warm celebration + confidence items.
   */
  static isWarmReEntry(referenceDateStr?: string): { isWarmReEntry: boolean; daysAway: number } {
    const state = this.getState(referenceDateStr);
    const todayStr = referenceDateStr || new Date().toISOString().split('T')[0];
    const daysAway = daysBetweenDates(state.presence.lastSessionDate, todayStr);
    return {
      isWarmReEntry: state.presence.lastSessionDate !== null && daysAway >= 4,
      daysAway,
    };
  }

  /**
   * Returns true if the current session is the 8th session milestone (or beyond) for the active Popas.
   */
  static isCheckpointBossReady(referenceDateStr?: string): boolean {
    const state = this.getState(referenceDateStr);
    const activeCp = this.getCheckpointById(state.currentCheckpointId);
    if (state.completedCheckpoints.includes(activeCp.checkpointId)) {
      return false;
    }
    return state.totalSessionsCompleted + 1 >= activeCp.requiredSessions;
  }

  /**
   * Novelty Rotation Guard (FR-GAM-005):
   * Returns 2 high-interest topic choices that do NOT repeat the immediately preceding session's theme.
   */
  static getTopicChoices(referenceDateStr?: string): [TopicOption, TopicOption] {
    const state = this.getState(referenceDateStr);
    const lastTheme = state.noveltyState.recentThemes[0];
    const filtered = TUTOR_TOPIC_CATALOG.filter((t) => t.id !== lastTheme);

    // Deterministic rotation based on totalSessionsCompleted so choices feel fresh every session
    const idx1 = state.totalSessionsCompleted % filtered.length;
    const idx2 = (state.totalSessionsCompleted + 1) % filtered.length;
    return [filtered[idx1], filtered[idx2 === idx1 ? (idx1 + 1) % filtered.length : idx2]];
  }

  /**
   * Selects an interactive JS widget for the session that avoids repeating the last session's primary widget.
   */
  static pickNovelWidget(recommendedWidgets: string[], referenceDateStr?: string): string {
    const state = this.getState(referenceDateStr);
    const lastWidget = state.noveltyState.recentWidgets[0];
    const novel = recommendedWidgets.find((w) => w !== lastWidget);
    return novel || recommendedWidgets[0] || 'WordMorphSlider';
  }

  /**
   * Records a completed 10-minute Agentic Tutor session:
   * - Updates 🔥 Focul de la Stână (≥2x/week target, Steaua Stânei at 2, Lână de Aur at 3+)
   * - Updates novelty history (`recentThemes`, `recentWidgets`)
   * - Updates category mastery & 7-box SRS summary
   * - Unlocks Checkpoint (Popas) if threshold reached
   * - Syncs stitches with Covorul lui Tudor (`miorita_stitches`, `miorita_unlocked_motifs`, `miorita_badges`)
   */
  static recordCompletedSession(params: {
    dateStr?: string;
    theme: string;
    focusCategory: string;
    secondaryCategory?: string;
    widgetsUsed: string[];
    goldenStitchesEarned: number;
    correctCount: number;
    attemptCount: number;
    caughtErrors: Array<{ said: string; correct: string; category: string }>;
    wins: string[];
    parolaDeCina: string;
    completedCheckpointQuest?: boolean;
  }): {
    state: TutorYearProgress;
    unlockedCheckpoint: YearCheckpointSpec | null;
    justMetWeeklyTarget: boolean;
    earnedGoldenWoolBonus: boolean;
  } {
    const dateStr = params.dateStr || new Date().toISOString().split('T')[0];
    const state = this.getState(dateStr);

    // 1. Update session & stitch totals
    state.totalSessionsCompleted += 1;
    state.totalMinutesPracticed += 10;
    state.totalGoldenStitches += params.goldenStitchesEarned;

    // 2. Update 🔥 Focul de la Stână (FR-GAM-001..003)
    const weekIso = getIsoWeekString(dateStr);
    if (state.presence.currentWeekIso !== weekIso) {
      state.presence.currentWeekIso = weekIso;
      state.presence.sessionsThisWeek = 0;
    }

    state.presence.sessionsThisWeek += 1;
    state.presence.lastSessionDate = dateStr;

    let justMetWeeklyTarget = false;
    let earnedGoldenWoolBonus = false;

    if (state.presence.sessionsThisWeek === 1) {
      state.presence.campfireState = 'glowing';
    } else if (state.presence.sessionsThisWeek === 2) {
      state.presence.campfireState = 'blazing';
      state.presence.totalWeeksMetTarget += 1;
      justMetWeeklyTarget = true;
      if (!state.unlockedBadges.includes('steaua_stanei')) {
        state.unlockedBadges.push('steaua_stanei');
      }
    } else if (state.presence.sessionsThisWeek >= 3) {
      state.presence.campfireState = 'super_scantei';
      state.presence.goldenWoolBonus += 1;
      earnedGoldenWoolBonus = true;
    }

    // 3. Update Novelty Rotation state (keep last 3)
    state.noveltyState.recentThemes = [
      params.theme,
      ...state.noveltyState.recentThemes.filter((t) => t !== params.theme),
    ].slice(0, 3);

    if (params.widgetsUsed.length > 0) {
      const primaryWidget = params.widgetsUsed[0];
      state.noveltyState.recentWidgets = [
        primaryWidget,
        ...state.noveltyState.recentWidgets.filter((w) => w !== primaryWidget),
      ].slice(0, 3);
    }

    // 4. Update Category stats
    const cat = state.categories[params.focusCategory];
    if (cat) {
      cat.attempts += params.attemptCount;
      cat.correct += params.correctCount;
      cat.lastPracticedDate = dateStr;
      const accuracy = cat.attempts > 0 ? cat.correct / cat.attempts : 0;
      if (cat.attempts >= 12 && accuracy >= 0.85) {
        cat.tier = 3;
      } else if (cat.attempts >= 5 && accuracy >= 0.7) {
        cat.tier = Math.max(cat.tier, 2) as 1 | 2 | 3;
      }
    }

    // 5. Check Checkpoint (Popas) completion & unlock
    let unlockedCheckpoint: YearCheckpointSpec | null = null;
    const activeCp = this.getCheckpointById(state.currentCheckpointId);
    const meetsThreshold = state.totalSessionsCompleted >= activeCp.requiredSessions;

    if (
      (meetsThreshold || params.completedCheckpointQuest) &&
      !state.completedCheckpoints.includes(activeCp.checkpointId)
    ) {
      state.completedCheckpoints.push(activeCp.checkpointId);
      unlockedCheckpoint = activeCp;

      if (activeCp.unlockMotifId && !state.unlockedMotifs.includes(activeCp.unlockMotifId)) {
        state.unlockedMotifs.push(activeCp.unlockMotifId);
      }
      if (activeCp.unlockBadgeId && !state.unlockedBadges.includes(activeCp.unlockBadgeId)) {
        state.unlockedBadges.push(activeCp.unlockBadgeId);
      }

      if (state.currentCheckpointId < 12) {
        state.currentCheckpointId += 1;
      }
      const nextSeason = this.getSeasonForCheckpoint(state.currentCheckpointId);
      state.currentSeason = nextSeason.seasonId;
    }

    // 6. Prepend session log (keep last 25)
    const logEntry: TutorSessionLog = {
      sessionId: `TUT-${Date.now()}`,
      date: dateStr,
      durationMinutes: 10,
      theme: params.theme,
      focusCategory: params.focusCategory,
      secondaryCategory: params.secondaryCategory,
      widgetsUsed: params.widgetsUsed,
      goldenStitchesEarned: params.goldenStitchesEarned,
      checkpointUnlocked: unlockedCheckpoint?.checkpointId,
      caughtErrors: params.caughtErrors,
      wins: params.wins,
      parolaDeCina: params.parolaDeCina,
    };
    state.recentSessions = [logEntry, ...state.recentSessions].slice(0, 25);

    // 7. Sync with Covorul lui Tudor & Lada de Zestre localStorage keys
    this.syncWithVillageRewards(state, params.goldenStitchesEarned);

    this.saveState(state);

    return {
      state,
      unlockedCheckpoint,
      justMetWeeklyTarget,
      earnedGoldenWoolBonus,
    };
  }

  private static syncWithVillageRewards(state: TutorYearProgress, addedStitches: number): void {
    try {
      const currentStitches = parseInt(localStorage.getItem('miorita_stitches') || '14', 10);
      localStorage.setItem('miorita_stitches', String(currentStitches + addedStitches));

      const existingMotifs: string[] = JSON.parse(
        localStorage.getItem('miorita_unlocked_motifs') || '["roata_soarelui","pomul_vietii","coarnele_berbecului"]'
      );
      for (const m of state.unlockedMotifs) {
        if (!existingMotifs.includes(m)) existingMotifs.push(m);
      }
      localStorage.setItem('miorita_unlocked_motifs', JSON.stringify(existingMotifs));

      const existingBadges: string[] = JSON.parse(
        localStorage.getItem('miorita_badges') || '["pastor","vanator"]'
      );
      for (const b of state.unlockedBadges) {
        if (!existingBadges.includes(b)) existingBadges.push(b);
      }
      localStorage.setItem('miorita_badges', JSON.stringify(existingBadges));
    } catch {}
  }
}

