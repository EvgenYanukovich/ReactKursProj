import { FC, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getOrderById, Order } from "../utils/localStorage";

const OrderSuccessPage: FC = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const [order, setOrder] = useState<Order | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (orderId) {
			const foundOrder = getOrderById(orderId);
			if (foundOrder) {
				setOrder(foundOrder);
			} else {
				navigate("/");
			}
		}
	}, [orderId, navigate]);

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)] mx-auto"></div>
				<p className="mt-4 text-[var(--text-secondary)]">Загрузка информации о заказе...</p>
			</div>
		);
	}

	// Форматирование даты
	const orderDate = new Date(order.createdAt);
	const formattedDate = new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(orderDate);

	return (
		<div className="container mx-auto px-4 py-12 bg-[var(--bg-body)]">
			<div className="max-w-3xl mx-auto bg-[var(--bg-primary)] rounded-lg shadow-md p-8">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/20 rounded-full mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-green-300"
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
					<h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Заказ успешно оформлен!</h1>
					<p className="text-[var(--text-secondary)]">
						Благодарим за ваш заказ. Мы отправили подтверждение на вашу электронную почту.
					</p>
				</div>

				<div className="border-t border-b border-[var(--border-color)] py-4 mb-6">
					<div className="flex justify-between items-center mb-2">
						<span className="text-[var(--text-secondary)]">Номер заказа:</span>
						<span className="font-medium">{order.id.substring(0, 8).toUpperCase()}</span>
					</div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-[var(--text-secondary)]">Дата заказа:</span>
						<span className="font-medium">{formattedDate}</span>
					</div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-[var(--text-secondary)]">Статус:</span>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-300">
							В обработке
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[var(--text-secondary)]">Сумма заказа:</span>
						<span className="font-bold text-lg">{order.totalPrice} ₽</span>
					</div>
				</div>

				<div className="mb-6">
					<h2 className="text-lg font-bold mb-3">Информация о доставке</h2>
					<div className="bg-[var(--bg-secondary)] rounded-md p-4">
						<p className="mb-1">
							<span className="font-medium">Получатель:</span> {order.shippingAddress.fullName}
						</p>
						<p className="mb-1">
							<span className="font-medium">Адрес:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
						</p>
						<p>
							<span className="font-medium">Телефон:</span> {order.shippingAddress.phone}
						</p>
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-bold mb-3">Товары в заказе</h2>
					<div className="space-y-3">
						{order.items.map((item) => (
							<div key={item.product.id} className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
								<div className="flex items-center">
									<div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
										<img
											src={item.product.imageUrl || "https://via.placeholder.com/100"}
											alt={item.product.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="ml-3">
										<p className="font-medium text-[var(--text-primary)]">{item.product.name}</p>
										<p className="text-sm text-gray-500">Количество: {item.quantity}</p>
									</div>
								</div>
								<span className="font-medium">
									{item.product.price * item.quantity} ₽
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
					<Link
						to="/catalog"
						className="inline-flex justify-center items-center px-6 py-3 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-md hover:bg-[var(--accent-color)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
					>
						Продолжить покупки
					</Link>
					<Link
						to="/orders"
						className="inline-flex justify-center items-center px-6 py-3 bg-[var(--accent-color)]/100 text-white rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
					>
						Мои заказы
					</Link>
				</div>
			</div>
		</div>
	);
};

export default OrderSuccessPage;
