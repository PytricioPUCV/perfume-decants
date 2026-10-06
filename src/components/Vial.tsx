interface VialProps {
  /** Nivel de llenado, de 0 a 1 */
  fill: number;
  liquid?: string;
  glass?: string;
  cap?: string;
  className?: string;
}

/** Frasco de decant con atomizador. viewBox 40×100. */
export function Vial({
  fill,
  liquid = 'var(--color-gold)',
  glass = 'var(--color-gold)',
  cap = 'var(--color-gold)',
  className,
}: VialProps) {
  const innerTop = 25;
  const innerBottom = 93;
  const height = (innerBottom - innerTop) * Math.min(Math.max(fill, 0), 1);

  return (
    <svg viewBox="0 0 40 100" className={className} aria-hidden="true">
      <rect x="14" y="2" width="12" height="11" rx="2" fill={cap} />
      <rect x="16.5" y="13" width="7" height="6" fill={cap} opacity="0.55" />
      <rect x="6" y="19" width="28" height="78" rx="6" fill="none" stroke={glass} strokeWidth="2" />
      <rect
        x="9"
        y={innerBottom - height}
        width="22"
        height={height}
        rx="3"
        fill={liquid}
      />
      {/* reflejo del vidrio */}
      <rect x="10.5" y="26" width="2" height="56" rx="1" fill="#fff" opacity="0.12" />
    </svg>
  );
}
