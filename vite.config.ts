import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// No localhost, /api/status roda o mesmo verificador da função da Vercel (api/status.ts).
function statusLocal(): Plugin {
  return {
    name: 'status-local',
    configureServer(server) {
      server.middlewares.use('/api/status', async (_req, res) => {
        try {
          const { verificarStatus } = await server.ssrLoadModule('/server/verificarStatus.ts');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(await verificarStatus()));
        } catch (causa) {
          res.statusCode = 500;
          res.end(JSON.stringify({ erro: causa instanceof Error ? causa.message : 'Falha ao verificar.' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), statusLocal()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
