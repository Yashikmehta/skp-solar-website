import type { Config } from 'tailwindcss';

/**
 * The approved design lives in `src/styles/skp-system.css` and the per-page
 * stylesheets. Tailwind is configured here with the *same* tokens so that any
 * new UI written after handoff stays on the system — it is deliberately NOT
 * used to re-express the approved styles (that would risk visual drift).
 *
 * Preflight is disabled because skp-system.css ships its own reset; running
 * both would change the approved rendering.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        navy: 'var(--navy)',
        gold: 'var(--gold)',
        'gold-bright': 'var(--gold-bright)',
        green: 'var(--green)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        bg1: 'var(--bg1)',
        bg2: 'var(--bg2)',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'Sora', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
        card: '18px',
        'card-lg': '24px',
        inner: '16px',
        chip: '12px',
      },
      boxShadow: {
        rest: '0 1px 3px rgba(14,26,60,.05)',
        hover: '0 24px 52px rgba(14,26,60,.15)',
        panel: '0 22px 50px rgba(14,26,60,.22)',
      },
      maxWidth: {
        wrap: '1280px',
      },
      screens: {
        // The design's breakpoints are max-width based; mirrored here as
        // min-width equivalents for any new mobile-first work.
        xs: '380px',
        sm: '560px',
        md: '760px',
        lg: '1000px',
        xl: '1180px',
        '2xl': '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
