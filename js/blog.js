/* ==========================================================================
   Safiri Horizons — travel journal (blog.html listing + article.html detail)
   Requires js/data.js and js/main.js loaded first.
   ========================================================================== */

(function () {
  "use strict";

  const SITE_URL = "https://www.safirihorizons.com";
  const BLOG = (window.SH && window.SH.BLOG) || [];
  const TOURS = (window.SH && window.SH.TOURS) || [];
  const U = window.SHUtils || {};
  const $ = U.$ || ((sel, ctx) => (ctx || document).querySelector(sel));
  const $$ = U.$$ || ((sel, ctx) => Array.from((ctx || document).querySelectorAll(sel)));

  function articleCardHTML(post) {
    return `
      <article class="blog-card reveal">
        <a class="tour-media blog-card-media ${post.gradient}" href="article.html?slug=${post.slug}" aria-hidden="true"></a>
        <div class="blog-card-body">
          <span class="cat-pill">${post.category}</span>
          <h3><a href="article.html?slug=${post.slug}" style="color:inherit;">${post.title}</a></h3>
          <p>${post.excerpt}</p>
          <span class="read-time">${post.readTime}</span>
        </div>
      </article>`;
  }

  function initListing() {
    const grid = $("#blog-grid");
    if (!grid) return;
    grid.innerHTML = BLOG.map(articleCardHTML).join("");
    if (U.observeReveal) U.observeReveal();
  }

  function getSlug() {
    return new URLSearchParams(window.location.search).get("slug");
  }

  function setMeta(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function renderArticle(post) {
    document.title = `${post.title} — Safiri Horizons Journal`;
    setMeta("description", post.excerpt);
    setMeta("og:title", post.title);
    setMeta("og:description", post.excerpt);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `${SITE_URL}/article.html?slug=${post.slug}`);

    $("#article-hero").className = `article-hero tour-media ${post.gradient}`;
    $("#article-category").textContent = post.category;
    $("#article-title").textContent = post.title;
    $("#article-readtime").textContent = post.readTime;
    $("#article-body").innerHTML = post.body.map((p) => `<p>${p}</p>`).join("");

    const relatedTour = post.relatedTour && TOURS.find((t) => t.id === post.relatedTour);
    const relatedBox = $("#article-related-tour");
    if (relatedTour && relatedBox) {
      relatedBox.style.display = "block";
      relatedBox.innerHTML = `
        <div class="cta-banner reveal">
          <div>
            <h2>Inspired to go?</h2>
            <p>This article pairs naturally with our <strong>${relatedTour.name}</strong> journey in ${relatedTour.country}.</p>
          </div>
          <a class="btn btn-accent" href="destination.html?slug=${relatedTour.id}">View That Journey</a>
        </div>`;
    } else if (relatedBox) {
      relatedBox.style.display = "none";
    }

    const ldJson = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "articleSection": post.category
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ldJson);
    document.head.appendChild(script);

    $("#article-content").style.display = "block";
    if (U.observeReveal) U.observeReveal();
  }

  function initArticle() {
    const contentEl = $("#article-content");
    if (!contentEl) return;
    const slug = getSlug();
    const post = slug && BLOG.find((p) => p.slug === slug);
    if (post) {
      renderArticle(post);
    } else {
      $("#article-not-found").style.display = "block";
      contentEl.style.display = "none";
      document.title = "Article Not Found — Safiri Horizons";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initListing();
    initArticle();
  });
})();
