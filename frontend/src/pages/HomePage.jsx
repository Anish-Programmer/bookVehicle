

import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useVehicleStore } from "../stores/useVehicleStore";
import AvailableVehicles from "../components/AvailableVehicles";

const categories = [
	{ href: "/sajhayatayat", name: "SajhaYatayat", imageUrl: "/SajhaYatayat.jpg" },
	{ href: "/scorpio", name: "Scorpio", imageUrl: "/Scorpio.jpg" },
	{ href: "/bolero", name: "Bolero", imageUrl: "/Bolero.png" },
	{ href: "/nagarikyatayat", name: "NagarikYatayat", imageUrl: "/NagarikYatayat.jpg" },
	{ href: "/magicvan", name: "MagicVan", imageUrl: "/MagicVan.jpg" },
	{ href: "/auto", name: "Auto", imageUrl: "/Auto.jpg" },
];


const HomePage = () => {
	const { fetchAvailableVehicles, vehicles, isLoading } = useVehicleStore();

	useEffect(() => {
		fetchAvailableVehicles();
	}, [fetchAvailableVehicles]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Book Our Vehicles
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					For Picinic, tour, travel etc
				</p>


				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && vehicles.length > 0 && <AvailableVehicles availableVehicles={vehicles} />}
			</div>
		</div>
	);
};
export default HomePage;

