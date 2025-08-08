export interface Product {
  id: string;
  title: string;
  price: number;
  photo_id: string;
  photos: string[];
  description: string;
  basalamUrl: string;
  createdAt: string; // ISO string
}

export interface SimilarProduct {
  id: string;
  title: string;
  price: number;
  photo_id: string;
  isCompetitor: boolean;
  basalamUrl?: string;
}

export type SimilarsByProductId = Record<string, SimilarProduct[]>;

export interface ShopData {
  my_products: Product[];
  other_products: Product[];
  similars: SimilarsByProductId;
}


