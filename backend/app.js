import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import errorHandler from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/upload', uploadRoutes)

// Error handler (register after routes)
app.use(errorHandler)

export { app }
