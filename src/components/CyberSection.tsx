import { perfumeCatalog } from '../data/catalog';
import { CYBER, isDesigner, percent } from '../data/offers';
import { basePriceFor, formatPrice, priceFor } from '../utils/format';

interface CyberProps {
  onShowOffers: () => void;
}

const designerCount = perfumeCatalog.filter(isDesigner).length;

// El ejemplo con mayor ahorro en 10 ml, para mostrar el descuento con un precio real
const example = perfumeCatalog
  .filter(isDesigner)
  .map((p) => ({ perfume: p, before: basePriceFor(p, 10), after: priceFor(p, 10) }))
  .sort((a, b) => b.before - b.after - (a.before - a.after))[0];

/** Barra delgada sobre el header: lo primero que se ve al entrar. */
export function CyberBar({ onShowOffers }: CyberProps) {
  if (!CYBER.active) return null;
  return (
    <div className="bg-cyber px-4 py-2 text-center text-sm text-white">
      <strong className="font-semibold">Cyber:</strong> {percent(CYBER.discounts[10])} de descuento en 10 ml y{' '}
      {percent(CYBER.discounts[5])} en 5 ml de perfumes de diseñador.{' '}
      <button type="button" onClick={onShowOffers} className="font-semibold underline underline-offset-4">
        Ver ofertas
      </button>
    </div>
  );
}

export function CyberSection({ onShowOffers }: CyberProps) {
  if (!CYBER.active) return null;
  return (
    <section aria-labelledby="cyber-title" className="bg-cyber text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div className="max-w-lg">
          <h2 id="cyber-title" className="font-display text-[2rem] leading-tight font-semibold">
            Cyber en perfumes de diseñador
          </h2>
          <p className="mt-3 leading-relaxed text-white/85">
            Descuento en los {designerCount} perfumes de diseñador del catálogo. Los árabes y los packs mantienen su
            precio.
          </p>
          {example && (
            <p className="mt-3 text-sm text-white/85">
              Por ejemplo, {example.perfume.name} en 10 ml:{' '}
              <span className="line-through opacity-75">{formatPrice(example.before)}</span>{' '}
              <strong className="font-semibold text-white">{formatPrice(example.after)}</strong>
            </p>
          )}
          <button
            type="button"
            onClick={onShowOffers}
            className="mt-7 rounded-md bg-white px-6 py-3 font-semibold text-cyber transition-colors hover:bg-white/90"
          >
            Ver ofertas Cyber
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:gap-6">
          {([10, 5] as const).map((ml) => (
            <div key={ml} className="rounded-lg border border-white/25 px-6 py-5 text-center sm:px-8">
              <dt className="sr-only">Descuento en {ml} ml</dt>
              <dd>
                <span className="block font-display text-5xl font-semibold sm:text-6xl">
                  -{percent(CYBER.discounts[ml])}
                </span>
                <span className="mt-1 block text-sm text-white/85">en decants de {ml} ml</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
