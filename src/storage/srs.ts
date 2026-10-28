// src/storage/srs.ts — Local-First 7-Box 1-Year Spaced Repetition Engine (Leitner Intervals)
// FR-SRS-001..005: 7 boxes (1, 3, 7, 14, 30, 60, 120 days), gentle lapse recovery, contextual theme rotation.

export interface SrsCard {
  id: string;
  category: string;
  box: number;                 // 1 to 7 (Boxes 1–5 active consolidation, Boxes 6–7 1-year maintenance)
  nextReviewDate: string;      // YYYY-MM-DD
  lapses: number;
  lastContextTheme?: string;   // Prevents verbatim boredom by rotating interest themes (FR-SRS-004)
}

export const SRS_INTERVAL_DAYS = [1, 3, 7, 14, 30, 60, 120] as const;
export const SRS_THEMES = ['minecraft', 'fotbal', 'animale', 'mister_carpati', 'scoala', 'legende'] as const;
export type TutorThemeId = (typeof SRS_THEMES)[number];

const STORAGE_KEY = 'miorita_srs_cards';

export function getSrsCards(): Record<string, SrsCard> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export interface SrsAttemptOptions {
  contextTheme?: string;
  now?: Date;
}

/**
 * Records an SRS attempt with 7-box 1-year intervals and non-punitive gentle lapse recovery:
 * - On success: promotes up to Box 7 (120 days).
 * - On miss (FR-SRS-005): steps back gently (`max(2, box - 2)` if box >= 2, or stays at 1)
 *   rather than crashing a high-box card all the way back to Box 1.
 */
export function recordSrsAttempt(
  cardId: string,
  category: string,
  isCorrect: boolean,
  options?: SrsAttemptOptions
): SrsCard {
  const cards = getSrsCards();
  const today = options?.now ? new Date(options.now) : new Date();
  const todayStr = today.toISOString().split('T')[0];

  const card: SrsCard = cards[cardId] || {
    id: cardId,
    category,
    box: 1,
    nextReviewDate: todayStr,
    lapses: 0,
  };

  if (isCorrect) {
    card.box = Math.min(SRS_INTERVAL_DAYS.length, card.box + 1);
  } else {
    // Gentle Lapse Recovery (FR-SRS-005):
    // If card reached Box 3+, step back by at most 2 boxes (floor at Box 2).
    // If card was in Box 1 or 2, step to Box 1 (or Box 2 if already consolidated).
    card.box = card.box >= 3 ? Math.max(2, card.box - 2) : 1;
    card.lapses += 1;
  }

  if (options?.contextTheme) {
    card.lastContextTheme = options.contextTheme;
  }

  const daysToAdd = SRS_INTERVAL_DAYS[card.box - 1] || 1;
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  card.nextReviewDate = nextDate.toISOString().split('T')[0];

  cards[cardId] = card;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  return card;
}

export function getDueCards(referenceDate?: string): SrsCard[] {
  const cards = getSrsCards();
  const today = referenceDate || new Date().toISOString().split('T')[0];
  return Object.values(cards)
    .filter((c) => c.nextReviewDate <= today)
    .sort((a, b) => a.box - b.box || b.lapses - a.lapses);
}

export function getDueCardsCount(referenceDate?: string): number {
  return getDueCards(referenceDate).length;
}

/**
 * Picks a fresh interest theme for a due SRS card so it never repeats the exact same
 * skin as its previous review (FR-SRS-004).
 */
export function pickNovelThemeForCard(card: SrsCard, preferredTheme?: TutorThemeId): TutorThemeId {
  if (preferredTheme && preferredTheme !== card.lastContextTheme) {
    return preferredTheme;
  }
  const available = SRS_THEMES.filter((t) => t !== card.lastContextTheme);
  return available[0] || 'minecraft';
}
