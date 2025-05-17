import { FC, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/catalog/ProductCard";
import { Product } from "../types/Product";
import { products } from "../data/products";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage: FC = () => {
	// Состояние для хранения популярных товаров
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);
	const sliderRef = useRef<Slider>(null);

	// Настройки слайдера (без пагинации)
	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	// Загрузка популярных товаров
	useEffect(() => {
		// В реальном приложении здесь можно было бы загрузить товары с сервера
		// Для примера возьмем первые 6 товаров из нашего массива
		const popular = products.slice(0, 6);
		setPopularProducts(popular);
	}, []);
	return (
		<div>
			<section className="py-12" style={{ backgroundColor: "var(--section-bg)" }}>
				<div className="container mx-auto px-4">
					<div className="relative overflow-hidden rounded-lg shadow-lg">
						<div
							className="rounded-lg overflow-hidden"
							style={{ backgroundColor: "var(--card-bg)" }}
						>
							<div className="relative">
								<img
									src={"/images/Hero.png"}
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
										<Link
											to="/sales"
											className="btn-primary px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-medium inline-block"
										>
											Смотреть все акции
										</Link>
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
						<Link
							to="/catalog?petType=Собаки"
							className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
							style={{ backgroundColor: "var(--card-bg)" }}
						>
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐕</span>
								</div>
								<h3 className="font-medium">Товары для собак</h3>
							</div>
						</Link>

						<Link
							to="/catalog?petType=Кошки"
							className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
							style={{ backgroundColor: "var(--card-bg)" }}
						>
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐈</span>
								</div>
								<h3 className="font-medium">Товары для кошек</h3>
							</div>
						</Link>

						<Link
							to="/catalog?petType=Грызуны"
							className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
							style={{ backgroundColor: "var(--card-bg)" }}
						>
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐹</span>
								</div>
								<h3 className="font-medium">Товары для грызунов</h3>
							</div>
						</Link>

						<Link
							to="/catalog?petType=Птицы"
							className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
							style={{ backgroundColor: "var(--card-bg)" }}
						>
							<div className="p-4 text-center">
								<div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
									<span className="text-orange-500 text-2xl">🐦</span>
								</div>
								<h3 className="font-medium">Товары для птиц</h3>
							</div>
						</Link>
					</div>
				</div>
			</section>

			{/* Популярные товары */}
			<section className="py-12" style={{ backgroundColor: "var(--section-bg)" }}>
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-8 text-center">Популярные товары</h2>

					<div className="relative">
						<button
							className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-md"
							style={{
								backgroundColor: "var(--card-bg)",
								color: "var(--text-color)",
							}}
							onClick={() => sliderRef.current?.slickPrev()}
						>
							<svg
								className="w-6 h-6 text-gray-800"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						<Slider
							ref={sliderRef}
							{...sliderSettings}
							className="px-10 slick-container"
						>
							{popularProducts.map((product) => (
								<div key={product.id} className="px-2">
									<ProductCard product={product} />
								</div>
							))}
						</Slider>

						<button
							className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-md"
							style={{
								backgroundColor: "var(--card-bg)",
								color: "var(--text-color)",
							}}
							onClick={() => sliderRef.current?.slickNext()}
						>
							<svg
								className="w-6 h-6 text-gray-800"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			</section>

			{/* Подписка на рассылку */}
			<section
				className="py-12 text-white"
				style={{ backgroundColor: "var(--primary-color)" }}
			>
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
								className="flex-grow py-2 px-4 rounded-md focus:outline-none text-white border border-white"
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
