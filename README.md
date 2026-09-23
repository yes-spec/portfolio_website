# Safiri Horizons — Tours & Hospitality

A professional, fully static website for a tours & hospitality business
sourcing clients globally, showcasing bookable destinations across Africa —
with a full booking flow, a destination-by-destination journal, an
interactive map, dark mode, multi-currency pricing, PWA support, and more.

## Structure

```
index.html          Homepage — hero, featured journeys, trust signals, testimonials
tours.html           Full catalogue — searchable, filterable, interactive Africa map
destination.html     Dynamic destination detail page (?slug=<id>) — itinerary, pricing, booking
about.html            Company story, values, team
blog.html             Travel journal listing
article.html          Dynamic article page (?slug=<id>)
contact.html          Contact form, contact details, FAQ, WhatsApp link
login.html            Sign in / create account (client-side demo auth — see below)
account.html          Signed-in dashboard: profile + saved booking requests

css/style.css         All styling — design tokens, dark theme, layout, responsive, motion
js/data.js            Single source of truth: all tour + article content (window.SH)
js/auth.js            Demo authentication (accounts, sessions, saved bookings)
js/main.js            Shared site behaviour: nav, modal, currency, theme, map, forms
js/destination.js      Renders destination.html from js/data.js
js/blog.js             Renders blog.html / article.html from js/data.js
js/account.js          Renders login.html / account.html

images/destinations/*.svg   Original hand-drawn illustration per destination
images/icon.svg              App icon (used by manifest.json)
manifest.json, sw.js         PWA manifest + service worker (installable, works offline)
sitemap.xml, robots.txt      SEO files (update the domain before launch — see below)
```

No build step or framework is required — open `index.html` directly, or serve
the folder with any static file server (e.g. `python3 -m http.server`).

## Destinations & content

12 African journeys spanning Safari, Beach & Islands, Mountains & Trekking,
Desert & Culture, Waterfalls & Adventure, and Culture & City across Kenya,
Tanzania, Zambia/Zimbabwe, Morocco, South Africa, Botswana, Egypt, Rwanda and
Seychelles, plus 4 travel-journal articles. All content lives in the `TOURS`
and `BLOG` arrays in `js/data.js` — add, edit, or remove entries there and
every page (featured picks, catalogue, filters, map pins, booking dropdown,
destination pages, related-articles, sitemap generation) stays in sync.

Each tour record includes a day-by-day `itinerary`, `includes`/`excludes`
lists, a `bestTime` and a `mapPin` position — all rendered automatically on
its `destination.html?slug=<id>` page.

## Feature tour

- **Booking modal** — client-side validated, generates a reference number,
  emails the request via `mailto:`, with a focus-trapped accessible dialog.
- **Multi-currency pricing** — USD/EUR/GBP/KES toggle in the header
  (`js/main.js`, `CURRENCY` object) with static illustrative rates; choice
  persists in `localStorage`. Update the `rates` object with live figures
  before launch, or wire it to a currency API.
- **Dark mode** — explicit toggle persists in `localStorage`; otherwise
  follows the visitor's OS `prefers-color-scheme` automatically.
- **WhatsApp click-to-chat** — floating button on every page plus a link on
  the contact page, using `wa.me` with a pre-filled message. Update the
  phone number (`254700123456`) to the real one before launch.
- **Interactive Africa map** (`tours.html`) — inline SVG with a pin per
  destination (positions in `TOURS[].mapPin`), each linking straight to
  that destination's page. Explicitly labelled "illustrative, not to
  scale" — it's a stylised silhouette, not a surveyed map.
- **Destination pages** — full itinerary timeline, inclusions/exclusions,
  related journeys, and per-page SEO meta + `TouristTrip` JSON-LD, all
  rendered client-side from `js/data.js` (see SEO note below).
- **Travel journal** — 4 original articles with per-page SEO meta +
  `Article` JSON-LD, cross-linked to the relevant destination page.
- **PWA** — `manifest.json` + `sw.js` make the site installable and give it
  basic offline support (network-first for pages, cache-first for assets).
- **Accessibility** — skip-to-content link, visible focus states, a
  focus-trapped/Escape-closable booking modal, `prefers-reduced-motion`
  support, and labelled interactive controls throughout.
