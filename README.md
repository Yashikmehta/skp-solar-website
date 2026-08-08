# SKP Solar World — website

Production build of the approved SKP Solar World design handoff.
Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion available.

---

## Status

Verified on Node 26.6.0 / npm 11.18.0:

- `npx tsc --noEmit` — clean, zero errors
- `npm run build` — succeeds; all 6 routes prerendered as static, `/api/leads` dynamic
- All 6 routes return 200 and render
- Both calculators verified against the source formulas by hand
- Contact form: validation, error clearing, submit and success state all work
- Products tabs, optimizer flow, Solutions switcher, mobile drawer all work
- Mobile (375px): no horizontal overflow, drawer opens with all 7 items + CTA

Two bugs were found and fixed during that pass:

1. **Two nav items highlighted at once.** `isActiveRoute()` stripped the hash
   from "Solutions" (`/#solutions`), leaving `/`, which matched the homepage — so
   Home *and* Solutions both rendered gold with `aria-current="page"`. Section
   links now never claim the active state.
2. **Solutions switcher lagged one interaction.** `withFade()` deferred its
   `setState` into a `setTimeout`, so each tab/card selection only appeared after
   the *next* click. State now applies immediately and the timer only lifts the
   `.sol-fade` class, which is what it was there for visually.

## Assets

**All 30 in place** — 26 images + 4 webfonts. Nothing outstanding.

The 13 product renders came from the design project via the API. The rest were
recovered from the design downloads already on this Mac
(`~/Downloads/SKP Solar Homepage Restructure/assets`) and renamed to what the
code expects:

| In the project | Came from |
| --- | --- |
| `hero-globe.png` | `globe.png` |
| `founder-portrait.png` | `founder.png` |
| `book-cover-sky.png` | `book-sky.png` |
| `skp-logo.png`, `book-qr.png` | same name |
| 8 photos (`industrial`, `residential`, `commercial`, `schools`, `ongrid`, `offgrid`, `hybrid`, `pump` `.jpg`) | same names |

The four `fonts/*.woff2` are the Inter and Sora subsets — Inter recovered from
the design project, Sora fetched from Google Fonts (identical open-source files;
the design's own CSS carries Google's subset metadata).

All 30 files were verified by magic-number check (`‰PNG` / `ÿØÿ` / `RIFF` /
`wOF2`) — no truncated or corrupt files. Total 7.1 MB.

If you ever need to re-pull them: the design API caps single-file reads at
~192 KB, so anything larger comes back truncated. The four big source PNGs
(logo, globe, portrait, book cover) can only come from the local design
downloads, not the API.

## How the design is preserved

The handoff calls `skp-system.css` the single source of truth, and the brief
required pixel-perfect fidelity. So the approved CSS is carried over **verbatim**
rather than re-expressed in Tailwind, which would have guaranteed drift in
clamps, gradients, timings and breakpoints.

| File | Origin |
| --- | --- |
| `src/styles/skp-system.css` | Verbatim from the handoff. Do not edit. |
| `src/styles/skp-fonts.css` | Verbatim; only `src:` URLs made root-absolute. |
| `src/styles/pages/*.css` | Verbatim, extracted from each `.dc.html` `<style>`. |
| `src/styles/skp-system-gaps.css` | **The only added CSS** — see below. |

Tailwind is installed and configured with the same tokens (`tailwind.config.ts`)
for any UI written *after* handoff. Its preflight is disabled, because
`skp-system.css` ships the approved reset and running both would change the
rendering.

### The one gap I had to fill

`.fbtn-gold`, `.fbtn-ghost` and `.fbtn-wa` are used in the markup on five pages
but **defined in no stylesheet in the handoff** — only the `.fbtn` base exists.
Left alone, every final-CTA button would render with no background.

`src/styles/skp-system-gaps.css` fills them using the design's own button
language (gold = the `.cta` treatment, ghost = `.cta-ghost.on-dark`, wa = the
`.ft-wa` green). No new colours, radii, shadows or timings. **Worth confirming
against the original comps.**

---

## Structure

```
src/
├── app/                      routes (App Router)
│   ├── page.tsx              /
│   ├── products/             /products
│   ├── why-skp/              /why-skp
│   ├── solar-calculator/     /solar-calculator
│   ├── the-book/             /the-book
│   ├── contact/              /contact
│   ├── api/leads/route.ts    lead intake
│   ├── sitemap.ts robots.ts not-found.tsx layout.tsx
├── components/
│   ├── layout/               Header · Footer · WhatsAppFab · SkipLink · SiteMotion
│   ├── ui/                   Button set · Icon · SectionHeading · Counter · AmbientOrb
│   ├── sections/             Faq · FinalCta · ValueCards
│   ├── forms/                Field · EnquiryForm
│   ├── home/ products/ why-skp/ calculator/ book/ contact/
├── content/                  all copy + collections (the CMS boundary)
│   └── schemas.ts            Sanity content model
├── hooks/                    useReveal · useParallax · useCountUp · useTilt · …
├── lib/                      site.ts · routes.ts · seo.ts · leads.ts · calculator.ts
└── styles/
```

### De-duplication

The handoff (§4) flagged that `addWatch`/`runWatch`, `initParallax`, `initTilt`,
`runCount`, `initFaq` and `initNav` were copy-pasted into all six page logic
classes and should be lifted. They now exist once:

- reveal + parallax → `SiteMotion`, mounted once in the root layout, re-scanning
  on route change
- counters → `useCountUp` / `<Counter>`
- tilt → `useTilt`
- FAQ → `<Faq>`, shared by Home, Calculator and Contact
- nav → `<Header>`, with desktop and drawer rendering from one `navigation` array

---

## Two calculators, deliberately

They are **not** duplicates and must not be merged — they answer different
questions and publish different fineprint. Both are ported verbatim.

| | Homepage widget | `/solar-calculator` |
| --- | --- | --- |
| Function | `calculateRoi()` | `calculateReport()` |
| Inputs | bill, roof, tariff, state, property type | bill only |
| Cost/kW | ₹62k / ₹52k / ₹46k by type | ₹31,500 flat |
| Source | `initROI()` | "ROI calculator.xlsx" |

HANDOFF.md §8 lists client sign-off on these assumptions as outstanding.

---

## Leads

`POST /api/leads` replaces the `localStorage['skp_enquiries']` design stub.
It validates server-side with the same rules the approved forms used, then calls
`deliverLead()`. Set `LEAD_WEBHOOK_URL` to go live; until then leads are logged
and the success state still renders end to end.

---

## Sanity readiness

No Sanity dependency is installed. `src/content/schemas.ts` declares every
document type, its fields, where the content lives today and which TypeScript
interface a GROQ query must satisfy. Migration is per-type: create the schema,
write the query, swap one import. No component changes.

---

## Still needed from the client (HANDOFF.md §8)

- [ ] Real phone, WhatsApp and email — everything currently uses the
      `+91 90000 00000` / `hello@skpsolarworld.com` placeholders in `src/lib/site.ts`
- [ ] Verified office address
- [ ] Privacy Policy and Terms pages (intentionally not linked rather than linked to `#`)
- [ ] Signed-off calculator assumptions
- [ ] Licensed photography for the remaining placeholder slots
- [ ] Real video files (the lightbox shows poster frames — swap the `<Image>`
      in `VideoShowcase` for a `<video>` when they land)
- [ ] Real download documents (`downloads[].href` in `src/content/products.tsx`)
- [ ] GST/CIN details if they belong in the footer
- [ ] Confirm the `.fbtn-*` styles described above
