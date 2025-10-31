import express from 'express';
import "dotenv/config";
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import { connectToDb } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from "cors"
const PORT = process.env.PORT
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //allow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
    connectToDb()
})