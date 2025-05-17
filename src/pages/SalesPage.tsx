import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Интерфейс для акции
interface Sale {
	id: number;
	title: string;
	description: string;
	discount: number;
	imageUrl: string;
	endDate: string;
	category?: string;
	petType?: string;
	productIds?: number[];
}

const SalesPage: FC = () => {
	// Состояние для хранения акций
	const [sales, setSales] = useState<Sale[]>([]);
	const [email, setEmail] = useState<string>("");

	// Загрузка акций
	useEffect(() => {
		const mockSales: Sale[] = [
			{
				id: 1,
				title: "Скидка на корм для собак",
				description: "Скидка 50% на премиальные корма для собак всех пород и размеров",
				discount: 50,
				imageUrl: "/images/products/dog-food-1.png",
				endDate: "31.05.2025",
				petType: "Собаки",
				category: "Корм",
			},
			{
				id: 2,
				title: "Игрушки для кошек",
				description: "Купите 2 игрушки для кошек и получите третью в подарок",
				discount: 33,
				imageUrl: "/images/products/cat-toy-1.png",
				endDate: "15.07.2025",
				petType: "Кошки",
				category: "Игрушки",
			},
			{
				id: 3,
				title: "Товары для пушистиков",
				description: "Скидка 30% на все товары для ухода за шерстью",
				discount: 30,
				imageUrl: "/images/products/dog-food-1.png",
				endDate: "20.06.2025",
				category: "Уход",
			},
			{
				id: 4,
				title: "Лежанки и домики",
				description: "Скидка 25% на все лежанки, домики и места для питомцев",
				discount: 25,
				imageUrl: "/images/products/dog-bed-1.png",
				endDate: "15.07.2025",
				category: "Аксессуары",
			},
			{
				id: 5,
				title: "Товары для аквариума",
				description: "Скидка 40% на все товары для аквариумистики",
				discount: 40,
				imageUrl: "/images/products/dog-food-1.png",
				endDate: "25.06.2025",
				category: "Аквариумистика",
			},
			{
				id: 6,
				title: "Витамины и добавки",
				description: "Скидка 20% на витамины и пищевые добавки для питомцев",
				discount: 20,
				imageUrl: "/images/products/dog-food-1.png",
				endDate: "30.05.2025",
				category: "Витамины",
			},
			{
				id: 7,
				title: "Переноски и сумки",
				description: "Скидка 25% на переноски и дорожные аксессуары для питомцев",
				discount: 25,
				imageUrl: "/images/products/dog-leash-1.png",
				endDate: "15.07.2025",
				category: "Аксессуары",
			},
			{
				id: 8,
				title: "Для грызунов",
				description:
					"Скидка 35% на все товары и аксессуары для грызунов, хомяков и кроликов",
				discount: 35,
				imageUrl: "/images/products/dog-food-1.png",
				endDate: "20.07.2025",
				petType: "Грызуны",
			},
			{
				id: 9,
				title: "Ошейники и поводки",
				description: "Скидка 25% на ошейники, поводки и шлейки для собак и кошек",
				discount: 25,
				imageUrl: "/images/products/dog-leash-1.png",
				endDate: "25.07.2025",
				category: "Аксессуары",
			},
		];

		setSales(mockSales);
	}, []);

	// Обработчик отправки формы подписки
	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			alert(
				`Вы успешно подписались на акции! На адрес ${email} будут приходить уведомления.`
			);
			setEmail("");
		}
	};

	return (
		<div>
			{/* Главный баннер акций */}
			<section className="bg-[var(--accent-color)]/10 py-12">
				<div className="container mx-auto px-4">
					<div className="relative overflow-hidden rounded-lg shadow-lg">
						<div className="bg-[var(--bg-primary)] rounded-lg overflow-hidden">
							<div className="relative">
								<img
									src="/images/products/cat-food-1.png"
									alt="Специальные акции"
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
											to="#current-sales"
											className="btn-primary px-6 py-2 bg-[var(--accent-color)]/100 hover:bg-[var(--accent-hover)] rounded-md text-white font-medium"
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

			{/* Текущие акции */}
			<section id="current-sales" className="py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-8 text-center">Текущие акции</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{sales.slice(0, 6).map((sale) => (
							<div
								key={sale.id}
								className="bg-[var(--bg-primary)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
							>
								<div className="relative">
									<img
										src={sale.imageUrl || "https://via.placeholder.com/400x300"}
										alt={sale.title}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute top-0 right-0 bg-[var(--accent-color)]/100 text-white px-3 py-1 rounded-bl-lg font-bold">
										-{sale.discount}%
									</div>
								</div>
								<div className="p-4 flex flex-col flex-grow">
									<h3 className="font-bold text-[var(--text-secondary)] mb-2">{sale.title}</h3>
									<p className="text-[var(--text-primary)] text-sm flex-grow">
										{sale.description}
									</p>
									<div className="flex justify-between items-center mt-auto pt-2 border-t border-[var(--border-color)]">
										<span className="text-sm text-[var(--text-secondary)]">
											до {sale.endDate}
										</span>
										<Link
											to={`/catalog?${
												sale.category ? `category=${sale.category}` : ""
											}${sale.petType ? `&petType=${sale.petType}` : ""}`}
											className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium text-sm"
										>
											Подробнее →
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
						{sales.slice(6).map((sale) => (
							<div
								key={sale.id}
								className="bg-[var(--bg-primary)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
							>
								<div className="relative">
									<img
										src={sale.imageUrl || "https://via.placeholder.com/400x300"}
										alt={sale.title}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute top-0 right-0 bg-[var(--accent-color)]/100 text-white px-3 py-1 rounded-bl-lg font-bold">
										-{sale.discount}%
									</div>
								</div>
								<div className="p-4 flex flex-col flex-grow">
									<h3 className="font-bold text-[var(--text-secondary)] mb-2">{sale.title}</h3>
									<p className="text-[var(--text-primary)] text-sm flex-grow">
										{sale.description}
									</p>
									<div className="flex justify-between items-center mt-auto pt-2 border-t border-[var(--border-color)]">
										<span className="text-sm text-[var(--text-secondary)]">
											до {sale.endDate}
										</span>
										<Link
											to={`/catalog?${
												sale.category ? `category=${sale.category}` : ""
											}${sale.petType ? `&petType=${sale.petType}` : ""}`}
											className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium text-sm"
										>
											Подробнее →
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Подписка на рассылку */}
			<section className="py-12 bg-[var(--accent-color)]/100 text-white">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-2xl font-bold mb-4">Подпишитесь на наши акции</h2>
						<p className="mb-6">
							Получайте уведомления о новых акциях и специальных предложениях первыми!
						</p>

						<form
							className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
							onSubmit={handleSubscribe}
						>
							<input
								type="email"
								placeholder="Ваш email"
								className="flex-grow py-2 px-4 rounded-md focus:outline-none text-[var(--text-primary)]"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="bg-[var(--bg-primary)] text-white py-2 px-6 rounded-md hover:bg-[var(--bg-hover)]"
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

export default SalesPage;
