# Elevated Identities — Website

A static marketing website for Elevated Identities. Plain HTML, CSS and JavaScript
with **no build step and no dependencies** — the files in this folder are the site.

---

## Contents

```
elevated-identities-website/
├── public/                   ← the only directory served publicly
│   ├── index.html            Home
│   ├── about.html            About
│   ├── services.html         Services (5 sections, anchor-linked from Home)
│   ├── faq.html              FAQ
│   ├── process.html          Our Process & Client Standards (replaces Testimonials in nav)
│   ├── testimonials.html     Testimonials — built, unlinked until approved reviews exist
│   ├── contact.html          Contact + enquiry form
│   ├── privacy.html          Privacy Policy (draft — needs legal review)
│   ├── terms.html            Terms of Service (draft — needs legal review)
│   ├── 404.html              Not-found page
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   └── assets/
│       ├── css/styles.css
│       ├── js/main.js
│       └── img/favicon.svg, og-image.svg, og-image.png, tradelines.svg
├── server.js                 Zero-dependency static server
├── package.json              Railway reads this
├── railway.json              Start command, healthcheck, restart policy
├── README.md                 NOT served
└── TODO-CLIENT.md            NOT served — everything outstanding before launch
```

---

## Previewing locally

Run the same server Railway runs:

```bash
cd ~/Documents/elevated-identities-website && npm start
```

Then open <http://localhost:3000>. This is the accurate preview: it exercises the real
404 handling, the security headers and the extensionless URLs.

The pages also open by double-clicking a file in `public/`, since assets are referenced by
relative path, but that route skips the server behaviour above.

---

## Connecting the contact form (required before launch)

The enquiry form posts to **Formspree**. It ships with a placeholder endpoint and will
refuse to send until that is replaced — visitors see a message directing them to phone
or email instead, so nothing silently disappears.

1. Create a free account at <https://formspree.io> using **Elevatedid1@gmail.com**.
2. Create a new form; Formspree gives you an endpoint like
   `https://formspree.io/f/abcdwxyz`.
3. Open `contact.html`, find:

   ```html
   <form class="ei-form" id="ei-contact-form" method="post"
         action="https://formspree.io/f/YOUR_FORM_ID">
   ```

   (in `public/contact.html`)

   and replace `YOUR_FORM_ID` with your form's ID.
4. Confirm the address Formspree emails you, then send a test enquiry.

Notes:

- The form works **without JavaScript** — it degrades to a normal POST and Formspree
  renders its own confirmation page. With JavaScript, submission is asynchronous and
  the visitor stays on the page.
- A honeypot field (`_gotcha`) is included; Formspree silently discards anything that
  fills it in.
- Formspree's free tier has a monthly submission limit. If enquiry volume grows,
  upgrade the plan or the form will stop accepting submissions.

---

## Before you deploy: replace the placeholder domain

The live domain is not yet confirmed, so `https://www.elevatedidentities.com` is used as
a placeholder in three places. Search and replace it once the real domain is known:

```bash
cd ~/Documents/elevated-identities-website
grep -rl "www.elevatedidentities.com" public | xargs sed -i '' 's|https://www.elevatedidentities.com|https://YOUR-DOMAIN.com|g'
```

This covers `<link rel="canonical">` and the Open Graph / Twitter tags in all nine
pages, plus `sitemap.xml` and `robots.txt`.


---

## Deploying to Railway

The site runs as a tiny zero-dependency Node server (`server.js`) that serves the
`public/` directory. Railway detects `package.json`, installs nothing (there are no
dependencies), and runs `npm start`.

### Layout matters

```
elevated-identities-website/
├── public/          ← the ONLY directory served
├── server.js        ← the web server
├── package.json     ← Railway reads this
├── railway.json     ← start command, healthcheck, restart policy
├── README.md        ← not served
└── TODO-CLIENT.md   ← not served
```

`README.md` and `TODO-CLIENT.md` deliberately sit **outside** `public/`. If the repository
root were served, anyone could fetch `/TODO-CLIENT.md` and read that the privacy policy is
an unreviewed draft and that there are no testimonials yet. Keep internal notes out of
`public/`.

### Deploy with the Railway CLI

```bash
npm install -g @railway/cli
railway login
cd ~/Documents/elevated-identities-website
railway init
railway up
railway domain
```

`railway domain` issues a public `*.up.railway.app` URL. Without it the service runs but is
not reachable.

### Deploy from GitHub instead

Push this folder to a repository, then in Railway: **New Project → Deploy from GitHub repo**.
No build command; Railway uses `npm start`. Every push to the default branch redeploys.

### Custom domain

