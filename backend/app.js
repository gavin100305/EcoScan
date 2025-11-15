import express from "express"
import cors from "cors"
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import uploadRoutes from "./src/routes/upload.routes.js"
import scanRoutes from "./src/routes/scan.routes.js"
import errorHandler from './src/middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/scans', scanRoutes)

// Error handler (register after routes)
app.use(errorHandler)

export { app }
