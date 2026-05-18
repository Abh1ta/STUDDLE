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
import { protect } from "../middleware/authMiddleware.js"; 
const router = express.Router();

router.use(protect);

<<<<<<< HEAD
router.get("/", getFullAccountSettings);          
=======
router.get("/", getFullAccountSettings);         
>>>>>>> origin/feature/update

router.get("/preferences", getUserSettings);       
router.put("/preferences", createOrUpdateUserSettings); 
router.post("/preferences/reset", resetUserSettings);   

router.get("/avatar", getAvatar);                  
router.put("/avatar", createOrUpdateAvatar);       
router.post("/avatar/reset", resetAvatar);         
<<<<<<< HEAD
=======

>>>>>>> origin/feature/update
export default router;