In Railway: **Settings → Networking → Custom Domain**, then add the CNAME it gives you at
your DNS provider. Railway provisions the TLS certificate. Afterwards, update the site's
canonical and Open Graph tags (see "Before you deploy: replace the placeholder domain").

### What the server does

- Serves only `public/`; path traversal is rejected, verified against ten attack shapes
  including `../`, percent-encoded `%2e%2e`, backslash and null-byte variants.
- Returns a real **404 status** with the branded `404.html`, so search engines see 404 and
  not a soft 200.
- Extensionless URLs work: `/about` serves `about.html`.
- gzip for text (the 50KB stylesheet ships as 10.7KB).
- `ETag` + `must-revalidate`: an edit is never masked by a stale cache. Filenames are not
  content-hashed, so long-lived caching is deliberately not used. If you later add hashed
  filenames, switch those to `immutable`.
- Security headers: CSP, `nosniff`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`, and HSTS only when the request arrived over HTTPS.
- Listens on `process.env.PORT` and binds `0.0.0.0`. Both are required on Railway;
  hardcoding a port or binding `127.0.0.1` is the usual cause of a failed deploy.
- Handles `SIGTERM` so in-flight requests finish during a redeploy.

The CSP allows `form-action https://formspree.io`, because with JavaScript disabled the
enquiry form performs a real cross-origin POST there. If you change form provider, update
`CSP` in `server.js` or the no-JS submission will be blocked.

### Running it locally

```bash
cd ~/Documents/elevated-identities-website && npm start
```

Then open <http://localhost:3000>. Set `PORT` to use a different port.

---

## Deploying elsewhere

The site is static, so any host works. Upload the folder contents to the web root.

- **Netlify / Vercel / Cloudflare Pages** — drag the folder into the dashboard, or point
  it at a repository. No build command; publish directory is the folder itself.
- **Traditional hosting (cPanel, etc.)** — upload the contents into `public_html`.
- **404 page** — most hosts pick up `404.html` automatically. On Apache, add
  `ErrorDocument 404 /404.html` to `.htaccess`.

One caveat: assets are referenced by relative path so the site works in a subdirectory
and opens from the filesystem. The consequence is that `404.html` styles correctly for
a missing page one level deep (`/pricing`) but not deeper (`/a/b/c`). If deep URLs are
ever expected, add a host rewrite or switch the paths in `404.html` to root-relative.

---

## How the pages are put together

**The header and footer are byte-identical across all nine pages** — verified by hash.
Because there is no per-page markup difference, the active navigation item cannot be a
per-page `class="active"`. Instead each page sets `<body data-page="services">` and the
stylesheet selects on it:

```css
body[data-page="services"] .ei-nav__link[href="services.html"] { … }
```

This keeps the active state working with JavaScript disabled. **If you add a page**, add
it to the `NAV` list, give the body a `data-page` value, and add the matching selector to
the active-state block in `styles.css` (section 6).

Editing the header or footer means editing it in all nine files. Keep them identical —
`assets/js/main.js` targets `#ei-nav-toggle` and `#ei-nav` on every page.

---

## Design system

Colours, type and spacing are CSS custom properties at the top of `styles.css`. Change a
token there and it applies site-wide.

Per the brand brief the palette is black, white and gold, and **gold is only ever a thin
accent** — rules, dividers, underlines and single highlighted lines. It is never used as
a background or for large areas of text. Gold text appears only on dark backgrounds,
where it meets WCAG AA contrast; on white it would not.

Type pairs a high-contrast display serif with a clean sans:

| Token | Face | Used for |
|-------|------|----------|
| `--ei-font-display` | **Playfair Display** | `h1`, `h2`, `h3`, stat figures, pull quotes |
| `--ei-font-head` | **Manrope** | wordmark, navigation, buttons, labels, eyebrows, `h4` |
| `--ei-font-body` | **Manrope** | body copy |

Both load from Google Fonts with `display=swap` and carry full fallback stacks, so the
site stays readable if Google Fonts is blocked or slow. The serif is deliberately kept
off small text, where its thin strokes would weaken legibility: anything at label size
or below is set in the sans.

This departs from the brief, which asked for a bold geometric sans throughout. The change
was made at the client's request. To revert, point `--ei-font-display` at the same stack
as `--ei-font-head` and update the Google Fonts link in each page's `<head>`.

---

## The tradeline illustration

`services.html` carries a custom illustration under "Authorized tradelines", showing how
such an account appears on a credit report: three account rows, the third highlighted and
labelled as added for an authorized user, with squares marking consecutive on-time months.

It is **drawn, not photographed** — original vector artwork, so there is no stock licence
to maintain and it stays sharp at any size. A standalone copy lives at
`assets/img/tradelines.svg` for reuse in decks or social posts; the copy on the page is
inlined so its parts can animate.

