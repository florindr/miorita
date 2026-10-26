// tests/questSets.test.ts — Unit tests for Miorita's 10 Quest Sets (Clawey Parity)
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { QUEST_SETS } from '../src/content/questSets';

describe('Miorița 10 Quest Sets (Clawey Parity)', () => {
  it('contains exactly 10 comprehensive quest sets', () => {
    assert.strictEqual(QUEST_SETS.length, 10, 'Expected 10 quest sets');
  });

  it('each set contains exactly 10 pedagogical questions (100 total)', () => {
    let totalQuestions = 0;
    for (const set of QUEST_SETS) {
      assert.strictEqual(set.questions.length, 10, `Set ${set.id} must have 10 questions`);
      totalQuestions += set.questions.length;

      for (const q of set.questions) {
        assert.ok(q.id.startsWith(`SET${set.id}-`), `Question ID ${q.id} must start with SET${set.id}-`);
        assert.ok(q.options.includes(q.authenticRom), `Options for ${q.id} must include correct answer`);
        assert.ok(q.bridge.length >= 10, `Bridge for ${q.id} must provide clear contrastive explanation`);
        assert.ok(q.hint.length > 0, `Hint for ${q.id} must not be empty`);
      }
    }
    assert.strictEqual(totalQuestions, 100, 'Expected 100 total quest questions');
  });

  it('covers all major Romanian interference taxonomy categories', () => {
    const categories = new Set<string>();
    for (const set of QUEST_SETS) {
      for (const q of set.questions) {
        categories.add(q.category);
      }
    }

    const expectedCategories = ['GEN', 'CAS', 'CLQ', 'ART', 'SUB', 'POS', 'NUM', 'CLI', 'AGR'];
    for (const exp of expectedCategories) {
      assert.ok(categories.has(exp), `Expected category ${exp} to be covered across the 10 sets`);
    }
  });

  it('randomizes correct answers so they are not always at index 0', () => {
    let index0Count = 0;
    let nonIndex0Count = 0;

    for (const set of QUEST_SETS) {
      for (const q of set.questions) {
        const correctIndex = q.options.indexOf(q.authenticRom);
        assert.ok(correctIndex >= 0, `Correct answer must be present in options for ${q.id}`);
        if (correctIndex === 0) {
          index0Count++;
        } else {
          nonIndex0Count++;
        }
      }
    }

    // In a uniform distribution of 3 choices across 100 questions, non-index-0 should be ~66% (~40-80).
    // It should definitely NOT be 0 (which would mean always first).
    assert.ok(nonIndex0Count > 30, `Expected non-first correct answers (>30), got ${nonIndex0Count}`);
    assert.ok(index0Count < 80, `Expected index 0 not to dominate (<80), got ${index0Count}`);
  });
});
