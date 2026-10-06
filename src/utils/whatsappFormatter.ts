import type { CartItem } from '../types';
import { getPerfumeById } from '../data/catalog';
import { cyberDiscount, percent } from '../data/offers';
import { formatPrice, unitPrice } from './format';

export const WHATSAPP_PHONE = '56973178412';

const lineFor = (item: CartItem) => {
  const subtotal = formatPrice(unitPrice(item) * item.quantity);
  if (item.kind === 'perfume') {
    const discount = cyberDiscount(item.perfume, item.ml);
    const offer = discount > 0 ? `, Cyber -${percent(discount)}` : '';
    return `${item.perfume.name} (${item.ml}ml${offer}) - Cantidad: ${item.quantity} → ${subtotal}`;
  }
  const names = item.promo.perfumes.map((id) => getPerfumeById(id)?.name ?? id).join(', ');
  return `${item.promo.name} (3x5ml: ${names}) - Cantidad: ${item.quantity} → ${subtotal}`;
};

export const generateWhatsAppMessage = (cartItems: CartItem[]): string => {
  const total = cartItems.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
  return [
    'Hola, me gustaría hacer un pedido desde decantsdelpuerto.page',
    '',
    '📋 *MI PEDIDO:*',
    '',
    ...cartItems.map(lineFor),
    '',
    `💰 *TOTAL: ${formatPrice(total)}*`,
    '',
    '¿Confirman disponibilidad?',
  ].join('\n');
};

export const openWhatsApp = (message: string, phone: string = WHATSAPP_PHONE) => {
  // wa.me solo acepta dígitos, sin "+" ni espacios
  const digits = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
};
