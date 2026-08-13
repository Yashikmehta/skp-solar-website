import Image from 'next/image';
import { book } from '@/content/book';

/**
 * `.cover-card` — the flat book cover used in the "Get Your Copy" panel.
 * Uses the same front-cover artwork as the 3D book object.
 */
export function BookCover() {
  return (
    <div className="cover-card">
      <Image
        className="bf-bg"
        src={book.cover}
        alt={`${book.title} book cover`}
        fill
        sizes="(max-width: 900px) 70vw, 300px"
        style={{ objectFit: 'cover' }}
      />
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
