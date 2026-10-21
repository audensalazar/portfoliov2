// Edit projects.json to change the project text, categories, links, or image paths.
const e=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
async function loadProjects(){const response=await fetch('./projects.json');if(!response.ok)throw new Error('Unable to load projects.json');return response.json()}
const createImage=(source,alt,cls)=>{const image=e('img',cls);image.src=source;image.alt=alt||'';image.loading='lazy';return image};
function projectCard(p){
 const card=e('article','card');const link=e('a');link.href='project.html?slug='+encodeURIComponent(p.slug);
 const cover=e('div','thumb');if(p.cover){cover.append(createImage(p.cover,p.title+' cover'));}else{cover.append(e('span','',p.title));}
 link.append(cover,e('span','project-tag',p.primary==='photography-videography'?'Photography / Videography':p.primary),e('h3','',p.title),e('p','',p.summary));card.append(link);return card;
}
async function showProjects(category){const grid=document.getElementById('projects');if(!grid)return;try{const entries=(await loadProjects()).filter(p=>p.categories.includes(category)).sort((a,b)=>a.order-b.order);grid.replaceChildren(...entries.map(projectCard));if(!entries.length)grid.append(e('p','','No projects in this category yet.'));}catch(err){grid.textContent='Project data could not load. Use GitHub Pages or a local server to preview this site.'}}
async function showFeatured(){const grid=document.getElementById('featured-projects');if(!grid)return;try{const entries=(await loadProjects()).filter(p=>p.featured).sort((a,b)=>a.order-b.order);grid.replaceChildren(...entries.map(projectCard));}catch(err){grid.textContent='Project data could not load. Use GitHub Pages or a local server.'}}
async function showProjectDetail(){const target=document.getElementById('project-detail');if(!target)return;const slug=new URLSearchParams(location.search).get('slug');try{const p=(await loadProjects()).find(pr=>pr.slug===slug);if(!p){target.append(e('h1','','Project not found'));return}document.title=p.title+' — Auden Salazar';
 const back=e('a','back','← All projects');back.href='index.html#featured';target.append(back,e('h1','',p.title),e('p','project-summary',p.summary));
 const meta=e('div','project-meta');[['My Role',p.role],['Timeline',p.timeline],['Tools',p.tools]].forEach(([title,value])=>{const col=e('div');col.append(e('span','project-meta-label',title),e('p','',value));meta.append(col)});target.append(meta);
 if(p.metric)target.append(e('p','project-metric',p.metric));
 const article=e('section','project-copy');article.append(e('h2','','About this project'));p.paragraphs.forEach(t=>article.append(e('p','',t)));target.append(article);
 if(p.cover){const figure=e('figure','project-hero');figure.append(createImage(p.cover,p.title+' cover'));target.append(figure)}
 if(p.gallery?.length){const gallery=e('section','project-gallery');gallery.append(e('h2','','Selected work'));const media=e('div','gallery-grid');p.gallery.forEach(m=>{const figure=e('figure');if(m.type==='video'&&m.url){const a=e('a','text-link','Watch video ↗');a.href=m.url;a.target='_blank';a.rel='noopener noreferrer';figure.append(a)}else if(m.src){figure.append(createImage(m.src,m.alt||m.caption||p.title))}if(m.caption)figure.append(e('figcaption','',m.caption));media.append(figure)});gallery.append(media);target.append(gallery)}
 if(p.links?.length){const links=e('section','project-links');links.append(e('h2','','Links'));p.links.forEach(l=>{const a=e('a','text-link',l.label+' ↗');a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});target.append(links)}
 }catch(err){target.textContent='Project could not be loaded. Open this site through GitHub Pages or a local web server.'}}
