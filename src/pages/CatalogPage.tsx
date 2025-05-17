import { FC, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/catalog/ProductCard";
import type { Product } from "../types/Product";
import productData from "../data/products.json";

const CatalogPage: FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [sortType, setSortType] = useState<string>("popular");
	// Используем корректную типизацию для фильтров
	const [filters, setFilters] = useState<{
		petTypes: Record<string, boolean>;
		categories: Record<string, boolean>;
		minPrice: number;
		maxPrice: number;
		onlyInStock: boolean;
		onlySale: boolean;
		onlyNew: boolean;
	}>({
		petTypes: {
			Кошки: false,
			Собаки: false,
			Грызуны: false,
			Птицы: false,
			Универсальное: false,
		},
		categories: {
			Корм: false,
			Игрушки: false,
			Аксессуары: false,
			Гигиена: false,
		},
		minPrice: 0,
		maxPrice: 5000,
		onlyInStock: false,
		onlySale: false,
		onlyNew: false,
	});

	// Обработка URL-параметров для фильтрации
	useEffect(() => {
		// Загрузка данных о товарах
		setProducts(productData as Product[]);
		setFilteredProducts(productData as Product[]);

		// Определение максимальной цены для фильтра цен
		if (productData.length > 0) {
			const maxPrice = Math.max(...productData.map((product) => product.price));
			setPriceRange([0, maxPrice]);
			setFilters((prev) => ({ ...prev, maxPrice }));
		}

		// Получение параметров из URL
		const searchParams = new URLSearchParams(location.search);
		const categoryParam = searchParams.get("category");
		const petTypeParam = searchParams.get("petType");

		// Применение фильтров из URL
		if (categoryParam || petTypeParam) {
			const newFilters = { ...filters };

			if (categoryParam && newFilters.categories.hasOwnProperty(categoryParam)) {
				newFilters.categories = {
					...newFilters.categories,
					[categoryParam]: true,
				};
			}

			if (petTypeParam && newFilters.petTypes.hasOwnProperty(petTypeParam)) {
				newFilters.petTypes = {
					...newFilters.petTypes,
					[petTypeParam]: true,
				};
			}

			setFilters(newFilters);
		}
	}, [location.search]);

	// Применение фильтров при их изменении
	useEffect(() => {
		applyFilters();
	}, [filters]);

	// Функция для обновления фильтров
	const handleFilterChange = (filterType: string, value: string | boolean | number[]) => {
		const newFilters = { ...filters };

		if (filterType === "petType") {
			newFilters.petTypes = {
				...newFilters.petTypes,
				[value as string]: !newFilters.petTypes[value as string],
			};

			// Обновление URL
			const searchParams = new URLSearchParams(location.search);
			if (newFilters.petTypes[value as string]) {
				searchParams.set("petType", value as string);
			} else {
				searchParams.delete("petType");
			}
			navigate({ search: searchParams.toString() }, { replace: true });
		} else if (filterType === "category") {
			newFilters.categories = {
				...newFilters.categories,
				[value as string]: !newFilters.categories[value as string],
			};

			// Обновление URL
			const searchParams = new URLSearchParams(location.search);
			if (newFilters.categories[value as string]) {
				searchParams.set("category", value as string);
			} else {
				searchParams.delete("category");
			}
			navigate({ search: searchParams.toString() }, { replace: true });
		} else if (filterType === "priceRange") {
			const priceValues = value as number[];
			newFilters.minPrice = priceValues[0];
			newFilters.maxPrice = priceValues[1];
		} else if (
			filterType === "onlyInStock" ||
			filterType === "onlySale" ||
			filterType === "onlyNew"
		) {
			// Для флагов фильтрации
			(newFilters as any)[filterType] = value;
		}

		setFilters(newFilters);
	};

	// Функция сортировки товаров
	const sortProducts = (products: Product[], sortType: string) => {
		let sortedProducts = [...products];

		switch (sortType) {
			case "popular":
				// Сортировка по рейтингу и количеству отзывов
				sortedProducts.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
				break;
			case "price_asc":
				// Сортировка по возрастанию цены
				sortedProducts.sort((a, b) => a.price - b.price);
				break;
			case "price_desc":
				// Сортировка по убыванию цены
				sortedProducts.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				// Сортировка по рейтингу
				sortedProducts.sort((a, b) => b.rating - a.rating);
				break;
			case "new":
				// Сортировка: сначала новинки
				sortedProducts.sort((a, b) => {
					if (a.isNew && !b.isNew) return -1;
					if (!a.isNew && b.isNew) return 1;
					return 0;
				});
				break;
			default:
				break;
		}

		return sortedProducts;
	};

	// Функция применения фильтров
	const applyFilters = () => {
		let result = [...products];

		// Фильтр по типу животного
		const selectedPetTypes = Object.entries(filters.petTypes)
			.filter(([_, checked]) => checked)
			.map(([type]) => type);

		if (selectedPetTypes.length > 0) {
			result = result.filter((product) => selectedPetTypes.includes(product.petType));
		}

		// Фильтр по категории
		const selectedCategories = Object.entries(filters.categories)
			.filter(([_, checked]) => checked)
			.map(([category]) => category);

		if (selectedCategories.length > 0) {
			result = result.filter((product) => selectedCategories.includes(product.category));
		}

		// Фильтр по цене
		result = result.filter(
			(product) => product.price >= filters.minPrice && product.price <= filters.maxPrice
		);

		// Фильтр по наличию
		if (filters.onlyInStock) {
			result = result.filter((product) => product.inStock);
		}

		// Фильтр по скидке
		if (filters.onlySale) {
			result = result.filter((product) => product.isSale);
		}

		// Фильтр по новинкам
		if (filters.onlyNew) {
			result = result.filter((product) => product.isNew);
		}

		// Применяем сортировку после фильтрации
		result = sortProducts(result, sortType);

		setFilteredProducts(result);
	};

	return (
		<div className="container mx-auto px-4 py-8 bg-[var(--bg-body)]">
			<h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Каталог товаров</h1>

			<div className="flex flex-col md:flex-row align-start">
				{/* Фильтры */}
				<div
					className="md:w-1/4 p-4 bg-[var(--bg-primary)] rounded-lg h-[max-content]"
					style={{
						boxShadow: "0 4px 6px -1px var(--shadow-color)",
					}}
				>
					<h2 className="text-xl font-semibold mb-4">Фильтры</h2>

					{/* Фильтр по типу животного */}
					<div className="mb-6">
						<h3 className="font-medium mb-2">Тип животного</h3>
						<div className="space-y-2">
							{Object.entries(filters.petTypes).map(([petType, checked]) => (
								<label key={petType} className="flex items-center">
									<input
										type="checkbox"
										checked={checked}
										onChange={() => handleFilterChange("petType", petType)}
										className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
									/>
									<span className="ml-2">{petType}</span>
								</label>
							))}
						</div>
					</div>

					{/* Фильтр по категории */}
					<div className="mb-6">
						<h3 className="font-medium mb-2">Категория</h3>
						<div className="space-y-2">
							{Object.entries(filters.categories).map(([category, checked]) => (
								<label key={category} className="flex items-center">
									<input
										type="checkbox"
										checked={checked}
										onChange={() => handleFilterChange("category", category)}
										className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
									/>
									<span className="ml-2">{category}</span>
								</label>
							))}
						</div>
					</div>

					{/* Фильтр по цене */}
					<div className="mb-6">
						<h3 className="font-medium mb-2">Цена</h3>
						<div className="px-2">
							<div className="flex justify-between mb-2">
								<span>от {filters.minPrice} ₽</span>
								<span>до {filters.maxPrice} ₽</span>
							</div>
							<div className="flex gap-4 items-center mb-2">
								<input
									type="number"
									min="0"
									max={filters.maxPrice}
									value={filters.minPrice}
									onChange={(e) =>
										handleFilterChange("priceRange", [
											parseInt(e.target.value) || 0,
											filters.maxPrice,
										])
									}
									className="w-1/2 p-1 border border-[var(--border-color)] rounded-md text-sm"
								/>
								<input
									type="number"
									min={filters.minPrice}
									max={priceRange[1]}
									value={filters.maxPrice}
									onChange={(e) =>
										handleFilterChange("priceRange", [
											filters.minPrice,
											parseInt(e.target.value) || filters.minPrice,
										])
									}
									className="w-1/2 p-1 border border-[var(--border-color)] rounded-md text-sm"
								/>
							</div>
							<input
								type="range"
								min="0"
								max={priceRange[1]}
								value={filters.maxPrice}
								onChange={(e) =>
									handleFilterChange("priceRange", [
										filters.minPrice,
										parseInt(e.target.value),
									])
								}
								className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer mt-4"
							/>
						</div>
					</div>

					{/* Дополнительные фильтры */}
					<div className="mb-6">
						<h3 className="font-medium mb-2">Дополнительно</h3>
						<div className="space-y-2">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={filters.onlyInStock}
									onChange={() =>
										handleFilterChange("onlyInStock", !filters.onlyInStock)
									}
									className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
								/>
								<span className="ml-2">Только в наличии</span>
							</label>
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={filters.onlySale}
									onChange={() =>
										handleFilterChange("onlySale", !filters.onlySale)
									}
									className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
								/>
								<span className="ml-2">Только со скидкой</span>
							</label>
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={filters.onlyNew}
									onChange={() => handleFilterChange("onlyNew", !filters.onlyNew)}
									className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
								/>
								<span className="ml-2">Новинки</span>
							</label>
						</div>
					</div>
				</div>

				{/* Список товаров */}
				<div className="md:w-3/4 md:pl-6 mt-6 md:mt-0">
					<div className="flex justify-between items-center mb-6">
						<div>
							<span className="text-[var(--text-secondary)]">
								Найдено: {products.length} товаров
							</span>
						</div>

						<div className="flex items-center">
							<span className="mr-2 text-[var(--text-primary)]">Сортировка:</span>
							<select
								className="p-2 border border-[var(--border-color)] rounded-md"
								value={sortType}
								onChange={(e) => {
									setSortType(e.target.value);
									// Перезапускаем фильтрацию с новым типом сортировки
									setFilteredProducts(
										sortProducts(filteredProducts, e.target.value)
									);
								}}
							>
								<option value="popular">По популярности</option>
								<option value="price_asc">По возрастанию цены</option>
								<option value="price_desc">По убыванию цены</option>
								<option value="rating">По рейтингу</option>
								<option value="new">Сначала новинки</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{/* Пагинация */}
					<div className="mt-8 flex justify-center">
						<nav className="flex items-center space-x-1">
							<button className="p-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								<svg
									className="w-5 h-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<button className="px-4 py-2 border rounded-md bg-[var(--accent-color)] text-white">
								1
							</button>
							<button className="px-4 py-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								2
							</button>
							<button className="px-4 py-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								3
							</button>
							<button className="px-4 py-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								4
							</button>
							<button className="px-4 py-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								5
							</button>
							<button className="p-2 border rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
								<svg
									className="w-5 h-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CatalogPage;
