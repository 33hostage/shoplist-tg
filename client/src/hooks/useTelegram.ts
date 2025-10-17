import { useEffect } from "react";

declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				ready: () => void
				expand: () => void
				close: () => void
				sendData: (data: string) => void
				initData: string;
				initDataUnsafe?: {
					user?: {
						id: number
						first_name: string
						username?: string
					}
					start_param?: string // для deep linking
				}
			}
		}
	}
}

export const useTelegram = () => {
	useEffect(() => {
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()
			window.Telegram.WebApp.expand()
		}
	}, [])

	return typeof window !== 'undefined' ? window.Telegram?.WebApp : null
}