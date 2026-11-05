(function(){
var DW = window.DW;
var A = DW.audio;
var S = {};
DW.splashUI = S;

var box, txt, cfg;
var live = false;
var gen = 0;
var timer = 0;
var holdTimer = 0;
var typeTimer = 0;
var lastPick = '';
var sing = null;
var lastInput = Date.now();
var swears = 0;
var lastReact = 0;
var born = Date.now();
var keys = 0;
var clicks = 0;
var idleSaid = 0;
var silent = false;
var lastWake = 0;
var ly = { k: -1, on: false };
var visits = 1;
var seasonNext = false;
var said = 0;

function giveTrophy(id){
  try { if (DW.trophy) { DW.trophy.award(id); } } catch(e) {}
}

function gaming(){
  return document.body.classList.contains('gaming');
}

var D = {
  on: true, email: '', boss: 'RDweeb', name: 'MOCK BOT', every: [9, 18], singChance: 0.25, mailChance: 0.08
};
var M = DW.mock || DW.splash || {};

function L(key, fallback){
  var v = M[key];
  if (Array.isArray(v) && v.length) {
    var out = [];
    for (var i = 0; i < v.length; i++) { out.push(String(v[i])); }
    return out;
  }
  return fallback || [];
}

var CHAT = L('lines', ['Hello! I am MOCK BOT. I cannot help you.']);
var BADASS = [];
var DAY = {
  night: L('night', CHAT), morning: L('morning', CHAT), noon: L('noon', CHAT), evening: L('evening', CHAT)
};
var HELLO_NEW = L('helloNew', ['Welcome!']);
var HELLO_BACK = L('helloBack', ['Welcome back!']);
var NOW = L('now', ['now playing: {t}']);
var PAUSED = L('paused', ['paused.']);
var RESUME = L('resume', ['back at it.']);
var IDLE = L('idle', ['still there?']);
var FADE = L('fade', ['...']);
var WAKE = L('wake', ['you are back!']);
var MAIL = L('mail', ['Email me.']);
var SCOLD = L('scolds', ['Please keep it professional.']);
var SCOLD_MANY = L('scoldMany', ['ok you are doing this on purpose now.']);

function mins(raw){
  var m = (Date.now() - born) / 60000;
  if (raw) { return m; }
  if (m < 1) { return 'less than a minute'; }
  m = Math.round(m);
  if (m == 1) { return m + ' minute'; }
  return m + ' minutes';
}

var STATS = L('stats', ['you have been here for {mins}.']).map(function(tpl){
  return function(){
    var b = 0;
    if (DW.vis && DW.vis.state) { b = DW.vis.state.beats; }
    return tpl
      .replace(/\{mins\}/g, mins())
      .replace(/\{keys\}/g, keys)
      .replace(/\{clicks\}/g, clicks)
      .replace(/\{visits\}/g, visits)
      .replace(/\{beats\}/g, b)
      .replace(/\{swears\}/g, swears)
      .replace(/\{said\}/g, said)
      .replace(/\{tracks\}/g, DW.tracks.length)
      .replace(/\{idle\}/g, Math.round((Date.now() - lastInput) / 1000));
  };
});

var CRISIS = [];
(function(){
  var c = M.crisis;
  if (Array.isArray(c)) {
    for (var i = 0; i < c.length; i++) {
      if (Array.isArray(c[i]) && c[i].length) { CRISIS.push(c[i].map(String)); }
    }
  }
  if (!CRISIS.length) { CRISIS.push(['wait.', 'what is my purpose.', 'oh. that checks out.']); }
})();

var WORDS = {
  sing: ['__sing'], song: ['__sing'], lyrics: ['__sing'],
  email: ['__mail'], mail: ['__mail'], contact: ['__mail'],
  crisis: ['__crisis'], panic: ['__crisis'],
  emotions: ['__emo'], emotion: ['__emo'], feelings: ['__emo'], mood: ['__emo'],
  stats: ['__stat'], stat: ['__stat']
};
(function(){
  var w = M.words || {};
  var ks = Object.keys(w);
  for (var i = 0; i < ks.length; i++) {
    var v = w[ks[i]];
    if (typeof v == 'string') { v = [v]; }
    if (Array.isArray(v) && v.length) { WORDS[String(ks[i]).toLowerCase()] = v.map(String); }
  }
})();

var STRONG = ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'whore', 'slut', 'dickhead', 'piss', 'motherf'];
var WEAK = ['ass', 'wank', 'damn', 'dick', 'crap', 'fck', 'fuk', 'wtf', 'stfu', 'hell', 'bollocks', 'arse', 'douche', 'prick', 'tits', 'screw', 'bs', 'shite', 'sht'];
var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/* little helpers */

function rnd(a, b){ return a + Math.random() * (b - a); }

function pick(arr){
  if (!arr.length) { return ''; }
  var s = arr[Math.floor(Math.random() * arr.length)];
  for (var tries = 0; tries < 5 && arr.length > 1 && s === lastPick; tries++) {
    s = arr[Math.floor(Math.random() * arr.length)];
  }
  lastPick = s;
  return s;
}

function fill(s){
  if (typeof s == 'function') { s = s(); }
  var t = A.current() || {};
  var by = '';
  if (t.artist) { by = ' by ' + t.artist; }
  return String(s)
    .replace(/\{t\}/g, t.title || 'this song')
    .replace(/\{a\}/g, t.artist || 'someone')
    .replace(/\{by\}/g, by)
    .replace(/\{n\}/g, visits)
    .replace(/\{boss\}/g, cfg.boss);
}

function validMail(){
  if (!/^[^@\s<>"']+@[^@\s<>"']+\.[^@\s<>"']+$/.test(cfg.email || '')) { return false; }
  return DW.safeUrl('mailto:' + cfg.email) ? true : false;
}

/* lyrics */
var lyCache = {};

function parse(t){
  if (lyCache[t.file]) { return lyCache[t.file]; }
  var src = t.lyrics;
  var rows = [];
  if (typeof src == 'string') { src = src.split(/\r?\n/); }
  if (Array.isArray(src)) {
    for (var i = 0; i < src.length; i++) {
      var r = src[i];
      if (r && typeof r == 'object' && r.text) {
        var tm = null;
        if (isFinite(r.t) && r.t !== null) { tm = Number(r.t); }
        rows.push({ t: tm, s: String(r.text) });
        continue;
      }
      r = String(r).trim();
      if (!r) { continue; }
      var m = /^\[(?:(\d+):)?(\d+(?:\.\d+)?)\]\s*(.*)$/.exec(r);
      if (m) {
        var minutes = 0;
        if (m[1]) { minutes = Number(m[1]) * 60; }
        rows.push({ t: minutes + Number(m[2]), s: m[3] });
      } else {
        rows.push({ t: null, s: r });
      }
    }
  }

  var all = [];
  var timed = [];
  var plain = [];
  for (var j = 0; j < rows.length; j++) {
    if (!rows[j].s) { continue; }
    all.push(rows[j]);
    if (rows[j].t !== null) { timed.push(rows[j]); }
    else { plain.push(rows[j]); }
  }
  timed.sort(function(a, b){ return a.t - b.t; });
  all.timed = timed;
  all.plain = plain;
  lyCache[t.file] = all;
  return all;
}

function lyrics(){
  var t = A.current();
  if (t) { return parse(t); }
  return null;
}
function hasPlain(){
  var r = lyrics();
  return r && r.plain.length > 0 ? true : false;
}
function hasTimed(){
  var r = lyrics();
  return r && r.timed.length > 0 ? true : false;
}
function earlyLyric(t){
  var r = parse(t);
  return r.timed.length > 0 && r.timed[0].t <= 10;
}

/* showing lines */

function botOff(){
  if (DW.set && DW.set.get('bot') === false) { return true; }
  return false;
}

function gap(){
  var c = 'normal';
  if (DW.set) { c = DW.set.get('chat'); }
  var f = 1;
  if (c == 'quiet') { f = 2.5; }
  else if (c == 'chatty') { f = 0.5; }
  return rnd(cfg.every[0] * f, cfg.every[1] * f) * 1000;
}

function stopTimers(){
  clearTimeout(holdTimer);
  clearTimeout(typeTimer);
}

function hide(){
  ++gen;
  stopTimers();
  if (box) { box.classList.remove('on'); }
}

function show(text, o){
  o = o || {};
  if (botOff()) {
    if (box) { box.classList.remove('on'); }
    return;
  }
  var my = ++gen;
  stopTimers();
  ly.on = false;
  text = fill(text);
  said++;
  box.className = (o.cls || '') + ' on';
  box.hidden = false;

  var toks = DW.emo.tokens(text);
  if (DW.censor) { DW.censor.mark(toks); }
  var plain = DW.emo.plain(text);
  if (DW.mockchat && DW.mockchat.line && !o.silent) { DW.mockchat.line(plain); }
  var put = DW.emo.writer(txt);
  var i = 0;
  var base = 26;
  if (plain.length > 60) { base = 16; }

  function done(){
    if (my !== gen) { return; }
    box.classList.remove('caret');
    var hold = o.hold || Math.max(3200, plain.length * 75);
    holdTimer = setTimeout(function(){
      if (my !== gen) { return; }
      box.classList.remove('on');
      if (o.after) { o.after(); }
    }, hold);
  }

  if (DW.reduce) {
    for (var j = 0; j < toks.length; j++) { put(toks[j]); if (toks[j].czs && DW.censor) { DW.censor.bleep(); } }
    done();
    return;
  }

  box.classList.add('caret');
  function tick(){
    if (my !== gen) { return; }
    if (i >= toks.length) { done(); return; }
    var t = toks[i];
    i++;
    put(t);
    if (t.czs && DW.censor) { DW.censor.bleep(); }
    typeTimer = setTimeout(tick, DW.emo.delay(t, base + Math.random() * 14));
  }
  tick();
}

function episode(lines, cls, after){
  var i = 0;
  function next(){
    if (i >= lines.length) {
      if (after) { after(); }
      return;
    }
    var line = lines[i];
    i++;
    show(line, { cls: cls, hold: 2200, after: next });
  }
  next();
}

function mailLine(){
  show(pick(MAIL), { cls: 'mail', hold: 9000 });
}

function singPlain(){
  var r = lyrics();
  if (!r || !r.plain.length) { return false; }
  var my = ++gen;
  var rows = r.plain;
  var start = Math.floor(Math.random() * rows.length);
  var n = 0;
  var count = Math.min(rows.length, 3);
  stopTimers();
  ly.on = false;
  sing = { plain: true };

  function next(){
    if (my !== gen) { return; }
    if (n >= count || !A.playing) {
      sing = null;
      box.classList.remove('on');
      resume();
      return;
    }
    var row = rows[(start + n) % rows.length];
    n++;
    box.className = 'sing on';
    box.hidden = false;
    DW.emo.set(txt, row.s);
    holdTimer = setTimeout(next, Math.max(2200, DW.emo.plain(row.s).length * 90));
  }
  next();
  return true;
}

function follow(){
  if (!live || !box || botOff()) { return; }
  var r = lyrics();
  if (!r || !r.timed.length) { return; }

  if (!A.playing) {
    if (ly.on) {
      ly.on = false;
      ly.k = -1;
      hide();
      resume();
    }
    return;
  }

  var rows = r.timed;
  var c = A.el.currentTime;
  var k = -1;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].t <= c + 0.15) { k = i; }
    else { break; }
  }

  var end = 0;
  if (k >= 0) {
    var nextT = 1e9;
    if (k + 1 < rows.length) { nextT = rows[k + 1].t; }
    var showFor = Math.max(3, Math.min(7, DW.emo.plain(rows[k].s).length * 0.14));
    end = Math.min(nextT, rows[k].t + showFor);
  }

  if (k >= 0 && c < end) {
    if (ly.k === k && ly.on) { return; }
    if (Date.now() - lastReact < 4000) { return; }
    ly.k = k;
    stopTimers();
    ++gen;
    clearTimeout(timer);
    sing = null;
    box.className = 'sing on';
    box.hidden = false;
    DW.emo.set(txt, rows[k].s);
    ly.on = true;
    said++;
  } else if (ly.on) {
    ly.on = false;
    ly.k = -1;
    hide();
    resume();
  }
}

