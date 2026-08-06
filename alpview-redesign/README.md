# Alpview — website redesign

A redesign of [alpview-itservice.de](https://alpview-itservice.de/) in the visual
style of [Mellom](https://github.com/yeh0rich/mellom): a Stripe-inspired
single-page layout — gradient hero, bento-grid services, sticky-stacked case
panels, hover-revealing process cards, and a full-width footer wordmark —
recolored to a navy/blue palette and rewritten with Alpview's real content
(services, project profiles, delivery model, contact details).

Static HTML/CSS/JS, no build step, no framework.

## Structure

```
index.html        Single-page site
css/style.css      All styles (CSS variables at the top control the palette)
js/main.js         Scroll reveals, sticky case-panel stack, team carousel, etc.
assets/            Logo, favicon, images
.env.example       Template for future API keys (see below)
```

## Running locally

No build step — just serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding the real logo

Replace `assets/logo-placeholder.svg` with the real Alpview logo (keep the
filename, or update the two `<img src="assets/logo-placeholder.svg">`
references in `index.html` if you rename it). Update `assets/favicon.svg`
too if you want the browser tab icon to match.

## Environment variables / API keys

The site is currently fully static — no backend, no build step, nothing that
reads an API key today. `.env.example` and `.gitignore` are set up in advance
so that when a real integration is added (contact-form submission service,
analytics, etc.), there's already a safe place for secrets:

1. Copy `.env.example` to `.env` and fill in real values.
2. `.env` is git-ignored — it will never be committed.
3. Never put real keys directly in `index.html` or `js/main.js`; if a key is
   used from the browser, treat it as public (only use keys meant for
   client-side use, and rate-limit/scope them on the provider's side).

## What's a placeholder right now

- **Logo** — `assets/logo-placeholder.svg` is a temporary mark; swap it for
  the real logo.
- **Contact form** — `js/main.js` has a demo submit handler (shows a success
  message, doesn't send anywhere). Wire it to a real form backend using the
  `.env` values above before launch.
- **Team section** — role-based placeholder cards (Leadership / Engineering
  / Applied AI), since no real team bios/photos were provided. Swap in real
  people whenever you're ready.
- **Colors** — `css/style.css` `:root` defines `--brand`, `--brand-dark`,
  `--brand-light`, `--ink`; adjust these once the final logo/brand palette is
  set.
