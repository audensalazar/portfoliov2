// Add each asset in assets/ and edit projects.json to populate your portfolio.
const fallback = 'Original media not yet imported';
async function showProjects(category){
  const grid=document.getElementById('projects');if(!grid)return;
  try{
    const response=await fetch('projects.json');if(!response.ok)throw Error('Missing projects.json');
    const data=await response.json();const projects=data.filter(p=>p.category===category);
    if(!projects.length){grid.innerHTML='<p>No projects added yet. Add entries to projects.json.</p>';return}
    projects.forEach(p=>{
      const article=document.createElement('article');article.className='card';
      const frame=document.createElement('div');frame.className='thumb';
      if(p.image){const img=document.createElement('img');img.src=p.image;img.alt=p.alt||p.title;img.loading='lazy';frame.appendChild(img)}
      else {const label=document.createElement('span');label.textContent=fallback;frame.appendChild(label)}
      const h=document.createElement('h3');h.textContent=p.title;
      const desc=document.createElement('p');desc.textContent=p.description||'';
      if(p.url){const link=document.createElement('a');link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`View ${p.title}`);link.append(frame,h,desc);article.append(link)}
      else article.append(frame,h,desc);
      grid.append(article);
    });
  }catch(e){grid.textContent='Projects could not be loaded. Serve the folder using GitHub Pages or a local web server.';}
}
