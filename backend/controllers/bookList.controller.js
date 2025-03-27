
import Vehicle from "../models/vehicle.model.js";

export const getBookListVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({ _id: { $in: req.user.bookListItems } });

		// add quantity for each vehicle
		const bookListItems = vehicles.map((vehicle) => {
			const item = req.user.bookListItems.find((bookListItem) => bookListItem.id === vehicle.id);
			return { ...vehicle.toJSON(), quantity: item.quantity };
		});

		res.json(bookListItems);
	} catch (error) {
		console.log("Error in getBookListVehicles controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const addToBookList = async (req, res) => {
	try {
		const { vehicleId } = req.body;
		const user = req.user;

		const existingItem = user.bookListItems.find((item) => item.id === vehicleId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.bookListItems.push(vehicleId);
		}

		await user.save();
		res.json(user.bookListItems);
	} catch (error) {
		console.log("Error in addToBookList controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromBookList = async (req, res) => {
	try {
		const { vehicleId } = req.body;
		const user = req.user;
		if (!vehicleId) {
			user.bookListItems = [];
		} else {
			user.bookListItems = user.bookListItems.filter((item) => item.id !== vehicleId);
		}
		await user.save();
		res.json(user.bookListItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: vehicleId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.bookListItems.find((item) => item.id === vehicleId);

		if (existingItem) {
			if (quantity === 0) {
				user.bookListItems = user.bookListItems.filter((item) => item.id !== vehicleId);
				await user.save();
				return res.json(user.bookListItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.bookListItems);
		} else {
			res.status(404).json({ message: "Vehicle not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

