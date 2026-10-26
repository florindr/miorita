// tests/motifs.test.ts — Unit tests for folk cross-stitch motif renderer
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { STARTER_MOTIFS, renderMotifSVG } from '../src/motifs/motifRenderer';

describe('Romanian Folk Motif Engine', () => {
  test('Contains 7 canonical folk motifs as code', () => {
    assert.equal(STARTER_MOTIFS.length, 7);
    const names = STARTER_MOTIFS.map(m => m.nameRo);
    assert.ok(names.includes('Steaua în 8 colțuri'));
    assert.ok(names.includes('Coarnele Berbecului'));
    assert.ok(names.includes('Pomul Vieții'));
    assert.ok(names.includes('Rombul Cusut'));
    assert.ok(names.includes('Spicul de Grâu'));
    assert.ok(names.includes('Calea Rătăcită'));
    assert.ok(names.includes('Cocoșul de Horezu'));
  });

  test('Grid dimensions match width and height specifications', () => {
    STARTER_MOTIFS.forEach(motif => {
      assert.equal(motif.grid.length, motif.height, `Height mismatch for ${motif.id}`);
      motif.grid.forEach((row, rowIdx) => {
        assert.equal(row.length, motif.width, `Width mismatch for ${motif.id} at row ${rowIdx}`);
      });
    });
  });

  test('renderMotifSVG outputs valid SVG string with viewBox', () => {
    const star = STARTER_MOTIFS[0];
    const svg = renderMotifSVG(star, 6);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes(`viewBox="0 0 ${star.width * 6} ${star.height * 6}"`));
    assert.ok(svg.includes('stroke-linecap="square"'));
    assert.ok(svg.endsWith('</svg>'));
  });
});
