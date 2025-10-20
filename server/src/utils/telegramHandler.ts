import fetch from "node-fetch"

const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = "https://shoplist-tg.vercel.app/"

async function handleTelegramMessage(message: any) {
	const chatId = message.chat.id
	const text = message.text
	const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

	if (text && text.startsWith("/start")) {
		const payload = text.substring(6).trim()

		if (payload.startsWith("app_")) {
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
	} else if (text === "/help") {
		const helpText = `
			👋 *Привет! Я бот Simple List, твой помощник в совместных списках.*

		*Как начать:*

			1. Нажмите на кнопку "Открыть списки" в меню ввода (или команду /newlist).
			2. Создайте новый список в Simple List App.

		*Как поделиться списком:*
		
			1. Откройте любой список.
			2. Нажмите кнопку "Поделиться списком".
			3. Отправьте сгенерированную ссылку другу.

		Когда друг перейдет по ссылке, я отправлю ему кнопку, чтобы он сразу открыл ваш общий список!
			  `

		const helpPayload = {
			chat_id: chatId,
			text: helpText.trim(),
			parse_mode: "Markdown",
		}

		await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(helpPayload),
		})
	}
}

export default handleTelegramMessage
