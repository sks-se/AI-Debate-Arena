
(function(){
  'use strict';

  function bindSlider(id, valId){
    var el = document.getElementById(id);
    var val = document.getElementById(valId);
    function update(){
      el.style.setProperty('--val', el.value + '%');
      val.textContent = el.value + '%';
    }
    el.addEventListener('input', update);
    update();
  }
  bindSlider('music-vol','music-vol-val');
  bindSlider('sfx-vol','sfx-vol-val');

  document.getElementById('mute-all').addEventListener('change', function(e){
    var muted = e.target.checked;
    ['music-vol','sfx-vol'].forEach(function(id){ document.getElementById(id).disabled = muted; });
  });

  var seg = document.getElementById('difficulty-seg');
  seg.addEventListener('click', function(e){
    var btn = e.target.closest('button');
    if(!btn) return;
    seg.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
  });

  var themeRow = document.getElementById('theme-row');
  themeRow.addEventListener('click', function(e){
    var sw = e.target.closest('.theme-swatch');
    if(!sw) return;
    themeRow.querySelectorAll('.theme-swatch').forEach(function(s){ s.classList.remove('active'); });
    sw.classList.add('active');
  });

  function showToast(text){
    var toast = document.getElementById('save-toast');
    document.getElementById('toast-text').textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function(){ toast.classList.remove('show'); }, 2200);
  }

  document.getElementById('save-account').addEventListener('click', function(){ showToast('Settings saved'); });
  document.getElementById('reset-defaults').addEventListener('click', function(){
    document.getElementById('music-vol').value = 70;
    document.getElementById('sfx-vol').value = 85;
    document.getElementById('mute-all').checked = false;
    document.getElementById('animations-toggle').checked = true;
    document.getElementById('reduce-motion').checked = false;
    document.getElementById('high-contrast').checked = false;
    document.getElementById('larger-text').checked = false;
    document.getElementById('sr-opt').checked = true;
    document.getElementById('language-select').value = 'English';
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.dataset.val==='Easy'); });
    themeRow.querySelectorAll('.theme-swatch').forEach(function(s){ s.classList.toggle('active', s.dataset.theme==='void'); });
    ['music-vol','sfx-vol'].forEach(function(id){
      var el = document.getElementById(id);
      el.disabled = false;
      el.dispatchEvent(new Event('input'));
    });
    showToast('Restored defaults');
  });
  document.getElementById('log-out').addEventListener('click', function(){
    window.location.href = 'index.html';
  });

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); }
    });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

})();
