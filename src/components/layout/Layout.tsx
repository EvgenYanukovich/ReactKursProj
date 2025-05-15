import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "../common/Breadcrumbs";

const Layout: FC = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Breadcrumbs />
			<main className="flex-grow">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
