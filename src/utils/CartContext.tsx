import { ReactNode, createContext, useState, useContext, FC, useEffect } from "react";
import { Product } from "../types/Product";
import { CartItem, saveCart, getUserCart, clearUserCart } from "./localStorage";
import { AuthContext } from "./AuthContext";

// Используем тип CartItem из localStorage.ts

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

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
	const { currentUser } = useContext(AuthContext);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const GUEST_CART_KEY = 'petsclaws_guest_cart';
	
	// Загружаем корзину при инициализации и при входе/выходе пользователя
	useEffect(() => {
		if (currentUser) {
			// Если пользователь авторизован, загружаем его корзину
			const userCart = getUserCart(currentUser.id);
			
			// Если в корзине пользователя ничего нет, но есть гостевая корзина, переносим товары
			if (userCart.length === 0) {
				const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
				if (guestCartJson) {
					const guestCart = JSON.parse(guestCartJson);
					if (guestCart.length > 0) {
						saveCart(currentUser.id, guestCart);
						setCartItems(guestCart);
						// Очищаем гостевую корзину
						localStorage.removeItem(GUEST_CART_KEY);
						return;
					}
				}
			}
			setCartItems(userCart);
		} else {
			// Если пользователь не авторизован, загружаем гостевую корзину
			const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
			if (guestCartJson) {
				setCartItems(JSON.parse(guestCartJson));
			} else {
				setCartItems([]);
			}
		}
	}, [currentUser]);
	
	// Сохраняем корзину при изменении
	useEffect(() => {
		if (cartItems.length > 0) {
			if (currentUser) {
				// Если пользователь авторизован, сохраняем в его корзину
				saveCart(currentUser.id, cartItems);
			} else {
				// Если пользователь не авторизован, сохраняем в гостевую корзину
				localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
			}
		} else if (cartItems.length === 0) {
			// Если корзина пуста, удаляем соответствующие данные
			if (currentUser) {
				clearUserCart(currentUser.id);
			} else {
				localStorage.removeItem(GUEST_CART_KEY);
			}
		}
	}, [cartItems, currentUser]);

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
		if (currentUser) {
			clearUserCart(currentUser.id);
		} else {
			localStorage.removeItem(GUEST_CART_KEY);
		}
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
