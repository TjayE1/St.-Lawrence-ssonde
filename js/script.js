function initSite(){
  const headerInner=document.querySelector('.site-header .header-inner');
  if(headerInner){
    const path=window.location.pathname.split('/').pop() || 'index.html';
    const currentPage=path === '' || path === 'index.html' ? 'index.html' : path;
    const active=(href)=>href===currentPage ? ' aria-current="page"' : '';
    headerInner.innerHTML=`
      <a class="brand" href="index.html">
        <img src="assets/logo.svg" alt="St. Lawrence logo" class="brand-logo"> St. Lawrence S.S Ssonde
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
      <div class="nav-shell">
        <div class="utility-links">
          <a href="admissions.html"${active('admissions.html')}>Apply</a>
          <a href="research.html"${active('research.html')}>Research</a>
          <a href="resources.html"${active('resources.html')}>Resources</a>
          <a href="contact.html"${active('contact.html')}>Contact</a>
        </div>
        <nav class="main-nav">
          <a href="index.html"${active('index.html')}>Home</a>
          <a href="about.html"${active('about.html')}>About</a>
          <a href="academics.html"${active('academics.html')}>Academics</a>
          <a href="student-life.html"${active('student-life.html')}>Life</a>
          <a href="admissions.html"${active('admissions.html')}>Admissions</a>
          <a href="gallery.html"${active('gallery.html')}>Gallery</a>
        </nav>
      </div>`;
  }

  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.main-nav');
  toggle?.addEventListener('click',()=>{
    nav.classList.toggle('open');
    nav.style.display=nav.classList.contains('open') ? 'flex' : '';
  });

  const header=document.querySelector('.site-header');
  const fab=document.querySelector('.floating-apply');
  const heroStage=document.querySelector('.tilt-card');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll=()=>{
    if(header){
      if(window.scrollY>40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    }
    if(fab){
      fab.style.transform=window.scrollY>window.lastScrollY ? 'translateY(24px)' : 'translateY(0)';
    }
    window.lastScrollY=window.scrollY;
  };
  window.lastScrollY=window.scrollY;
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  const revealTargets=document.querySelectorAll('[data-reveal]');
  if(!reduceMotion && 'IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal','is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.18,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach((target)=>{ target.classList.add('reveal'); revealObserver.observe(target); });
  } else {
    revealTargets.forEach((target)=>target.classList.add('is-visible'));
  }

  if(heroStage && !reduceMotion){
    const tiltState={x:0,y:0,targetX:0,targetY:0};
    const animate=()=>{
      tiltState.x+=(tiltState.targetX-tiltState.x)*0.08;
      tiltState.y+=(tiltState.targetY-tiltState.y)*0.08;
      heroStage.style.transform=`rotateX(${10+tiltState.y}deg) rotateY(${ -10 + tiltState.x }deg) translateY(${Math.sin((tiltState.x+tiltState.y)/40)*4}px)`;
      requestAnimationFrame(animate);
    };
    heroStage.addEventListener('pointermove',(event)=>{
      const rect=heroStage.getBoundingClientRect();
      const x=((event.clientX-rect.left)/rect.width-0.5)*10;
      const y=((event.clientY-rect.top)/rect.height-0.5)*-10;
      tiltState.targetX=x;
      tiltState.targetY=y;
    });
    heroStage.addEventListener('pointerleave',()=>{
      tiltState.targetX=0;
      tiltState.targetY=0;
    });
    requestAnimationFrame(animate);
  }

  const lightbox=document.createElement('div');
  lightbox.className='lightbox';
  lightbox.innerHTML='<img src="" alt="preview"><button class="lb-close" aria-label="close" style="position:absolute;top:20px;right:20px;background:transparent;border:0;color:#fff;font-size:26px">✕</button>';
  document.body.appendChild(lightbox);
  const lbImg=lightbox.querySelector('img');
  document.querySelectorAll('.gallery-grid img').forEach(img=>{
    img.addEventListener('click',()=>{
      lbImg.src=img.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click',(e)=>{ if(e.target===lightbox || e.target.classList.contains('lb-close')) lightbox.classList.remove('open'); });

  /* Admissions form handling (client-side only) */
  const admissionsForm=document.getElementById('admissions-form');
  if(admissionsForm){
    const successEl=admissionsForm.querySelector('.form-success');
    const savePdfBtn=document.getElementById('save-pdf');
    admissionsForm.addEventListener('submit',(evt)=>{
      evt.preventDefault();
      const fd=new FormData(admissionsForm);
      const name=fd.get('name')?.toString().trim();
      const email=fd.get('email')?.toString().trim();
      const file=admissionsForm.querySelector('input[type=file]')?.files?.[0];
      if(!name || !email){
        alert('Please provide your name and a valid email.');
        return;
      }
      if(file && file.size>5*1024*1024){
        alert('Attachment exceeds 5MB. Please reduce file size or email admissions.');
        return;
      }

      // Simulate submission (no backend). Show success UI.
      admissionsForm.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=true);
      if(successEl){ successEl.hidden=false; successEl.scrollIntoView({behavior:'smooth',block:'center'}); }

      // Optionally prepare a mailto fallback with summary (kept short)
      setTimeout(()=>{
        admissionsForm.reset();
        admissionsForm.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=false);
      },2200);
    });

    if(savePdfBtn){
      savePdfBtn.addEventListener('click',()=>{
        // Use print as a simple client-side 'save as PDF'
        window.print();
      });
    }
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded',initSite);
} else {
  initSite();
}
