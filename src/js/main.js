$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);
  var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing for anime.js
  var lastClickEl;

  ////////////
  // READY - triggered when PJAX DONE
  ////////////

  // single time initialization
  legacySupport();
  initaos();
  _window.on("resize", debounce(setBreakpoint, 200));

  // on transition change
  // getPaginationSections();
  // pagination();
  // _window.on("scroll", throttle(pagination, 50));
  // _window.on("resize", debounce(pagination, 250));

  function pageReady() {
    initMasks();
    initSelectric();
    initValidations();
    initSlider();
    initPopup();
  }

  // this is a master function which should have all functionality
  pageReady();

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // Prevent # behavior
  _document
    // .on("click", '[href="#"]', function(e) {
    //   e.preventDefault();
    // })
    // .on("click", "a[href]", function(e) {
    //   // if (Barba.Pjax.transitionProgress) {
    //   //   e.preventDefault();
    //   //   e.stopPropagation();
    //   // }

    //   if (e.currentTarget.href === window.location.href) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }
    // })
    // .on("click", 'a[href^="#section"]', function(e) {
    //   // section scroll
    //   var el = $(this).attr("href");

    //   if ($(el).length === 0) {
    //     lastClickEl = $(this).get(0);
    //     Barba.Pjax.goTo($(".header__logo").attr("href"));
    //   } else {
    //     scrollToSection($(el));
    //   }

    //   return false;
    // })
    // .on("click", "[js-open-g-tab]", function(e) {
    //   e.preventDefault();
    //   var $self = $(this),
    //     tabIndex = $self.index();
    //   $self.siblings().removeClass("is-active");
    //   $self.addClass("is-active");
    //   $(".g-complectation__tab")
    //     .removeClass("is-active")
    //     .css("display", "none")
    //     .eq(tabIndex)
    //     .fadeIn();
    // })

    .on("click", "[js-step-button]", function(e) {
      e.preventDefault();
      var $self = $(this),
        tabIndex = $self.index();
      // $self.siblings().removeClass("is-active");
      $self.addClass("is-active");
      $(".want-form--calculator").removeClass("is-active");
      $(".calc__tab")
        .removeClass("is-active")
        .eq(tabIndex)
        .addClass("is-active");
      if (tabIndex === 4) {
        $(".calc__tab-step-5").addClass("is-active");
        $(".want-form--calculator").addClass("is-active");
      }
    })

    .on("click", "[js-open-result]", function(e) {
      e.preventDefault();
      $(".calc__tab").css("display", "none");
      $(".calc__tab.calc__tab-step-5").css("display", "block");
      $(".want-form--calculator").addClass("is-active");
      $(".head--calculator p").css("display", "none");
    })

    .on("click", "[js-complectation-button]", function(e) {
      e.preventDefault();
      $(this).toggleClass("is-open");
      $(this)
        .parent()
        .find(".g-complectation__tab")
        .slideToggle();
    })

    .on("click", "[js-general-view-btn]", function(e) {
      e.preventDefault();
      $(".general__view-item").removeClass("is-active");
      $(this).addClass("is-active");
    })

    .on("click", "[js-services-btn]", function(e) {
      e.preventDefault();
      $(".podr-services__grid").toggleClass("is-active");
      $(this).toggleClass("is-active");
    })

    .on("click", "[js-open-ready-house]", function(e) {
      e.preventDefault();
      $(".podr-map__detail-ready").addClass("is-active");
    })

    .on("click", "[js-open-proccess-house]", function(e) {
      e.preventDefault();
      $(".podr-map__detail-proccess").addClass("is-active");
    })

    .on("click", "[js-detail-close]", function(e) {
      e.preventDefault();
      $(this)
        .parent()
        .removeClass("is-active");
    })

    .on("click", "[js-open-info]", function(e) {
      e.preventDefault();
      $(this).toggleClass("is-open");
      $(this)
        .parent()
        .find(".g-complectation__toggle")
        .slideToggle();
    });

  function scrollToSection(el) {
    var headerHeight = $(".header").height();
    var targetScroll = el.offset().top - headerHeight;

    TweenLite.to(window, 1, {
      scrollTo: targetScroll,
      ease: easingSwing
    });
  }

  $(document).ready(function() {
    $("[js-range]").rangeSlider();
  });

  if (jQuery)
    (function($) {
      $.fn.rangeSlider = function(params) {
        // default configuration
        var conf = $.extend({}, params);
        // end default configuration
        return this.each(function() {
          var configuration = conf,
            object = $(this),
            object_functions = this,
            target = object.data("target");
          $.extend(object_functions, {
            init: function() {
              object_functions.setValue();
              // object_functions.setWarning();

              object.on("input", function() {
                object_functions.setValue();
              });
              $(target).on("change, keyup", function() {
                object.val($(target).val());
              });
            },
            setValue: function() {
              $(target)
                .val(object.val())
                .trigger("change");
            }
          });
          object_functions.init();
        });
      };
    })(jQuery);

  ////////////////////
  // MAGNIFIC POPUPS
  ////////////////////

  function initPopup() {
    $("[js-open-gallery]").magnificPopup({
      // delegate: "a",
      type: "image",
      tLoading: "Loading image #%curr%...",
      mainClass: "mfp-img-mobile",
      tCounter: false,
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      callbacks: {
        beforeOpen: function() {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace(
            "mfp-figure",
            "mfp-figure mfp-with-anim"
          );
          this.st.mainClass = this.st.el.attr("data-effect");
        }
      }
    });

    // Image popups
    $("[js-popup-image]").magnificPopup({
      type: "image",
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace(
            "mfp-figure",
            "mfp-figure mfp-with-anim"
          );
          this.st.mainClass = this.st.el.attr("data-effect");
        }
      },
      closeOnContentClick: true,
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });

    // Video popups
    $("[js-popup-video]").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  }

  ////////////////////
  // SLIDERS
  ////////////////////

  function personalInfoSliderInit() {
    if ($(document).width() > 768) {
      if ($("[js-advantages-slider]").hasClass("slick-initialized"))
        $("[js-advantages-slider]").slick("unslick");
    } else {
      if (!$("[js-advantages-slider]").hasClass("slick-initialized")) {
        $("[js-advantages-slider]").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        });
      }
    }
  }

  personalInfoSliderInit();

  $(window).resize(function() {
    personalInfoSliderInit();
  });

  function stepSlideInit() {
    if ($(document).width() > 768) {
      if ($("[js-steps-slider]").hasClass("slick-initialized"))
        $("[js-steps-slider]").slick("unslick");
    } else {
      if (!$("[js-steps-slider]").hasClass("slick-initialized")) {
        $("[js-steps-slider]").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          loop: true,
          infinite: true
        });
      }
    }
  }

  stepSlideInit();

  $(window).resize(function() {
    stepSlideInit();
  });

  function blogSlideInit() {
    if ($(document).width() > 768) {
      if ($("[js-blog-slider]").hasClass("slick-initialized"))
        $("[js-blog-slider]").slick("unslick");
    } else {
      if (!$("[js-blog-slider]").hasClass("slick-initialized")) {
        $("[js-blog-slider]").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          loop: true,
          infinite: true
        });
      }
    }
  }

  blogSlideInit();

  $(window).resize(function() {
    blogSlideInit();
  });

  function initSlider() {
    $("[js-firstscreen-slider]").slick({
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: false,
      pauseOnFocus: false,
      speed: 500,
      fade: true,
      cssEase: "linear"
    });

    $("[js-awards-slider]").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      loop: true,
      infinite: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 788,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            dots: true
          }
        },
        {
          breakpoint: 550,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
          }
        }
      ]
    });

    $("[js-pr-slider]").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      loop: true,
      draggable: false,
      infinite: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            draggable: false,
            swipe: false,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            pauseOnFocus: true,
            dots: true
          }
        }
      ]
    });

    $("[js-g-slider]").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      // fade: true,
      asNavFor: "[js-g-preview-slider]"
    });

    $("[js-g-preview-slider]").slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      asNavFor: "[js-g-slider]",
      dots: false,
      arrows: false,
      // centerMode: true,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1336,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    });

    $("[js-projects-slider]").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      loop: false
    });

    $("[js-karta-slider]").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      loop: false
    });

    $("[js-reviews-slider]").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      loop: true,
      infinite: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 788,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true
          }
        }
      ]
    });

    $("[js-offer-slider]").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      loop: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 1168,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        ,
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 788,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: true,
            dots: true
          }
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true
          }
        }
      ]
    });

    $("[js-share-slider]").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 788,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
          }
        }
      ]
    });
  }

  ////////////////////
  // OPEN DROPDOWN MENUS IN FOOTER
  ////////////////////

  _document.on("click", "[js-open-drop]", function() {
    $(this).toggleClass("is-open");
    $(this)
      .parents(".footer__item")
      .find(".footer__drop")
      .slideToggle();
  });

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__menu").toggleClass("is-open");
    $(".header__calc").toggleClass("is-open");
    $("body").toggleClass("is-fixed");
    $("html").toggleClass("is-fixed");
  });

  // _document.on("click", ".hamburger.is-active", function() {
  //   $(this).removeClass("is-active");
  //   $(".header__menu").removeClass("is-open");
  //   $("body").removeClass("is-fixed");
  //   $("html").removeClass("is-fixed");
  //   $(".enter").removeClass("is-active");
  // });

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  // _document.on("click", "[js-show-pass]", function(e) {
  //   e.preventDefault();
  //   $(this).toggleClass("show-pass");
  //   var x = document.getElementById("l2");
  //   if (x.type === "password") {
  //     x.type = "text";
  //   } else {
  //     x.type = "password";
  //   }
  // });

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
    // $("input[type='tel']").mask("(000) 000-0000", {
    //   placeholder: "+7 (___) ___-____"
    // });
  }

  // selectric
  function initSelectric() {
    $("select").selectric({
      maxHeight: 300,
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $(form).addClass("loading");
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass("loading");
          var data = $.parseJSON(response);
          if (data.status == "success") {
            // do something I can't test
          } else {
            $(form)
              .find("[data-error]")
              .html(data.message)
              .show();
          }
        }
      });
    };

    var validatePhone = {
      required: true,
      normalizer: function(value) {
        var PHONE_MASK = "(XXX) XXX-XXXX";
        if (!value || value === PHONE_MASK) {
          return value;
        } else {
          return value.replace(/[^\d]/g, "");
        }
      },
      minlength: 11,
      digits: true
    };

    ////////
    // FORMS

    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    $(".js-registration-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        // first_name: "required",
        // phone: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
          // minlength: 6
        }
        // phone: validatePhone
      }
    });

    $(".js-form-want").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: "required",
        mail: "required"
      },
      messages: {
        name: "Заполните это поле",
        phone: "Заполните это поле",
        mail: "Заполните это поле"
      }
    });

    $(".js-form-enter").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        login: "required",
        pass: "required"
      },
      messages: {
        login: "Заполните это поле",
        pass: "Заполните это поле"
      }
    });
  }

  // //////////
  // // PAGINATION
  // //////////
  // var paginationAnchors, sections;

  // function getPaginationSections() {
  //   paginationAnchors = $(".header__menu .header__menu-link");
  //   sections = $(".page__content [data-section]");
  // }

  // function pagination() {
  //   // Cache selectors
  //   var headerHeight = $(".header").height();
  //   var vScroll = _window.scrollTop();

  //   if (sections.length === 0) {
  //     paginationAnchors.removeClass("is-active");
  //     return false;
  //   }

  //   // Get id of current scroll item
  //   var cur = sections.map(function() {
  //     if ($(this).offset().top <= vScroll + headerHeight / 0.99) return this;
  //   });
  //   // Get current element
  //   cur = $(cur[cur.length - 1]);
  //   var id = cur && cur.length ? cur.data("section") : "1";

  //   // Set/remove active class
  //   paginationAnchors
  //     .removeClass("is-active")
  //     .filter("[data-section='" + id + "']")
  //     .addClass("is-active");
  // }

  //////////
  // BARBA PJAX
  //////////

  // Barba.Pjax.Dom.containerClass = "page";

  // var OverlayTransition = Barba.BaseTransition.extend({
  //   start: function() {
  //     Promise.all([this.newContainerLoading, this.fadeOut()]).then(
  //       this.fadeIn.bind(this)
  //     );
  //   },

  //   fadeOut: function() {
  //     var deferred = Barba.Utils.deferred();

  //     // store overlay globally to access in fadein
  //     this.$overlay = $('<div class="js-transition-overlay"></div>');
  //     this.$overlay.insertAfter(".header");
  //     $("body").addClass("is-transitioning");

  //     TweenLite.fromTo(
  //       this.$overlay,
  //       0.6,
  //       {
  //         x: "0%"
  //       },
  //       {
  //         x: "100%",
  //         ease: Quart.easeIn,
  //         onComplete: function() {
  //           deferred.resolve();
  //         }
  //       }
  //     );

  //     return deferred.promise;
  //   },

  //   fadeIn: function() {
  //     var _this = this; // copy to acces inside animation callbacks
  //     var $el = $(this.newContainer);

  //     $(this.oldContainer).hide();

  //     $el.css({
  //       visibility: "visible"
  //     });

  //     TweenLite.to(window, 0.2, {
  //       scrollTo: 1,
  //       ease: easingSwing
  //     });

  //     AOS.refreshHard();

  //     // TweenLite.set(this.$overlay, {
  //     //   rotation: 0.01,
  //     //   force3D: true
  //     // });

  //     TweenLite.fromTo(
  //       this.$overlay,
  //       1,
  //       {
  //         x: "100%",
  //         overwrite: "all"
  //       },
  //       {
  //         x: "200%",
  //         ease: Expo.easeOut,
  //         delay: 0.2,
  //         onComplete: function() {
  //           _this.$overlay.remove();
  //           triggerBody();
  //           $("body").removeClass("is-transitioning");
  //           _this.done();
  //         }
  //       }
  //     );
  //   }
  // });

  // // set barba transition
  // Barba.Pjax.getTransition = function() {
  //   // return FadeTransition;
  //   return OverlayTransition;
  // };

  // Barba.Prefetch.init();
  // Barba.Pjax.start();

  // // event handlers
  // Barba.Dispatcher.on("linkClicked", function(el) {
  //   lastClickEl = el; // save last click to detect transition type
  // });

  // Barba.Dispatcher.on("initStateChange", function(currentStatus) {
  //   var container = Barba.Pjax.Dom.getContainer();
  //   var haveContainer = $(container).find(".page__content").length > 0;

  //   if (!haveContainer) {
  //     // handle error - redirect ot page regular way
  //     window.location.href = currentStatus.url;
  //   }
  // });

  // Barba.Dispatcher.on("newPageReady", function(
  //   currentStatus,
  //   oldStatus,
  //   container,
  //   newPageRawHTML
  // ) {
  //   pageReady();
  // });

  // Barba.Dispatcher.on("transitionCompleted", function() {
  //   // getPaginationSections();
  //   // pagination();

  //   if ($(lastClickEl).data("section")) {
  //     scrollToSection($($(lastClickEl).attr("href")));
  //   }
  // });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase();
    var displayCondition =
      wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0;
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $(".page").append(content);
      setTimeout(function() {
        $(".dev-bp-debug").fadeOut();
      }, 1000);
      setTimeout(function() {
        $(".dev-bp-debug").remove();
      }, 1500);
    }
  }
});
