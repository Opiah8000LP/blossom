(function(){

if (window.top !== window.self) {
  try {
    window.top.location.href = window.self.location.href;
  } catch(e) {
    document.documentElement.innerHTML = '';
  }
}

window.__miss = [];
window.__err = {};

// a script crashed
addEventListener('error', function(e){
  if (!e.filename || !e.message) { return; }
  var file = e.filename.replace(/\?.*$/, '');
  file = file.replace(/^.*\/(js\/[^\/]+)$/, '$1');
  if (!window.__err[file]) {
    window.__err[file] = e.message + ' (line ' + e.lineno + ')';
  }
});

addEventListener('error', function(e){
  var t = e.target;
  if (!t || t.tagName !== 'SCRIPT') { return; }
  var src = (t.getAttribute('src') || '').replace(/\?.*$/, '');
  if (/^js\/[\w.-]+\.js$/.test(src)) { window.__miss.push(src); }
}, true);

var secure = location.protocol == 'https:' || location.hostname == 'localhost' || location.hostname == '127.0.0.1';
if ('serviceWorker' in navigator && secure) {
  var registerWorker = function(){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  };
  if (document.readyState == 'complete') { registerWorker(); }
  else { addEventListener('load', registerWorker); }
}

})();
