import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        postalCode: '',
        address: '',
        currentPassword: '',
        newPassword: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                city: '',
                postalCode: '',
                address: currentUser.address || '',
                currentPassword: '',
                newPassword: ''
            });
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Здесь будет логика сохранения данных пользователя
        console.log('Сохранение данных пользователя:', formData);
        
        // Показываем сообщение об успешном сохранении
        setShowSuccess(true);
        
        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex justify-center items-center mb-4">
                                <span className="text-orange-500 text-2xl font-bold">
                                    {currentUser?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
                            <p className="text-gray-500 text-sm">{currentUser?.email}</p>
                        </div>
                        
                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/profile" className="flex items-center py-2 px-3 rounded-md bg-orange-50 text-orange-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Личные данные
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/orders" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                        </svg>
                                        История заказов
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/favorites" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                        Избранное
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={logout} 
                                        className="w-full flex items-center py-2 px-3 rounded-md text-red-500 hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V9z" clipRule="evenodd" />
                                        </svg>
                                        Выйти
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                
                <div className="md:w-3/4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Личные данные</h2>
                        
                        {showSuccess && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                                Данные успешно сохранены!
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                                            Имя
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field"
                                            disabled
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Email нельзя изменить</p>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                                            Телефон
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="+7 (999) 123-45-67"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4">Адрес доставки</h3>
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                                            Город
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-2">
                                            Индекс
                                        </label>
                                        <input
                                            id="postalCode"
                                            name="postalCode"
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                                            Улица, дом, квартира
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="ул. Пушкина, д. 10, кв. 5"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4">Изменить пароль</h3>
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-medium mb-2">
                                            Текущий пароль
                                        </label>
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                                            Новый пароль
                                        </label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                                >
                                    Сохранить изменения
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