- **Sign in / accounts** (`login.html`, `account.html`) — a fully working
  demo auth system, entirely client-side (see below): create an account,
  sign in, and any booking request submitted while signed in is saved to
  "My Booking Requests" on the account page. The header's account link
  switches between "Sign In" and "Hi, ⟨name⟩" based on session state.

## How booking works today

Since this is a static site with no backend, the booking form:

1. Validates required fields in the browser.
2. Generates a reference number (e.g. `SH-4KD2Z`).
3. Shows an on-page confirmation panel.
4. Opens the visitor's email client via a pre-filled `mailto:` link
   addressed to `bookings@safirihorizons.com`, containing every field
   they submitted.

This works globally with no server, but relies on the visitor having a
configured email client. The contact page form works the same way.

## How sign-in works today

`login.html` / `account.html` / `js/auth.js` implement a real, working demo
authentication system — but since there's no backend, it lives entirely in
the visitor's browser (`localStorage`):

1. **Create Account** stores `{ name, email, salt, hash }` — the password
   itself is never stored. It's combined with a random salt and hashed with
   SHA-256 via the Web Crypto API before saving.
2. **Sign In** re-hashes the entered password with the stored salt and
   compares hashes — the same pattern real backends use, just running
   client-side instead of on a server.
3. The session (`{ email, name }`) is stored separately and read by every
   page to decide whether the header shows "Sign In" or "Hi, ⟨name⟩".
4. Booking requests submitted while signed in are saved per-account and
   listed on `account.html`.

**This is not real authentication** — there's no server to verify against,
so anyone with access to the browser's dev tools can inspect or clear this
data, and accounts don't sync across devices or browsers. It's a genuine,
non-misleading demonstration of the UX (and it never stores a plain-text
password), but before launch, replace `js/auth.js` with a real identity
provider: [Auth0](https://auth0.com), [Firebase Auth](https://firebase.google.com/docs/auth),
[Supabase Auth](https://supabase.com/auth), or your own backend with
properly salted+hashed server-side storage (e.g. bcrypt/argon2) and HTTP-only
session cookies.

## Before you launch

- **Wire a real form backend.** Replace the `mailto:` logic in the `submit`
  handlers in `js/main.js` (`initModal()`, `initSimpleForms()`) with a
  `fetch()` call to Formspree, EmailJS, Netlify Forms, or your own API.
- **Set the real domain.** `js/destination.js`, `js/blog.js`, every page's
  `<link rel="canonical">`, `sitemap.xml`, and `robots.txt` currently use
  the placeholder `https://www.safirihorizons.com` (matching the fictional
  brand's existing email addresses). Swap it for the live domain everywhere
  — a quick way is `grep -rl safirihorizons.com .` from the project root.
- **Real contact details.** Update the email addresses, phone/WhatsApp
  number, and office address in `contact.html` and the footer of every page.
- **Real social links.** Replace the placeholder `#` social links.
- **Live currency rates.** The `CURRENCY.rates` object in `js/main.js` is
  static and illustrative — connect a live FX API for accuracy, or keep it
  simple and update the rates periodically.
- **Consider static-rendering destination/article pages for SEO.** They
  currently render client-side from a `?slug=` query param — good for
  maintainability (one template, one data file) and modern crawlers do
  execute JS, but a prerendered/SSG version of `destination.html` and
  `article.html` per slug would be more robust for search engines and
  visitors with JS disabled. The `<noscript>` fallback on both pages links
  back to the listing in the meantime.
- **PWA icon.** `images/icon.svg` is a simple vector mark. Consider adding
  raster PNG icons (192×192, 512×512) for broader install-prompt support
  on platforms with incomplete SVG-icon support.
- **Replace the demo auth system.** `login.html`/`account.html` currently
  run entirely client-side (see "How sign-in works today" above) — swap in
  a real identity provider before launch so accounts are real, survive
  cleared browser storage, and sync across devices.

## Customisation notes

- Brand colours and typography are defined as CSS variables at the top of
  `css/style.css` (`:root`), including a dark-mode override block.
- Each destination has an original, hand-drawn SVG illustration at
  `images/destinations/<slug>.svg` — no external image dependencies or
  hotlinked stock photography. To switch to real photography once you have
  licensed images, add a `.jpg`/`.webp` file and update that tour's `image`
  path in `js/data.js`; the existing `.tour-media-img` styling (object-fit:
  cover, hover/ambient zoom) works unchanged with photos.
