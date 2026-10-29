/* Resource library + blog: quick find, topic/type filters, "View all" links, pagination (preview only) */
(function(){
  function norm(s){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }

  /* ---------- resource library ---------- */
  var lib=document.querySelector('.rl-filters');
  if(lib){
    var q=lib.querySelector('input'), topic=lib.querySelector('select[name="topic"]'), type=lib.querySelector('select[name="type"]');
    var secs=[].slice.call(document.querySelectorAll('.rl-sec')), empty=lib.querySelector('.rl-empty');
    function apply(){
      var v=norm(q.value), t=topic.value, ty=type.value, any=false, filtering=!!(v||t||ty);
      secs.forEach(function(s){
        var shown=0;
        [].forEach.call(s.querySelectorAll('.rl-card'),function(c){
          var ok=(!ty||c.getAttribute('data-type')===ty)&&(!t||(' '+c.getAttribute('data-topics')+' ').indexOf(' '+t+' ')>-1)&&(!v||norm(c.textContent).indexOf(v)>-1);
          c.hidden=!ok; if(ok) shown++;
        });
        s.hidden=!shown; s.classList.toggle('is-filtered',filtering); if(shown) any=true;
      });
      empty.hidden=any;
    }
    q.addEventListener('input',apply); topic.addEventListener('change',apply); type.addEventListener('change',apply);
    /* "View all …" → filter to that type and jump to the filters */
    [].forEach.call(document.querySelectorAll('[data-filter-type]'),function(a){
      a.addEventListener('click',function(e){ e.preventDefault(); type.value=a.getAttribute('data-filter-type'); apply();
        lib.scrollIntoView({behavior:'smooth',block:'start'}); });
    });
    /* nav links like resource-library.html#ebooks → same filter */
    var h=location.hash.slice(1);
    if(h&&[].some.call(type.options,function(o){return o.value===h;})){ type.value=h; apply(); setTimeout(function(){ lib.scrollIntoView({block:'start'}); },60); }
  }

  /* ---------- blog ---------- */
  var bl=document.querySelector('.bl-list');
  if(bl){
    var bq=bl.querySelector('input'), bt=bl.querySelector('select'), cards=[].slice.call(bl.querySelectorAll('.bl-card')), cta=bl.querySelector('.bl-cta'), bempty=bl.querySelector('.rl-empty');
    function bapply(){
      var v=norm(bq.value), t=bt.value, any=false;
      cards.forEach(function(c){ var ok=(!t||(' '+c.getAttribute('data-topics')+' ').indexOf(' '+t+' ')>-1)&&(!v||norm(c.textContent).indexOf(v)>-1); c.hidden=!ok; if(ok) any=true; });
      if(cta) cta.hidden=!!(v||t);
      bempty.hidden=any;
    }
    bq.addEventListener('input',bapply); bt.addEventListener('change',bapply);
    /* pagination: preview only — the active page moves, the list stays */
    var nums=[].slice.call(bl.querySelectorAll('.bl-pg__n')), arrs=bl.querySelectorAll('.bl-pg__arr'), cur=0;
    function go(i){ cur=Math.max(0,Math.min(nums.length-1,i)); nums.forEach(function(n,k){ n.classList.toggle('is-active',k===cur); if(k===cur) n.setAttribute('aria-current','page'); else n.removeAttribute('aria-current'); });
      arrs[0].disabled=cur===0; arrs[1].disabled=cur===nums.length-1; bl.scrollIntoView({behavior:'smooth',block:'start'}); }
    nums.forEach(function(n,i){ n.addEventListener('click',function(){ go(i); }); });
    arrs[0].addEventListener('click',function(){ go(cur-1); }); arrs[1].addEventListener('click',function(){ go(cur+1); });
  }
})();
