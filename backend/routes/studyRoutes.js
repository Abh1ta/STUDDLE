import express from 'express';
import { 
  startStudySession, 
  stopStudySession, 
  getStudyHistory, 
  getStudyStats,
  getFriendStudyStats
} from '../controllers/studyController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const studyRouter = express.Router();

studyRouter.post('/start', protect, startStudySession);
studyRouter.post('/stop', protect, stopStudySession);
studyRouter.get('/history', protect, getStudyHistory); 
studyRouter.get('/stats/:friendId', protect, getFriendStudyStats); 
studyRouter.get('/stats', protect, getStudyStats); 

export default studyRouter;
