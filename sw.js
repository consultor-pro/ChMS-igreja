// Service Worker do Igreja CRM
// Guarda uma cópia do app no dispositivo para ele abrir mesmo sem internet.
//
// IMPORTANTE: toda vez que você atualizar o index.html e subir uma nova
// versão, mude o número abaixo (ex: 'igreja-crm-v2'). Isso força o navegador
// a baixar a versão nova em vez de continuar usando a cópia antiga salva.
const CACHE_NAME = 'igreja-crm-v3';

const ARQUIVOS_ESSENCIAIS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Estratégia network-first: tenta buscar a versão mais nova da internet;
// se não conseguir (offline), usa a cópia salva localmente.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
