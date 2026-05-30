import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Three Things to Do',
        short_name: 'ThreeThings',
        description: 'A smooth, visually beautiful, aesthetically calming calendar app.',
        theme_color: '#ff6b6b',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
             src: 'favicon.svg',
             sizes: '192x192',
             type: 'image/svg+xml'
          },
          {
             src: 'favicon.svg',
             sizes: '512x512',
             type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  base: '/three-things-to-do/',
})
