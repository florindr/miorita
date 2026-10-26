// scripts/populateCurated.ts — Sync 10 Sets (100 Questions) to content/items/curated.json
import * as fs from 'fs';
import * as path from 'path';
import { QUEST_SETS } from '../src/content/questSets';

const stationMap: Record<string, string> = {
  GEN: 'gen',
  CAS: 'cas',
  CLQ: 'clq',
  ART: 'art',
  SUB: 'sub',
  POS: 'pos',
  NUM: 'num',
  CLI: 'cli',
  AGR: 'agr',
  ORD: 'stana',
};

const items: any[] = [];

for (const set of QUEST_SETS) {
  for (const q of set.questions) {
    items.push({
      id: q.id,
      category: q.category,
      station: stationMap[q.category] || 'gen',
      mechanic: 'choose',
      promptRo: `${q.situation} ${q.title}`,
      englishShape: q.englishTrap,
      answer: q.authenticRom,
      options: q.options,
      hintRo: q.hint,
      bridgeEn: q.bridge,
      difficulty: 1,
      status: 'approved',
      source: 'curated',
    });
  }
}

const outFile = path.resolve(process.cwd(), 'content/items/curated.json');
fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf-8');
console.log(`✓ Successfully populated ${items.length} curated questions into content/items/curated.json!`);
