/* ========================================
   Red Rock Minerals — Contact Form
   ======================================== */
(function() {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.btn-submit');
  var submitText = submitBtn ? submitBtn.innerHTML : '';

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate
    if (!validateForm()) return;

    // Loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    hideStatus();

    // Submit to Formspree (replace with your endpoint)
    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(res) {
      if (res.ok) {
        showStatus('success', '<i class="fas fa-check-circle"></i> Message sent! We\'ll get back to you within 24 hours.');
        form.reset();
        clearErrors();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function() {
      showStatus('error', '<i class="fas fa-exclamation-triangle"></i> Something went wrong. Please try again or email us directly at info@redrockminerals.in');
    })
    .finally(function() {
      submitBtn.innerHTML = submitText;
      submitBtn.disabled = false;
    });
  });

  // Real-time validation on blur
  var inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      validateField(input);
    });
    input.addEventListener('input', function() {
      if (input.closest('.form-group').classList.contains('error')) {
        validateField(input);
      }
    });
  });

  function validateForm() {
    var valid = true;
    clearErrors();

    var name = form.querySelector('[name="name"]');
    var email = form.querySelector('[name="email"]');
    var message = form.querySelector('[name="message"]');

    if (!name.value.trim()) {
      setError(name, 'Please enter your name');
      valid = false;
    }

    if (!email.value.trim()) {
      setError(email, 'Please enter your email');
      valid = false;
    } else if (!isValidEmail(email.value)) {
      setError(email, 'Please enter a valid email address');
      valid = false;
    }

    if (!message.value.trim()) {
      setError(message, 'Please enter a message');
      valid = false;
    } else if (message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters');
      valid = false;
    }

    return valid;
  }

  function validateField(input) {
    var name = input.getAttribute('name');
    var group = input.closest('.form-group');
    group.classList.remove('error');
    var errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.style.display = 'none';

    if (name === 'name' && !input.value.trim()) {
      setError(input, 'Please enter your name');
    } else if (name === 'email') {
      if (!input.value.trim()) setError(input, 'Please enter your email');
      else if (!isValidEmail(input.value)) setError(input, 'Please enter a valid email');
    } else if (name === 'message') {
      if (!input.value.trim()) setError(input, 'Please enter a message');
      else if (input.value.trim().length < 10) setError(input, 'Message must be at least 10 characters');
    }
  }

  function setError(input, msg) {
    var group = input.closest('.form-group');
    group.classList.add('error');
    var errorEl = group.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  }

  function clearErrors() {
    form.querySelectorAll('.form-group').forEach(function(g) {
      g.classList.remove('error');
      var err = g.querySelector('.form-error');
      if (err) err.style.display = 'none';
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(type, html) {
    statusEl.className = 'form-status ' + type;
    statusEl.innerHTML = html;
    statusEl.style.display = 'block';
  }

  function hideStatus() {
    statusEl.style.display = 'none';
    statusEl.className = 'form-status';
  }
})();
