/* jslint node: true, browser: true */
/* globals FastClick */

'use strict';

$( function() {

  var $gallery,
      shrinkOn = 100,
      header = $('.header'),
      classSmaller = 'is-smaller';

  //Header
  $(window).scroll(function () {
    var distanceY = $(this).scrollTop();

    if (distanceY > shrinkOn) {
      header.addClass(classSmaller);
    } else {
      if (header.hasClass(classSmaller) && !$gallery.isActive() ) {
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
      header.addClass(classSmaller);
    },
    onCloseAfter: function() {
      var distanceY = $(window).scrollTop();

      if (distanceY < shrinkOn) {
        header.removeClass(classSmaller);
      }
    }

  });

  $('.js-scroll-top').on('click', function(e){
    e.preventDefault();
    $('body,html').animate({
      scrollTop: 0,
      }, 500
    );
  });

  // #Fastclick Mobile delay
  // #Amended for IE 
  if (window.addEventListener) {
    window.addEventListener('load', function() {
      new FastClick(document.body);
    }, false);
  }
    
});