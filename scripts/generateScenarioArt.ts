// scripts/generateScenarioArt.ts — On-the-fly Vertex AI / Imagen 3 Linocut Scene Generator
// Generates rustic Romanian linocut illustrations for new learning scenarios.
// Run with: npm run art:generate -- --scenario <id> --scene "<description>" [--dry-run]

import * as fs from 'fs';
import * as path from 'path';
import { getVertexAI } from './lib/vertex';
import { VERTEX_CONFIG } from './vertex.config';

const STYLE_BIBLE = `
STYLE: flat gouache and linocut illustration for a children's learning app,
rustic Romanian village aesthetic, light and airy, generous negative space,
unbleached linen paper texture, limited palette: linen cream #F4EEE3,
stitch black #2B2622, ie-embroidery red #B23A2E, Voronet blue #2F5D8A,
sage green #6E8B5E, Horezu ochre #C8902E, walnut brown #6B4A2F.
Folk details only as small accents: thin red-and-black cross-stitch bands,
simple Maramures carved-wood shapes, Horezu pottery spirals.
Soft, warm, friendly, slightly naive shapes, visible brush texture.
NOT: Brancovenesc ornament, gold leaf, baroque frames, Byzantine icons,
heavy borders, glossy 3D, photorealism, tourist kitsch, vampires, text or lettering.
`.trim();

function parseArgs() {
  const args = process.argv.slice(2);
  let scenario = 'new_scenario';
  let scene = 'A sunny Romanian meadow with Miorița the cute lamb exploring wildflowers';
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scenario' && args[i + 1]) {
      scenario = args[i + 1].toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      i++;
    } else if (args[i] === '--scene' && args[i + 1]) {
      scene = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  return { scenario, scene, dryRun };
}

async function main() {
  const { scenario, scene, dryRun } = parseArgs();
  console.log(`\n🎨 [Miorița Art Pipeline] Preparing illustration for scenario: [${scenario}]`);

  const fullPrompt = `${STYLE_BIBLE}\n\nSCENE: ${scene}`;
  const outDir = path.resolve(process.cwd(), 'public/art/stations');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, `${scenario}.jpg`);

  console.log(`Prompt preview:\n---\n${fullPrompt}\n---`);
  console.log(`Target destination: ${outFile}`);

  if (dryRun) {
    console.log('✓ [DRY-RUN] Prompt verified. No API call made.');
    return;
  }

  try {
    const ai = getVertexAI();
    console.log(`Sending generation request to Vertex AI Model [${VERTEX_CONFIG.models.imageGen}]...`);
    const response = await (ai.models as any).generateImages({
      model: VERTEX_CONFIG.models.imageGen,
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '4:3',
        outputMimeType: 'image/jpeg',
      },
    });

    if (response?.generatedImages?.[0]?.image?.imageBytes) {
      const buffer = Buffer.from(response.generatedImages[0].image.imageBytes, 'base64');
      fs.writeFileSync(outFile, buffer);
      console.log(`✓ Successfully generated and saved: public/art/stations/${scenario}.jpg`);
    } else {
      console.warn('⚠️ No image bytes returned. Check Vertex model availability or ADC quota.');
    }
  } catch (err: any) {
    console.warn(`⚠️ Vertex AI Generation failed: ${err.message}`);
    console.log(`ℹ️ Fallback active: Miorița's Procedural SVG engine will dynamically render "${scenario}" on the fly.`);
  }
}

main().catch(console.error);
