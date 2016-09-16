function alertOnce(labelSuffix, message) {
  if (!localStorage) {
    alert(message);
    return false;
  }

  const label = `alerted-${labelSuffix}`;
  const alerted = localStorage.getItem(label) || '';

  if (alerted != "yes") {
    localStorage.setItem(label, 'yes');
    alert(message);
  }

  return true;
}

function alertSWSupport() {
  return alertOnce("serviceWorker", "Sorry but the browser you're using does not support Service Workers yet! Check out caniuse.com to learn moreabout browser support");
}

export {
  alertOnce,
  alertSWSupport
}
