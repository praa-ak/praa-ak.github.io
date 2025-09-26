/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Enhanced Preloader with Fallbacks
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    let preloaderRemoved = false;
    
    // Primary: Remove on window load
    window.addEventListener('load', () => {
      if (!preloaderRemoved) {
        preloader.remove();
        preloaderRemoved = true;
      }
    });
    
    // Fallback 1: Remove after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (!preloaderRemoved && preloader) {
          preloader.remove();
          preloaderRemoved = true;
        }
      }, 1000);
    });
    
    // Fallback 2: Force remove after maximum wait time
    setTimeout(() => {
      if (!preloaderRemoved && preloader) {
        preloader.remove();
        preloaderRemoved = true;
      }
    }, 3000); // Maximum 3 seconds wait
    
    // Fallback 3: Remove if critical elements are loaded
    const checkCriticalElements = () => {
      const navbar = document.querySelector('.navbar');
      const heroSection = document.querySelector('#hero');
      
      if (navbar && heroSection && !preloaderRemoved) {
        setTimeout(() => {
          if (!preloaderRemoved && preloader) {
            preloader.remove();
            preloaderRemoved = true;
          }
        }, 500);
      }
    };
    
    // Check critical elements periodically
    setTimeout(checkCriticalElements, 1500);
    setTimeout(checkCriticalElements, 2000);
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  
  // Multiple initialization attempts for deployment compatibility
  window.addEventListener('load', aosInit);
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(aosInit, 100);
  });
  
  // Fallback initialization
  setTimeout(function() {
    if (typeof AOS !== 'undefined' && AOS.init) {
      aosInit();
    }
  }, 1000);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navbar Scrollspy (Updated for Bootstrap Navbar)
   */
  let navbarlinks = document.querySelectorAll('.navbar-nav .nav-link');

  function navbarScrollspy() {
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = document.querySelector(navbarlink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navbar-nav .nav-link.active').forEach(link => link.classList.remove('active'));
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarScrollspy);
  document.addEventListener('scroll', navbarScrollspy);

})();