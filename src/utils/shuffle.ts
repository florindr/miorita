// src/utils/shuffle.ts — Unbiased Fisher-Yates Array Shuffle
// Ensures pedagogical options are randomized across all choice buttons.

export function shuffleArray<T>(array: readonly T[] | T[]): T[] {
  if (!array || array.length <= 1) return [...array];
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}
