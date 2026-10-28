// tests/srsYearHorizon.test.ts — Unit tests for 7-Box 1-Year SRS & Contextual Theme Re-Skinning
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

import {
  recordSrsAttempt,
  pickNovelThemeForCard,
  SRS_INTERVAL_DAYS,
} from '../src/storage/srs';

describe('1-Year 7-Box SRS Scheduler & Contextual Novelty', () => {
  test('Schedules 120-day maintenance interval at Box 7', () => {
    localStorage.clear();
    const baseDate = new Date('2026-10-28T12:00:00Z');
    let card = recordSrsAttempt('CAS-BUNICII', 'CAS', true, { now: baseDate, contextTheme: 'minecraft' });

    for (let i = 0; i < 6; i++) {
      card = recordSrsAttempt('CAS-BUNICII', 'CAS', true, { now: baseDate, contextTheme: 'fotbal' });
    }

    assert.equal(card.box, 7);
    assert.equal(SRS_INTERVAL_DAYS[card.box - 1], 120);
    assert.equal(card.lastContextTheme, 'fotbal');
  });

  test('pickNovelThemeForCard avoids repeating lastContextTheme', () => {
    localStorage.clear();
    const card = recordSrsAttempt('CLQ-8-ANI', 'CLQ', true, { contextTheme: 'minecraft' });
    const nextTheme = pickNovelThemeForCard(card, 'minecraft');
    assert.notEqual(nextTheme, 'minecraft');

    const preferredDifferent = pickNovelThemeForCard(card, 'fotbal');
    assert.equal(preferredDifferent, 'fotbal');
  });
});

