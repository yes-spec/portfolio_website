/* ==========================================================================
   Safiri Horizons — interactive Africa map (tours.html)
   The SVG itself is real country geometry, baked directly into the page
   markup at build time (see the repo's map-build notes), so the map is
   visible and crawlable with JavaScript off. This module only adds the
   progressive-enhancement layer on top: hover/focus tooltips naming each
   country's top places to visit, and click-through to the tour list for
   countries with a bookable Safiri Horizons journey.
   ========================================================================== */

(function () {
  "use strict";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function initAfricaMap() {
    const svg = $("#africa-map");
    const wrap = $(".africa-map-wrap");
    if (!svg || !wrap || !window.SH || !window.SH.COUNTRY_INFO) return;

    const COUNTRY_INFO = window.SH.COUNTRY_INFO;
    const countries = $$(".country", svg);

    const tooltip = document.createElement("div");
    tooltip.className = "map-tooltip country-tooltip";
    wrap.appendChild(tooltip);

    let activePath = null;

    function tooltipHTML(info, hasTours) {
      const areas = info.topAreas.slice(0, 3).map((a) => `<li>${a}</li>`).join("");
      const cta = hasTours ? `<span class="tooltip-cta">View journeys →</span>` : "";
      return `<strong>${info.display}</strong><ul>${areas}</ul>${cta}`;
    }

    function positionAt(x, y) {
      const wrapRect = wrap.getBoundingClientRect();
      tooltip.style.left = (x - wrapRect.left) + "px";
      tooltip.style.top = (y - wrapRect.top) + "px";
    }

    function showTooltip(path, x, y) {
      const name = path.dataset.country;
      const info = COUNTRY_INFO[name];
      if (!info) return;
      tooltip.innerHTML = tooltipHTML(info, path.classList.contains("has-tours"));
      positionAt(x, y);
      tooltip.classList.add("show");
      activePath = path;
      path.classList.add("is-active");
    }

    function hideTooltip() {
      if (activePath) activePath.classList.remove("is-active");
      activePath = null;
      tooltip.classList.remove("show");
    }

    function goToCountryTours(path) {
      const name = path.dataset.country;
      const info = COUNTRY_INFO[name];
      if (!info || !info.hasTours) return;

      const searchInput = $("#tour-search");
      const allFilterBtn = $('.filter-btn[data-category="All"]');
      if (allFilterBtn && !allFilterBtn.classList.contains("active")) allFilterBtn.click();
      if (searchInput) {
        searchInput.value = info.searchTerm;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const grid = $("#tour-grid");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    countries.forEach((path) => {
      path.addEventListener("mouseenter", (e) => showTooltip(path, e.clientX, e.clientY));
      path.addEventListener("mousemove", (e) => {
        if (activePath === path) positionAt(e.clientX, e.clientY);
      });
      path.addEventListener("mouseleave", hideTooltip);

      path.addEventListener("focus", () => {
        const rect = path.getBoundingClientRect();
        showTooltip(path, rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
      path.addEventListener("blur", hideTooltip);

      if (path.classList.contains("has-tours")) {
        path.style.cursor = "pointer";
        path.addEventListener("click", () => goToCountryTours(path));
        path.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToCountryTours(path);
          }
        });
      }
    });

    /* Simple, dependency-free zoom: scale the SVG itself via CSS transform.
       The map is real vector geometry, so it stays crisp at any zoom level. */
    let zoom = 1;
    const ZOOM_STEP = 0.5;
    const ZOOM_MIN = 1;
    const ZOOM_MAX = 3;

    function applyZoom() {
      svg.style.transform = `scale(${zoom})`;
    }

    $$(".map-zoom-btn", wrap).forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.zoom;
        if (action === "in") zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP);
        else if (action === "out") zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP);
        else zoom = 1;
        applyZoom();
        hideTooltip();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initAfricaMap);
})();
