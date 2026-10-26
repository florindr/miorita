// vite.config.ts — Vite config with developer review endpoints for Miorița
import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function devReviewPlugin(): Plugin {
  return {
    name: 'miorita-dev-review-plugin',
    configureServer(server) {
      const itemsDir = resolve(__dirname, 'content/items');

      // GET /api/dev/items
      server.middlewares.use('/api/dev/items', (req, res, next) => {
        if (req.method !== 'GET') return next();
        const curatedFile = resolve(itemsDir, 'curated.json');
        const draftsFile = resolve(itemsDir, 'drafts.json');

        const curated = fs.existsSync(curatedFile) ? JSON.parse(fs.readFileSync(curatedFile, 'utf-8')) : [];
        const drafts = fs.existsSync(draftsFile) ? JSON.parse(fs.readFileSync(draftsFile, 'utf-8')) : [];

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ curated, drafts }));
      });

      // POST /api/dev/approve
      server.middlewares.use('/api/dev/approve', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body);
            const curatedFile = resolve(itemsDir, 'curated.json');
            const draftsFile = resolve(itemsDir, 'drafts.json');

            const curated = fs.existsSync(curatedFile) ? JSON.parse(fs.readFileSync(curatedFile, 'utf-8')) : [];
            let drafts = fs.existsSync(draftsFile) ? JSON.parse(fs.readFileSync(draftsFile, 'utf-8')) : [];

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
    }
  };
}

export default defineConfig({
  plugins: [devReviewPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        review: resolve(__dirname, 'review.html'),
      },
    },
  },
});
