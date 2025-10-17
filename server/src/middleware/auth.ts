import { Request, Response, NextFunction } from "express"
import { verifyTelegramData } from "../utils/verifyTelegram"

declare module "express-serve-static-core" {
	interface Request {
		user?: {
			id: string
			first_name: string
			username?: string
			authToken: string
		}
	}
}

export const authenticateTelegram = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const initData = req.headers["telegram-auth-data"] as string
	const botToken = process.env.BOT_TOKEN

	if (!initData) {
		return res.status(401).json({ error: "Missing auth data" })
	}

	if (!botToken) {
		console.error("FATAL: BOT_TOKEN is missing in environment variables.")
		return res.status(500).json({ error: "Server configuration error" })
	}

	console.log("--- AUTH DEBUG ---")
	console.log("InitData received:", initData.substring(0, 50) + "...")
	console.log("BOT_TOKEN status:", botToken ? "Found" : "Missing")
	if (botToken) {
		console.log("BOT_TOKEN length:", botToken.length)
	}
	console.log("--- END DEBUG ---")

	if (!verifyTelegramData(initData, botToken)) {
		return res.status(403).json({ error: "Invalid signature" })
	}

	try {
		const params = new URLSearchParams(initData)
		const userJson = params.get("user")
		if (!userJson) {
			return res.status(400).json({ error: "User data missing from initData" })
		}

		const user = JSON.parse(userJson)
		req.user = {
			id: String(user.id),
			first_name: user.first_name,
			username: user.username || undefined,
			authToken: initData,
		}
		next()
	} catch (e) {
		console.error("Error parsing user data:", e)
		return res.status(400).json({ error: "Invalid user data format" })
	}
}
