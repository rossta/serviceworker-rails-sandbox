import React from 'react';
import ReactDOM from 'react-dom';
import Logger from 'utils/logger';
const logger = new Logger('[push-simple/app]');

const SendMessageButton = React.createClass({
  onClick(e) {
    return this.props.onClick(e);
  },

  render() {
    let { isEnabled, isSubscribed } = this.props;
    let disabled = !isEnabled || !isSubscribed;
    let classNames = ["button"]
    if (!isSubscribed) {
      classNames.push("disabled");
    }

    return (
      <button
        onClick={this.onClick}
        className={classNames.join(' ')}
        >
        Send message
      </button>
    );
  }
});

const PushSubscriptionToggle = React.createClass({
  onChange(e) {
    return this.props.onChange(e);
  },

  getLabel() {
    return this.props.isSubscribed ?
      "Unsubscribe from push messages" :
      "Subscribe to push messages";
  },

  render() {
    let { isEnabled, isSubscribed } = this.props;

    return (
      <div className="push-subscription-toggle" onClick={this.onChange}>
        <label
          for="push-checkbox">
          {this.getLabel()}
        </label>
        <div className="switch">
          <input
            id="push-checkbox"
            className="cmn-toggle cmn-toggle-round-flat"
            type="checkbox"
            checked={isSubscribed}
            disabled={!isEnabled}
          />
          <label for="push-checkbox"></label>
        </div>
      </div>
    );
  }
});

const PushControls = React.createClass({
  getInitialState() {
    return {
      isSubscribed: false,
      isEnabled: true,
    };
  },

  componentDidMount() {
    const self = this;

    self.disable();

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
            if (!subscription) {
              logger.log('You are not currently subscribed to push notifications');
              self.onUnsubscribed();
              return;
            }

            self.onSubscribed();
          })
          .catch((error) => {
            logger.warn('Error during getSubscription()', error);
          });
      });
  },

  onChange() {
    if (this.state.isSubscribed) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  },

  onClick() {
    if (this.state.isSubscribed) {
      sendNotification();
    } else {
      alert("Cannot send notification while push messages are disabled");
    }
  },

  subscribe() {
    const self = this;
    self.setState({ isEnabled: false });
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager
        .subscribe({userVisibleOnly: true})
        .then((subscription) => {
          self.onSubscribed(subscription);
        })
        .catch((e) => {
          if (Notification.permission === 'denied') {
            logger.warn('Permission to send notifications denied');
          } else {
            logger.error('Unable to subscribe to push', e);
          }
          onUnsubscribed();
        })
    });
  },

  onSubscribed(subscription) {
    this.setState({ isEnabled: false, isSubscribed: true });
    return sendSubscriptionToServer(subscription).then(() => this.enable());
  },

  unsubscribe() {
    const self = this;
    self.setState({ isEnabled: false });
    navigator.serviceWorker.ready
      .then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.pushManager.getSubscription()
        .then((subscription) => {
          if (!subscription) {
            return self.onUnsubscribed();
          }

          logger.log('Unsubscribing from push notifications', subscription.toJSON());

          subscription.unsubscribe()
          .then(() => self.onUnsubscribed())
          .catch((e) => {
            logger.error('Error thrown while unsubscribing from push messaging', e);
          })
      })
      });
  },

  onUnsubscribed() {
    this.setState({ isEnabled: false, isSubscribed: false });
    unsubscribeOnServer().then(() => this.enable());
  },

  enable() {
    this.setState({ isEnabled: true });
  },

  disable() {
    this.setState({ isEnabled: false });
  },

  render() {
    let state = this.state;
    return (
      <div className="push-controls">
        <h4>Demo</h4>
        <SendMessageButton {...state} onClick={this.onClick} />
        <PushSubscriptionToggle {...state} onChange={this.onChange} />
      </div>
    );
  }
});

function sendSubscriptionToServer(subscription) {
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

function unsubscribeOnServer() {
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

export default function() {
  ReactDOM.render(
    <PushControls />,
    document.getElementById('push-simple-app')
  );
}
