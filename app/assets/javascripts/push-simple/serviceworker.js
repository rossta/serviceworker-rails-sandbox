import Logger from 'utils/logger';
const logger = new Logger('[push-simple/serviceworker]');

logger.log("Hello!");

function onPush(event) {
  logger.log("Received push message", event);

  let title = "Yay a message";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";

  event.waitUntil(
    self.registration.showNotification(title, { body, tag })
  )
}

self.addEventListener("push", onPush);
