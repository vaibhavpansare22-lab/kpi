import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory / initial data storage in server
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TeamPulse API',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/info', (req, res) => {
    res.json({
      appName: 'TeamPulse — Employee Performance Dashboard',
      version: '1.0.0',
      features: ['RBAC', 'OrgHierarchy', 'KPIEngine', 'RallySync', 'WorkdaySync'],
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TeamPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
