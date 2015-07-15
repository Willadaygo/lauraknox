/* jslint node: true, browser: true */
/* globals FastClick */

'use strict';

$( function() {

    //Header
    $(window).scroll(function () {
      var distanceY = $(this).scrollTop(),
          shrinkOn  = 100,
          header    = $(".header");

      if (distanceY > shrinkOn) {
        header.addClass("is-smaller");
      } else {
        if (header.hasClass("is-smaller")) {
          header.removeClass("is-smaller");
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

    //Gallery Plugin
    $('.gallery').lightGallery({
        mode: 'fade',
        speed: 300,
        selector: '.gallery__thumb',
        // addClass: ''
        preload: 5,
        showThumbByDefault: false,
        thumbnail: false
        // animateThumb: false

    }); 

    // #Fastclick Mobile delay
    // #Amended for IE 
    if (window.addEventListener) {
      window.addEventListener('load', function() {
        new FastClick(document.body);
      }, false);
    }
    
});