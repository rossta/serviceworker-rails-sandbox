(function() {
  function navReady() {
    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    // $('.collapsible').collapsible();
  }

  $(document).on('ready page:change page:load', navReady);
})();
