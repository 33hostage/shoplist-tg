import { useState, useEffect } from "react"

interface TelegramUser {
	id: number
	first_name: string
	username?: string
	authToken?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useTelegramUser() {
	const [user, setUser] = useState<TelegramUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const authenticateUser = async () => {
			
			setTimeout(async () => {
				setIsLoading(true)
				if (
					typeof window === "undefined" ||
					!window.Telegram ||
					!window.Telegram.WebApp
				) {
					console.warn("Telegram WebApp не найдено. (Не в Telegram?)")
					setIsLoading(false)
					return
				}

				const tg = window.Telegram.WebApp
				tg.ready()
				tg.expand()

				const initData = tg.initData

				try {
					if (initData && API_URL) {
						const response = await fetch(`${API_URL}/auth/login`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Telegram-Auth-Data": initData,
							},
							body: JSON.stringify({}),
						})

						if (response.ok) {
							const { userData, token } = await response.json()
							setUser({
								id: userData.id,
								first_name: userData.first_name,
								username: userData.username,
								authToken: token,
							})
							console.log("✅ Авторизация успешна.")
						} else {
							console.error(`Авторизация не удалась. Код: ${response.status}`)
						}
					} else {
						console.log("WebApp готова, но initData или API_URL пуста.")
					}
				} catch (error) {
					console.error("Критическая ошибка при Fetch:", error)
				} finally {
					setIsLoading(false)
				}
			}, 0)
		}
		authenticateUser()
	}, [])

	return { user, isLoading }
}
