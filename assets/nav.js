/* Navbar "style c": desktop mega menu (one container morphs its height, panels slide in the
   direction you move), page scroll locked while open, region switch, mobile drill-down menu. */
(function(){
  var root=document.documentElement;

  /* ---------- region (North America / UK & EMEA) ---------- */
  var REG={us:'North America',uk:'UK & EMEA'};
  function getRegion(){ try{ return localStorage.getItem('mitek-region')||'us'; }catch(e){ return 'us'; } }
  function setRegion(r){
    root.setAttribute('data-region',r);
    try{ localStorage.setItem('mitek-region',r); }catch(e){}
    [].forEach.call(document.querySelectorAll('[data-region-label]'),function(el){ el.textContent=REG[r]; });
    [].forEach.call(document.querySelectorAll('.region__opt'),function(o){ o.setAttribute('aria-checked',o.getAttribute('data-value')===r?'true':'false'); });
    [].forEach.call(document.querySelectorAll('.topbar__lang'),function(b){ b.setAttribute('aria-label','Region: '+REG[r]); });
  }
  setRegion(getRegion());
  [].forEach.call(document.querySelectorAll('.region'),function(wrap){
    var btn=wrap.querySelector('.topbar__lang'), menu=wrap.querySelector('.region__menu'); if(!btn||!menu) return;
    function open(v){ menu.classList.toggle('is-open',v); btn.setAttribute('aria-expanded',v?'true':'false'); }
    btn.addEventListener('click',function(e){ e.stopPropagation(); open(!menu.classList.contains('is-open')); });
    menu.addEventListener('click',function(e){ var o=e.target.closest('.region__opt'); if(!o) return; setRegion(o.getAttribute('data-value')); open(false); btn.focus(); });
    document.addEventListener('click',function(e){ if(!wrap.contains(e.target)) open(false); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') open(false); });
  });
  [].forEach.call(document.querySelectorAll('[data-region-toggle]'),function(b){
    b.addEventListener('click',function(){ setRegion(getRegion()==='uk'?'us':'uk'); });
  });

  /* ---------- scroll lock ---------- */
  function lock(on){
    if(on){ if(root.classList.contains('nav-scroll-lock')) return; var sw=window.innerWidth-root.clientWidth; root.style.setProperty('--sbw',sw+'px'); root.classList.add('nav-scroll-lock'); }
    else { root.classList.remove('nav-scroll-lock'); root.style.removeProperty('--sbw'); }
  }

  /* ---------- desktop mega menu ---------- */
  var nav=document.querySelector('.nav'), mega=document.getElementById('mm');
  if(nav&&mega){
    var scrim=document.createElement('div'); scrim.className='mm-scrim'; scrim.setAttribute('aria-hidden','true'); document.body.appendChild(scrim);
    var order=['products','solutions','resources','company'], btns={}, panels={};
    [].forEach.call(nav.querySelectorAll('.nav__item[data-menu]'),function(b){ var k=b.getAttribute('data-menu'); btns[k]=b; b.setAttribute('aria-expanded','false'); b.setAttribute('aria-controls','mm'); });
    [].forEach.call(mega.querySelectorAll('.mm__panel'),function(p){ panels[p.getAttribute('data-panel')]=p; });
    var current=null,tOpen,tClose,tReset,SHIFT=72;
    function fit(p){ var avail=window.innerHeight-nav.getBoundingClientRect().bottom, h=p.offsetHeight; mega.classList.toggle('is-scroll',h>avail); return Math.min(h,Math.max(avail,240)); }
    function show(k){
      clearTimeout(tClose); if(k===current) return;
      var next=panels[k], prev=current&&panels[current], first=!current;
      if(first){
        Object.keys(panels).forEach(function(n){ var q=panels[n]; if(q!==next){ q.classList.add('no-anim'); q.classList.remove('is-active'); q.style.transform=''; void q.offsetWidth; q.classList.remove('no-anim'); } });
        mega.classList.add('no-anim'); next.classList.add('no-anim'); next.style.transform='none'; next.classList.add('is-active');
        mega.style.height=fit(next)+'px'; void mega.offsetWidth;
        mega.classList.remove('no-anim'); next.classList.remove('no-anim'); mega.classList.add('is-open'); mega.setAttribute('aria-hidden','false'); scrim.classList.add('is-on'); lock(true);
      } else {
        var dir=order.indexOf(k)>order.indexOf(current)?1:-1;
        next.classList.add('no-anim'); next.style.transform='translateX('+(dir*SHIFT)+'px)'; void next.offsetWidth; next.classList.remove('no-anim');
        next.classList.add('is-active'); next.style.transform='translateX(0)'; mega.scrollTop=0;
        prev.classList.remove('is-active'); prev.style.transform='translateX('+(-dir*SHIFT)+'px)';
        mega.style.height=fit(next)+'px';
      }
      Object.keys(btns).forEach(function(n){ btns[n].setAttribute('aria-expanded',n===k?'true':'false'); });
      current=k;
    }
    function close(){
      clearTimeout(tOpen); if(!current) return;
      mega.classList.remove('is-open'); mega.setAttribute('aria-hidden','true'); scrim.classList.remove('is-on'); lock(false);
      clearTimeout(tReset); tReset=setTimeout(function(){ if(!mega.classList.contains('is-open')){ Object.keys(panels).forEach(function(n){ panels[n].classList.remove('is-active'); }); mega.style.height='0px'; } },300);
      Object.keys(btns).forEach(function(n){ btns[n].setAttribute('aria-expanded','false'); });
      current=null;
    }
    window.mitekCloseMenu=close;
    Object.keys(btns).forEach(function(k){
      var b=btns[k];
      b.addEventListener('mouseenter',function(){ clearTimeout(tClose); clearTimeout(tOpen); tOpen=setTimeout(function(){ show(k); },current?0:90); });
      b.addEventListener('click',function(){ if(current===k) close(); else show(k); });
      b.addEventListener('keydown',function(e){ if(e.key==='ArrowDown'&&current===k){ var f=panels[k].querySelector('a'); if(f){ e.preventDefault(); f.focus(); } } });
    });
    [].forEach.call(nav.querySelectorAll('.nav__item:not([data-menu])'),function(a){ a.addEventListener('mouseenter',function(){ clearTimeout(tOpen); tClose=setTimeout(close,150); }); });
    /* close a little later when the pointer leaves, so moving diagonally into the panel doesn't drop it */
    nav.addEventListener('mouseleave',function(){ clearTimeout(tOpen); tClose=setTimeout(close,260); });
    mega.addEventListener('mouseenter',function(){ clearTimeout(tClose); });
    scrim.addEventListener('click',close);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&current){ var b=btns[current]; close(); b.focus(); } });
    document.addEventListener('click',function(e){ if(!nav.contains(e.target)) close(); });
    window.addEventListener('resize',function(){ if(current) mega.style.height=fit(panels[current])+'px'; });
    var logo=nav.querySelector('.nav__logo'); if(logo) logo.addEventListener('click',function(){ close(); });
  }

  /* ---------- mobile drill-down menu ---------- */
  var mnav=document.getElementById('mnav'), burger=document.querySelector('.nav__burger');
  if(mnav&&burger){
    var screens={}; [].forEach.call(mnav.querySelectorAll('.mnav__screen'),function(s){ screens[s.getAttribute('data-screen')]=s; });
    function go(k){
      Object.keys(screens).forEach(function(n){ var s=screens[n]; s.classList.remove('is-left'); s.classList.toggle('is-active',n===k); if(n==='root'&&k!=='root') s.classList.add('is-left'); });
      var t=screens[k]; if(t) t.scrollTop=0;
    }
    function openM(v){ mnav.classList.toggle('is-open',v); burger.setAttribute('aria-expanded',v?'true':'false'); lock(v); if(v){ go('root'); var c=mnav.querySelector('.mnav__close'); c&&c.focus(); } else burger.focus(); }
    burger.addEventListener('click',function(){ openM(true); });
    mnav.querySelector('.mnav__close').addEventListener('click',function(){ openM(false); });
    [].forEach.call(mnav.querySelectorAll('[data-go]'),function(b){ b.addEventListener('click',function(){ go(b.getAttribute('data-go')); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&mnav.classList.contains('is-open')) openM(false); });
    window.addEventListener('resize',function(){ if(window.innerWidth>1023&&mnav.classList.contains('is-open')) openM(false); });
  }
})();
