import { FC, useEffect, useState } from "react";
import { Product } from "../../types/Product";
import { getRelatedProducts } from "../../data/products";
import ProductCard from "../catalog/ProductCard";

interface RelatedProductsProps {
	currentProductId: number;
	category: string;
	petType: string;
}

const RelatedProducts: FC<RelatedProductsProps> = ({ currentProductId, category, petType }) => {
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

	useEffect(() => {
		// Находим похожие товары (той же категории и для того же типа животных)
		const related = getRelatedProducts(currentProductId, category, petType, 4);
		setRelatedProducts(related);
	}, [currentProductId, category, petType]);

	if (relatedProducts.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{relatedProducts.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default RelatedProducts;
