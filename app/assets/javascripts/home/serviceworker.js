import {version} from 'utils/caching';

import Logger from 'utils/logger';
const logger = new Logger('[home/serviceworker]');

self.addEventListener('install', function onInstall(event) {
  logger.log('install event started.');
  self.skipWaiting();
});

self.addEventListener('activate', function onActivate() {
  logger.log('activate event started.');

  return caches
    .keys()
    .then((keys) => {
      return Promise.all( // We return a promise that settles when all outdated caches are deleted.
        keys
         .filter((key) => !key.startsWith(version))
         .map((key) => caches.delete(key))
      );
    })
    .then(() => {
      logger.log('activate event completed', 'removeOldCache completed.');
    });
});
