// Service Worker for Anchor PWA - Offline Support
const CACHE_VERSION = 'anchor-v1.1.0'
const CACHE_NAME = `anchor-${CACHE_VERSION}`

// Static assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
          // Log but don't fail if some assets are missing
          console.error('Cache addAll failed:', error)
        })
      })
      .then(() => self.skipWaiting()) // Activate immediately
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name.startsWith('anchor-'))
          .map((name) => {
            console.log('Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => self.clients.claim()) // Take control immediately
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip chrome-extension and other protocol requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response for caching
            const responseToCache = response.clone()

            // Cache the response (async, don't block)
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
              .catch((error) => {
                console.error('Cache put failed:', error)
              })

            return response
          })
          .catch(() => {
            // If network fails and no cache, return offline page
            if (event.request.destination === 'document') {
              return caches.match('/index.html')
            }
            // Return a simple offline response for other requests
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
          })
      })
  )
})
