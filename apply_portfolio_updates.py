from pathlib import Path
import re, shutil
ROOT=Path(__file__).resolve().parent
# Apply this script from within a local copy of the portfoliov2 repository,
# or pass the repository path as the first argument.
import sys
site=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
assert (site/'index.html').exists() and (site/'script.js').exists(), 'Pass the local portfoliov2 repository folder as the first argument.'
assets=site/'assets/images/custom-navigation';assets.mkdir(parents=True,exist_ok=True)
for name in ['nav-name.png','nav-design.png','nav-about.png','nav-writing.png','hello-hero.png']:
    shutil.copy2(ROOT/name,assets/name)
# Photography text graphic — image-based navigation is preserved for all four items.
photography_svg='''<svg xmlns="http://www.w3.org/2000/svg" width="630" height="115" viewBox="0 0 630 115"><text x="9" y="85" fill="#073ca9" font-size="67" font-family="Arial Black, Arial, sans-serif" font-weight="900" letter-spacing="-2">PHOTO / VIDEO</text><path d="M18 101 Q260 91 610 103" fill="none" stroke="#073ca9" stroke-linecap="round" stroke-width="8"/></svg>'''
(assets/'nav-photo.svg').write_text(photography_svg)
imgbase='assets/images/custom-navigation/'
# Sitewide nav, preserving aria-current semantics when present.
for page in site.glob('*.html'):
    source=page.read_text()
    source=re.sub(r'(<a class="brand" href="index.html">)Auden Salazar(</a>)',r'\1<img src="'+imgbase+r'nav-name.png" alt="Auden Salazar" class="nav-art nav-art--name"/>\2',source)
    for href,name,klass in [('design.html','nav-design.png','design'),('writing.html','nav-writing.png','writing'),('about.html','nav-about.png','about')]:
        source=re.sub(r'(<a(?: aria-current="page")? href="'+re.escape(href)+r'">)(?:Design|Writing|About)(</a>)',lambda m:m.group(1)+'<img src="'+imgbase+name+'" alt="'+klass.title()+'" class="nav-art nav-art--'+klass+'"/>'+m.group(2),source)
    source=re.sub(r'(<a(?: aria-current="page")? href="photography-videography.html">)Photography / Videography(</a>)',r'\1<img src="'+imgbase+r'nav-photo.svg" alt="Photography and Videography" class="nav-art nav-art--photo"/>\2',source)
    page.write_text(source)
# Hero navigation links share the image language of the top bar.
page=site/'index.html';s=page.read_text()
s=s.replace('<section class="wrap home-work" id="work"><a href="design.html">Design</a><a href="writing.html">Writing</a><a href="photography-videography.html">Photography &amp; Videography</a></section>',
'''<section class="wrap home-work image-work-nav" id="work" aria-label="Explore my work"><a href="design.html"><img src="assets/images/custom-navigation/nav-design.png" alt="Design"/></a><a href="writing.html"><img src="assets/images/custom-navigation/nav-writing.png" alt="Writing"/></a><a href="photography-videography.html"><img src="assets/images/custom-navigation/nav-photo.svg" alt="Photography and Videography"/></a><a href="about.html"><img src="assets/images/custom-navigation/nav-about.png" alt="About me"/></a></section>''')
s=s.replace('width="1120"/></div></section>', 'width="1120"/><img class="hero-photo-greeting" src="assets/images/custom-navigation/hello-hero.png" alt="Hi! I’m Auden"/><img class="hero-photo-signature" src="assets/images/custom-navigation/nav-name.png" alt="" aria-hidden="true"/></div></section>')
page.write_text(s)
# On Think Prep case study, two photos beside About; no Selected work gallery.
js=site/'script.js';s=js.read_text()
needle="const imageAbout=e('div','project-image-about');figure.remove();imageAbout.append(figure,article);target.append(imageAbout);"
replacement="""const imageAbout=e('div','project-image-about');figure.remove();
  if(p.slug==='admissions-communications-marketing'){
    const media=e('div','project-about-media');media.append(figure);
    (p.gallery||[]).filter(m=>m.type==='image'&&m.src).forEach(m=>{
      const extra=e('figure','project-hero');extra.append(createImage(m.src,m.alt||p.title));media.append(extra);
    });
    imageAbout.append(media,article);
  }else imageAbout.append(figure,article);
  target.append(imageAbout);"""
