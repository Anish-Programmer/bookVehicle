
import express from "express";
import { addToBookList, getBookListVehicles, removeAllFromBookList, updateQuantity } from "../controllers/bookList.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getBookListVehicles);
router.post("/", protectRoute, addToBookList);
router.delete("/", protectRoute, removeAllFromBookList);
router.put("/:id", protectRoute, updateQuantity);

export default router;



