import toast from "react-hot-toast";

import { ClipboardList } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useBookListStore } from "../stores/useBookListStore";

import { useVehicleStore } from "../stores/useVehicleStore";

const VehicleCard = ({ vehicle }) => {
	const { user } = useUserStore();
	const { addToBookList } = useBookListStore();


	// const { vehicle } = useVehicleStore();

	const handleAddToBookList = () => {
		if (!user) {
			toast.error("Please login to add vehciles in book list", { id: "login" });
			return;
		} else {
			// add to bookList
			addToBookList(vehicle);
		}
	};

	// debug code

	// console.log("Vehicle Image URL:", vehicle.image);
	// console.log("Vehicle Name URL:", vehicle.name);


	// console.log("Vehicle Object in VehicleCard:", vehicle);



	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
			<img
				className='object-cover w-full'
				src={vehicle.image}
				alt="vehicle image"
			/>
		
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{vehicle.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>₹ {vehicle.price}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToBookList}
				>
					<ClipboardList size={22} className='mr-2' />
					Add to BookList
				</button>
			</div>
		</div>
	);
};
export default VehicleCard;
