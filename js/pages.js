(function(){
var DW = window.DW;
var P = {};
DW.pages = P;

var wins = {};
var previews = [];

/* ---------- little helpers ---------- */

function el(tag, cls, txt){
  var e = document.createElement(tag);
  if (cls) { e.className = cls; }
  if (txt !== undefined && txt !== null) { e.textContent = txt; }
  return e;
}

function add(parent){
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i]) { parent.appendChild(arguments[i]); }
  }
  return parent;
}

function trophy(id){
  try { if (DW.trophy) { DW.trophy.award(id); } } catch(e) {}
}

function toast(msg){
  if (DW.toast) { DW.toast(msg); }
}

function linkBtn(label, url, cls){
  var safe = DW.safeUrl(url);
  var a;
  if (safe) {
    a = el('a', 'pg-btn ' + (cls || ''), label);
    a.href = safe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  } else {
    a = el('span', 'pg-btn off', label);
  }
  return a;
}

function button(label, cls, fn){
  var b = el('button', 'pg-btn ' + (cls || ''), label);
  b.type = 'button';
  b.addEventListener('click', fn);
  return b;
}

function chips(list){
  var box = el('div', 'pg-chips');
  var arr = [].concat(list || []);
  for (var i = 0; i < arr.length; i++) { box.appendChild(el('span', 'pg-chip', String(arr[i]))); }
  return box;
}

function head(body, title, sub){
  var h = el('div', 'pg-head');
  add(h, el('h2', null, title));
  if (sub) { add(h, el('p', null, sub)); }
  body.appendChild(h);
}

function empty(body, msg){
  body.appendChild(el('div', 'empty', msg));
}

function icon(name){
  var i = new Image();
  i.src = 'icons/' + name + '.png';
  i.alt = '';
  i.draggable = false;
  i.className = 'pg-ico';
  return i;
}

function fmt(n){
  if (Math.abs(n - Math.round(n)) < 0.005) { return String(Math.round(n)); }
  return n.toFixed(2);
}

function usd(n){
  return ((DW.pricing || {}).currency || '$') + fmt(n);
}

function robux(n){
  var rate = (DW.pricing || {}).robuxPerUsd || 100;
  return Math.round(n * rate).toLocaleString('en-US') + ' R$';
}

function tiers(){
  return (DW.pricing || {}).tiers || {};
}

function slotList(kind){
  var W = DW.works || {};
  var info = W.info || {};
  var count = (W.count || {})[kind] || 0;
  var out = [];
  for (var n = 1; n <= count; n++) {
    var key, item;
    if (kind == 'music') {
      key = 'track-' + n;
      item = { title: 'Track ' + n, src: 'works/audio/' + key + '.mp3' };
    } else if (kind == 'videos') {
      key = 'video-' + n;
      item = { title: 'Video ' + n, src: 'works/video/' + key + '.mp4', poster: 'works/thumbs/' + key + '.png' };
    } else {
      key = 'edit-' + n;
      item = { title: 'Edit ' + n, before: 'works/images/' + key + '-before.png', after: 'works/images/' + key + '-after.png' };
    }
    var extra = info[key] || {};
    for (var f in extra) { item[f] = extra[f]; }
    out.push(item);
  }
  return out;
}

function stopOthers(keep){
  for (var i = 0; i < previews.length; i++) {
    if (previews[i] !== keep && !previews[i].paused) { previews[i].pause(); }
  }
}

function playing(media){
  stopOthers(media);
  try { if (DW.audio && DW.audio.playing) { DW.audio.pause(); } } catch(e) {}
}

function watch(media){
  previews.push(media);
  media.addEventListener('play', function(){ playing(media); });
}

function gate(body, total, msg){
  var left = total, shown = 0;
  function fin(){
    left--;
    if (left <= 0 && shown === 0) { empty(body, msg || 'Nothing here yet. Coming soon!'); }
  }
  if (total === 0) { empty(body, msg || 'Nothing here yet. Coming soon!'); }
  return {
    watch: function(node){
      var done = false;
      function settle(ok){
        if (done) { return; }
        done = true;
        if (ok) { node.hidden = false; shown++; } else { node.remove(); }
        fin();
      }
      node.hidden = true;
      setTimeout(function(){ settle(true); }, 6000);
      return settle;
    }
  };
}

