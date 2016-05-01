import Logger from 'utils/logger';
import {cacheKey} from 'utils/caching';
import {renderPage, renderError} from 'cache-then-network/render';
import _ from 'lodash';

const target = "#demo";
const logger = new Logger('[cache-then-network/client]');

const state = {
  target: target,
  tweets: [],
  source: "",
  message: "",
  force: false
};

export default function ready() {
  fetchData();
  $(target).on('click', '.delete-cache', deleteCache);
  $(target).on('click', '.refresh', refresh);
}

function fetchData() {
  let networkDataReceived = false;

  renderPage({}, state);

  // fetch fresh data
  var networkUpdate = fetch('/streams/cats.json').then(function(response) {
    return response.json();
  }).then(function(data) {
    networkDataReceived = true;
    logger.log('rendering from network after brief delay');
    setTimeout(function() {
      renderPage({
        tweets: data,
        source: "network",
        message: "Data updated from network and now cached."
      }, state);
    }, 1000);
  });

  // fetch cached data
  caches.match('/streams/cats.json').then(function(response) {
    if (!response) throw Error("No data");
    return response.json();
  }).then(function(data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      logger.log('rendering from cache');
      renderPage({
        tweets: data,
        source: "cache",
        message: "Data retrieved from cache, requesting update from network"
      }, state);
    }
  }).catch(function() {
    // we did not get cached data, the network is our last hope
    return networkUpdate;
  }).catch(renderError);
}

function deleteCache(e) {
  e.preventDefault();
  caches.delete(cacheKey('cache-then-network')).then((success) => {
    logger.log('Cached deleted', success);
    renderPage({ force: true, message: "Cache is now deleted." }, state);
  });
}

function refresh(e) {
  e.preventDefault();
  state.tweets = [];
  location.reload();
}

$(document).ready(ready);
$(document).on('page:load', ready);
