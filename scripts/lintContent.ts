// scripts/lintContent.ts — Pedagogical & Typographical Content Linter
// Enforces:
// 1. Strict comma-below Romanian diacritics (ș, ț vs obsolete Turkish cedillas ş, ţ)
// 2. ADHD sentence constraint: hints must be <= 2 sentences
// 3. Zod schema compliance for Item data model
// 4. Contrastive bridge notes for English interference
// Run with: npm run content:lint

import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

const ItemSchema = z.object({
  id: z.string().min(3),
  category: z.enum(['GEN', 'AGR', 'ART', 'POS', 'CAS', 'CLI', 'SUB', 'NUM', 'CLQ', 'ORD']),
  station: z.string().min(2),
  mechanic: z.enum(['sort3', 'choose', 'tiles', 'gapfill', 'catch-calque', 'say']),
  promptRo: z.string().min(1),
  englishShape: z.string().optional(),
  answer: z.string().min(1),
  accepted: z.array(z.string()).optional(),
  options: z.array(z.string()).optional(),
  tiles: z.array(z.string()).optional(),
  hintRo: z.string().min(1),
  bridgeEn: z.string().min(1),
  image: z.string().optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  status: z.enum(['draft', 'approved']),
  source: z.enum(['curated', 'ai-draft', 'caiet', 'gem-import']),
});

// Forbidden Turkish cedilla diacritics that should be comma-below in Romanian
const FORBIDDEN_CEDILLAS = /[\u015E\u015F\u0162\u0163]/;

function countSentences(text: string): number {
  const clean = text.trim();
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return sentences.length;
}

function lintFile(filePath: string): { errors: string[]; warnings: string[]; count: number } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(filePath)) {
    return { errors: [`File not found: ${filePath}`], warnings: [], count: 0 };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let items: any[] = [];
  try {
    items = JSON.parse(raw);
  } catch (err: any) {
    return { errors: [`JSON parse error in ${filePath}: ${err.message}`], warnings: [], count: 0 };
  }

  items.forEach((item, idx) => {
    const itemPrefix = `[Item ${item.id || idx}]`;

    // 1. Zod schema validation
    const parsed = ItemSchema.safeParse(item);
    if (!parsed.success) {
      errors.push(`${itemPrefix} Schema error: ${parsed.error.message}`);
    }

    // 2. Comma-below typography check
    const textFields = [item.promptRo, item.answer, item.hintRo, ...(item.options || [])];
    textFields.forEach((str) => {
      if (typeof str === 'string' && FORBIDDEN_CEDILLAS.test(str)) {
        errors.push(`${itemPrefix} Contains forbidden cedilla (ş/ţ instead of Romanian comma-below ș/ț): "${str}"`);
      }
    });

    // 3. ADHD hint length check: <= 2 sentences
    if (item.hintRo && countSentences(item.hintRo) > 2) {
      warnings.push(`${itemPrefix} Hint exceeds ADHD limit (found ${countSentences(item.hintRo)} sentences, max 2 allowed): "${item.hintRo}"`);
    }

    // 4. Contrastive bridge check
    if (!item.bridgeEn || item.bridgeEn.trim().length < 10) {
      warnings.push(`${itemPrefix} Missing or too short English contrastive bridge explanation.`);
    }
  });

  return { errors, warnings, count: items.length };
}

function main() {
  console.log('--- Miorița Pedagogical & Typographical Content Linter ---');
  const curatedPath = path.resolve(process.cwd(), 'content/items/curated.json');
  const result = lintFile(curatedPath);

  console.log(`Audited ${result.count} curated items in content/items/curated.json`);

  if (result.warnings.length > 0) {
    console.log(`\n⚠️ Warnings (${result.warnings.length}):`);
    result.warnings.forEach((w) => console.log(`  - ${w}`));
  }

  if (result.errors.length > 0) {
    console.log(`\n❌ Errors (${result.errors.length}):`);
    result.errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  }

  console.log('\n✅ All content is linguistically sound, comma-below compliant, and schema-valid!');
}

main();
