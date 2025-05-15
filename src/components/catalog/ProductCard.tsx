import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import { useCart } from "../../utils/CartContext";
import { useFavorites } from "../../utils/FavoritesContext";
import { getProductReviews } from "../../data/reviews";
import { Review } from "../../types/Review";

interface ProductCardProps {
	product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	const { addToCart } = useCart();
	const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
	
	// Состояния для динамического рейтинга и количества отзывов
	const [productRating, setProductRating] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	
	// Получение рейтинга и количества отзывов
	useEffect(() => {
		const reviews = getProductReviews(product.id);
		const avgRating = reviews.length > 0
			? parseFloat((reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length).toFixed(1))
			: 0;
		setProductRating(avgRating);
		setReviewCount(reviews.length);
	}, [product.id]);

	const handleAddToCart = () => {
		if (product.inStock) {
			addToCart(product, 1);
		}
	};
	
	const handleToggleFavorite = () => {
		if (isInFavorites(product.id)) {
			removeFromFavorites(product.id);
		} else {
			addToFavorites(product);
		}
	};
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
			{/* Метки новинки и скидки */}
			<div className="relative">
				<div className="absolute top-2 left-2 flex gap-2">
					{product.isNew && (
						<span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
							Новинка
						</span>
					)}
					{product.isSale && (
						<span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
							Скидка
						</span>
					)}
				</div>

				{/* Изображение товара */}
				<Link to={`/product/${product.id}`} className="block">
					<div className="h-48 w-full bg-gray-200 flex items-center justify-center">
						<img
							src={product.imageUrl || "https://via.placeholder.com/300"}
							alt={product.name}
							className="h-full w-full object-cover"
						/>
					</div>
				</Link>
			</div>

			{/* Информация о товаре */}
			<div className="p-4 flex-grow flex flex-col">
				<div className="mb-2">
					<span className="text-sm text-gray-500">{product.category}</span>
				</div>
				<Link to={`/product/${product.id}`} className="block">
					<h3 className="text-lg font-medium mb-2 text-gray-800 hover:text-orange-500 min-h-[3rem]">
						{product.name}
					</h3>
				</Link>

				{/* Рейтинг */}
				<div className="flex items-center mb-3">
					<div className="flex items-center text-yellow-400">
						{[...Array(5)].map((_, i) => (
							<svg
								key={i}
								className={`w-4 h-4 ${
									i < Math.floor(productRating)
										? "text-yellow-400"
										: "text-gray-300"
								}`}
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
							</svg>
						))}
					</div>
					<span className="text-sm text-gray-600 ml-2">
						{productRating > 0 ? productRating : "0"} ({reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount >= 2 && reviewCount <= 4 ? 'отзыва' : 'отзывов'})
					</span>
				</div>

				{/* Цена */}
				<div className="flex items-center justify-between">
					<div>
						{product.oldPrice ? (
							<div className="flex items-center">
								<span className="text-lg font-bold text-gray-800 mr-2">
									₽{product.price}
								</span>
								<span className="text-sm text-gray-500 line-through">
									₽{product.oldPrice}
								</span>
							</div>
						) : (
							<span className="text-lg font-bold text-gray-800">
								₽{product.price}
							</span>
						)}
					</div>

					{/* Наличие */}
					{product.inStock ? (
						<span className="text-sm text-green-600">В наличии</span>
					) : (
						<span className="text-sm text-red-500">Нет в наличии</span>
					)}
				</div>
			</div>

			{/* Кнопки добавления */}
			<div className="px-4 pb-4 flex gap-2">
				<button
					className={`flex-grow py-2 rounded-md text-sm font-medium ${
						product.inStock
							? "bg-orange-500 hover:bg-orange-600 text-white"
							: "bg-gray-200 text-gray-500 cursor-not-allowed"
					}`}
					disabled={!product.inStock}
					onClick={handleAddToCart}
				>
					В корзину
				</button>
				<button 
					onClick={handleToggleFavorite}
					className={`p-2 rounded-md ${isInFavorites(product.id) ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'}`}
					title={isInFavorites(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill={isInFavorites(product.id) ? 'currentColor' : 'none'}
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
	);
};

export default ProductCard;
