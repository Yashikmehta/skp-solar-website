import type { ReactNode } from 'react';
import { Icon, WhatsAppIcon, type IconName } from '@/components/ui/Icon';
import { mailHref, siteSettings, telHref, waHref } from '@/lib/site';

interface ContactCardProps {
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Reveal delay utility, e.g. "dly2". */
  delay?: string;
}

/** `.gcard` — a single contact detail card. */
export function ContactCard({ icon, title, children, delay }: ContactCardProps) {
  return (
    <div className={`gcard reveal${delay ? ` ${delay}` : ''}`}>
      <div className="ic">
        <Icon name={icon} />
      </div>
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </div>
  );
}

/** `.gcards` — the full contact detail column beside the enquiry form. */
export function ContactCards() {
  return (
    <div className="gcards">
      <ContactCard icon="pin" title="Office Address" delay="dly2">
        {siteSettings.addressLines.map((line, index) => (
          <span key={line}>
            {line}
            {index < siteSettings.addressLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </ContactCard>

      <ContactCard icon="phone" title="Phone Number" delay="dly2">
        <a href={telHref}>{siteSettings.phoneDisplay}</a>
        <br />
        Sales &amp; site survey bookings
      </ContactCard>

      <ContactCard icon="mail" title="Email Address" delay="dly3">
        <a href={mailHref}>{siteSettings.email}</a>
        <br />
        Replies within one working day
      </ContactCard>

      <ContactCard icon="clock" title="Business Hours" delay="dly3">
        {siteSettings.hours}
        <br />
        {siteSettings.hoursNote}
      </ContactCard>

      <ContactCard icon="globe" title="Service Areas" delay="dly4">
        {siteSettings.areas}
      </ContactCard>

      <a href={waHref} className="gwa reveal dly4" target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        <span>
          <b>Chat on WhatsApp</b>
          <span>Typically replies within minutes</span>
        </span>
      </a>
    </div>
  );
}
