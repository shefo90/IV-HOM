import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Lets the admin work under `npm run dev` without CORS. Only /api is
      // proxied: /media and /content.json are served straight out of public/
      // by Vite in development, and by nginx from the content volume in
      // production — the API never serves either.
      proxy: {
        '/api': {target: process.env.IV_API_ORIGIN || 'http://localhost:8000', changeOrigin: true},
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
