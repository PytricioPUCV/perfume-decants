import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { BRANDS, GENDERS, SEASONS, perfumeCatalog } from '../data/catalog';
import { CYBER } from '../data/offers';
import type { Filters as FiltersState } from '../types';

interface FiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  onClear: () => void;
}

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  isAvailable = () => true,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  isAvailable?: (value: T) => boolean;
}) {
  return (
    <div role="group" aria-label={label} className="grid gap-2 sm:grid-cols-[6rem_1fr] sm:items-baseline">
      <p className="text-sm text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          const available = isAvailable(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              disabled={!available}
              title={available ? undefined : 'Aún no hay perfumes en esta categoría'}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? 'border-gold bg-gold font-medium text-ink'
                  : 'border-line text-paper/90 enabled:hover:border-gold/60'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Filters({ filters, onChange, onClear }: FiltersProps) {
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const activeCount =
    filters.brands.length + filters.genders.length + filters.seasons.length + (filters.cyberOnly ? 1 : 0);

  return (
    <div className="border-y border-line py-5">
      <button
        type="button"
        onClick={() => setOpenOnMobile((v) => !v)}
        aria-expanded={openOnMobile}
        aria-controls="filter-groups"
        className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm md:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filtros{activeCount > 0 && ` (${activeCount})`}
      </button>

      <div id="filter-groups" className={`mt-4 flex-col gap-4 ${openOnMobile ? 'flex' : 'hidden'} md:mt-0 md:flex`}>
        {CYBER.active && (
          <ChipGroup
            label="Ofertas"
            options={['Cyber'] as const}
            selected={filters.cyberOnly ? ['Cyber'] : []}
            onToggle={() => onChange({ ...filters, cyberOnly: !filters.cyberOnly })}
          />
        )}
        <ChipGroup
          label="Marca"
          options={BRANDS}
          selected={filters.brands}
          onToggle={(b) => onChange({ ...filters, brands: toggle(filters.brands, b) })}
        />
        <ChipGroup
          label="Género"
          options={GENDERS}
          selected={filters.genders}
          onToggle={(g) => onChange({ ...filters, genders: toggle(filters.genders, g) })}
          isAvailable={(g) => perfumeCatalog.some((p) => p.gender === g)}
        />
        <ChipGroup
          label="Estación"
          options={SEASONS}
          selected={filters.seasons}
          onToggle={(s) => onChange({ ...filters, seasons: toggle(filters.seasons, s) })}
        />
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="self-start text-sm text-gold underline-offset-4 hover:underline sm:ml-24"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
