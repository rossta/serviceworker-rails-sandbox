import Logger from 'utils/logger';
const logger = new Logger('[push-simple/serviceworker]');

function onPush(event) {
  logger.log("Received push message", event);

  let title = (event.data && event.data.text()) || "Yay a message";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  var icon = '/assets/turtle-logo-120x120.png';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
}

function onPushSubscriptionChange(event) {
  logger.log("Push subscription change event detected", event);
}

self.addEventListener("push", onPush);
self.addEventListener("pushsubscriptionchange", onPushSubscriptionChange);
