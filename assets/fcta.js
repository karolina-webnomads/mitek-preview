
(function(){var sec=document.querySelector('.fcta__banner'),cv=sec&&sec.querySelector('.fcta__glow');if(!cv)return;
var ctx=cv.getContext('2d'),G=24,U=32,W,H,C,R,OX=0,OY=0,dpr=Math.min(2,window.devicePixelRatio||1),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function hash(i,j){var x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x);}
var BL=new Float32Array(0),RD=new Float32Array(0),SRC=[0,0],T0=null;var BANDV=new Float32Array(0),BG=new Float32Array(0),MX=0,MY=0,MIN=0;
function layout(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
 var sr=cv.getBoundingClientRect(),cta=sec.querySelector('.fcta__copy'),cr=cta.getBoundingClientRect(),bdn=null,br=bdn?bdn.getBoundingClientRect():null;
 var L=cr.left-sr.left,T=cr.top-sr.top,Rt=cr.right-sr.left,B=cr.bottom-sr.top;OX=(L%G)-G;OY=(T%G)-G;
 C=Math.ceil((W-OX)/G)+1;R=Math.ceil((H-OY)/G)+1;BL=new Float32Array(C*R);BANDV=new Float32Array(C*R);BG=new Float32Array(C*R);RD=new Float32Array(C*R);SRC=[(L+Rt)/2,(T+B)/2];
 for(var j=0;j<R;j++)for(var i=0;i<C;i++){var cx=(i+.5)*G+OX,cy=(j+.5)*G+OY,dx=Math.max(0,L-cx,cx-Rt),dy=Math.max(0,T-cy,cy-B),d=Math.sqrt(dx*dx+dy*dy);
  var hs=hash(i,j),f0=Math.max(0,1-d/190),f=Math.pow(f0,1.7)*(.55+.7*hs);if(hs<.35&&f0<.6)f=0;if(hs>.965&&f0>0&&f0<.45)f=Math.max(f,.4);
  var bb=0;if(false&&br){var bx0=br.left-sr.left-168,by0=br.top-sr.top-72,bx1=Math.min(W-24,br.right-sr.left+96),by1=Math.min(H-24,br.bottom-sr.top+72);if(cx-G/2>=bx0&&cx+G/2<=bx1&&cy-G/2>=by0&&cy+G/2<=by1){bb=hash(i+7,j+3)<.55?0:(.1+.18*hash(i+11,j+5));}}BANDV[j*C+i]=bb;BL[j*C+i]=0;RD[j*C+i]=Math.hypot(cx-SRC[0],cy-SRC[1]);}}
layout();addEventListener('resize',layout);
var P=[],SPEED=7,WID=2.3,FREQ=1.25,FADE=1.1,MAXP=48,last=null;
var STAGE=[[255,167,0],[150,191,134],[44,117,225],[30,189,205]],SEQ=0;
function add(x,y,w,c){P.push({x:x,y:y,t:performance.now()/1000,w:w,c:c||STAGE[Math.floor(SEQ++/3)%4]});if(P.length>MAXP)P.shift();}
var CR=new Float32Array(0),CG=new Float32Array(0),CB=new Float32Array(0),PS=new Float32Array(0);
sec.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();var x=(e.clientX-r.left-OX)/U,y=(e.clientY-r.top-OY)/U;
 if(!last){last=[x,y];return;}var d=Math.hypot(x-last[0],y-last[1]);if(d>2){add(x,y,.65*Math.min(1,d/5));last=[x,y];}});
sec.addEventListener('mouseleave',function(){last=null});sec.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();MX=e.clientX-r.left;MY=e.clientY-r.top;MIN=1;});sec.addEventListener('mouseleave',function(){MIN=0;});
var hgt=new Float32Array(0),vis=false;
new IntersectionObserver(function(es){es.forEach(function(e){vis=e.isIntersecting;if(vis&&T0===null){setTimeout(layout,1200);T0=performance.now()/1000;add((SRC[0]-OX)/U,(SRC[1]-OY)/U,1,STAGE[2]);}});},{threshold:.25}).observe(sec);
function frame(){requestAnimationFrame(frame);if(!vis||T0===null)return;var now=performance.now()/1000;
 while(P.length&&now-P[0].t>FADE*4)P.shift();if(hgt.length!==C*R){hgt=new Float32Array(C*R);CR=new Float32Array(C*R);CG=new Float32Array(C*R);CB=new Float32Array(C*R);PS=new Float32Array(C*R);}
 for(var j=0;j<R;j++)for(var i=0;i<C;i++){var cx=(i+.5)*G/U,cy=(j+.5)*G/U,amb=.18*Math.sin(cx*.32+now*.55)*Math.cos(cy*.41-now*.42),wh=0,tw=0,sr=0,sg=0,sb=0;
  for(var k=0;k<P.length;k++){var p=P[k],age=now-p.t,dx=cx-p.x,dy=cy-p.y,dist=Math.sqrt(dx*dx+dy*dy),rel=dist-SPEED*age;if(rel>WID*3||rel<-WID*3)continue;
   var w=Math.exp(-rel*rel/(WID*WID))*Math.exp(-age/FADE)/(1+dist*.08)*p.w;wh+=w*Math.cos(FREQ*rel);tw+=w;sr+=w*p.c[0];sg+=w*p.c[1];sb+=w*p.c[2];}
  var q=j*C+i;hgt[q]=amb+wh/Math.max(tw,1);PS[q]=Math.min(1,tw*1.6);if(tw>1e-4){CR[q]=sr/tw;CG[q]=sg/tw;CB[q]=sb/tw;}}
 ctx.clearRect(0,0,W,H);
 for(var j=0;j<R;j++)for(var i=0;i<C;i++){var k=j*C+i,rv=reduce?1:Math.min(1,Math.max(0,((now-T0)*700-RD[k]+hash(i+3,j+9)*60)/110));if(rv<=0)continue;
  var h=hgt[k],x=i*G+OX,y=j*G+OY,up=Math.max(0,h),bl=BL[k];var tv=BANDV[k];if(tv){var tg=0;if(MIN){var ddx=x+G/2-MX,ddy=y+G/2-MY;tg=Math.exp(-(ddx*ddx+ddy*ddy)/(90*90));}BG[k]+=(tg-BG[k])*.07;bl=tv*BG[k]*1.5;}
  var hr=i<C-1?hgt[k+1]:h,hb=j<R-1?hgt[k+C]:h,hl=i>0?hgt[k-1]:h,ht=j>0?hgt[k-C]:h,slope=((hl-hr)+(ht-hb))*.5,lit=Math.max(0,slope);
  // tile: transparent on the navy; Mitek blue near the CTA; lifted tiles brighten toward blue/white
  var a=bl*.75+up*.15+lit*.09;if(a>.003){var r=44+ (120-44)*Math.min(1,up*.85),g=117+(170-117)*Math.min(1,up*.85),b=225+(250-225)*Math.min(1,up*.85);
   ctx.globalAlpha=rv*Math.min(.9,a);ctx.fillStyle='rgb('+(r|0)+','+(g|0)+','+(b|0)+')';ctx.fillRect(x+1,y+1,G-1,G-1);}
  if(up>.08){ctx.globalAlpha=rv;ctx.fillStyle='rgba(150,185,240,'+Math.min(.09,(up-.08)*.12).toFixed(3)+')';ctx.fillRect(x,y,G,1);ctx.fillRect(x,y,1,G);}}
 ctx.globalAlpha=1;}
frame();
})();
