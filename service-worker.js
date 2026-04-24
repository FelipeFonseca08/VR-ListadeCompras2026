const CACHE_NAME = 'cesta-livre-v2';
const urlsToCache = [
  '/',
  '/login.html',
  '/index.html',
  '/atualizar-senha.html',
  '/src/css/login.css',
  '/src/css/index.css',
  '/app.js',
  '/auth.js',
  '/reset-senha.js',
  '/supabaseClient.js',
  '/manifest.json',
  '/src/icons/favicon.ico',
  '/src/icons/icon-72x72.png',
  '/src/icons/icon-96x96.png',
  '/src/icons/icon-128x128.png',
  '/src/icons/icon-144x144.png',
  '/src/icons/icon-152x152.png',
  '/src/icons/icon-192x192.png',
  '/src/icons/icon-384x384.png',
  '/src/icons/icon-512x512.png'
];

// ============================================
// INSTALAÇÃO - Adiciona arquivos ao cache
// ============================================
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos em cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Erro ao adicionar ao cache:', error);
      })
  );
});

// ============================================
// FETCH - Busca do cache primeiro (Cache First)
// ============================================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrou no cache, retorna
        if (response) {
          return response;
        }
        
        // Se não encontrou, busca da rede
        return fetch(event.request)
          .then(response => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta e adiciona ao cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                // Não armazena requisições do Supabase (API)
                if (!event.request.url.includes('supabase.co')) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch(error => {
                console.error('Service Worker: Erro ao atualizar cache:', error);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Erro ao buscar da rede:', error);
            // Se for navegação, retorna a página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Para outros recursos, retorna erro
            return new Response('Recurso não disponível offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// ============================================
// ACTIVATE - Remove caches antigos
// ============================================
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativado');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Remove versões antigas do cache
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Cache limpo e atualizado');
        return self.clients.claim();
      })
  );
});

// ============================================
// MENSAGENS - Comunicação com a página
// ============================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ============================================
// NOTIFICAÇÕES PUSH (Opcional - futuro)
// ============================================
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível',
    icon: '/src/icons/icon-192x192.png',
    badge: '/src/icons/icon-72x72.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Cesta Livre', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/index.html')
  );
});