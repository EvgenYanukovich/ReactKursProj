import { FC, useState, useContext, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const Login: FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError("Пожалуйста, заполните все поля");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const success = await login(email, password);

			if (success) {
				navigate("/"); // Перенаправление на главную страницу после успешного входа
			} else {
				setError("Неверный email или пароль");
			}
		} catch (err) {
			setError("Произошла ошибка при входе");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
			<div className="form-container">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Вход в аккаунт
				</h2>

				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
						role="alert"
					>
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-gray-700 text-sm font-medium mb-2"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							className="input-field"
							placeholder="Введите ваш email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="password"
							className="block text-gray-700 text-sm font-medium mb-2"
						>
							Пароль
						</label>
						<input
							id="password"
							type="password"
							className="input-field"
							placeholder="Введите ваш пароль"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button type="submit" className="btn-primary w-full" disabled={loading}>
						{loading ? "Вход..." : "Войти"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Еще нет аккаунта?{" "}
						<Link
							to="/register"
							className="text-orange-500 hover:text-orange-600 font-medium"
						>
							Зарегистрироваться
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
