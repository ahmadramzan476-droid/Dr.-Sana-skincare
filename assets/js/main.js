/**
 * Aesthetic Evolution Skincare & Laser Clinic — Dr. Sana Waqar Qureshi
 *
 * Four independent modules:
 *   0. Reveal  — scroll-triggered fade/slide via IntersectionObserver.
 *   1. Nav     — the mobile menu, shown below 1024px where .site-nav is hidden.
 *   2. Accent  — carries forward the one themeable value from the original
 *                design-component export, now driving --accent (rose gold).
 *   3. Booking — validation, spam protection and submission for the
 *                appointment request form in the Visit section.
 */

/* ==========================================================================
   Configuration — set FORM_ACCESS_KEY before the form will send anything.
   Get a free key at https://web3forms.com (enter the clinic inbox address,
   they email the key). No account or backend required.
   ========================================================================== */

var FORM_ENDPOINT = 'https://api.web3forms.com/submit';
var FORM_ACCESS_KEY = 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE';
var CLINIC_PHONE = '+92 318 5161027';

/* --------------------------------------------------------------------------
   0. Scroll reveal
   Runs first so that an error in a later module can't leave content hidden.
   The head script only adds .has-reveal when this can work; it also removes
   the class after 2.5s unless __revealReady is set here.
   -------------------------------------------------------------------------- */

(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('has-reveal')) return;

  /**
   * Stagger by arrival, not by position. Siblings that enter the viewport in
   * the same batch are offset 60ms apart; a card scrolled into view on its own
   * appears immediately. (nth-child delays would make the sixth card of a
   * stacked mobile grid wait 0.26s every time it scrolls in by itself.)
   */
  var STAGGER_STEP = 0.06;

  var observer = new IntersectionObserver(function (entries) {
    var batchIndex = new Map();

    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var parent = el.parentElement;

      if (parent && parent.hasAttribute('data-stagger')) {
        var i = batchIndex.get(parent) || 0;
        el.style.setProperty('--reveal-delay', (i * STAGGER_STEP).toFixed(2) + 's');
        batchIndex.set(parent, i + 1);
      }

      el.classList.add('in-view');
      observer.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
  });

  window.__revealReady = true;
})();

/* --------------------------------------------------------------------------
   1. Mobile navigation

   The panel is `hidden` while closed, which keeps its links out of the tab
   order and the accessibility tree. Opening clears `hidden` first and adds
   .is-open on the next frame, so the slide-in transition has a start frame
   to animate from; closing reverses that and waits for the transition to end
   before hiding again.
   -------------------------------------------------------------------------- */

