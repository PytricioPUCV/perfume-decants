import { useDeferredValue, useMemo, useState } from 'react';
import { AboutSection } from '../components/AboutSection';
import { CartDrawer } from '../components/CartDrawer';
import { CyberBar, CyberSection } from '../components/CyberSection';
import { Filters } from '../components/Filters';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { PromoSection } from '../components/PromoSection';
import { perfumeCatalog } from '../data/catalog';
import { hasCyber } from '../data/offers';
import type { Filters as FiltersState } from '../types';
import { normalize } from '../utils/format';

const EMPTY_FILTERS: FiltersState = { brands: [], genders: [], seasons: [], cyberOnly: false };

export function Home() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    return perfumeCatalog.filter((p) => {
      if (filters.cyberOnly && !hasCyber(p)) return false;
      if (filters.brands.length &&!filters.brands.includes(p.brand)) return false;
      if (filters.genders.length && !filters.genders.includes(p.gender)) return false;
      if (filters.seasons.length && !p.season.some((s) => filters.seasons.includes(s))) return false;
      if (!terms.length) return true;
      const haystack = normalize([p.name, p.brand, ...p.notes].join(' '));
      return terms.every((t) => haystack.includes(t));
    });
  }, [deferredQuery, filters]);

  const resetAll = () => {
    setQuery('');
    setFilters(EMPTY_FILTERS);
  };

  const showCyberOffers = () => {
    setQuery('');
    setFilters({ ...EMPTY_FILTERS, cyberOnly: true });
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Ir al catálogo
      </a>
      <CyberBar onShowOffers={showCyberOffers} />
      <Header query={query} onQueryChange={setQuery} />

      <main>
        <Hero />
        <CyberSection onShowOffers={showCyberOffers} />
        <PromoSection />

        <section id="catalogo" aria-labelledby="catalog-title" className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="catalog-title" className="font-display text-[2rem] leading-tight font-semibold">
              Catálogo
            </h2>
            <p className="text-sm text-muted" aria-live="polite">
              {results.length} de {perfumeCatalog.length} perfumes
            </p>
          </div>

          <Filters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />

          <div className="mt-8">
            <ProductGrid perfumes={results} query={deferredQuery} onReset={resetAll} />
          </div>
        </section>

        <AboutSection />
      </main>

      <Footer />
      <CartDrawer />
    </>
  );
}
