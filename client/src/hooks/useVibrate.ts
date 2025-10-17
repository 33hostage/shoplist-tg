"use client"

/*
 * хук для вибрации устройства
 * @returns функция `vibrate(pattern?: number | number[])`
 */

export function useVibrate() {
	const vibrate = (pattern: number | number[] = 100) => {
		// Проверяем поддержку
		if (typeof window == "undefined" || !("vibrate" in navigator)) {
			return
		}

		// Проверяем, не отключена ли вибрация в системе
		if (
			navigator.userAgent.includes("Iphone") ||
			navigator.userAgent.includes("Ipad")
		) {
			return
		}

		try {
			navigator.vibrate(pattern)
		} catch (err) {
			// Игнорируем ошибки (например, в Telegram WebApp)
		}
	}

	return { vibrate }
}
