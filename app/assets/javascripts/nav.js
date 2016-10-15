(function($) {

  // Detect touch screen and enable scrollbar if necessary
  function is_touch_device() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  function ready() {
    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    // $('.collapsible').collapsible();

    $("#nav-mobile ul.collapsible li li.active").parents("li").children("a.collapsible-header").click()

    if (is_touch_device()) {
      $('#nav-mobile').css({ overflow: 'auto'});
    }
  }

  $(ready); // end of document ready

})(jQuery);
