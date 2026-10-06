import { useState } from 'react';
import type { Perfume } from '../types';
import { Vial } from './Vial';

interface PerfumeImageProps {
  perfume: Perfume;
  className?: string;
  /** Tamaño del frasco de reemplazo cuando no hay foto */
  vialClassName?: string;
}

/** Foto del perfume; si aún no existe en /public/perfumes, muestra un frasco de reemplazo. */
export function PerfumeImage({ perfume, className = '', vialClassName = 'h-3/5 w-auto' }: PerfumeImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative grid place-items-center overflow-hidden bg-[#222] ${className}`}>
      {failed ? (
        <Vial
          fill={0.7}
          liquid="rgba(212,175,55,0.22)"
          glass="rgba(212,175,55,0.35)"
          cap="rgba(212,175,55,0.35)"
          className={vialClassName}
        />
      ) : (
        <img
          src={perfume.image}
          alt={`Frasco de ${perfume.name}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}
