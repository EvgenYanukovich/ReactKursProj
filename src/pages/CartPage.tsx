import { useState, FC } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import ProductCard from "../components/catalog/ProductCard";

const CartPage: FC = () => {
	const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
	const [promoCode, setPromoCode] = useState<string>("");
	const [discount, setDiscount] = useState<number>(0);
	const [promoApplied, setPromoApplied] = useState<boolean>(false);

	const handleQuantityChange = (productId: number, newQuantity: number) => {
		if (newQuantity > 0) {
			updateQuantity(productId, newQuantity);
		}
	};

	const handleRemoveItem = (productId: number) => {
		removeFromCart(productId);
	};

	const handlePromoCode = () => {
		// Простая проверка промокода - в реальном приложении это должно быть на сервере
		if (promoCode.toLowerCase() === "скидка300") {
			setDiscount(300);
			setPromoApplied(true);
		} else {
			alert("Неверный промокод");
		}
	};

	const deliveryFee = 0; // Бесплатная доставка
	const totalWithDiscount = totalPrice - discount > 0 ? totalPrice - discount : 0;
	const finalTotal = totalWithDiscount + deliveryFee;

	// Рекомендуемые товары (в реальном приложении должны приходить с сервера)
	const recommendedProducts = [
		{
			id: 101,
			name: "Щетка для груминга",
			description: "Универсальная",
			price: 750,
			oldPrice: null,
			imageUrl: "/images/products/brush.jpg",
			thumbnailUrl: "/images/products/brush.jpg",
			category: "Аксессуары",
			petType: "Кошки и собаки",
			rating: 4.5,
			reviewCount: 12,
			inStock: true,
			isNew: false,
			isSale: false,
			features: ["Мягкая щетина", "Удобная ручка", "Подходит для всех типов шерсти"],
		},
		{
			id: 102,
			name: 'Корм для кошек "Лосось"',
			description: "Премиум, 1 кг",
			price: 850,
			oldPrice: 950,
			imageUrl: "/images/products/cat-food-salmon.jpg",
			thumbnailUrl: "/images/products/cat-food-salmon.jpg",
			category: "Корма",
			petType: "Кошки",
			rating: 4.8,
			reviewCount: 24,
			inStock: true,
			isNew: false,
			isSale: true,
			features: ["Высокое содержание белка", "Без консервантов", "Омега-3 жирные кислоты"],
		},
		{
			id: 103,
			name: "Миска для собак",
			description: "Нержавеющая сталь, 0.5л",
			price: 520,
			oldPrice: null,
			imageUrl: "/images/products/dog-bowl.jpg",
			thumbnailUrl: "/images/products/dog-bowl.jpg",
			category: "Аксессуары",
			petType: "Собаки",
			rating: 4.2,
			reviewCount: 8,
			inStock: true,
			isNew: true,
			isSale: false,
			features: ["Нержавеющая сталь", "Нескользящее дно", "Легко моется"],
		},
		{
			id: 104,
			name: "Шампунь для питомцев",
			description: "Для чувствительной кожи, 250мл",
			price: 480,
			oldPrice: null,
			imageUrl: "/images/products/pet-shampoo.jpg",
			thumbnailUrl: "/images/products/pet-shampoo.jpg",
			category: "Уход",
			petType: "Кошки и собаки",
			rating: 4.6,
			reviewCount: 15,
			inStock: true,
			isNew: false,
			isSale: false,
			features: ["Гипоаллергенный", "Без парабенов", "Для чувствительной кожи"],
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Корзина</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Список товаров в корзине */}
				<div className="lg:w-2/3 mx-[auto]">
					{cartItems.length > 0 ? (
						<div className="space-y-4">
							{cartItems.map((item) => (
								<div
									key={item.product.id}
									className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
								>
									<div className="flex items-center">
										<div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
											<img
												src={
													item.product.imageUrl ||
													"https://via.placeholder.com/100"
												}
												alt={item.product.name}
												className="w-full h-full object-cover"
											/>
										</div>

										<div className="ml-4 flex-grow">
											<h3 className="font-medium text-gray-800">
												{item.product.name}
											</h3>
											<p className="text-sm text-gray-500">
												{item.product.description ||
													`Для ${item.product.petType.toLowerCase()}`}
											</p>

											<div className="flex items-center justify-between mt-2">
												<div className="flex items-center">
													<button
														onClick={() =>
															handleQuantityChange(
																item.product.id,
																item.quantity - 1
															)
														}
														className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
													>
														-
													</button>
													<span className="mx-3 w-6 text-center">
														{item.quantity}
													</span>
													<button
														onClick={() =>
															handleQuantityChange(
																item.product.id,
																item.quantity + 1
															)
														}
														className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
													>
														+
													</button>
												</div>

												<div className="flex items-center">
													<span className="font-medium text-gray-800 mr-4">
														{item.product.price * item.quantity} ₽
													</span>
													<button
														onClick={() =>
															handleRemoveItem(item.product.id)
														}
														className="text-gray-400 hover:text-gray-600"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																fillRule="evenodd"
																d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																clipRule="evenodd"
															/>
														</svg>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}

							{/* Промокод */}
							<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-6">
								<h3 className="font-medium text-gray-800 mb-2">Промокод</h3>
								<div className="flex">
									<input
										type="text"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										placeholder="Введите промокод"
										className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										disabled={promoApplied}
									/>
									<button
										onClick={handlePromoCode}
										className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
										disabled={promoApplied}
									>
										Применить
									</button>
								</div>
								{promoApplied && (
									<p className="text-green-600 text-sm mt-1">
										Промокод применен! Скидка: {discount} ₽
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
							<h3 className="text-xl font-medium text-gray-800 mb-2">
								Ваша корзина пуста
							</h3>
							<p className="text-gray-600 mb-6">
								Добавьте товары из каталога, чтобы оформить заказ
							</p>
							<Link
								to="/catalog"
								className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
							>
								Перейти в каталог
							</Link>
						</div>
					)}
				</div>

				{/* Сумма заказа */}
				{cartItems.length > 0 && (
					<div className="lg:w-1/3">
						<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-4">
							<h2 className="text-xl font-bold mb-4">Сумма заказа</h2>

							<div className="space-y-2 mb-4">
								<div className="flex justify-between">
									<span className="text-gray-600">
										Товары ({cartItems.length})
									</span>
									<span className="font-medium">{totalPrice} ₽</span>
								</div>

								{discount > 0 && (
									<div className="flex justify-between text-green-600">
										<span>Скидка</span>
										<span>-{discount} ₽</span>
									</div>
								)}

								<div className="flex justify-between">
									<span className="text-gray-600">Доставка</span>
									<span>
										{deliveryFee > 0 ? `${deliveryFee} ₽` : "Бесплатно"}
									</span>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-4 mb-6">
								<div className="flex justify-between items-center">
									<span className="font-bold text-lg">Итого</span>
									<span className="font-bold text-lg">{finalTotal} ₽</span>
								</div>
							</div>

							<Link
								to="/checkout"
								className="block w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium text-center"
							>
								Оформить заказ
							</Link>

							<div className="mt-4 flex justify-center items-center text-gray-500 text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clipRule="evenodd"
									/>
								</svg>
								Безопасная оплата
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Рекомендуемые товары */}
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Рекомендуем также</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{recommendedProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default CartPage;
