import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Импорт компонентов layout
import Layout from "./components/layout/Layout";

// Импорт страниц
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ContactsPage from "./pages/ContactsPage";
import ProfilePage from "./pages/ProfilePage";

// Импорт компонентов авторизации
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Импорт контекстов
import { AuthProvider, AuthContext } from "./utils/AuthContext";
import { CartProvider } from "./utils/CartContext";
import { useContext } from "react";

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
};

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<Router>
					<Routes>
						{/* Страницы авторизации */}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						{/* Основные страницы */}
						<Route path="/" element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path="catalog" element={<CatalogPage />} />
							<Route path="contacts" element={<ContactsPage />} />

							{/* Защищенные маршруты */}
							<Route
								path="profile"
								element={
									<ProtectedRoute>
										<ProfilePage />
									</ProtectedRoute>
								}
							/>

							<Route
								path="orders"
								element={
									<ProtectedRoute>
										<div className="container mx-auto px-4 py-8">
											<h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
											<p>Здесь будет размещена информация о ваших заказах</p>
										</div>
									</ProtectedRoute>
								}
							/>

							<Route
								path="favorites"
								element={
									<ProtectedRoute>
										<div className="container mx-auto px-4 py-8">
											<h1 className="text-3xl font-bold mb-8">Избранное</h1>
											<p>Здесь будут размещены ваши избранные товары</p>
										</div>
									</ProtectedRoute>
								}
							/>

							{/* Страница заглушка для остальных разделов */}
							<Route
								path="*"
								element={
									<div className="container mx-auto px-4 py-8 text-center">
										<h1 className="text-3xl font-bold mb-8">
											Страница в разработке
										</h1>
										<p>Данный раздел находится в процессе разработки</p>
									</div>
								}
							/>
						</Route>
					</Routes>
				</Router>
			</CartProvider>
		</AuthProvider>
	);
}

export default App;
