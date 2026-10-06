import type { CSSProperties } from 'react';
import { perfumeCatalog } from '../data/catalog';
import type { Ml } from '../types';
import { formatPrice, priceFor } from '../utils/format';

const minPrice = (ml: Ml) => Math.min(...perfumeCatalog.map((p) => priceFor(p, ml)));

// `scale` es el alto real de cada atomizador respecto al de 10 ml, para que se vean a escala
const sizes = [
  { ml: 3, from: minPrice(3), scale: 270 / 480, delay: '0.1s' },
  { ml: 5, from: minPrice(5), scale: 339 / 480, delay: '0.25s' },
  { ml: 10, from: minPrice(10), scale: 1, delay: '0.4s' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="relative mx-auto grid max-w-6xl items-end gap-12 px-4 pt-14 pb-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-24 md:pb-20">
        <div className="max-w-xl md:pb-6">
          <h1 className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-[3.5rem]">
            Decants premium de diseñador y árabes
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Descubre fragancias exclusivas en formatos de prueba. Úsalas por días antes de decidir si vale el frasco
            completo.
          </p>
          <a
            href="#catalogo"
            className="mt-8 inline-flex items-center rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-deep"
          >
            Explorar catálogo
          </a>
        </div>

        <figure
          className="mx-auto grid w-fit grid-cols-[repeat(3,minmax(6.5rem,auto))] [--shelf:11rem] sm:[--shelf:15rem]"
          aria-label="Formatos disponibles: 3, 5 y 10 ml"
        >
          {/* fila 1: los atomizadores sobre una misma repisa, a escala real */}
          {sizes.map((s) => (
            <div key={s.ml} className="flex h-(--shelf) items-end justify-center border-b border-gold/40 px-5 sm:px-8">
              <img
                src={`/decants/${s.ml}ml.png`}
                alt=""
                className="vial-rise w-auto drop-shadow-[0_8px_18px_rgba(212,175,55,0.18)]"
                style={{ height: `calc(var(--shelf) * ${s.scale})`, animationDelay: s.delay } as CSSProperties}
              />
            </div>
          ))}
          {/* fila 2: tamaño y precio mínimo */}
          {sizes.map((s) => (
            <div key={s.ml} className="pt-4 text-center">
              <p className="font-display text-2xl font-semibold">
                {s.ml}
                <span className="pl-0.5 text-base font-medium text-muted">ml</span>
              </p>
              <p className="mt-0.5 text-xs text-muted">desde {formatPrice(s.from)}</p>
            </div>
          ))}
        </figure>
      </div>
    </section>
  );
}
