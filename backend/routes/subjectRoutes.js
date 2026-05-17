import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSubjects, createSubject, deleteSubject } from "../controllers/subjectController.js";
 
const router = express.Router();
 
router.get   ("/",       protect, getSubjects);
router.post  ("/",       protect, createSubject);
router.delete("/:id",   protect, deleteSubject);
 
export default router;