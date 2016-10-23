import logger from './logger';

export function fetchDog() {
  fetch('/sync')
  .then(response => response.text())
  .then(text => {
    logger.log('Request successful', text);
    return text;
  })
  .catch(function (error) {
    logger.log('Request failed', error);
  });
}
