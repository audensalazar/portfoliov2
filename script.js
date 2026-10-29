// Edit projects.json to change project copy, roles, galleries and cover images.
const e=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
async function loadProjects(){const response=await fetch('./projects.json?v=30');if(!response.ok)throw new Error('Unable to load projects.json');return response.json()}
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
  // Image and About are paired below on desktop.
  // 3. About
  const article=e('section','project-copy');article.append(e('h2','','About'));
  (p.paragraphs||[]).forEach(t=>article.append(e('p','',t)));
  if(p.metric)article.append(e('p','project-metric',p.metric));
  const imageAbout=e('div','project-image-about');figure.remove();
  if(p.slug==='admissions-communications-marketing'){
    const pair=e('div','project-image-pair');pair.append(figure);
    (p.gallery||[]).filter(m=>m.type!=='video'&&m.src).forEach(m=>{const extra=e('figure','project-hero project-hero-secondary');extra.append(createImage(m.src,m.alt||'Open House postcard'));pair.append(extra)});
    imageAbout.append(pair,article);
  }else imageAbout.append(figure,article);
  target.append(imageAbout);
  // 4. Role, timeline, tools
  const meta=e('section','project-meta');meta.setAttribute('aria-label','Project details');
  const role=e('div','project-meta-item');role.append(e('h2','project-meta-label','My Role'),roleTags(p));meta.append(role);
  [['Timeline',p.timeline],['Tools',p.tools]].forEach(([title,value])=>{const col=e('div','project-meta-item');col.append(e('h2','project-meta-label',title),e('p','',value||'—'));meta.append(col)});
  target.append(meta);
  if(p.gallery?.length && p.slug!=='admissions-communications-marketing'){const gallery=e('section','project-gallery');gallery.append(e('h2','','Selected work'));const media=e('div','gallery-grid');p.gallery.forEach(m=>{const fig=e('figure');if(m.type==='video'&&m.url){const a=e('a','text-link','Watch video ↗');a.href=m.url;a.target='_blank';a.rel='noopener noreferrer';fig.append(a)}else if(m.src){fig.append(createImage(m.src,m.alt||m.caption||p.title))}if(m.caption)fig.append(e('figcaption','',m.caption));media.append(fig)});gallery.append(media);target.append(gallery)}
  initProjectImageLightbox(target);
  if(p.links?.length){const links=e('section','project-links');links.append(e('h2','','Links'));p.links.forEach(l=>{const a=e('a','text-link',l.label+' ↗');a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});target.append(links)}
 }catch(err){target.textContent='Project could not be loaded. Open this site through GitHub Pages or a local web server.'}
}

