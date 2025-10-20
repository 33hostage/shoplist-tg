import fetch from "node-fetch"

const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = "https://shoplist-tg.vercel.app/"

async function handleTelegramMessage(message: any) {
	const chatId = message.chat.id
	const text = message.text
	const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

	if (text && text.startWith("/start")) {
		const payload = text.substring(6).trim()

		if (payload.startWith("app_")) {
			const listId = payload.substring(4)
			const webAppUrl = `${WEB_APP_URL}?listId=${listId}`

			const buttonPayload = {
				chat_id: chatId,
				text: "Нажмите, чтобы открыть совместный список",
				reply_markup: {
					inline_keyboard: [
						[{ text: "Открыть список", web_app: { url: webAppUrl } }],
					],
				},
			}

			await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(buttonPayload),
			})
		} else {
			const simplePayload = {
				chat_id: chatId,
				text: "Привет! Я бот для совместного управления списками. Воспользуйтесь меню или поделитесь ссылкой на список.",
			}

			await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(simplePayload),
			})
		}
	}
}

export default handleTelegramMessage;