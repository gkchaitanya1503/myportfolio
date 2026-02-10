/* ========================================
   Red Rock Minerals — Main JavaScript
   ======================================== */
(function() {
  'use strict';

  // ==================== NAVIGATION ====================
  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navOverlay = document.querySelector('.nav-mobile-overlay');
  var navLinks = document.querySelectorAll('.nav-mobile-overlay .nav-link');

  // Scroll effect
  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navOverlay.classList.toggle('open');
      document.body.style.overflow = navOverlay.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ==================== SCROLL REVEAL ====================
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(function(el) {
    revealObserver.observe(el);
  });

  // ==================== COUNTER ANIMATION ====================
  var counters = document.querySelectorAll('.stat-number[data-target]');
  var counterDone = false;

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats-section');
  if (statsSection) counterObserver.observe(statsSection);

  function animateCounters() {
    counters.forEach(function(counter) {
      var target = parseFloat(counter.getAttribute('data-target'));
      var start = null;
      var duration = 2000;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        var current = Math.floor(eased * target);

        // Handle decimals
        if (target % 1 !== 0) {
          current = (eased * target).toFixed(1);
        }

        counter.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // ==================== SMOOTH SCROLL (same-page links) ====================
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ==================== PARTICLES.JS INIT ====================
  var particlesContainer = document.getElementById('particles-js');
  if (particlesContainer && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        color: { value: ['#E63946', '#FFD700', '#00F5FF'] },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true },
        size: { value: 2.5, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#E63946',
          opacity: 0.08,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: true,
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: false },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.2 } }
        }
      },
      retina_detect: true
    });
  }

  // Reduce particles on mobile
  if (window.innerWidth < 768 && particlesContainer) {
    // Particles.js will auto-reduce, but we add a class for CSS control
    particlesContainer.classList.add('particles-mobile');
  }

  // ==================== COPYRIGHT YEAR ====================
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
