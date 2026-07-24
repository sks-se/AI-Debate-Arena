
(function(){
  'use strict';

  /* =========================================================================
     OPPONENT DATA — six thinkers from the Arena roster. Switching opponents
     resets the local debate state (resolve, mood, chat) for a fresh demo.
     ========================================================================= */
  var OPPONENTS = [

{
    id: "adi_shankaracharya",
    name: "Adi Shankaracharya",
    role: "The Philosopher",
    accent: "#4fd8ff",
    difficulty: 3,

    ability: {
        name: "Advaita Insight",
        desc: "Expose contradictions by questioning assumptions."
    },

    hint: "Question assumptions before conclusions.",

    laugh: "Truth is not defeated by noise."
},

{
    id: "chanakya",
    name: "Chanakya",
    role: "The Strategist",
    accent: "#ff785a",
    difficulty: 4,

    ability: {
        name: "Master Strategy",
        desc: "Turn the opponent's strongest argument into their greatest weakness."
    },

    hint: "Emotion loses where strategy begins.",

    laugh: "Victory is earned long before the debate begins."
},

{
    id: "shivaji_maharaj",
    name: "Chhatrapati Shivaji Maharaj",
    role: "The Leader",
    accent: "#f5b041",
    difficulty: 4,

    ability: {
        name: "Swarajya Resolve",
        desc: "Break weak leadership arguments with courage and responsibility."
    },

    hint: "A leader protects people before protecting pride.",

    laugh: "Strength without righteousness never lasts."
},

{
    id: "srinivasa_ramanujan",
    name: "Srinivasa Ramanujan",
    role: "The Analytical Genius",
    accent: "#6dd5fa",
    difficulty: 4,

    ability: {
        name: "Infinite Pattern",
        desc: "Reveal hidden flaws through logic and mathematical reasoning."
    },

    hint: "Every conclusion should follow from evidence.",

    laugh: "Numbers rarely agree with unsupported claims."
},

{
    id: "razia_sultan",
    name: "Razia Sultana",
    role: "The Sovereign",
    accent: "#b565f2",
    difficulty: 4,

    ability: {
        name: "Royal Judgment",
        desc: "Challenge arguments lacking justice, balance, and fairness."
    },

    hint: "Justice is stronger than authority.",

    laugh: "A throne is earned through wisdom, not words."
},

{
    id: "apj_abdul_kalam",
    name: "Dr. A.P.J. Abdul Kalam",
    role: "The Visionary",
    accent: "#5dade2",
    difficulty: 3,

    ability: {
        name: "Ignited Minds",
        desc: "Transform criticism into innovation and opportunity."
    },

    hint: "Dreams require knowledge, effort, and action.",

    laugh: "Every failure is simply another lesson toward success."
}

];

  var state = {
    opponentIndex:0,
    hp:100,
    mood:'Composed',
    abilityCooldown:0,
    abilityMaxCooldown:18,
    timerSeconds: 9*60+42,
    level:7, xp:1240, xpMax:2000, coins:312, escape:34,
    clarity:82,
    lives:3, livesMax:3,
    lineCursor:0,
    busy:false
  };

  var els = {
    switcher: document.getElementById('opp-switcher'),
    opName: document.getElementById('opp-name'),
    opRole: document.getElementById('opp-role'),
    opDiff: document.getElementById('opp-diff'),
    hpFill: document.getElementById('hp-fill'),
    hpText: document.getElementById('hp-text'),
    moodWord: document.getElementById('mood-word'),
    abilityBtn: document.getElementById('ability-btn'),
    abilityCdText: document.getElementById('ability-cd-text'),
    abilityName: document.getElementById('ability-name'),
    abilityDesc: document.getElementById('ability-desc'),
    hintText: document.getElementById('hint-text'),
    chatScroll: document.getElementById('chat-scroll'),
    chatInput: document.getElementById('chat-input'),
    sendBtn: document.getElementById('send-btn'),
    micBtn: document.getElementById('mic-btn'),
    hintBtn: document.getElementById('hint-btn'),
    hintPop: document.getElementById('hint-pop'),
    invBtn: document.getElementById('inv-btn'),
    invPop: document.getElementById('inv-pop'),
    clarityFill: document.getElementById('clarity-fill'),
    xpFill: document.getElementById('xp-fill'),
    xpText: document.getElementById('xp-text'),
    escapeFill: document.getElementById('escape-fill'),
    escapeText: document.getElementById('escape-text'),
    coins: document.getElementById('stat-coins'),
    level: document.getElementById('stat-level'),
    timerText: document.getElementById('timer-text'),
    timerWrap: document.getElementById('hud-timer'),
    bustSvg: document.getElementById('bust-svg'),
    shell: document.querySelector('.shell'),

    scoringOverlay: document.getElementById('scoring-overlay'),
    scoringCard: document.getElementById('scoring-card'),
    overallRing: document.getElementById('overall-ring'),
    overallNum: document.getElementById('overall-num'),
    overallTag: document.getElementById('overall-tag'),

    victoryOverlay: document.getElementById('victory-overlay'),
    achievementName: document.getElementById('achievement-name'),
    victoryXp: document.getElementById('victory-xp'),
    victoryCoins: document.getElementById('victory-coins'),
    victoryNextName: document.getElementById('victory-next-name'),
    victoryContinue: document.getElementById('victory-continue'),
    confettiField: document.getElementById('confetti-field'),

    defeatOverlay: document.getElementById('defeat-overlay'),
    defeatLaugh: document.getElementById('defeat-laugh'),
    livesHearts: document.getElementById('lives-hearts'),
    defeatRetry: document.getElementById('defeat-retry'),
    defeatHint: document.getElementById('defeat-hint'),
    defeatExit: document.getElementById('defeat-exit')
  };

  /* =========================================================================
     OPPONENT SWITCHER — builds the chip strip and handles selection
     ========================================================================= */
  function buildSwitcher(){
    els.switcher.innerHTML = '';
    OPPONENTS.forEach(function(op, i){
      var btn = document.createElement('button');
      btn.className = 'opp-chip' + (i === state.opponentIndex ? ' active' : '');
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected', i === state.opponentIndex ? 'true':'false');
      btn.setAttribute('aria-label', op.name);
      btn.style.setProperty('--accent', op.accent);
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="'+op.accent+'" stroke-width="2"><circle cx="12" cy="9" r="4"/><path d="M4 20c1.5-5 5-7 8-7s6.5 2 8 7"/></svg>';
      btn.addEventListener('click', function(){ selectOpponent(i); });
      els.switcher.appendChild(btn);
    });
  }

  function selectOpponent(i){
    state.opponentIndex = i;
    state.hp = 100;
    state.clarity = 82;
    state.mood = 'Composed';
    state.lineCursor = 0;
    state.busy = false;
    setControlsDisabled(false);
    var op = OPPONENTS[i];
    document.documentElement.style.setProperty('--accent', op.accent);
    document.documentElement.style.setProperty('--accent-soft', hexToRgba(op.accent, .35));
    els.opName.textContent = op.name;
    els.opRole.textContent = op.role;
    els.abilityName.textContent = op.ability.name;
    els.abilityDesc.textContent = op.ability.desc;
    els.abilityBtn.setAttribute('aria-label', 'Use special ability: '+op.ability.name);
    els.hintText.textContent = op.hint;
    els.clarityFill.style.width = state.clarity + '%';
    renderDifficulty(op.difficulty);
    renderHP();
    renderMood();
    Array.prototype.forEach.call(els.switcher.children, function(chip, idx){
      chip.classList.toggle('active', idx === i);
      chip.setAttribute('aria-selected', idx === i ? 'true':'false');
    });
    els.chatScroll.innerHTML = '';
    loadIntroduction(op);
    // have to remove -> appendMessage('ai', op.name, greetingFor(op));
  }
// Intro Function
  async function loadIntroduction(op) {

    showThinking(async function () {

        try {

            const response = await fetch("http://127.0.0.1:8000/intro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    character: op.id
                })
            });

            if (!response.ok) {
                throw new Error("Failed to load introduction.");
            }

            const data = await response.json();
              //currentTopic = data.topic;
            hideThinking();

            appendMessage(
                "ai",
                op.name,
                data.intro,
                true
            );

        } catch (err) {

            hideThinking();

            console.error(err);

            appendMessage(
                "ai",
                "System",
                "Unable to start the debate."
            );
        }

    });

}
  // function greetingFor(op){
  //   return 'The chamber seals behind you. ' + op.name + ' turns to face you. "Speak your first argument, and let us begin."';
  // }

  function hexToRgba(hex, alpha){
    var c = hex.replace('#','');
    var r = parseInt(c.substring(0,2),16), g = parseInt(c.substring(2,4),16), b = parseInt(c.substring(4,6),16);
    return 'rgba('+r+','+g+','+b+','+alpha+')';
  }

  function renderDifficulty(level){
    els.opDiff.innerHTML = '';
    els.opDiff.setAttribute('aria-label','Difficulty '+level+' out of 5');
    for(var i=1;i<=5;i++){
      var star = document.createElement('i');
      if(i <= level) star.classList.add('filled');
      els.opDiff.appendChild(star);
    }
  }

  /* =========================================================================
     RESOLVE (HP) / MOOD RENDERING
     ========================================================================= */
  function renderHP(){
    els.hpFill.style.width = state.hp + '%';
    els.hpText.textContent = Math.max(0, Math.round(state.hp)) + '%';
    els.hpFill.classList.remove('mid','low');
    if(state.hp <= 30) els.hpFill.classList.add('low');
    else if(state.hp <= 65) els.hpFill.classList.add('mid');
  }

  function renderMood(){
    els.moodWord.textContent = state.mood;
  }

  function updateMoodFromHP(){
    if(state.hp > 75) state.mood = 'Composed';
    else if(state.hp > 45) state.mood = 'Guarded';
    else if(state.hp > 20) state.mood = 'Irritated';
    else if(state.hp > 0) state.mood = 'Cornered';
    else state.mood = 'Defeated';
    renderMood();
  }

  function renderLives(){
    els.livesHearts.innerHTML = '';
    els.livesHearts.setAttribute('aria-label', state.lives + ' lives remaining');
    for(var i=0;i<state.livesMax;i++){
      var filled = i < state.lives;
      var svg = '<svg viewBox="0 0 24 24" class="'+(filled?'filled':'lost')+'" aria-hidden="true"><path d="M12 21s-7-4.35-10-9.28C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 18 11.72 15 16.65 12 21 12 21z"/></svg>';
      els.livesHearts.insertAdjacentHTML('beforeend', svg);
    }
  }

  /* =========================================================================
     CHAT
     ========================================================================= */
  function appendMessage(who, label, text, streaming){
    var wrap = document.createElement('div');
    wrap.className = 'msg ' + (who === 'ai' ? 'ai' : 'player');

    var meta = document.createElement('div');
    meta.className = 'msg-meta';
    meta.textContent = label;

    var bubble = document.createElement('div');
    bubble.className = 'bubble';

    wrap.appendChild(meta);
    wrap.appendChild(bubble);
    els.chatScroll.appendChild(wrap);
    scrollChatToBottom();

    if(streaming){
      streamText(bubble, text);
    } else {
      bubble.textContent = text;
    }
    return bubble;
  }

  function streamText(bubble, text){
    var caret = document.createElement('span');
    caret.className = 'caret';
    var i = 0;
    function tick(){
      bubble.textContent = text.slice(0, i);
      bubble.appendChild(caret);
      scrollChatToBottom();
      i++;
      if(i <= text.length){
        setTimeout(tick, 16 + Math.random()*22);
      } else {
        caret.remove();
        state.busy = false;
        setControlsDisabled(false);
        els.chatInput.focus();
      }
    }
    tick();
  }

  /* =========================================================================
     AI "THINKING" SEQUENCE — replaces plain dots with cycling status lines
     ========================================================================= */
  var AI_THINKING_LINES = [
    'Analyzing Argument...',
    'Searching Historical Knowledge...',
    'Constructing Counterargument...',
    'Evaluating Logic...',
    'Generating Response...'
  ];

  function showThinking(onDone){
    var row = document.createElement('div');
    row.className = 'msg ai';
    row.id = 'typing-row';
    row.innerHTML =
      '<div class="msg-meta">' + OPPONENTS[state.opponentIndex].name + '</div>' +
      '<div class="thinking-card"><span class="thinking-spinner" aria-hidden="true"></span>' +
      '<span class="thinking-text" id="thinking-text"></span></div>';
    els.chatScroll.appendChild(row);
    scrollChatToBottom();

    var i = 0;
    function next(){
      var span = document.getElementById('thinking-text');
      if(!span){ if(onDone) onDone(); return; }
      if(i >= AI_THINKING_LINES.length){ if(onDone) onDone(); return; }
      var p = document.createElement('span');
      p.className = 'tphrase';
      p.textContent = AI_THINKING_LINES[i];
      span.innerHTML = '';
      span.appendChild(p);
      scrollChatToBottom();
      i++;
      setTimeout(next, 380);
    }
    next();
  }
  function hideThinking(){
    var row = document.getElementById('typing-row');
    if(row) row.remove();
  }

  function scrollChatToBottom(){
    els.chatScroll.scrollTop = els.chatScroll.scrollHeight;
  }

  function setControlsDisabled(disabled){
    els.sendBtn.disabled = disabled;
    els.chatInput.disabled = disabled;
  }

  /* =========================================================================
     DEBATE SCORING ANIMATION — Logic / Evidence / Creativity / Persuasion /
     Confidence, each an animated bar, feeding into an Overall Score ring.
     Score > 70 counts as a landed argument (more damage); otherwise it
     falters (little/no damage, and it costs the player some Clarity).
     ========================================================================= */
  // function scoreArgument(text){
  //   var len = text.trim().length;
  //   var base = 42 + Math.min(34, len * 0.35);
  //   function metric(){ return Math.max(12, Math.min(98, Math.round(base + (Math.random()*32 - 16)))); }
  //   var scores = {
  //     Logic: metric(), Evidence: metric(), Creativity: metric(),
  //     Persuasion: metric(), Confidence: metric()
  //   };
  //   var overall = Math.round((scores.Logic + scores.Evidence + scores.Creativity + scores.Persuasion + scores.Confidence) / 5);
  //   return { scores: scores, overall: overall };
  // }

  function resetScoringUI(){
    var rows = els.scoringCard.querySelectorAll('.score-row');
    rows.forEach(function(r){
      var fill = r.querySelector('[data-fill]');
      var val = r.querySelector('[data-val]');
      fill.style.width = '0%';
      fill.classList.remove('mid','low');
      val.textContent = '0';
    });
    els.overallRing.style.setProperty('--pct', 0);
    els.overallNum.textContent = '0';
    els.overallTag.classList.remove('show','win','lose');
  }

  function animateScoreRow(rowEl, value){
    if(!rowEl) return;
    var fill = rowEl.querySelector('[data-fill]');
    var val = rowEl.querySelector('[data-val]');
    fill.classList.remove('mid','low');
    if(value < 50) fill.classList.add('low');
    else if(value < 75) fill.classList.add('mid');
    fill.style.width = value + '%';
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/500, 1);
      val.textContent = Math.round(value * p);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateOverall(value, done){
    els.overallRing.style.setProperty('--score-color', value > 70 ? 'var(--ok)' : 'var(--danger)');
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/700, 1);
      var cur = Math.round(value * p);
      els.overallNum.textContent = cur;
      els.overallRing.style.setProperty('--pct', cur);
      if(p < 1) requestAnimationFrame(step);
      else if(done) done();
    }
    requestAnimationFrame(step);
  }

 function runScoring(judge, callback) {

    resetScoringUI();

    els.scoringOverlay.classList.add("show");

    const metrics = [
        {
            name: "Logic",
            value: Math.round(judge.logic * 10)
        },
        {
            name: "Evidence",
            value: Math.round(judge.evidence * 10)
        },
        {
            name: "Relevance",
            value: Math.round(judge.relevance * 10)
        },
        {
            name: "Persuasion",
            value: Math.round(judge.persuasiveness * 10)
        },
        {
            name: "Confidence",
            value: Math.round(judge.clarity * 10)
        }
    ];

    metrics.forEach((metric, index) => {

        const row = els.scoringCard.querySelector(
            `.score-row[data-metric="${metric.name}"]`
        );

        setTimeout(() => {

            animateScoreRow(
                row,
                metric.value
            );

        }, 300 + (index * 250));

    });

    setTimeout(() => {

        animateOverall(

            Math.round(judge.overall * 10),

            function () {

                els.overallTag.textContent =
                    judge.winner === "player"
                        ? "Argument Wins"
                        : "Argument Loses";

                els.overallTag.classList.remove("win", "lose");

                els.overallTag.classList.add(
                    "show",
                    judge.winner === "player"
                        ? "win"
                        : "lose"
                );

                setTimeout(function () {

                    els.scoringOverlay.classList.remove("show");

                    if (typeof callback === "function") {
                        callback();
                    }

                }, 1000);

            }

        );

    }, 1700);

}

  /* =========================================================================
     SEND / RESPONSE FLOW
     ========================================================================= */
  function sendMessage() {

    const text = els.chatInput.value.trim();

    if (!text || state.busy || state.hp <= 0) return;

    appendMessage("player", "You", text, false);
    els.chatInput.value = "";

    state.busy = true;
    setControlsDisabled(true);

    showThinking(async function () {

        const op = OPPONENTS[state.opponentIndex];

        try {

            const response = await fetch("http://127.0.0.1:8000/debate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    character: op.id,
                    //topic: currentTopic,
                    message: text
                })
            });

            if (!response.ok) {
                throw new Error("Unable to contact backend.");
            }

            const data = await response.json();

            hideThinking();

            appendMessage(
                "ai",
                op.name,
                data.reply,
                true
            );

            runScoring(data.judge, function () {

                applyDamage(data.judge.damage);

                bumpXP(data.judge.xp);

                state.busy = false;
                setControlsDisabled(false);

                if (state.hp <= 0) {
                    return;
                }

                els.chatInput.focus();

            });

        }

        catch (err) {

            hideThinking();

            console.error(err);

            appendMessage(
                "ai",
                "System",
                err.message
            );

            state.busy = false;
            setControlsDisabled(false);
        }

    });

}

  function applyDamage(amount){
    state.hp = Math.max(0, state.hp - amount);
    renderHP();
    updateMoodFromHP();
    bumpEscape(amount * 0.35);
    if(state.hp <= 0){
      setTimeout(runVictorySequence, 700);
    }
  }

  function bumpXP(amount){
    state.xp = Math.min(state.xpMax, state.xp + amount);
    els.xpFill.style.width = (state.xp/state.xpMax*100) + '%';
    els.xpText.textContent = state.xp.toLocaleString() + ' / ' + state.xpMax.toLocaleString();
    state.coins += Math.round(amount/5);
    els.coins.textContent = state.coins.toLocaleString();
  }

  function bumpEscape(amount){
    state.escape = Math.min(100, state.escape + amount);
    els.escapeFill.style.width = state.escape + '%';
    els.escapeText.textContent = Math.round(state.escape) + '%';
  }

  function animateCounterTo(el, target, prefix){
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/1000, 1);
      el.textContent = (prefix||'') + Math.round(target*p);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================================
     FULL-SCREEN VICTORY — shake, golden light, confetti, portal, rewards
     ========================================================================= */
  function spawnConfetti(){
    els.confettiField.innerHTML = '';
    var colors = ['#ffd88a','#4fd8ff','#a855f7','#fff7e0','#d9b46a'];
    for(var i=0;i<44;i++){
      var bit = document.createElement('span');
      bit.className = 'confetti-bit';
      bit.style.left = (Math.random()*100) + '%';
      bit.style.background = colors[Math.floor(Math.random()*colors.length)];
      var dur = 2.2 + Math.random()*1.8;
      bit.style.animationDuration = dur + 's';
      bit.style.animationDelay = (Math.random()*0.7) + 's';
      bit.style.transform = 'rotate(' + Math.floor(Math.random()*360) + 'deg)';
      els.confettiField.appendChild(bit);
    }
  }

  function runVictorySequence(){
    state.busy = true;
    setControlsDisabled(true);
    els.shell.classList.add('shake');
    setTimeout(function(){
      els.shell.classList.remove('shake');
      var op = OPPONENTS[state.opponentIndex];
      var nextOp = OPPONENTS[(state.opponentIndex+1) % OPPONENTS.length];
      var xpGain = 220 + Math.round(Math.random()*80);
      var coinGain = 60 + Math.round(Math.random()*40);

      els.achievementName.textContent = op.role;
      els.victoryNextName.textContent = nextOp.name;
      els.victoryXp.textContent = '+0';
      els.victoryCoins.textContent = '+0';

      spawnConfetti();
      els.victoryOverlay.classList.add('show');
      bumpXP(xpGain);
      setTimeout(function(){
        animateCounterTo(els.victoryXp, xpGain, '+');
        animateCounterTo(els.victoryCoins, coinGain, '+');
      }, 700);
    }, 650);
  }

  els.victoryContinue.addEventListener('click', function(){
    els.victoryOverlay.classList.remove('show');
    els.confettiField.innerHTML = '';
    selectOpponent((state.opponentIndex + 1) % OPPONENTS.length);
  });

  /* =========================================================================
     FULL-SCREEN DEFEAT — dark, cracked arena, taunting AI, lives, actions
     ========================================================================= */
  function triggerDefeat(){
    state.lives = Math.max(0, state.lives - 1);
    renderLives();
    var op = OPPONENTS[state.opponentIndex];
    els.defeatLaugh.textContent = op.laugh;
    els.defeatRetry.style.display = state.lives <= 0 ? 'none' : 'inline-flex';
    state.busy = true;
    setControlsDisabled(true);
    els.defeatOverlay.classList.add('show');
  }

  function resetCurrentChamber(){
    state.hp = 100;
    state.clarity = 60;
    state.busy = false;
    setControlsDisabled(false);
    renderHP();
    updateMoodFromHP();
    els.clarityFill.style.width = state.clarity + '%';
  }

  els.defeatRetry.addEventListener('click', function(){
    els.defeatOverlay.classList.remove('show');
    resetCurrentChamber();
  });
  els.defeatHint.addEventListener('click', function(){
    els.defeatOverlay.classList.remove('show');
    resetCurrentChamber();
    setTimeout(function(){ togglePop(els.hintPop, els.hintBtn, els.invPop, els.invBtn); }, 450);
  });
  els.defeatExit.addEventListener('click', function(){
    window.location.href = 'index.html';
  });

  /* =========================================================================
     SPECIAL ABILITY (cooldown ring driven by rAF)
     ========================================================================= */
  function useAbility(){
    if(state.abilityCooldown > 0 || state.busy || state.hp <= 0) return;
    applyDamage(16 + Math.random()*8);
    var op = OPPONENTS[state.opponentIndex];
    appendMessage('player', 'You', '[Special] ' + op.ability.name + ' — you expose the flaw in their reasoning.', false);
    bumpXP(20);
    state.abilityCooldown = state.abilityMaxCooldown;
    els.abilityBtn.disabled = true;
    tickCooldown();
  }
  function tickCooldown(){
    if(state.abilityCooldown <= 0){
      els.abilityBtn.disabled = false;
      els.abilityBtn.style.setProperty('--cd', 0);
      return;
    }
    var pct = 100 - (state.abilityCooldown/state.abilityMaxCooldown*100);
    els.abilityBtn.style.setProperty('--cd', pct);
    els.abilityCdText.textContent = Math.ceil(state.abilityCooldown) + 's';
    state.abilityCooldown -= 0.25;
    setTimeout(tickCooldown, 250);
  }

  /* =========================================================================
     HINT / INVENTORY POPOVERS
     ========================================================================= */
  function togglePop(pop, btn, otherPop, otherBtn){
    var open = pop.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true':'false');
    if(open){
      otherPop.classList.remove('open');
      otherBtn.setAttribute('aria-expanded','false');
    }
  }
  els.hintBtn.addEventListener('click', function(){ togglePop(els.hintPop, els.hintBtn, els.invPop, els.invBtn); });
  els.invBtn.addEventListener('click', function(){ togglePop(els.invPop, els.invBtn, els.hintPop, els.hintBtn); });
  document.addEventListener('click', function(e){
    if(!els.hintPop.contains(e.target) && e.target !== els.hintBtn && !els.hintBtn.contains(e.target)){
      els.hintPop.classList.remove('open'); els.hintBtn.setAttribute('aria-expanded','false');
    }
    if(!els.invPop.contains(e.target) && e.target !== els.invBtn && !els.invBtn.contains(e.target)){
      els.invPop.classList.remove('open'); els.invBtn.setAttribute('aria-expanded','false');
    }
  });

  /* =========================================================================
     MIC (decorative voice-input simulation)
     ========================================================================= */
  var demoPhrases = [
    "If your logic held, it would apply even when it's inconvenient for you.",
    "You're defending the conclusion, not the reasoning that leads to it.",
    "That's an assumption dressed up as evidence.",
    "I'll grant the premise — but the conclusion doesn't follow from it."
  ];
  els.micBtn.addEventListener('click', function(){
    if(state.busy) return;
    var listening = els.micBtn.classList.toggle('active');
    els.micBtn.setAttribute('aria-pressed', listening ? 'true':'false');
    if(listening){
      els.chatInput.placeholder = 'Listening…';
      setTimeout(function(){
        if(!els.micBtn.classList.contains('active')) return;
        els.chatInput.value = demoPhrases[Math.floor(Math.random()*demoPhrases.length)];
        els.micBtn.classList.remove('active');
        els.micBtn.setAttribute('aria-pressed','false');
        els.chatInput.placeholder = 'Present your argument…';
        els.chatInput.focus();
      }, 1500);
    } else {
      els.chatInput.placeholder = 'Present your argument…';
    }
  });

  /* =========================================================================
     TIMER
     ========================================================================= */
  function tickTimer(){
    if(state.timerSeconds > 0){ state.timerSeconds--; }
    var m = Math.floor(state.timerSeconds/60);
    var s = state.timerSeconds%60;
    els.timerText.textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    els.timerWrap.classList.toggle('low', state.timerSeconds <= 60);
  }
  setInterval(tickTimer, 1000);

  /* =========================================================================
     EVENTS
     ========================================================================= */
  els.sendBtn.addEventListener('click', sendMessage);
  els.chatInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ sendMessage(); }
  });
  els.abilityBtn.addEventListener('click', useAbility);

  /* =========================================================================
     INIT
     ========================================================================= */
  buildSwitcher();
  renderLives();
  selectOpponent(0);
  els.xpFill.style.width = (state.xp/state.xpMax*100)+'%';
  els.xpText.textContent = state.xp.toLocaleString()+' / '+state.xpMax.toLocaleString();
  els.escapeFill.style.width = state.escape+'%';
  els.escapeText.textContent = state.escape+'%';

})();
