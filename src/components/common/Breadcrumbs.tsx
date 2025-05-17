import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProductById } from "../../data/products";

// Структура для элемента хлебных крошек
interface BreadcrumbItem {
	name: string;
	path: string;
}

// Маппинг путей к названиям страниц
const pathNameMap: Record<string, string> = {
	"/": "Главная",
	"/catalog": "Каталог",
	"/sales": "Акции",
	"/blog": "Блог",
	"/contacts": "Контакты",
	"/profile": "Личный кабинет",
	"/orders": "Мои заказы",
	"/favorites": "Избранное",
	"/cart": "Корзина",
	"/product": "Товар",
	"/404": "Страница не найдена",
};

const Breadcrumbs: FC = () => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	
	// Проверяем, находимся ли мы на странице 404
	const is404Page = location.pathname === "/404" || location.pathname.includes("/404");

	// Состояние для хранения названия товара, если находимся на странице товара
	const [productName, setProductName] = useState<string>("");

	// Проверяем, находимся ли мы на странице товара
	useEffect(() => {
		if (pathnames.length >= 2 && pathnames[0] === "product" && !isNaN(Number(pathnames[1]))) {
			const productId = parseInt(pathnames[1]);
			const product = getProductById(productId);
			if (product) {
				setProductName(product.name);
			}
		}
	}, [pathnames]);

	// Функция для создания списка хлебных крошек
	const generateBreadcrumbs = (): BreadcrumbItem[] => {
		let breadcrumbs: BreadcrumbItem[] = [{ name: "Главная", path: "/" }];

		let currentPath = "";

		for (let i = 0; i < pathnames.length; i++) {
			currentPath += `/${pathnames[i]}`;

			// Особая обработка для страницы товара
			if (i === 1 && pathnames[0] === "product" && !isNaN(Number(pathnames[1])) && productName) {
				breadcrumbs.push({
					name: productName,
					path: currentPath,
				});
				continue;
			}

			// Получаем название страницы из маппинга или используем URL как запасной вариант
			const name =
				pathNameMap[currentPath] ||
				pathnames[i].charAt(0).toUpperCase() + pathnames[i].slice(1);

			breadcrumbs.push({
				name,
				path: currentPath,
			});
		}

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	// Если мы на главной странице, не показываем хлебные крошки
	if (location.pathname === "/") {
		return null;
	}
	
	// Для страницы 404 показываем специальные хлебные крошки
	if (is404Page) {
		return (
			<nav className="bg-[var(--bg-secondary)]">
				<div className="container py-3 px-4 mx-auto">
					<ol className="flex flex-wrap items-center text-sm text-[var(--text-secondary)]">
						<li className="flex items-center">
							<Link to="/" className="hover:text-[var(--accent-color)] font-medium">
								Главная
							</Link>
						</li>
						<li className="flex items-center">
							<svg
								className="mx-2 text-[var(--text-secondary)]"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
							<span className="font-medium text-[var(--text-primary)]">
								Страница не найдена
							</span>
						</li>
					</ol>
				</div>
			</nav>
		);
	}

	return (
		<nav className="bg-[var(--bg-secondary)]">
			<div className="container py-3 px-4 mx-auto">
				<ol className="flex flex-wrap items-center text-sm text-[var(--text-secondary)]">
					{breadcrumbs.map((breadcrumb, index) => (
						<li key={breadcrumb.path} className="flex items-center">
							{index > 0 && (
								<svg
									className="mx-2 text-[var(--text-secondary)]"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							)}

							{index === breadcrumbs.length - 1 ? (
								<span className="font-medium text-[var(--text-primary)]">{breadcrumb.name}</span>
							) : (
								<Link
									to={breadcrumb.path}
									className="hover:text-[var(--accent-color)] font-medium"
								>
									{breadcrumb.name}
								</Link>
							)}
						</li>
					))}
				</ol>
			</div>
		</nav>
	);
};

export default Breadcrumbs;
