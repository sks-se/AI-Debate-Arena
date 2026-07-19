
(function(){
  'use strict';

  var PLAYERS = [
    {rank:1,name:'R. Sharma',time:'0:38:12',wins:6,diff:5,ring1:'#ffd88a',ring2:'#d9b46a'},
    {rank:2,name:'S. Iyer',time:'0:41:47',wins:6,diff:5,ring1:'#c7d0e0',ring2:'#8b93b3'},
    {rank:3,name:'K. Nair',time:'0:45:03',wins:6,diff:4,ring1:'#e0a978',ring2:'#c98a52'},
    {rank:4,name:'P. Reddy',time:'0:48:29',wins:5,diff:4,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:5,name:'A. Mehta',time:'0:51:15',wins:5,diff:4,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:6,name:'N. Gupta',time:'0:54:02',wins:5,diff:3,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:7,name:'V. Rao',time:'0:57:40',wins:4,diff:3,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:8,name:'A. Verma',time:'1:02:18',wins:3,diff:3,ring1:'#4fd8ff',ring2:'#a855f7',you:true},
    {rank:9,name:'S. Joshi',time:'1:06:55',wins:3,diff:2,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:10,name:'D. Chatterjee',time:'1:11:30',wins:2,diff:2,ring1:'#4fd8ff',ring2:'#a855f7'}
  ];

  function initials(name){
    var parts = name.replace('.', '').split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function starMarkup(level){
    var s = '';
    for(var i=1;i<=5;i++){ s += '<i class="'+(i<=level?'filled':'')+'"></i>'; }
    return s;
  }

  function buildPodium(){
    var wrap = document.getElementById('podium');
    var top3 = PLAYERS.slice(0,3);
    top3.forEach(function(p){
      var card = document.createElement('div');
      card.className = 'podium-card rank-'+p.rank;
      card.style.setProperty('--ring1', p.ring1);
      card.style.setProperty('--ring2', p.ring2);
      card.innerHTML =
        '<div class="podium-rank">'+ (p.rank===1?'🏆 Champion':'Rank '+p.rank) +'</div>'+
        '<div class="podium-avatar"><span>'+initials(p.name)+'</span></div>'+
        '<div class="podium-name">'+p.name+'</div>'+
        '<div class="podium-meta">Difficulty '+p.diff+'/5</div>'+
        '<div class="podium-stats">'+
          '<div><div class="pv">'+p.time+'</div><div class="pl">Escape</div></div>'+
          '<div><div class="pv">'+p.wins+'</div><div class="pl">Wins</div></div>'+
        '</div>';
      wrap.appendChild(card);
    });
  }

  function buildRows(){
    var wrap = document.getElementById('lb-rows');
    PLAYERS.forEach(function(p, idx){
      var row = document.createElement('div');
      row.className = 'lb-row reveal' + (p.you ? ' you-row' : '');
      row.style.transitionDelay = (idx*0.04)+'s';
      row.innerHTML =
        '<span class="lb-rank">#'+p.rank+'</span>'+
        '<span class="lb-avatar" style="background:linear-gradient(135deg,'+p.ring1+','+p.ring2+')">'+initials(p.name)+'</span>'+
        '<span class="lb-user">'+p.name+(p.you?' <span style="color:var(--blue-neon);font-family:var(--font-ui);font-size:.62rem;letter-spacing:.08em;">(You)</span>':'')+
        '</span>'+
        '<span class="lb-time col-time">'+p.time+'</span>'+
        '<span class="lb-wins col-wins">'+p.wins+'</span>'+
        '<span class="diff-stars col-difficulty">'+starMarkup(p.diff)+'</span>';
      wrap.appendChild(row);
    });
  }

  buildPodium();
  buildRows();

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); }
    });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

})();
