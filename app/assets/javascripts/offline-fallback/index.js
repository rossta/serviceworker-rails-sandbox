//= require offline-fallback/companion
//= require_self

(function() {
  function ready() {
    console.log('refresh ready');
    document.querySelector('#refresh').search = Date.now();
  }

  $(document).ready(ready);
  $(document).on('page:load', ready);
})();
