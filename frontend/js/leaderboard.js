
(function(){
  'use strict';

  var PLAYERS = [
    {rank:1,name:'K. Wyrenth',time:'2:41:08',wins:41,diff:5,ring1:'#ffd88a',ring2:'#d9b46a'},
    {rank:2,name:'M. Osei',time:'2:58:52',wins:37,diff:5,ring1:'#c7d0e0',ring2:'#8b93b3'},
    {rank:3,name:'R. Kessler',time:'3:12:19',wins:33,diff:4,ring1:'#e0a978',ring2:'#c98a52'},
    {rank:4,name:'J. Lindqvist',time:'3:24:47',wins:30,diff:4,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:5,name:'A. Petrova',time:'3:31:02',wins:28,diff:4,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:6,name:'D. Nakamura',time:'3:45:15',wins:26,diff:3,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:7,name:'S. Achebe',time:'3:52:39',wins:24,diff:3,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:8,name:'L. Moreau',time:'4:03:11',wins:22,diff:3,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:9,name:'T. Yilmaz',time:'4:15:58',wins:19,diff:2,ring1:'#4fd8ff',ring2:'#a855f7'},
    {rank:10,name:'O. Fenwick',time:'4:29:04',wins:17,diff:2,ring1:'#4fd8ff',ring2:'#a855f7'}
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
      row.className = 'lb-row reveal';
      row.style.transitionDelay = (idx*0.04)+'s';
      row.innerHTML =
        '<span class="lb-rank">#'+p.rank+'</span>'+
        '<span class="lb-avatar" style="background:linear-gradient(135deg,'+p.ring1+','+p.ring2+')">'+initials(p.name)+'</span>'+
        '<span class="lb-user">'+p.name+'</span>'+
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