function when(media, settle){
  media.addEventListener('loadedmetadata', function(){ settle(true); });
  media.addEventListener('error', function(){ settle(false); });
}

/* ---------- showcase pages ---------- */

function thumbBox(src, glyph){
  var t = el('div', 'pg-thumb');
  function fallback(){
    t.textContent = '';
    t.classList.add('nothumb');
    t.appendChild(icon(glyph));
  }
  if (src) {
    var im = new Image();
    im.alt = '';
    im.loading = 'lazy';
    im.addEventListener('error', fallback);
    im.src = src;
    t.appendChild(im);
  } else {
    fallback();
  }
  return t;
}

function cardGrid(body, list, glyph, label, prefix){
  var shown = [];
  for (var k = 0; k < (list || []).length; k++) { if (list[k] && list[k].url) { shown.push({ it: list[k], n: k + 1 }); } }
  if (!shown.length) { empty(body, 'Nothing here yet. Coming soon!'); return; }
  var grid = el('div', 'pg-grid');
  for (var i = 0; i < shown.length; i++) {
    var it = shown[i].it;
    var c = el('article', 'pg-card');
    add(c, thumbBox(it.thumb || 'works/thumbs/' + prefix + '-' + shown[i].n + '.png', glyph), el('h4', null, it.title || 'Untitled'));
    if (it.status) { add(c, el('div', 'pg-status', it.status)); }
    if (it.desc) { add(c, el('p', null, it.desc)); }
    if (it.tags && it.tags.length) { add(c, chips(it.tags)); }
    add(c, linkBtn(label, it.url, 'go'));
    grid.appendChild(c);
  }
  body.appendChild(grid);
}

function renderMusic(body){
  head(body, 'MUSIC AND SOUND', 'Press play. Only one preview plays at a time.');
  var list = [];
  var all = slotList('music');
  for (var k = 0; k < all.length; k++) { if (all[k] && all[k].src) { list.push(all[k]); } }
  var g = gate(body, list.length);
  var wrap = el('div', 'pg-list');
  body.appendChild(wrap);
  for (var i = 0; i < list.length; i++) {
    var it = list[i];
    var row = el('article', 'pg-row');
    var info = el('div', 'pg-info');
    var title = el('h4', null, it.title || 'Untitled');
    if (it.kind) { title.appendChild(el('span', 'pg-kind', it.kind)); }
    add(info, title);
    if (it.desc) { add(info, el('p', null, it.desc)); }
    if (it.tags && it.tags.length) { add(info, chips(it.tags)); }
    add(row, info);
    var a = el('audio');
    a.controls = true;
    a.preload = 'metadata';
    when(a, g.watch(row));
    a.src = it.src;
    watch(a);
    row.appendChild(a);
    wrap.appendChild(row);
  }
}

function youtubeBox(id){
  var box = el('div', 'pg-yt');
  var ok = /^[\w-]{6,20}$/.test(String(id));
  var b = button(ok ? '\u25B6  LOAD VIDEO (YouTube)' : 'bad YouTube id', 'go', function(){
    if (!ok) { return; }
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
    f.title = 'video';
    f.allow = 'encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    box.textContent = '';
    box.appendChild(f);
    try { if (DW.audio && DW.audio.playing) { DW.audio.pause(); } } catch(e) {}
  });
  box.appendChild(b);
  box.appendChild(el('div', 'pg-note', 'Nothing loads from YouTube until you press this.'));
  return box;
}

