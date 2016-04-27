require('skel-framework/dist/skel.min.js');

(function() {
  function ready() {
    // Variables
    let $nav = $('.navbar'),
        $body = $('body'),
        $window = $(window),
        $popoverLink = $('[data-popover]'),
        navOffsetTop = $nav.offset().top,
        $document = $(document),
        entityMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': '&quot;',
          "'": '&#39;',
          "/": '&#x2F;'
        }

    function init() {
      $window.on('scroll', onScroll)
      $window.on('resize', resize)
      $popoverLink.on('click', openPopover)
      $document.on('click', closePopover)
      $('a[href^="#"]').on('click', smoothScroll)
    }

    function smoothScroll(e) {
      e.preventDefault();
      $(document).off("scroll");
      let target = this.hash,
          menu = target;
      $target = $(target);
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top-40
      }, 0, 'swing', function () {
          window.location.hash = target;
          $(document).on("scroll", onScroll);
      });
    }

    function openPopover(e) {
      e.preventDefault()
      closePopover();
      let popover = $($(this).data('popover'));
      popover.toggleClass('open')
      e.stopImmediatePropagation();
    }

    function closePopover(e) {
      if($('.popover.open').length > 0) {
        $('.popover').removeClass('open')
      }
    }

    $("#button").click(function() {
      $('html, body').animate({
          scrollTop: $("#elementtoScrollToID").offset().top
      }, 2000);
  });

    function resize() {
      $body.removeClass('has-docked-nav')
      navOffsetTop = $nav.offset().top
      onScroll()
    }

    function onScroll() {
      if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
        $body.addClass('has-docked-nav')
      }
      if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
        $body.removeClass('has-docked-nav')
      }
    }

    function escapeHtml(string) {
      return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    }

    init();
  }

  $(document).ready(ready);
  $(document).on('page:load', ready);
})();
