import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  ROMANIAN_DICTIONARY,
  DictionaryService,
  DictionaryEntry,
} from '../src/content/dictionary';
import {
  AdaptiveEngine,
  TIER_METAS,
  WordDifficulty,
} from '../src/storage/adaptiveEngine';

describe('Pedagogical Dictionary for 8-Year-Olds', () => {
  it('contains an expansive pool of authentic Romanian nouns with complete metadata', () => {
    assert.ok(ROMANIAN_DICTIONARY.length >= 50, `Expected at least 50 words, got ${ROMANIAN_DICTIONARY.length}`);

    // Verify all entries have valid properties
    for (const entry of ROMANIAN_DICTIONARY) {
      assert.ok(entry.id, 'Entry must have an ID');
      assert.ok(entry.word, `Entry ${entry.id} must have a singular word`);
      assert.ok(entry.plural, `Entry ${entry.id} must have a plural word`);
      assert.ok(
        ['masculin', 'feminin', 'neutru'].includes(entry.gender),
        `Entry ${entry.id} gender must be valid: got ${entry.gender}`
      );
      assert.ok([1, 2, 3].includes(entry.difficulty), `Difficulty must be 1, 2, or 3`);
      assert.ok(entry.icon, `Entry ${entry.id} must have an icon`);
      assert.ok(entry.english, `Entry ${entry.id} must have an English translation`);
      assert.ok(entry.hint, `Entry ${entry.id} must have a counting hint`);
      assert.ok(entry.englishBridge, `Entry ${entry.id} must have an English contrastive bridge`);
    }
  });

  it('covers all three Romanian genders across all difficulty tiers', () => {
    const genders = ['masculin', 'feminin', 'neutru'] as const;
    const tiers = [1, 2, 3] as const;

    for (const tier of tiers) {
      for (const gender of genders) {
        const matching = ROMANIAN_DICTIONARY.filter(
          (e) => e.difficulty === tier && e.gender === gender
        );
        assert.ok(
          matching.length >= 3,
          `Expected at least 3 words for tier ${tier} gender ${gender}, got ${matching.length}`
        );
      }
    }
  });

  it('DictionaryService queries by difficulty and gender properly', () => {
    const level1Words = DictionaryService.getByDifficulty(1);
    assert.ok(level1Words.every((w) => w.difficulty === 1));

    const femininWords = DictionaryService.getByGender('feminin');
    assert.ok(femininWords.every((w) => w.gender === 'feminin'));

    const upToLevel2 = DictionaryService.getUpToDifficulty(2);
    assert.ok(upToLevel2.every((w) => w.difficulty <= 2));
    assert.ok(upToLevel2.some((w) => w.difficulty === 1));
    assert.ok(upToLevel2.some((w) => w.difficulty === 2));
  });

  it('DictionaryService.getRandomBatch provides a diverse 6-word set with no duplicates', () => {
    const batch = DictionaryService.getRandomBatch(6, 2);
    assert.equal(batch.length, 6);

    const uniqueIds = new Set(batch.map((w) => w.id));
    assert.equal(uniqueIds.size, 6, 'Batch words must be unique');

    // Should include words of different genders
    const uniqueGenders = new Set(batch.map((w) => w.gender));
    assert.ok(uniqueGenders.size >= 2, 'Batch should feature diverse genders');
  });

  it('DictionaryService.getRandomBatch respects excludeIds for fresh rounds', () => {
    const batch1 = DictionaryService.getRandomBatch(6, 1);
    const excludeIds = batch1.map((w) => w.id);

    const batch2 = DictionaryService.getRandomBatch(6, 1, excludeIds);
    assert.equal(batch2.length, 6);

    // None of batch2 should be in batch1
    const overlap = batch2.filter((w) => excludeIds.includes(w.id));
    assert.equal(overlap.length, 0, 'Subsequent round should not repeat excluded words');
  });
});

