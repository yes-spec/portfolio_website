/* ==========================================================================
   Safiri Horizons — login.html and account.html behaviour.
   Requires js/auth.js (window.SHAuth) and js/main.js (window.SHUtils) first.
   ========================================================================== */

(function () {
  "use strict";

  const U = window.SHUtils || {};
  const $ = U.$ || ((sel, ctx) => (ctx || document).querySelector(sel));
  const $$ = U.$$ || ((sel, ctx) => Array.from((ctx || document).querySelectorAll(sel)));

  function initLoginPage() {
    const tabs = $$(".auth-tab");
    const panels = $$(".auth-panel");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        $(`#${tab.dataset.panel}`).classList.add("active");
      });
    });

    // Deep-link support: login.html?tab=create
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "create") {
      const createTab = $('.auth-tab[data-panel="panel-create"]');
      if (createTab) createTab.click();
    }

    const signInForm = $("#signin-form");
    const signInError = $("#signin-error");
    if (signInForm) {
      signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        signInError.classList.remove("show");
        if (!signInForm.checkValidity()) {
          signInForm.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(signInForm).entries());
        const result = await window.SHAuth.signIn(data);
        if (result.ok) {
          window.location.href = "account.html";
        } else {
          signInError.textContent = result.error;
          signInError.classList.add("show");
        }
      });
    }

    const createForm = $("#create-form");
    const createError = $("#create-error");
    if (createForm) {
      createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        createError.classList.remove("show");
        if (!createForm.checkValidity()) {
          createForm.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(createForm).entries());
        if (data.password !== data.confirmPassword) {
          createError.textContent = "Passwords don't match.";
          createError.classList.add("show");
          return;
        }
        const result = await window.SHAuth.createAccount(data);
        if (result.ok) {
          window.location.href = "account.html";
        } else {
          createError.textContent = result.error;
          createError.classList.add("show");
        }
      });
    }
  }

  function initAccountPage() {
    const dashboard = $("#account-dashboard");
    if (!dashboard) return;

    const session = window.SHAuth.getSession();
    if (!session) {
      window.location.href = "login.html";
      return;
    }

    $("#account-name").textContent = session.name;
    $("#account-email").textContent = session.email;
    $("#account-initial").textContent = session.name.charAt(0).toUpperCase();

    const bookings = window.SHAuth.getBookings(session.email);
    const list = $("#booking-list");
    const empty = $("#booking-empty");
    if (bookings.length) {
      list.innerHTML = bookings.map((b) => `
        <div class="booking-row">
          <div>
            <span class="booking-ref">${b.ref}</span>
            <strong>${b.destination}</strong>
            <div class="booking-meta">${b.travelers || "?"} traveller(s) · ${b.month || "Flexible dates"} · Requested ${new Date(b.submittedAt).toLocaleDateString()}</div>
          </div>
          <span class="tag-pill">Request Sent</span>
        </div>`).join("");
      empty.style.display = "none";
    } else {
      list.innerHTML = "";
      empty.style.display = "block";
    }

    const signOutBtn = $("#sign-out-btn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        window.SHAuth.signOut();
        window.location.href = "index.html";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoginPage();
    initAccountPage();
  });
})();
