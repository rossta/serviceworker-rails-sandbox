import React from 'react';
import ReactDOM from 'react-dom';
import Logger from 'utils/logger';
const logger = new Logger('[push-react/app]');

const SendMessageButton = React.createClass({
  onClick(e) {
    return this.props.onClick(e);
  },

  render() {
    let { isEnabled, isSubscribed } = this.props;
    let disabled = !isEnabled || !isSubscribed;
    let classNames = ["btn waves-effect waves-light"]
    if (!isSubscribed) {
      classNames.push("disabled");
    }

    return (
      <a
        onClick={this.onClick}
        className={classNames.join(' ')}
        >
        Send message
      </a>
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
          <label>
            Off
            <input
              id="push-checkbox"
              type="checkbox"
              checked={isSubscribed}
              disabled={!isEnabled}
            />
            <span className="lever"></span>
            On
          </label>
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
      this.props.sendNotification();
    } else {
      alert("Cannot send notification while push messages are disabled");
    }
  },

  subscribe() {
    this.disable();

    this.props.subscribe(this.onSubscribed, this.onUnsubscribed);
  },

  onSubscribed(subscription) {
    logger.log('Subscribing to push notifications', subscription.toJSON());
    this.setState({ isEnabled: false, isSubscribed: true });
    return this.props.serverSubscribe(subscription).then(this.enable);
  },

  unsubscribe() {
    this.disable();
    this.props.unsubscribe(this.onUnsubscribed);
  },

  onUnsubscribed() {
    this.setState({ isEnabled: false, isSubscribed: false });
    this.props.serverUnsubscribe().then(this.enable);
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

function render(props) {
  const root = document.getElementById('push-react-app');

  if (root) {
    ReactDOM.render(<PushControls {...props} />, root);
  }
}

function dismount() {
  const root = document.getElementById('push-react-app');
  if (root) {
    ReactDOM.unmountComponentAtNode(root);
  }
}

export { render, dismount };
