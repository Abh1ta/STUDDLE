import "dotenv/config";
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from "./routes/fileRoutes.js";
import connectCloudinary from './config/cloudinary.js'
import settingsRoutes from "./routes/settingsRoutes.js";
import friendshipRoutes from "./routes/friendshipRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import userAchievementRoutes from "./routes/userAchievementRoutes.js";
import { createServer } from "http";
import { Server }       from "socket.io";
import { initSocket }   from "./socket/socketHandler.js";
import chatRoutes       from "./routes/chatRoutes.js";
import studyRoutes from './routes/studyRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
//middleware
app.use(express.json())
app.use(cors()) 

//api endpoints
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/user-achievements", userAchievementRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
initSocket(httpServer, io);
httpServer.listen(5000);
app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})