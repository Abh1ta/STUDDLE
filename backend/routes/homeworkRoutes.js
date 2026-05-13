import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHomework, createHomework, deleteHomework } from "../controllers/homeworkController.js";
 
const router = express.Router();
 
router.get   ("/",     protect, getHomework);
router.post  ("/",     protect, createHomework);
router.delete("/:id", protect, deleteHomework);
 
export default router;