(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  var panel = nav.querySelector('.mobile-nav__panel');
  var closeBtn = nav.querySelector('.mobile-nav__close');
  var DESKTOP = window.matchMedia('(min-width: 1024px)');

  var isOpen = false;
  var hideTimer = null;

  /** Width of the scrollbar the lock is about to remove, so the page doesn't shift. */
  function scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    var gap = scrollbarWidth();
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = gap + 'px';

    nav.hidden = false;
    // Force a reflow so the pre-transition transform is the browser's start frame.
    void nav.offsetWidth;
    nav.classList.add('is-open');

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');

    if (closeBtn) closeBtn.focus();
  }

  function close(returnFocus) {
    if (!isOpen) return;
    isOpen = false;

    nav.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');

    // Hide only once the panel has slid out; 300ms covers the 260ms transition.
    hideTimer = setTimeout(function () {
      nav.hidden = true;
      hideTimer = null;
    }, 300);

    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen) close(true); else open();
  });

  // The backdrop and the close button both carry data-nav-close.
  nav.addEventListener('click', function (event) {
    if (event.target.closest('[data-nav-close]')) close(true);
  });

  // Following a link should dismiss the menu and let the anchor scroll happen.
  nav.addEventListener('click', function (event) {
    if (event.target.closest('.mobile-nav__link, .mobile-nav__cta, .mobile-nav__phone')) {
      close(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      close(true);
      return;
    }

    // Keep Tab inside the panel while it is modal.
    if (event.key !== 'Tab' || !panel) return;

    var focusable = panel.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /**
   * Rotating into landscape can cross into the desktop layout, where the
   * hamburger is hidden — leaving the menu open and unclosable.
   */
  function onBreakpoint(event) {
    if (event.matches) close(false);
  }

  if (typeof DESKTOP.addEventListener === 'function') {
    DESKTOP.addEventListener('change', onBreakpoint);
  } else if (typeof DESKTOP.addListener === 'function') {
    DESKTOP.addListener(onBreakpoint);
  }
})();

/* --------------------------------------------------------------------------
   2. Accent
   -------------------------------------------------------------------------- */

(function () {
  'use strict';

  /** Accent options — rose gold steps that keep light button text above 4.5:1. */
  var ACCENTS = ['#96653F', '#7A5033', '#5E3C28'];
  var DEFAULT_ACCENT = ACCENTS[0];

  var HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

  function setAccent(colour) {
    var next = typeof colour === 'string' && HEX.test(colour.trim())
      ? colour.trim()
      : DEFAULT_ACCENT;

    document.documentElement.style.setProperty('--accent', next);
    return next;
  }

  function resolveAccent() {
    var fromQuery = null;

    try {
      fromQuery = new URLSearchParams(window.location.search).get('accent');
    } catch (err) {
      fromQuery = null;
    }

    if (fromQuery && !fromQuery.startsWith('#')) {
      fromQuery = '#' + fromQuery;
    }

    return fromQuery || document.documentElement.dataset.accent || DEFAULT_ACCENT;
  }

  setAccent(resolveAccent());

  window.RestoreSkin = {
    accents: ACCENTS.slice(),
    defaultAccent: DEFAULT_ACCENT,
    setAccent: setAccent
  };
})();

/* --------------------------------------------------------------------------
   3. Appointment form
   -------------------------------------------------------------------------- */

(function () {
  'use strict';

  var form = document.getElementById('appointment-form');
  if (!form) return;

  var submitBtn = document.getElementById('bf-submit');
  var status = document.getElementById('bf-status');
  var message = document.getElementById('bf-message');
  var messageUsed = document.getElementById('bf-message-used');
  var captchaInput = document.getElementById('bf-captcha');
  var captchaQuestion = document.getElementById('bf-captcha-question');
  var honeypot = form.elements.company;

  var COOLDOWN_SECONDS = 30;
  var captchaAnswer = 0;

  /* -- Validation rules -------------------------------------------------- */

  /**
   * Pakistani mobile numbers, tolerant of the formats people actually type:
   * 03185161027, 0318-5161027, +923185161027, +92 318 5161027, 0092 318…
   * All reduce to a leading 0/92/+92 followed by 3 and nine more digits.
   */
  var PK_PHONE = /^(?:\+92|0092|92|0)3\d{9}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    'bf-name': function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Please enter your full name.';
      return '';
    },
    'bf-phone': function (v) {
      if (!v) return 'Please enter a phone number so we can confirm your appointment.';
      if (!PK_PHONE.test(v.replace(/[\s()-]/g, ''))) {
        return 'Enter a valid Pakistani number, for example 0318 5161027.';
      }
      return '';
    },
    'bf-email': function (v) {
      if (v && !EMAIL.test(v)) return 'That email address does not look right.';
      return '';
    },
    'bf-service': function (v) {
      if (!v) return 'Please choose the service you are interested in.';
      return '';
    },
    'bf-captcha': function (v) {
      if (!v) return 'Please answer the spam check.';
      if (parseInt(v, 10) !== captchaAnswer) return 'That answer is not correct.';
      return '';
    }
  };

  /* -- Field-level helpers ----------------------------------------------- */

  function showError(field, text) {
    var box = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', 'true');
    if (box) {
      box.textContent = text;
      box.hidden = false;
    }
  }

  function clearError(field) {
    var box = document.getElementById(field.id + '-error');
    field.removeAttribute('aria-invalid');
    if (box) {
      box.textContent = '';
      box.hidden = true;
    }
  }

  function validateField(field) {
    var rule = rules[field.id];
    if (!rule) return true;

    var problem = rule(String(field.value || '').trim());
    if (problem) {
      showError(field, problem);
      return false;
    }
    clearError(field);
    return true;
  }

  /** @returns {HTMLElement|null} the first invalid field, or null if all pass. */
  function validateAll() {
    var firstInvalid = null;

    Object.keys(rules).forEach(function (id) {
      var field = document.getElementById(id);
      if (field && !validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    return firstInvalid;
  }

  /* -- Status banner ------------------------------------------------------ */

  function setStatus(kind, text) {
    status.className = 'form-status form-status--' + kind;
    status.textContent = text;
    status.hidden = false;
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = '';
  }

  /* -- Spam check --------------------------------------------------------- */

  function refreshCaptcha() {
    var a = 2 + Math.floor(Math.random() * 7);
    var b = 1 + Math.floor(Math.random() * 6);
    captchaAnswer = a + b;
    captchaQuestion.textContent = a + ' + ' + b;
    captchaInput.value = '';
  }

  /* -- Submit throttle ---------------------------------------------------- */

  var labelEl = submitBtn.querySelector('.booking-form__label');
  var defaultLabel = labelEl.textContent;

  function startCooldown() {
    var left = COOLDOWN_SECONDS;
    submitBtn.disabled = true;
    labelEl.textContent = 'Please wait ' + left + 's';

    var timer = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        clearInterval(timer);
        submitBtn.disabled = false;
        labelEl.textContent = defaultLabel;
        return;
      }
      labelEl.textContent = 'Please wait ' + left + 's';
    }, 1000);
  }

  /* -- Wiring ------------------------------------------------------------- */

  // Re-validate a field once it has been touched, so errors clear as you fix them.
  Object.keys(rules).forEach(function (id) {
    var field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
    field.addEventListener('change', function () { validateField(field); });
  });

  message.addEventListener('input', function () {
    messageUsed.textContent = String(message.value.length);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearStatus();

    // Honeypot: a real visitor never sees this field, so anything in it is a bot.
    // Report success and drop the submission rather than telling the bot it failed.
    if (honeypot && honeypot.value) {
      form.reset();
      setStatus('success', 'Thank you! We’ve received your appointment request. Our team will contact you within 24 hours to confirm.');
      return;
    }

    var firstInvalid = validateAll();
    if (firstInvalid) {
      setStatus('error', 'Please check the highlighted fields and try again.');
      firstInvalid.focus();
      return;
    }

    if (FORM_ACCESS_KEY === 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      setStatus('error', 'This form is not connected yet. Add your Web3Forms access key in main.js, or contact us directly at ' + CLINIC_PHONE + '.');
      return;
    }

    var data = new FormData(form);
    data.delete('company');
    data.delete('captcha');
    data.append('access_key', FORM_ACCESS_KEY);
    data.append('subject', 'New appointment request — Aesthetic Evolution');
    data.append('from_name', 'Aesthetic Evolution website');

    form.classList.add('is-sending');
    submitBtn.disabled = true;
    labelEl.textContent = 'Sending…';

    fetch(FORM_ENDPOINT, { method: 'POST', body: data })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result || result.success !== true) throw new Error('rejected');

        form.reset();
        messageUsed.textContent = '0';
        refreshCaptcha();
        setStatus('success', 'Thank you! We’ve received your appointment request. Our team will contact you within 24 hours to confirm.');
        startCooldown();
      })
      .catch(function () {
        setStatus('error', 'Something went wrong. Please try again or contact us directly at ' + CLINIC_PHONE);
        submitBtn.disabled = false;
        labelEl.textContent = defaultLabel;
      })
      .finally(function () {
        form.classList.remove('is-sending');
      });
  });

  refreshCaptcha();
  messageUsed.textContent = String(message.value.length);
})();
