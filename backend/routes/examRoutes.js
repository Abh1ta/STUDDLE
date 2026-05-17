import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getExams, createExam, deleteExam } from "../controllers/examController.js";
 
const router = express.Router();
 
router.get   ("/",     protect, getExams);
router.post  ("/",     protect, createExam);
router.delete("/:id", protect, deleteExam);
 
export default router;
 