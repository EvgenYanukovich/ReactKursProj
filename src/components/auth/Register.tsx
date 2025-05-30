import { FC, useState, useContext, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const Register: FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Проверка обязательных полей
        if (!formData.name || !formData.email || !formData.password) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Проверка совпадения паролей
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        // Проверка длины пароля
        if (formData.password.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            const success = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                address: formData.address || undefined
            });
            
            if (success) {
                navigate('/'); // Перенаправление на главную страницу после успешной регистрации
            } else {
                setError('Пользователь с таким email уже существует');
            }
        } catch (err) {
            setError('Произошла ошибка при регистрации');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-secondary)]">
            <div className="form-container max-w-xl">
                <h2 className="text-2xl font-bold text-center text-[var(--text-secondary)] mb-6">Регистрация</h2>
                
                {error && (
                    <div className="bg-[var(--accent-color)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 rounded mb-4" role="alert">
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Имя <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="input-field"
                            placeholder="Введите ваше имя"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="input-field"
                            placeholder="Введите ваш email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Пароль <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="input-field"
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Подтверждение пароля <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="input-field"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Телефон
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="input-field"
                            placeholder="Введите ваш телефон"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="address" className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                            Адрес
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            className="input-field"
                            placeholder="Введите ваш адрес"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
