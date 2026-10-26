/* Lord's Day English — offline cache. build-site.ps1 fills in the version and file list. */
const CACHE = "lde-DFFBE6B3C4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./audio/w1/01.mp3",
  "./audio/w1/02.mp3",
  "./audio/w1/03.mp3",
  "./audio/w1/04.mp3",
  "./audio/w1/05.mp3",
  "./audio/w1/06.mp3",
  "./audio/w1/07.mp3",
  "./audio/w1/08.mp3",
  "./audio/w1/09.mp3",
  "./audio/w1/10.mp3",
  "./audio/w1/11.mp3",
  "./audio/w1/12.mp3",
  "./audio/w1/13.mp3",
  "./audio/w1/14.mp3",
  "./audio/w1/15.mp3",
  "./audio/w1/16.mp3",
  "./audio/w1/17.mp3",
  "./audio/w1/18.mp3",
  "./audio/w1/19.mp3",
  "./audio/w1/20.mp3",
  "./audio/w1/21.mp3",
  "./audio/w1/22.mp3",
  "./audio/w1/23.mp3",
  "./audio/w1/24.mp3",
  "./audio/w1/25.mp3",
  "./audio/w1/26.mp3",
  "./audio/w1/27.mp3",
  "./audio/w1/28.mp3",
  "./audio/w1/29.mp3",
  "./audio/w1/30.mp3",
  "./audio/w1/31.mp3",
  "./audio/w1/32.mp3",
  "./audio/w1/33.mp3",
  "./audio/w1/34.mp3",
  "./audio/w1/35.mp3",
  "./audio/w1/36.mp3",
  "./audio/w1/37.mp3",
  "./audio/w1/38.mp3",
  "./audio/w1/39.mp3",
  "./audio/w1/40.mp3",
  "./audio/w1/41.mp3",
  "./audio/w1/42.mp3",
  "./audio/w1/43.mp3",
  "./audio/w1/44.mp3",
  "./audio/w1/45.mp3",
  "./audio/w1/46.mp3",
  "./audio/w1/47.mp3",
  "./audio/w1/48.mp3",
  "./audio/w1/49.mp3",
  "./audio/w1/50.mp3",
  "./audio/w1/51.mp3",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/bg-classroom.jpg",
  "./img/bg-entrance.jpg",
  "./img/bg-hall.jpg",
  "./img/bg-sanctuary.jpg",
  "./img/calder.png",
  "./img/eli.png",
  "./img/hannah.png",
  "./img/hart.png",
  "./weeks/week1-voice.js",
  "./weeks/week1.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("lde-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Google Fonts: serve the cached copy, refresh it in the background
  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.open(CACHE + "-fonts").then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // game files: cache first (audio is fetched with Range requests, so match ignoring headers)
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req)));
});
