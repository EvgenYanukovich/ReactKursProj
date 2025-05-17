import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/Product";
import { products } from "../../data/products";

const SearchBar: FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Обработка клика вне выпадающего списка
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsDropdownVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Поиск товаров при вводе текста
	useEffect(() => {
		if (searchTerm.trim() === "") {
			setSearchResults([]);
			setIsDropdownVisible(false);
			return;
		}

		const filteredProducts = products
			.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.slice(0, 3); // Берем только первые 3 результата

		setSearchResults(filteredProducts);
		setIsDropdownVisible(filteredProducts.length > 0);
	}, [searchTerm]);

	// Обработка выбора товара из выпадающего списка
	const handleSelectProduct = (productId: number) => {
		setIsDropdownVisible(false);
		setSearchTerm("");
		navigate(`/product/${productId}`);
	};

	// Обработка отправки формы поиска
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchResults.length > 0) {
			handleSelectProduct(searchResults[0].id);
		}
	};

	return (
		<div className="relative">
			<form onSubmit={handleSubmit} className="relative">
				<input
					ref={inputRef}
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Поиск товаров..."
					className="w-full py-2 pl-4 pr-10 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
				/>
				<button
					type="submit"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</form>

			{/* Выпадающий список с результатами поиска */}
			{isDropdownVisible && (
				<div
					ref={dropdownRef}
					className="absolute z-10 w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-lg"
				>
					{searchResults.map((product) => (
						<div
							key={product.id}
							className="flex items-center p-3 hover:bg-[var(--bg-secondary)] cursor-pointer border-b border-[var(--border-color)] last:border-b-0"
							onClick={() => handleSelectProduct(product.id)}
						>
							<div className="w-12 h-12 mr-3 bg-[var(--bg-secondary)] flex-shrink-0">
								<img
									src={product.imageUrl || "https://via.placeholder.com/48"}
									alt={product.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-grow">
								<div className="font-medium text-[var(--text-primary)]">{product.name}</div>
								<div className="text-sm text-[var(--text-secondary)]">₽{product.price}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
