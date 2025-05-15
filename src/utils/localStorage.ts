import { User } from './types';
import { Product } from '../types/Product';

// Ключи для localStorage
const USERS_KEY = 'petsclaws_users';
const CURRENT_USER_KEY = 'petsclaws_current_user';
const CART_KEY = 'petsclaws_cart';
const ORDERS_KEY = 'petsclaws_orders';
const FAVORITES_KEY = 'petsclaws_favorites';

// Получение списка пользователей
export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Сохранение списка пользователей
export const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Добавление нового пользователя
export const addUser = (user: Omit<User, 'id'>): User => {
    const users = getUsers();
    const newUser = {
        ...user,
        id: crypto.randomUUID()
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
};

// Получение пользователя по email
export const getUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find(user => user.email === email);
};

// Сохранение текущего пользователя
export const saveCurrentUser = (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Получение текущего пользователя
export const getCurrentUser = (): User | null => {
    const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
    return currentUserJson ? JSON.parse(currentUserJson) : null;
};

// Получение данных пользователя
export const getUserData = (): { id: string; name: string; email: string } | null => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
    };
};

// Удаление текущего пользователя (выход)
export const removeCurrentUser = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Сохранение корзины пользователя
export const saveCart = (userId: string, cartItems: CartItem[]): void => {
    const cartData = getCartData();
    cartData[userId] = cartItems;
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
};

// Получение всех данных корзин
export const getCartData = (): Record<string, CartItem[]> => {
    const cartJson = localStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : {};
};

// Получение корзины пользователя
export const getUserCart = (userId: string): CartItem[] => {
    const cartData = getCartData();
    return cartData[userId] || [];
};

// Очистка корзины пользователя
export const clearUserCart = (userId: string): void => {
    const cartData = getCartData();
    if (cartData[userId]) {
        delete cartData[userId];
        localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    }
};

// Тип для элемента корзины
export interface CartItem {
    product: Product;
    quantity: number;
}

// Тип для заказа
export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod: string;
    deliveryMethod: string;
    deliveryPrice: number;
    deliveryDate?: string;
    deliveryTime?: string;
}

// Сохранение заказа
export const saveOrder = (order: Omit<Order, 'id'>): Order => {
    const orders = getOrders();
    const newOrder = {
        ...order,
        id: crypto.randomUUID(),
    };
    
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    // Очищаем корзину пользователя после оформления заказа
    clearUserCart(order.userId);
    
    return newOrder;
};

// Получение всех заказов
export const getOrders = (): Order[] => {
    const ordersJson = localStorage.getItem(ORDERS_KEY);
    return ordersJson ? JSON.parse(ordersJson) : [];
};

// Получение заказов пользователя
export const getUserOrders = (userId: string): Order[] => {
    const orders = getOrders();
    return orders.filter(order => order.userId === userId);
};

// Получение заказа по ID
export const getOrderById = (orderId: string): Order | undefined => {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
};

// Функции для работы с избранными товарами

// Получение избранных товаров пользователя
export const getUserFavorites = (userId: string): Product[] => {
    const favoritesData = getFavoritesData();
    return favoritesData[userId] || [];
};

// Получение всех данных избранных товаров
export const getFavoritesData = (): Record<string, Product[]> => {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : {};
};

// Добавление товара в избранное
export const addToFavorites = (userId: string, product: Product): void => {
    const favoritesData = getFavoritesData();
    const userFavorites = favoritesData[userId] || [];
    
    // Проверяем, есть ли уже этот товар в избранном
    if (!userFavorites.some(item => item.id === product.id)) {
        userFavorites.push(product);
        favoritesData[userId] = userFavorites;
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData));
    }
};

// Удаление товара из избранного
export const removeFromFavorites = (userId: string, productId: number): void => {
    const favoritesData = getFavoritesData();
    const userFavorites = favoritesData[userId] || [];
    
    const updatedFavorites = userFavorites.filter(product => product.id !== productId);
    favoritesData[userId] = updatedFavorites;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData));
};

// Проверка, находится ли товар в избранном у пользователя
export const isInFavorites = (userId: string, productId: number): boolean => {
    const userFavorites = getUserFavorites(userId);
    return userFavorites.some(product => product.id === productId);
};

// Очистка избранного пользователя
export const clearUserFavorites = (userId: string): void => {
    const favoritesData = getFavoritesData();
    if (favoritesData[userId]) {
        delete favoritesData[userId];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData));
    }
};
