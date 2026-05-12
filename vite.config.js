import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Reads the built CSS file and inlines it into the HTML
function inlineCssPlugin() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Grab all CSS chunks from the in-memory bundle
      const cssChunks = Object.entries(bundle).filter(
        ([, chunk]) => chunk.type === 'asset' && chunk.fileName.endsWith('.css'),
      );

      const htmlChunk = Object.values(bundle).find(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.html'),
      );

      if (!htmlChunk || cssChunks.length === 0) return;

      // Concatenate all CSS
      let css = '';
      for (const [name, chunk] of cssChunks) {
        css += chunk.source;
        delete bundle[name]; // remove the .css file from output
      }

      // Replace the <link> tag with an inline <style>
      htmlChunk.source = htmlChunk.source
        .replace(/<link rel="stylesheet" crossorigin href="[^"]+\.css">/g, '')
        .replace('</head>', `<style>${css}</style>\n</head>`);
    },
  };
}

export default defineConfig({
  plugins: [
    inlineCssPlugin(),
    imagetools({
      include: /photos\/.*\.(jpg|jpeg|png|webp|JPG|JPEG|PNG)/,
      defaultDirectives: () =>
        new URLSearchParams({
          w: '1600;1200;800;480',
          aspect: '3:2',
          fit: 'cover',
          quality: '70',
          as: 'metadata',
        }),
    }),
  ],
});
