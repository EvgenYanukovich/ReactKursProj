import { FC } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../utils/FavoritesContext";
import { useCart } from "../utils/CartContext";

const FavoritesPage: FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Избранные товары</h1>
      
      {favorites.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 mb-4">У вас пока нет избранных товаров</p>
          <Link to="/catalog" className="btn-primary inline-block">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.imageUrl || "https://via.placeholder.com/300"} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  title="Удалить из избранного"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-medium text-gray-800 hover:text-orange-500 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{product.petType}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    {product.oldPrice ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-800">{product.price} ₽</span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.oldPrice} ₽
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">{product.price} ₽</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
