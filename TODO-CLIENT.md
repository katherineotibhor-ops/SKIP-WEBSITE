# Outstanding items — Elevated Identities website

Everything the site still needs from the client, and everything a developer must do
before launch. Items are grouped by whether they **block launch** or can follow.

---

## 1. Launch blockers

These must be resolved before the site goes live.

| # | Item | Who | Notes |
|---|------|-----|-------|
| 1 | **Connect the contact form** | Developer | The form ships with a placeholder Formspree endpoint (`YOUR_FORM_ID`) and will not send until replaced. See README → "Connecting the contact form". Until then the form tells visitors to phone or email instead. |
| 2 | **Fix the custom domain (502)** | Client / Developer | `www.elevatedidentities.com` currently returns **502 Bad Gateway — Connection refused**. The Railway deployment itself is healthy, so this is a Railway custom-domain + DNS configuration problem, not a site problem: add the domain in Railway, then point the registrar's DNS at the target Railway gives you (CNAME for `www`, and Railway's instructions for the apex) and wait for the certificate to issue. Nothing in this repo can fix it. The placeholder host `https://www.elevatedidentities.com` is already used throughout the canonical/OG tags, `sitemap.xml` and `robots.txt`, so once DNS resolves no code change is needed. |
| 3 | ~~**Export the social share image as PNG**~~ **Done** | Developer | `assets/img/og-image.png` has been exported at 1200×630 from the SVG, and all 18 `og:image` / `twitter:image` tags across the nine pages now point at it. Facebook, LinkedIn and X do not render SVG `og:image`, which is why the PNG is required. `og-image.svg` is retained as the editable source — re-export the PNG if it changes. |
| 4 | **Legal review of Privacy Policy and Terms** | Client | `privacy.html` and `terms.html` are drafts, not attorney-reviewed. Credit repair is regulated federally (including the Credit Repair Organizations Act) and at state level; required disclosures, cancellation rights and fee-timing rules vary. Have an attorney review both, plus the footer disclaimer, before launch. |
| 5 | **Approve the homepage tagline** | Client | "Stronger credit. Greater funding potential." was written for this build — the brand pack tagline was referenced in the brief but not supplied. Confirm or replace (`index.html`, `<h1>`). |
| 6 | **Confirm the business address display** | Client | Currently shown as "South Carolina, USA" (state only) in the footer and on Contact. Confirm whether the full street address should appear instead. |
| 7 | **Confirm the booking link** | Client | "Book a Free Consultation" appears on every page and currently points to the contact form. If a booking tool (Calendly, GoHighLevel, etc.) is preferred, supply the link and it will be swapped in. |
| 22 | **Legal review must cover the rebrand** | Client | The site now describes the service as *Credit Consulting & Profile Improvement* rather than *Credit Repair*. **Renaming the service does not change which laws apply.** If the company disputes credit information on a consumer's behalf, the Credit Repair Organizations Act and state credit-services statutes still govern the engagement — including required written contracts, the three-day cancellation right, and the rule against charging fees before services are fully performed. The attorney review in item 4 must cover the service agreement, cancellation notice, fee structure and required disclosures, not just the two web pages. |
| 23 | **Branded email address** | Client | Footer and Contact still show `Elevatedid1@gmail.com`, which also appears in the form's fallback message in `assets/js/main.js`. Once `consultations@elevatedidentities.com` (or similar) exists, it needs replacing in three places: the footer block on all 10 pages, the Contact page details, and the JS fallback. A Gmail address on a financial-services site is the single cheapest credibility fix available. |
| 24 | **Verify the LinkedIn URL** | Client | The footer links to `linkedin.com/in/elevated-id-undefined-470a32432`. The word "undefined" in the slug usually means the profile was created with an empty name field. It may still resolve — it could not be checked from the build environment. Kate should open it, and if it works, set a clean custom URL in LinkedIn (Profile → Edit public profile & URL) and send the new one. If it does not resolve, the link should be removed rather than left broken. |
| 25 | **Confirm the business phone number** | Client | `(602) 824-8796` is an Arizona area code while the site names South Carolina as headquarters. Not wrong — plenty of businesses keep a number through a move — but worth confirming it is the permanent business line before it is printed across 10 pages and the share image. |
| 26 | **Confirm the response-time promise** | Client | The Contact page now states "We aim to respond within one business day." This was written to fill the gap the review asked for. Confirm the company can actually meet it, or supply the correct window — a missed response promise is worse than none. |
| 27 | **Legal review of the consent checkbox** | Client | The enquiry form now has a required consent checkbox covering phone, text and email contact, with "message and data rates may apply", "reply STOP to opt out" and "consent is not a condition of purchase". This wording was drafted to be reasonable, **not** as legal advice — TCPA and state texting rules are litigated aggressively. Have the attorney confirm the wording and whether consent should be required to submit, before any SMS or dialer campaign begins. |
| 28 | **Founder / team detail for the About page** | Client | A company-background section has been added to `about.html`, written only from facts already on the site (founded 2023, South Carolina, nationwide). It deliberately contains **no founder name, photo or biography**, because none was supplied and none was invented. Supply a short bio and a photo and it will be filled in — this is the section that most affects whether a visitor trusts you with their SSN and credit reports. |
| 29 | **Confirm the extended service capabilities** | Client | The Services page now lists secondary consumer-reporting agencies, banking-history consulting, ChexSystems and Early Warning Services review, and personal-information/employment-history review. These were added on the instruction that they are services actually offered. Confirm each one is genuinely provided before launch — listing a service that is not delivered is the kind of claim that attracts complaints. |