assert needle in s, 'Expected project layout code not found; no changes to script.js'
s=s.replace(needle,replacement)
s=s.replace("if(p.gallery?.length){const gallery=e('section','project-gallery')", "if(p.gallery?.length && p.slug!=='admissions-communications-marketing'){const gallery=e('section','project-gallery')")
s=s.replace("container.querySelectorAll('.project-hero img, .gallery-grid img')", "container.querySelectorAll('.project-hero img, .gallery-grid img')")
js.write_text(s)
css=site/'style.css';s=css.read_text();s+='''
/* 2026 portfolio lettering and typography refinements */
body{line-height:1.43}
p,li{line-height:1.47}
h1,h2,h3,h4,.large-type{line-height:1.04}
.project-copy p,.about-grid p,.video-copy p{line-height:1.48}
.nav .brand,.nav .navlinks a{display:inline-flex;align-items:center;justify-content:center;line-height:1;min-width:0}
.nav-art{display:block;width:auto;max-width:100%;object-fit:contain;height:clamp(19px,2.15vw,31px);transition:transform .2s ease,opacity .2s ease}
.nav-art--name{height:clamp(21px,2.25vw,35px)}
.nav-art--writing{height:clamp(21px,2.35vw,34px)}
.nav-art--photo{height:clamp(18px,2vw,27px)}
.navlinks{align-items:center}
.navlinks a:hover .nav-art,.navlinks a:focus-visible .nav-art{transform:translateY(-2px);opacity:.78}
.navlinks a[aria-current="page"] .nav-art{filter:drop-shadow(0 2px 0 rgba(5,56,162,.25))}
.image-work-nav{display:flex!important;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:clamp(15px,2vw,36px)}
.image-work-nav a{display:inline-flex!important;align-items:center;justify-content:center;flex:1 1 160px;min-width:0;overflow:visible}
.image-work-nav img{display:block;width:100%;max-width:255px;height:clamp(48px,6vw,91px);object-fit:contain;transition:transform .25s ease}
.image-work-nav a:hover img,.image-work-nav a:focus-visible img{transform:rotate(-2deg) translateY(-5px)}
.hero-portrait{position:relative;isolation:isolate}
.hero-photo-greeting{position:absolute!important;left:-18%;top:4%;width:clamp(110px,21vw,295px)!important;height:auto!important;object-fit:contain!important;transform:rotate(-11deg);z-index:3;pointer-events:none;filter:drop-shadow(1px 3px 0 rgba(255,255,255,.8))}
.hero-photo-signature{position:absolute!important;right:-7%;bottom:4%;width:min(85%,480px)!important;height:auto!important;object-fit:contain!important;transform:rotate(-7deg);z-index:3;pointer-events:none;filter:drop-shadow(2px 3px 0 #fff)}
.project-about-media{display:grid;grid-template-columns:1fr;gap:16px;align-content:start;min-width:0}
.project-about-media .project-hero{margin:0;max-width:100%}
.project-about-media .project-hero img{display:block;width:100%;height:auto}
@media(max-width:800px){.nav{gap:14px}.navlinks{gap:clamp(8px,2vw,16px)}.nav-art{height:21px}.nav-art--name{height:25px}.nav-art--photo{height:18px}.hero-photo-greeting{left:-5%;top:-4%;width:38%!important}.hero-photo-signature{right:0;bottom:1%;width:76%!important}}
@media(max-width:520px){.nav-art{height:17px}.nav-art--name{height:22px}.nav-art--photo{height:15px}.image-work-nav a{flex-basis:42%}.image-work-nav img{height:60px}}
''';css.write_text(s)
print('Updated',site)