function renderVideos(body){
  head(body, 'VIDEO EDITS', 'Videos I have edited.');
  var list = [];
  var all = slotList('videos');
  for (var k = 0; k < all.length; k++) { if (all[k] && (all[k].src || all[k].youtube)) { list.push(all[k]); } }
  var g = gate(body, list.length);
  var grid = el('div', 'pg-grid wide');
  body.appendChild(grid);
  for (var i = 0; i < list.length; i++) {
    var it = list[i];
    var c = el('article', 'pg-card');
    var holder;
    var settle = g.watch(c);
    if (it.youtube) {
      holder = youtubeBox(it.youtube);
      settle(true);
    } else {
      holder = el('div', 'pg-vid');
      var v = el('video');
      v.controls = true;
      v.preload = 'metadata';
      v.playsInline = true;
      when(v, settle);
      v.src = it.src;
      if (it.poster) { v.poster = it.poster; }
      watch(v);
      holder.appendChild(v);
    }
    add(c, holder, el('h4', null, it.title || 'Untitled'));
    if (it.desc) { add(c, el('p', null, it.desc)); }
    grid.appendChild(c);
  }
}

function slider(it){
  var box = el('div', 'ba');
  box.tabIndex = 0;
  box.setAttribute('role', 'slider');
  box.setAttribute('aria-label', 'before and after: ' + (it.title || 'image'));
  box.setAttribute('aria-valuemin', '0');
  box.setAttribute('aria-valuemax', '100');

  function pic(src, cls, alt){
    var im = new Image();
    im.src = src || '';
    im.alt = alt;
    im.draggable = false;
    im.className = cls;
    return im;
  }
  var after = pic(it.after, 'ba-img', 'after');
  var before = pic(it.before, 'ba-img ba-top', 'before');
  var line = el('div', 'ba-line');
  var knob = el('div', 'ba-knob', '\u25C0\u25B6');
  line.appendChild(knob);
  add(box, after, before, line, el('span', 'ba-tag l', 'BEFORE'), el('span', 'ba-tag r', 'AFTER'));

  var pos = 50;
  function set(p){
    pos = Math.max(0, Math.min(100, p));
    box.style.setProperty('--pos', pos + '%');
    box.setAttribute('aria-valuenow', String(Math.round(pos)));
  }
  function fromEvent(e){
    var r = box.getBoundingClientRect();
    if (r.width > 0) { set((e.clientX - r.left) / r.width * 100); }
  }
  var drag = false;
  box.addEventListener('pointerdown', function(e){
    drag = true;
    try { box.setPointerCapture(e.pointerId); } catch(err) {}
    fromEvent(e);
  });
  box.addEventListener('pointermove', function(e){ if (drag) { fromEvent(e); } });
  box.addEventListener('pointerup', function(){ drag = false; });
  box.addEventListener('pointercancel', function(){ drag = false; });
  box.addEventListener('keydown', function(e){
    var k = e.key;
    if (k == 'ArrowLeft') { set(pos - 5); }
    else if (k == 'ArrowRight') { set(pos + 5); }
    else if (k == 'Home') { set(0); }
    else if (k == 'End') { set(100); }
    else { return; }
    e.preventDefault();
  });
  set(50);
  return box;
}

function renderImages(body){
  head(body, 'IMAGE EDITS', 'Drag the slider (or use the arrow keys) to compare before and after.');
  var list = [];
  var all = slotList('images');
  for (var k = 0; k < all.length; k++) { if (all[k] && all[k].before && all[k].after) { list.push(all[k]); } }
  var g = gate(body, list.length);
  var grid = el('div', 'pg-grid wide');
  body.appendChild(grid);
  for (var i = 0; i < list.length; i++) {
    (function(it){
      var c = el('article', 'pg-card');
      var settle = g.watch(c);
      var box = slider(it);
      var imgs = box.querySelectorAll('img');
      var ok = 0;
      for (var j = 0; j < imgs.length; j++) {
        imgs[j].addEventListener('load', function(){ ok++; if (ok == imgs.length) { settle(true); } });
        imgs[j].addEventListener('error', function(){ settle(false); });
        if (imgs[j].complete && imgs[j].naturalWidth > 0) { ok++; }
      }
      if (ok == imgs.length) { settle(true); }
      add(c, box, el('h4', null, it.title || 'Untitled'));
      if (it.desc) { add(c, el('p', null, it.desc)); }
      grid.appendChild(c);
    })(list[i]);
  }
}

/* ---------- services ---------- */

