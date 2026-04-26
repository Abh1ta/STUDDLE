import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import 'dotenv/config'

//app config
const app = express()
const port = process.env.PORT || 4000

// connect to MongoDB
connectDB();

//middleware
app.use(express.json())
app.use(cors())

//api endpoints
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})