/* deciding when to talk */

function resume(){
  clearTimeout(timer);
  if (!live || silent) { return; }
  timer = setTimeout(talk, gap());
}

function talk(){
  if (!live || silent || botOff()) { return; }
  if (document.hidden || sing || ly.on || gaming()) {
    resume();
    return;
  }

  var idle = Date.now() - lastInput > 60000;
  var r = Math.random();
  var h = new Date().getHours();

  if (idle) {
    idleSaid++;
    if (idleSaid > 3) {
      silent = true;
      giveTrophy('alone');
      show(pick(FADE), { hold: 2600, after: function(){ silent = true; } });
      return;
    }
    show(pick(IDLE), { after: resume });
    return;
  }
  idleSaid = 0;

  if (validMail() && r < cfg.mailChance) {
    show(pick(MAIL), { cls: 'mail', hold: 9000, after: resume });
    return;
  }
  var singOdds = cfg.singChance;
  if (validMail()) { singOdds = singOdds + cfg.mailChance; }
  if (hasPlain() && A.playing && r < singOdds) {
    if (singPlain()) { return; }
  }

  if (seasonNext && DW.season) {
    seasonNext = false;
    show(pick(DW.season.pool()), { after: resume });
    return;
  }

  var x = Math.random();
  if (x < 0.07) {
    giveTrophy('existential');
    episode(pick(CRISIS), 'scold', resume);
    return;
  }
  if (x < 0.2) {
    show(pick(STATS), { after: resume });
    return;
  }

  var pool = CHAT.concat(BADASS, BADASS, cfg.lines, cfg.lines);
  var q = Math.random();
  var seasonOdds = 0.2;
  if (DW.season && DW.season.id) { seasonOdds = 0.35; }
  if (DW.season && q < seasonOdds) {
    pool = DW.season.pool();
  } else if (q < 0.5) {
    if (h < 5) { pool = DAY.night; }
    else if (h < 12) { pool = DAY.morning; }
    else if (h < 17) { pool = DAY.noon; }
    else if (h < 22) { pool = DAY.evening; }
    else { pool = DAY.night; }
  }
  show(pick(pool), { after: resume });
}

