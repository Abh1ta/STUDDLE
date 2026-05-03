import express from "express";
import {
  getUserAchievements,
  getUserAchievementById,
  awardAchievement,
  revokeAchievement,
  getUserTotalXP,
} from "../controllers/userAchievementController.js";

const router = express.Router();

router.get("/user/:userId", getUserAchievements);
router.get("/user/:userId/xp", getUserTotalXP);
router.get("/:id", getUserAchievementById);
router.post("/", awardAchievement);
router.delete("/:id", revokeAchievement);

export default router;