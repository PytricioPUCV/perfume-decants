import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SearchBar } from './SearchBar';
import { INSTAGRAM_URL, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { WHATSAPP_PHONE } from '../utils/whatsappFormatter';

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function Header({ query, onQueryChange }: HeaderProps) {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Decants del Puerto, ir al inicio">
          <img src="/logo.png" alt="" className="size-10" />
          <span className="font-display text-[0.95rem] leading-tight font-semibold tracking-[0.08em] sm:text-base">
            DECANTS
            <span className="block text-[0.7rem] font-medium tracking-[0.28em] text-gold sm:inline sm:pl-1.5 sm:text-base sm:tracking-[0.08em]">
              DEL PUERTO
            </span>
          </span>
        </a>

        <SearchBar value={query} onChange={onQueryChange} className="hidden flex-1 md:block md:max-w-md md:mx-auto" />

        <nav aria-label="Contacto" className="ml-auto flex items-center gap-1 md:ml-0">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de Decants del Puerto"
            className="grid size-10 place-items-center rounded-md text-muted hover:text-paper"
          >
            <InstagramIcon className="size-5" />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir por WhatsApp"
            className="grid size-10 place-items-center rounded-md text-muted hover:text-paper"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
            className="relative grid size-10 place-items-center rounded-md text-paper hover:text-gold"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="cart-bump absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.7rem] leading-5 font-semibold text-ink"
              >
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBar value={query} onChange={onQueryChange} />
      </div>
    </header>
  );
}
