(function() {
  $(document).ready(function() {
    //adjust search input position
    $(window).on("load resize",function(){
      var windowWidth = $(window).width();
      if (windowWidth < 768){
        $("#nav_bar").appendTo('#leftDrawer');
        $("#nav_bar nav").addClass('drawer-nav');
        $("#reference_link_container").appendTo(".drawer-nav");
      } else {
        $("#nav_bar").prependTo('#mainContent');
        $("#nav_bar nav").removeClass('drawer-nav');
        $("#reference_link_container").insertAfter("#mobileMenuBtn");
      }
    });

    $(window).on("load resize",function(){
      $('.drawer').drawer();
      $('.drawer-nav a').on("click",function(){
        $('body').removeClass('drawer-open');
        $('body').addClass('drawer-close');
      });
    });
  });
})();
