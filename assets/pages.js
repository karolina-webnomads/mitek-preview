/* Utility pages: TOC highlight, accordions, A–Z quick find, table "versions" toggle, contact form */
(function(){
  /* TOC: highlight the section in view */
  var toc=document.querySelector('.toc');
  if(toc&&'IntersectionObserver' in window){
    var links=[].slice.call(toc.querySelectorAll('a')), map={};
    links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
    var heads=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    function set(id){ links.forEach(function(a){ a.classList.toggle('is-active',a===map[id]); }); }
    if(heads[0]) set(heads[0].id);
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) set(e.target.id); }); },{rootMargin:'-120px 0px -65% 0px'});
    heads.forEach(function(h){ io.observe(h); });
  }
  /* accordions */
  document.addEventListener('click',function(e){
    var q=e.target.closest('.aitem__q'); if(q){ var it=q.closest('.aitem'), o=!it.classList.contains('is-open'); it.classList.toggle('is-open',o); q.setAttribute('aria-expanded',o?'true':'false'); return; }
    var v=e.target.closest('.ver__q'); if(v){ var ver=v.closest('.ver'), o2=!ver.classList.contains('is-open'); ver.classList.toggle('is-open',o2); v.setAttribute('aria-expanded',o2?'true':'false'); return; }
    var t=e.target.closest('.tbl__toggle'); if(t){ var row=document.getElementById(t.getAttribute('aria-controls')), o3=t.getAttribute('aria-expanded')!=='true'; t.setAttribute('aria-expanded',o3?'true':'false'); if(row) row.hidden=!o3; }
  });
  /* A–Z quick find */
  var input=document.querySelector('.az__search input');
  if(input){
    var items=[].slice.call(document.querySelectorAll('.aitem')), groups=[].slice.call(document.querySelectorAll('.agroup')), empty=document.querySelector('.az__empty');
    input.addEventListener('input',function(){
      var q=input.value.trim().toLowerCase(), any=false;
      items.forEach(function(it){ var hit=!q||it.querySelector('.aitem__q').textContent.toLowerCase().indexOf(q)>-1; it.hidden=!hit; if(hit) any=true; });
      groups.forEach(function(g){ g.hidden=!g.querySelector('.aitem:not([hidden])'); });
      if(empty) empty.classList.toggle('is-on',!any);
    });
  }
  /* contact form → thank you page (preview only: nothing is sent) */
  var form=document.querySelector('form.form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault(); var ok=true, first=null;
      [].forEach.call(form.querySelectorAll('[required]'),function(f){ var bad=!f.value.trim()||(f.type==='email'&&!/^\S+@\S+\.\S+$/.test(f.value)); f.closest('.field').classList.toggle('is-invalid',bad); if(bad){ ok=false; first=first||f; } });
      form.querySelector('.form__err').classList.toggle('is-on',!ok);
      if(!ok){ first.focus(); return; }
      window.location.href='thank-you.html';
    });
    form.addEventListener('input',function(e){ var f=e.target.closest('.field'); if(f) f.classList.remove('is-invalid'); });
  }
})();
