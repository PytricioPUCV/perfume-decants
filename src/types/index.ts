export type Brand =
  | 'Lattafa'
  | 'Designer'
  | 'Giorgio Armani'
  | 'Jean Paul Gaultier'
  | 'Versace'
  | 'Valentino'
  | 'YSL'
  | 'Azzaro'
  | 'Armaf';

export type Season = 'Verano' | 'Primavera' | 'Otoño' | 'Invierno';
export type Gender = 'Masculino' | 'Femenino' | 'Unisex';
export type Ml = 3 | 5 | 10;

export interface Perfume {
  id: string;
  name: string;
  brand: Brand;
  image: string; // ruta relativa: /perfumes/slug.jpg
  notes: string[];
  season: Season[];
  gender: Gender;
  prices: {
    ml3: number;
    ml5: number;
    ml10: number;
  };
  status?: 'Nuevo' | 'Restock';
  description?: string;
}

export interface Promo {
  id: string;
  name: string;
  description: string;
  perfumes: string[]; // IDs de perfumes
  image?: string;
  price: number;
  format: '3x5ml';
  badge: 'Nuevo Ingreso';
}

export interface PerfumeCartItem {
  kind: 'perfume';
  perfume: Perfume;
  ml: Ml;
  quantity: number;
}

export interface PromoCartItem {
  kind: 'promo';
  promo: Promo;
  quantity: number;
}

export type CartItem = PerfumeCartItem | PromoCartItem;

export interface Filters {
  brands: Brand[];
  genders: Gender[];
  seasons: Season[];
  cyberOnly: boolean;
}
