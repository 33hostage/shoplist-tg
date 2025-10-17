import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Health-check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Запросы с фронта
app.use(
  cors({
    origin: [
      'http://localhost:3000', // для dev
      process.env.CLIENT_URL || 'https://your-frontend-domain.vercel.app', // для prod
    ].filter(Boolean),
    credentials: true,
  })
);

// API routes
app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`✅ Бэкенд запущен на http://localhost:${PORT}`)
})

app.use(errorHandler);