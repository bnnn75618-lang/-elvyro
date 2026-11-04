// ELVYRO app shell: works offline-to-start, always fetches fresh when online. Data calls (Apps Script) are never cached.
const C = "elvyro-v46";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(C).then((c) => c.addAll(["./", "index.html", "icon-192.png"]).catch(() => {}))); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  const fresh = e.request.mode === "navigate" || //(index.html|version.json)?$/.test(u.pathname) || u.pathname.endsWith("version.json");
  e.respondWith(fetch(e.request, fresh ? { cache: "no-store" } : undefined).then((r) => { const copy = r.clone(); caches.open(C).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html"))));
});
