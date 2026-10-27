import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CALQUE_BANK, CalqueService } from '../src/content/calqueBank';
import { NUMBER_BANK, NumberService } from '../src/content/numberBank';
import { SUBJUNCTIVE_BANK, SubjunctiveService } from '../src/content/subjunctiveBank';
import { AdaptiveEngine } from '../src/storage/adaptiveEngine';
import { VanatorulDeEnglezismeStation, CALQUE_ITEMS } from '../src/stations/vanatorulDeEnglezisme';
import { TargulDeNumereStation, NUMBER_ITEMS } from '../src/stations/targulDeNumere';
import { PotecaLuiSaStation, SUBJUNCTIVE_ITEMS } from '../src/stations/potecaLuiSa';

describe('Extended Pedagogical Banks (Calques, Numbers, Subjunctive)', () => {
  it('CALQUE_BANK has 30+ items covering 3 tiers', () => {
    assert.ok(CALQUE_BANK.length >= 30);
    for (const item of CALQUE_BANK) {
      assert.ok(item.id);
      assert.ok(item.englishOriginal);
      assert.ok(item.authenticRom);
      assert.ok(item.options.length >= 3);
      assert.ok([1, 2, 3].includes(item.difficulty));
    }
    const t1 = CalqueService.getByDifficulty(1);
    const t2 = CalqueService.getByDifficulty(2);
    const t3 = CalqueService.getByDifficulty(3);
    assert.ok(t1.length >= 8 && t2.length >= 8 && t3.length >= 8);
  });

  it('NUMBER_BANK has 30+ items covering 3 tiers and rules', () => {
    assert.ok(NUMBER_BANK.length >= 30);
    for (const item of NUMBER_BANK) {
      assert.ok(item.id);
      assert.ok(item.numberDisplay);
      assert.ok(item.correctPhrase);
      assert.ok(item.options.length >= 2);
      assert.ok([1, 2, 3].includes(item.difficulty));
    }
    const batch = NumberService.getRandomBatch(5, 1);
    assert.equal(batch.length, 5);
  });

  it('SUBJUNCTIVE_BANK has 30+ items covering 3 tiers', () => {
    assert.ok(SUBJUNCTIVE_BANK.length >= 30);
    for (const item of SUBJUNCTIVE_BANK) {
      assert.ok(item.id);
      assert.ok(item.triggerVerb);
      assert.ok(item.correctPhrase);
      assert.ok(item.fullCorrect);
      assert.ok(item.options.includes(item.correctPhrase));
      assert.ok([1, 2, 3].includes(item.difficulty));
    }
    const batch = SubjunctiveService.getRandomBatch(5, 2);
    assert.equal(batch.length, 5);
  });
});

describe('Stations Integration (Vanator, Targ, Poteca)', () => {
  const TEST_PROFILE = 'prof_test_multi';

  beforeEach(() => {
    AdaptiveEngine.reset(TEST_PROFILE, 'englezisme');
    AdaptiveEngine.reset(TEST_PROFILE, 'numere');
    AdaptiveEngine.reset(TEST_PROFILE, 'subjunctiv');
  });

  it('VanatorulDeEnglezismeStation instantiates and provides backward compatibility', () => {
    assert.ok(CALQUE_ITEMS.length >= 5);
    const station = new VanatorulDeEnglezismeStation(() => {});
    assert.ok(station.getCurrentItem().authenticRom);
  });

  it('TargulDeNumereStation instantiates and provides backward compatibility', () => {
    assert.ok(NUMBER_ITEMS.length >= 4);
    const station = new TargulDeNumereStation(() => {});
    assert.ok(station.getCurrentItem().correctPhrase);
  });

  it('PotecaLuiSaStation instantiates and provides backward compatibility', () => {
    assert.ok(SUBJUNCTIVE_ITEMS.length >= 4);
    const station = new PotecaLuiSaStation(() => {});
    assert.ok(station.getCurrentItem().fullCorrect);
  });

  it('AdaptiveEngine tracks each domain independently across all 5 stations', () => {
    AdaptiveEngine.recordAttempt(TEST_PROFILE, 'englezisme', true);
    AdaptiveEngine.recordAttempt(TEST_PROFILE, 'englezisme', true);
    const rEng = AdaptiveEngine.recordAttempt(TEST_PROFILE, 'englezisme', true);
    assert.equal(rEng.promoted, true);
    assert.equal(rEng.currentLevel, 2);

    // Other domains must remain at level 1
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'numere').currentLevel, 1);
    assert.equal(AdaptiveEngine.getMastery(TEST_PROFILE, 'subjunctiv').currentLevel, 1);
  });
});
