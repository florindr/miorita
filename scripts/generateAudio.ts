// scripts/generateAudio.ts — Build-time Cloud TTS Audio Generator for Romanian Items
// Synthesizes native ro-RO-Wavenet-A audio clips into public/audio/ with sidecar metadata
// Run with: npm run content:audio [--dry-run]

import * as fs from 'fs';
import * as path from 'path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { VERTEX_CONFIG } from './vertex.config';

interface Item {
  id: string;
  promptRo: string;
  answer: string;
  hintRo: string;
}

const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  const itemsPath = path.resolve(process.cwd(), 'content/items/curated.json');
  if (!fs.existsSync(itemsPath)) {
    console.error(`Curated items file not found: ${itemsPath}`);
    process.exit(1);
  }

  const items: Item[] = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));
  console.log(`Found ${items.length} items to process for audio clips...`);

  let ttsClient: TextToSpeechClient | null = null;
  if (!isDryRun) {
    try {
      ttsClient = new TextToSpeechClient({
        projectId: VERTEX_CONFIG.project,
      });
    } catch (err: any) {
      console.warn(`Could not initialize TextToSpeechClient: ${err.message}`);
      console.warn('Tip: Run `gcloud auth application-default login --project antigravity-512715`');
    }
  }

  for (const item of items) {
    const clips = [
      { key: 'prompt', text: item.promptRo },
      { key: 'answer', text: item.answer },
      { key: 'hint', text: item.hintRo },
    ];

    for (const clip of clips) {
      const fileName = `${item.id}-${clip.key}.mp3`;
      const metaName = `${item.id}-${clip.key}.meta.json`;
      const filePath = path.join(AUDIO_DIR, fileName);
      const metaPath = path.join(AUDIO_DIR, metaName);

      if (fs.existsSync(filePath)) {
        console.log(`✓ ${fileName} already exists. Skipping.`);
        continue;
      }

      console.log(`Generating [${VERTEX_CONFIG.models.ttsVoice}]: ${fileName} -> "${clip.text}"`);

      if (isDryRun || !ttsClient) {
        console.log(`[DRY-RUN / MOCK] Would synthesize: "${clip.text}"`);
        continue;
      }

      try {
        const [response] = await ttsClient.synthesizeSpeech({
          input: { text: clip.text },
          voice: {
            languageCode: 'ro-RO',
            name: VERTEX_CONFIG.models.ttsVoice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.95,
            pitch: 1.0,
          },
        });

        if (response.audioContent) {
          fs.writeFileSync(filePath, response.audioContent as Buffer);

          const meta = {
            id: item.id,
            clip: clip.key,
            text: clip.text,
            voice: VERTEX_CONFIG.models.ttsVoice,
            project: VERTEX_CONFIG.project,
            date: new Date().toISOString(),
          };
          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
          console.log(`✓ Saved ${fileName}`);
        }
      } catch (err: any) {
        console.error(`✗ Error generating ${fileName}: ${err.message}`);
      }
    }
  }

  console.log('Audio generation step complete.');
}

main().catch(console.error);
