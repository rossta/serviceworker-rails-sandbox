import logger from './logger';
import { fetchDog } from './requests';

self.addEventListener('sync', function (event) {
  logger.log('sync event', event);
  let text;
  if (event.tag === 'image-fetch') {
    text = event.waitUntil(fetchDog());
    logger.log('Image fetch in serviceworker', text);
  }
});
