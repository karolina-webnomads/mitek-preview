/* Navbar "style c": desktop mega menu (one container morphs its height, panels slide in the
   direction you move), page scroll locked while open, region switch, mobile drill-down menu. */
(function(){
  var root=document.documentElement;

  /* ---------- links to pages that already exist in the preview (works on pages built before they existed) ---------- */
  (function(){
    var me=document.currentScript||document.querySelector('script[src*="nav.js"]'), base=me&&me.src?me.src.replace(/assets\/nav\.js.*$/,''):'';
    var U='https://www.miteksystems.com', L={'/products/mitek-verified-identity-platform':'mitek-verified-identity-platform.html','/use-cases/customer-onboarding':'solutions-customer-onboarding.html','/customer-success':'customers.html',
      '/blog':'blog.html','/resource-library':'resource-library.html','/glossary':'glossary.html','/privacy-policy':'privacy-policy.html','/terms-and-conditions':'terms-and-conditions.html'};
    [].forEach.call(document.querySelectorAll('a.nav__item[href="#"],a.mnav__row[href="#"]'),function(a){ if(/customer success/i.test(a.textContent)) a.setAttribute('href',base+'customers.html'); });
    [].forEach.call(document.querySelectorAll('a[href^="'+U+'"]'),function(a){ var h=a.getAttribute('href').slice(U.length).replace(/\/$/,''); if(L[h]) a.setAttribute('href',base+L[h]); });
  })();

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

  /* ---------- search: panel slides down from under the navbar (Figma "Search open"), backdrop blur 8 + navy 35% closes it ---------- */
  var SI='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="m17 17-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      CI='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m5 5 8 8M13 5l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function wireForm(f){
    var inp=f.querySelector('input'), clr=f.querySelector('.sform__clear'); if(!inp) return;
    function sync(){ if(clr) clr.hidden=!inp.value; }
    inp.addEventListener('input',sync); sync();
    if(clr) clr.addEventListener('click',function(){ inp.value=''; sync(); inp.focus(); });
    f.addEventListener('submit',function(e){ var q=inp.value.trim(); if(!q){ e.preventDefault(); inp.focus(); return; }
      if(window.mitekSearchGo){ e.preventDefault(); window.mitekSearchGo(q); closeS(); } });
  }
  var hdr=document.querySelector('.site-header .nav')||document.querySelector('.nav'), sBtn=document.querySelector('.nav__search'), sp, sScrim, sOpen=false, sLast;
  function closeS(){ if(!sOpen) return; sOpen=false; sp.classList.remove('is-open'); sp.setAttribute('aria-hidden','true'); sScrim.classList.remove('is-on'); lock(false);
    if(sBtn) sBtn.setAttribute('aria-expanded','false'); if(sLast&&sLast.focus) sLast.focus(); }
  function openS(){
    if(!sp||sOpen) return; if(window.mitekCloseMenu) window.mitekCloseMenu();
    if(mnav&&mnav.classList.contains('is-open')){ mnav.classList.remove('is-open'); burger&&burger.setAttribute('aria-expanded','false'); }
    sLast=document.activeElement; sOpen=true; sp.classList.add('is-open'); sp.setAttribute('aria-hidden','false'); sScrim.classList.add('is-on'); lock(true);
    if(sBtn) sBtn.setAttribute('aria-expanded','true');
    var i=sp.querySelector('input'); var q=(new URLSearchParams(location.search)).get('q'); if(q&&!i.value){ i.value=q; i.dispatchEvent(new Event('input')); }
    setTimeout(function(){ i.focus(); i.select(); },60);
  }
  if(hdr){
    sp=document.createElement('div'); sp.className='sp'; sp.id='site-search'; sp.setAttribute('role','dialog'); sp.setAttribute('aria-label','Search'); sp.setAttribute('aria-hidden','true');
    sp.innerHTML='<div class="sp__in"><form class="sform" action="search.html" method="get" role="search"><label class="sform__field">'+SI+
      '<span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search</span><input type="search" name="q" placeholder="Search products, solutions and resources" autocomplete="off" enterkeyhint="search">'+
      '<button type="button" class="sform__clear" aria-label="Clear search" hidden>'+CI+'</button></label>'+
      '<button type="submit" class="btn btn--primary sform__go"><span class="btn__roll"><span>Search</span><span aria-hidden="true">Search</span></span></button></form></div>';
    hdr.appendChild(sp);
    sScrim=document.createElement('div'); sScrim.className='sp-scrim'; sScrim.setAttribute('aria-hidden','true'); document.body.appendChild(sScrim);
    sScrim.addEventListener('click',closeS);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&sOpen) closeS(); });
    /* keep Tab inside the panel while it is open */
    sp.addEventListener('keydown',function(e){ if(e.key!=='Tab') return; var f=sp.querySelectorAll('input,button:not([hidden])'), a=f[0], b=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); b.focus(); } else if(!e.shiftKey&&document.activeElement===b){ e.preventDefault(); a.focus(); } });
    if(sBtn){ sBtn.setAttribute('aria-expanded','false'); sBtn.setAttribute('aria-controls','site-search'); sBtn.addEventListener('click',function(e){ e.stopPropagation(); sOpen?closeS():openS(); }); }
    [].forEach.call(document.querySelectorAll('.mnav__icon[aria-label="Search"]'),function(b){ b.addEventListener('click',function(){ lock(false); openS(); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='/'&&!sOpen&&!/input|textarea|select/i.test((document.activeElement||{}).tagName||'')){ e.preventDefault(); openS(); } });
  }
  [].forEach.call(document.querySelectorAll('.sform'),wireForm);
  window.mitekOpenSearch=openS;
})();