function openServices(){
  var out = [];
  var list = DW.services || [];
  for (var i = 0; i < list.length; i++) { if (list[i].open !== false) { out.push(list[i]); } }
  return out;
}

function renderServices(body){
  head(body, 'WHAT I OFFER', 'Everything I make. Ready to order? Use COMMISSION > REQUEST BUILDER in the menu.');
  var list = DW.services || [];
  var grid = el('div', 'pg-grid');
  for (var i = 0; i < list.length; i++) {
    (function(s){
      var c = el('article', 'pg-card svc');
      if (s.open === false) { c.classList.add('soon'); }
      var top = el('div', 'svc-top');
      add(top, icon(s.icon || 'stack'), el('h4', null, s.name));
      add(c, top);
      if (s.open === false) { add(c, el('div', 'pg-status', 'COMING SOON')); }
      add(c, el('p', null, s.blurb));
      var ul = el('ul', 'pg-ul');
      var inc = s.includes || [];
      for (var j = 0; j < inc.length; j++) { ul.appendChild(el('li', null, inc[j])); }
      add(c, ul);
      grid.appendChild(c);
    })(list[i]);
  }
  body.appendChild(grid);
}

function tierCard(key, t, trophyIcon){
  var c = el('article', 'pg-tier ' + key);
  var top = el('div', 'tier-top');
  add(top, icon(trophyIcon), el('h3', null, t.name));
  add(c, top, el('div', 'tier-tag', t.tag));
  var price = el('div', 'tier-price');
  add(price, el('b', null, usd(t.perAsset)), el('span', null, ' per asset  /  ' + robux(t.perAsset)));
  add(c, price);
  var ul = el('ul', 'pg-ul');
  var extra = usd(t.extraRevision) + (t.plus ? '+' : '');
  var lines = [
    t.queue,
    t.freeRevisions + ' free revisions',
    'Extra revisions: ' + extra + ' each (' + robux(t.extraRevision) + (t.plus ? '+' : '') + ')',
    t.credit ? 'Credit to ' + (DW.profile || {}).name + ' required' : 'No credit required'
  ];
  for (var i = 0; i < lines.length; i++) { ul.appendChild(el('li', null, lines[i])); }
  add(c, ul);
  return c;
}

function renderPackages(body){
  head(body, 'PACKAGES', 'Two ways to order. Payment is only through ' + ((DW.pricing || {}).payment || 'Ko-fi') + '. Robux are accepted too.');
  var T = tiers();
  var wrap = el('div', 'pg-tiers');
  if (T.standard) { wrap.appendChild(tierCard('standard', T.standard, 'bronze')); }
  if (T.premium) { wrap.appendChild(tierCard('premium', T.premium, 'gold')); }
  body.appendChild(wrap);

  /* calculator */
  var calc = el('section', 'pg-calc');
  add(calc, el('h3', null, 'PRICE CALCULATOR'));
  var row = el('div', 'pg-form inline');

  function field(label, input){
    var f = el('label', 'pg-field');
    add(f, el('span', null, label), input);
    return f;
  }
  var tier = el('select');
  Object.keys(T).forEach(function(k){
    var o = el('option', null, T[k].name + ' (' + T[k].tag.toLowerCase() + ')');
    o.value = k;
    tier.appendChild(o);
  });
  var assets = el('input'); assets.type = 'number'; assets.min = '1'; assets.max = '99'; assets.value = '1';
  var revs = el('input'); revs.type = 'number'; revs.min = '0'; revs.max = '99'; revs.value = '0';
  add(row, field('Package', tier), field('Assets', assets), field('Extra revisions (after the free ones)', revs));
  var out = el('div', 'pg-total');
  add(calc, row, out);

  function recalc(){
    var t = T[tier.value] || T.standard;
    var n = Math.max(1, Math.min(99, parseInt(assets.value, 10) || 1));
    var r = Math.max(0, Math.min(99, parseInt(revs.value, 10) || 0));
    var total = n * t.perAsset + r * t.extraRevision;
    var plus = (r > 0 && t.plus) ? '+' : '';
    out.textContent = '';
    add(out, el('b', null, usd(total) + plus), el('span', null, '  /  ' + robux(total) + plus));
    out.title = 'The + means extra revisions can cost more for bigger changes.';
  }
  tier.addEventListener('change', recalc);
  assets.addEventListener('input', recalc);
  revs.addEventListener('input', recalc);
  recalc();
  body.appendChild(calc);

}

