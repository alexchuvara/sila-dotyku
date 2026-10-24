type EmblemProps = {
  className?: string;
  /** Accessible name. Omit when the emblem is decorative (e.g. next to the wordmark). */
  title?: string;
};

// Single-colour yin-yang with an outline ring (design option B).
// Colours come from theme tokens, so it follows light and dark mode.
export function Emblem({ className, title }: EmblemProps) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle r="41" className="stroke-primary fill-none" strokeWidth="4" />
      <path
        className="fill-primary"
        d="M0 -40 A40 40 0 0 1 0 40 A20 20 0 0 0 0 0 A20 20 0 0 1 0 -40 Z"
      />
      <circle cy="-20" r="6" className="fill-background" />
      <circle cy="20" r="6" className="fill-primary" />
    </svg>
  );
}
