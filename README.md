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

The booking modal, the contact page form, and the newsletter form are all
wired for **Netlify Forms** — no backend code required, but real submissions
land in an inbox rather than depending on the visitor's own email client:

1. Each `<form>` carries `data-netlify="true"`, a `name`, a hidden
   `form-name` field, and a hidden honeypot field for basic spam filtering.
   Netlify's build bot detects these automatically from the static HTML —
   nothing else to configure at the platform level.
2. On submit, `js/main.js` validates the fields in the browser, generates a
   reference number (e.g. `SH-4KD2Z`) for bookings, and POSTs the data to
   Netlify Forms via `fetch()`.
3. Netlify stores each submission (visible under **Site → Forms** in the
   Netlify dashboard) and can forward a notification email per submission
   — set that up under **Forms → Form notifications** once deployed.
4. A `mailto:` link stays on the confirmation panel as a manual fallback
   (e.g. if a visitor is on a very old browser, or the site isn't deployed
   to Netlify yet — the `fetch()` just fails silently and the link still
   works).

This only works once the site is deployed on Netlify — opening the HTML
files directly (`file://`) or serving them from a different host will show
the same UI but the Netlify submission itself won't go anywhere; the
`mailto:` fallback still functions everywhere.

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

## Deploying to Netlify

1. Push this repo to GitHub (already done if you're reading this from a PR).
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick
   this repo. Build command: none. Publish directory: `.` (already set in
   `netlify.toml`).
3. Deploy. Netlify auto-detects the `data-netlify="true"` forms in the HTML
   the first time it builds — check **Site → Forms** afterwards to confirm
   `booking`, `contact`, and `newsletter` all show up.
4. Under **Forms → Form notifications**, add an email notification for each
   form pointing at the address you want submissions delivered to.
5. Under **Domain management**, add your custom domain and follow Netlify's
   DNS instructions (either delegate DNS to Netlify, or add the CNAME/A
   records it gives you at your registrar). SSL is issued automatically.

## Before you launch

- **Set the real domain.** `js/destination.js`, `js/blog.js`, every page's
  `<link rel="canonical">`, `sitemap.xml`, and `robots.txt` currently use
  the placeholder `https://www.safirihorizons.co.ke` (matching the fictional
  brand's existing email addresses). Swap it for the live domain everywhere
  — a quick way is `grep -rl safirihorizons.co.ke .` from the project root.
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
