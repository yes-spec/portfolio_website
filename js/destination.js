/* ==========================================================================
   Safiri Horizons — destination detail page (destination.html?slug=<id>)
   Reads the slug from the URL, renders the full itinerary from js/data.js,
   and sets per-page SEO metadata. Requires js/data.js and js/main.js first.
   ========================================================================== */

(function () {
  "use strict";

  const SITE_URL = "https://www.safirihorizons.co.ke";
  const TOURS = (window.SH && window.SH.TOURS) || [];
  const U = window.SHUtils || {};
  const $ = U.$ || ((sel, ctx) => (ctx || document).querySelector(sel));
  const $$ = U.$$ || ((sel, ctx) => Array.from((ctx || document).querySelectorAll(sel)));

  function getSlug() {
    return new URLSearchParams(window.location.search).get("slug");
  }

  function setMeta(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function showNotFound() {
    const notFound = $("#dest-not-found");
    const content = $("#dest-content");
    if (notFound) notFound.style.display = "block";
    if (content) content.style.display = "none";
    document.title = "Destination Not Found — Safiri Horizons";
  }

  function renderTour(t) {
    document.title = `${t.name}, ${t.country} — Safiri Horizons`;
    setMeta("description", t.tagline);
    setMeta("og:title", `${t.name}, ${t.country}`);
    setMeta("og:description", t.tagline);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `${SITE_URL}/destination.html?slug=${t.id}`);

    $("#dest-hero-img").setAttribute("src", t.image);
    $("#dest-hero-img").setAttribute("alt", `${t.name}, ${t.country}`);
    $("#dest-hero").classList.add(t.gradient);
    $("#dest-country-cat").textContent = `${t.country} · ${t.category}`;
    $("#dest-title").textContent = t.name;
    $("#dest-tagline").textContent = t.tagline;
    $("#dest-meta-duration").textContent = t.duration;
    $("#dest-meta-group").textContent = t.groupSize;
    $("#dest-meta-best").textContent = t.bestTime;
    $("#dest-description").textContent = t.description;

    $("#dest-price").innerHTML = `From <span data-price-usd="${t.price}">$${t.price.toLocaleString("en-US")}</span>`;
    $("#dest-price-note").textContent = "per person, land only — see inclusions below";
    $("#dest-sidebar-duration").textContent = t.duration;
    $("#dest-sidebar-group").textContent = t.groupSize;
    $("#dest-sidebar-best").textContent = t.bestTime;
    $("#dest-sidebar-country").textContent = t.country;

    const bookBtn = $("#dest-book-btn");
    bookBtn.dataset.id = t.id;
    const waBtn = $("#dest-whatsapp-btn");
    if (waBtn) {
      waBtn.href = `https://wa.me/254700123456?text=${encodeURIComponent(`Hi! I'd like more info on the ${t.name} (${t.country}) tour.`)}`;
    }

    $("#dest-highlights").innerHTML = t.highlights.map((h) => `<li>${h}</li>`).join("");

    $("#dest-itinerary").innerHTML = t.itinerary.map((day) => `
      <div class="timeline-item">
        <div class="day-label">${day.day}</div>
        <h4>${day.title}</h4>
        <p>${day.desc}</p>
      </div>`).join("");

    $("#dest-includes").innerHTML = t.includes.map((i) => `<li>${i}</li>`).join("");
    $("#dest-excludes").innerHTML = t.excludes.map((i) => `<li>${i}</li>`).join("");

    const related = TOURS.filter((o) => o.id !== t.id && o.category === t.category).slice(0, 3);
    const fallback = related.length ? related : TOURS.filter((o) => o.id !== t.id).slice(0, 3);
    if (U.tourCardHTML) {
      $("#related-grid").innerHTML = fallback.map(U.tourCardHTML).join("");
    }

    const ldJson = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": t.name,
      "description": t.description,
      "touristType": t.category,
      "offers": {
        "@type": "Offer",
        "price": t.price,
        "priceCurrency": "USD"
      }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ldJson);
    document.head.appendChild(script);

    if (U.applyCurrency) U.applyCurrency();
    if (U.observeReveal) U.observeReveal();
    $("#dest-content").style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const slug = getSlug();
    const tour = slug && TOURS.find((t) => t.id === slug);
    if (tour) {
      renderTour(tour);
    } else {
      showNotFound();
    }
  });
})();
