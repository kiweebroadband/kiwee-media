(function(){
  var booted=false;
  function boot(){
    if(booted) return; booted=true;
    if(!window.matchMedia('(min-width:861px)').matches) return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var hero=document.querySelector('.kw2-hero');
    if(!hero) return;
    var pinwrap=hero.querySelector('.kw2-pinwrap');
    var cv=hero.querySelector('.kw2-scrub');
    var vid=hero.querySelector('.kw2-fallback');
    var cue=hero.querySelector('.kw2-scrollcue');
    var scrim=hero.querySelector('.kw2-topscrim');
    var beats=[].slice.call(hero.querySelectorAll('.kw2-beat'));
    if(!pinwrap||!cv) return;
    var N=100, BASE='https://cdn.jsdelivr.net/gh/kiweebroadband/kiwee-media@main/scrub/';
    function pad(n){n=''+n;while(n.length<3){n='0'+n;}return n;}
    var imgs=new Array(N), loaded=0, on=false, ctx=cv.getContext('2d'), tick=false;
    function progress(){var r=pinwrap.getBoundingClientRect();var tot=pinwrap.offsetHeight-window.innerHeight;return tot<=0?0:Math.min(1,Math.max(0,(-r.top)/tot));}
    function paint(){
      var p=progress();
      var idx=Math.min(N-1,Math.max(0,Math.round(p*(N-1))));
      var im=imgs[idx];
      if(im&&im.complete&&im.naturalWidth){
        var iw=im.naturalWidth,ih=im.naturalHeight,W=window.innerWidth,H=window.innerHeight;
        var s=Math.max(W/iw,H/ih),w=iw*s,h=ih*s;
        ctx.clearRect(0,0,W,H);
        ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
      }
      var maxO=0;
      for(var bi=0;bi<beats.length;bi++){
        var b=beats[bi], bs=parseFloat(b.getAttribute('data-s')), be=parseFloat(b.getAttribute('data-e')), o=0;
        if(p>=bs&&p<=be){var t=(p-bs)/(be-bs);var fin=Math.min(1,t/0.22),fout=Math.min(1,(1-t)/0.22);o=Math.min(fin,fout);}
        b.style.opacity=o.toFixed(3);
        b.style.transform='translateX(-50%) translateY('+((1-o)*14).toFixed(1)+'px)';
        if(o>maxO)maxO=o;
      }
      if(scrim){scrim.style.opacity=maxO.toFixed(3);}
      if(cue){cue.style.opacity=p>0.02?'0':'0.85';}
    }
    function resize(){
      var dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
      cv.width=Math.floor(window.innerWidth*dpr);cv.height=Math.floor(window.innerHeight*dpr);
      cv.style.width=window.innerWidth+'px';cv.style.height=window.innerHeight+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);paint();
    }
    function onScroll(){if(!tick){tick=true;requestAnimationFrame(function(){paint();tick=false;});}}
    function activate(){
      if(on) return; on=true;
      hero.classList.add('kw2-on');
      try{ if(vid&&vid.pause){vid.pause();} }catch(e){}
      resize();
      window.addEventListener('scroll',onScroll,{passive:true});
      window.addEventListener('resize',resize);
    }
    for(var k=0;k<N;k++){(function(k){
      var im=new Image(); im.decoding='async';
      im.onload=function(){loaded++; if(!on&&loaded>=Math.min(12,N)){activate();} if(on){paint();}};
      im.onerror=function(){if(!im.__alt){im.__alt=1;im.src=BASE+'f_'+pad(k)+'.webp';}};
      im.src=BASE+'F_'+pad(k)+'~1.WEB'; imgs[k]=im;
    })(k);}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}
  window.addEventListener('load',boot);
})();
