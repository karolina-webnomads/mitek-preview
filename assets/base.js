
document.documentElement.classList.replace('no-js','js');
(function(){
  var els=[].slice.call(document.querySelectorAll('.reveal,.reveal-head'));
  function show(e){ e.classList.add('visible'); }
  /* ScrollTrigger start:"top 85%", once:true — also reveals anything already scrolled past */
  var targets=[].slice.call(document.querySelectorAll('[data-stagger]')).concat(els.filter(function(e){ return !e.closest('[data-stagger]'); }));
  var ticking=false;
  function check(){
    ticking=false;
    var line=window.innerHeight*.85;
    targets=targets.filter(function(t){
      if(t.getBoundingClientRect().top>line) return true;
      if(t.hasAttribute('data-stagger')){
        [].slice.call(t.querySelectorAll('.reveal')).forEach(function(c,i){ c.style.transitionDelay=(i*.2)+'s'; show(c); });
      } else { show(t); }
      return false;
    });
    if(!targets.length){ window.removeEventListener('scroll',onScroll); window.removeEventListener('resize',onScroll); }
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(check); } }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  check();
})();


/* Main nav stays pinned; the thin top bar shows only at the very top of the page */
(function(){
  var h=document.querySelector('.site-header'); if(!h) return;
  var bar=h.querySelector('.topbar'), ticking=false;
  function measure(){ h.style.setProperty('--topbar-h',(bar?bar.offsetHeight:0)+'px'); }
  var lastY=window.scrollY||0; function update(){ ticking=false; var y=window.scrollY||0, d=y-lastY; if(y<=2) h.classList.remove('is-compact'); else if(d>4) h.classList.add('is-compact'); else if(d<-4) h.classList.remove('is-compact'); if(Math.abs(d)>4||y<=2) lastY=y; }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } },{passive:true});
  window.addEventListener('resize',measure);
  measure(); update();
})();