/* ---------- payment ---------- */

function renderPayment(body){
  var pr = DW.pricing || {};
  head(body, 'PAYMENT', 'Everything is paid through ' + (pr.payment || 'Ko-fi') + '. Nowhere else.');
  var rate = pr.robuxPerUsd || 100;
  var steps = el('ol', 'pg-ol');
  var s = [
    'Send me a request (COMMISSION > REQUEST BUILDER writes the message for you).',
    'I reply with the total and the details.',
    'You pay through ' + (pr.payment || 'Ko-fi') + '. In dollars, or in Robux at the rate below.',
    'Your order goes in the queue (Standard) or jumps it (Premium).'
  ];
  for (var i = 0; i < s.length; i++) { steps.appendChild(el('li', null, s[i])); }
  body.appendChild(steps);

  var tbl = el('table', 'pg-table');
  var th = el('tr');
  add(th, el('th', null, 'DOLLARS'), el('th', null, 'ROBUX'));
  tbl.appendChild(th);
  [1, 3, 5, 10, 25].forEach(function(n){
    var tr = el('tr');
    add(tr, el('td', null, usd(n)), el('td', null, robux(n)));
    tbl.appendChild(tr);
  });
  add(body, el('h3', 'pg-h3', '$1 = ' + rate + ' ROBUX'), tbl);
  if (pr.robuxNote) { add(body, el('p', 'pg-p', pr.robuxNote)); }

  var cta = el('div', 'pg-actions');
  add(cta, linkBtn('OPEN KO-FI', (DW.links || {}).kofi, 'go'));
  body.appendChild(cta);
  if (!DW.safeUrl((DW.links || {}).kofi)) { add(body, el('p', 'pg-note', 'Add your Ko-fi link in js/config.js (DW.links.kofi) to turn the button on.')); }
}

function renderTerms(body){
  var T = tiers();
  head(body, 'TERMS', 'The rules, in plain words.');
  var ul = el('ul', 'pg-ul big');
  var rules = [];
  Object.keys(T).forEach(function(k){
    var t = T[k];
    rules.push(t.name + ' (' + t.tag.toLowerCase() + '): ' + usd(t.perAsset) + ' per asset. ' + t.queue + ' ' +
      t.freeRevisions + ' free revisions, then ' + usd(t.extraRevision) + (t.plus ? '+' : '') + ' for each extra one. ' +
      (t.credit ? 'You must credit me.' : 'You do not have to credit me.'));
  });
  rules.push('Payment: only through ' + ((DW.pricing || {}).payment || 'Ko-fi') + '. Robux are accepted at $1 = ' + ((DW.pricing || {}).robuxPerUsd || 100) + ' Robux.');
  var extra = DW.termsExtra || [];
  for (var i = 0; i < extra.length; i++) { rules.push(String(extra[i])); }
  for (var j = 0; j < rules.length; j++) { ul.appendChild(el('li', null, rules[j])); }
  body.appendChild(ul);
}

function renderFaq(body){
  head(body, 'FAQ', 'Quick answers.');
  var list = DW.faq || [];
  if (!list.length) { empty(body, 'Nothing here yet.'); return; }
  for (var i = 0; i < list.length; i++) {
    var d = el('details', 'pg-faq');
    add(d, el('summary', null, list[i].q), el('p', null, list[i].a));
    body.appendChild(d);
  }
}

/* ---------- contact ---------- */

function copyText(text, done){
  function fallback(){
    var ta = el('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.className = 'pg-offscreen';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(e) {}
    ta.remove();
    done(ok);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function(){ done(true); }, fallback);
  } else {
    fallback();
  }
}

