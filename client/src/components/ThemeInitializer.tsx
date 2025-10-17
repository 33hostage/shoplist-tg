'use client'

import { useEffect } from 'react';

export function ThemeInitializer() {
	useEffect(() => {
		if (typeof window === 'undefined' || !window.Telegram?.WebApp) return

		const tg = window.Telegram.WebApp
		const theme = tg.colorScheme || 'light'

		document.body.classList.toggle('dark', theme === 'dark')

	}, [])

	return null
}