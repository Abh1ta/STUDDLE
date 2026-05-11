import express from "express";
import { register, login, deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", protect, deleteAccount);

export default router;