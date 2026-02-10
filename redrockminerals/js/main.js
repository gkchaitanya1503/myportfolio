/* ========================================
   Red Rock Minerals — Main JavaScript
   ======================================== */
(function() {
  'use strict';

  // ==================== AOS INIT ====================
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, duration: 700, offset: 50 });
  }

  // ==================== NAVIGATION ====================
  var nav = document.querySelector('.nav');
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('mobileMenu');

  // Scroll effect
  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', function() {
      var isOpen = navOverlay.classList.contains('open');
      navToggle.classList.toggle('active');
      navOverlay.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    navOverlay.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================== SCROLL REVEAL ====================
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function(el) { revealObserver.observe(el); });
  }

  // ==================== COUNTER ANIMATION ====================
  // Selects both .stat-number[data-target] AND span[data-target] inside .stat-number
  var counters = document.querySelectorAll('[data-target]');
  var counterDone = false;

  function animateCounters() {
    if (counterDone) return;
    counterDone = true;
    counters.forEach(function(counter) {
      var target = parseFloat(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      var start = null;
      var duration = 2000;
      var isLarge = target >= 1000;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);

        if (isLarge) {
          counter.textContent = current.toLocaleString();
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = isLarge ? target.toLocaleString() : target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  var statsSection = document.querySelector('.stats-section');
  if (statsSection && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });
    counterObserver.observe(statsSection);
  }

  // ==================== SMOOTH SCROLL ====================
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
  if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
    var particleCount = window.innerWidth < 768 ? 20 : 50;
    particlesJS('particles-js', {
      particles: {
        number: { value: particleCount, density: { enable: true, value_area: 1000 } },
        color: { value: ['#E63946', '#FFD700', '#00F5FF'] },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 150, color: '#E63946', opacity: 0.08, width: 1 },
        move: { enable: true, speed: 0.8, direction: 'none', random: true, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
      },
      retina_detect: true
    });
  }

  // ==================== COPYRIGHT YEAR ====================
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
