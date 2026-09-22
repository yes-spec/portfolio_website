/* ==========================================================================
   Safiri Horizons — Tours & Hospitality
   Site behaviour: destination data, rendering, filtering, booking modal,
   forms, nav + scroll interactions.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * 1. Destination / tour data
   *    Single source of truth used by the homepage (featured picks) and
   *    the full Tours & Destinations page (filterable catalogue).
   * ------------------------------------------------------------------- */
  const TOURS = [
    {
      id: "maasai-mara",
      name: "Maasai Mara Safari Explorer",
      country: "Kenya",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/maasai-mara.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–12 guests",
      price: 1850,
      tagline: "Witness the Great Migration on the plains that made the safari famous.",
      description: "Track the Big Five across the endless grasslands of the Mara, share sundowners with the Maasai community, and wake up to lion calls beyond your tent canvas.",
      highlights: ["Big Five game drives with expert guides", "Maasai village cultural visit", "Hot air balloon safari (optional)", "Luxury tented camp stays", "Great Migration river crossings (seasonal)", "All park fees & transfers included"],
      featured: true
    },
    {
      id: "serengeti-ngorongoro",
      name: "Serengeti & Ngorongoro Crater",
      country: "Tanzania",
      category: "Safari",
      gradient: "g-sunset",
      image: "images/destinations/serengeti-ngorongoro.svg",
      duration: "8 Days / 7 Nights",
      groupSize: "2–10 guests",
      price: 2450,
      tagline: "Endless plains, a wildlife-packed caldera, and skies full of stars.",
      description: "Descend into the Ngorongoro Crater's natural amphitheatre and roam the Serengeti's limitless horizon on one of Africa's most celebrated safari circuits.",
      highlights: ["Ngorongoro Crater floor game drive", "Serengeti central & northern circuits", "Olduvai Gorge historical stop", "Private safari vehicle with pop-up roof", "Award-winning eco lodges", "Professional English/French-speaking guide"],
      featured: true
    },
    {
      id: "victoria-falls",
      name: "Victoria Falls Adventure",
      country: "Zambia & Zimbabwe",
      category: "Waterfalls & Adventure",
      gradient: "g-ocean",
      image: "images/destinations/victoria-falls.svg",
      duration: "5 Days / 4 Nights",
      groupSize: "2–14 guests",
      price: 1600,
      tagline: "Stand where the Zambezi thunders into the earth — 'The Smoke That Thunders'.",
      description: "Feel the spray of one of the Seven Natural Wonders of the World, then choose your thrill: white-water rafting, bungee, microlight flights, or a sunset river cruise.",
      highlights: ["Guided Victoria Falls rainforest walk", "White-water rafting on the Zambezi (optional)", "Sunset booze cruise with live music", "Devil's Pool experience (seasonal)", "4-star riverside accommodation", "Cross-border Zambia/Zimbabwe transfers"]
    },
    {
      id: "sahara-morocco",
      name: "Sahara Desert Expedition",
      country: "Morocco",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/sahara-morocco.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–16 guests",
      price: 1750,
      tagline: "Camel treks, star-lit camps, and the golden dunes of Erg Chebbi.",
      description: "Wind through the Atlas Mountains and Kasbah-lined valleys before bedding down under the stars in a private Berber-style desert camp.",
      highlights: ["Camel trek into Erg Chebbi dunes", "Overnight luxury desert camp", "Atlas Mountains & Todra Gorge", "Traditional Berber villages", "Marrakech medina walking tour", "All breakfasts & desert dinners"]
    },
    {
      id: "zanzibar",
      name: "Zanzibar Beach Escape",
      country: "Tanzania",
      category: "Beach & Islands",
      gradient: "g-ocean",
      image: "images/destinations/zanzibar.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–10 guests",
      price: 1450,
      tagline: "Powder-white sand, spice-scented lanes, and turquoise Indian Ocean water.",
      description: "Unwind on Zanzibar's postcard beaches, snorkel vibrant reefs, and wander the UNESCO-listed alleys of Stone Town between spa treatments.",
      highlights: ["Beachfront boutique resort", "Stone Town UNESCO walking tour", "Spice farm tour & tasting", "Safari Blue snorkelling cruise", "Sunset dhow cruise", "Airport transfers included"],
      featured: true
    },
    {
      id: "cape-town",
      name: "Cape Town & Cape Winelands",
      country: "South Africa",
      category: "Culture & City",
      gradient: "g-forest",
      image: "images/destinations/cape-town.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–12 guests",
      price: 1950,
      tagline: "Table Mountain views, penguin colonies, and world-class vineyards.",
      description: "Ride the cableway up Table Mountain, meet the penguins of Boulders Beach, and sip award-winning wines across Stellenbosch and Franschhoek.",
      highlights: ["Table Mountain cableway", "Cape Peninsula & Boulders Beach tour", "Stellenbosch & Franschhoek wine tasting", "Robben Island ferry (optional)", "Boutique hotel in the City Bowl", "Private driver-guide throughout"],
      featured: true
    },
    {
      id: "okavango-delta",
      name: "Okavango Delta Safari",
      country: "Botswana",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/okavango-delta.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–8 guests",
      price: 2850,
      tagline: "Glide by mokoro canoe through Africa's lush inland river delta.",
      description: "Swap dusty roads for silent waterways in the Okavango's UNESCO World Heritage wetlands, home to elephant herds, hippos, and rare wild dogs.",
      highlights: ["Traditional mokoro canoe excursions", "Island bush walks with trackers", "Premium tented safari camps", "Light-aircraft transfers between camps", "Small group, low-impact travel", "Full-board gourmet dining"]
    },
    {
      id: "egypt-pyramids",
      name: "Pyramids & Nile Discovery",
      country: "Egypt",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/egypt-pyramids.svg",
      duration: "8 Days / 7 Nights",
      groupSize: "2–16 guests",
      price: 2100,
      tagline: "From the Giza plateau to a timeless cruise down the Nile.",
      description: "Trace 5,000 years of history from the Great Pyramids and Sphinx to the temples of Luxor and Aswan, aboard a classic Nile river cruise.",
      highlights: ["Giza Pyramids & Sphinx tour", "4-night Nile cruise (Luxor–Aswan)", "Valley of the Kings & Karnak Temple", "Egyptian Museum in Cairo", "Felucca sunset sail", "Domestic flights included"]
    },
    {
      id: "kruger",
      name: "Kruger National Park Big Five",
      country: "South Africa",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/kruger.svg",
      duration: "5 Days / 4 Nights",
      groupSize: "2–12 guests",
      price: 1700,
      tagline: "One of Africa's greatest game reserves, built for first-time safari-goers.",
      description: "Twice-daily game drives across Kruger's private concessions offer some of the continent's most reliable Big Five sightings, paired with relaxed bush lodges.",
      highlights: ["Sunrise & sunset open-vehicle game drives", "Big Five private concession access", "Guided bush walks", "Malaria-risk guidance & support", "All-inclusive lodge dining", "Ranger-led night drives"]
    },
    {
      id: "rwanda-gorillas",
      name: "Rwanda Gorilla Trekking",
      country: "Rwanda",
      category: "Mountains & Trekking",
      gradient: "g-forest",
      image: "images/destinations/rwanda-gorillas.svg",
      duration: "4 Days / 3 Nights",
      groupSize: "2–6 guests",
      price: 3200,
      tagline: "A once-in-a-lifetime hour face-to-face with mountain gorillas.",
      description: "Trek the misty slopes of Volcanoes National Park with expert trackers for a rare, closely regulated encounter with endangered mountain gorilla families.",
      highlights: ["Gorilla trekking permit included", "Small-group guided trek", "Golden monkey tracking (optional)", "Kigali city & genocide memorial tour", "Boutique volcano-view lodge", "Porter support for the trek"]
    },
    {
      id: "seychelles",
      name: "Seychelles Island Retreat",
      country: "Seychelles",
      category: "Beach & Islands",
      gradient: "g-ocean",
      image: "images/destinations/seychelles.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–8 guests",
      price: 2650,
      tagline: "Granite boulders, castaway beaches, and barefoot island luxury.",
      description: "Island-hop between Mahé, Praslin, and La Digue by boat, snorkelling coral gardens and lounging on beaches routinely ranked among the world's best.",
      highlights: ["Multi-island itinerary by boat", "Vallée de Mai UNESCO nature reserve", "Anse Source d'Argent beach day", "Snorkelling & marine park excursions", "Overwater & beachfront villas", "Honeymoon upgrades available"]
    },
    {
      id: "marrakech",
      name: "Marrakech Imperial Cities",
      country: "Morocco",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/marrakech.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–16 guests",
      price: 1550,
      tagline: "Souks, palaces, and riad courtyards across Morocco's imperial cities.",
      description: "Explore the labyrinth souks of Marrakech, the blue lanes of Chefchaouen, and the royal palaces of Fez and Meknes on a culture-first journey.",
      highlights: ["Marrakech medina & souk tour", "Bahia Palace & Majorelle Garden", "Fez & Meknes imperial cities", "Traditional riad accommodation", "Hammam spa experience", "Private air-conditioned transport"]
    }
  ];

  /* ---------------------------------------------------------------------
   * 2. Helpers
   * ------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const fmtPrice = (n) => "$" + n.toLocaleString("en-US");

  function tourCardHTML(tour) {
    return `
      <article class="tour-card reveal" data-id="${tour.id}" data-category="${tour.category}" data-name="${tour.name.toLowerCase()} ${tour.country.toLowerCase()}">
        <div class="tour-media ${tour.gradient}">
          <img class="tour-media-img" src="${tour.image}" alt="${tour.name}, ${tour.country}" loading="lazy" width="400" height="300">
          <div class="tour-media-top">
            <span class="tag-pill">${tour.category}</span>
            <span class="price-pill">From ${fmtPrice(tour.price)}</span>
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
            <button type="button" class="btn btn-outline btn-sm js-view-tour" data-id="${tour.id}">View Details</button>
            <button type="button" class="btn btn-primary btn-sm js-book-tour" data-id="${tour.id}">Book Now</button>
          </div>
        </div>
      </article>`;
  }

  function renderInto(selector, list) {
    const el = $(selector);
    if (!el) return;
    el.innerHTML = list.map(tourCardHTML).join("");
    observeReveal();
  }

  /* ---------------------------------------------------------------------
   * 3. Featured tours on homepage
   * ------------------------------------------------------------------- */
  function initFeatured() {
    const el = $("#featured-tours");
    if (!el) return;
    const featured = TOURS.filter((t) => t.featured);
    renderInto("#featured-tours", featured);
  }

  /* ---------------------------------------------------------------------
   * 4. Full catalogue page: render, filter, search
   * ------------------------------------------------------------------- */
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

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
  }

  /* ---------------------------------------------------------------------
   * 5. Booking / detail modal
   * ------------------------------------------------------------------- */
  function findTour(id) {
    return TOURS.find((t) => t.id === id);
  }

  function initModal() {
    const overlay = $("#booking-modal");
    if (!overlay) return;
    const panel = $(".modal-panel", overlay);
    const destinationSelect = $("#booking-destination");
    const detailPane = $("#modal-detail");
    const formPane = $("#modal-form-pane");
    const successPane = $("#modal-success");
    const form = $("#booking-form");
    const modalTitle = $("#modal-title-text");

    // Populate destination dropdown once
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

    function openModal({ mode, tourId }) {
      document.body.style.overflow = "hidden";
      overlay.classList.add("open");
      formPane.style.display = "none";
      successPane.classList.remove("show");
      detailPane.style.display = "none";

      if (mode === "detail" && tourId) {
        const t = findTour(tourId);
        if (t) renderDetail(t);
        detailPane.style.display = "block";
        modalTitle.textContent = t ? t.name : "Tour Details";
      } else {
        formPane.style.display = "block";
        modalTitle.textContent = "Request This Journey";
        if (tourId && destinationSelect) destinationSelect.value = tourId;
      }
      panel.scrollTop = 0;
    }

    function renderDetail(t) {
      detailPane.innerHTML = `
        <div class="tour-media detail-media ${t.gradient}">
          <img src="${t.image}" alt="${t.name}, ${t.country}" width="400" height="300">
        </div>
        <div class="kicker">${t.country} · ${t.category}</div>
        <p style="font-size:1.02rem;color:var(--color-ink);margin-bottom:6px;">${t.description}</p>
        <div class="tour-meta" style="margin:16px 0;">
          <span>📅 ${t.duration}</span>
          <span>👥 ${t.groupSize}</span>
          <span>💰 From ${fmtPrice(t.price)} per person</span>
        </div>
        <h4 style="margin-bottom:6px;">Trip Highlights</h4>
        <ul class="detail-highlights">
          ${t.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
        <div class="tour-actions" style="margin-top:10px;">
          <button type="button" class="btn btn-primary js-book-from-detail" data-id="${t.id}">Book This Journey</button>
          <button type="button" class="btn btn-outline js-close-modal">Close</button>
        </div>
      `;
    }

    function closeModal() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    // Delegated open triggers across the whole document
    document.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".js-view-tour");
      const bookBtn = e.target.closest(".js-book-tour, .js-book-from-detail, .js-book-now-generic");
      const closeBtn = e.target.closest(".js-close-modal, .modal-close");

      if (viewBtn) {
        openModal({ mode: "detail", tourId: viewBtn.dataset.id });
      } else if (bookBtn) {
        openModal({ mode: "form", tourId: bookBtn.dataset.id });
      } else if (closeBtn || e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });

    /* ---- Booking form submission (client-side, no backend required) ----
       Generates a reference number, shows a confirmation panel, and
       opens the visitor's email client (mailto:) pre-filled with the
       full enquiry so it reaches the team even without a server.
       To wire this to a real backend later, swap the code inside the
       submit handler for a fetch() call to Formspree / EmailJS / your
       own API — the form fields and validation already do the work. */
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

        $("#success-ref").textContent = ref;
        $("#success-destination").textContent = tour ? `${tour.name}, ${tour.country}` : "your custom itinerary";
        $("#success-mailto").setAttribute("href", mailto);

        formPane.style.display = "none";
        successPane.classList.add("show");
        form.reset();

        // Attempt to open the visitor's email client automatically.
        window.location.href = mailto;
      });
    }
  }

  /* ---------------------------------------------------------------------
   * 6. Generic contact / newsletter forms (client-side confirmation)
   * ------------------------------------------------------------------- */
  function initSimpleForms() {
    $$("form[data-mailto]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        const to = form.dataset.mailto;
        const subject = form.dataset.subject || "Website enquiry";
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const successEl = $(form.dataset.successTarget);
        if (successEl) successEl.classList.add("show");
        form.reset();
        showToast("Thank you! Your message is on its way.");
      });
    });

    const newsletter = $("#newsletter-form");
    if (newsletter) {
      newsletter.addEventListener("submit", (e) => {
        e.preventDefault();
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
   * 7. Nav toggle, footer year, scroll reveal
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
    initNav();
    initFeatured();
    initCatalogue();
    initModal();
    initSimpleForms();
    initFooterYear();
    observeReveal();
  });
})();
