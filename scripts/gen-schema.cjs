/**
 * Derives api/app/schema/site_schema.json from src/content/fallback.json.
 *
 * The schema is the contract shared by the FastAPI validator and the admin's
 * form renderer. Generating it from the real content guarantees the two match;
 * hand-writing it would drift the moment a field changed.
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/shefo/OneDrive/Desktop/iv_project';
const SRC = path.join(ROOT, 'src/content/fallback.json');
const OUT = path.join(ROOT, 'api/app/schema/site_schema.json');

const content = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// Fields rendered through <RichText>. They accept *italic*, **gold**,
// ***gold italic***, an auto-golded trailing period, and \. to opt out.
const RICHTEXT_KEYS = new Set([
  'heading', 'headingLead', 'headingRest', 'blurb', 'title', 'text', 'description',
]);
// ...but only where the component actually wraps them. Everything else with
// those key names is plain.
const RICHTEXT_PATHS = new Set([
  'site.footer.blurb',
  'about.values.feature.title',
  'process.steps[].description',
  'factory.delivery.rows[].description',
  'factory.warranty.cards[].text',
]);

// Long prose gets a textarea rather than a single-line input.
const LONG = 90;

function isRichText(pathKey, key) {
  if (key === 'heading' || key === 'headingLead' || key === 'headingRest') return true;
  return RICHTEXT_PATHS.has(pathKey);
}

function humanize(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bCta\b/g, 'CTA')
    .replace(/\bUrl\b/g, 'URL');
}

function fieldFor(key, value, pathKey) {
  const label = humanize(key);

  if (typeof value === 'string') {
    if (value.startsWith('/media/')) {
      return { key, label, type: 'image', required: true };
    }
    if (isRichText(pathKey, key)) {
      return { key, label, type: 'richtext', required: value.length > 0 };
    }
    return {
      key,
      label,
      type: value.length > LONG || value.includes('\n') ? 'text' : 'string',
      required: value.length > 0,
    };
  }

  if (Array.isArray(value)) {
    const sample = value[0];
    // Locked to the current length: the brief is text and images only, so the
    // grids keep the item counts they were designed for. Widening a list is a
    // one-value change to max.
    const bounds = { min: value.length, max: value.length };

    if (typeof sample === 'string') {
      const allMedia = value.every((v) => typeof v === 'string' && v.startsWith('/media/'));
      return { key, label, type: 'list', ...bounds, item: { type: allMedia ? 'image' : 'string' } };
    }

    // Union the keys across every item, not just the first: optional fields
    // (the lifetime warranty card's `text`) only appear on some of them.
    const merged = {};
    for (const item of value) {
      for (const [k, v] of Object.entries(item)) {
        if (!(k in merged) || merged[k] === '' || merged[k] == null) merged[k] = v;
      }
    }
    const present = new Set(Object.keys(value[0] ?? {}));
    const fields = fieldsFor(merged, `${pathKey}[]`).map((f) =>
      present.has(f.key) && value.every((i) => f.key in i) ? f : { ...f, required: false },
    );

    return { key, label, type: 'list', ...bounds, item: { type: 'group', fields } };
  }

  if (value && typeof value === 'object') {
    return { key, label, type: 'group', fields: fieldsFor(value, pathKey) };
  }

  return { key, label, type: 'string', required: false };
}

function fieldsFor(obj, prefix) {
  return Object.entries(obj).map(([k, v]) => fieldFor(k, v, `${prefix}.${k}`));
}

const DOC_LABELS = {
  site: 'Site-wide (nav, footer, forms)',
  home: 'Home page',
  about: 'About page',
  projects: 'Projects page',
  contact: 'Contact page',
  process: 'Process page',
  factory: 'Factory page',
  products: 'Products page',
  thankyou: 'Thank you page',
};

const schema = {
  $comment:
    'Generated from src/content/fallback.json by scripts/gen-schema. Both the ' +
    'FastAPI validator and the admin form renderer read this file.',
  documents: Object.keys(content).map((slug) => ({
    slug,
    label: DOC_LABELS[slug] ?? humanize(slug),
    fields: fieldsFor(content[slug], slug),
  })),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(schema, null, 2) + '\n', 'utf8');

// Report what it produced so the shape can be eyeballed.
let counts = {};
(function walk(fields) {
  for (const f of fields) {
    counts[f.type] = (counts[f.type] || 0) + 1;
    if (f.fields) walk(f.fields);
    if (f.item?.fields) walk(f.item.fields);
  }
})(schema.documents.flatMap((d) => d.fields));

console.log('documents:', schema.documents.map((d) => d.slug).join(', '));
console.log('field types:', counts);
console.log('bytes:', fs.statSync(OUT).size);
