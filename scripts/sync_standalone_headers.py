from pathlib import Path
import re

header_template = '''<nav id="nav">
  <a href="IV-home-standalone.html" class="logo">IV<em>Est. 1962</em></a>
  <div class="navlinks">
    <a href="IV-about-standalone.html" data-cursor="link" class="{about}">About</a>
    <a href="IV-process-standalone.html" data-cursor="link" class="{process}">Process</a>
    <a href="IV-products-standalone.html" data-cursor="link" class="{products}">Products</a>
    <a href="IV-factory-standalone.html" data-cursor="link" class="{factory}">Factory</a>
    <a href="IV-projects-standalone.html" data-cursor="link" class="{projects}">Projects</a>
    <a href="IV-contact-standalone.html" data-cursor="link" class="{contact}">Contact</a>
  </div>
  <div class="nav-right">
    <div class="nav-time"><span id="cairoTime">--:--</span> · <b>CAI</b></div>
    <a href="IV-contact-standalone.html" class="btn nav-cta-btn" style="padding:12px 22px;font-size:11px;" data-magnetic>Get Proposal <i class="ti ti-arrow-up-right"></i></a>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
</nav>'''

mobile_template = '''  <div class="mobile-menu-links">
    <a href="IV-about-standalone.html">About</a>
    <a href="IV-process-standalone.html">Process</a>
    <a href="IV-products-standalone.html">Products</a>
    <a href="IV-factory-standalone.html">Factory</a>
    <a href="IV-projects-standalone.html">Projects</a>
    <a href="IV-contact-standalone.html">Contact</a>
  </div>'''

html_dirs = [Path('src/pages'), Path('public/pages')]

for html_dir in html_dirs:
    for file_path in sorted(html_dir.glob('IV-*-standalone.html')):
        content = file_path.read_text(encoding='utf-8')
        page = file_path.stem.split('-')[1]
        active = {k: '' for k in ['about', 'process', 'products', 'factory', 'projects', 'contact']}
        if page in active:
            active[page] = 'active'
        else:
            print(f'Unknown page in {file_path.name}')
        new_header = header_template.format(**active)
        new_content = re.sub(r'<nav id="nav">.*?</nav>', new_header, content, flags=re.S)
        new_content = re.sub(r'<div class="mobile-menu-links">.*?</div>', mobile_template, new_content, flags=re.S)
        if new_content != content:
            file_path.write_text(new_content, encoding='utf-8')
            print(f'Updated {file_path}')
        else:
            print(f'No change {file_path}')
