from pathlib import Path

files = sorted(Path('src/pages').glob('IV-*-standalone.html')) + sorted(Path('public/pages').glob('IV-*-standalone.html'))
for fp in files:
    text = fp.read_text(encoding='utf-8')
    updated = text.replace('href="IV-home-standalone.html"', 'href="/"')
    if updated != text:
        fp.write_text(updated, encoding='utf-8')
        print(f'Updated {fp}')
