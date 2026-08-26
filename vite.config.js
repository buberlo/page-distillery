import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const openaiTarget = env.OPENAI_PROXY_TARGET || 'https://api.openai.com';
  const openaiSecure = env.OPENAI_PROXY_SECURE !== 'false';
  const sourceMaps = env.VITE_SOURCEMAP === 'true';

  return {
    plugins: [react()],
    envPrefix: ['VITE_'],
    server: {
      host: true,
      port: Number(env.VITE_PORT || 3000),
      strictPort: env.VITE_STRICT_PORT === 'true',
      open: env.VITE_OPEN === 'true',
      proxy: {
        '/openai': {
          target: openaiTarget,
          changeOrigin: true,
          secure: openaiSecure,
          ws: true,
          rewrite: (path) => path.replace(/^\/openai/, ''),
          configure: (proxy) => {
            proxy.on('error', (error) => {
              console.error('[vite] OpenAI proxy error:', error);
            });

            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY;

              if (apiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              }
            });
          },
        },
      },
    },
    preview: {
      host: true,
      port: Number(env.VITE_PREVIEW_PORT || 4173),
    },
    build