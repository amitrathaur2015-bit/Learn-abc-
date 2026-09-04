import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg'],
      manifest: {
        name: 'Chhota Scholar - Kids Learning',
        short_name: 'Chhota Scholar',
        description: 'A fun, colorful learning world for little learners - writing, English, Hindi, Maths and more.',
        theme_color: '#FFC93C',
        background_color: '#FFF8EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'maskable' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache the app shell (already default) and cache Google Fonts at
        // runtime so the child's core screens still open with no signal
        // after the first successful load - the brief's "offline support for
        // suitable basic content". Data that needs a live Supabase (Parent
        // Area, Admin, premium checks) still requires a connection, which is
        // the correct behavior for anything security/payment-related.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})
