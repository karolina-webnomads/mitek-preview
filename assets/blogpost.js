/* Blog post: FAQ (one open at a time), share links, copy link */
(function(){
  var qs=[].slice.call(document.querySelectorAll('.bp-faq__q'));
  qs.forEach(function(q){ q.addEventListener('click',function(){
    var open=!q.closest('.bp-faq__item').classList.contains('is-open');
    qs.forEach(function(o){ var on=open&&o===q; o.closest('.bp-faq__item').classList.toggle('is-open',on); o.setAttribute('aria-expanded',on?'true':'false'); });
  }); });
  var url=location.href.split('#')[0];
  [].forEach.call(document.querySelectorAll('[data-share]'),function(a){
    a.href=a.getAttribute('data-share')+encodeURIComponent(url); a.target='_blank'; a.rel='noopener';
  });
  var c=document.querySelector('[data-copy]');
  if(c) c.addEventListener('click',function(){
    var tip=c.querySelector('.bp-copied');
    function done(){ tip.textContent='Link copied'; tip.classList.add('is-on'); setTimeout(function(){ tip.classList.remove('is-on'); },1600); }
    if(navigator.clipboard) navigator.clipboard.writeText(url).then(done,done); else done();
  });
})();
