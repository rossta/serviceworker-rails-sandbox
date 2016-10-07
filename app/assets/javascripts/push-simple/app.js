import Logger from 'utils/logger';
const logger = new Logger('[push-simple/app]');

function ready() {
  setup(serverSubscribe);
}

function setup(onSubscribed) {
  if (!ServiceWorkerRegistration.prototype.showNotification) {
    logger.warn('Notifications are not supported in your browser');
    return;
  }

  if (Notification.permission === 'denied') {
    logger.warn('You have blocked notifications');
    return;
  }

  if (!window.PushManager) {
    logger.warn('Push messaging is not supported in your browser');
  }

  navigator.serviceWorker.ready
  .then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.getSubscription()
    .then((subscription) => {
      if (!subscription) {
        logger.log('You are not currently subscribed to push notifications. Attempting to subscrib...');
        subscribe(onSubscribed);
        return;
      }

      onSubscribed(subscription);
    })
    .catch((error) => {
      logger.warn('Error during getSubscription()', error);
    });
  });
}

function subscribe(onSubscribed) {
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: window.publicKey
    })
    .then(onSubscribed)
    .catch((e) => {
      if (Notification.permission === 'denied') {
        logger.warn('Permission to send notifications denied');
      } else {
        logger.error('Unable to subscribe to push', e);
      }
    })
  });
}

function serverSubscribe(subscription) {
  window.usersubscription = JSON.stringify(subscription);
  logger.log('Subscribing on server', subscription.toJSON());
  let body = JSON.stringify({ subscription });

  return fetch("/subscribe", {
    headers: formHeaders(),
    method: 'POST',
    credentials: 'include',
    body: body
  })
  .catch((e) => {
    logger.error("Could not save subscription", e);
  });
}

function sendNotification() {
  return fetch("/push", {
    headers: formHeaders(),
    method: 'POST',
    credentials: 'include'
  }).then((response) => {
    logger.log("Push response", response);
    if (response.status >= 500) {
      logger.error(response.statusText);
      alert("Sorry, there was a problem sending the notification. Try resubscribing to push messages and resending.");
    }
  })
  .catch((e) => {
    logger.error("Error sending notification", e);
  });

}

function formHeaders() {
  return new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': authenticityToken(),
  });
}

function authenticityToken() {
  return document.querySelector('meta[name=csrf-token]').content;
}

export {
  ready,
  sendNotification,
};

