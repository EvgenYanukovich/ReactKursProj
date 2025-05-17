import { FC, useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import { useCart } from "../../utils/CartContext";
import SearchBar from "../common/SearchBar";
import ThemeToggle from "../common/ThemeToggle";

const Header: FC = () => {
	const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
	const { totalItems } = useCart();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const toggleProfileMenu = () => {
		setProfileMenuOpen(!profileMenuOpen);
	};

	// Закрытие выпадающего меню при клике вне его
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
				setProfileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="bg-[var(--bg-body)] shadow-md">
			<div className="container mx-auto px-4 py-4">
				<div className="flex justify-between items-center">
					{/* Логотип */}
					<Link to="/" className="flex items-center">
						<div className="text-[var(--text-secondary)] text-2xl font-bold flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 mr-2"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12 2c-5.33 4-10 6.67-10 12a10 10 0 0 0 20 0c0-5.33-4.67-8-10-12zm-2.67 14.86c-.89 0-1.66-.71-1.66-1.57 0-.86.75-1.43 1.64-1.43.89 0 1.66.57 1.66 1.43 0 .86-.75 1.57-1.64 1.57zm4.66-1.57c0 .86.75 1.57 1.64 1.57.89 0 1.66-.71 1.66-1.57 0-.86-.75-1.43-1.64-1.43-.89 0-1.66.57-1.66 1.43z" />
							</svg>
							Paws&Claws
						</div>
					</Link>

					{/* Строка поиска */}
					<div className="hidden lg:flex relative w-1/3">
						<SearchBar />
					</div>

					{/* Навигация для десктопа */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/catalog"
							className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Каталог
						</Link>
						<Link
							to="/sales"
							className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Акции
						</Link>
						<Link
							to="/blog"
							className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Блог
						</Link>
						<Link
							to="/contacts"
							className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Контакты
						</Link>
					</nav>

					{/* Кнопки авторизации, корзины и темы */}
					<div className="flex items-center space-x-2">
						{/* Переключатель темы */}
						<div className="mr-2">
							<ThemeToggle />
						</div>

						<Link
							to="/cart"
							className="text-[var(--text-primary)] hover:text-[var(--accent-color)]"
						>
							<div className="relative">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								{totalItems > 0 && (
									<span className="absolute -top-1 -right-1 bg-[var(--accent-color)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
										{totalItems}
									</span>
								)}
							</div>
						</Link>

						{isAuthenticated ? (
							<div className="relative" ref={profileMenuRef}>
								<button
									className="flex items-center text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
									onClick={toggleProfileMenu}
								>
									<span className="mr-1">{currentUser?.name}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>

								{profileMenuOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-[var(--bg-color)] rounded-md shadow-lg py-1 z-30">
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
										>
											Мой профиль
										</Link>
										<Link
											to="/orders"
											className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
										>
											Мои заказы
										</Link>
										<Link
											to="/favorites"
											className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
										>
											Избранное
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
										>
											Выйти
										</button>
									</div>
								)}
							</div>
						) : (
							<div className="hidden md:flex items-center space-x-2">
								<Link
									to="/login"
									className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
								>
									Войти
								</Link>
								<span className="text-[var(--text-secondary)]">|</span>
								<Link
									to="/register"
									className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
								>
									Регистрация
								</Link>
							</div>
						)}

						{/* Кнопка мобильного меню */}
						<button
							onClick={toggleMobileMenu}
							className="md:hidden text-[var(--text-primary)] hover:text-[var(--accent-color)]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Мобильное меню */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 py-2 border-t border-[var(--border-color)]">
						{/* Поиск в мобильном меню */}
						<div className="py-2">
							<SearchBar />
						</div>
						<Link
							to="/"
							className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Главная
						</Link>
						<Link
							to="/catalog"
							className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Каталог
						</Link>
						<Link
							to="/sales"
							className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Акции
						</Link>
						<Link
							to="/blog"
							className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Блог
						</Link>
						<Link
							to="/contacts"
							className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
						>
							Контакты
						</Link>

						{!isAuthenticated && (
							<div className="pt-2 border-t border-[var(--border-color)] mt-2">
								<Link
									to="/login"
									className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
								>
									Войти
								</Link>
								<Link
									to="/register"
									className="block py-2 text-[var(--text-primary)] hover:text-[var(--accent-color)] font-medium"
								>
									Регистрация
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
