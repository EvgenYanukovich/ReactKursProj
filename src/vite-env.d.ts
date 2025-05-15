/// <reference types="vite/client" />

// Объявления модулей для TypeScript
declare module "*.tsx" {
  import React from "react";
  const component: React.ComponentType<any>;
  export default component;
}

declare module "*.ts" {
  const content: any;
  export default content;
  export * from content;
}

declare module "../data/products" {
  import { Product } from "../types/Product";
  export const products: Product[];
  export function getProductById(id: number): Product | undefined;
  export function getRelatedProducts(currentProductId: number, category: string, petType: string, limit?: number): Product[];
  export function searchProducts(query: string): Product[];
  export function filterProducts(filters: any): Product[];
}

declare module "../components/common/StarRating" {
  import { FC } from "react";
  interface StarRatingProps {
    rating: number;
    size?: "sm" | "md" | "lg";
  }
  const StarRating: FC<StarRatingProps>;
  export default StarRating;
}

declare module "../components/product/ReviewList" {
  import { FC } from "react";
  interface ReviewListProps {
    productId: number;
  }
  const ReviewList: FC<ReviewListProps>;
  export default ReviewList;
}

declare module "../components/product/RelatedProducts" {
  import { FC } from "react";
  interface RelatedProductsProps {
    currentProductId: number;
    category: string;
    petType: string;
  }
  const RelatedProducts: FC<RelatedProductsProps>;
  export default RelatedProducts;
}
