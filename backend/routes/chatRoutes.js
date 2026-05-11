import express from "express";
import {
  getConversation,
  getConversationList,
  markAsRead,
  getUserFiles,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversationList);

router.get("/:friendId", getConversation);

router.put("/:friendId/read", markAsRead);

router.get("/files/mine", getUserFiles);

export default router;