// tests/srs.test.ts — Unit tests for 7-Box 1-Year Spaced Repetition Engine
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (k: string) => mockStorage[k] || null,
  setItem: (k: string, v: string) => { mockStorage[k] = v; },
  removeItem: (k: string) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null,
};

import { recordSrsAttempt, getSrsCards, getDueCardsCount, SRS_INTERVAL_DAYS } from '../src/storage/srs';

describe('Leitner 7-Box Spaced Repetition Engine', () => {
  test('New card starts at Box 1 and promotes on success', () => {
    localStorage.clear();
    const card = recordSrsAttempt('CLQ-0001', 'CLQ', true);

    assert.equal(card.id, 'CLQ-0001');
    assert.equal(card.category, 'CLQ');
    assert.equal(card.box, 2);
    assert.equal(card.lapses, 0);
  });

  test('Card promotes up to Box 7 max (120 days 1-year horizon)', () => {
    localStorage.clear();
    assert.deepEqual([...SRS_INTERVAL_DAYS], [1, 3, 7, 14, 30, 60, 120]);

    let card = recordSrsAttempt('CAS-0001', 'CAS', true); // Box 2
    for (let i = 0; i < 8; i++) {
      card = recordSrsAttempt('CAS-0001', 'CAS', true);
    }

    assert.equal(card.box, 7);
  });

  test('Gentle lapse recovery steps back high-box cards without resetting to Box 1', () => {
    localStorage.clear();
    // Promote to Box 5
    let card = recordSrsAttempt('ART-0001', 'ART', true); // 2
    card = recordSrsAttempt('ART-0001', 'ART', true);     // 3
    card = recordSrsAttempt('ART-0001', 'ART', true);     // 4
    card = recordSrsAttempt('ART-0001', 'ART', true);     // 5

    const failedFrom5 = recordSrsAttempt('ART-0001', 'ART', false);
    assert.equal(failedFrom5.box, 3); // max(2, 5 - 2) = 3
    assert.equal(failedFrom5.lapses, 1);

    const failedFrom3 = recordSrsAttempt('ART-0001', 'ART', false);
    assert.equal(failedFrom3.box, 2); // max(2, 3 - 2) = 2
    assert.equal(failedFrom3.lapses, 2);
  });

  test('Due cards count detects past or current due dates', () => {
    localStorage.clear();
    const cards = getSrsCards();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    cards['DUE-1'] = { id: 'DUE-1', category: 'GEN', box: 1, nextReviewDate: yesterday, lapses: 0 };
    cards['NOT-DUE'] = { id: 'NOT-DUE', category: 'GEN', box: 3, nextReviewDate: tomorrow, lapses: 0 };
    localStorage.setItem('miorita_srs_cards', JSON.stringify(cards));

    assert.equal(getDueCardsCount(), 1);
  });
});
