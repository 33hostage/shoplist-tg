import { toast } from "sonner"

/**
 * Универсальная функция обработки ошибок API
 * @param error — объект ошибки
 * @param defaultMessage — сообщение по умолчанию
 */

export function handleApiError(
	error: any,
	defaultMessage = "⚠️ Ошибка подключения"
) {
	if (error instanceof TypeError && error.message === "Failed to fetch") {
		toast.error("❌ Нет подключения к серверу")
		return
	}

	if (error instanceof Response) {
		// Ошибка от сервера (4xx, 5xx)
		error
			.json()
			.then(data => {
				toast.error(`❌ ${data.error || defaultMessage}`)
			})
			.catch(() => {
				toast.error(defaultMessage)
			})
			return
	}

	// Другие ошибки
	toast.error(defaultMessage)
}
