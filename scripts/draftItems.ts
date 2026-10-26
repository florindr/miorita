// scripts/draftItems.ts — Vertex AI Gemini Item Drafter
// Generates draft items for a given taxonomy category following Romanian heritage learning design
// Run with: npm run content:draft -- --category CAS --count 5 [--dry-run]

import * as fs from 'fs';
import * as path from 'path';
import { getVertexAI } from './lib/vertex';
import { VERTEX_CONFIG } from './vertex.config';

function parseArgs() {
  const args = process.argv.slice(2);
  let category = 'CAS';
  let count = 5;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && args[i + 1]) {
      category = args[i + 1].toUpperCase();
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1], 10) || 5;
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  return { category, count, dryRun };
}

async function main() {
  const { category, count, dryRun } = parseArgs();
  console.log(`Drafting ${count} items for category [${category}] using Vertex model [${VERTEX_CONFIG.models.text}]...`);

  const taxonomyPath = path.resolve(process.cwd(), 'content/taxonomy.json');
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8'));
  const catInfo = taxonomy.categories.find((c: any) => c.id === category);

  if (!catInfo) {
    console.error(`Category ${category} not found in content/taxonomy.json`);
    process.exit(1);
  }

  const prompt = `
You are a senior Romanian linguist and pedagogy expert designing exercises for Tudor, an 8-year-old boy living in London who speaks Romanian at home but thinks in English.
Target Category: ${catInfo.id} - ${catInfo.name}
Station: ${catInfo.stationName} (${catInfo.stationId})
English Interference Pattern: ${catInfo.englishInterference}
Grammar Rule: ${catInfo.rule}

Generate ${count} child-friendly exercises following this exact JSON array format:
[
  {
    "id": "${category}-XXXX",
    "category": "${category}",
    "station": "${catInfo.stationId}",
    "mechanic": "choose",
    "promptRo": "Romanian prompt context",
    "englishShape": "the English interference trap phrase (e.g. casa la bunica)",
    "answer": "the correct Romanian authentic answer",
    "options": ["distractor 1", "distractor 2", "correct answer"],
    "hintRo": "Short, gentle hint in Miorița ewe-lamb friendly voice (max 2 sentences, no negative framing)",
    "bridgeEn": "One-line contrastive explanation explaining why English causes the error and how Romanian thinks differently",
    "difficulty": 1,
    "status": "draft",
    "source": "ai-draft"
  }
]
Return ONLY valid JSON.
`;

  if (dryRun) {
    console.log('[DRY-RUN] Would send prompt to Vertex AI:');
    console.log(prompt.trim());
    return;
  }

  try {
    const ai = getVertexAI();
    const response = await ai.models.generateContent({
      model: VERTEX_CONFIG.models.text,
      contents: prompt,
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const items = JSON.parse(cleanJson);

    const draftsFile = path.resolve(process.cwd(), 'content/items/drafts.json');
    let existing: any[] = [];
    if (fs.existsSync(draftsFile)) {
      existing = JSON.parse(fs.readFileSync(draftsFile, 'utf-8'));
    }

    const updated = [...existing, ...items];
    fs.writeFileSync(draftsFile, JSON.stringify(updated, null, 2));
    console.log(`✓ Successfully appended ${items.length} drafted items to content/items/drafts.json!`);
  } catch (err: any) {
    console.error(`Error drafting items via Vertex AI: ${err.message}`);
    console.warn('Tip: Run `gcloud auth application-default login --project antigravity-512715` to enable ADC credentials.');
  }
}

main().catch(console.error);
