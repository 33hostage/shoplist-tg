import { useState, useEffect } from "react"

interface TelegramUser {
	id: number
	first_name: string
	username?: string
	authToken?: string;
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
				const initData = tg.initData

				tg.ready()

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

						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`)
						}

						const { userData, token } = await response.json()

						setUser({
							id: userData.id,
							first_name: userData.first_name,
							username: userData.username,
							authToken: token,
						})
					} catch (error) {
						console.error("Ошибка авторизации:", error)
					}
				}
			}
			setIsLoading(false)
		}
		authenticateUser()
	}, [])

	return { user, isLoading }
}
