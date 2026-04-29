import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import settingsRoutes from "./routes/settingsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import friendshipRoutes from "./routes/friendshipRoutes.js";

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendshipRoutes);

//api endpoints
app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})