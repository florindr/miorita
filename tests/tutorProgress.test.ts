// tests/tutorProgress.test.ts — Unit tests for 1-Year Horizon, Focul de la Stână & Novelty Rotation
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

import { TutorProgressManager, getIsoWeekString, daysBetweenDates } from '../src/storage/tutorProgress';

describe('TutorProgressManager — 1-Year Horizon & Non-Punitive Gamification', () => {
  test('Year plan contains 4 seasons and 12 Popasuri checkpoints across 52 weeks', () => {
    const plan = TutorProgressManager.getYearPlan();
    assert.equal(plan.seasons.length, 4);
    const checkpoints = TutorProgressManager.getAllCheckpoints();
    assert.equal(checkpoints.length, 12);
    assert.equal(checkpoints[0].requiredSessions, 8);
    assert.equal(checkpoints[11].requiredSessions, 96);
  });

  test('Focul de la Stână progresses unlit -> glowing (1) -> blazing (2) -> super_scantei (3+)', () => {
    localStorage.clear();
    TutorProgressManager.resetToSeed();

    // Session 1 in week 2026-W44
    const res1 = TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-28',
      theme: 'minecraft',
      focusCategory: 'GEN',
      widgetsUsed: ['GenderBasketMini'],
      goldenStitchesEarned: 5,
      correctCount: 4,
      attemptCount: 4,
      caughtErrors: [],
      wins: ['un tren, două trenuri'],
      parolaDeCina: 'Un tren, două trenuri în gară!',
    });

    assert.equal(res1.state.presence.sessionsThisWeek, 1);
    assert.equal(res1.state.presence.campfireState, 'glowing');
    assert.equal(res1.justMetWeeklyTarget, false);

    // Session 2 in same week -> meets >=2x/week target!
    const res2 = TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-30',
      theme: 'fotbal',
      focusCategory: 'GEN',
      widgetsUsed: ['RoleReversalDetector'],
      goldenStitchesEarned: 6,
      correctCount: 4,
      attemptCount: 4,
      caughtErrors: [],
      wins: ['o minge, două mingi'],
      parolaDeCina: 'Două mingi în poartă!',
    });

    assert.equal(res2.state.presence.sessionsThisWeek, 2);
    assert.equal(res2.state.presence.campfireState, 'blazing');
    assert.equal(res2.justMetWeeklyTarget, true);
    assert.equal(res2.state.presence.totalWeeksMetTarget, 1);
    assert.ok(res2.state.unlockedBadges.includes('steaua_stanei'));

    // Session 3 in same week -> awards bonus Lână de Aur (Super-Scântei)
    const res3 = TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-31',
      theme: 'animale',
      focusCategory: 'GEN',
      widgetsUsed: ['WordMorphSlider'],
      goldenStitchesEarned: 5,
      correctCount: 4,
      attemptCount: 4,
      caughtErrors: [],
      wins: ['un urs, doi urși'],
      parolaDeCina: 'Doi urși pe potecă!',
    });

    assert.equal(res3.state.presence.sessionsThisWeek, 3);
    assert.equal(res3.state.presence.campfireState, 'super_scantei');
    assert.equal(res3.earnedGoldenWoolBonus, true);
    assert.equal(res3.state.presence.goldenWoolBonus, 1);
  });

  test('Warm Re-Entry triggers when >= 4 days pass since lastSessionDate without losing rewards', () => {
    localStorage.clear();
    TutorProgressManager.resetToSeed();

    TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-28',
      theme: 'minecraft',
      focusCategory: 'GEN',
      widgetsUsed: ['GenderBasketMini'],
      goldenStitchesEarned: 5,
      correctCount: 4,
      attemptCount: 4,
      caughtErrors: [],
      wins: [],
      parolaDeCina: 'Test',
    });

    const after2Days = TutorProgressManager.isWarmReEntry('2026-10-30');
    assert.equal(after2Days.isWarmReEntry, false);
    assert.equal(after2Days.daysAway, 2);

    const after5Days = TutorProgressManager.isWarmReEntry('2026-11-02');
    assert.equal(after5Days.isWarmReEntry, true);
    assert.equal(after5Days.daysAway, 5);

    // Ensure stitches and cumulative sessions are never penalized even after a new week rollover
    const stateNextWeek = TutorProgressManager.getState('2026-11-05');
    assert.equal(stateNextWeek.totalSessionsCompleted, 1);
    assert.equal(stateNextWeek.totalGoldenStitches, 5);
    assert.equal(stateNextWeek.presence.sessionsThisWeek, 0);
    assert.equal(stateNextWeek.presence.campfireState, 'unlit');
  });

  test('Novelty Rotation guard prevents repeating the last session theme or widget', () => {
    localStorage.clear();
    TutorProgressManager.resetToSeed();

    TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-28',
      theme: 'minecraft',
      focusCategory: 'GEN',
      widgetsUsed: ['GenderBasketMini'],
      goldenStitchesEarned: 4,
      correctCount: 3,
      attemptCount: 3,
      caughtErrors: [],
      wins: [],
      parolaDeCina: 'Test',
    });

    const [choice1, choice2] = TutorProgressManager.getTopicChoices('2026-10-29');
    assert.notEqual(choice1.id, 'minecraft');
    assert.notEqual(choice2.id, 'minecraft');
    assert.notEqual(choice1.id, choice2.id);

    const nextWidget = TutorProgressManager.pickNovelWidget(
      ['GenderBasketMini', 'RoleReversalDetector'],
      '2026-10-29'
    );
    assert.equal(nextWidget, 'RoleReversalDetector');
  });

  test('Completing 8 sessions unlocks Checkpoint 1 (Livada cu Genuri) and advances to Checkpoint 2', () => {
    localStorage.clear();
    TutorProgressManager.resetToSeed();

    for (let i = 1; i <= 7; i++) {
      TutorProgressManager.recordCompletedSession({
        dateStr: `2026-10-${20 + i}`,
        theme: 'minecraft',
        focusCategory: 'GEN',
        widgetsUsed: ['GenderBasketMini'],
        goldenStitchesEarned: 5,
        correctCount: 4,
        attemptCount: 4,
        caughtErrors: [],
        wins: [],
        parolaDeCina: 'Test',
      });
    }

    assert.equal(TutorProgressManager.isCheckpointBossReady('2026-10-28'), true);

    const eighth = TutorProgressManager.recordCompletedSession({
      dateStr: '2026-10-28',
      theme: 'fotbal',
      focusCategory: 'GEN',
      widgetsUsed: ['RoleReversalDetector'],
      goldenStitchesEarned: 8,
      correctCount: 5,
      attemptCount: 5,
      caughtErrors: [],
      wins: ['Popasul 1 complet!'],
      parolaDeCina: 'Am trecut de Livada cu Genuri!',
    });

    assert.ok(eighth.unlockedCheckpoint);
    assert.equal(eighth.unlockedCheckpoint?.checkpointId, 1);
    assert.equal(eighth.state.currentCheckpointId, 2);
    assert.ok(eighth.state.completedCheckpoints.includes(1));
  });

  test('Helper functions getIsoWeekString and daysBetweenDates compute accurate values', () => {
    assert.equal(getIsoWeekString('2026-10-28'), '2026-W44');
    assert.equal(daysBetweenDates('2026-10-20', '2026-10-28'), 8);
  });
});

