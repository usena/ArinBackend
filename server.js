import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { auth_routes } from './routes/auth.routes.js'
import { user_routes } from './routes/user.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/services/user', user_routes)
app.use('/services/auth', auth_routes)

mongoose.set("strictQuery", true)
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err))

app.get('/', (req, res) => {
    res.send("Server is working!")
})

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
})