import type { TelegramWebApp } from "@/types/telegram"

export const mockTelegramWebApp = () => {
	if (typeof window === "undefined") return

	if (process.env.NODE_ENV === "development") {
		const mockInitData =
			"user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%22%2C%22username%22%3A%22roman_dev%22%7D&auth_date=1712345678&hash=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

		const mockWebApp: TelegramWebApp = {
			ready: () => console.log("✅ Telegram WebApp ready (mock)"),
			expand: () => console.log("🔽 Telegram WebApp expanded (mock)"),
			initData: mockInitData,
			initDataUnsafe: {
				user: { id: 123456789, first_name: "Роман", username: "roman_dev" },
				start_param: "list_demo123",
				auth_date: Date.now() / 1000,
				hash: 'MOCK_HASH_FOR_TS_VALIDATION',
			},
			sendData: data => console.log("📤 Send to bot:", data),
			close: () => console.log("❌ Telegram WebApp closed (mock)"),
			onEvent: (eventType, callback) => {
        console.log(`[MOCK] Event listener added for: ${eventType}`)
      },
			offEvent: (eventType, callback) => {
        console.log(`[MOCK] Event listener removed for: ${eventType}`)
      },
		}
		window.Telegram = { WebApp: mockWebApp }

		console.log("🤖 Telegram mock инициализирован")
	}
}
