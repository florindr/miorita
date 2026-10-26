import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  CASE_BANK,
  CaseService,
  CaseItem,
} from '../src/content/caseBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../src/storage/adaptiveEngine';
import {
  PodulCuiStation,
  CASE_ITEMS,
} from '../src/stations/podulCui';

describe('Pedagogical Case Bank for 8-Year-Olds (Podul Cui)', () => {
  it('contains an expansive bank of 30+ Romanian Genitive/Dative items', () => {
    assert.ok(CASE_BANK.length >= 30, `Expected >= 30 items, got ${CASE_BANK.length}`);

    for (const item of CASE_BANK) {
      assert.ok(item.id, 'Item must have an ID');
      assert.ok(item.englishShape, `Item ${item.id} must have englishShape`);
      assert.ok(item.promptSentence, `Item ${item.id} must have promptSentence`);
      assert.ok(item.stem, `Item ${item.id} must have stem`);
      assert.ok(item.correctEnding, `Item ${item.id} must have correctEnding`);
      assert.ok(item.correctAnswer, `Item ${item.id} must have correctAnswer`);
      assert.ok(Array.isArray(item.options) && item.options.length >= 4, `Item ${item.id} must have at least 4 options`);
      assert.ok(item.options.includes(item.correctEnding), `Options for ${item.id} must contain the correctEnding`);
      assert.ok(item.icon, `Item ${item.id} must have an icon`);
      assert.ok(item.hint, `Item ${item.id} must have a hint`);
      assert.ok(item.englishBridge, `Item ${item.id} must have an englishBridge`);
      assert.ok([1, 2, 3].includes(item.difficulty), `Difficulty must be 1, 2, or 3`);
    }
  });

  it('covers all three difficulty tiers with calibrated distribution', () => {
    const tiers = [1, 2, 3] as const;
    for (const tier of tiers) {
      const items = CASE_BANK.filter((i) => i.difficulty === tier);
      assert.ok(items.length >= 8, `Tier ${tier} should have at least 8 items, got ${items.length}`);
    }
  });

  it('CaseService filters by difficulty and provides valid batches', () => {
    const tier1 = CaseService.getByDifficulty(1);
    assert.ok(tier1.every((i) => i.difficulty === 1));

    const upToTier2 = CaseService.getUpToDifficulty(2);
    assert.ok(upToTier2.every((i) => i.difficulty <= 2));

    const batch = CaseService.getRandomBatch(5, 2);
    assert.equal(batch.length, 5);

    const ids = new Set(batch.map((b) => b.id));
    assert.equal(ids.size, 5, 'Batch items must be unique');
  });

  it('CaseService.getRandomBatch respects excludeIds for fresh plank rounds', () => {
    const batch1 = CaseService.getRandomBatch(5, 1);
    const excludeIds = batch1.map((b) => b.id);

    const batch2 = CaseService.getRandomBatch(5, 1, excludeIds);
    assert.equal(batch2.length, 5);

    const overlap = batch2.filter((b) => excludeIds.includes(b.id));
    assert.equal(overlap.length, 0, 'Subsequent round must not reuse recent plank items');
  });
});

describe('PodulCuiStation Integration with DDA', () => {
  const TEST_PROFILE = 'prof_test_cui';
  const DOMAIN = 'cui';

  beforeEach(() => {
    AdaptiveEngine.reset(TEST_PROFILE, DOMAIN);
  });

  it('maintains backward compatibility with CASE_ITEMS export', () => {
    assert.ok(CASE_ITEMS.length >= 5);
  });

  it('instantiates and provides valid current plank item', () => {
    let lastPrompt = '';
    let lastScore = 0;
    const station = new PodulCuiStation((state) => {
      lastPrompt = state.prompt;
      lastScore = state.score;
    });

    const item = station.getCurrentItem();
    assert.ok(item.stem);
    assert.ok(item.correctEnding);
    assert.ok(item.correctAnswer);
    assert.ok(item.icon);
  });

  it('adapts difficulty independently for Podul Cui domain', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, 'genuri', 3);
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'genuri').currentLevel, 3);

    // cui should start fresh at level 1
    const cuiMastery = AdaptiveEngine.getMastery(TEST_PROFILE, DOMAIN);
    assert.equal(cuiMastery.currentLevel, 1);

    // Promote in cui after 3 consecutive correct
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    const r3 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);

    assert.equal(r3.promoted, true);
    assert.equal(r3.currentLevel, 2);

    // genuri should remain intact at 3
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'genuri').currentLevel, 3);
  });
});
