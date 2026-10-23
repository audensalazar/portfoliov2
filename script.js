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
 const prev=document.querySelector('#photo-prev');
 const next=document.querySelector('#photo-next');
 const openBtn=document.querySelector('#photo-open');
 const modal=document.querySelector('#photo-lightbox');
 if(!stage||!nav||!counter||!modal) return;
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
   navButton.innerHTML=`<span class="stack-nav-number">${photo.number||String(index+1).padStart(2,'0')}</span>`;
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


// Videos are managed in videos.json; empty means no placeholders are published.
async function initVideoShowcase(){
 const grid=document.getElementById('video-grid');
 const empty=document.getElementById('video-empty');
 const dialog=document.getElementById('video-dialog');
 if(!grid||!dialog) return;
 let videos=[];
 try { const res=await fetch('videos.json?v=17'); if(res.ok) videos=await res.json(); }catch(_){}
 const allowed=['youtube','vimeo','instagram'];
 videos=videos.filter(v=>v&&v.title&&v.url&&allowed.includes(v.platform)&&/^https:\/\//i.test(v.url));
 empty.hidden=videos.length>0;
 const frame=dialog.querySelector('#video-dialog-frame');
 const dialogTitle=dialog.querySelector('#video-dialog-title');
 const external=dialog.querySelector('#video-dialog-external');
 function embedInfo(v){
   try {
     const u=new URL(v.url); let id;
     if(v.platform==='youtube'&&/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(u.hostname)){
       id=u.hostname.includes('youtu.be')?u.pathname.slice(1):(u.searchParams.get('v')||u.pathname.match(/\/(?:shorts|embed)\/([^/]+)/)?.[1]);
       if(id&&/^[a-zA-Z0-9_-]{11}$/.test(id)) return {src:'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1',ratio:'16/9'};
     }
     if(v.platform==='vimeo'&&/(^|\.)vimeo\.com$/.test(u.hostname)){
       id=u.pathname.match(/\/(\d+)/)?.[1];
       if(id){const hash=u.searchParams.get('h');return {src:'https://player.vimeo.com/video/'+id+(hash?'?h='+encodeURIComponent(hash)+'&autoplay=1':'?autoplay=1'),ratio:'16/9'};}
     }
     if(v.platform==='instagram'&&/(^|\.)instagram\.com$/.test(u.hostname)){
       const m=u.pathname.match(/^\/(reel|p)\/([a-zA-Z0-9_-]+)/);
       if(m) return {src:`https://www.instagram.com/${m[1]}/${m[2]}/embed/`,ratio:'9/16'};
     }
   }catch(_){}
   return null;
 }
 function openVideo(v){
   frame.replaceChildren();
   dialogTitle.textContent=v.title;
   external.href=v.url;
   const embed=embedInfo(v);
   if(embed){const iframe=document.createElement('iframe'); iframe.src=embed.src;iframe.title=v.title;iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';frame.style.aspectRatio=embed.ratio;frame.append(iframe)}
   else {frame.style.aspectRatio='16/9';frame.textContent='Use the link below to watch this video.'}
   dialog.showModal();
 }
 function closeVideo(){dialog.close();frame.replaceChildren()}
 dialog.querySelector('#video-dialog-close').addEventListener('click',closeVideo);
 dialog.addEventListener('close',()=>frame.replaceChildren());
 dialog.addEventListener('click',e=>{if(e.target===dialog)closeVideo()});
 videos.forEach(v=>{
   // Reels use Instagram's native embed instead of a faux thumbnail card.
   if(v.platform==='instagram'){
     const info=embedInfo(v);
     const card=document.createElement('article');card.className='video-card instagram-native-card';
     if(info){
       const iframe=document.createElement('iframe');iframe.className='instagram-native-embed';
       iframe.src=info.src;iframe.title=v.title;iframe.loading='lazy';
       iframe.allow='encrypted-media; picture-in-picture; clipboard-write';
       iframe.referrerPolicy='strict-origin-when-cross-origin';
       card.append(iframe);
     }
     const link=document.createElement('a');link.className='instagram-native-link';
     link.href=v.url;link.target='_blank';link.rel='noopener noreferrer';
     link.textContent='View on Instagram ↗';card.append(link);grid.append(card);return;
   }
   const card=document.createElement('article');card.className='video-card';
   const button=document.createElement('button');button.type='button';button.className='video-cover'; if(v.platform==='instagram')card.classList.add('video-card-reel');button.setAttribute('aria-label','Play '+v.title);
   if(v.thumbnail){const img=document.createElement('img');img.src=v.thumbnail;img.alt='';img.loading='lazy';button.append(img)}
   const play=document.createElement('span');play.className='video-play';play.textContent='▶';button.append(play);
   const copy=document.createElement('div');copy.className='video-copy';
   const h=document.createElement('h3');h.textContent=v.title;copy.append(h);
   if(v.description){const description=document.createElement('p');description.textContent=v.description;copy.append(description)}
   const source=document.createElement('span');source.className='video-platform';source.textContent=v.platform==='youtube'?'YouTube':v.platform==='vimeo'?'Vimeo':'Instagram Reel';copy.append(source);
   button.addEventListener('click',()=>openVideo(v));card.append(button,copy);grid.append(card);
 });
}
