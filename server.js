import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import settingsRoutes from "./routes/settingsRoutes.js";


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())
app.use("/api/settings", settingsRoutes);

//api endpoints
app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})