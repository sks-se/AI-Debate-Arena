
(function(){
  'use strict';

  var ACHIEVEMENTS = [
    {
      id:'master-debater', name:'Master Debater',
      desc:'Win 25 debates across any chamber in the Arena.',
      progress:100, unlocked:true,
      icon:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
    },
    {
      id:'logic-lord', name:'Logic Lord',
      desc:'Score above 90 on the Logic metric in a single argument.',
      progress:78, unlocked:false,
      icon:'<path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4M12 8v8M8 12h8"/>'
    },
    {
      id:'persuasion-king', name:'Persuasion King',
      desc:'Land three arguments in a row scoring above 70.',
      progress:100, unlocked:false,
      icon:'<path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z"/>'
    },
    {
      id:'einstein-slayer', name:'Einstein Slayer',
      desc:'Defeat Einstein in the Chamber of the Genius.',
      progress:40, unlocked:false,
      icon:'<circle cx="12" cy="9" r="4"/><path d="M4 20c1.5-5 5-7 8-7s6.5 2 8 7"/>'
    },
    {
      id:'arena-escapee', name:'Arena Escapee',
      desc:'Clear every chamber and step through the final gate.',
      progress:16, unlocked:false,
      icon:'<path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>'
    }
  ];

  var grid = document.getElementById('ach-grid');

  function render(){
    grid.innerHTML = '';
    ACHIEVEMENTS.forEach(function(a, idx){
      var claimable = a.progress >= 100 && !a.unlocked;
      var card = document.createElement('article');
      card.className = 'ach-card reveal ' + (a.unlocked ? 'unlocked' : (claimable ? 'claimable' : 'locked'));
      card.style.transitionDelay = (idx*0.06)+'s';
      card.dataset.id = a.id;

      card.innerHTML =
        '<div class="unlock-burst" aria-hidden="true"></div>'+
        (a.unlocked ? '<div class="checkmark-pop" style="opacity:1;transform:scale(1);"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' : '')+
        '<div class="ach-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+a.icon+'</svg></div>'+
        '<h3 class="ach-name">'+a.name+'</h3>'+
        '<p class="ach-desc">'+a.desc+'</p>'+
        '<div class="ach-progress-row"><span>Progress</span><span>'+a.progress+'%</span></div>'+
        '<div class="ach-track"><div class="ach-fill" data-fill style="width:0%"></div></div>'+
        (a.unlocked
          ? '<div class="ach-status"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlocked</div>'
          : (claimable ? '<button class="claim-btn" data-claim>Claim Achievement</button>' : ''));

      grid.appendChild(card);
    });
    updateSummary();
  }

  function updateSummary(){
    var unlocked = ACHIEVEMENTS.filter(function(a){ return a.unlocked; }).length;
    document.getElementById('summary-text').textContent = unlocked + ' / ' + ACHIEVEMENTS.length + ' Unlocked';
    document.getElementById('summary-fill').style.width = (unlocked/ACHIEVEMENTS.length*100) + '%';
  }

  grid.addEventListener('click', function(e){
    var btn = e.target.closest('[data-claim]');
    if(!btn) return;
    var card = btn.closest('.ach-card');
    var id = card.dataset.id;
    var a = ACHIEVEMENTS.find(function(x){ return x.id === id; });
    if(!a || a.unlocked) return;

    a.unlocked = true;
    card.classList.add('bursting');
    card.classList.remove('claimable');
    setTimeout(function(){
      card.classList.remove('bursting');
      card.classList.add('unlocked');
      btn.remove();
      var status = document.createElement('div');
      status.className = 'ach-status';
      status.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlocked';
      card.appendChild(status);
      var check = document.createElement('div');
      check.className = 'checkmark-pop';
      check.style.opacity = '1'; check.style.transform = 'scale(1)';
      check.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      card.appendChild(check);
      updateSummary();
    }, 750);
  });

  render();

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        var fill = e.target.querySelector('[data-fill]');
        if(fill){
          var pct = fill.parentElement.previousElementSibling ? null : null;
        }
        observer.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

  // fill progress bars shortly after cards mount (separately from IO, so it
  // always plays even if the grid is already in view on load)
  setTimeout(function(){
    document.querySelectorAll('.ach-card').forEach(function(card, idx){
      var a = ACHIEVEMENTS[idx];
      var fill = card.querySelector('[data-fill]');
      if(fill && a){ setTimeout(function(){ fill.style.width = a.progress + '%'; }, idx*80); }
    });
  }, 400);

})();

