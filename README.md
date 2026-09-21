# Safiri Horizons — Tours & Hospitality

A professional, fully static website for a tours & hospitality business
sourcing clients globally, showcasing bookable destinations across Africa.

## Structure

```
index.html      Homepage — hero, featured journeys, trust signals, testimonials
tours.html      Full destinations catalogue — searchable, filterable by category
about.html      Company story, values, team
contact.html    Contact form, contact details, FAQ
css/style.css   All styling (design tokens, layout, responsive rules)
js/main.js      Destination data, rendering, filters, booking modal, forms
```

No build step or framework is required — open `index.html` directly, or serve
the folder with any static file server (e.g. `python3 -m http.server`).

## Destinations included

12 African journeys spanning Safari, Beach & Islands, Mountains & Trekking,
Desert & Culture, Waterfalls & Adventure, and Culture & City across Kenya,
Tanzania, Zambia/Zimbabwe, Morocco, South Africa, Botswana, Egypt, Rwanda and
Seychelles. All destination content lives in the `TOURS` array at the top of
`js/main.js` — add, edit, or remove entries there and every page (featured
picks, full catalogue, filters, booking dropdown, detail modal) updates
automatically.

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

## Wiring up a real backend (recommended before launch)

To collect bookings directly (no email client required) and store/notify
on every submission, replace the `mailto:` logic in the `submit` handlers
inside `js/main.js` (`initModal()` and `initSimpleForms()`) with a `fetch()`
call to one of:

- **Formspree** (formspree.io) — drop-in form endpoint, no server code.
- **EmailJS** (emailjs.com) — sends email directly from the browser.
- **Netlify Forms** — if hosting on Netlify, add `data-netlify="true"` to
  the `<form>` tags and Netlify handles submissions automatically.
- A custom API (Node/Express, etc.) if you want full control and a
  booking database.

## Customisation notes

- Brand colours and typography are defined as CSS variables at the top of
  `css/style.css` (`:root`).
- Update the email addresses, phone number, and office address in
  `contact.html` and the footer of every page once real ones are ready.
- Replace the placeholder social links (`#`) with real profile URLs.
- Imagery is currently rendered with CSS gradients + inline SVG icons
  (no external image dependencies). Swap the `.tour-media` gradients for
  real photography by adding `background-image` per destination once you
  have licensed images.
