/**
 * scripts/resize-photos.js
 *
 * Generates 450-wide WebP thumbnails for all photos in ./photos/
 * into ./photos/small/ — run once before `vite build` to enable
 * responsive srcset in the carousel.
 *
 * Usage:  node scripts/resize-photos.js
 * Prereq: pnpm add -D sharp
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const SRC_DIR = new URL('../photos', import.meta.url).pathname;
const OUT_DIR = new URL('../photos/small', import.meta.url).pathname;
const WIDTH = 450;
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => EXTS.has(extname(f).toLowerCase()));

await Promise.all(
  files.map(async (file) => {
    const src = join(SRC_DIR, file);
    const name = basename(file, extname(file));
    const dest = join(OUT_DIR, `${name}.webp`); // always output webp

    await sharp(src)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest);

    console.log(`✓  ${file} → small/${name}.webp`);
  }),
);

console.log(`\nDone — ${files.length} thumbnails written to photos/small/`);
