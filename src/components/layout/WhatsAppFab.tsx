import { siteSettings, waHref } from '@/lib/site';
import { WhatsAppIcon } from '@/components/ui/Icon';

/**
 * Floating WhatsApp action — present on every page (HANDOFF.md §6.6; three of
 * the original pages had it wired to a dead `href="#"`).
 */
export function WhatsAppFab() {
  return (
    <a
      href={waHref}
      className="wa"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${siteSettings.name} on WhatsApp`}
    >
      <WhatsAppIcon />
    </a>
  );
}
