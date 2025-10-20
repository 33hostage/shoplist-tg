"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"

const APP_VERSION = "1.0.0"

export default function WelcomePage() {
	const router = useRouter()
	const { user } = useUser()
	const [showContent, setShowContent] = useState(false)

	const handleContinue = () => {
		router.replace("/")
	}

	// Показываем контент и запускаем таймер
	useEffect(() => {
		setShowContent(true)

		// Автоматический переход через 3 секунды
		const timer = setTimeout(() => {
			handleContinue() // Вызываем внутреннюю функцию
		}, 3000)

		return () => clearTimeout(timer)
	}, [router])

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
			<div
				className={`text-center fade-in-up ${
					showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
				}`}
			>
				{/* Логотип */}
				<div className="mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl inline-block mx-auto">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-16 w-16 text-blue-500 mx-auto"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
							<polyline points="10 9 9 9 8 9" />
						</svg>
					</div>
				</div>

				{/* Название приложения */}
				<h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
					Simple List
				</h1>

				{/* Описание */}
				<p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
					Создавайте списки покупок и задач, делитесь ими с друзьями в реальном
					времени
				</p>

				{/* Информация для пользователя */}
				{user && (
					<p className="mt-6 text-gray-500 dark:text-gray-400">
						Привет, {user.first_name}!
					</p>
				)}
			</div>

			<div className="absolute bottom-4 text-center">
				<p className="text-sm text-gray-500 dark:text-gray-400">
					© {new Date().getFullYear()} Simple List v{APP_VERSION}
				</p>
			</div>
		</div>
	)
}