function renderContact(body){
  head(body, 'CONTACT', 'Every place you can find me.');
  var list = DW.channels || [];
  var grid = el('div', 'pg-grid slim');
  for (var i = 0; i < list.length; i++) {
    (function(ch){
      var url = (DW.links || {})[ch.id];
      var c = el('article', 'pg-card chan');
      if (!DW.safeUrl(url) && !ch.handle) { c.classList.add('soon'); }
      add(c, el('h4', null, ch.name));
      if (ch.note) { add(c, el('p', null, ch.note)); }
      if (ch.handle) { add(c, el('div', 'pg-handle', ch.handle)); }
      var acts = el('div', 'pg-actions left');
      if (DW.safeUrl(url)) { add(acts, linkBtn('OPEN', url, 'go')); }
      else if (!ch.handle) { add(acts, el('span', 'pg-btn off', 'COMING SOON')); }
      if (ch.copy && ch.handle) {
        add(acts, button('COPY NAME', '', function(){
          copyText(ch.handle, function(ok){ toast(ok ? 'Copied ' + ch.handle : 'Could not copy. It is: ' + ch.handle); });
        }));
      }
      add(c, acts);
      grid.appendChild(c);
    })(list[i]);
  }
  body.appendChild(grid);
}

function creditLine(it){
  var line = el('li', 'pg-credit');
  var verb = 'This part was taken from';
  if (it.kind == 'inspiration') { verb = 'This part was inspired by'; }
  else if (it.kind == 'service') { verb = 'This part uses'; }
  else if (it.kind == 'music') { verb = ''; }

  var main = el('div', 'cr-main');
  if (it.part) { add(main, el('b', null, it.part + ': ')); }
  if (verb) { main.appendChild(document.createTextNode(verb + ' ')); }
  var from = it.from || 'unknown';
  if (DW.safeUrl(it.url)) {
    var a = el('a', null, from);
    a.href = DW.safeUrl(it.url);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    main.appendChild(a);
  } else {
    main.appendChild(el('span', 'cr-name', from));
  }
  if (it.by) { main.appendChild(document.createTextNode(' by ' + it.by)); }
  line.appendChild(main);
  if (it.license) { line.appendChild(el('div', 'cr-lic', it.license)); }
  return line;
}

function renderCredits(body){
  var C = DW.credits || {};
  var Lc = DW.license || {};
  head(body, 'CREDITS', 'Things I took from, learned from, or was inspired by.');

  var items = C.items || [];
  if (!items.length) { empty(body, 'Nothing here yet.'); }
  else {
    var ul = el('ul', 'pg-credits');
    for (var i = 0; i < items.length; i++) { ul.appendChild(creditLine(items[i])); }
    body.appendChild(ul);
  }
  if (C.trademark) { add(body, el('p', 'pg-note', C.trademark)); }

  /* license */
  var sec = el('section', 'pg-license');
  add(sec, el('h3', 'pg-h3', 'LICENSE'));
  add(sec, el('p', 'pg-p', Lc.summary || ''));
  var lic = el('p', 'pg-p');
  lic.appendChild(document.createTextNode('Licensed under '));
  if (DW.safeUrl(Lc.link)) {
    var la = el('a', null, Lc.name || 'CC BY 4.0');
    la.href = DW.safeUrl(Lc.link);
    la.target = '_blank';
    la.rel = 'noopener noreferrer';
    lic.appendChild(la);
  } else {
    lic.appendChild(document.createTextNode(Lc.name || ''));
  }
  lic.appendChild(document.createTextNode('.'));
  sec.appendChild(lic);

  var credit = el('div', 'pg-copy');
  add(credit, el('code', null, Lc.credit || ''));
  add(credit, button('COPY CREDIT', '', function(){
    copyText(Lc.credit || '', function(ok){ toast(ok ? 'Credit line copied' : 'Could not copy'); });
  }));
  add(sec, el('p', 'pg-note', 'Suggested credit:'), credit);

  if ((Lc.not || []).length) {
    add(sec, el('h3', 'pg-h3', 'NOT COVERED'));
    var nu = el('ul', 'pg-ul');
    for (var j = 0; j < Lc.not.length; j++) { nu.appendChild(el('li', null, Lc.not[j])); }
    sec.appendChild(nu);
  }
  if (Lc.commission) { add(sec, el('p', 'pg-p', Lc.commission)); }
  body.appendChild(sec);

  if ((DW.arg || {}).show && DW.arg.whisper) {
    add(body, el('p', 'pg-whisper', DW.arg.whisper));
  }
}

