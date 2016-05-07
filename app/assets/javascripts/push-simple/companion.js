import Logger from 'utils/logger';
const logger = new Logger('[push-simple/client]');

let isPushEnabled = false;

window.addEventListener("load", function onLoad() {
  getPushButton().addEventListener('change', function onClick() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  })
});

if (navigator.serviceWorker) {
  logger.log('Registering serviceworker');
  navigator.serviceWorker.register('serviceworker.js', { scope: './' })
  .then(initializeState);
} else {
  logger.warn('Service workers are not supported in your browser');
}

function initializeState() {
  if (!ServiceWorkerRegistration.prototype.showNotification) {
    logger.warn('Notifications are not supported in your browser');
    return;
  }

  if (Notification.permissions === 'denied') {
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
      let pushButton = document.querySelector('.js-push-button');

      if (!subscription) {
        logger.log('You are not currently subscribed to push notifications');
        pushButtonUnsubscribed();
        return;
      }

      // TODO
      // Send subscription.endpoint to server and save in data store to
      // send a push message at a later date
      sendSubscriptionToServer(subscription);
      logger.log('You are currently subscribed to push notifications', subscription);
      pushButtonSubscribed();
    })
    .catch((error) => {
      logger.warn('Error during getSubscription()', error);
    });
  })

}

function subscribe() {
  disablePushButton();

  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {

    serviceWorkerRegistration.pushManager
    .subscribe({userVisibleOnly: true})
    .then((subscription) => {
      pushButtonSubscribed();

      logger.log('Permission to send notifications granted', subscription, JSON.stringify(subscription));
      // TODO
      // Send subscription.endpoint to server and save in data store to
      // send a push message at a later date
      // sendSubscriptionToServer(subscription);
    })
    .catch((e) => {
      if (Notification.permission === 'denied') {
        logger.warn('Permission to send notifications denied');
        disablePushButton();
      } else {
        logger.error('Unable to subscribe to push', e);
        pushButtonUnsubscribed();
      }
    })
  })
}

function unsubscribe() {
  let pushButton = document.querySelector('.js-push-button');
  let pushButtonLabel = document.querySelector('.js-push-button-label');
  pushButton.disabled = true;

  navigator.serviceWorker.ready
  .then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.getSubscription()
    .then((subscription) => {
      if (!subscription) {
        return pushButtonUnsubscribed();
      }

      logger.log('Unsubscribing from push notifications', subscription);

      let subscriptionId = subscription.subscriptionId;
      // TODO
      // Remove subscriptionId from backend

      subscription.unsubscribe()
      .then(pushButtonUnsubscribed)
      .catch((e) => {
        logger.error('Error thrown while unsubscribing from push messaging', e);
      })
    })
  })
}

function pushButtonUnsubscribed() {
  isPushEnabled = false;
  setPushLabel('Enable push messages');
  enablePushButton();
  uncheckPushButton();
}

function pushButtonSubscribed() {
  isPushEnabled = true;
  setPushLabel('Disable push messages');
  enablePushButton();
  checkPushButton();
}

function enablePushButton() {
  getPushButton().disabled = false;
}

function checkPushButton() {
  let pushButton = getPushButton();
  if (pushButton.checked) return;
  pushButton.checked = true;
}

function uncheckPushButton() {
  let pushButton = getPushButton();
  if (!pushButton.checked) return;
  pushButton.checked = false;
}

function disablePushButton() {
  getPushButton().disabled = true;
}

function getPushButton() {
  return document.querySelector('.js-push-button');
}

function setPushLabel(text) {
  return document.querySelector('.js-push-button-label').textContent = text;
}

function sendSubscriptionToServer(subscription) {
  window.usersubscription = JSON.stringify(subscription);
  let body = JSON.stringify({
    subscription: subscription,
    type: "google"
  });

  fetch("/subscribe", {
    headers: formHeaders(),
    method: 'POST',
    credentials: 'include',
    body: body
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
