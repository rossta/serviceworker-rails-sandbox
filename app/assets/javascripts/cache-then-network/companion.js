import Logger from 'utils/logger';
import {alertSWSupport} from 'utils/alertOnce';
const logger = new Logger('[cache-then-network/client]');

function ready() {
  if (navigator.serviceWorker) {
    logger.log('Registering serviceworker');
    navigator.serviceWorker.register('serviceworker.js', { scope: './' })
      .then(function(reg) {
        logger.log(reg.scope, 'register');
        logger.log('Service worker change, registered the service worker');
      });
  } else {
    alertSWSupport();
  }
}

export { ready };
