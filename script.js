// Edit projects.json to change project copy, roles, galleries and cover images.
const e=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
async function loadProjects(){const response=await fetch('./projects.json?v=11');if(!response.ok)throw new Error('Unable to load projects.json');return response.json()}
const createImage=(source,alt,cls)=>{const image=e('img',cls);image.src=source;image.alt=alt||'';image.loading='lazy';return image};
function roles(p){return Array.isArray(p.roles)?p.roles:(p.role||'').split(',').map(r=>r.trim()).filter(Boolean)}
function roleTags(p){const tags=e('div','role-tags');tags.setAttribute('aria-label','My roles');roles(p).forEach(role=>tags.append(e('span','role-tag',role)));return tags}
function projectCard(p){
 const card=e('article','card');const link=e('a','project-card-link');link.href='project.html?slug='+encodeURIComponent(p.slug);
 const cover=e('div','thumb');if(p.cover){cover.append(createImage(p.cover,p.coverAlt||p.title+' cover'));}else{cover.append(e('span','',p.title));}
 link.append(cover);card.append(link);const details=e('a','project-card-copy');details.href=link.href;details.append(e('h3','',p.title),e('p','',p.summary));card.append(details,roleTags(p));return card;
}
async function showProjects(category){const grid=document.getElementById('projects');if(!grid)return;try{const entries=(await loadProjects()).filter(p=>p.categories.includes(category)).sort((a,b)=>a.order-b.order);grid.replaceChildren(...entries.map(projectCard));if(!entries.length)grid.append(e('p','','No projects in this category yet.'));}catch(err){grid.textContent='Project data could not load. Use GitHub Pages or a local server to preview this site.'}}
async function showFeatured(){const grid=document.getElementById('featured-projects');if(!grid)return;try{const entries=(await loadProjects()).filter(p=>p.featured).sort((a,b)=>a.order-b.order);grid.replaceChildren(...entries.map(projectCard));}catch(err){grid.textContent='Project data could not load. Use GitHub Pages or a local server.'}}
async function showProjectDetail(){
 const target=document.getElementById('project-detail');if(!target)return;
 const slug=new URLSearchParams(location.search).get('slug');
 try{
  const p=(await loadProjects()).find(pr=>pr.slug===slug);
  if(!p){target.append(e('h1','','Project not found'));return}
  document.title=p.title+' — Auden Salazar';
  const back=e('a','back','← All projects');back.href='index.html#featured';target.append(back);
  // 1. Title
  target.append(e('h1','project-title',p.title));
  // 2. Featured photo (or an intentional upload placeholder until an image path is entered).
  const figure=e('figure','project-hero');
  if(p.cover){figure.append(createImage(p.cover,p.coverAlt||p.title+' featured image'))}
  else{const placeholder=e('div','project-photo-placeholder');placeholder.append(e('span','', 'Project image coming soon'));figure.append(placeholder)}
  target.append(figure);
  // 3. About
  const article=e('section','project-copy');article.append(e('h2','','About'));
  (p.paragraphs||[]).forEach(t=>article.append(e('p','',t)));
  if(p.metric)article.append(e('p','project-metric',p.metric));
  target.append(article);
  // 4. Role, timeline, tools
  const meta=e('section','project-meta');meta.setAttribute('aria-label','Project details');
  const role=e('div','project-meta-item');role.append(e('h2','project-meta-label','My Role'),roleTags(p));meta.append(role);
  [['Timeline',p.timeline],['Tools',p.tools]].forEach(([title,value])=>{const col=e('div','project-meta-item');col.append(e('h2','project-meta-label',title),e('p','',value||'—'));meta.append(col)});
  target.append(meta);
  if(p.gallery?.length){const gallery=e('section','project-gallery');gallery.append(e('h2','','Selected work'));const media=e('div','gallery-grid');p.gallery.forEach(m=>{const fig=e('figure');if(m.type==='video'&&m.url){const a=e('a','text-link','Watch video ↗');a.href=m.url;a.target='_blank';a.rel='noopener noreferrer';fig.append(a)}else if(m.src){fig.append(createImage(m.src,m.alt||m.caption||p.title))}if(m.caption)fig.append(e('figcaption','',m.caption));media.append(fig)});gallery.append(media);target.append(gallery)}
  if(p.links?.length){const links=e('section','project-links');links.append(e('h2','','Links'));p.links.forEach(l=>{const a=e('a','text-link',l.label+' ↗');a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});target.append(links)}
 }catch(err){target.textContent='Project could not be loaded. Open this site through GitHub Pages or a local web server.'}
}

// Accessible photography viewer; works without external libraries.
function initPhotoGallery(){
 const modal=document.querySelector('#photo-lightbox');if(!modal)return;
 const picture=modal.querySelector('img');const count=modal.querySelector('.photo-lightbox-count');
 const tiles=[...document.querySelectorAll('.photo-tile')];let active=0;
 const show=(n)=>{active=(n+tiles.length)%tiles.length;const tile=tiles[active];picture.src=tile.dataset.photoSrc;picture.alt=tile.dataset.photoAlt;count.textContent=String(active+1).padStart(2,'0')+' / '+String(tiles.length).padStart(2,'0');};
 tiles.forEach((tile,index)=>tile.addEventListener('click',()=>{show(index);modal.showModal();}));
 modal.querySelector('.photo-lightbox-close').addEventListener('click',()=>modal.close());
 modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
 modal.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(active+1)}if(event.key==='ArrowLeft'){event.preventDefault();show(active-1)}});
 modal.addEventListener('close',()=>{picture.removeAttribute('src')});
}
