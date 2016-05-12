import Logger from 'utils/logger';
const logger = new Logger('[push-simple/client]');

let isPushEnabled = false;

window.addEventListener("load", function onLoad() {
  getPushToggle().addEventListener('change', function onClick() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

  getSendPushButton().addEventListener('click', function onClick() {
    if (isPushEnabled) {
      sendNotification();
    } else {
      alert("Cannot send notification while push messages are disabled");
    }
  });
});

if (navigator.serviceWorker) {
  logger.log('Registering serviceworker');
  navigator.serviceWorker.register('serviceworker.js', { scope: './' })
  .then(initializeState);
} else {
  logger.warn('Service workers are not supported in your browser');
}

function sendNotification() {
  fetch("/push", {
    headers: formHeaders(),
    method: 'POST',
    credentials: 'include'
  })
    .catch((e) => {
      logger.error("Could not save subscription", e);
    });

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
      let pushToggle = document.querySelector('.js-push-toggle');

      if (!subscription) {
        logger.log('You are not currently subscribed to push notifications');
        pushToggleUnsubscribed();
        return;
      }

      sendSubscriptionToServer(subscription)
        .then(pushToggleSubscribed)
    })
    .catch((error) => {
      logger.warn('Error during getSubscription()', error);
    });
  })

}

function subscribe() {
  disablePushToggle();

  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {

    serviceWorkerRegistration.pushManager
    .subscribe({userVisibleOnly: true})
    .then((subscription) => {
      pushToggleSubscribed();

      logger.log('Permission to send notifications granted', subscription.toJSON());
      // TODO
      // Send subscription.endpoint to server and save in data store to
      // send a push message at a later date
      // sendSubscriptionToServer(subscription);
    })
    .catch((e) => {
      if (Notification.permission === 'denied') {
        logger.warn('Permission to send notifications denied');
        disablePushToggle();
      } else {
        logger.error('Unable to subscribe to push', e);
        pushToggleUnsubscribed();
      }
    })
  })
}

function unsubscribe() {
  let pushToggle = document.querySelector('.js-push-toggle');
  let pushToggleLabel = document.querySelector('.js-push-toggle-label');
  pushToggle.disabled = true;

  navigator.serviceWorker.ready
    .then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if (!subscription) {
          return pushToggleUnsubscribed();
        }

        logger.log('Unsubscribing from push notifications', subscription.toJSON());

        subscription.unsubscribe()
          .then(pushToggleUnsubscribed)
          .catch((e) => {
            logger.error('Error thrown while unsubscribing from push messaging', e);
          })
      })
    });
}

function pushToggleUnsubscribed() {
  isPushEnabled = false;
  setPushLabel('Enable push messages');
  enablePushToggle();
  uncheckPushToggle();
}

function pushToggleSubscribed() {
  isPushEnabled = true;
  setPushLabel('Disable push messages');
  enablePushToggle();
  checkPushToggle();
}

function enablePushToggle() {
  getPushToggle().disabled = false;
}

function checkPushToggle() {
  let pushToggle = getPushToggle();
  if (pushToggle.checked) return;
  pushToggle.checked = true;
}

function uncheckPushToggle() {
  let pushToggle = getPushToggle();
  if (!pushToggle.checked) return;
  pushToggle.checked = false;
}

function disablePushToggle() {
  getPushToggle().disabled = true;
}

function getSendPushButton() {
  return document.querySelector('.js-send-push-button');
}

function getPushToggle() {
  return document.querySelector('.js-push-toggle');
}

function setPushLabel(text) {
  return document.querySelector('.js-push-toggle-label').textContent = text;
}

function sendSubscriptionToServer(subscription) {
  window.usersubscription = JSON.stringify(subscription);
  let body = JSON.stringify({
    subscription: subscription,
    type: "google"
  });

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
