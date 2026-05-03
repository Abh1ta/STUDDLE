import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    searchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    getFriendsList, 
    deleteFriendship, 
    getPendingRequests 
} from "../controllers/friendshipController.js";

const router = express.Router();


router.get("/search", protect, searchUsers);
router.post("/request", protect, sendFriendRequest);
router.put("/accept", protect, acceptFriendRequest);
router.get("/list", protect, getFriendsList);
router.get("/requests/pending", protect, getPendingRequests); 
router.delete("/:id", protect, deleteFriendship); 

export default router;