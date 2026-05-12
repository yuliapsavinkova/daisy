import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Plugin 1: Inline CSS ──────────────────────────────────────────────────────
function inlineCssPlugin() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssChunks = Object.entries(bundle).filter(
        ([, chunk]) => chunk.type === 'asset' && chunk.fileName.endsWith('.css'),
      );
      const htmlChunks = Object.values(bundle).filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.html'),
      );

      if (htmlChunks.length === 0 || cssChunks.length === 0) return;

      let css = '';
      for (const [name, chunk] of cssChunks) {
        css += chunk.source;
        delete bundle[name];
      }

      // Apply to ALL html files (root + long-term page)
      for (const htmlChunk of htmlChunks) {
        htmlChunk.source = htmlChunk.source
          .replace(/<link rel="stylesheet" crossorigin href="[^"]+\.css">/g, '')
          .replace('</head>', `<style>${css}</style>\n</head>`);
      }
    },
  };
}

// ── Plugin 2: Preload LCP Image ───────────────────────────────────────────────
function preloadLCPImagePlugin() {
  return {
    name: 'preload-lcp-image',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Only inject into root index.html, not the subpage
      const htmlChunk = Object.values(bundle).find(
        (c) => c.type === 'asset' && c.fileName === 'index.html',
      );
      if (!htmlChunk) return;

      const widths = [480, 640, 800, 1200, 1600];

      const webpAssets = Object.keys(bundle)
        .filter((k) => k.startsWith('assets/') && k.endsWith('.webp'))
        .sort();

      if (webpAssets.length === 0) return;

      // Extract prefix of the first image (e.g. "01-hero")
      const firstFile = webpAssets[0].split('/').pop(); // "01-hero-CPnO6eyv.webp"
      const firstPrefix = firstFile.replace(/-[A-Za-z0-9_-]{8}\.webp$/, '');

      const firstImageVariants = webpAssets
        .filter((k) => k.split('/').pop().startsWith(firstPrefix))
        .sort((a, b) => {
          // Sort by file size ascending so smallest width comes first
          const sizeA = bundle[a]?.source?.length ?? 0;
          const sizeB = bundle[b]?.source?.length ?? 0;
          return sizeA - sizeB;
        });

      if (firstImageVariants.length === 0) return;

      const srcsetParts = firstImageVariants
        .map((k, i) => `/${k} ${widths[i] ?? widths[widths.length - 1]}w`)
        .join(', ');

      const preloadTag = `<link rel="preload" as="image" fetchpriority="high" imagesrcset="${srcsetParts}" imagesizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 98vw" type="image/webp">`;

      htmlChunk.source = htmlChunk.source.replace('</head>', `${preloadTag}\n</head>`);
    },
  };
}

// ── Main Config ───────────────────────────────────────────────────────────────
export default defineConfig({
  appType: 'mpa',
  plugins: [
    inlineCssPlugin(),
    preloadLCPImagePlugin(),
    imagetools({
      include: /photos\/.*\.(jpg|jpeg|png|webp|JPG|JPEG|PNG)/,
      defaultDirectives: () =>
        new URLSearchParams({
          w: '1600;1200;800;700;640;480', // ADD 700
          aspect: '3:2',
          fit: 'cover',
          quality: '65', // DROP from 70 → 65 (addresses the compression warning)
          as: 'metadata',
        }),
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        // Root page
        main: resolve(__dirname, 'index.html'),
        // Subpage — Vite will copy it to dist/long-term-house-sitter-california/index.html
        longTerm: resolve(__dirname, 'long-term-house-sitter-california/index.html'),
      },
    },
  },
});
