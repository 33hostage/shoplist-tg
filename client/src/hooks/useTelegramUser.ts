import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

export function useTelegramUser() {
	const [user, setUser] = useState<TelegramUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			const tg = window.Telegram.WebApp
			const userData = tg.initDataUnsafe?.user
			if (userData) {
				setUser({
					id: userData.id,
					first_name: userData.first_name,
					username: userData.username
				})
			}
		}
		setIsLoading(false)
	}, [])

	return { user, isLoading }
}