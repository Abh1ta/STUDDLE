import express from "express";
import {
  getConversation,
  getConversationList,
  markAsRead,
  getUserFiles,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// idebar list (all chats + last message)
router.get("/conversations", getConversationList);

// full message history with a friend
router.get("/:friendId", getConversation);

//  mark all messages from friend as read
router.put("/:friendId/read", markAsRead);

// user's own files to share in chat
router.get("/files/mine", getUserFiles);

export default router;