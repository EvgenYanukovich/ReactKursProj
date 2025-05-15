import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { Product } from "../types/Product";
import { AuthContext } from "./AuthContext";
import { 
  getUserFavorites, 
  addToFavorites as addToFavoritesLS, 
  removeFromFavorites as removeFromFavoritesLS,
  isInFavorites as isInFavoritesLS
} from "./localStorage";

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isInFavorites: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isInFavorites: () => false,
  clearFavorites: () => {}
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { currentUser } = useContext(AuthContext);

  // Загружаем избранные товары при изменении пользователя
  useEffect(() => {
    if (currentUser) {
      const userFavorites = getUserFavorites(currentUser.id);
      setFavorites(userFavorites);
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  // Добавление товара в избранное
  const addToFavorites = (product: Product) => {
    if (!currentUser) {
      alert("Для добавления товара в избранное необходимо авторизоваться");
      return;
    }

    addToFavoritesLS(currentUser.id, product);
    setFavorites(prev => {
      // Проверяем, есть ли уже этот товар в избранном
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  // Удаление товара из избранного
  const removeFromFavorites = (productId: number) => {
    if (!currentUser) return;

    removeFromFavoritesLS(currentUser.id, productId);
    setFavorites(prev => prev.filter(product => product.id !== productId));
  };

  // Проверка, находится ли товар в избранном
  const isInFavorites = (productId: number): boolean => {
    if (!currentUser) return false;
    
    return isInFavoritesLS(currentUser.id, productId);
  };

  // Очистка избранного
  const clearFavorites = () => {
    if (!currentUser) return;
    
    // Очищаем избранное в localStorage
    const favoritesData = JSON.parse(localStorage.getItem("petsclaws_favorites") || "{}");
    if (favoritesData[currentUser.id]) {
      delete favoritesData[currentUser.id];
      localStorage.setItem("petsclaws_favorites", JSON.stringify(favoritesData));
    }
    
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Хук для использования контекста избранных товаров
export const useFavorites = () => useContext(FavoritesContext);
