import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    imagetools({
      include: /photos\/.*\.(jpg|jpeg|png|webp|JPG|JPEG|PNG)/,
      defaultDirectives: (url) => {
        // Generate both webp + jpeg for every image
        const params = new URLSearchParams({
          w: '1600;1200;800;480',
          aspect: '3:2',
          fit: 'cover',
          quality: '70',
          as: 'metadata',
        });
        return params;
      },
    }),
  ],
});
