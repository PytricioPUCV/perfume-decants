import type { Perfume } from '../types';
import { ProductCard } from './ProductCard';
import { Vial } from './Vial';

interface ProductGridProps {
  perfumes: Perfume[];
  query: string;
  onReset: () => void;
}

export function ProductGrid({ perfumes, query, onReset }: ProductGridProps) {
  if (perfumes.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <Vial fill={0} glass="var(--color-line)" cap="var(--color-line)" className="h-20 w-auto" />
        <p className="mt-6 font-display text-xl">
          {query ? `Ningún perfume coincide con «${query}»` : 'Ningún perfume coincide con estos filtros'}
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Prueba con otra nota o marca, o quita algún filtro. Si buscas algo que no está, pregúntanos por WhatsApp.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-md border border-gold px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
        >
          Ver todo el catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {perfumes.map((perfume) => (
        <ProductCard key={perfume.id} perfume={perfume} />
      ))}
    </div>
  );
}
