import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The API base URL is read at build time from VITE_API_URL (see .env.example).
// In dev, requests to /api are proxied to the local server so cookies/CORS
// stay simple.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Enable the service worker in `vite dev` so offline behavior is testable.
      devOptions: { enabled: true },
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Expense Tracker',
        short_name: 'Expenses',
        description: 'Track your expenses, online or offline.',
        theme_color: '#4f46e5',
        background_color: '#f5f5f7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Read-only API GETs: serve from network, fall back to cache offline.
            urlPattern: ({ url, request }) =>
              url.pathname.startsWith('/api/') && request.method === 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-get-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Expense writes made offline: queue and replay on reconnect.
            urlPattern: ({ url, request }) =>
              url.pathname.startsWith('/api/expenses') &&
              request.method !== 'GET',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'expense-write-queue',
                options: { maxRetentionTime: 24 * 60 }, // minutes
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
