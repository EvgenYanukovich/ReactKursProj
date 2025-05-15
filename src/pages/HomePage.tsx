import { FC, useState, useEffect } from "react";
import ProductCard from "../components/catalog/ProductCard";
import { Product } from "../types/Product";
import { products } from "../data/products";

const HomePage: FC = () => {
	// Состояние для хранения популярных товаров
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);
	
	// Загрузка популярных товаров
	useEffect(() => {
		// В реальном приложении здесь можно было бы загрузить товары с сервера
		// Для примера возьмем первые 4 товара из нашего массива
		const popular = products.slice(0, 4);
		setPopularProducts(popular);
	}, []);
	return (
		<div>
			{/* Слайдер с акциями */}
			<section className="bg-orange-50 py-12">
				<div className="container mx-auto px-4">
					<div className="relative overflow-hidden rounded-lg shadow-lg">
						<div className="bg-white rounded-lg overflow-hidden">
							<div className="relative">
								<img
									src="https://via.placeholder.com/1200x400"
									alt="Акция для питомцев"
									className="w-full h-96 object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
									<div className="text-white p-8 max-w-lg">
										<h2 className="text-3xl font-bold mb-4">
											Специальные акции
										</h2>
										<p className="mb-6">
											Лучшие предложения для ваших питомцев. Скидки до 50% на
											выбранные товары!
										</p>
										<button className="btn-primary">Смотреть все акции</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Категории товаров */}
			<section className="py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-8 text-center">Категории товаров</h2>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐕</span>
								</div>
								<h3 className="font-medium">Товары для собак</h3>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐈</span>
								</div>
								<h3 className="font-medium">Товары для кошек</h3>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐹</span>
								</div>
								<h3 className="font-medium">Товары для грызунов</h3>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐦</span>
								</div>
								<h3 className="font-medium">Товары для птиц</h3>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Популярные товары */}
			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-8 text-center">Популярные товары</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{popularProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Подписка на рассылку */}
			<section className="py-12 bg-orange-500 text-white">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-2xl font-bold mb-4">Подпишитесь на наши акции</h2>
						<p className="mb-6">
							Получайте уведомления о новых акциях и специальных предложениях первыми!
						</p>

						<form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Ваш email"
								className="flex-grow py-2 px-4 rounded-md focus:outline-none text-gray-800"
							/>
							<button
								type="submit"
								className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
							>
								Подписаться
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