---

## 2. Content still needed

| # | Item | Who | Notes |
|---|------|-----|-------|
| 8 | **Approve service descriptions** | Client | The paragraph under each of the five services on `services.html` was drafted from the brand pack service list. Please review for accuracy — particularly the credit repair and tradelines wording, which must not overstate what is offered. |
| 9 | **Approve the FAQ** | Client | `faq.html` is a full draft covering credit repair, funding, tradelines and working with you. Several answers deliberately state what **cannot** be guaranteed. Confirm the wording reflects how you describe the service. |
| 10 | **Testimonials** | Client | No reviews were supplied, and none have been invented. `testimonials.html` still exists with its markup template, but has been **removed from the navigation, footer and `sitemap.xml`** and replaced there by `process.html` (*Our Process & Client Standards*), so visitors do not land on an empty "reviews coming soon" page. Supply reviews **with written client permission to publish** and the page will be populated and restored to the navigation. |
| 11 | **Photography** | Client | Still outstanding. The tradelines section now has a drawn illustration, but the other four services and the hero have no imagery. Real photography remains the biggest single upgrade available to this site. |
| 11b | **Review the illustration wording** | Client | No business, team or service photos were supplied. The design currently uses none, which is why it reads as typographic rather than image-led. Supply photography if a more image-led look is wanted. |
| 12 | **Reference websites** | Client | The brief asked for 2–3 sites you like; none were provided. The current direction follows the brief's written description — "modern, clean, premium" in black/white/gold. |
| 13 | **High-resolution / vector logo** | Client | The wordmark is currently set in type with an inline SVG mark built to match the supplied logo. If a vector original exists, supply it and it will replace the inline mark and the favicon. |

---

## 3. Decisions to confirm

| # | Item | Who | Notes |
|---|------|-----|-------|
| 14 | **FAQ and Testimonials pages** | Client | The brief listed both as recommended but pending your decision. Both have been built. If either is not wanted, say so and it will be removed from the navigation, footer and `sitemap.xml`. |
| 15 | **Blog / Tradelines detail page** | Client | Listed in the brief as "to confirm". Not built. |
| 16 | **Launch date** | Client | Outstanding. |
| 17 | **Written sign-off** | Client | The brief asks for sign-off on pages, design direction and content before build is considered complete. |

---

## 4. Recommended, not required

| # | Item | Notes |
|---|------|-------|
| 18 | **Company size / team detail** | Listed as "to be confirmed" in the brief. There is no team section on the site; one can be added to About if wanted. |
| 19 | **Analytics** | None installed — no tracking cookies, so no cookie banner is needed. If analytics are added later, the Privacy Policy must be updated and a consent banner may become necessary. |
| 20 | **Copyright year** | The footer reads "© 2026". It is static text in all nine files; update it each January, or ask and it can be made automatic. |
| 21 | **Phase-two integrations** | The brief excludes CRM connections, automations, API integrations and payment systems from phase one. GoHighLevel routing of enquiries was noted for later discussion. |

---

## Verification completed

Checks run against the finished build:

