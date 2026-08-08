import Image from 'next/image';
import { book } from '@/content/book';
import { founder } from '@/content/home';

/**
 * `.cover-card` — the flat book cover used in the "Get Your Copy" panel.
 * Shares the `.bf-*` face styles with the 3D object's front face, so the two
 * always read as the same artwork.
 */
export function BookCover({ titleFontSize = 28 }: { titleFontSize?: number }) {
  return (
    <div className="cover-card">
      <Image
        className="bf-bg"
        src={book.cover}
        alt={`${book.title} book cover`}
        fill
        sizes="(max-width: 900px) 70vw, 300px"
      />
      <div className="bf-shade" />
      <div className="bf-in">
        <div className="bf-top">
          <div className="bf-emblem">S</div>
          <div className="bf-kicker">
            The Industrial
            <br />
            Solar Playbook
          </div>
        </div>
        <div className="bf-mid">
          <div className="bf-rule" />
          <div className="bf-title" style={{ fontSize: titleFontSize }}>
            Sun
            <br />
            Powered
            <br />
            Profit
          </div>
          <div className="bf-sub">
            Turn energy from your most unpredictable cost into a lasting strategic advantage.
          </div>
        </div>
        <div className="bf-author">
          <div className="nm">{founder.name}</div>
          <div className="rl">Industrial Entrepreneur</div>
        </div>
      </div>
      <div
        className="glare"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(118deg,rgba(255,255,255,.28) 0%,transparent 26%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />
    </div>
  );
}
