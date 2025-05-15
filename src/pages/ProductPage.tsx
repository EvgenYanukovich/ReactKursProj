import { FC, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import StarRating from "../components/common/StarRating";
import ReviewList from "../components/product/ReviewList";
import { useCart } from "../utils/CartContext";
import { useFavorites } from "../utils/FavoritesContext";
import { getProductReviews } from "../data/reviews";
import { Review } from "../types/Review";
import { Product } from "../types/Product";

// Импортируем функцию getProductById из файла products.ts
import { getProductById } from "../data/products";

// Импортируем компоненты
import RelatedProducts from "../components/product/RelatedProducts";

const ProductPage: FC = () => {
	const { id } = useParams<{ id: string }>();
	const { addToCart } = useCart();
	const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
	const [product, setProduct] = useState<Product | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [activeImage, setActiveImage] = useState("");
	const [productRating, setProductRating] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Получение рейтинга и количества отзывов
	useEffect(() => {
		if (product) {
			const reviews = getProductReviews(product.id);
			const avgRating =
				reviews.length > 0
					? parseFloat(
							(
								reviews.reduce(
									(sum: number, review: Review) => sum + review.rating,
									0
								) / reviews.length
							).toFixed(1)
					  )
					: 0;
			setProductRating(avgRating);
			setReviewCount(reviews.length);
		}
	}, [product]);

	// Загрузка данных о товаре
	useEffect(() => {
		if (id) {
			const productId = parseInt(id);
			const foundProduct = getProductById(productId);

			if (foundProduct) {
				setProduct(foundProduct);
				setActiveImage(foundProduct.imageUrl || "");
			}

			setIsLoading(false);
		}
	}, [id]);

	// Обработчик изменения количества товара
	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity >= 1) {
			setQuantity(newQuantity);
		}
	};

	// Обработчик добавления в корзину
	const handleAddToCart = () => {
		if (product && product.inStock) {
			addToCart(product, quantity);
		}
	};

	// Обработчик добавления/удаления из избранного
	const handleToggleFavorite = () => {
		if (!product) return;

		if (isInFavorites(product.id)) {
			removeFromFavorites(product.id);
		} else {
			addToFavorites(product);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 flex justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
				<p className="mb-4">
					К сожалению, запрашиваемый товар не существует или был удален.
				</p>
				<Link to="/catalog" className="text-orange-500 hover:text-orange-600">
					Вернуться в каталог
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{/* Галерея изображений */}
				<div>
					<div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
						<img
							src={activeImage || "https://via.placeholder.com/500"}
							alt={product.name}
							className="w-full h-96 object-contain"
						/>
					</div>

					{/* Миниатюры изображений */}
					<div className="grid grid-cols-5 gap-2">
						<button
							className={`border ${
								activeImage === product.imageUrl
									? "border-orange-500"
									: "border-gray-200"
							} rounded-md overflow-hidden`}
							onClick={() => setActiveImage(product.imageUrl || "")}
						>
							<img
								src={product.imageUrl || "https://via.placeholder.com/100"}
								alt={product.name}
								className="w-full h-20 object-cover"
							/>
						</button>

						{product.thumbnailUrl && (
							<button
								className={`border ${
									activeImage === product.thumbnailUrl
										? "border-orange-500"
										: "border-gray-200"
								} rounded-md overflow-hidden`}
								onClick={() => setActiveImage(product.thumbnailUrl || "")}
							>
								<img
									src={product.thumbnailUrl}
									alt={`${product.name} thumbnail`}
									className="w-full h-20 object-cover"
								/>
							</button>
						)}

						{/* Здесь можно добавить дополнительные изображения, если они есть */}
					</div>
				</div>

				{/* Информация о товаре */}
				<div>
					<h1 className="text-3xl font-bold mb-2">{product.name}</h1>

					{/* Рейтинг и отзывы */}
					<div className="flex items-center mb-2">
						<StarRating rating={productRating} />
						<span className="ml-2 text-gray-600">
							({reviewCount}{" "}
							{reviewCount === 1
								? "отзыв"
								: reviewCount >= 2 && reviewCount <= 4
								? "отзыва"
								: "отзывов"}
							)
						</span>
					</div>

					{/* Наличие */}
					<div className="mb-4">
						{product.inStock ? (
							<span className="text-green-600 font-medium">В наличии</span>
						) : (
							<span className="text-red-500 font-medium">Нет в наличии</span>
						)}
					</div>

					{/* Цена */}
					<div className="mb-6">
						<div className="flex items-center">
							<span className="text-3xl font-bold text-gray-800 mr-3">
								{product.price} ₽
							</span>
							{product.oldPrice && (
								<span className="text-lg text-gray-500 line-through">
									{product.oldPrice} ₽
								</span>
							)}
						</div>

						{product.oldPrice && (
							<div className="mt-1">
								<span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
									Скидка{" "}
									{Math.round(
										((product.oldPrice - product.price) / product.oldPrice) *
											100
									)}
									%
								</span>
							</div>
						)}
					</div>

					{/* Выбор количества и кнопки действий */}
					<div className="mb-6">
						<div className="flex items-center mb-4">
							<span className="mr-4 text-gray-700">Количество:</span>
							<div className="flex items-center border border-gray-300 rounded-md">
								<button
									onClick={() => handleQuantityChange(quantity - 1)}
									disabled={quantity <= 1}
									className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
								>
									-
								</button>
								<input
									type="number"
									min="1"
									value={quantity}
									onChange={(e) =>
										handleQuantityChange(parseInt(e.target.value) || 1)
									}
									className="w-12 text-center border-none focus:outline-none"
								/>
								<button
									onClick={() => handleQuantityChange(quantity + 1)}
									className="px-3 py-1 text-gray-600 hover:bg-gray-100"
								>
									+
								</button>
							</div>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={handleAddToCart}
								disabled={!product.inStock}
								className={`flex-grow py-3 px-6 rounded-md font-medium ${
									product.inStock
										? "bg-orange-500 hover:bg-orange-600 text-white"
										: "bg-gray-200 text-gray-500 cursor-not-allowed"
								}`}
							>
								{product.inStock ? "Добавить в корзину" : "Нет в наличии"}
							</button>

							<button
								onClick={handleToggleFavorite}
								className={`p-3 rounded-md ${
									isInFavorites(product.id)
										? "bg-red-50 text-red-500"
										: "bg-gray-100 text-gray-500 hover:bg-gray-200"
								}`}
								title={
									isInFavorites(product.id)
										? "Удалить из избранного"
										: "Добавить в избранное"
								}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill={isInFavorites(product.id) ? "currentColor" : "none"}
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Доставка и оплата */}
					<div className="mb-6 space-y-2">
						<div className="flex items-center text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
								<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 1h-3a1 1 0 00-1 1v8h-2V5a1 1 0 00-1-1H3z" />
							</svg>
							Доставка от 1 до 3 дней
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
								<path
									fillRule="evenodd"
									d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
									clipRule="evenodd"
								/>
							</svg>
							Оплата при получении
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
							Гарантия качества
						</div>
					</div>

					{/* Описание товара */}
					<div className="mb-6">
						<h2 className="text-xl font-bold mb-2">Описание</h2>
						<p className="text-gray-700">{product.description}</p>
					</div>

					{/* Характеристики товара */}
					{product.features && product.features.length > 0 && (
						<div className="mt-8">
							<h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
								Характеристики
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{product.features.map((feature, index) => (
									<div key={index} className="flex items-start">
										<div className="flex-shrink-0 mt-1">
											<svg
												className="h-5 w-5 text-green-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<p className="ml-3 text-gray-700">{feature}</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Отзывы */}
			<div className="mb-12">
				<h2 className="text-2xl font-bold mb-6">Отзывы</h2>
				<ReviewList productId={product.id} />
			</div>

			{/* Похожие товары */}
			<div>
				<h2 className="text-2xl font-bold mb-6">С этим товаром покупают</h2>
				<RelatedProducts
					currentProductId={product.id}
					category={product.category}
					petType={product.petType}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
