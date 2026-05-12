import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    imagetools({
      include: /photos\/.*\.(jpg|jpeg|png|webp|JPG|JPEG|PNG)/,
      defaultDirectives: () =>
        new URLSearchParams({
          w: '1600;1200;800;480', // Optimized range for 50vw-100vw
          aspect: '3:2',
          fit: 'cover',
          format: 'webp',
          quality: '70',
          as: 'metadata',
        }),
    }),
  ],
});
