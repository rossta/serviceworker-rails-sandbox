import Logger from 'utils/logger';
const logger = new Logger('[push-react/serviceworker]');

logger.log("Hello!");

function onPush(event) {
  logger.log("Received push message", event);

  let title = (event.data && event.data.text()) || "Yay a message";
  let body = "We have received a push message";
  let tag = "push-react-demo-notification-tag";
  var icon = '/assets/turtle-logo-120x120.png';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
}

self.addEventListener("push", onPush);
