export interface TelegramWebApp {
	ready: () => void
	expand: () => void
	close: () => void
	sendData: (data: string) => void
	initData: string
	initDataUnsafe?: {
		user?: {
			id: number
			first_name: string
			username?: string
		}
		auth_date: number
		hash: string
		start_param?: string
	}
	colorScheme?: "light" | "dark"
	onEvent: (eventType: string, callback: () => void) => void
	offEvent: (eventType: string, callback: () => void) => void
}

declare global {
	interface Window {
		Telegram?: {
			WebApp: TelegramWebApp
		}
	}
}

export {}
