import express from 'express';
import { startStudySession, stopStudySession, getStudyHistory } from '../controllers/studyController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const studyRouter = express.Router();

studyRouter.post('/start', protect, startStudySession);
studyRouter.post('/stop', protect, stopStudySession);
studyRouter.get('/history', protect, getStudyHistory); 

export default studyRouter;