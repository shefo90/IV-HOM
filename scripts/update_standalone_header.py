from pathlib import Path
import re

header_template = '''<!-- NAV -->
<nav id="nav">
  <a href="IV-home-standalone.html" class="logo">
    <span class="logo-mark"><span>IV</span></span>
    <span class="logo-copy">
      <span class="logo-tag">4TH GENERATION</span>
      <span class="logo-sub">CRAFT • COGNITIVE</span>
    </span>
  </a>
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
    <a href="IV-contact-standalone.html" class="btn nav-cta-btn" style="padding:12px 22px;font-size:11px;" data-magnetic>GET PROPOSAL <i class="ti ti-arrow-up-right"></i></a>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
</nav>'''

nav_css = '''  /* ============ NAV ============ */
  nav{
    position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;justify-content:space-between;
    gap:1rem;padding:18px 56px;
    background:rgba(11,10,9,0.92);
    border-bottom:1px solid rgba(255,255,255,0.08);
    backdrop-filter:blur(18px) saturate(180%);
    -webkit-backdrop-filter:blur(18px) saturate(180%);
    transition:all .35s var(--ease);
  }
  nav.scrolled{background:rgba(11,10,9,0.95);padding:14px 56px;border-color:rgba(255,255,255,0.12);}
  .logo{display:flex;align-items:center;gap:16px;font-family:var(--serif);font-size:14px;font-weight:400;color:var(--text-light);text-decoration:none;}
  .logo-mark{position:relative;width:44px;height:44px;border:1px solid rgba(212,168,86,0.55);border-radius:9999px;display:flex;align-items:center;justify-content:center;transition:transform .4s var(--ease);}
  .logo:hover .logo-mark{transform:rotate(180deg);}
  .logo-mark span{font-family:var(--serif);font-size:14px;font-weight:700;letter-spacing:.2em;color:var(--text-light);}
  .logo-mark::after{content:'';position:absolute;inset:-2px;border:1px dashed rgba(212,168,86,0.2);border-radius:9999px;animation:spin 40s linear infinite;}
  .logo-copy{display:flex;flex-direction:column;line-height:1.1;}
  .logo-copy .logo-tag{font-family:var(--mono);font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);font-weight:600;}
  .logo-copy .logo-sub{font-family:var(--sans);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-light-mute);margin-top:3px;}
  .navlinks{display:flex;justify-content:center;gap:44px;font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-light-mute);}
  .navlinks a{position:relative;padding:6px 0;transition:color .3s ease;color:inherit;}
  .navlinks a::after{content:'';position:absolute;left:0;bottom:0;width:0;height:1px;background:var(--gold);transition:width .3s var(--ease);}
  .navlinks a:hover{color:var(--text-light);}
  .navlinks a:hover::after,.navlinks a.active::after{width:100%;}
  .navlinks a.active{color:var(--text-light);}
  .nav-right{display:flex;justify-content:flex-end;align-items:center;gap:22px;}
  .nav-time{font-family:var(--mono);font-size:11px;color:var(--text-light-dim);letter-spacing:.08em;}
  .nav-time b{color:var(--gold);font-weight:400;}
  .nav-cta-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--gold);color:var(--text-light);padding:12px 22px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;transition:background .3s ease,color .3s ease;}
  .nav-cta-btn:hover{background:var(--gold);color:var(--ink);}
  .hamburger{display:none;width:38px;height:38px;border:1px solid var(--line-dark-2);border-radius:50%;background:transparent;cursor:pointer;position:relative;flex-shrink:0;align-items:center;justify-content:center;}
  .hamburger span{display:block;position:absolute;left:11px;width:16px;height:1px;background:var(--text-light);transition:transform .35s var(--ease),opacity .35s var(--ease),top .35s var(--ease);}
  .hamburger span:first-child{top:16px;}
  .hamburger span:last-child{top:22px;}
  .hamburger.open span:first-child{top:19px;transform:rotate(45deg);}
  .hamburger.open span:last-child{top:19px;transform:rotate(-45deg);}
  @keyframes spin{to{transform:rotate(360deg);}}
  @media(max-width:900px){.navlinks,.nav-time,.nav-cta-btn{display:none;}nav{padding:14px 20px;}.hamburger{display:flex;}}
  /* ============ HERO ============ '''

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
        content = re.sub(r'<!-- NAV -->.*?</nav>', new_header, content, flags=re.S)
        content = re.sub(r'/\* ============ NAV ============ \*/.*?/\* ============ HERO ============ \*/', nav_css, content, flags=re.S)
        file_path.write_text(content, encoding='utf-8')
        print(f'Updated {file_path}')