/* ---------- request builder ---------- */

function renderBuilder(body){
  var prof = DW.profile || {};
  var T = tiers();
  head(body, 'REQUEST BUILDER', 'Fill this in and I write the message. Copy it, then send it to me on Ko-fi or Discord. ' + (prof.status ? '[' + prof.status + ']' : ''));

  var form = el('div', 'pg-form');
  function field(label, input, wide){
    var f = el('label', 'pg-field' + (wide ? ' wide' : ''));
    add(f, el('span', null, label), input);
    return f;
  }
  function input(type, ph){
    var i = el('input');
    i.type = type;
    if (ph) { i.placeholder = ph; }
    i.maxLength = 200;
    return i;
  }

  var service = el('select');
  var svc = openServices();
  for (var i = 0; i < svc.length; i++) {
    var o = el('option', null, svc[i].name);
    o.value = svc[i].id;
    service.appendChild(o);
  }
  var tier = el('select');
  Object.keys(T).forEach(function(k){
    var o = el('option', null, T[k].name + ' (' + T[k].tag.toLowerCase() + ') - ' + usd(T[k].perAsset) + ' per asset');
    o.value = k;
    tier.appendChild(o);
  });
  var assets = input('number'); assets.min = '1'; assets.max = '99'; assets.value = '1';
  var pay = el('select');
  [['usd', 'Dollars (Ko-fi)'], ['robux', 'Robux']].forEach(function(p){
    var o = el('option', null, p[1]); o.value = p[0]; pay.appendChild(o);
  });
  var via = el('select');
  [['kofi', 'Ko-fi DM'], ['discord', 'Discord DM']].forEach(function(p){
    var o = el('option', null, p[1]); o.value = p[0]; via.appendChild(o);
  });
  var who = input('text', 'Your name or username');
  var deadline = input('text', 'e.g. none, or a date');
  var refs = input('text', 'Links to references');
  var details = el('textarea');
  details.rows = 5;
  details.maxLength = 1500;
  details.placeholder = 'Describe what you want. The more detail the better.';

  add(form,
    field('What do you need?', service),
    field('Package', tier),
    field('How many assets?', assets),
    field('Pay with', pay),
    field('Your name', who),
    field('Contact me through', via),
    field('Deadline', deadline),
    field('References', refs),
    field('Details', details, true));
  body.appendChild(form);

  var summary = el('div', 'pg-total');
  var preview = el('textarea', 'pg-preview');
  preview.readOnly = true;
  preview.rows = 11;
  preview.setAttribute('aria-label', 'your message');
  add(body, summary, preview);

  function build(){
    var t = T[tier.value] || T.standard;
    var s = null;
    for (var k = 0; k < svc.length; k++) { if (svc[k].id == service.value) { s = svc[k]; } }
    var n = Math.max(1, Math.min(99, parseInt(assets.value, 10) || 1));
    var total = n * t.perAsset;
    var robuxPay = pay.value == 'robux';

    summary.textContent = '';
    var cost = robuxPay ? robux(total) : usd(total);
    add(summary, el('b', null, cost), el('span', null, '  base price  /  ' + (robuxPay ? usd(total) : robux(total)) + '  /  ' + t.name));

    var lines = [
      'COMMISSION REQUEST',
      '------------------',
      'Name: ' + (who.value.trim() || '(not given)'),
      'Service: ' + (s ? s.name : '-'),
      'Package: ' + t.name + ' (' + t.tag.toLowerCase() + ')',
      'Assets: ' + n,
      'Base price: ' + usd(total) + ' (' + robux(total) + ')',
      'Paying with: ' + (robuxPay ? 'Robux' : 'Dollars') + ' through ' + ((DW.pricing || {}).payment || 'Ko-fi'),
      'Revisions: ' + t.freeRevisions + ' free, extra ' + usd(t.extraRevision) + (t.plus ? '+' : '') + ' each',
      'Credit: ' + (t.credit ? 'I will credit ' + (prof.name || 'you') : 'not required'),
      'Deadline: ' + (deadline.value.trim() || 'none'),
      'References: ' + (refs.value.trim() || 'none'),
      '',
      'Details:',
      details.value.trim() || '(write what you want here)'
    ];
    preview.value = lines.join('\n');
  }
  [service, tier, assets, pay, via, who, deadline, refs, details].forEach(function(f){
    f.addEventListener('input', build);
    f.addEventListener('change', build);
  });
  build();

  function copyAnd(after){
    build();
    copyText(preview.value, function(ok){
      if (ok) { trophy('client'); }
      after(ok);
    });
  }

  var acts = el('div', 'pg-actions');
  add(acts,
    button('COPY MESSAGE', '', function(){
      copyAnd(function(ok){ toast(ok ? 'Message copied' : 'Could not copy. Select the box and copy it by hand.'); });
    }),
    button('\u2715  SEND ON KO-FI', 'go', function(){
      copyAnd(function(ok){
        var u = DW.safeUrl((DW.links || {}).kofi);
        if (!u) { toast('Message copied. Ko-fi link is not set up yet.'); return; }
        toast(ok ? 'Copied. Paste it into the Ko-fi DM.' : 'Opening Ko-fi. Copy the message by hand.');
        DW.openLink(u);
      });
    }),
    button('SEND ON DISCORD', '', function(){
      copyAnd(function(ok){
        var u = DW.safeUrl((DW.links || {}).discord);
        var name = prof.discord || '';
        toast((ok ? 'Copied. ' : '') + (name ? 'My Discord: ' + name : 'Discord is not set up yet.'));
        if (u) { DW.openLink(u); }
      });
    }));
  body.appendChild(acts);
  add(body, el('p', 'pg-note', 'Nothing is sent from this page. It only writes and copies the message, so you stay in control.'));

  P.builder = {
    preselect: function(id){
      for (var q = 0; q < service.options.length; q++) {
        if (service.options[q].value == id) { service.selectedIndex = q; }
      }
      build();
    }
  };
}

