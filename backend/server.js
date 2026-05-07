import "dotenv/config";
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from "./routes/fileRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import friendshipRoutes from "./routes/friendshipRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import userAchievementRoutes from "./routes/userAchievementRoutes.js";

// Importuri Rute Noi (ale tale)
import studyRoutes from './routes/studyRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Conexiuni Bază de Date și Servicii
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors()); 

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/user-achievements", userAchievementRoutes);
app.use("/api/files", fileRoutes);

// Endpoints create de tine
app.use("/api/study", studyRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Root Route
app.get('/', (req, res) => {
    res.status(200).send('Studdle Backend is running!');
});

// Server Start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});