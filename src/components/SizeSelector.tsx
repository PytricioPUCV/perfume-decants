import type { Ml, Perfume } from '../types';
import { cyberDiscount, percent } from '../data/offers';
import { formatPrice, priceFor } from '../utils/format';
import { Vial } from './Vial';

const OPTIONS: { ml: Ml; fill: number }[] = [
  { ml: 3, fill: 0.32 },
  { ml: 5, fill: 0.55 },
  { ml: 10, fill: 0.95 },
];

interface SizeSelectorProps {
  perfume: Perfume;
  value: Ml;
  onChange: (ml: Ml) => void;
}

export function SizeSelector({ perfume, value, onChange }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">Tamaño del decant de {perfume.name}</legend>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ ml, fill }) => {
          const selected = ml === value;
          const discount = cyberDiscount(perfume, ml);
          return (
            <label
              key={ml}
              className={`relative flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                selected ? 'border-gold bg-gold/10' : 'border-line hover:border-muted/60'
              }`}
            >
              <input
                type="radio"
                name={`size-${perfume.id}`}
                value={ml}
                checked={selected}
                onChange={() => onChange(ml)}
                className="sr-only"
              />
              <Vial
                fill={fill}
                liquid={selected ? 'var(--color-gold)' : 'var(--color-muted)'}
                glass={selected ? 'var(--color-gold)' : 'var(--color-line)'}
                cap={selected ? 'var(--color-gold)' : 'var(--color-muted)'}
                className="h-8 w-auto shrink-0"
              />
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{ml} ml</span>
                <span className={`block text-xs ${selected ? 'text-gold' : 'text-muted'}`}>
                  {formatPrice(priceFor(perfume, ml))}
                </span>
              </span>
              {discount > 0 && (
                <span className="absolute -top-2 right-1.5 rounded-full bg-cyber px-1.5 text-[0.65rem] leading-4 font-semibold text-white">
                  <span className="sr-only">Cyber, descuento de </span>-{percent(discount)}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
