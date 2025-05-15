export interface Product {
    id: number;
    name: string;
    category: string;
    petType: string;
    price: number;
    oldPrice: number | null;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    isNew: boolean;
    isSale: boolean;
    description: string;
    features: string[];
    imageUrl: string;
    thumbnailUrl?: string | null;
}
