import _ from 'lodash';

let target;

function render(html) {
  $(target).html(html);
}

function renderPage(data, state) {
  data = data || {};

  target = state.target || "#demo";
  state.tweets = state.tweets || [];
  data.tweets = data.tweets || [];

  if (data.tweets.length) {
    state.tweets = data.tweets;
  } else {
    if (!state.tweets.length) {
      renderLoading(data, state);
    }
    if (!data.force) {
      return;
    }
  }

  render(`<div>${statusToHtml(data)}${tweetsToHtml(state.tweets)}</div>`);
}

function renderError(e) {
  const msg = 'No data received from cache or network or error';
  render(`<div class="error">${msg}: ${e}</div>`);
}

function renderLoading(data, state) {
  if (state.tweets.length) return;
  render(`<div class="loading">Loading <span class="dots">...</span></div>`);
  setTimeout(renderDots, 250);
}

function renderDots(n) {
  n = n || 0;
  let dots = [".", ".", "."].filter((d, i) => i <= (n % 3)).join("");
  let $dots = $(target).find('.dots');
  if ($dots.length) {
    $dots.text(dots);
    setTimeout(() => renderDots(n+1), 250);
  }
}

function tweetsToHtml(tweets) {
  return tweets.sort((tw, i) => tw.id).map(tweetToHtml).join("");
}

function tweetToHtml(tweet) {
  let pics = _(tweet.entities.media).map(img => `<img src="${img.media_url_https}" class="tweet-img" />`).join("\n");
  return `
  <div class="tweet" id="tweet-${tweet.id}">
    <div class="media-item">
      <img src="${tweet.user.profile_image_url_https}" />
      <div class="bd">
        <div>${tweet.text}</div>
      </div>
    </div>
    <div class="media-extras">
      ${pics}
    </div>
  </div>
  `;
}

function statusToHtml(data) {
  let deleteLink = "";
  if(data.source === "network") {
    deleteLink = `<a href="#" class="delete-cache">Delete cache</a>`
  }

  return `
  <div class="callout">
    <div class="status ${data.source}">
      <span class="refresh">
        <a href="#">Refresh</a>
        ${deleteLink}
      </span>
      <span>${data.message}</span>
    </div>
  </div>
  `;
}

export {
  renderPage,
  renderError
}
