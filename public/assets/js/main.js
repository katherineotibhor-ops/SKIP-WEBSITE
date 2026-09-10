/* ==========================================================================
   Elevated Identities — main.js

   Two independent enhancements, both optional:
     1. Mobile navigation panel (the nav is a plain list without JS).
     2. Contact form validation + async submit (the form is a normal POST
        without JS, and the browser's own validation applies because
        `novalidate` is set here at runtime rather than in the markup).

   Nothing else on the site depends on JavaScript.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------------------------ */

  function initNav() {
    var toggle = document.getElementById("ei-nav-toggle");
    var nav = document.getElementById("ei-nav");
    if (!toggle || !nav) return;

    var DESKTOP = window.matchMedia("(min-width: 60em)");

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function focusables() {
      return Array.prototype.filter.call(
        nav.querySelectorAll("a[href], button:not([disabled])"),
        function (el) { return el.offsetParent !== null; }
      );
    }

    function open() {
      toggle.setAttribute("aria-expanded", "true");
      nav.setAttribute("data-open", "true");
      document.addEventListener("keydown", onKeydown, true);
      document.addEventListener("click", onDocumentClick, true);
    }

    function close(returnFocus) {
      toggle.setAttribute("aria-expanded", "false");
      nav.removeAttribute("data-open");
      document.removeEventListener("keydown", onKeydown, true);
      document.removeEventListener("click", onDocumentClick, true);
      if (returnFocus) toggle.focus();
    }

    function onKeydown(event) {
      if (event.key === "Escape" || event.key === "Esc") {
        event.preventDefault();
        close(true);
        return;
      }

      if (event.key !== "Tab") return;

      // Keep focus inside the header while the panel is open.
      var items = focusables();
      if (!items.length) return;

      var first = toggle;
      var last = items[items.length - 1];
      var active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onDocumentClick(event) {
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      close(false);
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) close(false); else open();
    });

    // Close after following an in-page link from the panel.
    nav.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (link && isOpen()) close(false);
    });

    // Leaving the mobile breakpoint must not strand the panel in an open state.
    // A resize listener is used rather than a MediaQueryList "change" listener:
    // it behaves identically here, needs no Safari < 14 fallback, and can be
    // exercised directly in a test.
    window.addEventListener("resize", function () {
      if (DESKTOP.matches && isOpen()) close(false);
    });
  }

  /* ------------------------------------------------------------------------
     2. Contact form
     ------------------------------------------------------------------------ */

  var RULES = {
    name: {
      test: function (v) { return v.trim().length >= 2; },
      message: "Please enter your full name."
    },
    email: {
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      message: "Please enter a valid email address."
    },
    phone: {
      test: function (v) { return v.replace(/[^0-9]/g, "").length >= 10; },
      message: "Please enter a phone number with at least 10 digits."
    },
    service: {
      test: function (v) { return v !== ""; },
      message: "Please choose the service you are interested in."
    },
    message: {
      test: function (v) { return v.trim().length >= 10; },
      message: "Please tell us a little more — at least 10 characters."
    },
    consent: {
      test: function (v) { return v === true; },
      message: "Please confirm we may contact you about your enquiry."
    }
  };

  function initForm() {
    var form = document.getElementById("ei-contact-form");
    if (!form) return;

    var status = document.getElementById("ei-form-status");
    var submit = form.querySelector('button[type="submit"]');

    // Take over validation from the browser now that JS is confirmed running.
    form.setAttribute("novalidate", "");

    function fieldError(field) {
      return document.getElementById(field.id + "-error");
    }

    function showError(field, message) {
      var box = fieldError(field);
      field.setAttribute("aria-invalid", "true");
      if (box) box.textContent = message;
    }

    function clearError(field) {
      var box = fieldError(field);
      field.removeAttribute("aria-invalid");
      if (box) box.textContent = "";
    }

    function validateField(field) {
      var rule = RULES[field.name];
      if (!rule) return true;
      var value = field.type === "checkbox" ? field.checked : field.value;
      if (rule.test(value)) {
        clearError(field);
        return true;
      }
      showError(field, rule.message);
      return false;
    }

    function setStatus(state, html) {
      if (!status) return;
      status.setAttribute("data-state", state);
      status.innerHTML = html;
    }

    // Validate on blur; once a field is marked invalid, re-check as it is fixed.
    Object.keys(RULES).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("change", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstInvalid = null;
      Object.keys(RULES).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        setStatus("error", "<p>Please correct the highlighted fields and try again.</p>");
        firstInvalid.focus();
        return;
      }

      var endpoint = form.getAttribute("action") || "";

      // Guard against shipping with the placeholder endpoint still in place.
      if (endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        setStatus("error",
          "<p>This form is not connected yet. Please email " +
          '<a href="mailto:consultations@elevatedidentities.com">consultations@elevatedidentities.com</a> or call ' +
          '<a href="tel:+16028248796">(602) 824-8796</a> and we will come straight back to you.</p>');
        return;
      }

      submit.disabled = true;
      var originalLabel = submit.textContent;
      submit.textContent = "Sending…";
      setStatus("", "");

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) return response.json().catch(function () { return {}; });
          return response.json()
            .catch(function () { return {}; })
            .then(function (data) {
              var err = new Error(readError(data));
              err.fromServer = true;      // safe to show the visitor
              throw err;
            });
        })
        .then(function () {
          form.reset();
          Object.keys(RULES).forEach(function (name) {
            var field = form.elements[name];
            if (field) clearError(field);
          });
          setStatus("success",
            "<p><strong>Thank you — your enquiry has been sent.</strong> " +
            "We will be in touch shortly to arrange your free consultation.</p>");
        })
        .catch(function (error) {
          // Only messages the form service gave us are shown. A raw exception
          // ("Failed to fetch") is an implementation detail, not visitor copy.
          var message = (error && error.fromServer && error.message)
            ? error.message
            : "Your enquiry could not be sent.";
          setStatus("error",
            "<p>" + escapeHtml(message) +
            " Please try again, or email " +
            '<a href="mailto:consultations@elevatedidentities.com">consultations@elevatedidentities.com</a> ' +
            "directly.</p>");
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = originalLabel;
        });
    });
  }

  function readError(data) {
    if (data && Array.isArray(data.errors) && data.errors.length) {
      return data.errors.map(function (e) { return e.message; }).join(" ");
    }
    return "Your enquiry could not be sent.";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------------
     3. Scroll reveals
     ------------------------------------------------------------------------ */

  var REDUCED = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  function showAll(nodes) {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-visible");
  }

  function initReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    // No observer support, or the visitor asked for less motion: show at once.
    if (!("IntersectionObserver" in window) || REDUCED.matches) {
      showAll(els);
      return;
    }

    // Stagger each element against its own siblings, so a card grid ripples
    // in but a lone heading does not sit waiting.
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var parent = el.parentNode;
      if (!parent || !parent.querySelectorAll) continue;
      var sibs = parent.querySelectorAll("[data-reveal]");
      var index = Array.prototype.indexOf.call(sibs, el);
      el.style.setProperty("--d", index < 0 ? 0 : Math.min(index, 6));
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    for (var j = 0; j < els.length; j++) observer.observe(els[j]);
  }

  /* ------------------------------------------------------------------------
     4. Header state + reading progress
     ------------------------------------------------------------------------ */

  function initHeaderScroll() {
    var header = document.querySelector(".ei-header");
    if (!header) return;

    var lastY = -1;

    function update() {
      var de = document.documentElement;
      var y = window.pageYOffset || de.scrollTop || 0;
      var max = de.scrollHeight - de.clientHeight;

      if (y > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");

      header.style.setProperty("--ei-progress", max > 0 ? (y / max).toFixed(4) : 0);
    }

    function frame() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y !== lastY) { lastY = y; update(); }
      if (!document.hidden) window.requestAnimationFrame(frame);
    }

    // Resume the loop if the tab was hidden while frames were paused.
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) window.requestAnimationFrame(frame);
    });

    update();
    window.requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------------
     5. Counting figures
     ------------------------------------------------------------------------ */

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var from = parseFloat(el.getAttribute("data-count-from"));
    if (isNaN(from)) from = 0;

    // Never animate when the page is hidden: requestAnimationFrame is paused
    // there, which would strand the figure on its starting value.
    if (REDUCED.matches || document.hidden) { el.textContent = String(target); return; }

    var duration = 1400;
    var started = null;
    var settled = false;

    function finish() {
      if (settled) return;
      settled = true;
      el.textContent = String(target);
    }

    // These figures are facts, not decoration. If frames stop arriving for any
    // reason, this guarantees the true value is what remains on screen.
    var guard = window.setTimeout(finish, duration + 600);

    function step(now) {
      if (settled) return;
      if (started === null) started = now;
      var t = Math.min((now - started) / duration, 1);
      if (t < 1) {
        el.textContent = String(Math.round(from + (target - from) * easeOut(t)));
        window.requestAnimationFrame(step);
      } else {
        window.clearTimeout(guard);
        finish();
      }
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) return;   // leave the printed value

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    for (var i = 0; i < els.length; i++) observer.observe(els[i]);
  }

  /* ------------------------------------------------------------------------
     6. Pointer-driven interaction
     ------------------------------------------------------------------------ */

  var FINE = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : { matches: true };

  function interactive() {
    return FINE.matches && !REDUCED.matches;
  }

  /* Throttle a pointer handler to one call per animation frame. */
  function onFrame(handler) {
    var queued = false;
    var last = null;
    return function (event) {
      last = event;
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        handler(last);
      });
    };
  }

  /* Headline revealed a word at a time from behind a mask. */
  function initSplitHeadings() {
    if (REDUCED.matches) return;               // leave the text untouched
    var els = document.querySelectorAll("[data-split]");

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var words = el.textContent.trim().split(/\s+/);
      if (words.length < 2) continue;

      el.textContent = "";
      for (var w = 0; w < words.length; w++) {
        var mask = document.createElement("span");
        mask.className = "ei-word";
        mask.style.setProperty("--w", w);

        var inner = document.createElement("i");
        inner.textContent = words[w];
        mask.appendChild(inner);
        el.appendChild(mask);

        // Real space between words, so selection and screen readers behave.
        if (w < words.length - 1) el.appendChild(document.createTextNode(" "));
      }
      el.classList.add("is-split");
    }
  }

  /* Light that tracks the pointer across the hero. */
  function initHeroSpotlight() {
    var hero = document.querySelector(".ei-hero");
    if (!hero || !interactive()) return;
    var spot = hero.querySelector(".ei-hero__spot");
    if (!spot) return;

    hero.addEventListener("pointermove", onFrame(function (event) {
      var r = hero.getBoundingClientRect();
      var px = (event.clientX - r.left) / r.width;
      var py = (event.clientY - r.top) / r.height;

      spot.style.setProperty("--mx", (px * 100) + "%");
      spot.style.setProperty("--my", (py * 100) + "%");

      // -1 .. 1, used by the decorative layers to drift against the pointer.
      hero.style.setProperty("--px", ((px - 0.5) * 2).toFixed(3));
      hero.style.setProperty("--py", ((py - 0.5) * 2).toFixed(3));
    }));
    hero.addEventListener("pointerenter", function () { hero.classList.add("is-pointing"); });
    hero.addEventListener("pointerleave", function () {
      hero.classList.remove("is-pointing");
      hero.style.setProperty("--px", 0);
      hero.style.setProperty("--py", 0);
    });
  }

  /* Cards tilt toward the pointer, with a highlight under it. */
  function initCardTilt() {
    var cards = document.querySelectorAll(".ei-card");
    if (!cards.length) return;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];

      // The highlight is injected rather than authored into every page, so the
      // markup stays clean and the effect only exists when scripts run.
      var glow = document.createElement("span");
      glow.className = "ei-card__glow";
      glow.setAttribute("aria-hidden", "true");
      card.insertBefore(glow, card.firstChild);

      if (!interactive()) continue;
      bindTilt(card, glow);
    }
  }

  function bindTilt(card, glow) {
    var MAX = 7;   // degrees

    card.addEventListener("pointerenter", function () { card.classList.add("is-tilting"); });

    card.addEventListener("pointermove", onFrame(function (event) {
      var r = card.getBoundingClientRect();
      var px = (event.clientX - r.left) / r.width;
      var py = (event.clientY - r.top) / r.height;
      card.style.transform =
        "perspective(1200px) rotateX(" + ((0.5 - py) * 2 * MAX).toFixed(2) + "deg)" +
        " rotateY(" + ((px - 0.5) * 2 * MAX).toFixed(2) + "deg) translateY(-4px)";
      glow.style.setProperty("--gx", (px * 100) + "%");
      glow.style.setProperty("--gy", (py * 100) + "%");
    }));

    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  }

  /* Buttons lean toward the pointer. */
  function initMagneticButtons() {
    if (!interactive()) return;
    var btns = document.querySelectorAll(".ei-btn");
    var PULL = 7;   // pixels

    for (var i = 0; i < btns.length; i++) bindMagnet(btns[i], PULL);
  }

  function bindMagnet(btn, pull) {
    btn.addEventListener("pointerenter", function () { btn.classList.add("is-magnetic"); });

    btn.addEventListener("pointermove", onFrame(function (event) {
      var r = btn.getBoundingClientRect();
      var dx = (event.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (event.clientY - (r.top + r.height / 2)) / (r.height / 2);
      btn.style.transform = "translate(" + (dx * pull).toFixed(2) + "px," +
                                           (dy * pull).toFixed(2) + "px)";
    }));

    btn.addEventListener("pointerleave", function () {
      btn.classList.remove("is-magnetic");
      btn.style.transform = "";
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */

  function init() {
    initNav();
    initForm();
    initSplitHeadings();
    initReveals();
    initHeaderScroll();
    initCounters();
    initHeroSpotlight();
    initCardTilt();
    initMagneticButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
