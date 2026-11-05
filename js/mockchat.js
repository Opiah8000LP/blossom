(function(){
var DW = window.DW;
var C = {};
DW.mockchat = C;

var M, cfg, ui, nodes;
var root, panel, pill, badge, log, opts, input, teaser;
var isOpen = false;
var busy = false;
var gen = 0;
var sent = 0;
var unread = 0;
var avatarSrc = '';

function el(tag, cls, txt){
  var e = document.createElement(tag);
  if (cls) { e.className = cls; }
  if (txt !== undefined && txt !== null) { e.textContent = txt; }
  return e;
}

function add(parent){
  for (var i = 1; i < arguments.length; i++) { if (arguments[i]) { parent.appendChild(arguments[i]); } }
  return parent;
}

function rnd(a, b){ return a + Math.random() * (b - a); }
function pick(list){ return list[Math.floor(Math.random() * list.length)]; }

function fill(s){
  return String(s).replace(/\{boss\}/g, (M && M.boss) || 'RDweeb');
}

function plain(s){
  var t = fill(s);
  if (DW.emo && DW.emo.plain) { return DW.emo.plain(t); }
  return t.replace(/<\/?[a-z0-9]+>/gi, '');
}

function trophy(id){
  try { if (DW.trophy) { DW.trophy.award(id); } } catch(e) {}
}

function avatar(cls){
  var wrap = el('span', 'mb-av ' + (cls || ''));
  var letter = String((M && M.name) || 'M').charAt(0);
  if (avatarSrc) {
    var im = new Image();
    im.alt = '';
    im.draggable = false;
    im.addEventListener('error', function(){
      im.remove();
      wrap.textContent = letter;
    });
    im.src = avatarSrc;
    wrap.appendChild(im);
  } else {
    wrap.textContent = letter;
  }
  return wrap;
}

/* ---------- messages ---------- */

function scroll(){
  log.scrollTop = log.scrollHeight;
}

function bubble(who, text, extra, quiet){
  var row = el('div', 'mb-msg ' + who + (extra ? ' ' + extra : ''));
  if (who == 'bot') { row.appendChild(avatar('sm')); }
  var b = el('div', 'mb-bub');
  if (extra == 'think') {
    for (var i = 0; i < 3; i++) { b.appendChild(el('i')); }
  } else if (who == 'bot' && DW.censor) {
    var hits = DW.censor.node(b, text);
    if (hits && !quiet) { DW.censor.bleep(hits); }
  } else {
    b.textContent = text;
  }
  row.appendChild(b);
  log.appendChild(row);
  while (log.children.length > 80) { log.removeChild(log.firstChild); }
  scroll();
  return row;
}

function setBadge(n){
  unread = n;
  badge.textContent = n > 99 ? '99+' : String(n);
  badge.hidden = n <= 0;
}

function clearOpts(){ opts.textContent = ''; }

function showOptions(list){
  clearOpts();
  var arr = list || [];
  for (var i = 0; i < arr.length; i++) {
    (function(o){
      var b = el('button', 'mb-opt', plain(o.text));
      b.type = 'button';
      b.addEventListener('click', function(){
        if (busy) { return; }
        user(plain(o.text));
        play(o.go);
      });
      opts.appendChild(b);
    })(arr[i]);
  }
  var again = el('button', 'mb-opt dim', ui.newChat || 'New chat');
  again.type = 'button';
  again.addEventListener('click', function(){ C.reset(); });
  opts.appendChild(again);
  scroll();
}

function user(text){
  bubble('me', text);
  sent++;
  if (sent >= 5) { trophy('unhelpful'); }
}

function speak(lines, done){
  var my = gen;
  var i = 0;
  busy = true;
  clearOpts();
  var think = (cfg.thinkMs && cfg.thinkMs.length > 1) ? cfg.thinkMs : [500, 1300];

  function next(){
    if (my !== gen) { return; }
    if (i >= lines.length) {
      busy = false;
      if (done) { done(); }
      return;
    }
    var dots = bubble('bot', '', 'think');
    var line = lines[i];
    i++;
    setTimeout(function(){
      if (my !== gen) { return; }
      dots.remove();
      bubble('bot', plain(line));
      next();
    }, rnd(think[0], think[1]));
  }
  next();
}

function play(id, depth){
  var n = nodes[id];
  if (!n) { speak([pick(cfg.fallback)], function(){ showOptions((nodes[cfg.start] || {}).options); }); return; }
  var lines = [];
  if (n.pick && n.pick.length) { lines = [pick(n.pick)]; }
  else { lines = [].concat(n.say || []); }
  speak(lines, function(){
    if (n.next && nodes[n.next] && (depth || 0) < 12) { play(n.next, (depth || 0) + 1); return; }
    showOptions(n.options || (nodes[cfg.start] || {}).options);
  });
}

function match(text){
  var t = ' ' + text.toLowerCase().replace(/[^a-z0-9\s'\-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  var trig = cfg.triggers || [];
  for (var i = 0; i < trig.length; i++) {
    var words = trig[i].words || [];
    for (var j = 0; j < words.length; j++) {
      var w = String(words[j]).toLowerCase();
      if (t.indexOf(' ' + w + ' ') >= 0 || (w.indexOf(' ') >= 0 && t.indexOf(w) >= 0)) { return trig[i].go; }
    }
  }
  return '';
}

function submit(){
  var text = input.value.trim();
  if (!text || busy) { return; }
  input.value = '';
  user(text.slice(0, 200));
  var go = match(text);
  if (go && nodes[go]) { play(go); }
  else {
    speak([pick(cfg.fallback)], function(){ showOptions((nodes[cfg.start] || {}).options); });
  }
}

function open(){
  if (isOpen) { return; }
  isOpen = true;
  panel.hidden = false;
  root.classList.add('open');
  document.body.classList.add('mb-open');
  pill.setAttribute('aria-expanded', 'true');
  setBadge(0);
  scroll();
  if (!matchMedia('(pointer: coarse)').matches) { setTimeout(function(){ input.focus(); }, 80); }
}

function close(){
  if (!isOpen) { return; }
  isOpen = false;
  panel.hidden = true;
  root.classList.remove('open');
  document.body.classList.remove('mb-open');
  pill.setAttribute('aria-expanded', 'false');
  pill.focus();
}

C.open = open;
C.close = close;

C.line = function(text){
  if (!log || isOpen) { return; }
  var t = String(text || '').trim();
  if (!t) { return; }
  bubble('bot', t, '', true);
  setBadge(unread + 1);
};

C.reset = function(){
  gen++;
  busy = false;
  log.textContent = '';
  clearOpts();
  play(cfg.start);
};

C.apply = function(){
  if (!root) { return; }
  var off = DW.set && DW.set.get && DW.set.get('bot') === false;
  root.hidden = !!off;
  if (off) {
    if (isOpen) { close(); }
    if (teaser) { teaser.classList.remove('on'); }
  }
};

/* ---------- build ---------- */

function plane(){
  var ns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('aria-hidden', 'true');
  var path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M2.5 11.2 21 3.5a.6.6 0 0 1 .8.7l-5.6 16.3a.6.6 0 0 1-1.1.1l-3.2-6.4-6.4-3.2a.6.6 0 0 1 0-1.1Zm9.4 2.3 2.4 4.8 3.6-10.5-9.7 4.3 3.7 1.4Z');
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);
  return svg;
}

C.init = function(){
  M = DW.mock;
  cfg = M && M.chat;
  if (!M || M.on === false || !cfg || !cfg.nodes) { return; }
  nodes = cfg.nodes;
  cfg.start = cfg.start || 'start';
  cfg.fallback = (cfg.fallback && cfg.fallback.length) ? cfg.fallback : ['I am sorry, I cannot help with that.'];
  ui = M.ui || {};
  avatarSrc = /^[\w\-\/.]+$/.test(String(M.avatar || '')) ? String(M.avatar) : '';
  var name = M.name || 'MOCK BOT';
  teaser = document.getElementById('splash');

  root = el('div', 'mb');
  root.id = 'mb';
  if (M.side == 'right') { document.body.classList.add('mb-right'); }
  if (/^#[0-9a-f]{3,8}$/i.test(String(M.accent || ''))) { root.style.setProperty('--mb-a', M.accent); }
  if (/^#[0-9a-f]{3,8}$/i.test(String(M.accent2 || ''))) { root.style.setProperty('--mb-b', M.accent2); }

  /* panel */
  panel = el('section', 'mb-panel');
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', name + ' chat');

  var head = el('header', 'mb-head');
  var who = el('div', 'mb-who');
  var status = el('div', 'mb-status');
  add(status, el('i', 'mb-dot'), el('span', null, ui.status || 'online'));
  add(who, el('div', 'mb-name', name), status);
  var x = el('button', 'mb-x', '\u2715');
  x.type = 'button';
  x.setAttribute('aria-label', 'close chat');
  x.addEventListener('click', close);
  add(head, avatar('lg'), who, x);

  log = el('div', 'mb-log');
  log.setAttribute('aria-live', 'polite');
  opts = el('div', 'mb-opts');

  var row = el('div', 'mb-in');
  input = el('input');
  input.type = 'text';
  input.maxLength = 200;
  input.placeholder = ui.placeholder || cfg.placeholder || 'Ask me anything...';
  input.setAttribute('aria-label', 'message');
  input.autocomplete = 'off';
  var send = el('button', 'mb-send');
  send.type = 'button';
  send.setAttribute('aria-label', 'send');
  send.appendChild(plane());
  send.addEventListener('click', submit);
  input.addEventListener('keydown', function(e){
    if (e.key == 'Enter') { submit(); e.preventDefault(); }
    else if (e.key == 'Escape') { close(); e.preventDefault(); e.stopPropagation(); }
  });
  add(row, input, send);

  add(panel, head, log, opts, row);
  if (ui.footer) { panel.appendChild(el('div', 'mb-foot', ui.footer)); }

  /* pill */
  pill = el('button', 'mb-pill');
  pill.type = 'button';
  pill.setAttribute('aria-expanded', 'false');
  add(pill, avatar('md'), el('span', 'mb-label', ui.button || 'Ask AI'));
  badge = el('span', 'mb-badge');
  badge.hidden = true;
  pill.appendChild(badge);
  pill.addEventListener('click', function(){ if (isOpen) { close(); } else { open(); } });

  add(root, panel, pill);
  document.body.appendChild(root);

  if (teaser) {
    teaser.addEventListener('click', function(){
      if (!teaser.classList.contains('mail')) { open(); }
    });
  }

  var first = nodes[cfg.start] || {};
  var greet = (first.pick && first.pick.length) ? [pick(first.pick)] : [].concat(first.say || []);
  for (var i = 0; i < greet.length; i++) { bubble('bot', plain(greet[i])); }
  showOptions(first.options);
  setBadge(greet.length);
  C.apply();
};
})();