Deliberate choices worth keeping if you edit it:

- **Gold carries no meaning.** Gold measures 2.42:1 against the panel, below the 3:1
  WCAG 1.4.11 minimum for meaningful graphics. The highlighted row is therefore defined by
  an ink outline *and* the words "Authorized user"; the gold bar is redundant
  reinforcement. Never make gold the only thing marking something.
- **Nothing is invented.** No bank names, no card network marks, no account numbers, no
  dollar figures, and no upward arrow implying a promised score gain. The years shown are
  generic examples.
- **Sized for phones.** The viewBox is 400 units wide so that at a 320px screen it renders
  at about 0.7 scale, keeping labels near 12px. Widening the viewBox shrinks the text.
  On screens under 48em the figure bleeds into the container gutters to reclaim width.
- Animation hooks are `data-tl` attributes, driven by the figure's own reveal class. The
  SVG contains no `<style>` or `<script>` of its own.

---

## Motion

Animation is a progressive-enhancement layer. Every effect is additive: if scripts do not
run, or the visitor prefers reduced motion, the page renders complete and static.

**What moves**

| Effect | Where | Driven by |
|--------|-------|-----------|
| Headline revealed word by word from behind a mask | Every page `<h1>` | `[data-split]`, wrapped at runtime into `.ei-word` |
| Drifting gold light | Hero background | `.ei-hero__aurora`, CSS keyframes |
| Spotlight tracking the pointer | Hero | `.ei-hero__spot`, `--mx` / `--my` |
| 3D tilt with a highlight under the cursor | Every card | pointer handler sets a perspective transform, `--gx` / `--gy` |
| Buttons leaning toward the pointer | All buttons | translate of up to 7px, released on leave |
| Scroll reveals, staggered | Headings, cards, splits, stats, forms | `IntersectionObserver` adds `.is-visible` to `[data-reveal]` |
| Counting figures | Stat row | `[data-count]` with `data-count-from` |
| Header condense + gold progress rail | Sticky header | scroll listener sets `.is-scrolled` and `--ei-progress` |
| Line-work draw-in | Hero geometry | SVG `stroke-dashoffset` on `[data-draw]` |
| Specialties strip | Band below the hero | CSS marquee, pauses on hover |

Pointer-driven effects (spotlight, tilt, magnetic buttons) are gated behind
`(hover: hover) and (pointer: fine)`, so touch devices never trigger them.

**Gold as light.** The original brief limited gold to hairlines and forbade it as a
background. The client has since approved gold glows and gradients, which is what the
hero aurora, the panel's gradient border and the glow shadows use.

**The legibility scrim.** Gold light behind gold text is a contrast trap. Measured against
the real gradient stops, the hero eyebrow fell to **3.74:1** where the aurora and
spotlight peak together, below the 4.5 minimum. `.ei-hero__scrim` sits above the glow and
below the content, restoring it to **9.57:1** while leaving the glow visible at the edges
of the hero. If you change the aurora opacity, re-check that number.

**The safety guarantee.** Reveal styles are scoped behind a `.js` class added by an inline
script in `<head>`. With scripts disabled the class never appears, so `[data-reveal]` and
`[data-rise]` are never given `opacity: 0`. Verified: with the class stripped across all
9 pages at 7 widths, zero elements stay hidden. Headline splitting is skipped entirely
under reduced motion, and the `<h1>` text content is preserved exactly either way.

The counting figures carry a second guard: the year founded and service count are facts,
not decoration. If `requestAnimationFrame` stalls, a timeout forces the true value onto
the page.

**Reduced motion.** Under `prefers-reduced-motion: reduce` every animation above is
switched off, reveals resolve immediately, the marquee stops, pointer effects are
disabled and counters print their final value.

**Turning motion down.** Remove the inline `classList.add("js")` from each page's
`<head>` to disable reveals site-wide. Lower `--ei-glow` and the aurora opacities in
`styles.css` to calm the gold. Change `46s` on `.ei-marquee__track` to slow the strip.

---

## Accessibility

- Skip link, landmark elements, and a visible focus ring on every interactive element.
- The mobile nav manages `aria-expanded`, traps focus while open, closes on Escape and
  on outside click, and returns focus to the toggle.
- Form errors use `aria-invalid` and `role="alert"`; submission status uses
  `role="status"` with `aria-live="polite"`.
- The FAQ uses native `<details>`/`<summary>`, so it opens and closes without JavaScript.
- `prefers-reduced-motion` is respected.

---

## Browser support

Modern evergreen browsers, plus Safari 12+ (the media-query listener falls back to the
deprecated `addListener` API). The layout uses CSS Grid and custom properties throughout;
Internet Explorer is not supported.
