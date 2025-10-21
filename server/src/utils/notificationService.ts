import fetch from "node-fetch"
import { List } from "@prisma/client"

const BOT_TOKEN = process.env.BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

interface Recipient {
	id: bigint | string // ID получателя
}

/**
 * Отправляет сообщение в Telegram.
 * @param recipientId ID чата (пользователя) для отправки.
 * @param text Текст уведомления.
 */
export const sendTelegramNotification = async (
	recipientId: bigint,
	text: string
) => {
	if (!BOT_TOKEN) {
		console.error("BOT_TOKEN is not defined. Cannot send notification.")
		return
	}

	const payload = {
		chat_id: recipientId.toString(), // ID пользователя должен быть строкой для API
		text: text,
		parse_mode: "Markdown",
	}

	try {
		await fetch(`${API_URL}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		})
	} catch (error) {
		console.error(`Error sending notification to ${recipientId}:`, error)
	}
}
