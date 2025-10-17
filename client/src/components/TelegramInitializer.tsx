"use client"

import { useEffect } from "react"
import { mockTelegramWebApp } from "@/lib/mockTelegram"

export function TelegramInitializer() {
	useEffect(() => {
		if (typeof window !== "undefined" && window.Telegram?.WebApp) {
			console.log("Telegram SDK уже загружен.")
			window.Telegram.WebApp.ready()
			return
		}

		const scriptId = "telegram-web-app-script"

		if (process.env.NODE_ENV === "development") {
			if (!document.getElementById(scriptId)) {
				// Добавляем заглушку для TypeScript и логики
				window.Telegram = {
					WebApp: {
						ready: () => {},
						expand: () => {},
						initData: "mock_init_data",
					} as any,
				}
				mockTelegramWebApp()
				console.log("Development: Инициализирован mock Telegram WebApp.")
			}
		} else {
			if (!document.getElementById(scriptId)) {
				const script = document.createElement("script")
				script.id = scriptId
				script.src = "https://telegram.org/js/telegram-web-app.js"
				script.onload = () => {
					// После загрузки скрипта, вызываем готовность
					if (window.Telegram?.WebApp) {
						window.Telegram.WebApp.ready()
						window.Telegram.WebApp.expand()
						console.log("Production: Telegram SDK загружен и готов.")
					}
				}
				script.onerror = () => {
					console.error(
						"Критическая ошибка: Не удалось загрузить Telegram WebApp SDK."
					)
				}
				document.head.appendChild(script)
			}
		}
	}, [])

	return null
}
