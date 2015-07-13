/* jslint node: true, browser: true */
/* globals FastClick */

'use strict';

$( function() {

    var $grid = $( '.masonry' ).masonry(
    {
        itemSelector: '.item',
        columnWidth: '.item-sizer',
        percentPosition: true,
        gutter: 20,
        transitionDuration: 0,
        stamp: '.stamp'
    });

    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });

    // #Fastclick Mobile delay
    // #Amended for IE 
    if (window.addEventListener) {
      window.addEventListener('load', function() {
        new FastClick(document.body);
      }, false);
    }
    
});