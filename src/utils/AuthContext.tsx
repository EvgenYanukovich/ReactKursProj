import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { User, AuthContextType } from "./types";
import {
	addUser,
	getCurrentUser,
	getUserByEmail,
	removeCurrentUser,
	saveCurrentUser,
} from "./localStorage";

// Создаем контекст с начальным значением
export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	login: async () => false,
	register: async () => false,
	logout: () => {},
	isAuthenticated: false,
});

interface AuthProviderProps {
	children: ReactNode;
}

// Хук для удобного доступа к контексту аутентификации
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// При загрузке приложения проверяем, есть ли сохраненный пользователь
	useEffect(() => {
		const user = getCurrentUser();
		if (user) {
			setCurrentUser(user);
			setIsAuthenticated(true);
		}
	}, []);

	// Функция для регистрации пользователя
	const register = async (userData: Omit<User, "id">): Promise<boolean> => {
		try {
			// Проверяем, существует ли пользователь с таким email
			const existingUser = getUserByEmail(userData.email);
			if (existingUser) {
				return false; // Пользователь уже существует
			}

			// Добавляем нового пользователя
			const newUser = addUser(userData);
			setCurrentUser(newUser);
			setIsAuthenticated(true);
			saveCurrentUser(newUser);

			return true;
		} catch (error) {
			console.error("Ошибка при регистрации:", error);
			return false;
		}
	};

	// Функция для входа пользователя
	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const user = getUserByEmail(email);

			if (!user || user.password !== password) {
				return false; // Неверные учетные данные
			}

			setCurrentUser(user);
			setIsAuthenticated(true);
			saveCurrentUser(user);

			return true;
		} catch (error) {
			console.error("Ошибка при входе:", error);
			return false;
		}
	};

	// Функция для выхода пользователя
	const logout = () => {
		setCurrentUser(null);
		setIsAuthenticated(false);
		removeCurrentUser();
	};

	const value = {
		currentUser,
		login,
		register,
		logout,
		isAuthenticated,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
