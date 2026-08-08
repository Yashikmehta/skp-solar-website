import type { IconName } from '@/components/ui/Icon';

/**
 * Solutions collection (HANDOFF.md §5: name, blurb, icon, photo, tab).
 *
 * Data is identical to the `DATA` object inside `initSolutions()` on the
 * approved homepage — the switcher just reads it from here instead of a
 * literal buried in page logic.
 */

export interface SolutionItem {
  name: string;
  /** One-line blurb shown in the list, card and featured panel. */
  tag: string;
  icon: IconName;
  photo: string;
}

export interface SolutionTab {
  key: 'app' | 'prod';
  /** Label on the switcher button. */
  label: string;
  /** Heading shown in the intro column. */
  title: string;
  intro: string;
  items: SolutionItem[];
}

export const solutionTabs: SolutionTab[] = [
  {
    key: 'app',
    label: 'By Application',
    title: 'By Application',
    intro:
      'From factory rooftops to family homes, SKP engineers solar that fits the site — designed, installed and serviced by people who run plants themselves.',
    items: [
      {
        name: 'Residential',
        tag: 'Cut your home’s power bill with rooftop solar built to last decades.',
        icon: 'home',
        photo: '/assets/residential.jpg',
      },
      {
        name: 'Industrial',
        tag: 'Turn idle factory roofs across Punjab into round-the-clock savings.',
        icon: 'factory',
        photo: '/assets/industrial.jpg',
      },
      {
        name: 'Commercial',
        tag: 'Showrooms, warehouses and offices powered by clean daytime energy.',
        icon: 'building',
        photo: '/assets/commercial.jpg',
      },
      {
        name: 'Schools',
        tag: 'Lower campus running costs and power the next generation.',
        icon: 'cap',
        photo: '/assets/schools.jpg',
      },
    ],
  },
  {
    key: 'prod',
    label: 'By Product',
    title: 'By Product',
    intro:
      'Four solar systems, one standard of engineering — sized, wired and backed for the way you actually use power.',
    items: [
      {
        name: 'On-Grid Solar System',
        tag: 'Export surplus to the grid and watch your meter run backwards.',
        icon: 'grid',
        photo: '/assets/ongrid.jpg',
      },
      {
        name: 'Off-Grid Solar System',
        tag: 'Full independence with battery storage for sites beyond the grid.',
        icon: 'battery',
        photo: '/assets/offgrid.jpg',
      },
      {
        name: 'Hybrid Solar System',
        tag: 'Grid plus batteries — savings by day, backup when lines go down.',
        icon: 'hybrid',
        photo: '/assets/hybrid.jpg',
      },
      {
        name: 'Solar Water Pump',
        tag: 'Reliable solar pumping for farms and tube wells, fuel-free.',
        icon: 'drop',
        photo: '/assets/pump.jpg',
      },
    ],
  },
];

/** Zero-padded index label used by the featured chip and mobile cards. */
export const padIndex = (index: number) => `0${index + 1}`.slice(-2);
