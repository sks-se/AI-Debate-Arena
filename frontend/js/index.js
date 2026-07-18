
(function(){
  'use strict';

  /* ===================== CINEMATIC INTRO: SCROLL LOCK ===================== */
  /* The intro itself is 100% CSS keyframes/delays. This just prevents the
     page from scrolling underneath the black screen while it plays, and
     releases the lock the moment the loader's exit animation finishes
     (or immediately if the browser prefers reduced motion). */
  (function bootIntro(){
    var loader = document.getElementById('loader');
    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('intro-lock');

    function release(){
      root.classList.remove('intro-lock');
      loader.removeEventListener('animationend', onEnd);
    }
    function onEnd(e){
      if(e.animationName === 'loader-exit'){ release(); }
    }
    loader.addEventListener('animationend', onEnd);
    // Safety net in case animationend doesn't fire (e.g. tab was backgrounded)
    setTimeout(release, reduced ? 2200 : 14000);
  })();

  /* ===================== STARFIELD ===================== */
  (function initStars(){
    var field = document.getElementById('stars');
    var count = window.innerWidth < 700 ? 70 : 140;
    var frag = document.createDocumentFragment();
    for(var i=0;i<count;i++){
      var s = document.createElement('div');
      s.className = 'star';
      var size = Math.random()*2 + 0.5;
      s.style.width = size+'px';
      s.style.height = size+'px';
      s.style.top = Math.random()*100+'%';
      s.style.left = Math.random()*100+'%';
      s.style.animationDuration = (Math.random()*4+2.5)+'s';
      s.style.animationDelay = (Math.random()*4)+'s';
      frag.appendChild(s);
    }
    field.appendChild(frag);
  })();

  /* ===================== CURSOR GLOW (rAF smoothed) ===================== */
  (function initCursorGlow(){
    var glow = document.getElementById('cursor-glow');
    if(window.matchMedia('(pointer: coarse)').matches){ glow.style.display='none'; return; }
    var tx=0, ty=0, cx=0, cy=0, active=false;
    window.addEventListener('mousemove', function(e){
      tx = e.clientX; ty = e.clientY; active = true;
      glow.style.opacity = '1';
    });
    function loop(){
      cx += (tx-cx)*0.12;
      cy += (ty-cy)*0.12;
      if(active){ glow.style.transform = 'translate('+cx+'px,'+cy+'px)'; }
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ===================== SCROLL PROGRESS + BACK TO TOP + HEADER STATE ===================== */
  var progressBar = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  var header = document.getElementById('site-header');

  function onScroll(){
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop/docHeight)*100 : 0;
    progressBar.style.width = pct+'%';

    if(scrollTop > 80){ header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    if(scrollTop > 600){ backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ===================== MOBILE NAV TOGGLE ===================== */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true':'false');
    navToggle.classList.toggle('is-open', open);
  });
  navLinks.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  });

  /* ===================== NAV ACTIVE SECTION HIGHLIGHT ===================== */
  var sections = document.querySelectorAll('main section[id], .hero[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function(a){
          a.classList.toggle('active', a.getAttribute('href') === '#'+id);
        });
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  sections.forEach(function(s){ navObserver.observe(s); });

  /* ===================== REVEAL ON SCROLL (Intersection Observer) ===================== */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ===================== ANIMATED COUNTERS ===================== */
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts-startTime)/duration, 1);
        var eased = 1 - Math.pow(1-progress, 3);
        el.textContent = Math.round(eased*target) + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, {threshold:0.6});
  counters.forEach(function(c){ counterObserver.observe(c); });

  /* ===================== TYPING EFFECT ===================== */
  (function typeEffect(){
    var target = document.getElementById('typed-line');
    if(!target) return;
    var phrases = [
      'and only one path leads out.',
      'lose three debates and stay forever.',
      'your logic is the only key.'
    ];
    var phraseIndex = 0, charIndex = 0, deleting = false;
    function tick(){
      var current = phrases[phraseIndex];
      if(!deleting){
        charIndex++;
        target.textContent = current.slice(0, charIndex);
        if(charIndex === current.length){
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        target.textContent = current.slice(0, charIndex);
        if(charIndex === 0){
          deleting = false;
          phraseIndex = (phraseIndex+1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 28 : 45);
    }
    tick();
  })();

  /* ===================== RIPPLE BUTTON EFFECT ===================== */
  document.querySelectorAll('[data-ripple]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size+'px';
      ripple.style.left = (e.clientX - rect.left - size/2)+'px';
      ripple.style.top = (e.clientY - rect.top - size/2)+'px';
      btn.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 650);
    });
  });

  /* ===================== HERO GATE PARALLAX RINGS ===================== */
  (function gateSpin(){
    var outer = document.getElementById('ring-outer');
    var mid = document.getElementById('ring-mid');
    var inner = document.getElementById('ring-inner');
    if(!outer) return;
    var angle = 0;
    function spin(){
      angle += 0.06;
      outer.style.transform = 'rotate('+angle+'deg)';
      mid.style.transform = 'rotate('+(-angle*1.4)+'deg)';
      inner.style.transform = 'rotate('+(angle*0.6)+'deg)';
      requestAnimationFrame(spin);
    }
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      requestAnimationFrame(spin);
    }
  })();

  /* ===================== OPPONENT CAROUSEL CONTROLS ===================== */
  var track = document.getElementById('opponents-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  function scrollTrack(dir){
    var cardWidth = track.querySelector('.opp-card').getBoundingClientRect().width + 22;
    track.scrollBy({left: dir*cardWidth*2, behavior:'smooth'});
  }
  prevBtn.addEventListener('click', function(){ scrollTrack(-1); });
  nextBtn.addEventListener('click', function(){ scrollTrack(1); });

  /* ===================== SMOOTH SCROLL FOR ANCHOR LINKS ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length > 1 && document.querySelector(id)){
        e.preventDefault();
        document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

})();
