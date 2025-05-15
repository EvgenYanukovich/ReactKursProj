import { FC, useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import { useCart } from "../../utils/CartContext";

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
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-4">
				<div className="flex justify-between items-center">
					{/* Логотип */}
					<Link to="/" className="flex items-center">
						<div className="text-orange-500 text-2xl font-bold flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 mr-2"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12 2c-5.33 4-10 6.67-10 12a10 10 0 0 0 20 0c0-5.33-4.67-8-10-12zm-2.67 14.86c-.89 0-1.66-.71-1.66-1.57 0-.86.75-1.43 1.64-1.43.89 0 1.66.57 1.66 1.43 0 .86-.75 1.57-1.64 1.57zm4.66-1.57c0 .86.75 1.57 1.64 1.57.89 0 1.66-.71 1.66-1.57 0-.86-.75-1.43-1.64-1.43-.89 0-1.66.57-1.66 1.43z" />
							</svg>
							Pets&Claws
						</div>
					</Link>

					{/* Строка поиска */}
					<div className="hidden lg:flex relative w-1/3">
						<input
							type="text"
							placeholder="Поиск..."
							className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
						<button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</div>

					{/* Навигация для десктопа */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/catalog"
							className="text-gray-700 hover:text-orange-500 font-medium"
						>
							Каталог
						</Link>
						<Link
							to="/sales"
							className="text-gray-700 hover:text-orange-500 font-medium"
						>
							Акции
						</Link>
						<Link
							to="/blog"
							className="text-gray-700 hover:text-orange-500 font-medium"
						>
							Блог
						</Link>
						<Link
							to="/contacts"
							className="text-gray-700 hover:text-orange-500 font-medium"
						>
							Контакты
						</Link>
					</nav>

					{/* Кнопки авторизации и корзины */}
					<div className="flex items-center space-x-2">
						<Link to="/cart" className="text-gray-700 hover:text-orange-500">
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
									<span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
										{totalItems}
									</span>
								)}
							</div>
						</Link>

						{isAuthenticated ? (
							<div className="relative" ref={profileMenuRef}>
								<button
									className="flex items-center text-gray-700 hover:text-orange-500 font-medium"
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
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Мой профиль
										</Link>
										<Link
											to="/orders"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Мои заказы
										</Link>
										<Link
											to="/favorites"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Избранное
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
									className="text-gray-700 hover:text-orange-500 font-medium"
								>
									Войти
								</Link>
								<span className="text-gray-400">|</span>
								<Link
									to="/register"
									className="text-gray-700 hover:text-orange-500 font-medium"
								>
									Регистрация
								</Link>
							</div>
						)}

						{/* Кнопка мобильного меню */}
						<button
							onClick={toggleMobileMenu}
							className="md:hidden text-gray-700 hover:text-orange-500"
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
					<div className="md:hidden mt-4 py-2 border-t border-gray-200">
						<Link
							to="/"
							className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
						>
							Главная
						</Link>
						<Link
							to="/catalog"
							className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
						>
							Каталог
						</Link>
						<Link
							to="/sales"
							className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
						>
							Акции
						</Link>
						<Link
							to="/blog"
							className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
						>
							Блог
						</Link>
						<Link
							to="/contacts"
							className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
						>
							Контакты
						</Link>

						{!isAuthenticated && (
							<div className="pt-2 border-t border-gray-200 mt-2">
								<Link
									to="/login"
									className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
								>
									Войти
								</Link>
								<Link
									to="/register"
									className="block py-2 text-gray-700 hover:text-orange-500 font-medium"
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
