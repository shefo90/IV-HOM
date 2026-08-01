/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// NOTE: this script writes img-<md5>.<ext> filenames, but the six files
// currently on disk in src/assets/images/standalone were deliberately renamed
// to semantic names (e.g. factory-cnc-cutting.jpg) after extraction, and
// manifest.json was hand-updated to match, and the page components import
// those semantic filenames directly. Running this script again with --force
// will regenerate hash-named files and a hash-keyed manifest, silently
// desynchronising it from what the components actually import. Do not run
// with --force unless you also intend to update every import across
// src/pages and re-sync manifest.json by hand.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'public/pages';
const OUT = 'src/assets/images/standalone';
const RE = /data:image\/([a-z]+);base64,([A-Za-z0-9+/=]+)/g;

// Guard against overwriting existing extraction
const manifestPath = path.join(OUT, 'manifest.json');
const force = process.argv.includes('--force');

if (fs.existsSync(manifestPath) && !force) {
  console.log('⚠️  Image extraction has already run.');
  console.log('To extract images from scratch, use: node scripts/extract-images.mjs --force');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.html'))) {
  const text = fs.readFileSync(path.join(SRC, file), 'utf8');
  for (const [, ext, b64] of text.matchAll(RE)) {
    const hash = crypto.createHash('md5').update(b64).digest('hex').slice(0, 10);
    if (manifest[hash]) {
      if (!manifest[hash].pages.includes(file)) manifest[hash].pages.push(file);
      continue;
    }
    const name = `img-${hash}.${ext === 'jpeg' ? 'jpg' : ext}`;
    fs.writeFileSync(path.join(OUT, name), Buffer.from(b64, 'base64'));
    manifest[hash] = { file: name, pages: [file] };
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Extracted ${Object.keys(manifest).length} unique images`);
