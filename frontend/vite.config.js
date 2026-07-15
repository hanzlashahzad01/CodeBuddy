import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'CodeBuddy Academy',
        short_name: 'CodeBuddy',
        description: 'Pakistan\'s #1 Coding Learning Platform - Learn to Code in Hindi/Urdu',
        theme_color: '#4f46e5',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/codebuddy_avatar.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/codebuddy_avatar.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: '/codebuddy_avatar.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
