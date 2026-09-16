(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealElements = [...document.querySelectorAll('.reveal')];
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, {threshold:.12});
  revealElements.forEach(element => revealObserver.observe(element));
  const statement = document.querySelector('.word-reveal');
  const words = statement.textContent.trim().split(/\s+/);
  statement.replaceChildren(...words.flatMap((word,index) => {
    const span=document.createElement('span');span.textContent=word;return index<words.length-1?[span,document.createTextNode(' ')]:[span];
  }));
  const wordSpans=[...statement.querySelectorAll('span')];
  const loopVisual=document.querySelector('.project-visual');
  const loop=document.querySelector('.project-loop');
  const pulse=document.querySelector('.project-pulse');
  const heroTitle=document.querySelector('.hero-title');
  let pending=false;
  const clamp=value=>Math.max(0,Math.min(1,value));
  function updateExperience(){
    pending=false;
    if(prefersReduced.matches)return;
    const vh=window.innerHeight;
    const loopRect=loop.getBoundingClientRect();
    if(loopRect.top<vh&&loopRect.bottom>0){
      const progress=clamp((vh-loopRect.top)/(vh*.85));
      loopVisual.style.setProperty('--image-inset',`${(1-progress)*7}%`);
      loopVisual.style.setProperty('--image-scale',String(1.13-progress*.13));
    }
    const pulseRect=pulse.getBoundingClientRect();
    if(pulseRect.top<vh&&pulseRect.bottom>0)pulse.style.setProperty('--poster-shift',`${(vh*.5-pulseRect.top)*.08}px`);
    const statementRect=statement.getBoundingClientRect();
    if(statementRect.top<vh&&statementRect.bottom>0){
      const progress=clamp((vh*.8-statementRect.top)/(vh*.55));
      wordSpans.forEach((span,index)=>span.style.opacity=String(.2+.8*clamp(progress*wordSpans.length-index)));
    }
    if(window.innerWidth>650&&window.scrollY<vh){
      heroTitle.style.transform=`translateY(${window.scrollY*.13}px)`;
      heroTitle.style.opacity=String(1-clamp(window.scrollY/(vh*.85))*.75);
    }
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(updateExperience);}}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  function syncMotion(){document.documentElement.classList.toggle('motion-ready',!prefersReduced.matches);if(prefersReduced.matches){heroTitle.style.transform='';heroTitle.style.opacity='';wordSpans.forEach(span=>span.style.opacity='1');}schedule();}
  prefersReduced.addEventListener('change',syncMotion);syncMotion();

  const cases={
    loop:{title:'LOOP',category:'IDENTIDADE + DIREÇÃO DE ARTE',description:'Uma identidade que não cabe em uma superfície. LOOP explora o encontro entre matéria, luz e movimento.',challenge:'Dar presença física a uma marca digital, criando uma forma reconhecível por diferentes ângulos.',motion:'A escultura se revela com a rolagem. Escala, profundidade e ritmo ajudam a olhar de novo para a mesma ideia.'},
    pulso:{title:'PULSO',category:'TIPOGRAFIA + MOTION DESIGN',description:'Uma identidade que se comporta como música. Repetição, contraste e deslocamento transformam palavras em ritmo.',challenge:'Transmitir energia usando a própria tipografia, sem depender de um excesso de elementos.',motion:'Linhas seguem direções opostas e respondem à rolagem. O ritmo nasce do contraste entre letras cheias e contornos.'}
  };
  const dialog=document.querySelector('#project-dialog');
  let caseTrigger,caseOverflow;
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const item=cases[button.dataset.project];if(!item)return;
    caseTrigger=button;caseOverflow=document.body.style.overflow;
    document.querySelector('#case-title').textContent=item.title;
    document.querySelector('#case-category').textContent=item.category;
    document.querySelector('#case-description').textContent=item.description;
    document.querySelector('#case-challenge').textContent=item.challenge;
    document.querySelector('#case-motion').textContent=item.motion;
    const art=document.querySelector('#case-art');
    if(button.dataset.project==='loop'){const image=document.createElement('img');image.src='assets/loop-art.png';image.alt='Escultura abstrata de chrome e resina azul';art.replaceChildren(image);}
    else{const text=document.createElement('strong');text.textContent='SINTA.';art.replaceChildren(text);}
    dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
  }));
  document.querySelector('#case-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow=caseOverflow||'';caseTrigger?.focus({preventScroll:true});});
  const cursor=document.querySelector('.custom-cursor');
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||prefersReduced.matches)return;
    cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`;
    cursor.classList.toggle('active',!!event.target.closest('.project')&&!dialog.open);
  });
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget)cursor.classList.remove('active');});
})();
