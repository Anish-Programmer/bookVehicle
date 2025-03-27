import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useBookListStore = create((set, get) => ({
	bookList: [],
	total: 0,
	subtotal: 0,

	
	getBookListItems: async () => {
		try {
			const res = await axios.get("/bookList");
			set({ bookList: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ bookList: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearBookList: async () => {
		set({ bookList: [], total: 0, subtotal: 0 });
	},
	addToBookList: async (vehicle) => {
		try {
			await axios.post("/bookList", { vehicleId: vehicle._id });
			toast.success("Vehicle added to bookList");

			set((prevState) => {
				const existingItem = prevState.bookList.find((item) => item._id === vehicle._id);
				const newBookList = existingItem
					? prevState.bookList.map((item) =>
							item._id === vehicle._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.bookList, { ...vehicle, quantity: 1 }];
				return { bookList: newBookList };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
			
		}
	},
	removeFromBookList: async (vehicleId) => {
		await axios.delete(`/bookList`, { data: { vehicleId } });
		set((prevState) => ({ bookList: prevState.bookList.filter((item) => item._id !== vehicleId) }));
		get().calculateTotals();
	},
	updateQuantity: async (vehicleId, quantity) => {
		if (quantity === 0) {
			get().removeFromBookList(vehicleId);
			return;
		}

		await axios.put(`/bookList/${vehicleId}`, { quantity });
		set((prevState) => ({
			bookList: prevState.bookList.map((item) => (item._id === vehicleId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
	calculateTotals: () => {
		const { bookList } = get();
		const subtotal = bookList.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		set({ subtotal, total });
	},
}));


