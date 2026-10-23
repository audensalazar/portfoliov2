// Edit projects.json to change project copy, roles, galleries and cover images.
const e=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
async function loadProjects(){const response=await fetch('./projects.json?v=12');if(!response.ok)throw new Error('Unable to load projects.json');return response.json()}
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

// Accessible photo stack + lightbox; works without external libraries.
async function initPhotoStack(){
 const stage=document.querySelector('#photo-stack-stage');
 const nav=document.querySelector('#photo-stack-nav');
 const counter=document.querySelector('#photo-stack-counter');
 const caption=document.querySelector('#photo-stack-caption');
 const prev=document.querySelector('#photo-prev');
 const next=document.querySelector('#photo-next');
 const openBtn=document.querySelector('#photo-open');
 const modal=document.querySelector('#photo-lightbox');
 if(!stage||!nav||!counter||!caption||!modal) return;
 let photos=[];
 try{
   const response=await fetch('./assets/images/photography/manifest.json?v=12');
   if(!response.ok) throw new Error('Unable to load photo manifest');
   photos=await response.json();
 }catch(error){
   stage.textContent='Photography gallery could not load.';
   return;
 }
 let active=0;
 const stackCards=[];
 const navButtons=[];
 const picture=modal.querySelector('img');
 const count=modal.querySelector('.photo-lightbox-count');
 const closeBtn=modal.querySelector('.photo-lightbox-close');
 const prevLightbox=modal.querySelector('[data-direction="prev"]');
 const nextLightbox=modal.querySelector('[data-direction="next"]');

 const truncate=(text,max=76)=>text.length>max?text.slice(0,max-1)+'…':text;
 const updateLightbox=(index)=>{
   const photo=photos[(index+photos.length)%photos.length];
   active=(index+photos.length)%photos.length;
   picture.src=photo.src;
   picture.alt=photo.alt||'';
   count.textContent=`${String(active+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
 };
 const openLightbox=(index=active)=>{ updateLightbox(index); if(!modal.open) modal.showModal(); };
 const visibleDepth=6;
 const poseFor=(order)=>{
   const poses=[
     {x:0,y:0,r:-2,s:1},
     {x:26,y:16,r:4,s:.975},
     {x:-22,y:34,r:-5,s:.95},
     {x:30,y:52,r:6,s:.925},
     {x:-28,y:70,r:-7,s:.9},
     {x:34,y:88,r:8,s:.875}
   ];
   return poses[Math.min(order,poses.length-1)];
 };
 const render=()=>{
   stackCards.forEach((card,index)=>{
     const order=(index-active+photos.length)%photos.length;
     const img=card.querySelector('img');
     const num=card.querySelector('.stack-card-number');
     const pose=poseFor(order);
     card.dataset.state=order===0?'active':order<visibleDepth?'stacked':'hidden';
     card.style.zIndex=String(200-order);
     card.style.transform=`translateX(-50%) translate(${pose.x}px, ${pose.y}px) rotate(${pose.r}deg) scale(${pose.s})`;
     card.style.opacity=order<visibleDepth?'1':'0';
     card.style.pointerEvents=order<visibleDepth?'auto':'none';
     card.setAttribute('aria-current',order===0?'true':'false');
     card.setAttribute('tabindex',order===0?'0':'-1');
     if(img) img.loading=order<3?'eager':'lazy';
     if(num) num.textContent=photos[index].number||String(index+1).padStart(2,'0');
   });
   navButtons.forEach((button,index)=>button.setAttribute('aria-pressed',index===active?'true':'false'));
   counter.textContent=`${String(active+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
   caption.textContent=truncate(photos[active].alt||`Portfolio photograph ${active+1}`);
 };

 photos.forEach((photo,index)=>{
   const button=e('button','stack-card');
   button.type='button';
   button.dataset.index=String(index);
   button.setAttribute('aria-label',`Photograph ${photo.number||String(index+1).padStart(2,'0')}`);
   button.innerHTML=`<span class="stack-card-inner"><img src="${photo.src}" alt="${(photo.alt||'').replace(/"/g,'&quot;')}"/><span class="stack-card-bar"><span class="stack-card-number">${photo.number||String(index+1).padStart(2,'0')}</span><span class="stack-card-open">click to enlarge</span></span></span>`;
   button.addEventListener('click',()=>{
     if(active===index) openLightbox(index);
     else { active=index; render(); }
   });
   button.addEventListener('keydown',event=>{
     if(event.key==='Enter' || event.key===' '){ event.preventDefault(); if(active===index) openLightbox(index); else { active=index; render(); } }
     if(event.key==='ArrowRight'){ event.preventDefault(); active=(active+1)%photos.length; render(); }
     if(event.key==='ArrowLeft'){ event.preventDefault(); active=(active-1+photos.length)%photos.length; render(); }
   });
   stage.append(button);
   stackCards.push(button);

   const navButton=e('button','stack-nav-item');
   navButton.type='button';
   navButton.innerHTML=`<span class="stack-nav-number">${photo.number||String(index+1).padStart(2,'0')}</span><span class="stack-nav-label">Photograph</span>`;
   navButton.addEventListener('click',()=>{ active=index; render(); });
   nav.append(navButton);
   navButtons.push(navButton);
 });

 prev?.addEventListener('click',()=>{ active=(active-1+photos.length)%photos.length; render(); });
 next?.addEventListener('click',()=>{ active=(active+1)%photos.length; render(); });
 openBtn?.addEventListener('click',()=>openLightbox(active));
 closeBtn?.addEventListener('click',()=>modal.close());
 prevLightbox?.addEventListener('click',()=>{ updateLightbox(active-1); render(); });
 nextLightbox?.addEventListener('click',()=>{ updateLightbox(active+1); render(); });
 modal.addEventListener('click',event=>{ if(event.target===modal) modal.close(); });
 modal.addEventListener('keydown',event=>{
   if(event.key==='ArrowRight'){ event.preventDefault(); updateLightbox(active+1); render(); }
   if(event.key==='ArrowLeft'){ event.preventDefault(); updateLightbox(active-1); render(); }
   if(event.key==='Escape'){ modal.close(); }
 });
 modal.addEventListener('close',()=>{ picture.removeAttribute('src'); });
 render();
}
