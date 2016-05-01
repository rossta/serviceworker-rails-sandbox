import Logger from 'utils/logger';
const logger = new Logger('[cache-then-network/client]');

if (navigator.serviceWorker) {
  logger.log('Registering serviceworker');
  navigator.serviceWorker.register('serviceworker.js', { scope: './' })
    .then(function(reg) {
      logger.log(reg.scope, 'register');
      logger.log('Service worker change, registered the service worker');
    });
} else {
  logger.error('Service worker not supported in this browser');
}
