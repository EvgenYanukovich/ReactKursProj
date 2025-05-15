import { Product } from "../types/Product";

// Объявление функций модуля
export function getProductById(id: number): Product | undefined;
export function getRelatedProducts(currentProductId: number, category: string, petType: string, limit?: number): Product[];
export function searchProducts(query: string): Product[];
export function filterProducts(filters: {
  category?: string;
  petType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}): Product[];

// Объявление массива товаров
export const products: Product[];
