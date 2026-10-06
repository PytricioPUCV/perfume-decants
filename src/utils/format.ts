import type { CartItem, Ml, Perfume } from '../types';
import { cyberDiscount } from '../data/offers';

export const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`;

/** Precio de lista, sin descuentos. */
export const basePriceFor = (perfume: Perfume, ml: Ml) =>
  ml === 3 ? perfume.prices.ml3 : ml === 5 ? perfume.prices.ml5 : perfume.prices.ml10;

/** Precio que se cobra, con la oferta Cyber aplicada si corresponde. */
export const priceFor = (perfume: Perfume, ml: Ml) =>
  Math.round(basePriceFor(perfume, ml) * (1 - cyberDiscount(perfume, ml)));

export const unitPrice = (item: CartItem) =>
  item.kind === 'perfume' ? priceFor(item.perfume, item.ml) : item.promo.price;

export const cartKey = (item: CartItem) =>
  item.kind === 'perfume' ? `${item.perfume.id}-${item.ml}` : item.promo.id;

/** Quita tildes y pasa a minúsculas para que "ambar" encuentre "ámbar". */
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