| Check | Result |
|-------|--------|
| Header + footer byte-identical across all 9 pages | SHA-256 match, verified |
| Horizontal overflow at 320 / 375 / 414 / 768 / 1024 / 1440 / 1920 px | 63 page/width combinations, 0 overflow |
| Side gutters equal left and right | verified at all 7 widths on all 9 pages (e.g. 112px / 112px at 1440) |
| Console errors and failed requests | 0 errors, all requests 200/304, all 9 pages |
| Internal links and anchors | 19 link targets, all resolve |
| WCAG AA contrast, every text/background pair | 585 elements measured across 9 pages, 0 failures |
| Contrast under the gold glow | composited from real gradient stops: eyebrow 9.57:1, heading 17.0:1, lede 10.3:1 |
| Pointer interactions | spotlight, parallax, 3D tilt, magnetic buttons all fire and reset cleanly |
| Fonts load | Playfair Display and Manrope both confirmed loaded |
| Header progress rail | now verified working end to end, 0 to 1 across the page |
| Headline text preserved after splitting | exact on all 9 pages |
| Illustration legibility | renders 279px at a 320px screen, labels ~12px |
| Illustration text contrast | 8 text elements, 0 failures (7.34:1 and 19.8:1) |
| Illustration is self-contained | no external refs, no script, no fixed width, viewBox present |
| Animation does not hide content | with the `.js` class removed, 0 of 14 reveal elements stay hidden |
| Counting figures survive stalled frames | figures still settle on 2023 and 5 |
| Reduced-motion coverage | every animation switched off under `prefers-reduced-motion` |
| Line length in the wider layout | 66 to 71 characters, inside the comfortable range |
| Contact form validation | 5 fields, errors + focus management, no network call on invalid input |
| Contact form submit paths | success, server error, network failure, and unconfigured-endpoint guard |
| Mobile navigation | toggle, Escape, outside click, focus trap (both directions), breakpoint close |
| FAQ accordion without JavaScript | 13 native `<details>`, expand and collapse verified |
| Navigation without JavaScript | all 6 links reachable via the `<noscript>` fallback |
| Web fonts | Space Grotesk and Inter both load, with fallback stacks in place |

### Design revision (client feedback)

The layout was reworked after first review to match the spacing of a reference site:

- **Content column widened** from 1152px to 1312px, with gutters that scale from 20px on
  a small phone to 64px on a large desktop, and are always equal on both sides.
- **Hero rebuilt as two columns.** Previously the text sat left with the right half of the
  screen empty. A "What we help with" panel now occupies the right column and links
  through to each service. It stacks below the text on narrow screens.
- **All dashes removed from the copy.** Em dashes and en dashes have been rewritten out of
  every sentence on all nine pages, using commas, colons or full stops instead.
- **Decorative dashes removed.** The short gold dash that preceded each section label is
  gone, and the dash bullets in feature lists are now gold check marks. Full-width gold
  rules and dividers remain, since the brand brief specifically calls for them.

Note: ordinary hyphens inside words are untouched, since removing them would produce
incorrect English. Say the word if you want those changed too.

### Fifth revision: tradeline illustration

- **Added a custom illustration** to the "Authorized tradelines" section of `services.html`,
  showing how an authorized tradeline appears on a credit report. It animates in on scroll:
  rows slide in, then the payment-history squares rise in sequence, then the gold marker
  draws down the highlighted row.
- Drawn as original vector artwork rather than sourced stock, so there is no licence to
  maintain and no attribution requirement. Standalone copy at `assets/img/tradelines.svg`.
- It deliberately shows **no bank names, no card network marks, no account numbers, no
  dollar figures and no upward arrow** implying a promised score increase. Please still
  review the wording inside it, since it depicts your service.

### Fourth revision: new typeface and a fuller hero

- **Type changed** to Playfair Display for headings, figures and quotes, with Manrope for
  body, navigation, buttons and labels. Display sizes increased for more presence. This
  departs from the brief's "bold geometric sans for headings"; it was requested. README
  section "Design system" says how to revert.
- **Hero motion added**: a slow light sweep across the panel, ten motes of gold light
  drifting upward, the headline emerging word by word out of a blur, a gold rule drawing
  itself beneath it, the service list staggering in, and the whole decorative layer
  drifting against the pointer.
- **The services panel border now rotates**, a slow sweep of gold light around its edge.
- **Section grounds** softened to a gradient rather than a flat tint.

