/* ==========================================================================
   Safiri Horizons — Tours & Hospitality
   Site-wide behaviour: rendering the tour catalogue, filters, the booking
   modal, forms, currency + theme switching, and nav/scroll interactions.
   Tour and article data lives in js/data.js (window.SH), loaded first.
   ========================================================================== */

(function () {
  "use strict";

  const TOURS = (window.SH && window.SH.TOURS) || [];

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function findTour(id) {
    return TOURS.find((t) => t.id === id);
  }

  /* ---------------------------------------------------------------------
   * Currency switcher — static, illustrative conversion rates from USD.
   * Every price in the DOM is rendered as base USD inside a
   * [data-price-usd="1850"] element; switching currency just re-formats
   * every such element in place, no re-render needed.
   * ------------------------------------------------------------------- */
  const CURRENCY = {
    rates: { USD: 1, EUR: 0.92, GBP: 0.79, KES: 129 },
    symbols: { USD: "$", EUR: "€", GBP: "£", KES: "KSh " },
    locales: { USD: "en-US", EUR: "de-DE", GBP: "en-GB", KES: "en-KE" }
  };

  function getCurrency() {
    try {
      return localStorage.getItem("sh-currency") || "USD";
    } catch (e) {
      return "USD";
    }
  }

  function setCurrency(code) {
    try {
      localStorage.setItem("sh-currency", code);
    } catch (e) { /* private mode / storage blocked — currency just won't persist */ }
  }

  function formatMoney(usd, code) {
    const rate = CURRENCY.rates[code] || 1;
    const symbol = CURRENCY.symbols[code] || "$";
    const converted = Math.round(usd * rate);
    return symbol + converted.toLocaleString(CURRENCY.locales[code] || "en-US");
  }

  function applyCurrency() {
    const code = getCurrency();
    $$("[data-price-usd]").forEach((el) => {
      const usd = Number(el.getAttribute("data-price-usd"));
      if (!Number.isFinite(usd)) return;
      el.textContent = formatMoney(usd, code);
    });
    $$(".currency-select").forEach((sel) => { sel.value = code; });
  }

  function initCurrency() {
    applyCurrency();
    $$(".currency-select").forEach((sel) => {
      sel.addEventListener("change", () => {
        setCurrency(sel.value);
        applyCurrency();
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Dark mode toggle — explicit choice persists; otherwise CSS follows
   * prefers-color-scheme on its own (see style.css).
   * ------------------------------------------------------------------- */
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("sh-theme"); } catch (e) { /* ignore */ }
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }

    $$(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme")
          || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("sh-theme", next); } catch (e) { /* ignore */ }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Tour card rendering — used on the homepage (featured picks) and the
   * full Tours & Destinations catalogue.
   * ------------------------------------------------------------------- */
  function tourCardHTML(tour) {
    return `
      <article class="tour-card reveal" data-id="${tour.id}" data-category="${tour.category}" data-name="${tour.name.toLowerCase()} ${tour.country.toLowerCase()}">
        <div class="tour-media ${tour.gradient}">
          <img class="tour-media-img" src="${tour.image}" alt="${tour.name}, ${tour.country}" loading="lazy" width="400" height="300">
          <div class="tour-media-top">
            <span class="tag-pill">${tour.category}</span>
            <span class="price-pill">From <span data-price-usd="${tour.price}">$${tour.price.toLocaleString("en-US")}</span></span>
          </div>
        </div>
        <div class="tour-body">
          <div class="tour-country">${tour.country}</div>
          <h3>${tour.name}</h3>
          <p>${tour.tagline}</p>
          <div class="tour-meta">
            <span>📅 ${tour.duration}</span>
            <span>👥 ${tour.groupSize}</span>
          </div>
          <div class="tour-actions">
            <a class="btn btn-outline btn-sm" href="destination.html?slug=${tour.id}">View Details</a>
            <button type="button" class="btn btn-primary btn-sm js-book-tour" data-id="${tour.id}">Book Now</button>
          </div>
        </div>
      </article>`;
  }

  function renderInto(selector, list) {
    const el = $(selector);
    if (!el) return;
    el.innerHTML = list.map(tourCardHTML).join("");
    applyCurrency();
    observeReveal();
  }

  function initFeatured() {
    const el = $("#featured-tours");
    if (!el) return;
    renderInto("#featured-tours", TOURS.filter((t) => t.featured));
  }

  function initCatalogue() {
    const grid = $("#tour-grid");
    if (!grid) return;

    renderInto("#tour-grid", TOURS);

    const filterBar = $("#filter-bar");
    const searchInput = $("#tour-search");
    const emptyState = $("#empty-state");
    let activeCategory = "All";

    function applyFilters() {
      const term = (searchInput && searchInput.value || "").trim().toLowerCase();
      let visibleCount = 0;
      $$(".tour-card", grid).forEach((card) => {
        const matchesCategory = activeCategory === "All" || card.dataset.category === activeCategory;
        const matchesSearch = !term || card.dataset.name.includes(term);
        const visible = matchesCategory && matchesSearch;
        card.style.display = visible ? "" : "none";
        if (visible) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle("show", visibleCount === 0);
    }

    if (filterBar) {
      filterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        $$(".filter-btn", filterBar).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        applyFilters();
      });
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);

    // Deep-link support: tours.html?category=Safari from the homepage or map
    const params = new URLSearchParams(window.location.search);
    const presetCategory = params.get("category");
    if (presetCategory && filterBar) {
      const match = $(`.filter-btn[data-category="${CSS.escape(presetCategory)}"]`, filterBar);
      if (match) match.click();
    }
  }

  /* ---------------------------------------------------------------------
   * Booking modal — a focused, accessible dialog for the enquiry form.
   * Destination detail now lives on its own page (destination.html);
   * this modal's only job is capturing a booking request.
   * ------------------------------------------------------------------- */
  function initModal() {
    const overlay = $("#booking-modal");
    if (!overlay) return;
    const panel = $(".modal-panel", overlay);
    const destinationSelect = $("#booking-destination");
    const successPane = $("#modal-success");
    const formPane = $("#modal-form-pane");
    const form = $("#booking-form");
    const closeBtn = $(".modal-close", overlay);
    let lastFocused = null;

    if (destinationSelect && destinationSelect.options.length <= 1) {
      TOURS.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = `${t.name} — ${t.country}`;
        destinationSelect.appendChild(opt);
      });
      const general = document.createElement("option");
      general.value = "custom";
      general.textContent = "Custom / Not sure yet — help me choose";
      destinationSelect.appendChild(general);
    }

    function focusableEls() {
      return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', panel)
        .filter((el) => el.offsetParent !== null);
    }

    function openModal(tourId) {
      lastFocused = document.activeElement;
      document.body.style.overflow = "hidden";
      overlay.classList.add("open");
      formPane.style.display = "block";
      successPane.classList.remove("show");
      if (tourId && destinationSelect) destinationSelect.value = tourId;
      panel.scrollTop = 0;
      const first = focusableEls()[0];
      if (first) first.focus();
    }

    function closeModal() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    document.addEventListener("click", (e) => {
      const bookBtn = e.target.closest(".js-book-tour, .js-book-now-generic");
      const closeTrigger = e.target.closest(".js-close-modal, .modal-close");
      if (bookBtn) {
        e.preventDefault();
        openModal(bookBtn.dataset.id);
      } else if (closeTrigger || e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const items = focusableEls();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* Booking form submission. Primary channel is a Netlify Forms POST
       (the form carries data-netlify="true" in the HTML so Netlify's
       build bot registers it) — this reaches a real inbox without the
       visitor needing a configured email client. The mailto: link stays
       available on the confirmation panel as a manual fallback, and off
       Netlify (e.g. opened via file://) the fetch simply fails silently
       and the visitor can still use that fallback link. */
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        const tour = data.destination && data.destination !== "custom" ? findTour(data.destination) : null;
        const ref = "SH-" + Math.random().toString(36).slice(2, 7).toUpperCase();

        const subject = `Tour Booking Request: ${tour ? tour.name : "Custom Itinerary"} (${ref})`;
        const bodyLines = [
          `Reference: ${ref}`,
          `Name: ${data.name || ""}`,
          `Email: ${data.email || ""}`,
          `Phone: ${data.phone || ""}`,
          `Country of residence: ${data.country || ""}`,
          `Destination: ${tour ? tour.name + " — " + tour.country : "Custom / Undecided"}`,
          `Travellers: ${data.travelers || ""}`,
          `Preferred month: ${data.month || ""}`,
          `Budget range: ${data.budget || ""}`,
          `Notes: ${data.message || ""}`
        ];
        const mailto = `mailto:bookings@safirihorizons.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

        const submission = new URLSearchParams();
        submission.append("form-name", "booking");
        submission.append("reference", ref);
        Object.entries(data).forEach(([key, value]) => submission.append(key, value));
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: submission.toString()
        }).catch(() => { /* offline / not on Netlify — mailto fallback below still works */ });

        if (window.SHAuth) {
          const session = window.SHAuth.getSession();
          if (session) {
            window.SHAuth.addBooking(session.email, {
              ref,
              destination: tour ? `${tour.name}, ${tour.country}` : "Custom / Undecided",
              travelers: data.travelers || "",
              month: data.month || "",
              submittedAt: new Date().toISOString()
            });
          }
        }

        $("#success-ref").textContent = ref;
        $("#success-destination").textContent = tour ? `${tour.name}, ${tour.country}` : "your custom itinerary";
        $("#success-mailto").setAttribute("href", mailto);

        formPane.style.display = "none";
        successPane.classList.add("show");
        form.reset();
      });
    }
  }

  /* ---------------------------------------------------------------------
   * Generic contact / newsletter forms (client-side confirmation)
   * ------------------------------------------------------------------- */
  function postToNetlify(formName, data) {
    const body = new URLSearchParams();
    body.append("form-name", formName);
    Object.entries(data).forEach(([key, value]) => body.append(key, value));
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
  }

  function initSimpleForms() {
    $$("form[data-mailto]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        postToNetlify(form.getAttribute("name") || "contact", data)
          .catch(() => { /* offline / not on Netlify — mailto fallback below still works */ });

        const to = form.dataset.mailto;
        const subject = form.dataset.subject || "Website enquiry";
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        const successEl = $(form.dataset.successTarget);
        if (successEl) {
          successEl.classList.add("show");
          const mailtoBtn = $("a[href^='mailto:']", successEl);
          if (mailtoBtn) mailtoBtn.setAttribute("href", `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }
        form.reset();
        showToast("Thank you! Your message is on its way.");
      });
    });

    const newsletter = $("#newsletter-form");
    if (newsletter) {
      newsletter.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = $("#newsletter-email", newsletter);
        postToNetlify("newsletter", { email: email ? email.value : "" })
          .catch(() => { /* offline / not on Netlify — subscription just won't be recorded */ });
        showToast("You're subscribed! Watch your inbox for new journeys.");
        newsletter.reset();
      });
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---------------------------------------------------------------------
   * Interactive Africa map — renders pins from TOURS onto the inline SVG
   * already present in the page (id="africa-map"), each linking to its
   * destination page, with a hover/focus tooltip naming the journey.
   * ------------------------------------------------------------------- */
  function initMap() {
    const svg = $("#africa-map");
    const wrap = $(".africa-map-wrap");
    if (!svg || !wrap) return;

    const tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";
    wrap.appendChild(tooltip);

    const ns = "http://www.w3.org/2000/svg";
    TOURS.forEach((tour) => {
      if (!tour.mapPin) return;
      const link = document.createElementNS(ns, "a");
      link.setAttribute("href", `destination.html?slug=${tour.id}`);
      link.setAttribute("class", "map-pin");
      link.setAttribute("tabindex", "0");
      link.setAttribute("aria-label", `${tour.name}, ${tour.country}`);

      const pulse = document.createElementNS(ns, "circle");
      pulse.setAttribute("class", "pulse");
      pulse.setAttribute("cx", tour.mapPin.x);
      pulse.setAttribute("cy", tour.mapPin.y);
      pulse.setAttribute("r", "6");

      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("class", "dot");
      dot.setAttribute("cx", tour.mapPin.x);
      dot.setAttribute("cy", tour.mapPin.y);
      dot.setAttribute("r", "6");

      link.appendChild(pulse);
      link.appendChild(dot);
      svg.appendChild(link);

      const showTip = () => {
        const svgRect = svg.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const scaleX = svgRect.width / svg.viewBox.baseVal.width;
        const scaleY = svgRect.height / svg.viewBox.baseVal.height;
        const left = (svgRect.left - wrapRect.left) + tour.mapPin.x * scaleX;
        const top = (svgRect.top - wrapRect.top) + tour.mapPin.y * scaleY;
        tooltip.textContent = `${tour.name} — ${tour.country}`;
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
        tooltip.classList.add("show");
      };
      const hideTip = () => tooltip.classList.remove("show");

      link.addEventListener("mouseenter", showTip);
      link.addEventListener("mouseleave", hideTip);
      link.addEventListener("focus", showTip);
      link.addEventListener("blur", hideTip);
    });
  }

  /* ---------------------------------------------------------------------
   * Nav toggle, footer year, scroll reveal
   * ------------------------------------------------------------------- */
  function initNav() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    if (!header || !toggle) return;
    toggle.addEventListener("click", () => header.classList.toggle("nav-open"));
    $$(".main-nav a").forEach((a) => a.addEventListener("click", () => header.classList.remove("nav-open")));
  }

  function initFooterYear() {
    const el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
   * Account nav link — reflects signed-in state (see js/auth.js)
   * ------------------------------------------------------------------- */
  function initAccountNav() {
    if (!window.SHAuth) return;
    const session = window.SHAuth.getSession();
    $$(".account-nav-link").forEach((link) => {
      if (session) {
        link.textContent = `Hi, ${session.name.split(" ")[0]}`;
        link.setAttribute("href", "account.html");
      } else {
        link.textContent = "Sign In";
        link.setAttribute("href", "login.html");
      }
    });
  }

  let revealObserver;
  function observeReveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }
    $$(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initFeatured();
    initCatalogue();
    initModal();
    initSimpleForms();
    initFooterYear();
    initAccountNav();
    initCurrency();
    initMap();
    observeReveal();
  });

  // Register the service worker for offline support / installability.
  // Skipped automatically on file:// or unsupported browsers.
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* offline support is optional */ });
    });
  }

  // Expose a couple of helpers other page scripts (destination.js, blog.js) reuse.
  window.SHUtils = { $, $$, findTour, formatMoney, getCurrency, applyCurrency, showToast, tourCardHTML, observeReveal };
})();
