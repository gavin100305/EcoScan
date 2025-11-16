import express from "express"
import cors from "cors"
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import uploadRoutes from "./src/routes/upload.routes.js"
import scanRoutes from "./src/routes/scan.routes.js"
import errorHandler from './src/middlewares/error.middleware.js'

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://eco-scan-self.vercel.app",
    "https://eco-scan-five.vercel.app/",
  ];
  
    // Allow all origins (temporary - useful for testing & deployments)
    // NOTE: For production, restrict this to your app origins.
    app.use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

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
