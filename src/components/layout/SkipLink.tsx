/**
 * Skip link — first focusable element on every page, pairing with the
 * `<main id="main">` landmark (HANDOFF.md §6.6).
 */
export function SkipLink() {
  return (
    <a className="skip" href="#main">
      Skip to content
    </a>
  );
}
