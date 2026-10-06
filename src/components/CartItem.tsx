import { Minus, Plus, Trash2 } from 'lucide-react';
import { getPerfumeById } from '../data/catalog';
import { cyberDiscount, percent } from '../data/offers';
import { useCart } from '../context/CartContext';
import type { CartItem as CartItemType, Perfume } from '../types';
import { cartKey, formatPrice, unitPrice } from '../utils/format';
import { PerfumeImage } from './PerfumeImage';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useCart();
  const key = cartKey(item);
  const price = unitPrice(item);
  const discount = item.kind === 'perfume' ? cyberDiscount(item.perfume, item.ml) : 0;

  const name = item.kind === 'perfume' ? item.perfume.name : item.promo.name;
  const detail =
    item.kind === 'perfume'
      ? `${item.ml} ml`
      : `3 × 5 ml: ${item.promo.perfumes.map((id) => getPerfumeById(id)?.name ?? id).join(', ')}`;
  const thumb: Perfume | undefined =
    item.kind === 'perfume' ? item.perfume : getPerfumeById(item.promo.perfumes[0]);

  return (
    <li className="flex gap-4 py-4">
      {thumb && (
        <PerfumeImage perfume={thumb} className="size-16 shrink-0 rounded-md" vialClassName="h-3/4 w-auto" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium leading-snug">{name}</p>
            <p className="mt-0.5 text-sm text-muted">
              {detail}
              {discount > 0 && <span className="pl-2 text-cyber-soft">Cyber -{percent(discount)}</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(key)}
            aria-label={`Eliminar ${name} del carrito`}
            className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-md text-muted hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-md border border-line" role="group" aria-label={`Cantidad de ${name}`}>
            <button
              type="button"
              onClick={() => updateQuantity(key, item.quantity - 1)}
              aria-label="Quitar uno"
              className="grid size-8 place-items-center text-muted hover:text-paper"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(key, item.quantity + 1)}
              aria-label="Agregar uno"
              className="grid size-8 place-items-center text-muted hover:text-paper"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <p className="text-right text-sm">
            {item.quantity > 1 && (
              <span className="block text-xs text-muted">
                {item.quantity} × {formatPrice(price)}
              </span>
            )}
            <span className="font-semibold tabular-nums">{formatPrice(price * item.quantity)}</span>
          </p>
        </div>
      </div>
    </li>
  );
}
