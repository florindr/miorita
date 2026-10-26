// src/storage/srs.ts — Local-First Spaced Repetition Engine (Leitner Intervals)
// FR-SRS-001..003: 1, 3, 7, 14, 30 days spacing. Prioritizes Caietul lui Tata items.

export interface SrsCard {
  id: string;
  category: string;
  box: number;            // 1 to 5
  nextReviewDate: string; // YYYY-MM-DD
  lapses: number;
}

const STORAGE_KEY = 'miorita_srs_cards';
const INTERVAL_DAYS = [1, 3, 7, 14, 30];

export function getSrsCards(): Record<string, SrsCard> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function recordSrsAttempt(cardId: string, category: string, isCorrect: boolean) {
  const cards = getSrsCards();
  const card: SrsCard = cards[cardId] || {
    id: cardId,
    category,
    box: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    lapses: 0
  };

  const today = new Date();

  if (isCorrect) {
    card.box = Math.min(5, card.box + 1);
  } else {
    card.box = 1;
    card.lapses += 1;
  }

  const daysToAdd = INTERVAL_DAYS[card.box - 1] || 1;
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  card.nextReviewDate = nextDate.toISOString().split('T')[0];

  cards[cardId] = card;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  return card;
}

export function getDueCardsCount(): number {
  const cards = getSrsCards();
  const today = new Date().toISOString().split('T')[0];
  let count = 0;
  for (const id in cards) {
    if (cards[id].nextReviewDate <= today) {
      count++;
    }
  }
  return count;
}
