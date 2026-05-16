import "dotenv/config";
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from "./routes/settingsRoutes.js";
import friendshipRoutes from "./routes/friendshipRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import userAchievementRoutes from "./routes/userAchievementRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import studyRoutes from './routes/studyRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import examRoutes from './routes/examRoutes.js';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/user-achievements", userAchievementRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/exams", examRoutes);

export default app;