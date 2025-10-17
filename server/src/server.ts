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

app.get('/', (req, res) => {
    res.status(200).json({ status: "ok", service: "backend" });
});

// Health-check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Запросы с фронта
app.use(
cors({
    origin: '*', // <--- ИЗМЕНИТЬ НА '*' ДЛЯ ОТЛАДКИ.
    credentials: true,
  })
);

// API routes
app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`✅ Бэкенд запущен на http://localhost:${PORT}`)
})

app.use(errorHandler);