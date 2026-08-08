import { Icon } from '@/components/ui/Icon';
import type { FeatureCard } from '@/content/why-skp';

/**
 * `.leg-card` grid — shared by the Pabla Bearings heritage section and the
 * Waaree partnership section, which use the same card in the approved design
 * (`.leg-cards` and `.war-cards` differ only in their container).
 */
export function FeatureCardGrid({
  cards,
  className,
}: {
  cards: FeatureCard[];
  className: 'leg-cards' | 'war-cards';
}) {
  return (
    <div className={className}>
      {cards.map((card, index) => (
        <div className={`leg-card reveal dly${index + 1}`} key={card.title}>
          <div className="ic">
            <Icon name={card.icon} />
          </div>
          <h4>{card.title}</h4>
          <p>{card.body}</p>
        </div>
      ))}
    </div>
  );
}
