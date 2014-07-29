(function () {
  $(document).ready(function onDocumentLoad() {

    // toggle menu
    var menu = $('#menu');
    $('.menu-open').click(function onMenuOpen() {
      menu.addClass('expanded');
    });

    $('.menu-close, .menu-action').click(function onMenuClose() {
      menu.removeClass('expanded');
    });

  });
})();

