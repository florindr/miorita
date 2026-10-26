// tests/srs.test.ts — Unit tests for Spaced Repetition (Leitner system)
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for test environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (k: string) => mockStorage[k] || null,
  setItem: (k: string, v: string) => { mockStorage[k] = v; },
  removeItem: (k: string) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null,
};

import { recordSrsAttempt, getSrsCards, getDueCardsCount } from '../src/storage/srs';

describe('Leitner Spaced Repetition Engine', () => {
  test('New card starts at Box 1 and promotes on success', () => {
    localStorage.clear();
    const card = recordSrsAttempt('CLQ-0001', 'CLQ', true);

    assert.equal(card.id, 'CLQ-0001');
    assert.equal(card.category, 'CLQ');
    assert.equal(card.box, 2); // Promoted from 1 to 2
    assert.equal(card.lapses, 0);
  });

  test('Card promotes up to Box 5 max', () => {
    localStorage.clear();
    let card = recordSrsAttempt('CAS-0001', 'CAS', true); // Box 2
    card = recordSrsAttempt('CAS-0001', 'CAS', true);       // Box 3
    card = recordSrsAttempt('CAS-0001', 'CAS', true);       // Box 4
    card = recordSrsAttempt('CAS-0001', 'CAS', true);       // Box 5
    card = recordSrsAttempt('CAS-0001', 'CAS', true);       // Stays Box 5

    assert.equal(card.box, 5);
  });

  test('Incorrect attempt resets card to Box 1 and increments lapses', () => {
    localStorage.clear();
    recordSrsAttempt('ART-0001', 'ART', true); // Box 2
    recordSrsAttempt('ART-0001', 'ART', true); // Box 3

    const failedCard = recordSrsAttempt('ART-0001', 'ART', false);
    assert.equal(failedCard.box, 1);
    assert.equal(failedCard.lapses, 1);
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
