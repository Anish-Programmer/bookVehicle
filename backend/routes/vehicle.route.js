import express from 'express';
import { createVehicle, deleteVehicle, getAllVehicles, getAvailableVehicles, getVehiclesByCategory, toggleAvailableVehicle } from '../controllers/vehicle.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get("/", protectRoute, adminRoute,  getAllVehicles)
router.get("/available", getAvailableVehicles);
router.get("/category/:category", getVehiclesByCategory);






router.post("/", protectRoute, adminRoute, createVehicle);

router.delete("/:id", protectRoute, adminRoute, deleteVehicle);

router.patch("/:id", protectRoute, adminRoute, toggleAvailableVehicle);


export default router