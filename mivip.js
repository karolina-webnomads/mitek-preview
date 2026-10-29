/* MiVIP page: step tabs (sliding window, autoplay), use-case tabs, FAQ accordion, product carousel */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* generic tab set: buttons[] <-> panels[], arrow keys move focus + selection */
  function tabset(btns,panels,opts){
    opts=opts||{};
    function select(i,focus){
      btns.forEach(function(b,k){ var on=k===i; b.classList.toggle('is-active',on); b.setAttribute('aria-selected',on?'true':'false'); b.tabIndex=on?0:-1; });
      panels.forEach(function(p,k){ var on=k===i; p.classList.toggle('is-active',on);
        if(opts.fade){ if(on){ p.removeAttribute('aria-hidden'); p.inert=false; } else { p.setAttribute('aria-hidden','true'); p.inert=true; } }
        else p.hidden=!on; });
      if(focus) btns[i].focus({preventScroll:true});
      if(opts.onSelect) opts.onSelect(i);
      cur=i;
    }
    var cur=0;
    btns.forEach(function(b,i){
      b.addEventListener('click',function(){ select(i); if(opts.onUser) opts.onUser(); });
      b.addEventListener('keydown',function(e){
        var next=null, v=opts.vertical;
        if(e.key===(v?'ArrowDown':'ArrowRight')) next=(i+1)%btns.length;
        else if(e.key===(v?'ArrowUp':'ArrowLeft')) next=(i-1+btns.length)%btns.length;
        else if(e.key==='Home') next=0; else if(e.key==='End') next=btns.length-1;
        if(next!==null){ e.preventDefault(); select(next,true); if(opts.onUser) opts.onUser(); }
      });
    });
    return {select:select,get current(){return cur;}};
  }

  /* how it works: tabs slide so the active one is always fully visible; autoplay until the user interacts */
  var how=document.querySelector('.mv-how');
  if(how){
    var wrap=how.querySelector('.mv-tabs'), row=how.querySelector('.mv-tabs__row');
    var tb=[].slice.call(how.querySelectorAll('.mv-tab')), sp=[].slice.call(how.querySelectorAll('.mv-step'));
    /* the active tab always slides to the left edge (previous steps move out to the left) */
    function reveal(i){
      var max=row.scrollWidth-row.clientWidth;
      row.scrollLeft=Math.min(tb[i].offsetLeft-tb[0].offsetLeft,max);
    }
    function endState(){
      wrap.classList.toggle('is-end',row.scrollLeft+row.clientWidth>=row.scrollWidth-2);
      wrap.classList.toggle('is-start',row.scrollLeft<=2);
    }
    row.addEventListener('scroll',endState,{passive:true}); endState();
    var timer=null, stopped=reduce;
    function stop(){ stopped=true; clearInterval(timer); }
    var ts=tabset(tb,sp,{onSelect:reveal,onUser:stop});
    function play(){ if(stopped) return; clearInterval(timer); timer=setInterval(function(){ ts.select((ts.current+1)%tb.length); },6000); }
    how.addEventListener('mouseenter',function(){ clearInterval(timer); });
    how.addEventListener('mouseleave',play);
    how.addEventListener('focusin',function(){ clearInterval(timer); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) play(); else clearInterval(timer); }); },{threshold:.4}).observe(how);
    }
  }

  /* use cases */
  var uc=document.querySelector('.mv-uc');
  if(uc){
    var ind=uc.querySelector('.mv-uc__ind'), ub=[].slice.call(uc.querySelectorAll('.mv-uc__item'));
    /* the blue bar glides to the selected item (and stretches to its height) */
    function moveInd(i){ if(!ind) return; var b=ub[i]; ind.style.height=b.offsetHeight+'px'; ind.style.transform='translateY('+b.offsetTop+'px)'; }
    tabset(ub,[].slice.call(uc.querySelectorAll('.mv-uc__panel')),{vertical:true,fade:true,onSelect:moveInd});
    moveInd(0); window.addEventListener('resize',function(){ var a=ub.findIndex(function(b){return b.classList.contains('is-active');}); moveInd(a<0?0:a); });
  }

  /* FAQ: only one answer open at a time */
  var faqQs=[].slice.call(document.querySelectorAll('.mv-faq__q'));
  faqQs.forEach(function(q){
    q.addEventListener('click',function(){
      var it=q.closest('.mv-faq__item'), open=!it.classList.contains('is-open');
      faqQs.forEach(function(o){ var oi=o.closest('.mv-faq__item'); var on=open&&o===q; oi.classList.toggle('is-open',on); o.setAttribute('aria-expanded',on?'true':'false'); });
    });
  });

  /* products carousel */
  var more=document.querySelector('.mv-more');
  if(more){
    var track=more.querySelector('.mv-more__track'), bs=[].slice.call(more.querySelectorAll('.mv-more__btn'));
    function upd(){ bs[0].disabled=track.scrollLeft<=2; bs[1].disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2; }
    bs.forEach(function(b){ b.addEventListener('click',function(){
      var card=track.querySelector('.mv-pcard'), step=card?card.offsetWidth+24:300;
      track.scrollBy({left:(+b.getAttribute('data-dir'))*step*2,behavior:reduce?'auto':'smooth'});
    }); });
    track.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd); upd();
  }
})();
