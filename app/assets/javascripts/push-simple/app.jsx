import React from 'react';
import ReactDOM from 'react-dom';

const SendMessageButton = React.createClass({
  render() {
    let { isEnabled, isSubscribed } = this.props;

    return (
      isSubscribed ?
        <button className="button" disabled={!isEnabled}>Send message</button> :
        null
    );
  }
});

const PushSubscriptionToggle = React.createClass({
  getLabel() {
    return this.props.isSubscribed
  },
  render() {
    let { isEnabled, isSubscribed } = this.props;
    let label = isSubscribed ? "Unsubscribe from push messages" : "Subscribe to push messages";

    return (
      <div className="push-subscription-toggle">
        <label
          for="push-checkbox">
          {label}
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

  render() {
    let state = this.state;
    return (
      <div className="push-controls">
        <h4>Demo</h4>
        <SendMessageButton {...state}/>
        <PushSubscriptionToggle {...state} />
      </div>
    );
  }
});

export default function() {
  ReactDOM.render(
    <PushControls />,
    document.getElementById('push-simple-app')
  );
}
