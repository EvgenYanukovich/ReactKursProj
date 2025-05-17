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
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";

// Импорт компонентов авторизации
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Импорт контекстов
import { AuthProvider, AuthContext } from "./utils/AuthContext";
import { CartProvider } from "./utils/CartContext";
import { FavoritesProvider } from "./utils/FavoritesContext";
import { ThemeProvider } from "./utils/ThemeContext";
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
		<ThemeProvider>
			<AuthProvider>
				<CartProvider>
					<FavoritesProvider>
						<Router>
					<Routes>
						{/* Страницы авторизации */}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						{/* Основные страницы */}
						<Route path="/" element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path="catalog" element={<CatalogPage />} />
							<Route path="product/:id" element={<ProductPage />} />
							<Route path="sales" element={<SalesPage />} />
							<Route path="blog" element={<BlogPage />} />
							<Route path="blog/:id" element={<BlogPostPage />} />
							<Route path="contacts" element={<ContactsPage />} />
							<Route path="cart" element={<CartPage />} />
							<Route
								path="checkout"
								element={
									<ProtectedRoute>
										<CheckoutPage />
									</ProtectedRoute>
								}
							/>
							<Route path="order-success/:orderId" element={<OrderSuccessPage />} />

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
										<OrdersPage />
									</ProtectedRoute>
								}
							/>
							
							<Route
								path="favorites"
								element={
									<ProtectedRoute>
										<FavoritesPage />
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
				</FavoritesProvider>
			</CartProvider>
		</AuthProvider>
	</ThemeProvider>
	);
}

export default App;
