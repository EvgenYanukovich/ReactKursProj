import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	// Попробуем получить тему из localStorage или используем светлую тему по умолчанию
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem("theme");
		return (
			(savedTheme as Theme) ||
			(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light")
		);
	});

	// Функция для переключения темы
	const toggleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";
			localStorage.setItem("theme", newTheme);
			return newTheme;
		});
	};

	// Применяем тему к body при изменении
	useEffect(() => {
		document.body.dataset.theme = theme;
		localStorage.setItem("theme", theme);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Хук для использования темы в компонентах
export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme должен использоваться внутри ThemeProvider");
	}
	return context;
};
