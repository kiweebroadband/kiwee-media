(function(){
  var started=false;
  function eOut(t){t=t<0?0:t>1?1:t;return 1-Math.pow(1-t,3);}
  function cl(t){return t<0?0:t>1?1:t;}
  function boot(){
    if(started)return;started=true;
    if(!window.matchMedia('(min-width:861px)').matches)return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    var hero=document.querySelector('.kw2-hero');
    if(!hero)return;
    var pinwrap=hero.querySelector('.kw2-pinwrap');
    var cv=hero.querySelector('.kw2-scrub');
    var vid=hero.querySelector('.kw2-fallback');
    var cue=hero.querySelector('.kw2-scrollcue');
    var scrim=hero.querySelector('.kw2-topscrim');
    var rail=hero.querySelector('.kw2-rail > i');
    var speed=hero.querySelector('.kw2-speed');
    var speedNum=speed?speed.querySelector('.num'):null;
    var beats=[].slice.call(hero.querySelectorAll('.kw2-beat'));
    if(!pinwrap||!cv)return;
    var N=100, BASE='https://cdn.jsdelivr.net/gh/kiweebroadband/kiwee-media@main/scrub/';
    function pad(n){n=''+n;while(n.length<3){n='0'+n;}return n;}
    var imgs=new Array(N), loaded=0, on=false, ctx=cv.getContext('2d'), tick=false;
    function progress(){var r=pinwrap.getBoundingClientRect();var tot=pinwrap.offsetHeight-window.innerHeight;return tot<=0?0:Math.min(1,Math.max(0,(-r.top)/tot));}
    function rev(p,s,e,fade){
      if(p<s||p>e)return{o:0,a:0,b:1};
      var t=(e-s)>0?(p-s)/(e-s):1;
      var a=eOut(cl(t/fade)), b=eOut(cl((1-t)/fade));
      return{o:Math.min(a,b),a:a,b:b};
    }
    function paint(){
      var p=progress();
      var idx=Math.min(N-1,Math.max(0,Math.round(p*(N-1))));
      var im=imgs[idx];
      var W=window.innerWidth,H=window.innerHeight;
      ctx.clearRect(0,0,W,H);
      if(im&&im.complete&&im.naturalWidth){
        var iw=im.naturalWidth,ih=im.naturalHeight;
        var scale=Math.min(W/iw,H/ih);
        var w=iw*scale,h=ih*scale;
        ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
      }
      var maxO=0;
      for(var bi=0;bi<beats.length;bi++){
        var el=beats[bi], bs=parseFloat(el.getAttribute('data-s')), be=parseFloat(el.getAttribute('data-e'));
        var r=rev(p,bs,be,0.34);
        var ty=(1-r.a)*38 - (1-r.b)*26;
        var sc=0.93+r.o*0.07;
        var bl=(1-r.o)*10;
        el.style.opacity=r.o.toFixed(3);
        el.style.transform='translateX(-50%) translateY('+ty.toFixed(1)+'px) scale('+sc.toFixed(3)+')';
        el.style.filter=bl>0.06?'blur('+bl.toFixed(1)+'px)':'none';
        if(r.o>maxO)maxO=r.o;
      }
      if(speed){
        var ss=parseFloat(speed.getAttribute('data-s')), se=parseFloat(speed.getAttribute('data-e'));
        var rs=rev(p,ss,se,0.24);
        var stt=(se-ss)>0?cl((p-ss)/(se-ss)):0;
        var val=eOut(cl(stt/0.82))*2.5;
        if(speedNum)speedNum.textContent=val.toFixed(2);
        var sy=(1-rs.a)*34 - (1-rs.b)*22;
        speed.style.opacity=rs.o.toFixed(3);
        speed.style.transform='translateX(-50%) translateY('+sy.toFixed(1)+'px) scale('+(0.95+rs.o*0.05).toFixed(3)+')';
        speed.style.filter=rs.o<0.97?'blur('+((1-rs.o)*8).toFixed(1)+'px)':'none';
        if(rs.o>maxO)maxO=rs.o;
      }
      if(scrim)scrim.style.opacity=(maxO*0.96).toFixed(3);
      if(rail)rail.style.transform='scaleX('+p.toFixed(4)+')';
      if(cue)cue.style.opacity=p>0.02?'0':'0.85';
    }
    function resize(){
      var dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
      cv.width=Math.floor(window.innerWidth*dpr);cv.height=Math.floor(window.innerHeight*dpr);
      cv.style.width=window.innerWidth+'px';cv.style.height=window.innerHeight+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);paint();
    }
    function onScroll(){if(!tick){tick=true;requestAnimationFrame(function(){paint();tick=false;});}}
    function activate(){
      if(on)return;on=true;
      hero.classList.add('kw2-on');
      try{if(vid&&vid.pause){vid.pause();}}catch(e){}
      resize();
      window.addEventListener('scroll',onScroll,{passive:true});
      window.addEventListener('resize',resize);
    }
    for(var k=0;k<N;k++){(function(k){
      var im=new Image();im.decoding='async';
      im.onload=function(){loaded++;if(!on&&loaded>=Math.min(12,N)){activate();}if(on){paint();}};
      im.onerror=function(){if(!im.__alt){im.__alt=1;im.src=BASE+'f_'+pad(k)+'.webp';}};
      im.src=BASE+'F_'+pad(k)+'~1.WEB';imgs[k]=im;
    })(k);}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}
  window.addEventListener('load',boot);
})();
