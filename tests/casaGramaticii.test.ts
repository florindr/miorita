// tests/casaGramaticii.test.ts — Unit tests for Theoretical Grammar Hub & Visual Syntax Explorer
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  GRAMMAR_PILLARS,
  SYNTAX_SENTENCES,
  CasaGramaticiiModal,
  type GrammarTopic,
} from '../src/components/casaGramaticii';

describe('Theoretical Grammar Hub (Casa Gramaticii / Școala din Sat)', () => {
  it('covers all 6 foundational grammar pillars plus syntax bridging', () => {
    const expectedPillars: GrammarTopic[] = [
      'substantiv',
      'adjectiv',
      'verb',
      'pronume',
      'numeral',
      'propozitie',
    ];

    const actualIds = GRAMMAR_PILLARS.map((p) => p.id);
    expectedPillars.forEach((expectedId) => {
      assert.ok(
        actualIds.includes(expectedId),
        `Missing grammar pillar: ${expectedId}`
      );
    });
    assert.strictEqual(GRAMMAR_PILLARS.length, 6);
  });

  it('provides UK SPaG cross-linguistic anchors for every part of speech', () => {
    GRAMMAR_PILLARS.forEach((pillar) => {
      assert.ok(
        pillar.englishSpagTerm && pillar.englishSpagTerm.trim().length > 0,
        `Pillar ${pillar.id} must define an englishSpagTerm for UK KS2 bridging`
      );
      assert.ok(
        pillar.contrastWithEnglish &&
          pillar.contrastWithEnglish.explanation.length > 20,
        `Pillar ${pillar.id} must have a rich contrastive explanation between English and Romanian`
      );
    });
  });

  it('equips Tudor with detective identification questions and rules with concrete examples', () => {
    GRAMMAR_PILLARS.forEach((pillar) => {
      assert.ok(
        pillar.secretQuestion && pillar.secretQuestion.includes('?'),
        `Pillar ${pillar.id} must have a detective question with a question mark`
      );
      assert.ok(
        pillar.rules.length >= 2,
        `Pillar ${pillar.id} should have at least 2 distinct pedagogical rules`
      );
      pillar.rules.forEach((rule) => {
        assert.ok(rule.title.length > 0, 'Rule must have a title');
        assert.ok(rule.desc.length > 10, 'Rule must have a description');
        assert.ok(rule.example.length > 0, 'Rule must provide a concrete example');
      });
    });
  });

  it('includes interactive non-punitive mini-quizzes with valid answers', () => {
    GRAMMAR_PILLARS.forEach((pillar) => {
      const q = pillar.quiz;
      assert.ok(q.question.length > 5, 'Quiz must have a question');
      assert.ok(q.options.length >= 2, 'Quiz must have at least 2 options');
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `Quiz correctIndex (${q.correctIndex}) out of bounds for pillar ${pillar.id}`
      );
      assert.ok(
        q.explanation.length > 10,
        `Quiz explanation must be informative and supportive for pillar ${pillar.id}`
      );
    });
  });

  it('links relevant pillars to practice stations in the village', () => {
    const pillarsWithStations = GRAMMAR_PILLARS.filter((p) => p.stationAction);
    assert.ok(
      pillarsWithStations.length >= 4,
      'At least 4 pillars should have direct action links to practice stations'
    );
  });
});

describe('Visual Syntax Detector (Detectorul Vizual de Părți de Vorbire)', () => {
  it('provides authentic, colorful sentences for hands-on word dissection', () => {
    assert.ok(
      SYNTAX_SENTENCES.length >= 3,
      'Should provide at least 3 sentences for syntax exploration'
    );

    SYNTAX_SENTENCES.forEach((s) => {
      assert.ok(s.id.startsWith('SENT-'), `Sentence ID must start with SENT-: ${s.id}`);
      assert.ok(s.fullText.length > 10, 'Sentence must have full text');
      assert.ok(s.words.length >= 4, 'Sentence should have at least 4 parsed words');

      s.words.forEach((w) => {
        assert.ok(w.word.length > 0, 'Word token must not be empty');
        assert.ok(w.role.length > 0, 'Role must be defined');
        assert.ok(w.roleLabel.length > 0, 'Role label must be defined');
        assert.ok(w.color.length > 0, 'Color code must be specified');
        assert.ok(
          w.explanation.length > 10,
          `Explanation for word "${w.word}" must be informative`
        );
      });
    });
  });
});

describe('CasaGramaticiiModal Component Mounting', () => {
  it('instantiates cleanly and renders modal structure', () => {
    // Mock minimal DOM container
    const container = {
      innerHTML: '',
      querySelector: (_sel: string) => null,
      querySelectorAll: (_sel: string) => [],
    } as unknown as HTMLElement;

    let closed = false;
    let navigatedStation = '';

    const modal = new CasaGramaticiiModal(
      container,
      () => {
        closed = true;
      },
      (station) => {
        navigatedStation = station;
      }
    );

    assert.ok(modal, 'Modal instance must exist');
    modal.render();
    assert.ok(
      container.innerHTML.includes('Școala din Sat — Casa Gramaticii'),
      'Rendered HTML must contain Casa Gramaticii title'
    );
    assert.ok(
      container.innerHTML.includes('Substantivul'),
      'Rendered HTML must contain initial pillar'
    );
    assert.ok(
      container.innerHTML.includes('Detectorul de Cuvinte'),
      'Rendered HTML must contain detector tab'
    );
  });
});
