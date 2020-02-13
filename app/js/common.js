var Util = {
  randomInteger: function(min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
  },
  scrollToEl: function(el, offset) {
    $("html,body").animate({ scrollTop: el.offset().top + (offset || 0) }, 500);
  },
  trimString: function(string) {
    return string.split(" ").join("");
  }
};

$.fn.isOnScreen = function(shift) {
  if (!shift) {
    shift = 0;
  }
  var viewport = {};
  viewport.top = $(window).scrollTop();
  viewport.bottom = viewport.top + $(window).height();
  var bounds = {};
  bounds.top = this.offset().top + shift;
  bounds.bottom = bounds.top + this.outerHeight() - shift;
  return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
};

var shift = 90;

var nav = $(".nav"),
  navBtn = $(".nav__btn");

var scrollDetection = function() {
  $("section").each(function() {
    var that = this;

    var viewportWidth = $(window).innerWidth();

    if (viewportWidth > 991) shift = $(that).innerHeight() / 2;

    if ($(that).isOnScreen(shift)) {
      hightlight($(that).attr("id"));
    }
  });

  var scrollTop = $(document).scrollTop();

  if (scrollTop > 5) {
    nav.addClass("scrolled");
  } else {
    nav.removeClass("scrolled");
  }
};

var navItems = $(".nav li");

var hightlight = function(id) {
  if (!id) return;
  navItems.siblings().removeClass("active");
  navItems
    .find('a[data-href="' + id + '"]')
    .closest("li")
    .addClass("active");
};


var page = $("body");

var closeNav = function() {
  navBtn.removeClass("opened");
  nav.removeClass("opened");
  page.removeClass("fixed");

};


$(function() {
  navBtn.on("click", function(e) {
    e.preventDefault();
    navBtn.toggleClass("opened");
    nav.toggleClass("opened");
    page.toggleClass("fixed");
  });

  scrollDetection();
  $(document).on("scroll", scrollDetection);

  $(".nav a, .scroll").on("click", function(e) {
    e.preventDefault();
    closeNav();
    var id = $(this).attr("data-href");
    var section = $("#" + id);
    if (!section.length) return;
    var offset = section.offset().top;
    Util.scrollToEl(section);
  });
});
