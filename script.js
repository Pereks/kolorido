"use strict";

document.addEventListener("DOMContentLoaded", function() {
  // 1) HAMBURGER + MOBILE NAV
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.header-menu nav') || document.querySelector('nav');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
      overlay.classList.toggle('active');
      if (window.innerWidth <= 768) {
        const headerMenuContainer = document.querySelector('.header-menu');
        if (headerMenuContainer) {
          headerMenuContainer.classList.remove('hidden');
        }
      }
    });
    overlay.addEventListener('click', function () {
      navMenu.classList.remove('active');
      hamburger.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Close button for mobile menu
  const closeMenuButton = document.querySelector('.close-menu');
  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', function () {
      navMenu.classList.remove('active');
      hamburger.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Reset mobile menu state on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      if (hamburger) hamburger.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  // Toggle dropdown for categories in mobile view without closing the menu
  document.querySelectorAll('.has-dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdownMenu = this.nextElementSibling;
        if (dropdownMenu) {
          dropdownMenu.classList.toggle('active');
        }
      }
    });
  });

  // 2) SMOOTH SCROLL FOR NAV + FOOTER LINKS
  document.querySelectorAll('nav a[href^="#"], .footer-links a[href^="#"]')
    .forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && this.closest('.has-dropdown')) {
          return;
        }
        e.preventDefault();
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (hamburger) hamburger.classList.remove('open');
          overlay.classList.remove('active');
        }
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

  // 3) BACK TO TOP
  const backToTopButton = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    backToTopButton.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4) HERO SLIDESHOW
  const slides = document.querySelector('.slides');
  const slideElements = document.querySelectorAll('.slide');
  const leftArrow = document.querySelector('.hero-slideshow .left-arrow');
  const rightArrow = document.querySelector('.hero-slideshow .right-arrow');
  let currentSlide = 0;
  let slideInterval;
  function updateSlideshow() {
    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
  }
  function startSlideShow() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slideElements.length;
      updateSlideshow();
    }, 5000);
  }
  function resetSlideShowInterval() {
    clearInterval(slideInterval);
    startSlideShow();
  }
  if (leftArrow && rightArrow) {
    rightArrow.addEventListener('click', function() {
      currentSlide = (currentSlide + 1) % slideElements.length;
      updateSlideshow();
      resetSlideShowInterval();
    });
    leftArrow.addEventListener('click', function() {
      currentSlide = (currentSlide - 1 + slideElements.length) % slideElements.length;
      updateSlideshow();
      resetSlideShowInterval();
    });
  }
  slideElements.forEach(slide => {
    slide.addEventListener('click', function() {
      const href = slide.getAttribute('data-href');
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });
  startSlideShow();

  // 5) GALLERY INFINITE LOOP
  const galleryItems = document.querySelector('.gallery-items');
  const leftGalleryArrow = document.getElementById('gallery-left-arrow');
  const rightGalleryArrow = document.getElementById('gallery-right-arrow');
  let galleryIndex = 0;
  if (galleryItems) {
    const galleryItemNodes = Array.from(galleryItems.children);
    const galleryLength = galleryItemNodes.length;
    galleryItemNodes.forEach(item => {
      const clone = item.cloneNode(true);
      galleryItems.appendChild(clone);
    });
    function updateGallery() {
      const itemWidth = galleryItems.children[0].clientWidth;
      galleryItems.style.transform = 'translateX(' + (-galleryIndex * itemWidth) + 'px)';
      if (galleryIndex >= galleryLength) {
        galleryIndex -= galleryLength;
        galleryItems.style.transition = 'none';
        galleryItems.style.transform = 'translateX(' + (-galleryIndex * itemWidth) + 'px)';
        requestAnimationFrame(() => {
          galleryItems.style.transition = 'transform 0.5s ease';
        });
      }
      if (galleryIndex < 0) {
        galleryIndex += galleryLength;
        galleryItems.style.transition = 'none';
        galleryItems.style.transform = 'translateX(' + (-galleryIndex * itemWidth) + 'px)';
        requestAnimationFrame(() => {
          galleryItems.style.transition = 'transform 0.5s ease';
        });
      }
    }
    if (leftGalleryArrow && rightGalleryArrow) {
      rightGalleryArrow.addEventListener('click', function() {
        galleryIndex++;
        updateGallery();
      });
      leftGalleryArrow.addEventListener('click', function() {
        galleryIndex--;
        updateGallery();
      });
    }
  }

  // 6) EXPANDED SEARCH LOGIC
  const searchToggle = document.querySelector('.search-toggle');
  const expandedSearch = document.querySelector('.expanded-search');
  const expandedSearchClose = document.querySelector('.expanded-search-close');
  if (searchToggle && expandedSearch && expandedSearchClose) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      expandedSearch.classList.toggle('active');
    });
    expandedSearchClose.addEventListener('click', function() {
      expandedSearch.classList.remove('active');
    });
  }

  // 7) FORM VALIDATION
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        e.preventDefault();
        alert('Please fill out all fields.');
      } else if (!validateEmail(email)) {
        e.preventDefault();
        alert('Please enter a valid email address.');
      }
    });
  }
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  // 8) MENU SHOW/HIDE ON SCROLL (Desktop only)
  const headerMenuContainer = document.querySelector('.header-menu');
  if (headerMenuContainer) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      if (window.innerWidth > 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          headerMenuContainer.classList.add('hidden');
        } else if (currentScrollY < lastScrollY) {
          headerMenuContainer.classList.remove('hidden');
        }
      }
      lastScrollY = currentScrollY;
    });
  } else {
    console.error("Header menu container not found. Ensure your HTML includes a .header-menu element.");
  }
});