### Third revision: interactive motion

Reworked after feedback that the previous animation was too subtle to notice.

- **Headline reveals word by word** from behind a mask, on every page.
- **The hero responds to the pointer**: gold light drifts behind the content, and a
  spotlight follows the cursor across it.
- **Cards tilt in 3D** toward the pointer with a highlight tracking underneath.
- **Buttons lean toward the cursor** as you approach them.
- **Scroll reveals are much larger** than before, with a longer travel and a scale, so
  they actually register.
- **Gold now glows**: luminous borders on the services panel, glow shadows on buttons and
  cards, a lit progress rail on the header.

Pointer effects are disabled on touch devices and under reduced-motion.

**One brand note:** this required going past the brief's rule that gold is hairline-only
and never a background. You approved that. If the client wants the original rule
enforced, lower the `--ei-glow` tokens and the aurora opacities in `styles.css` and the
site returns to hairline-only gold.

### Superseded: second revision

- **Hero given depth**: layered lighting, fine grain, and a geometric line composition
  that draws itself in on load, echoing the logo mark. The services panel now reads as a
  glass card floating above that line work.
- **Scroll reveals** on headings, cards, splits, stats and forms, staggered so a card grid
  ripples in rather than appearing all at once.
- **Counting figures** on the year founded and service count.
- **Header** condenses and turns translucent once scrolled, with a gold reading-progress
  rail along its base.
- **Specialties strip** below the hero, scrolling the service keywords from the brief. It
  pauses on hover. This occupies the slot a "trusted by" logo bar would take, without
  inventing client logos.
- **Hover detail** throughout: buttons fill with a sweep, cards lift with a gold rule
  drawing across the top, panel links slide against a short gold marker.

All motion is a layer on top of a page that works without it. See README section "Motion".

### Issues found and fixed during verification

1. **Invisible buttons on dark sections.** `.ei-btn--secondary` inside the call-to-action
   band rendered black text on a black background — a contrast ratio of 1.0, affecting the
   "Call (602) 824-8796" and "See our services" buttons on five pages. `.ei-cta` had been
   left out of the dark-background style overrides. Fixed.
2. **Sticky header could not stick.** `overflow-x: hidden` on `body` made its `overflow-y`
   compute to `auto`, turning the body into its own scroll container so the document never
   scrolled. The rule was unnecessary — nothing overflows at any tested width — and was
   removed.
3. **Hero eyebrow below contrast minimum.** Muted grey on black measured 2.7:1 against a
   4.5 requirement. Fixed.
4. **Raw browser errors shown to visitors.** A failed submission displayed the literal
   string "Failed to fetch". Only messages returned by the form service are shown now.
5. **Gold glow broke contrast on gold text.** With the aurora and spotlight peaking
   together, the hero eyebrow measured 3.74:1 against a 4.5 requirement. A legibility
   scrim between the glow and the content restored it to 9.57:1. Measured from the real
   gradient stops, not estimated.
6. **The progress rail never updated, even once its element existed.** It was driven by
   scroll events, which some embedded contexts never emit. It now runs from a frame loop
   that reads scroll position directly, which also made it verifiable. Confirmed moving
   0 to 0.297 to 0 across the page.
7. **A progress rail was styled but never existed.** The header CSS carried rules for a
   scroll-progress bar that had no matching element in the markup, so it had never
   rendered. The element is now in the shared header partial.
8. **Counting figures could display wrong facts.** The stat animation left the year
   founded reading "2013" whenever `requestAnimationFrame` stalled, which happens in a
   hidden or backgrounded tab. A guard now forces the true value onto the page
   regardless. Verified by stubbing out `requestAnimationFrame` entirely.
9. **Mobile navigation unusable without JavaScript.** The toggle is inert without JS and
   the panel is hidden by CSS, leaving only the footer links. A `<noscript>` fallback now
   displays the navigation inline and hides the dead toggle.

### Not verified

- Behaviour against the **live Formspree endpoint** — the form ships unconnected, so
  submission was verified against a stubbed endpoint covering success and failure. Send a
  real test enquiry after completing item 1.
- **Real-device testing.** Checks ran at emulated viewport sizes in a single engine, not
  on physical iOS or Android hardware.
- **Social share previews**, which cannot be confirmed until the domain is live and the
  PNG share image from item 3 is in place.
