import express from 'express';
import "dotenv/config";
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import { connectToDb } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from "cors"
import path from "path"
const PORT = process.env.PORT
const app = express();

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //allow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
    connectToDb()
})