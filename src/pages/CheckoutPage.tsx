import { useState, FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { saveOrder, Order } from "../utils/localStorage";
import DeliveryDatePicker from "../components/checkout/DeliveryDatePicker";

const CheckoutPage: FC = () => {
	const { cartItems, totalPrice, clearCart } = useCart();
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	// Состояния для формы
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [deliveryMethod, setDeliveryMethod] = useState("courier");
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [deliveryDate, setDeliveryDate] = useState("");
	const [deliveryTime, setDeliveryTime] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	// Стоимость доставки в зависимости от метода
	const deliveryPrices = {
		courier: 300,
		pickup: 200,
		selfPickup: 0,
	};

	// Заполняем форму данными пользователя, если он авторизован
	useEffect(() => {
		if (currentUser) {
			setFullName(currentUser.name);
			setEmail(currentUser.email);
		}
	}, [currentUser]);

	// Проверка на наличие товаров в корзине
	useEffect(() => {
		if (cartItems.length === 0) {
			navigate("/cart");
		}
	}, [cartItems, navigate]);

	// Валидация формы
	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!fullName.trim()) errors.fullName = "Введите имя";
		if (!email.trim()) errors.email = "Введите email";
		else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Некорректный email";
		if (!phone.trim()) errors.phone = "Введите телефон";
		if (!address.trim()) errors.address = "Введите адрес";
		if (!city.trim()) errors.city = "Введите город";
		if (!postalCode.trim()) errors.postalCode = "Введите почтовый индекс";

		// Проверка даты доставки, если выбрана доставка курьером
		if (deliveryMethod !== "selfPickup" && !deliveryDate) {
			errors.deliveryDate = "Выберите дату доставки";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Обработка отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;
		if (!currentUser) {
			alert("Для оформления заказа необходимо авторизоваться");
			navigate("/login");
			return;
		}

		setIsSubmitting(true);

		const deliveryPrice =
			deliveryMethod === "courier"
				? deliveryPrices.courier
				: deliveryMethod === "pickup"
				? deliveryPrices.pickup
				: 0;

		const order: Omit<Order, "id"> = {
			userId: currentUser.id,
			items: cartItems,
			totalPrice: totalPrice + deliveryPrice,
			status: "pending",
			createdAt: new Date().toISOString(),
			shippingAddress: {
				fullName,
				address,
				city,
				postalCode,
				phone,
			},
			paymentMethod,
			deliveryMethod,
			deliveryPrice,
			deliveryDate,
			deliveryTime,
		};

		// Сохраняем заказ
		const savedOrder = saveOrder(order);

		// Очищаем корзину
		clearCart();

		// Перенаправляем на страницу успешного оформления
		navigate(`/order-success/${savedOrder.id}`);
	};

	// Расчет итоговой стоимости
	const deliveryPrice =
		deliveryMethod === "courier"
			? deliveryPrices.courier
			: deliveryMethod === "pickup"
			? deliveryPrices.pickup
			: 0;
	const finalTotal = totalPrice + deliveryPrice;

	return (
		<div className="container mx-auto px-4 py-8 bg-[var(--bg-body)]">
			{/* Хлебные крошки */}
			<div className="flex items-center mb-6">
				<Link
					to="/"
					className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
				>
					Главная
				</Link>
				<span className="mx-2 text-[var(--text-secondary)]">&gt;</span>
				<Link
					to="/cart"
					className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
				>
					Корзина
				</Link>
				<span className="mx-2 text-gray-400">&gt;</span>
				<span className="text-[var(--text-primary)] font-medium">Оформление заказа</span>
			</div>

			<h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
			<p className="text-[var(--text-secondary)] mb-8">
				Заполните форму, чтобы завершить оформление вашего заказа
			</p>

			<form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Левая колонка - Персональные данные */}
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
						<h2 className="text-xl font-bold mb-4">Персональные данные</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="fullName"
									className="block text-[var(--text-secondary)] mb-1"
								>
									Имя и фамилия*
								</label>
								<input
									type="text"
									id="fullName"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									className={`w-full px-4 py-2 border ${
										formErrors.fullName ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
								/>
								{formErrors.fullName && (
									<p className="text-red-500 text-sm mt-1">
										{formErrors.fullName}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-[var(--text-secondary)] mb-1"
								>
									Электронная почта*
								</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={`w-full px-4 py-2 border ${
										formErrors.email ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
								/>
								{formErrors.email && (
									<p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
								)}
							</div>
						</div>

						<div className="mt-4">
							<label
								htmlFor="phone"
								className="block text-[var(--text-secondary)] mb-1"
							>
								Телефон*
							</label>
							<input
								type="tel"
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="+7 (___) ___-__-__"
								className={`w-full px-4 py-2 border ${
									formErrors.phone ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
							/>
							{formErrors.phone && (
								<p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
							)}
						</div>
					</div>

					{/* Адрес доставки */}
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
						<h2 className="text-xl font-bold mb-4">Адрес доставки</h2>

						<div>
							<label
								htmlFor="address"
								className="block text-[var(--text-secondary)] mb-1"
							>
								Адрес*
							</label>
							<input
								type="text"
								id="address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder="Улица, дом, квартира"
								className={`w-full px-4 py-2 border ${
									formErrors.address ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
							/>
							{formErrors.address && (
								<p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
							<div>
								<label
									htmlFor="city"
									className="block text-[var(--text-secondary)] mb-1"
								>
									Город*
								</label>
								<input
									type="text"
									id="city"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									className={`w-full px-4 py-2 border ${
										formErrors.city ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
								/>
								{formErrors.city && (
									<p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="postalCode"
									className="block text-[var(--text-secondary)] mb-1"
								>
									Почтовый индекс*
								</label>
								<input
									type="text"
									id="postalCode"
									value={postalCode}
									onChange={(e) => setPostalCode(e.target.value)}
									className={`w-full px-4 py-2 border ${
										formErrors.postalCode ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent`}
								/>
								{formErrors.postalCode && (
									<p className="text-red-500 text-sm mt-1">
										{formErrors.postalCode}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Способ доставки */}
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
						<h2 className="text-xl font-bold mb-4">Способ доставки</h2>

						<div className="space-y-3">
							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="deliveryMethod"
									value="courier"
									checked={deliveryMethod === "courier"}
									onChange={() => setDeliveryMethod("courier")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">Курьер</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Доставка курьером до двери (1-2 дня)
									</span>
									<span className="block font-medium text-[var(--text-primary)] mt-1">
										300 ₽
									</span>
								</div>
							</label>

							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="deliveryMethod"
									value="pickup"
									checked={deliveryMethod === "pickup"}
									onChange={() => setDeliveryMethod("pickup")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">Почта России</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Доставка в ближайшее отделение (3-7 дней)
									</span>
									<span className="block font-medium text-[var(--text-primary)] mt-1">
										200 ₽
									</span>
								</div>
							</label>

							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="deliveryMethod"
									value="selfPickup"
									checked={deliveryMethod === "selfPickup"}
									onChange={() => setDeliveryMethod("selfPickup")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">Самовывоз</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Вы заберёте заказ самостоятельно из нашего магазина
									</span>
									<span className="block font-medium text-[var(--text-primary)] mt-1">
										Бесплатно
									</span>
								</div>
							</label>
						</div>
					</div>

					{/* Выбор даты доставки */}
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)] mt-4">
						<DeliveryDatePicker
							selectedDeliveryMethod={deliveryMethod}
							onDateSelect={(date, time) => {
								setDeliveryDate(date);
								setDeliveryTime(time);
							}}
						/>
						{formErrors.deliveryDate && (
							<p className="text-red-500 text-sm mt-1">{formErrors.deliveryDate}</p>
						)}
					</div>

					{/* Способ оплаты */}
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
						<h2 className="text-xl font-bold mb-4">Способ оплаты</h2>

						<div className="space-y-3">
							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="paymentMethod"
									value="card"
									checked={paymentMethod === "card"}
									onChange={() => setPaymentMethod("card")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">Банковская карта</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Visa, MasterCard, Мир
									</span>
								</div>
							</label>

							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="paymentMethod"
									value="sbp"
									checked={paymentMethod === "sbp"}
									onChange={() => setPaymentMethod("sbp")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">
										Система быстрых платежей
									</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Оплата по QR-коду через мобильный банк
									</span>
								</div>
							</label>

							<label className="flex items-center border border-[var(--border-color)] p-2 rounded-md">
								<input
									type="radio"
									name="paymentMethod"
									value="cash"
									checked={paymentMethod === "cash"}
									onChange={() => setPaymentMethod("cash")}
									className="h-5 w-5 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
								/>
								<div className="ml-3">
									<span className="block font-medium">Оплата при получении</span>
									<span className="text-sm text-[var(--text-secondary)]">
										Наличными или картой при получении
									</span>
								</div>
							</label>
						</div>
					</div>
				</div>

				{/* Правая колонка - Сумма заказа */}
				<div className="lg:col-span-1">
					<div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)] sticky top-4">
						<h2 className="text-xl font-bold mb-4">Ваш заказ</h2>

						<div className="space-y-4 mb-4">
							{cartItems.map((item) => (
								<div
									key={item.product.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center">
										<div className="w-12 h-12 flex-shrink-0 bg-[var(--bg-secondary)] rounded-md overflow-hidden">
											<img
												src={
													item.product.imageUrl ||
													"https://via.placeholder.com/100"
												}
												alt={item.product.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="ml-3">
											<p className="text-sm font-medium text-[var(--text-primary)]">
												{item.product.name}
											</p>
											<p className="text-xs text-[var(--text-secondary)]">
												{item.quantity} шт.
											</p>
										</div>
									</div>
									<span className="font-medium text-[var(--text-primary)]">
										{item.product.price * item.quantity} ₽
									</span>
								</div>
							))}
						</div>

						<div className="space-y-2 mb-4">
							<div className="flex justify-between">
								<span className="text-[var(--text-secondary)]">
									Товары ({cartItems.length})
								</span>
								<span className="font-medium">{totalPrice} ₽</span>
							</div>

							<div className="flex justify-between">
								<span className="text-[var(--text-secondary)]">Доставка</span>
								<span>
									{deliveryPrice > 0 ? `${deliveryPrice} ₽` : "Бесплатно"}
								</span>
							</div>
						</div>

						<div className="border-t border-[var(--border-color)] pt-4 mb-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-lg">Итого</span>
								<span className="font-bold text-lg">{finalTotal} ₽</span>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full py-3 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 font-medium disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Оформление..." : "Подтвердить заказ"}
						</button>

						<p className="text-xs text-[var(--text-secondary)] mt-4 text-center">
							Нажимая кнопку "Подтвердить заказ", вы соглашаетесь с условиями
							публичной оферты и политикой конфиденциальности
						</p>

						<div className="mt-4 flex justify-center items-center text-[var(--text-secondary)] text-sm">
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
			</form>
		</div>
	);
};

export default CheckoutPage;
