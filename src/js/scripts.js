/* jslint node: true, browser: true */
/* globals FastClick */

'use strict';

$( function() {

  var $gallery,
      shrinkOn = 100,
      header = $('.header'),
      classSmaller = 'is-smaller';

  var cache = {},
      url,
      html,
      isLoading = false,
      $switcher,
      $container = $('.site__inner'),
      $loader = $('.logo'),
      $menuItems = $('.nav__item');



  function init() {
    if ( history.replaceState ) {
      var url = window.location.href;
      history.replaceState({ path: url }, null, url );
      uiBinding();
    }

    updateLinks( window.location.href );
  }

  function convertToRel(href) {
    href = href.replace('http://', '');
    href = href.replace(window.location.host + '/', '');
    return href;
  }

  function updateLinks(href) {
    href = convertToRel(href);
    $menuItems.removeClass('is-active');

    if( href.indexOf('/') !== -1 )
    {
      href= href.split('/')[0];
    }

    if( href === 'contact' )
    {
      $('html').addClass('theme--dark');
    } else {
      $('html').removeClass('theme--dark');
    }

    var activeLink = $('a[href="/' + href + '"]', $menuItems);
    activeLink.closest('.nav__item').addClass('is-active');

  }

  function createHistory(url, title) {
    if ( history.replaceState ) {
      history.pushState({ path: url }, null, url );
      document.title = title;
    }
  }

  function trans(url, onpopstate) {
    if (!onpopstate)
    {
      createHistory(url, cache[url].headerTitle);          
    }

    $loader.removeClass('is-loading');
    $switcher.remove();
    $container.append('<div class="switch is-hidden">' + cache[url].html + '</div>');

    $container.find('.switch').show().removeClass('is-hidden');
    $container[0].offsetHeight;
    updateLinks(url);
  }

  function loader(url, onpopstate) {

    $loader.addClass('is-loading');
    $switcher = $container.find('.switch');
    // $('.site').removeClass('ocn-show-right');
    $('html, body').animate({ scrollTop: 0 }, 0);
    
    onpopstate = (!onpopstate ? false : true);

    $.ajax({
      url: url,
      success: function(data){
        var $data = $(data);
        html = $data.find('.switch').html();
        cache[url] = {
          headerTitle: $data.filter('title').text(),
          html: html
        };
        trans(url, onpopstate);

        // #Reinit the infinite scroll 
        // $.ias().reinitialize();

        // #Update loading bool
        isLoading = false;
        uiBinding();
      }
    });

  }

  function uiBinding()
  {

    $(document).on('click', 'a[data-switch]', function(e){
      e.preventDefault();

      if( isLoading ) return false;

      var $this = $(this);
      loader(this.href, $this.data('switch'), false);

      isLoading = true;
    });

    window.onpopstate = function(e) { //cache history 
      if (e.state) {
        e.preventDefault();
        // loader(e.state.path, 'main', true);
        loader(e.state.path);
      }
    };

    //Header
    $(window).scroll(function () {
      var distanceY = $(this).scrollTop();

      if ( !$gallery.isActive() && distanceY > shrinkOn) {
        header.addClass(classSmaller);
      } else {
        if (header.hasClass(classSmaller) ) {
          header.removeClass(classSmaller);
        }
      }
    });

    //Masonary Layout
    var $grid = $( '.gallery' ).masonry(
    {
      itemSelector: '.gallery__item',
      columnWidth: '.gallery__item-sizer',
      percentPosition: true,
      gutter: 20,
      transitionDuration: 0,
      stamp: '.gallery__featured'
    });

    //Images Loaded before Masonary Layout
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });

    //Light Gallery Plugin
    $gallery = $('.gallery').lightGallery({
      mode: 'fade',
      speed: 300,
      selector: '.gallery__thumb',
      preload: 2,
      showThumbByDefault: false,
      thumbnail: false,
      onOpen: function() {
        header.removeClass(classSmaller);
        header.addClass('theme--dark');
      },
      onCloseAfter: function() {
        var distanceY = $(window).scrollTop();

        if (distanceY > shrinkOn) {
          header.addClass(classSmaller);
        }
        header.removeClass('theme--dark');
      }

    });

    $('.js-scroll-top').on('click', function(e){
      e.preventDefault();
      $('body,html').animate({
        scrollTop: 0,
        }, 500
      );
    });
  }

  init();

  // #Fastclick Mobile delay
  // #Amended for IE 
  if (window.addEventListener) {
    window.addEventListener('load', function() {
      new FastClick(document.body);
    }, false);
  }
    
});