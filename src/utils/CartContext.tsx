import React, { createContext, useState, useContext } from "react";
import type { Product } from "../types/Product";
import type { ReactNode } from "react";

interface CartItem {
	product: Product;
	quantity: number;
}

interface CartContextType {
	cartItems: CartItem[];
	totalItems: number;
	totalPrice: number;
	addToCart: (product: Product, quantity?: number) => void;
	removeFromCart: (productId: number) => void;
	updateQuantity: (productId: number, quantity: number) => void;
	clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
	cartItems: [],
	totalItems: 0,
	totalPrice: 0,
	addToCart: () => {},
	removeFromCart: () => {},
	updateQuantity: () => {},
	clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
	children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	// Рассчитываем общее количество товаров
	const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

	// Рассчитываем общую стоимость
	const totalPrice = cartItems.reduce((total, item) => {
		const price = item.product.oldPrice
			? item.product.price < item.product.oldPrice
				? item.product.price
				: item.product.oldPrice
			: item.product.price;
		return total + price * item.quantity;
	}, 0);

	// Добавить товар в корзину
	const addToCart = (product: Product, quantity: number = 1) => {
		setCartItems((prevItems) => {
			// Проверяем, есть ли товар уже в корзине
			const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

			if (existingItemIndex !== -1) {
				// Если товар уже в корзине, увеличиваем количество
				const updatedItems = [...prevItems];
				updatedItems[existingItemIndex].quantity += quantity;
				return updatedItems;
			} else {
				// Если товара нет в корзине, добавляем новый
				return [...prevItems, { product, quantity }];
			}
		});
	};

	// Удалить товар из корзины
	const removeFromCart = (productId: number) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
	};

	// Обновить количество товара
	const updateQuantity = (productId: number, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}

		setCartItems((prevItems) =>
			prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
		);
	};

	// Очистить корзину
	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				totalItems,
				totalPrice,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
