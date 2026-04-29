import express from "express";
import {
  getUserSettings,
  createOrUpdateUserSettings,
  resetUserSettings,
  getAvatar,
  createOrUpdateAvatar,
  resetAvatar,
  getFullAccountSettings,
} from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js"; // middleware-ul tău de auth
const router = express.Router();

router.use(protect);

router.get("/", getFullAccountSettings);           // GET  /api/settings

router.get("/preferences", getUserSettings);       // GET  /api/settings/preferences
router.put("/preferences", createOrUpdateUserSettings); // PUT  /api/settings/preferences
router.post("/preferences/reset", resetUserSettings);   // POST /api/settings/preferences/reset

router.get("/avatar", getAvatar);                  // GET  /api/settings/avatar
router.put("/avatar", createOrUpdateAvatar);       // PUT  /api/settings/avatar
router.post("/avatar/reset", resetAvatar);         // POST /api/settings/avatar/reset

export default router;