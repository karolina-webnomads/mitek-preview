
/* Logo rotator (wave like chroniclehq.com): every cell swaps to another logo from the same set,
   old one slides up and fades out, new one rises from below; cells go left→right with a small stagger. */
(function(){
  var list=document.querySelector('.logos'); if(!list) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cells=[].slice.call(list.querySelectorAll('.logos__cell'));
  var items=cells.map(function(c){return c.querySelector('.logos__item').cloneNode(true)});
  var N=items.length, STEP=3, INTERVAL=3800, STAGGER=90, DURATION=700, k=0, paused=false;
  function swap(){
    if(paused||document.hidden) return;
    k++;
    cells.forEach(function(cell,i){
      setTimeout(function(){
        var old=cell.querySelector('.logos__item:not(.is-leaving)');
        var next=items[(i+k*STEP)%N].cloneNode(true);
        next.classList.add('is-entering'); cell.appendChild(next);
        next.getBoundingClientRect();
        next.classList.remove('is-entering');
        if(old){ old.classList.add('is-leaving'); setTimeout(function(){ old.remove(); }, DURATION+50); }
      }, i*STAGGER);
    });
  }
  list.addEventListener('mouseenter',function(){paused=true});
  list.addEventListener('mouseleave',function(){paused=false});
  list.addEventListener('focusin',function(){paused=true});
  list.addEventListener('focusout',function(){paused=false});
  setInterval(swap, INTERVAL);
})();


/* stat numbers: odometer roll — each digit sits in its own masked slot and rolls up through the last few values
   before landing on the final digit (right-most digits roll further, slight stagger). Runs once when the card scrolls into view. */
(function(){
  var els=[].slice.call(document.querySelectorAll('.stat__num[data-count]'));
  if(!els.length) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(function(el){
    var txt=el.textContent.trim(), m=txt.match(/^([\d.]+)(.*)$/); if(!m) return;
    var digits=m[1].split(''), suf=m[2], n=digits.length;
    el.textContent='';
    digits.forEach(function(d,i){
      if(d==='.'){ var dt=document.createElement('span'); dt.className='odo__suf'; dt.setAttribute('aria-hidden','true'); dt.textContent='.'; el.appendChild(dt); return; }
      var steps=reduce?0:(3+(i+1)*2+(n===1?2:0));          /* e.g. "12": 1 rolls 5 steps, 2 rolls 7 */
      var slot=document.createElement('span'); slot.className='odo'; slot.setAttribute('aria-hidden','true');
      var sizer=document.createElement('span'); sizer.className='odo__size'; sizer.textContent=d; slot.appendChild(sizer);
      var strip=document.createElement('span'); strip.className='odo__strip';
      for(var k=steps;k>=0;k--){ var s=document.createElement('span'); s.textContent=((+d-k)%10+10)%10; strip.appendChild(s); }
      strip.style.setProperty('--steps',steps); strip.style.transitionDelay=(i*.09)+'s';
      slot.appendChild(strip); el.appendChild(slot);
    });
    if(suf){ var sf=document.createElement('span'); sf.className='odo__suf'; sf.setAttribute('aria-hidden','true'); sf.textContent=suf; el.appendChild(sf); }
  });
  if(reduce) return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-rolled'); io.unobserve(en.target); } });
  },{threshold:.5});
  els.forEach(function(el){ io.observe(el); });
})();


/* testimonial rotator — next quote every 7s, pauses while hovered / focused or when the tab is hidden */
(function(){
  var card=document.querySelector('.story[data-rotate]'); if(!card) return;
  var slides=[].slice.call(card.querySelectorAll('.story__slide')), logos=[].slice.call(card.querySelectorAll('.story__logo')),
      dots=[].slice.call(card.querySelectorAll('.pxdots i')), n=slides.length, i=0, timer=null, paused=false, every=+card.dataset.rotate||7000;
  if(n<2) return;
  function show(k){ i=k; [slides,logos,dots].forEach(function(list){ list.forEach(function(el,j){ el.classList.toggle(list===dots?'on':'is-active',j===k); }); }); }
  function next(){ if(!paused&&!document.hidden) show((i+1)%n); }
  timer=setInterval(next,every);
  /* dots are clickable: jump to that testimonial and restart the 7s timer */
  var wrap=dots.length&&dots[0].parentNode; if(wrap){ wrap.removeAttribute('aria-hidden'); wrap.setAttribute('role','tablist'); wrap.setAttribute('aria-label','Testimonials'); }
  dots.forEach(function(d,j){ d.setAttribute('role','tab'); d.setAttribute('tabindex','0'); d.setAttribute('aria-label','Show testimonial '+(j+1));
    function go(e){ e.preventDefault(); e.stopPropagation(); show(j); clearInterval(timer); timer=setInterval(next,every); }
    d.addEventListener('click',go); d.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' ') go(e); }); });
  card.addEventListener('mouseenter',function(){ paused=true; });
  card.addEventListener('mouseleave',function(){ paused=false; });
  card.addEventListener('focusin',function(){ paused=true; });
  card.addEventListener('focusout',function(){ paused=false; });
})();


/* awards carousel — pages of 3; rotates every 5s only when there are more than 3 awards (dots are generated per page) */
(function(){
  var list=document.querySelector('.awards__list'); if(!list) return;
  var items=[].slice.call(list.children), per=3, pages=Math.ceil(items.length/per), dotsWrap=document.querySelector('.awards .pxdots--v'), p=0;
  if(pages<2) return;
  for(var k=0;k<pages;k++){ var i=document.createElement('i'); if(!k) i.className='on'; dotsWrap.appendChild(i); }
  var dots=[].slice.call(dotsWrap.children), reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches, paused=false;
  function render(){ items.forEach(function(el,j){ el.classList.toggle('is-hidden',Math.floor(j/per)!==p); }); dots.forEach(function(d,j){ d.classList.toggle('on',j===p); }); }
  function go(n){
    var cur=items.filter(function(el,j){ return Math.floor(j/per)===p; });
    cur.forEach(function(el){ el.classList.add('is-out'); });
    setTimeout(function(){
      cur.forEach(function(el){ el.classList.remove('is-out'); });
      p=n; render();
      var nxt=items.filter(function(el,j){ return Math.floor(j/per)===p; });
      nxt.forEach(function(el){ el.classList.add('is-out'); });
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ nxt.forEach(function(el,j){ el.style.transitionDelay=(j*.08)+'s'; el.classList.remove('is-out'); }); }); });
    }, reduce?0:450);
  }
  render();
  var box=list.closest('.awards'); box.addEventListener('mouseenter',function(){paused=true;}); box.addEventListener('mouseleave',function(){paused=false;});
  setInterval(function(){ if(!paused&&!document.hidden) go((p+1)%pages); },5000);
})();
