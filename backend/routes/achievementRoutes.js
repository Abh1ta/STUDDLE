import express from "express";
import {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";
import upload from "../middleware/multer.js"; 

const router = express.Router();

router.get("/", getAllAchievements);
router.get("/:id", getAchievementById);
router.post("/", upload.single("icon"), createAchievement);
router.put("/:id", upload.single("icon"), updateAchievement);
router.delete("/:id", deleteAchievement);

export default router;