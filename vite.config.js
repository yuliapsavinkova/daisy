import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  root: './',
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'sitemap.xml'],
      manifest: {
        name: 'Yulia Sitter',
        short_name: 'Yulia',
        theme_color: '#8b6f47',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
    viteImagemin({
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.8] },
      webp: { quality: 80 },
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        nested: './404.html',
      },
    },
  },
});
