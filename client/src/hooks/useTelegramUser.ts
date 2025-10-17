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
			setIsLoading(true)

			if (typeof window !== "undefined" && window.Telegram?.WebApp) {
				const tg = window.Telegram.WebApp
				tg.ready()
				tg.expand()

				const initData = tg.initData

				if (initData && API_URL) {
					try {
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
						} else {
							console.error(`Авторизация не удалась. Код: ${response.status}`)
						}
					} catch (error) {
						console.error("Критическая ошибка при Fetch:", error)
					}
				}
			} else {
				console.log("WebApp готова, но initData пуста.")
			}
			setIsLoading(false)
		}
		authenticateUser()
	}, [])

	return { user, isLoading }
}