/* ---------- page table ---------- */

var defs = {
  websites: { title: 'SHOWCASE / WEBSITES', render: function(b){
    head(b, 'WEBSITES', 'Sites I have built.');
    cardGrid(b, (DW.works || {}).websites, 'projects', 'VISIT SITE', 'website');
  } },
  music: { title: 'SHOWCASE / MUSIC', render: renderMusic },
  games: { title: 'SHOWCASE / GAMES', render: function(b){
    head(b, 'GAMES', 'Games I have made or am making.');
    cardGrid(b, (DW.works || {}).games, 'games', 'PLAY', 'game');
  } },
  videos: { title: 'SHOWCASE / VIDEOS', render: renderVideos },
  images: { title: 'SHOWCASE / IMAGES', render: renderImages },
  offers: { title: 'SERVICES', render: renderServices },
  packages: { title: 'PACKAGES', render: renderPackages },
  payment: { title: 'PAYMENT', render: renderPayment },
  builder: { title: 'REQUEST BUILDER', render: renderBuilder },
  terms: { title: 'TERMS', render: renderTerms },
  contact: { title: 'CONTACT', render: renderContact },
  faq: { title: 'FAQ', render: renderFaq },
  credits: { title: 'CREDITS AND LICENSE', render: renderCredits }
};
P.ids = Object.keys(defs);

P.open = function(spec){
  var parts = String(spec || '').split('#');
  var id = parts[0];
  var d = defs[id];
  if (!d) { toast('That page does not exist yet'); return false; }
  var w = wins[id];
  if (!w) {
    w = DW.win('pg-' + id, d.title);
    w.el.classList.add('pg');
    try { d.render(w.body); }
    catch(e) {
      console.error('[dweeb] page ' + id + ' broke:', e);
      w.body.textContent = '';
      empty(w.body, 'This page failed to load.');
    }
    w.onclose = function(){ stopOthers(null); };
    wins[id] = w;
  }
  w.open();
  w.body.scrollTop = 0;
  return true;
};

P.init = function(){};
})();
