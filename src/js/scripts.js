/* jslint node: true, browser: true */
/* globals FastClick */

'use strict';

$(function() {

  // #Begin header.js
  (function(){

    // var CM = new ContentManager();

    var cache = {},
        url,
        html,
        $container = $('.site__inner'),
        $switcher,
        $loader = $('.logo'),
        $menuItems = $('.ocn__list li'),
        didScroll,
        lastScrollTop = 0,
        delta = 5,
        navbarHeight = 100;

    function init() {
      if ( history.replaceState ) {
        var url = window.location.href;
        history.replaceState({ path: url }, null, url );
        uiBinding();
      }
    }

    function convertToRel(href) {
      href = href.replace('http://', '');
      href = href.replace(window.location.host + '/', '');
      return href;
    }

    function updateLinks(href, target) {
      href = convertToRel(href);
      $menuItems.removeClass('is-active');

      var activeLink = $('a[href="/' + href + '"]', $menuItems);
      activeLink.closest('.ocn__list li').addClass('is-active');

    }

    function createHistory(url, title) {
      if ( history.replaceState ) {
        history.pushState({ path: url }, null, url );
        document.title = title;
      }
    }

    function trans(url, target, onpopstate) {
      if (!onpopstate) {
        createHistory(url, cache[url].headerTitle);          
      }

      $loader.removeClass('is-loading');

      $switcher.remove();
      $container.append('<div class="switch is-hidden">' + cache[url].html + '</div>');

      $container.find('.switch').show().removeClass('is-hidden');
      $container[0].offsetHeight;
      updateLinks(url, target);

      $('body').removeClass().addClass(cache[url].bodyClasses);

    }

    function loader(url, target, onpopstate) {

      $loader.addClass('is-loading');
      $switcher = $container.find('.switch');
      
      onpopstate = (!onpopstate ? false : true);
      $('.site').removeClass('ocn-show-right');
      $('html, body').animate({ scrollTop: 0 }, 0);
      // var track = url.split('/');
      // track.splice(0,3);
      // Push to Google Analytics...
      // _gaq.push(['_trackPageview', '/' + track.join('/')]);

      // if (typeof cache[url] == "undefined") {
      $.ajax({
        url: url,
        success: function(data){
          var bodyClasses = data.match(/body class=\"(.*?)\"/)[1]; // Necessary as jQuery can't get the body (or body class) from a string
          var $data = $(data);
          html = $data.find('.switch').html();
          cache[url] = {
            headerTitle: $data.filter('title').text(),
            bodyClasses: bodyClasses,
            html: html
          };
          trans(url, target, onpopstate);
        }
      });
        // } else {
        //     trans(url, target, onpopstate);
        // }
    }

    function hasScrolled()
    {
      var st = $(window).scrollTop();
      
      // #Make sure they scroll more than delta
      if( $('.ocn-menu-button').hasClass('is-active') ) return;

      if( $('.ocn-menu-button').is(':visible') && Math.abs(lastScrollTop - st) >= delta )
      {
        // #Scrolled down and are past the navbar add .header--up class
        if ( st > lastScrollTop && st > navbarHeight )
        {
          // #Scroll Down
          $('.header').addClass('header--up');

        } else {
          // #Scroll Up
          if(st + $(window).height() < $(document).height()) {
            $('.header').removeClass('header--up');
          }
        }

        lastScrollTop = st;
      }
    }

    function uiBinding()
    {

      // #Show/hide navigation

      setInterval(function() {
        if( didScroll ) {
          hasScrolled();
          didScroll = false;
        }
      }, 250);
      // #End show/hide
      
      var $hamburger = $('.ocn-menu-button'),
          $site = $('.site');

      $(document).on('click', 'a[data-switch]', function(e){
        e.preventDefault();

        var $this = $(this);

        // if( $this.parents('li').hasClass('is-active') ) return;

        // toggles subnav without linking on desktop
        if( $this.hasClass('js-subnav-toggle') ) {
          $site.addClass('ocn-show-right');
        }
        // back link of subnav without linking to main nav on mobile
        else if( $this.hasClass('js-subnav-back') ) {
           $site.addClass('ocn-show-right');
        }
        // links rest and closes all
        else {
          // loader(this.href, 'main');
          loader(this.href, $this.data('switch'));
          $hamburger.removeClass('is-active');
          $site.removeClass('ocn-show-right ocn-show-right--sub');
          $('.ocn--sub').removeClass('is-open');
        }

      });

      window.onpopstate = function(e) { //cache history 
        if (e.state) {
          e.preventDefault();
          // loader(e.state.path, 'main', true);
          loader(e.state.path);
        }
      };

      // Hides nav on load
      $('.ocn').addClass('is-visible'); 

      // Main nav toggle for mobile and hamburger
      $hamburger.on('click',function(e){
        e.preventDefault();

        $site.toggleClass('ocn-show-right');
        $('html, body').toggleClass('has-ocn');

        if ($site.hasClass('ocn-show-right')) {
          $hamburger.addClass('is-active');
        } 

        else {
          $hamburger.removeClass('is-active');
          $site.removeClass('ocn-show-right');
          $('.ocn--sub').removeClass('is-open');
          $site.removeClass('ocn-show-right--sub');
        }

      });

      // Main subnav toggle
      $('.js-subnav-toggle').on('click',function(e){
        e.preventDefault();
        $site.toggleClass('ocn-show-right--sub');

        var path = window.location.pathname;

        if( $(this).parents('li').hasClass('is-active') )
        {
          $(this).parents('li').removeClass('is-active');
          $('.ocn__list li:has(a[href="'+ path +'"])').addClass('is-active');
        } else {
          $('li.is-active').removeClass('is-active');
          $(this).parents('li').addClass('is-active');
        }

        $('.ocn--sub').toggleClass('is-open');
        
      });

      // Main subnav back button
      $('.js-subnav-back').on('click',function(e){
        
        e.preventDefault();
        $site.removeClass('ocn-show-right--sub');
        $('.ocn__toggle').removeClass('is-active');
        $('.ocn--sub').removeClass('is-open');
        
      });

      // Makes header smaller on scroll
      $(window).scroll(function () {
        var distanceY = $(this).scrollTop(),
            shrinkOn  = 60,
            header    = $('.header');

        didScroll = true;

        if (distanceY > shrinkOn) {
          header.addClass('is-smaller');
        } else {
          if (header.hasClass('is-smaller')) {
            header.removeClass('is-smaller');
          }
        }
      });

    }

    exports.init = init;

  })();
  // #End header.js

  // #Fastclick Mobile delay
  // #Amended for IE 
  if (window.addEventListener) {
    window.addEventListener('load', function() {
      new FastClick(document.body);
    }, false);
  }

});