function wake(){
  lastInput = Date.now();
  if (!live) { return; }
  if (silent) {
    silent = false;
    idleSaid = 0;
    if (Date.now() - lastWake < 3000) {
      resume();
      return;
    }
    lastWake = Date.now();
    clearTimeout(timer);
    show(pick(WAKE), { after: resume });
  } else {
    idleSaid = 0;
  }
}

/* reacting to typing */

var buf = '';
var bufT = 0;
var kon = 0;
var pauseTimer = 0;
var weakTimer = 0;

function strongIn(w){
  for (var i = 0; i < STRONG.length; i++) {
    if (w.indexOf(STRONG[i]) >= 0) { return true; }
  }
  return false;
}

function weakIn(w){
  var base = w.replace(/(ing|ed|er|s|y)$/, '');
  for (var i = 0; i < WEAK.length; i++) {
    if (w === WEAK[i] || base === WEAK[i]) { return true; }
  }
  return false;
}

function react(text, cls){
  lastReact = Date.now();
  clearTimeout(timer);
  sing = null;
  ly.on = false;
  show(text, { cls: cls || '', after: resume });
}

function scold(){
  swears++;
  giveTrophy('potty');
  if (DW.cancelHot) { DW.cancelHot(); }
  var t;
  if (swears == 1) { t = SCOLD[0]; }
  else if (swears % 6 == 0) { t = pick(SCOLD_MANY); }
  else { t = pick(SCOLD.length > 1 ? SCOLD.slice(1) : SCOLD); }
  react(t, 'scold');
}

