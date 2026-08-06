# Alpview — website redesign

A redesign of [alpview-itservice.de](https://alpview-itservice.de/) in the visual
style of [Mellom](https://github.com/yeh0rich/mellom): a Stripe-inspired
single-page layout — gradient hero, bento-grid services, sticky-stacked case
panels, hover-revealing process cards, and a full-width footer wordmark —
rewritten with Alpview's real content (services, project profiles, delivery
model, contact details) and using Alpview's own brand: their logo and the
navy/blue/cyan/warm-cream palette and Geist typeface pulled from
alpview-itservice.de itself.

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

## Logo

`assets/alpview-logo.svg` is the real logo. `assets/favicon.svg` is a
derived favicon (the same mark on a rounded square) — regenerate it if the
logo changes.

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

- **Contact form** — `js/main.js` has a demo submit handler (shows a success
  message, doesn't send anywhere). Wire it to a real form backend using the
  `.env` values above before launch.
- **Team section** — role-based placeholder cards (Leadership / Engineering
  / Applied AI), since no real team bios/photos were provided. Swap in real
  people whenever you're ready.

## Colors

`css/style.css` `:root` defines the palette, pulled from
alpview-itservice.de's own CSS custom properties:

| Token | Hex | Role |
|---|---|---|
| `--brand` | `#245cff` | Primary blue accent |
| `--brand-dark` | `#1a45c8` | Accent hover/darker |
| `--brand-light` | `#89aafc` | Light blue tint |
| `--cyan` | `#31cbc6` | Secondary accent / success |
| `--ink` | `#06172b` | Navy — dark bg & primary text |
| `--ink-soft` | `#53647a` | Secondary text (slate) |
| `--slate` | `#f4f2ed` | Warm cream — light section bg |
| `--white` | `#f8fafc` | Off-white surface |
| `--border` | `#dbe2ea` | Hairlines |
| `--warn` | `#c17f2e` | Semantic warning only (not brand) |

Typeface is [Geist](https://vercel.com/font) (Alpview's real font), falling
back to the system sans-serif stack.
