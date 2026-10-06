import { Search, X } from 'lucide-react';
import { useId } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className = '' }: SearchBarProps) {
  const id = useId();

  const scrollToCatalog = () =>
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });

  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        scrollToCatalog();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Buscar por perfume, marca o nota
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => {
          // Al empezar a escribir, lleva al catálogo para que se vean los resultados
          if (!value && e.target.value) scrollToCatalog();
          onChange(e.target.value);
        }}
        placeholder="Buscar perfume, marca o nota (vainilla, ámbar…)"
        autoComplete="off"
        className="w-full rounded-md border border-line bg-card py-2 pr-9 pl-9 text-sm text-paper placeholder:text-muted/80 focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Borrar búsqueda"
          className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted hover:text-paper"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}
