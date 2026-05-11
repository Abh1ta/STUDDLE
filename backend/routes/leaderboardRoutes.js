import express from 'express';
import { getGlobalLeaderboard, getFriendsLeaderboard, getMyGlobalRank } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const leaderboardRouter = express.Router();

leaderboardRouter.get('/global', protect, getGlobalLeaderboard);
leaderboardRouter.get('/friends', protect, getFriendsLeaderboard);
leaderboardRouter.get('/my-rank', protect, getMyGlobalRank); 

export default leaderboardRouter;