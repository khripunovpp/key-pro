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

var shift = 50;

var nav = $(".nav"),
  navBtn = $(".nav__btn");

var lastScroll = 0;

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

  if (scrollTop > lastScroll) {
    nav.addClass("hide");
    closeNav();
  } else {
    nav.removeClass("hide");
  }
  lastScroll = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
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

var players = {};

var projects = function() {
  var tag = document.createElement("script");

  var list = $(".projects__list");

  var slider = list.slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: $(".projects__prev"),
    nextArrow: $(".projects__next"),
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  var hiddenItems,
    currentItems,
    items = $(".projects__item"),
    navs = $(".projects__nav");

  $(".projects__all").on("click", function(e) {
    e.preventDefault();
    hiddenItems = items.not(".slick-active");
    currentItems = items.filter(".slick-active");
    slider.slick("unslick");
    list.html("");
    list.append(currentItems);
    list.append(hiddenItems);
    navs.hide();
  });
};

function onPlayerReady(event) {
  $(event.target.a)
    .closest(".project")
    .addClass("playing")
    .removeClass("loading");
}

var makePlayers = function() {
  $("body").on("click", function(e) {
    e.preventDefault();
    var target = $(e.target).closest(".project__play");
    if (!target.length) return;

    var item = target.closest(".project__video");

    var id = item.attr("data-youtube-id");

    if (item.hasClass("loaded")) return;

    item.addClass("loaded loading");

    player = new YT.Player(
      document.querySelector("[data-youtube-id=" + id + "] .project__frame"),
      {
        height: "100",
        width: "100",
        videoId: id,
        events: {
          onReady: onPlayerReady
        }
      }
    );

    console.log(id);
  });
};

function onYouTubeIframeAPIReady() {
  makePlayers();
}

var videoHero = function() {
  var videoBg = $(".hero__video");
  videoBg
    .attr("controlsList", "nodownload")
    .html(
      '<source src="' +
        videoBg.data("url") +
        '.mp4"><source src="' +
        videoBg.data("url") +
        '.webm">'
    );
    videoBg.get(0).play();
    $('body').on('click touchend', function(){
      videoBg.get(0).play();
    })
};

$(function() {
  videoHero();
  navBtn.on("click", function(e) {
    e.preventDefault();
    navBtn.toggleClass("opened");
    nav.toggleClass("opened");
    page.toggleClass("fixed");
  });

  scrollDetection();
  $(document).on("scroll", scrollDetection);

  $("[data-href]").on("click", function(e) {
    e.preventDefault();
    closeNav();
    var id = $(this).attr("data-href");
    var section = $("#" + id);
    if (!section.length) return;
    var offset = section.offset().top;
    Util.scrollToEl(section);
  });
  projects();
});
