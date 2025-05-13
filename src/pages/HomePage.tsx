import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div>
            {/* Слайдер с акциями */}
            <section className="bg-orange-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <div className="bg-white rounded-lg overflow-hidden">
                            <div className="relative">
                                <img 
                                    src="https://via.placeholder.com/1200x400" 
                                    alt="Акция для питомцев" 
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                                    <div className="text-white p-8 max-w-lg">
                                        <h2 className="text-3xl font-bold mb-4">Специальные акции</h2>
                                        <p className="mb-6">Лучшие предложения для ваших питомцев. Скидки до 50% на выбранные товары!</p>
                                        <button className="btn-primary">Смотреть все акции</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Категории товаров */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Категории товаров</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-500 text-2xl">🐕</span>
                                </div>
                                <h3 className="font-medium">Товары для собак</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-500 text-2xl">🐈</span>
                                </div>
                                <h3 className="font-medium">Товары для кошек</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-500 text-2xl">🐹</span>
                                </div>
                                <h3 className="font-medium">Товары для грызунов</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-500 text-2xl">🐦</span>
                                </div>
                                <h3 className="font-medium">Товары для птиц</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Популярные товары */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Популярные товары</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <img 
                                        src={`https://via.placeholder.com/300x300?text=Товар ${index + 1}`} 
                                        alt={`Товар ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    {index % 2 === 0 && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                                            -20%
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium mb-2">Корм для животных Premium</h3>
                                    <div className="flex items-center mb-2">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                            <svg 
                                                key={starIndex} 
                                                className={`w-4 h-4 ${starIndex < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                fill="currentColor" 
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-gray-500 text-xs ml-1">(42)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {index % 2 === 0 ? (
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 line-through mr-2">1200 ₽</span>
                                                    <span className="text-orange-500 font-bold">960 ₽</span>
                                                </div>
                                            ) : (
                                                <span className="text-orange-500 font-bold">1200 ₽</span>
                                            )}
                                        </div>
                                        <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Подписка на рассылку */}
            <section className="py-12 bg-orange-500 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Подпишитесь на наши акции</h2>
                        <p className="mb-6">Получайте уведомления о новых акциях и специальных предложениях первыми!</p>
                        
                        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Ваш email"
                                className="flex-grow py-2 px-4 rounded-md focus:outline-none text-gray-800"
                            />
                            <button type="submit" className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700">
                                Подписаться
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
