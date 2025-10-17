"use client"

import { useEffect } from "react"
import type { TelegramWebApp } from "@/types/telegram"

export function ThemeInitializer() {
	useEffect(() => {
		if (typeof window === "undefined" || !window.Telegram?.WebApp) return

		const tg = window.Telegram.WebApp as TelegramWebApp
		const theme = tg.colorScheme || "light"

		document.body.classList.toggle("dark", theme === "dark")
	}, [])

	return null
}
