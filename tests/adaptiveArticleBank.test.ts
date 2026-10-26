import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  ARTICLE_BANK,
  ArticleService,
  ArticleItem,
} from '../src/content/articleBank';
import {
  AdaptiveEngine,
  TIER_METAS,
} from '../src/storage/adaptiveEngine';
import {
  MoaraCuArticoleStation,
  ARTICLE_ITEMS,
} from '../src/stations/moaraCuArticole';

describe('Pedagogical Article Bank for 8-Year-Olds (Moara cu Articole)', () => {
  it('contains an expansive bank of 30+ Romanian Definite Article items', () => {
    assert.ok(ARTICLE_BANK.length >= 30, `Expected >= 30 items, got ${ARTICLE_BANK.length}`);

    for (const item of ARTICLE_BANK) {
      assert.ok(item.id, 'Item must have an ID');
      assert.ok(item.bareWord, `Item ${item.id} must have bareWord`);
      assert.ok(item.promptContext, `Item ${item.id} must have promptContext`);
      assert.ok(item.correctArticle, `Item ${item.id} must have correctArticle`);
      assert.ok(item.articledWord, `Item ${item.id} must have articledWord`);
      assert.ok(Array.isArray(item.options) && item.options.length >= 2, `Item ${item.id} must have options`);
      assert.ok(item.options.includes(item.correctArticle), `Options for ${item.id} must include correctArticle`);
      assert.ok(item.icon, `Item ${item.id} must have an icon`);
      assert.ok(item.hint, `Item ${item.id} must have a hint`);
      assert.ok(item.englishBridge, `Item ${item.id} must have an englishBridge`);
      assert.ok([1, 2, 3].includes(item.difficulty), `Difficulty must be 1, 2, or 3`);
    }
  });

  it('covers all three difficulty tiers with calibrated distribution', () => {
    const tiers = [1, 2, 3] as const;
    for (const tier of tiers) {
      const items = ARTICLE_BANK.filter((i) => i.difficulty === tier);
      assert.ok(items.length >= 8, `Tier ${tier} should have at least 8 items, got ${items.length}`);
    }
  });

  it('includes both masculine/feminine/neuter articles and preposition traps', () => {
    const categories = new Set(ARTICLE_BANK.map((i) => i.category));
    assert.ok(categories.has('masculin'));
    assert.ok(categories.has('feminin'));
    assert.ok(categories.has('prepozitie'));
    assert.ok(categories.has('plural'));
  });

  it('ArticleService filters by difficulty and provides valid batches', () => {
    const tier1 = ArticleService.getByDifficulty(1);
    assert.ok(tier1.every((i) => i.difficulty === 1));

    const upToTier2 = ArticleService.getUpToDifficulty(2);
    assert.ok(upToTier2.every((i) => i.difficulty <= 2));

    const batch = ArticleService.getRandomBatch(6, 2);
    assert.equal(batch.length, 6);

    const ids = new Set(batch.map((b) => b.id));
    assert.equal(ids.size, 6, 'Batch items must be unique');
  });

  it('ArticleService.getRandomBatch respects excludeIds for fresh sacks of flour', () => {
    const batch1 = ArticleService.getRandomBatch(6, 1);
    const excludeIds = batch1.map((b) => b.id);

    const batch2 = ArticleService.getRandomBatch(6, 1, excludeIds);
    assert.equal(batch2.length, 6);

    const overlap = batch2.filter((b) => excludeIds.includes(b.id));
    assert.equal(overlap.length, 0, 'Subsequent round must not reuse recent items');
  });
});

describe('MoaraCuArticoleStation Integration with DDA', () => {
  const TEST_PROFILE = 'prof_test_art';
  const DOMAIN = 'articole';

  beforeEach(() => {
    AdaptiveEngine.reset(TEST_PROFILE, DOMAIN);
  });

  it('maintains backward compatibility with ARTICLE_ITEMS export', () => {
    assert.ok(ARTICLE_ITEMS.length >= 5);
  });

  it('instantiates and provides valid current article item', () => {
    let lastPrompt = '';
    let lastScore = 0;
    const station = new MoaraCuArticoleStation((state) => {
      lastPrompt = state.prompt;
      lastScore = state.score;
    });

    const item = station.getCurrentItem();
    assert.ok(item.bareWord);
    assert.ok(item.correctArticle);
    assert.ok(item.articledWord);
    assert.ok(item.icon);
  });

  it('adapts difficulty independently for Moara cu Articole domain', () => {
    AdaptiveEngine.setLevel(TEST_PROFILE, 'genuri', 3);
    AdaptiveEngine.setLevel(TEST_PROFILE, 'cui', 2);

    // articole starts fresh at level 1
    const artMastery = AdaptiveEngine.getMastery(TEST_PROFILE, DOMAIN);
    assert.equal(artMastery.currentLevel, 1);

    // Promote in articole after 3 consecutive correct
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);
    const r3 = AdaptiveEngine.recordAttempt(TEST_PROFILE, DOMAIN, true);

    assert.equal(r3.promoted, true);
    assert.equal(r3.currentLevel, 2);

    // genuri and cui remain intact
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'genuri').currentLevel, 3);
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'cui').currentLevel, 2);
  });
});
