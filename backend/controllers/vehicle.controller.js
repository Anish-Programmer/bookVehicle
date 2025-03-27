
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Vehicle from "../models/vehicle.model.js";


export const getAllVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({}); // find all vehicles
		res.json({ vehicles });
	} catch (error) {
		console.log("Error in getAllVehicles controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAvailableVehicles = async (req, res) => {
	try {
		let availableVehicles = await redis.get("available_Vehicles");
		if (availableVehicles) {
			return res.json(JSON.parse(availableVehicles));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		availableVehicles = await Vehicle.find({ isAvailable: true }).lean();

		if (!availableVehicles) {
			return res.status(404).json({ message: "No available vehicles found" });
		}

		// store in redis for future quick access

		await redis.set("available_vehicles", JSON.stringify(availableVehicles));

		res.json(availableVehicles);
	} catch (error) {
		console.log("Error in getAvailableVehicles controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createVehicle = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "vehicles" });
		}

		const vehicle = await Vehicle.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(vehicle);
	} catch (error) {
		console.log("Error in createVehicle controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findById(req.params.id);

		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}

		if (vehicle.image) {
			const publicId = vehicle.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`vehicles/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Vehicle.findByIdAndDelete(req.params.id);

		res.json({ message: "Vehicle deleted successfully" });
	} catch (error) {
		console.log("Error in deleteVehicle controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};



export const getVehiclesByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const vehicles = await Vehicle.find({ category });
		res.json({ vehicles });
	} catch (error) {
		console.log("Error in getVehiclesByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleAvailableVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findById(req.params.id);
		if (vehicle) {
			vehicle.isAvailable = !vehicle.isAvailable;
			const updatedVehicle = await vehicle.save();
			await updateAvailableVehiclesCache();
			res.json(updatedVehicle);
		} else {
			res.status(404).json({ message: "Vehicle not found" });
		}
	} catch (error) {
		console.log("Error in toggleAvailableVehicle controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateAvailableVehiclesCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const availableVehicles = await Vehicle.find({ isAvailable: true }).lean();
		await redis.set("available_vehicles", JSON.stringify(availableVehicles));
	} catch (error) {
		console.log("error in update cache function");
	}
}
