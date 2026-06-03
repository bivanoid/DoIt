import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/DoIt/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      scope: '/DoIt/',
      base: '/DoIt/',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/DoIt/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      },
      manifest: {
        name: 'Todo App',
        short_name: 'DoIt',
        theme_color: '#ffffff',
        start_url: '/DoIt/', // ✅ wajib ada
        scope: '/DoIt/',     // ✅ wajib ada
        display: 'standalone',
        icons: [
          { src: '/DoIt/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/DoIt/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})