import { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ProductCard from "../components/catalog/ProductCard";
import { products } from "../data/products";

const NotFoundPage: FC = () => {
	// Получаем 4 случайных товара для раздела "Возможно, вас заинтересует"
	const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Breadcrumbs />
			<main className="flex-grow">
				<div className="container mx-auto px-4 py-8 text-center">
					{/* Изображение 404 */}
					<div className="max-w-xs mx-auto mb-6">
						<img src="/images/404.png" alt="Страница не найдена" className="w-full" />
					</div>

					{/* Заголовок и текст */}
					<h1 className="text-6xl font-bold text-[var(--accent-color)] mb-4">404</h1>
					<h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
						Страница не найдена
					</h2>
					<p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
						Упс! Похоже, что страница, которую вы ищете, потерялась, как игрушка вашего
						питомца под диваном.
					</p>

					{/* Кнопки */}
					<div className="flex justify-center space-x-4 mb-16">
						<Link
							to="/"
							className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white py-2 px-4 rounded-md flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							На главную
						</Link>
						<Link
							to="/catalog"
							className="border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] py-2 px-4 rounded-md flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h7"
								/>
							</svg>
							В каталог
						</Link>
					</div>

					{/* Рекомендуемые товары */}
					<div className="mt-12">
						<h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
							Возможно, вас заинтересует
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
							{randomProducts.map((product) => (
								<div key={product.id}>
									<ProductCard product={product} />
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default NotFoundPage;
