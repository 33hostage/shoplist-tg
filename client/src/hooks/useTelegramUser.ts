import { useState, useEffect, useCallback } from "react"

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

	const fetchAuth = useCallback(async (initData: string) => {
		setIsLoading(true)
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
				console.warn("WebApp готова, но initData или API_URL пуста.")
			}
		} catch (error) {
			console.error("Критическая ошибка при Fetch:", error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		if (typeof window === "undefined" || !window.Telegram?.WebApp) {
			console.warn("Telegram API не найдено. Завершение загрузки.")
			setIsLoading(false)
			return
		}

		const tg = window.Telegram.WebApp

		const checkReadyAndAuth = () => {
			tg.ready()
			tg.expand()
			console.log("Текущий tg.initData:", tg.initData);

			if (tg.initData) {
				fetchAuth(tg.initData)
			} else {
				console.log("WebApp найдено, но initData отсутствует. Ждем...")

				const checkTimer = setTimeout(() => {
					const updatedInitData = tg.initData
					if (updatedInitData) {
						fetchAuth(updatedInitData)
					} else {
						console.error("Таймаут: initData не получен через 3 секунды.")
						setIsLoading(false)
					}
				}, 3000)

				return () => clearTimeout(checkTimer)
			}
		}

		const initialTimeout = setTimeout(checkReadyAndAuth, 50)

		return () => clearTimeout(initialTimeout)
	}, [fetchAuth])

	return { user, isLoading }
}
