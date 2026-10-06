import { Check, Mars, Venus, VenusAndMars } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import type { Gender, Ml, Perfume, Season } from '../types';
import { useCart } from '../context/CartContext';
import { cyberDiscount, percent } from '../data/offers';
import { basePriceFor, formatPrice, priceFor } from '../utils/format';
import { PerfumeImage } from './PerfumeImage';
import { SizeSelector } from './SizeSelector';

const GENDER_ICON: Record<Gender, typeof Mars> = {
  Masculino: Mars,
  Femenino: Venus,
  Unisex: VenusAndMars,
};

export const SEASON_STYLE: Record<Season, string> = {
  Verano: 'text-verano border-verano/30 bg-verano/10',
  Primavera: 'text-primavera border-primavera/30 bg-primavera/10',
  Otoño: 'text-otono border-otono/30 bg-otono/10',
  Invierno: 'text-invierno border-invierno/30 bg-invierno/10',
};

const VISIBLE_NOTES = 3;

export const ProductCard = memo(function ProductCard({ perfume }: { perfume: Perfume }) {
  const { addToCart } = useCart();
  const [ml, setMl] = useState<Ml>(5);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  const GenderIcon = GENDER_ICON[perfume.gender];
  const extraNotes = perfume.notes.length - VISIBLE_NOTES;
  const maxDiscount = Math.max(...([3, 5, 10] as Ml[]).map((size) => cyberDiscount(perfume, size)));
  const discount = cyberDiscount(perfume, ml);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-card shadow-lg">
      <div className="relative">
        <PerfumeImage perfume={perfume} className="aspect-square" />
        {perfume.status && (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
              perfume.status === 'Nuevo' ? 'bg-gold text-ink' : 'border border-gold bg-ink/80 text-gold'
            }`}
          >
            {perfume.status}
          </span>
        )}
        {maxDiscount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-cyber px-3 py-1 text-xs font-semibold text-white shadow-md">
            Cyber hasta -{percent(maxDiscount)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-sm text-muted">{perfume.brand}</p>
          <h3 className="mt-0.5 font-display text-xl leading-snug font-semibold">{perfume.name}</h3>
          {perfume.description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{perfume.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="mr-1 inline-flex items-center gap-1 text-paper/90">
            <GenderIcon className="size-3.5 text-muted" aria-hidden="true" />
            {perfume.gender}
          </span>
          {perfume.season.map((s) => (
            <span key={s} className={`rounded-full border px-2.5 py-0.5 ${SEASON_STYLE[s]}`}>
              {s}
            </span>
          ))}
        </div>

        <ul className="flex flex-wrap gap-1.5 text-xs" aria-label="Notas principales">
          {perfume.notes.slice(0, VISIBLE_NOTES).map((note) => (
            <li key={note} className="rounded-full border border-line px-2.5 py-0.5 text-paper/85">
              {note}
            </li>
          ))}
          {extraNotes > 0 && (
            <li className="px-1 py-0.5 text-muted" title={perfume.notes.slice(VISIBLE_NOTES).join(', ')}>
              +{extraNotes} {extraNotes === 1 ? 'nota' : 'notas'}
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-col gap-4 pt-1">
          <SizeSelector perfume={perfume} value={ml} onChange={setMl} />

          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite">
              <span className="font-display text-2xl font-semibold">{formatPrice(priceFor(perfume, ml))}</span>
              <span className="sr-only"> por {ml} ml</span>
              {discount > 0 && (
                <span className="block text-xs">
                  <span className="text-muted line-through">
                    <span className="sr-only">Antes </span>
                    {formatPrice(basePriceFor(perfume, ml))}
                  </span>
                  <span className="pl-1.5 text-cyber-soft">Cyber -{percent(discount)}</span>
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                addToCart(perfume, ml, 1);
                setJustAdded(true);
              }}
              className={`inline-flex min-w-40 items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                justAdded ? 'bg-gold/15 text-gold' : 'bg-gold text-ink hover:bg-gold-deep'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  Agregado
                </>
              ) : (
                'Agregar al carrito'
              )}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {justAdded ? `${perfume.name} de ${ml} ml agregado al carrito` : ''}
          </p>
        </div>
      </div>
    </article>
  );
});
