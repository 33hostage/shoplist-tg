import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import routes from "./routes"
import { errorHandler } from "./middleware/errorHandler"
import handleTelegramMessage from "./utils/telegramHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Маршрут для Telegram Webhook
app.post('/telegram/webhook', async (req, res) => {
	const update = req.body

	if (update.message) {
		await handleTelegramMessage(update.message)
	}

	res.status(200).send('OK')
})

app.get("/", (req, res) => {
	res.status(200).json({ status: "ok", service: "backend" })
})

// Health-check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Запросы с фронта
app.use(
	cors({
		// Разрешаем все домены (для работы в Telegram WebApp)
		origin: "*",
		// Разрешаем нужные HTTP-методы
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		// Разрешаем все необходимые заголовки (включая наш Telegram-Auth-Data)
		allowedHeaders: ["Content-Type", "Authorization", "Telegram-Auth-Data"],
	})
)

/* app.options('*', cors()); */

// API routes
app.use("/api", routes)

app.listen(PORT, () => {
	console.log(`✅ Бэкенд запущен на http://localhost:${PORT}`)
})

app.use(errorHandler)
