'use client'

import { useEffect } from "react"
import { mockTelegramWebApp } from '@/lib/mockTelegram';

export function TelegramInitializer() {
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			mockTelegramWebApp()
		}
	}, [])

	return null
}