describe('Dynamic Difficulty Adjustment (DDA) Engine', () => {
  const TEST_PROFILE = 'prof_test_child';
  const DOMAIN = 'genuri';

  beforeEach(() => {
    AdaptiveEngine.reset(TEST_PROFILE, DOMAIN);
  });

  it('initializes a fresh child profile at Level 1 (Ucenic) with 0 streak', () => {
    const mastery = AdaptiveEngine.getMastery(TEST_PROFILE, DOMAIN);
    assert.equal(mastery.currentLevel, 1);
    assert.equal(mastery.streak, 0);
    assert.equal(mastery.totalAttempts, 0);
  });

  it('promotes child to Level 2 (Călător) after 3 consecutive correct answers', () => {
    const r1 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    assert.equal(r1.promoted, false);
    assert.equal(r1.streak, 1);
    assert.equal(r1.currentLevel, 1);

    const r2 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    assert.equal(r2.promoted, false);
    assert.equal(r2.streak, 2);
    assert.equal(r2.currentLevel, 1);

    const r3 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    assert.equal(r3.promoted, true, '3 consecutive correct should trigger promotion');
    assert.equal(r3.currentLevel, 2, 'Level should promote to 2');
    assert.equal(r3.streak, 0, 'Streak should reset for the new tier challenge');
  });

  it('promotes child to Level 3 (Meșter Mare) after 3 consecutive correct in Level 2', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, DOMAIN, 2);

    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    const r3 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);

    assert.equal(r3.promoted, true);
    assert.equal(r3.currentLevel, 3);
  });

  it('caps level at 3 (Meșter Mare) without overflowing', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, DOMAIN, 3);

    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    const r3 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);

    assert.equal(r3.promoted, false, 'Cannot promote past max level 3');
    assert.equal(r3.currentLevel, 3);
    assert.equal(r3.streak, 3);
  });

  it('gently scaffolds child down 1 level after 2 consecutive errors on Level 2 or 3', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, DOMAIN, 2);

    const r1 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, false);
    assert.equal(r1.demoted, false);
    assert.equal(r1.currentLevel, 2);

    const r2 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, false);
    assert.equal(r2.demoted, true, '2 consecutive errors should gently ease level');
    assert.equal(r2.currentLevel, 1, 'Level should drop to 1 to restore confidence');
  });

  it('never demotes below Level 1 (Ucenic) on repeated errors', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, DOMAIN, 1);

    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, false);
    const r2 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, false);

    assert.equal(r2.demoted, false, 'Cannot demote below level 1');
    assert.equal(r2.currentLevel, 1);
  });

  it('keeps track of mastery per profile independently', () => {
    AdaptiveEngine.setLevel('prof_alex', DOMAIN, 3);
    AdaptiveEngine.setLevel('prof_elena', DOMAIN, 1);

    const alex = AdaptiveEngine.getMastery('prof_alex', DOMAIN);
    const elena = AdaptiveEngine.getMastery('prof_elena', DOMAIN);

    assert.equal(alex.currentLevel, 3);
    assert.equal(elena.currentLevel, 1);
  });

  it('provides rich tier metadata for all 3 levels', () => {
    assert.equal(TIER_METAS[1].label, 'Ucenic');
    assert.equal(TIER_METAS[2].label, 'Călător');
    assert.equal(TIER_METAS[3].label, 'Meșter Mare');
  });
});

describe('GradinaCuGenuriStation Integration', () => {
  it('instantiates and provides a valid current word from dynamic dictionary', async () => {
    const { GradinaCuGenuriStation, SEED_WORDS } = await import(
      '../src/stations/gradinaCuGenuri'
    );

    assert.ok(SEED_WORDS.length >= 6);

    let lastPrompt = '';
    let lastScore = 0;
    const station = new GradinaCuGenuriStation((state) => {
      lastPrompt = state.prompt;
      lastScore = state.score;
    });

    const word = station.getCurrentWord();
    assert.ok(word.word, 'Current word must have a singular form');
    assert.ok(word.gender, 'Current word must have a gender');
    assert.ok(['masculin', 'feminin', 'neutru'].includes(word.gender));
    assert.ok(word.icon, 'Current word must have an emoji icon');
    assert.ok(word.english, 'Current word must have an English translation');
  });
});