// Case-study images: shared accessible lightbox for the hero and gallery.
function initProjectImageLightbox(container){
 const images=[...container.querySelectorAll('.project-hero img, .gallery-grid img')];
 if(!images.length) return;
 const dialog=document.createElement('dialog');dialog.className='project-lightbox';dialog.setAttribute('aria-label','Project image viewer');
 const close=document.createElement('button');close.type='button';close.className='project-lightbox-close';close.textContent='Close ×';close.setAttribute('aria-label','Close image viewer');
 const pic=document.createElement('img');pic.alt='';
 const controls=document.createElement('div');controls.className='project-lightbox-controls';
 const prev=document.createElement('button');prev.type='button';prev.textContent='← Previous';prev.setAttribute('aria-label','Previous image');
 const count=document.createElement('span');count.setAttribute('aria-live','polite');
 const next=document.createElement('button');next.type='button';next.textContent='Next →';next.setAttribute('aria-label','Next image');
 controls.append(prev,count,next);dialog.append(close,pic,controls);document.body.append(dialog);
 let current=0;let opener=null;
 const show=i=>{current=(i+images.length)%images.length;pic.src=images[current].currentSrc||images[current].src;pic.alt=images[current].alt||'Project image';count.textContent=`${current+1} / ${images.length}`;prev.disabled=next.disabled=images.length<2;};
 images.forEach((im,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='project-image-trigger';btn.setAttribute('aria-label','Enlarge '+(im.alt||'project image'));im.parentNode.insertBefore(btn,im);btn.append(im);btn.addEventListener('click',()=>{opener=btn;show(i);dialog.showModal();});});
 close.addEventListener('click',()=>dialog.close());prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
 dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close()});
 dialog.addEventListener('keydown',ev=>{if(ev.key==='ArrowLeft'){ev.preventDefault();show(current-1)}if(ev.key==='ArrowRight'){ev.preventDefault();show(current+1)}});
 dialog.addEventListener('close',()=>{pic.removeAttribute('src');opener?.focus()});
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
 try { const res=await fetch('videos.json?v=30'); if(res.ok) videos=await res.json(); }catch(_){}
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
 const films=document.createElement('div');films.className='video-films';
 const reels=document.createElement('div');reels.className='video-reels';
 const reelsHeading=document.createElement('h3');reelsHeading.className='reels-heading';reelsHeading.textContent='Bite-sized stories';
 const reelsPair=document.createElement('div');reelsPair.className='reels-pair';const reelsIntro=document.createElement('p');reelsIntro.className='reels-description';reelsIntro.textContent='Creating content that reaches';
 videos.forEach(v=>{
   if(v.platform==='instagram'){
     const card=document.createElement('article');card.className='reel-card';
     const link=document.createElement('a');link.className='reel-gif-link';link.href=v.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Watch '+v.title+' on Instagram (opens new tab)');
     if(v.thumbnail){const img=document.createElement('img');img.src=v.thumbnail;img.alt='Animated preview of '+v.title;img.loading='lazy';link.append(img)}
     const icon=document.createElement('span');icon.className='reel-open-icon';icon.textContent='↗';icon.setAttribute('aria-hidden','true');link.append(icon);
     const title=document.createElement('h4');title.className='reel-title';title.textContent=v.title;
     const view=document.createElement('a');view.className='instagram-native-link';view.href=v.url;view.target='_blank';view.rel='noopener noreferrer';view.textContent='View on Instagram ↗';
     card.append(link,title,view);reelsPair.append(card);return;
   }
   const card=document.createElement('article');card.className='video-card';
   const button=document.createElement('button');button.type='button';button.className='video-cover';button.setAttribute('aria-label','Play '+v.title);
   if(v.thumbnail){const img=document.createElement('img');img.src=v.thumbnail;img.alt='';img.loading='lazy';button.append(img)}
   const play=document.createElement('span');play.className='video-play';play.textContent='▶';button.append(play);
   const copy=document.createElement('div');copy.className='video-copy';const h=document.createElement('h3');h.textContent=v.title;copy.append(h);
   if(v.description){const description=document.createElement('p');description.textContent=v.description;copy.append(description)}
   button.addEventListener('click',()=>openVideo(v));card.append(button,copy);films.append(card);
 });
 if(films.children.length)grid.append(films);
 if(reelsPair.children.length){reels.append(reelsHeading,reelsIntro,reelsPair);grid.append(reels)};

}


/* v26 — coordinated exit and entrance for full-page navigation. */
(() => {
  const key = 'auden-page-transition';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let navigating = false;
  let destinationTimer;

  function clearTransition() {
    root.classList.remove('page-transition-out', 'page-transition-in', 'page-transition-reveal');
    navigating = false;
    window.clearTimeout(destinationTimer);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // The destination page gets its covered state from the early head script,
    // preventing a flash of the next page before the entrance animation.
    if (root.classList.contains('page-transition-in') && !reduceMotion.matches) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        root.classList.add('page-transition-reveal');
        window.setTimeout(() => {
          root.classList.remove('page-transition-in', 'page-transition-reveal');
        }, 520);
      }));
    } else {
      root.classList.remove('page-transition-in');
    }

    document.addEventListener('click', (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link || event.defaultPrevented || navigating || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const dest = new URL(link.href, location.href);
      const samePage = dest.pathname === location.pathname && dest.search === location.search;
      if (dest.origin !== location.origin || samePage ||
          !/\.html$/i.test(dest.pathname) || reduceMotion.matches) return;
      event.preventDefault();
      navigating = true;
      root.classList.remove('page-transition-in', 'page-transition-reveal');
      root.classList.add('page-transition-out');
      // Navigate only once the outgoing wipe has fully covered the page.
      destinationTimer = window.setTimeout(() => {
        try { sessionStorage.setItem(key, JSON.stringify({ url: dest.pathname + dest.search, at: Date.now() })); } catch (_) {}
        location.assign(dest.href);
      }, 465);
    });
  });

  // Browsers may restore a page from back-forward cache without loading JS again.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) clearTransition();
  });
  window.addEventListener('load', () => {
    if (root.classList.contains('page-transition-in')) {
      root.classList.add('page-transition-reveal');
      window.setTimeout(clearTransition, 650);
    }
  });
  window.addEventListener('pagehide', () => window.clearTimeout(destinationTimer));
})();