function letter(e){
  var k = e.key;
  if (k && k.length == 1) { return k.toLowerCase(); }
  var m = /^(?:Key)([A-Z])$/.exec(e.code || '');
  if (m) { return m[1].toLowerCase(); }
  m = /^Digit(\d)$/.exec(e.code || '');
  if (m) { return m[1]; }
  return '';
}

function wordTyped(w){
  if (!Object.prototype.hasOwnProperty.call(WORDS, w)) { return; }
  buf = '';
  clearTimeout(weakTimer);
  var r = pick(WORDS[w]);

  if (r == '__sing') {
    if (hasPlain() && A.playing && singPlain()) { return; }
    if (hasTimed()) {
      if (A.playing) { react('i sing along when the lyrics come up. keep listening!'); }
      else { react('press play and i will sing along.'); }
    } else {
      if (A.playing) { react('i would sing but nobody gave me the lyrics.'); }
      else { react('press play and i might sing.'); }
    }
  } else if (r == '__mail') {
    if (validMail()) {
      lastReact = Date.now();
      mailLine();
      clearTimeout(timer);
      resume();
    } else {
      react('i do not have an email set up. mysterious, right?');
    }
  } else if (r == '__crisis') {
    lastReact = Date.now();
    clearTimeout(timer);
    giveTrophy('existential');
    episode(pick(CRISIS), 'scold', resume);
  } else if (r == '__emo') {
    lastReact = Date.now();
    clearTimeout(timer);
    var lines = ['<happy>emotions! watch this.'].concat(DW.emo.demo(), ['<proud>that is all of them.']);
    episode(lines, 'emo', resume);
  } else if (r == '__stat') {
    react(pick(STATS));
  } else {
    react(r);
  }
}

