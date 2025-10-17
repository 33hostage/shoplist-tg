import { Request, Response, NextFunction } from "express"
import { verifyTelegramData } from "../utils/verifyTelegram"

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			id: number
			first_name: string
			username?: string
		}
	}
}

export const authenticateTelegram = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const initData = req.headers["x-telegram-init-data"] as string
	const botToken = process.env.BOT_TOKEN

	if (!initData || !botToken) {
		return res.status(401).json({ error: "Missing auth data" })
	}

	if (!verifyTelegramData(initData, botToken)) {
		return res.status(403).json({ error: "Invalid signature" })
	}

	try {
		const params = new URLSearchParams(initData)
		const userJson = params.get("user")
		if (!userJson) {
			return res.status(400).json({ error: "User data missing" })
		}

		const user = JSON.parse(userJson)
		req.user = {
			id: user.id,
			first_name: user.first_name,
			username: user.username || undefined,
		}
		next()
	} catch (e) {
		return res.status(400).json({ error: "Invalid user data" })
	}
}
