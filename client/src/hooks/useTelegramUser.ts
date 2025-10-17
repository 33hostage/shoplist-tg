import { useState, useEffect, useCallback } from "react"

interface TelegramUser {
	id: string
	first_name: string
	username?: string
	authToken?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useTelegramUser() {
	const [user, setUser] = useState<TelegramUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isTelegramReady, setIsTelegramReady] = useState(false)

	const fetchAuth = useCallback(async (initData: string) => {
		setIsLoading(true)
		try {
			if (initData && API_URL) {
				const controller = new AbortController()
				const id = setTimeout(() => controller.abort(), 10000)
				const response = await fetch(`${API_URL}/api/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Telegram-Auth-Data": initData,
					},
					body: JSON.stringify({}),
					signal: controller.signal,
				})
				clearTimeout(id)

				if (response.ok) {
					const { userData, token } = await response.json()
					setUser({
						id: String(userData.id),
						first_name: userData.first_name,
						username: userData.username,
						authToken: token,
					})
					console.log("✅ Авторизация успешна.")
				} else {
					console.error(`Авторизация не удалась. Код: ${response.status}`)
				}
			} else {
				console.warn("InitData или API_URL пусты. Аутентификация пропущена.")
			}
		} catch (error: any) {
			if (error.name === "AbortError") {
				console.error("Fetch-запрос был прерван по таймауту (10с).")
			} else {
				console.error("Критическая ошибка при Fetch:", error)
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		if (typeof window === "undefined") {
			setIsLoading(false)
			return
		}

		let attempts = 0
		const maxAttempts = 50

		const checkTelegram = () => {
			if (window.Telegram?.WebApp) {
				//  Объект найден!
				setIsTelegramReady(true)
			} else if (attempts < maxAttempts) {
				// Объект еще не найден, продолжаем опрос
				attempts++
				setTimeout(checkTelegram, 100)
			} else {
				// ❌ Таймаут 5 секунд - SDK не загружен
				console.error("Таймаут: Telegram WebApp SDK не загружен за 5 секунд.")
				setIsLoading(false)
			}
		}

		setIsLoading(true) // Начало загрузки
		checkTelegram()
	}, [])

	useEffect(() => {
		if (isTelegramReady) {
			const tg = window.Telegram!.WebApp // !-оператор безопасен // Инициализация
			tg.ready()
			tg.expand()

			if (tg.initData) {
				fetchAuth(tg.initData)
			} else {
				console.warn(
					"Telegram WebApp готово, но initData отсутствует. Завершаем загрузку."
				)
				setIsLoading(false)
			}
		}
	}, [isTelegramReady, fetchAuth])

	return { user, isLoading }
}