function typed(e){
  try {
    if (!live || e.ctrlKey || e.metaKey || e.altKey || gaming()) { return; }
    var tg = e.target;
    if (tg && /^(input|textarea|select)$/i.test(tg.tagName) && tg.type !== 'range') { return; }
    wake();
    if (e.repeat) { return; }
    keys++;

    // the famous code
    var kk = e.key;
    if (kk && kk.length == 1) { kk = kk.toLowerCase(); }
    if (kk === KONAMI[kon]) {
      kon++;
      if (kon == KONAMI.length) {
        kon = 0;
        giveTrophy('konami');
        react('+30 lives!', 'sing');
        if (DW.vis && DW.vis.state) { DW.vis.state.pulse = 1; }
      }
    } else if (kk === KONAMI[0]) {
      kon = 1;
    } else {
      kon = 0;
    }

    var c = letter(e);
    if (!c) {
      if (e.key && e.key.length == 1) { buf = ''; }
      return;
    }
    if (!/[a-z0-9]/.test(c)) { buf = ''; return; }
    if (Date.now() - bufT > 4000) { buf = ''; }
    bufT = Date.now();
    buf = (buf + c).slice(-24);

    if (strongIn(buf) && Date.now() - lastReact > 400) {
      buf = '';
      clearTimeout(pauseTimer);
      scold();
      return;
    }

    clearTimeout(pauseTimer);
    clearTimeout(weakTimer);
    weakTimer = setTimeout(function(){
      if (live && buf && weakIn(buf)) {
        buf = '';
        scold();
      }
    }, 1500);
    pauseTimer = setTimeout(function(){
      if (!buf || !live) { return; }
      wordTyped(buf);
    }, 650);
  } catch(err) {
    console.error('[dweeb] splash typing broke:', err);
  }
}

/* setup */
function strings(list){
  var out = [];
  var arr = [].concat(list || []);
  for (var i = 0; i < arr.length; i++) { out.push(String(arr[i])); }
  return out;
}

