import {cacheKey} from 'utils/caching';
import Logger from 'utils/logger';
const logger = new Logger('[cache-then-network/serviceworker]');

self.addEventListener('install', function onInstall() {
  logger.log('onInstall')
});

self.addEventListener('fetch', function onFetch(event) {
  let request = event.request;
  let url = new URL(request.url);

  if (!url.pathname.endsWith('.json')) { return; }
  logger.log('onFetch', request.url);

  event.respondWith(
    caches.open(cacheKey('cache-then-network')).then((cache) => {
      return fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      });
    })
  );
});
