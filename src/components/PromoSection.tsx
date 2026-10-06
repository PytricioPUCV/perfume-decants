import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPerfumeById, promosCatalog } from '../data/catalog';
import { useCart } from '../context/CartContext';
import type { Perfume, Promo } from '../types';
import { formatPrice, priceFor } from '../utils/format';
import { PerfumeImage } from './PerfumeImage';

function PromoCard({ promo }: { promo: Promo }) {
  const { addPromoToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  const perfumes = promo.perfumes.map(getPerfumeById).filter((p): p is Perfume => Boolean(p));
  const separatePrice = perfumes.reduce((sum, p) => sum + priceFor(p, 5), 0);
  const savings = separatePrice - promo.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gold/35 bg-card shadow-lg">
      {promo.image && (
        // El afiche ya trae el sello "Nuevo ingreso"; se abre completo en otra pestaña
        <a href={promo.image} target="_blank" rel="noreferrer" aria-label={`Ver afiche completo de ${promo.name}`}>
          <img
            src={promo.image}
            alt={`Afiche de ${promo.name}`}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover object-top"
          />
        </a>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug font-semibold">{promo.name}</h3>
          {!promo.image && (
            <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
              {promo.badge}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-muted">{promo.description}</p>

        {promo.image ? (
          <p className="mt-3 text-sm text-paper/90">
            <span className="text-muted">Incluye </span>
            {perfumes.map((p) => p.name).join(', ')}
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-3 gap-2" aria-label="Perfumes incluidos">
            {perfumes.map((p) => (
              <li key={p.id}>
                <PerfumeImage perfume={p} className="aspect-square rounded-md" vialClassName="h-1/2 w-auto" />
                <p className="mt-1.5 text-xs leading-snug text-paper/90">{p.name}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="font-display text-2xl font-semibold">{formatPrice(promo.price)}</p>
              <p className="text-sm text-muted">3 decants de 5 ml</p>
            </div>
            {savings > 0 && (
              <p className="text-right text-xs">
                <span className="block text-muted line-through">
                  <span className="sr-only">Por separado: </span>
                  {formatPrice(separatePrice)}
                </span>
                <span className="text-gold">Ahorras {formatPrice(savings)}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              addPromoToCart(promo);
              setJustAdded(true);
            }}
            className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              justAdded ? 'bg-gold/15 text-gold' : 'bg-gold text-ink hover:bg-gold-deep'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Pack agregado
              </>
            ) : (
              'Agregar pack al carrito'
            )}
          </button>
          <p className="sr-only" aria-live="polite">
            {justAdded ? `${promo.name} agregado al carrito` : ''}
          </p>
        </div>
      </div>
    </article>
  );
}

export function PromoSection() {
  return (
    <section aria-labelledby="promos-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <h2 id="promos-title" className="font-display text-[2rem] leading-tight font-semibold">
        Packs para probar
      </h2>
      <p className="mt-2 max-w-xl text-muted">
        Tres decants de 5 ml elegidos para combinar, a menor precio que comprarlos por separado.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promosCatalog.slice(0, 3).map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </section>
  );
}
