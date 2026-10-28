// tests/tutorWidgets.test.ts — Unit tests for JS Interactive Widgets, Voice Matcher & Full-Stage Tutor
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
  generateAgentEmbedHtml,
  WordMorphSliderWidget,
  CalqueZapperWidget,
  BridgeTileSnapWidget,
  RoleReversalDetectorWidget,
  GenderBasketMiniWidget,
  CheckpointTrailWidget,
  type TutorWidgetResult,
} from '../src/components/tutorWidgets';
import { evaluateSpeechHypotheses, normalizeRoTranscript } from '../src/audio/voiceRecognizer';
import { buildTutorScenario } from '../src/content/tutorScenarios';
import { TutoreAgenticStation } from '../src/stations/tutoreAgentic';

function createMockElement(): HTMLElement {
  return {
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    appendChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
  } as unknown as HTMLElement;
}

describe('Phase 10 & 11: Interactive JS Widgets, Bidirectional Voice & Full-Stage Tutor', () => {
  test('WordMorphSliderWidget morphs English trap into inflected Romanian and awards +3 golden stitches', () => {
    const container = createMockElement();
    let result: TutorWidgetResult | null = null;

    const widget = new WordMorphSliderWidget(
      container,
      {
        type: 'WordMorphSlider',
        titleRo: 'Transformă cuvântul!',
        category: 'CAS',
        englishTrapRo: 'casa la bunica',
        morphedCorrectRo: 'casa bunicii',
        stemText: 'casa bunic',
        suffixHighlight: '-ii',
        explanationRo: 'Punem terminația -ii.',
        bridgeEn: 'Possessive suffix -ii.',
      },
      (res) => {
        result = res;
      }
    );

    assert.equal(widget.isMorphed(), false);
    assert.ok(container.innerHTML.includes('casa la bunica'));

    widget.triggerMorph();
    assert.equal(widget.isMorphed(), true);
    assert.ok(container.innerHTML.includes('-ii'));
    assert.ok(result);
    assert.equal((result as TutorWidgetResult).goldenStitches, 3);
    assert.equal((result as TutorWidgetResult).spokenOrTappedPhrase, 'casa bunicii');
  });

  test('CalqueZapperWidget zaps English calques into natural Romanian', () => {
    const container = createMockElement();
    let result: TutorWidgetResult | null = null;

    const widget = new CalqueZapperWidget(
      container,
      {
        type: 'CalqueZapper',
        titleRo: 'Prinzătorul de Englezisme',
        category: 'CLQ',
        calqueBubbleRo: 'Eu sunt 8 ani și face sens!',
        naturalBubbleRo: 'Eu am 8 ani și are sens!',
        zappedKeywords: [
          { trap: 'sunt 8 ani', fix: 'am 8 ani' },
          { trap: 'face sens', fix: 'are sens' },
        ],
        explanationRo: 'Spunem am 8 ani și are sens.',
        bridgeEn: 'Romanian uses have for age and sense.',
      },
      (res) => {
        result = res;
      }
    );

    assert.equal(widget.isAllZapped(), false);
    widget.zapKeyword(0);
    assert.equal(widget.isAllZapped(), false);
    widget.zapKeyword(1);
    assert.equal(widget.isAllZapped(), true);
    assert.ok(result);
    assert.equal((result as TutorWidgetResult).goldenStitches, 3);
  });

  test('BridgeTileSnapWidget snaps connector tile and handles gentle retry nudges', () => {
    const container = createMockElement();
    let result: TutorWidgetResult | null = null;

    const widget = new BridgeTileSnapWidget(
      container,
      {
        type: 'BridgeTileSnap',
        titleRo: 'Podul lui Să',
        category: 'SUB',
        leftBankRo: 'Vreau',
        rightBankRo: 'merg afară!',
        correctTile: 'să',
        distractorTiles: ['la', 'de'],
        fullSentenceRo: 'Vreau să merg afară!',
        explanationRo: 'Punem puntea să între două verbe.',
      },
      (res) => {
        result = res;
      }
    );

    widget.selectTile('la'); // gentle nudge
    assert.equal(widget.isSnapped(), false);
    assert.ok(container.innerHTML.includes('Hai să mai ascultăm o dată'));

    widget.selectTile('să');
    assert.equal(widget.isSnapped(), true);
    assert.ok(result);
    assert.equal((result as TutorWidgetResult).attempts, 2);
  });

  test('RoleReversalDetectorWidget ("Profesorul Tudor") awards double golden stitches (+4)', () => {
    const container = createMockElement();
    let result: TutorWidgetResult | null = null;

    const widget = new RoleReversalDetectorWidget(
      container,
      {
        type: 'RoleReversalDetector',
        titleRo: 'Profesorul Tudor',
        category: 'CAS',
        mioritaQuoteWords: ['Mingea', 'la', 'băiat', 'este', 'aici!'],
        mistakeWordIndices: [1, 2],
        mistakePhraseRo: 'la băiat',
        correctedPhraseRo: 'băiatului',
        fullCorrectedSentenceRo: 'Mingea băiatului este aici!',
        explanationRo: 'Spunem mingea băiatului.',
      },
      (res) => {
        result = res;
      }
    );

    widget.tapWordIndex(0); // non-mistake word -> gentle hint
    assert.equal(widget.isCaught(), false);

    widget.tapWordIndex(1); // mistake word caught!
    assert.equal(widget.isCaught(), true);
    assert.ok(result);
    assert.equal((result as TutorWidgetResult).goldenStitches, 4);
  });

  test('GenderBasketMiniWidget sorts 3 items across M, F, and Neutru', () => {
    const container = createMockElement();
    let completed = false;

    const widget = new GenderBasketMiniWidget(
      container,
      {
        type: 'GenderBasketMini',
        titleRo: 'Trei Coșuri Rapide',
        items: [
          { nounRo: 'câine', gender: 'M', countedRo: 'un câine, doi câini', emoji: '🐕' },
          { nounRo: 'casă', gender: 'F', countedRo: 'o casă, două case', emoji: '🏡' },
          { nounRo: 'tren', gender: 'N', countedRo: 'un tren, două trenuri', emoji: '🚂' },
        ],
      },
      () => {
        completed = true;
      }
    );

    widget.chooseGender('M');
    widget.chooseGender('F');
    widget.chooseGender('N');
    assert.equal(widget.isCompleted(), true);
    assert.equal(completed, true);
  });

  test('CheckpointTrailWidget and generateAgentEmbedHtml render valid output', () => {
    const container = createMockElement();
    new CheckpointTrailWidget(container, {
      type: 'CheckpointTrailWidget',
      titleRo: 'Harta de 1 An',
      currentSeason: 1,
      currentCheckpointId: 1,
      completedCheckpoints: [],
      totalSessionsCompleted: 2,
      sessionsThisWeek: 2,
      campfireState: 'blazing',
      goldenStitchesEarned: 12,
      parolaDeCina: 'Bunica face gogoși în casa bunicii!',
    });

    assert.ok(container.innerHTML.includes('Focul de la Stână'));
    assert.ok(container.innerHTML.includes('Bunica face gogoși în casa bunicii!'));

    const embedHtml = generateAgentEmbedHtml({
      type: 'WordMorphSlider',
      titleRo: 'Atelierul de Transformare',
      category: 'CAS',
      englishTrapRo: 'casa la bunica',
      morphedCorrectRo: 'casa bunicii',
      stemText: 'casa bunic',
      suffixHighlight: '-ii',
      explanationRo: 'Genitivul -ii.',
      bridgeEn: 'Possessive ending.',
    });
    assert.ok(embedHtml.includes('https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js'));
    assert.ok(embedHtml.includes('casa bunicii'));
  });

  test('Bidirectional Voice matcher inspects 5 hypotheses, tolerates code-switching & folds diacritics', () => {
    assert.equal(normalizeRoTranscript('„Casa bunicii!”', true), 'casa bunicii');

    // Hypothesis 3 has the target Romanian inflection alongside an English loanword ("Minecraft")
    const hypotheses = [
      'casa la bunica in minecraft',
      'casa bunica',
      'am construit casa bunicii in minecraft',
    ];
    const match = evaluateSpeechHypotheses(hypotheses, ['casa bunicii']);
    assert.equal(match.matched, true);
    assert.equal(match.matchedHypothesis, 'am construit casa bunicii in minecraft');

    // Diacritic-folded match when child STT omits ș/ț/ă
    const foldedMatch = evaluateSpeechHypotheses(['vreau sa merg afara'], ['vreau să merg afară']);
    assert.equal(foldedMatch.matched, true);
  });

  test('Full-Stage TutoreAgenticStation progresses through all 4 phases and syncs state', () => {
    localStorage.clear();
    const container = createMockElement();
    const mockHud = {
      say: () => {},
      speak: () => {},
      nudge: () => {},
      celebrate: () => {},
    } as any;

    const station = new TutoreAgenticStation(container, mockHud);
    assert.equal(station.getCurrentPhase(), 'phase1_hook');
    assert.ok(container.innerHTML.includes('tutore-agentic-stage'));

    // Phase 1 -> Phase 2
    station.chooseTopicAndStartPhase2('minecraft');
    assert.equal(station.getCurrentPhase(), 'phase2_story');

    const scenario = station.getScenario();
    assert.ok(scenario.storyTurns.length > 0);
    station.handleStoryChoice(scenario.storyTurns[0].choices[0]);

    // Phase 2 -> Phase 3
    station.advanceToPhase3();
    assert.equal(station.getCurrentPhase(), 'phase3_blitz');
    station.handleBlitzChoice(scenario.blitzCards[0].choices[0]);

    // Phase 3 -> Phase 4 (Saves session to TutorProgressManager & Caiet)
    station.advanceToPhase4AndSave();
    assert.equal(station.getCurrentPhase(), 'phase4_reward');
    assert.ok(container.innerHTML.includes(scenario.parolaDeCina));
  });
});

