# How to change the site

**There is no separate mobile site.** One set of React components renders on
every device. CSS media queries change the *sizing and layout* at each screen
width. So most edits affect desktop and mobile at once — only sizing rules are
per-device.

Start the dev server and leave it running; every save hot-reloads instantly.

```bash
npm run dev
```

Then open http://localhost:3000 and use your browser's device toolbar
(**⌥⌘I** → the phone/tablet icon) to check both at the same time.

---

## Which file do I edit?

| I want to change… | Edit | Affects |
| --- | --- | --- |
| Wording, headings, list items, FAQ answers | `src/content/*` | both |
| Phone, email, WhatsApp, address, nav links | `src/lib/site.ts` · `src/lib/routes.ts` | both |
| Which sections appear, and in what order | `src/app/<route>/page.tsx` | both |
| Structure inside a section (add a card, reorder) | the component in `src/components/` | both |
| Colour, font, spacing, size **everywhere** | the base rule in the CSS | both |
| Colour, font, spacing, size **on phones only** | the same CSS, inside a `@media` block | mobile only |
| Page titles / meta descriptions | `export const metadata` in the page file | both |

---

## 1. Changing text

All copy lives in `src/content/`, separate from the markup, so you never have to
touch a component to fix a typo.

```
src/content/
├── home.ts          hero stats, value cards, founder, gallery, videos, testimonials
├── why-skp.ts       legacy cards, Waaree cards, process steps, industries
├── products.tsx     modules, flexible applications, inverters, comparison, downloads
├── calculator.tsx   why-use cards, how-it-works steps, trust cards, FAQ
├── book.tsx         chapters, story milestones, sample pages
├── faqs.tsx         Contact page FAQ
└── faqs-home.tsx    Homepage FAQ
```

Example — change a homepage stat:

```ts
// src/content/home.ts
export const heroStats: HeroStat[] = [
  { icon: 'statPanel', value: '500 kW', label: 'On our own factory roof first' },
  //                            ^^^^^^ edit here — updates desktop and mobile
```

Contact details are centralised so you change them **once**:

```ts
// src/lib/site.ts
phoneDisplay: '+91 90000 00000',   // shown to users
phone: '+919000000000',            // tel: link
whatsapp: '919000000000',          // wa.me link
email: 'hello@skpsolarworld.com',
```

Every phone number, WhatsApp button and mailto on all six pages reads from here.

---

## 2. Changing layout or styling

The CSS is split in two:

- **`src/styles/skp-system.css`** — the shared design system: header, nav, mobile
  drawer, buttons, section headings, FAQ, final CTA band, footer, WhatsApp
  button. Changing anything here changes it on **every page**.
- **`src/styles/pages/*.css`** — one file per page, for sections unique to that
  page. `home.css` only affects `/`, `products.css` only affects `/products`.

### Desktop first, then override for smaller screens

The base rule is the desktop/default. Media queries override it going down:

```css
/* base — this is desktop */
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }

/* at 900px and below — phones and small tablets */
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; gap: 8px; text-align: center; }
}
```

To change **only mobile**, edit inside the `@media` block.
To change **only desktop**, edit the base rule *and* make sure the media block
still overrides what you want it to.

### The breakpoints this design uses

| Width | What changes |
| --- | --- |
| **1180px** | nav gaps tighten |
| **1100px** | two-column sections start collapsing |
| **1000px** | desktop menu hides, hamburger appears |
| **900px** | hero and most grids go single-column, text centres |
| **760px** | main phone breakpoint — page padding 40px→18px, headings shrink, footer stacks |
| **680 / 560 / 460 / 380px** | progressively smaller phones |

`760px` is the one you'll use most for phone tweaks.

---

## 3. A worked example

Say the homepage headline is too large on phones.

1. It's on the homepage, so open `src/styles/pages/home.css`.
2. Find the base rule:
   ```css
   .hero h1 { font-size: clamp(2.6rem, 5vw, 4.4rem); ... }
   ```
   `clamp(min, preferred, max)` already scales it — often just lowering the
   first value is enough and needs no media query at all.
3. If you want phones specifically, find (or add) the `@media(max-width:760px)`
   block in that file and put the override there:
   ```css
   @media (max-width: 760px) {
     .hero h1 { font-size: 2.1rem; }
   }
   ```
4. Save. The browser reloads. Check both widths.

---

## Before you commit

```bash
npx tsc --noEmit    # catches TypeScript mistakes
npm run build       # catches anything that breaks the production build
```

Both should pass clean. If `npm run dev` ever throws `MODULE_NOT_FOUND`, it's
almost always because a `build` ran while `dev` was live — `rm -rf .next` and
restart.

---

## Two cautions

**The CSS is an approved design, ported verbatim.** `skp-system.css` and
`src/styles/pages/*.css` are byte-for-byte from the handoff. Small edits are
fine, but large rewrites will drift from what was signed off. The one file that
is *not* from the handoff is `skp-system-gaps.css` — safe to change freely.

**Don't add a second breakpoint for the same thing.** If a rule already has a
`@media(max-width:760px)` block in that file, put your override inside it rather
than adding another block lower down — otherwise the two fight and whichever
comes last wins, which gets confusing fast.
