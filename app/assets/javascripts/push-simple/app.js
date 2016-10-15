import Logger from 'utils/logger';
const logger = new Logger('[push-simple/app]');

function ready() {
  setup(logSubscription);
}

function setup(onSubscribed) {
  logger.log('Setting up push subscription');

  if (!window.PushManager) {
    logger.warn('Push messaging is not supported in your browser');
  }

  if (!ServiceWorkerRegistration.prototype.showNotification) {
    logger.warn('Notifications are not supported in your browser');
    return;
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        logger.log('Permission to receive notifications granted!');
        subscribe(onSubscribed);
      }
    });
    return;
  } else {
    logger.log('Permission to receive notifications granted!');
    subscribe(onSubscribed);
  }
}

function subscribe(onSubscribed) {
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    const pushManager = serviceWorkerRegistration.pushManager
    pushManager.getSubscription()
    .then((subscription) => {
      if (subscription) {
        refreshSubscription(pushManager, subscription, onSubscribed);
      } else {
        pushManagerSubscribe(pushManager, onSubscribed);
      }
    })
  });
}

function refreshSubscription(pushManager, subscription, onSubscribed) {
  logger.log('Refreshing subscription');
  return subscription.unsubscribe().then((bool) => {
    pushManagerSubscribe(pushManager);
  });
}

function pushManagerSubscribe(pushManager, onSubscribed) {
  logger.log('Subscribing started...');

  pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: window.publicKey
  })
  .then(onSubscribed)
  .then(() => { logger.log('Subcribing finished: success!')})
  .catch((e) => {
    if (Notification.permission === 'denied') {
      logger.warn('Permission to send notifications denied');
    } else {
      logger.error('Unable to subscribe to push', e);
    }
  });
}

function logSubscription(subscription) {
  logger.log("Current subscription", subscription.toJSON());
}

function getSubscription() {
  return navigator.serviceWorker.ready
  .then((serviceWorkerRegistration) => {
    return serviceWorkerRegistration.pushManager.getSubscription()
    .catch((error) => {
      logger.warn('Error during getSubscription()', error);
    });
  });
}

function sendNotification() {
  getSubscription().then((subscription) => {
    return fetch("/push", {
      headers: formHeaders(),
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ subscription: subscription.toJSON() })
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
  })
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
