// English Coach service worker. Its caches all start with 'english-coach-' and it only ever deletes caches with that prefix.
const PREFIX='english-coach-';
const CACHE=PREFIX+'v7';
const FILES=["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;
  // network first so updates arrive; fall back to the cache when offline
  e.respondWith(fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;})
    .catch(()=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('index.html'):undefined))));
});
