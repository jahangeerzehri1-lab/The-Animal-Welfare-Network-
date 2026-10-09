/* AWN app: works offline for pages and photos you have already opened.
   When you change index.html or add new images, change VERSION to publish the update. */
const VERSION = "awn-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "maskable-512.png", "favicon-32.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.hostname === "script.google.com") return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(VERSION).then((c) => c.put("index.html", cp)); return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {
    if (res && (res.ok || res.type === "opaque")) { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(r, cp)); }
    return res;
  }).catch(() => hit)));
});
