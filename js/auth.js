/* ==========================================================================
   Safiri Horizons — client-side demo authentication
   This is a STATIC SITE with no server, so there is no real backend to
   authenticate against. This module provides a fully-functional demo:
   accounts and sessions live only in this browser's localStorage, and
   passwords are never stored in plain text (salted SHA-256 via the
   Web Crypto API). This is still NOT a substitute for real authentication
   — before launch, replace this with a real provider (Auth0, Firebase Auth,
   Supabase Auth, or your own backend). See README for details.
   ========================================================================== */

(function () {
  "use strict";

  const USERS_KEY = "sh-users";
  const SESSION_KEY = "sh-session";
  const BOOKINGS_KEY = "sh-bookings";

  function bufToHex(buf) {
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function randomSaltHex() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return bufToHex(arr);
  }

  async function hashPassword(password, saltHex) {
    const data = new TextEncoder().encode(saltHex + ":" + password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return bufToHex(digest);
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) { /* storage unavailable */ }
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
  }
  function setSession(session) {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* storage unavailable */ }
  }

  async function createAccount({ name, email, password }) {
    if (!name || !name.trim()) return { ok: false, error: "Please enter your name." };
    if (!password || password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    const key = (email || "").trim().toLowerCase();
    if (!key) return { ok: false, error: "Please enter a valid email address." };

    const users = getUsers();
    if (users[key]) return { ok: false, error: "An account with this email already exists — try signing in instead." };

    const salt = randomSaltHex();
    const hash = await hashPassword(password, salt);
    users[key] = { name: name.trim(), email: key, salt, hash, createdAt: new Date().toISOString() };
    saveUsers(users);
    setSession({ email: key, name: name.trim() });
    return { ok: true };
  }

  async function signIn({ email, password }) {
    const key = (email || "").trim().toLowerCase();
    const users = getUsers();
    const user = users[key];
    if (!user) return { ok: false, error: "No account found with that email in this browser. Create one instead?" };
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) return { ok: false, error: "Incorrect password." };
    setSession({ email: user.email, name: user.name });
    return { ok: true };
  }

  function signOut() {
    setSession(null);
  }

  function getBookings(email) {
    try {
      const all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "{}");
      return all[email] || [];
    } catch (e) {
      return [];
    }
  }

  function addBooking(email, booking) {
    try {
      const all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "{}");
      all[email] = all[email] || [];
      all[email].unshift(booking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    } catch (e) { /* storage unavailable */ }
  }

  window.SHAuth = { createAccount, signIn, signOut, getSession, getBookings, addBooking };
})();
