import { Product } from "../types/Product";
import productsJson from "./products.json";

// Импортируем все товары из JSON файла
export const products: Product[] = productsJson as Product[];

// Функция для получения товара по ID
export const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
};

// Функция для получения похожих товаров
export const getRelatedProducts = (currentProductId: number, category: string, petType: string, limit: number = 4): Product[] => {
    return products
        .filter(product =>
            product.id !== currentProductId &&
            (product.category === category || product.petType === petType)
        )
        .slice(0, limit);
};

// Функция для поиска товаров
export const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.petType.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    );
};

// Функция для фильтрации товаров
export const filterProducts = (filters: {
    category?: string;
    petType?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isNew?: boolean;
    isSale?: boolean;
}): Product[] => {
    return products.filter(product => {
        if (filters.category && product.category !== filters.category) return false;
        if (filters.petType && product.petType !== filters.petType) return false;
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.maxPrice && product.price > filters.maxPrice) return false;
        if (filters.inStock && !product.inStock) return false;
        if (filters.isNew && !product.isNew) return false;
        if (filters.isSale && !product.isSale) return false;
        return true;
    });
};