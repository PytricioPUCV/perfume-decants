import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { cartKey, formatPrice } from '../utils/format';
import { generateWhatsAppMessage, openWhatsApp } from '../utils/whatsappFormatter';
import { WhatsAppIcon } from './BrandIcons';
import { CartItem } from './CartItem';
import { Vial } from './Vial';

export function CartDrawer() {
  const { cart, total, itemCount, isOpen, closeCart, clearCart } = useCart();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape para cerrar, foco dentro del panel y bloqueo del scroll de fondo
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus({ preventScroll: true });
      setConfirmingClear(false);
    };
  }, [isOpen, closeCart]);

  const sendOrder = () => openWhatsApp(generateWhatsAppMessage(cart));

  const browseCatalog = () => {
    closeCart();
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-line bg-ink shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="font-display text-xl font-semibold">
            Carrito de compras
            {itemCount > 0 && <span className="pl-2 font-sans text-sm font-normal text-muted">({itemCount})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="grid size-9 place-items-center rounded-md text-muted hover:text-paper"
          >
            <X className="size-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Vial fill={0} glass="var(--color-line)" cap="var(--color-line)" className="h-20 w-auto" />
            <p className="mt-6 font-display text-xl">Tu carrito está vacío</p>
            <p className="mt-2 text-sm text-muted">Elige un perfume y su tamaño para empezar tu pedido.</p>
            <button
              type="button"
              onClick={browseCatalog}
              className="mt-6 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-deep"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.map((item) => (
                <CartItem key={cartKey(item)} item={item} />
              ))}
            </ul>

            <div className="border-t border-line px-5 pt-4 pb-5">
              <div className="flex items-baseline justify-between">
                <p className="text-muted">Subtotal</p>
                <p className="font-display text-2xl font-semibold tabular-nums">{formatPrice(total)}</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                Te respondemos por WhatsApp para confirmar stock y coordinar la entrega. Pagas en efectivo o
                transferencia al recibir.
              </p>

              <button
                type="button"
                onClick={sendOrder}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-wa px-4 py-3 font-semibold text-ink hover:bg-wa-deep"
              >
                <WhatsAppIcon className="size-5" />
                Enviar pedido por WhatsApp
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 w-full rounded-md border border-line px-4 py-2.5 text-sm font-medium hover:border-muted/60"
              >
                Continuar comprando
              </button>

              <div className="mt-3 min-h-8 text-center text-sm" aria-live="polite">
                {confirmingClear ? (
                  <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                    <span className="text-muted">¿Vaciar el carrito?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmingClear(false);
                      }}
                      className="font-semibold text-danger underline-offset-4 hover:underline"
                    >
                      Sí, vaciar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingClear(false)}
                      className="text-muted underline-offset-4 hover:underline"
                    >
                      Cancelar
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(true)}
                    className="text-muted underline-offset-4 hover:text-paper hover:underline"
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
