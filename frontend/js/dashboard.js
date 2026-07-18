
(function(){
  'use strict';

  var WEEK = [
    {label:'Mon',value:3},{label:'Tue',value:5},{label:'Wed',value:2},
    {label:'Thu',value:7},{label:'Fri',value:4},{label:'Sat',value:8},{label:'Sun',value:6}
  ];
  var maxVal = Math.max.apply(null, WEEK.map(function(d){return d.value;}));

  var RECENT = [
    {name:'Socrates', result:'win', xp:220, date:'Today, 14:02'},
    {name:'Machiavelli', result:'win', xp:190, date:'Today, 11:47'},
    {name:'Sun Tzu', result:'loss', xp:40, date:'Yesterday, 21:15'},
    {name:'Einstein', result:'win', xp:260, date:'Yesterday, 18:30'},
    {name:'Cleopatra', result:'loss', xp:35, date:'2 days ago'}
  ];

  function initials(name){ return name.split(' ').map(function(p){return p[0];}).join('').toUpperCase().slice(0,2); }

  function buildBars(){
    var wrap = document.getElementById('bar-chart');
    WEEK.forEach(function(d, idx){
      var col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = '<div class="bar" data-h="'+ (d.value/maxVal*100) +'"></div><span class="bar-label">'+d.label+'</span>';
      wrap.appendChild(col);
      setTimeout(function(){
        col.querySelector('.bar').style.height = (d.value/maxVal*100) + '%';
      }, 200 + idx*90);
    });
  }

  function buildRecent(){
    var wrap = document.getElementById('recent-list');
    RECENT.forEach(function(g){
      var row = document.createElement('div');
      row.className = 'recent-row';
      row.innerHTML =
        '<span class="recent-avatar">'+initials(g.name)+'</span>'+
        '<span><div class="recent-name">'+g.name+'</div><div class="recent-date">'+g.date+'</div></span>'+
        '<span class="recent-badge '+g.result+'">'+(g.result==='win'?'Victory':'Defeat')+'</span>'+
        '<span class="recent-xp">+'+g.xp+' XP</span>';
      wrap.appendChild(row);
    });
  }

  function animateDonut(){
    var target = 68;
    document.documentElement.style.setProperty('--wr', 0);
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/1200, 1);
      var cur = Math.round(target*p);
      document.getElementById('donut').style.setProperty('--wr', cur);
      document.getElementById('donut-val').textContent = cur + '%';
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateXP(){
    var el = document.getElementById('dash-xp-fill');
    setTimeout(function(){ el.style.width = '62%'; }, 300);
  }

  function animateLevelRing(){
    document.getElementById('profile-ring').style.setProperty('--lvl-pct', 62);
  }

  buildBars();
  buildRecent();
  animateXP();
  animateLevelRing();

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        if(e.target.querySelector('#donut')) animateDonut();
        observer.unobserve(e.target);
      }
    });
  }, {threshold:0.2});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

})();