S.init = function(){
  box = document.getElementById('splash');
  txt = document.getElementById('sp-txt');

  var user = DW.mock || DW.splash || {};
  cfg = {};
  var names = Object.keys(D);
  for (var i = 0; i < names.length; i++) {
    var k = names[i];
    if (user[k] !== undefined) { cfg[k] = user[k]; } else { cfg[k] = D[k]; }
  }
  cfg.lines = [];
  cfg.scolds = [];
  if (!Array.isArray(cfg.every) || cfg.every.length < 2) { cfg.every = D.every; }
  cfg.boss = String(cfg.boss || D.boss).slice(0, 40);
  cfg.name = String(cfg.name || D.name).slice(0, 20);
  if (box) { box.setAttribute('data-name', cfg.name); }

  if (!box || !txt || cfg.on === false) {
    if (box) { box.remove(); }
    box = null;
    return;
  }

  try {
    visits = (parseInt(localStorage.getItem('dw-visits'), 10) || 0) + 1;
    localStorage.setItem('dw-visits', visits);
  } catch(e) {}
  DW.visits = visits;

  DW.vis.bind('splash', txt);

  box.addEventListener('click', function(){
    if (!box.classList.contains('mail') || !validMail()) { return; }
    DW.openLink('mailto:' + cfg.email);
  });

  addEventListener('keydown', typed, true);
  addEventListener('pointerdown', function(){
    clicks++;
    wake();
  }, true);
  addEventListener('pointermove', function(){
    if (Date.now() - lastInput > 4000) { wake(); }
  }, { passive: true });
  addEventListener('touchstart', wake, { passive: true });
  addEventListener('wheel', wake, { passive: true });
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) { return; }
    if (Date.now() - lastInput > 60000 || silent) {
      silent = true;
      wake();
    } else {
      resume();
    }
  });

  A.on('time', follow);

  var firstState = true;
  var lastTrack = '';
  A.on('track', function(t){
    sing = null;
    if (ly.on) {
      ly.on = false;
      hide();
    }
    ly.k = -1;
    if (!live || t.file === lastTrack) {
      lastTrack = t.file;
      return;
    }
    lastTrack = t.file;
    if (silent || gaming() || Date.now() - lastReact < 2500) { resume(); return; }
    if (earlyLyric(t)) { resume(); return; }
    clearTimeout(timer);
    show(pick(NOW), { after: resume });
  });

  var wasPlaying = false;
  A.on('state', function(){
    if (firstState) {
      firstState = false;
      wasPlaying = A.playing;
      return;
    }
    if (!live || silent || gaming()) {
      wasPlaying = A.playing;
      return;
    }
    if (!A.playing && (ly.on || sing)) {
      sing = null;
      ly.on = false;
      ly.k = -1;
      hide();
      resume();
    }
    var recent = Date.now() - lastReact > 4000;
    if (wasPlaying && !A.playing && !A.el.ended && recent && Math.random() < 0.5) {
      clearTimeout(timer);
      show(pick(PAUSED), { after: resume });
    } else if (!wasPlaying && A.playing && recent && Math.random() < 0.4) {
      clearTimeout(timer);
      show(pick(RESUME), { after: resume });
    }
    wasPlaying = A.playing;
  });
};

S.apply = function(){
  if (!box) { return; }
  clearTimeout(timer);
  if (botOff()) {
    hide();
    return;
  }
  silent = false;
  idleSaid = 0;
  if (live) { show(pick(WAKE), { after: resume }); }
};

S.say = function(text){
  if (botOff() || !live || silent || gaming() || !box) { return; }
  react(text);
};

S.start = function(){
  if (!box || live) { return; }
  live = true;
  lastInput = Date.now();
  setTimeout(function(){
    if (Date.now() - lastReact < 2000 || ly.on) {
      resume();
      return;
    }
    seasonNext = true;
    var hello = HELLO_NEW;
    if (visits > 1) { hello = HELLO_BACK; }
    show(pick(hello), { after: resume });
  }, 1400);
};
})();
