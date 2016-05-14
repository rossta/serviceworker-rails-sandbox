import { render, dismount } from 'push-simple/components';
import Logger from 'utils/logger';
const logger = new Logger('[push-simple/app]');

function setup(onSubscribed, onUnsubscribed) {
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
      logger.log('Initializing push button state');
      serviceWorkerRegistration.pushManager.getSubscription()
        .then((subscription) => {
          if (!subscription) {
            logger.log('You are not currently subscribed to push notifications');
            onUnsubscribed();
            return;
          }

          onSubscribed(subscription);
        })
        .catch((error) => {
          logger.warn('Error during getSubscription()', error);
        });
    });
}

function subscribe(onSubscribed, onUnsubscribed) {
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager
      .subscribe({userVisibleOnly: true})
      .then(onSubscribed)
      .catch((e) => {
        if (Notification.permission === 'denied') {
          logger.warn('Permission to send notifications denied');
        } else {
          logger.error('Unable to subscribe to push', e);
        }
        onUnsubscribed();
      })
  });
}

function unsubscribe(onUnsubscribed) {
    navigator.serviceWorker.ready
      .then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.pushManager.getSubscription()
        .then((subscription) => {
          if (!subscription) {
            return onUnsubscribed();
          }

          subscription.unsubscribe()
          .then(onUnsubscribed)
          .catch((e) => {
            logger.error('Error thrown while unsubscribing from push messaging', e);
          })
      })
      });
}

function serverSubscribe(subscription) {
  window.usersubscription = JSON.stringify(subscription);
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

function serverUnsubscribe() {
  window.usersubscription = null;

  return fetch("/unsubscribe", {
    headers: formHeaders(),
    method: 'DELETE',
    credentials: 'include'
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
  })
  .catch((e) => {
    logger.error("Could not save subscription", e);
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

function ready() {
  return render({
    setup,
    subscribe,
    unsubscribe,
    serverSubscribe,
    serverUnsubscribe,
    sendNotification,
  })
}

export { ready, dismount };
