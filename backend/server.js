import app from './app.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socketHandler.js";

connectDB();
connectCloudinary();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

initSocket(httpServer, io);
httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port 5000`);
});