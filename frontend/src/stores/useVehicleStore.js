import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useVehicleStore = create((set) => ({
	vehicles: [],
	loading: false,

	setVehicles: (vehicles) => set({ vehicles }),
	createVehicle: async (vehicleData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/vehicles", vehicleData);
			set((prevState) => ({
				vehicles: [...prevState.vehicles, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllVehicles: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/vehicles");
			console.log("Fetched Vehicles:", response.data); // Debugging: Log API response
			set({ vehicles: response.data.vehicles, loading: false });
			
		} catch (error) {
			set({ error: "Failed to fetch vehicles", loading: false });
			toast.error(error.response.data.error || "Failed to fetch Vehicles");
		}
	},
	fetchVehiclesByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/vehicles/category/${category}`);
			set({ vehicles: response.data.vehicles, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch Vehicles", loading: false });
			toast.error(error.response.data.error || "Failed to fetch Vehicles");
		}
	},
	deleteVehicle: async (vehicleId) => {
		set({ loading: true });
		try {
			await axios.delete(`/vehicles/${vehicleId}`);
			set((prevVehicles) => ({
				vehicles: prevVehicles.vehicles.filter((vehicle) => vehicle._id !== vehicleId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete Vehicles");
		}
	},
	toggleAvailableVehicle: async (vehicleId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/vehicles/${vehicleId}`);
			// this will update the isAvailable prop of the vehicle
			set((prevVehicles) => ({
				vehicles: prevVehicles.vehicles.map((vehicle) =>
					vehicle._id === vehicleId ? { ...vehicle, isAvailable: response.data.isAvailable } : vehicle
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update Vehicle");
		}
	},
	fetchAvailableVehicles: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/vehicles/available");
			set({ vehicles: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch Vehicles", loading: false });
			console.log("Error fetching available Vehicle:", error);
		}
	},
}));
