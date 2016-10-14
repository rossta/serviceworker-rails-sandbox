import Logger from 'utils/logger';
import {alertSWSupport} from 'utils/alertonce';
const logger = new Logger('[push-simple/client]');

function ready() {
  if (navigator.serviceWorker) {
    logger.log('Registering serviceworker');
    navigator.serviceWorker.register('/push-simple/serviceworker.js')
      .then(function(reg) {
        logger.log(reg.scope, 'register');
        logger.log('Service worker change, registered the service worker');
      });
  } else {
    alertSWSupport();
  }
}

export { ready };
