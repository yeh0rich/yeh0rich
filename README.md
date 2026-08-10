# Alpview — website redesign

Alpview's real site structure and content (hero, solution fields, industry
hub diagram, delivery model, proof stats, project profiles, company/engineering
gateway, contact) and Alpview's own brand — logo, navy/blue/cyan palette and
Geist typeface, all pulled from alpview-itservice.de itself — executed in the
visual system of [Mellom](https://github.com/yeh0rich/mellom): a light theme,
rounded cards with hover motion, a floating-pill header that solidifies on
scroll, and monospace section eyebrows.

Static HTML/CSS/JS, no build step, no framework.

## Structure

```
index.html        Single-page site
css/style.css      All styles (CSS variables at the top control the palette)
js/main.js         Header scroll state, mobile menu, scroll reveals, contact form demo
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
- **Project profiles** — anonymized, illustrative project descriptions (no
  real client names, per Alpview's own confidentiality stance). Swap in real
  profiles whenever you're ready.

## Colors

`css/style.css` `:root` defines the palette, pulled directly from
alpview-itservice.de's own CSS custom properties:

| Token | Hex | Role |
|---|---|---|
| `--brand` | `#245cff` | Primary blue accent — buttons, links, icons |
| `--brand-hover` | `#3972ff` | Primary button hover |
| `--brand-light` | `#89aafc` | Light blue — hero highlight text |
| `--cyan` | `#31cbc6` | Secondary accent |
| `--ink` | `#06172b` | Navy — primary text |
| `--ink-soft` | `#53647a` | Secondary text (slate) |
| `--muted` | `#8391a4` | Tertiary text / labels |
| `--cream` | `#f4f2ed` | Warm section tint |
| `--ice` | `#eef3f8` | Light blue-tinted section bg |
| `--white` | `#f8fafc` | Off-white surface |
| `--border` | `#dbe2ea` | Hairlines |

Typeface is [Geist](https://vercel.com/font) (Alpview's real font, with Geist
Mono for section eyebrows), falling back to the system sans-serif stack.
