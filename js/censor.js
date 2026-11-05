(function(){
var DW = window.DW;
var K = {};
DW.censor = K;

var cfg = {};
var set = {};
var block = '\u2588';
var last = 0;
var pool = [];
var SUFFIX = ['', 's', 'es', 'ed', 'ing', 'in', 'er', 'ers', 'y', 'ier', 'iest'];

function conf(){
  var m = DW.mock || {};
  cfg = m.censor || {};
  block = String(cfg.block || '\u2588').charAt(0);
  set = {};
  var list = cfg.words || [];
  for (var i = 0; i < list.length; i++) { set[String(list[i]).toLowerCase()] = 1; }
}

function isSwear(word){
  var w = String(word).toLowerCase().replace(/['\u2019]/g, '');
  if (!w) { return false; }
  for (var i = 0; i < SUFFIX.length; i++) {
    var s = SUFFIX[i];
    if (s && w.length > s.length && w.slice(-s.length) == s && set[w.slice(0, -s.length)]) { return true; }
    if (!s && set[w]) { return true; }
  }
  return false;
}

function spans(str){
  var out = [];
  var re = /[A-Za-z0-9'\u2019]+/g;
  var m;
  while ((m = re.exec(str))) {
    if (isSwear(m[0])) { out.push([m.index, m.index + m[0].length]); }
  }
  return out;
}

function on(){
  return cfg.on !== false && Object.keys(set).length > 0;
}

K.blank = function(text){
  var str = String(text);
  if (!on()) { return { text: str, hits: 0 }; }
  var sp = spans(str);
  var chars = str.split('');
  for (var i = 0; i < sp.length; i++) {
    for (var j = sp[i][0]; j < sp[i][1]; j++) { chars[j] = /['\u2019]/.test(chars[j]) ? chars[j] : block; }
  }
  return { text: chars.join(''), hits: sp.length };
};

K.mark = function(toks){
  if (!on()) { return 0; }
  var idx = [];
  var str = '';
  for (var i = 0; i < toks.length; i++) {
    if (toks[i].c) { idx.push(i); str += toks[i].c; }
  }
  var sp = spans(str);
  for (var a = 0; a < sp.length; a++) {
    for (var b = sp[a][0]; b < sp[a][1]; b++) {
      var t = toks[idx[b]];
      if (/['\u2019]/.test(t.c)) { continue; }
      t.c = block;
      t.cz = 1;
      if (b == sp[a][0]) { t.czs = 1; }
    }
  }
  return sp.length;
};

K.node = function(parent, text){
  var r = K.blank(text);
  parent.textContent = '';
  if (!r.hits) { parent.textContent = r.text; return 0; }
  var re = new RegExp(block + '+', 'g');
  var src = r.text;
  var at = 0;
  var m;
  while ((m = re.exec(src))) {
    if (m.index > at) { parent.appendChild(document.createTextNode(src.slice(at, m.index))); }
    var s = document.createElement('span');
    s.className = 'cz';
    s.textContent = m[0];
    parent.appendChild(s);
    at = m.index + m[0].length;
  }
  if (at < src.length) { parent.appendChild(document.createTextNode(src.slice(at))); }
  return r.hits;
};

K.bleep = function(times){
  if (cfg.on === false) { return; }
  if (DW.set && DW.set.get && DW.set.get('bleep') === false) { return; }
  var list = cfg.sfx || [];
  if (typeof list == 'string') { list = [list]; }
  if (!list.length) { return; }
  var n = Math.max(1, Math.min(3, times || 1));
  var gap = cfg.gap || 160;
  var now = Date.now();
  if (now - last < gap) { return; }
  last = now;
  for (var i = 0; i < n; i++) {
    setTimeout(function(){
      var src = String(list[Math.floor(Math.random() * list.length)]);
      if (!/^[\w\-\/.]+$/.test(src)) { return; }
      try {
        var a = new Audio(src);
        a.volume = Math.max(0, Math.min(1, cfg.volume === undefined ? 0.8 : cfg.volume));
        var p = a.play();
        if (p && p.catch) { p.catch(function(){}); }
        pool.push(a);
        if (pool.length > 6) { pool.shift(); }
      } catch(e) {}
    }, i * gap);
  }
};

K.init = conf;
conf();
})();
