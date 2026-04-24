const CACHE_NAME = 'cesta-livre-v5';
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
// INSTALAÇÃO
// ============================================
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando v3...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos em cache');
        // Força o novo SW a assumir imediatamente
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Erro ao adicionar ao cache:', error);
      })
  );
});

// ============================================
// FETCH - Cache First (com atualização em background)
// ============================================
self.addEventListener('fetch', event => {
  // Não armazena requisições da API do Supabase
  if (event.request.url.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Atualiza o cache em background
          fetch(event.request).then(freshResponse => {
            if (freshResponse && freshResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, freshResponse);
              });
            }
          }).catch(() => {
            // Ignora erros de atualização silenciosamente
          });
          
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Service Worker: Erro ao atualizar cache:', error);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Erro ao buscar da rede:', error);
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
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
  console.log('Service Worker: Ativado v3');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Cache limpo');
        // Assume o controle de todas as páginas imediatamente
        return self.clients.claim();
      })
      .then(() => {
        // Notifica todos os clientes sobre a atualização
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_UPDATED',
              message: 'App atualizado com sucesso!'
            });
          });
        });
      })
  );
});

// ============================================
// MENSAGENS - Comunicação com a página
// ============================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Skip waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_VERSION') {
    if (event.source) {
      event.source.postMessage({
        type: 'VERSION_INFO',
        version: CACHE_NAME
      });
    }
  }
});

// ============================================
// NOTIFICAÇÕES PUSH
// ============================================
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível',
    icon: '/src/icons/icon-192x192.png',
    badge: '/src/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'atualizacao',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Cesta Livre 🛒', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/index.html')
  );
});