// vite.config.ts — Vite config with Live Gemini Agentic Tutor & Developer Review endpoints
import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { MioritaTutorProxy } from './src/ai/mioritaTutorProxy';

function getGeminiApiKey(): string {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  for (const f of ['.env.local', '.env']) {
    const p = resolve(__dirname, f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      const match = content.match(/^(?:GEMINI_API_KEY|GOOGLE_API_KEY)=(.+)$/m);
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return '';
}

function mioritaServerPlugin(): Plugin {
  return {
    name: 'miorita-server-plugin',
    configureServer(server) {
      const itemsDir = resolve(__dirname, 'content/items');

      // 1. Live AI Status endpoint
      server.middlewares.use('/api/ai/status', (_req, res) => {
        const key = getGeminiApiKey();
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            live: Boolean(key),
            keyConfigured: Boolean(key),
            model: 'gemini-3.5-flash-lite',
          })
        );
      });

      // 2. Live Socratic Agentic Tutor Chat endpoint (POST /api/tutor/chat)
      server.middlewares.use('/api/tutor/chat', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const apiKey = getGeminiApiKey();
            const result = await MioritaTutorProxy.handleChatTurn(payload, apiKey);
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.body));
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Invalid tutor chat request' }));
          }
        });
      });

      // 3. GET /api/dev/items
      server.middlewares.use('/api/dev/items', (req, res, next) => {
        if (req.method !== 'GET') return next();
        const curatedFile = resolve(itemsDir, 'curated.json');
        const draftsFile = resolve(itemsDir, 'drafts.json');

        const curated = fs.existsSync(curatedFile)
          ? JSON.parse(fs.readFileSync(curatedFile, 'utf-8'))
          : [];
        const drafts = fs.existsSync(draftsFile)
          ? JSON.parse(fs.readFileSync(draftsFile, 'utf-8'))
          : [];

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ curated, drafts }));
      });

      // 4. POST /api/dev/approve
      server.middlewares.use('/api/dev/approve', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body);
            const curatedFile = resolve(itemsDir, 'curated.json');
            const draftsFile = resolve(itemsDir, 'drafts.json');

            const curated = fs.existsSync(curatedFile)
              ? JSON.parse(fs.readFileSync(curatedFile, 'utf-8'))
              : [];
            let drafts = fs.existsSync(draftsFile)
              ? JSON.parse(fs.readFileSync(draftsFile, 'utf-8'))
              : [];

            const itemToApprove = drafts.find((i: any) => i.id === id);
            if (itemToApprove) {
              itemToApprove.status = 'approved';
              curated.push(itemToApprove);
              drafts = drafts.filter((i: any) => i.id !== id);

              fs.writeFileSync(curatedFile, JSON.stringify(curated, null, 2));
              fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, approvedId: id }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [mioritaServerPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        review: resolve(__dirname, 'review.html'),
      },
    },
  },
});
