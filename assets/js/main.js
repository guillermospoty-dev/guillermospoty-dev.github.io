/**
* Template Name: MyPortfolio
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Updated: Aug 08 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      // TEMPORARY FIX FOR DEMO: Wait 5 seconds to view the custom loader animation
      setTimeout(() => {
          preloader.remove();     
      }, 5000); 
    });
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
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

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

})();


/* COLOR VALUES */
const digitColors = [
  "Black","Brown","Red","Orange","Yellow","Green","Blue","Violet","Grey","White"
];

const multiplierValues = {
  "Black": 1,
  "Brown": 10,
  "Red": 100,
  "Orange": 1_000,
  "Yellow": 10_000,
  "Green": 100_000,
  "Blue": 1_000_000,
  "Violet": 10_000_000,
  "Grey": 100_000_000,
  "White": 1_000_000_000,
  "Gold": 0.1,
  "Silver": 0.01
};

const toleranceValues = {
  "Brown": "±1%",
  "Red": "±2%",
  "Green": "±0.5%",
  "Blue": "±0.25%",
  "Violet": "±0.1%",
  "Grey": "±0.05%",
  "Gold": "±5%",
  "Silver": "±10%"
};

/* Populate dropdown menus */
function loadOptions() {
  document.querySelectorAll(".digit-band").forEach(sel => {
    digitColors.forEach((color, index) => {
      sel.insertAdjacentHTML("beforeend", `<option value="${index}">${color}</option>`);
    });
  });

  for (let color in multiplierValues) {
    multiplier.insertAdjacentHTML("beforeend", `<option value="${multiplierValues[color]}">${color}</option>`);
  }

  for (let color in toleranceValues) {
    tolerance.insertAdjacentHTML("beforeend", `<option value="${toleranceValues[color]}">${color} (${toleranceValues[color]})</option>`);
  }
}

/* Handle mode switching */
document.getElementById("mode").addEventListener("change", function () {
  document.getElementById("band3-container").style.display =
    this.value === "5" ? "block" : "none";
});

/* Calculate function */
function calculateResistor() {
  const mode = document.getElementById("mode").value;
  let b1 = parseInt(band1.value);
  let b2 = parseInt(band2.value);
  let multiplierVal = parseFloat(multiplier.value);
  let tol = tolerance.value;

  let base;

  if (mode === "4") {
    base = (b1 * 10 + b2);
  } else {
    let b3 = parseInt(band3.value);
    base = (b1 * 100 + b2 * 10 + b3);
  }

  let resistance = base * multiplierVal;

  document.getElementById("result").textContent =
    resistance.toLocaleString() + " Ω " + tol;
}

/* Load dropdown values when modal opens */
document.getElementById("calculatorModal").addEventListener("shown.bs.modal", loadOptions);

