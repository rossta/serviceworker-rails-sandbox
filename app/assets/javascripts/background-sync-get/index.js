import logger from './logger';

if (navigator.serviceWorker) {
  logger.log('Registering serviceworker');
  navigator.serviceWorker.register('serviceworker.js', { scope: './' })
    .then(backgroundSyncOnClick);
} else {
  logger.log('Service Worker is not supported in your browser');
  syncOnClick();
}

function backgroundSyncOnClick(registration) {
  logger.log('Service worker registered', registration);
  document.getElementById('request-button').addEventListener('click', () => {
    registration.sync.register('image-fetch').then(() => {
      logger.log('Sync registered');
    });
  });
}

function standardOnClick() {
  document.getElementById('request-button').addEventListener('click', () => {
    logger.log('Fetch image normally');
  });
}
