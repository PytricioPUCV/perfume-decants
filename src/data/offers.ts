import type { Brand, Ml, Perfume } from '../types';

/** Marcas árabes. Todo lo demás cuenta como perfume de diseñador. */
export const ARAB_BRANDS: Brand[] = ['Lattafa', 'Armaf'];

export const isDesigner = (perfume: Perfume) => !ARAB_BRANDS.includes(perfume.brand);

/**
 * Oferta Cyber: descuento por formato en perfumes de diseñador.
 * Para terminar la oferta, cambia `active` a false. Los precios base de catalog.ts no se tocan.
 */
export const CYBER = {
  active: true,
  discounts: { 3: 0, 5: 0.1, 10: 0.25 } as Record<Ml, number>,
};

/** Descuento (0 a 1) que aplica a este perfume y formato. */
export const cyberDiscount = (perfume: Perfume, ml: Ml) =>
  CYBER.active && isDesigner(perfume) ? CYBER.discounts[ml] : 0;

export const hasCyber = (perfume: Perfume) => ([3, 5, 10] as Ml[]).some((ml) => cyberDiscount(perfume, ml) > 0);

export const percent = (discount: number) => `${Math.round(discount * 100)}%`;
