"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import WelcomePage from "./welcome/page"
import HomePageContent from "./home-content"

export default function Page() {
	const { user, isLoading } = useTelegramUser()
	const [showWelcome, setShowWelcome] = useState(true)
	const [sessionChecked, setSessionChecked] = useState(false)

	useEffect(() => {
		if (!isLoading) {
			const shouldShowWelcome = sessionStorage.getItem("show_welcome")

			if (shouldShowWelcome === "false") {
				setShowWelcome(false)
			} else {
				setShowWelcome(true)
				sessionStorage.setItem("show_welcome", "true")
			}
			setSessionChecked(true)
		}
	}, [isLoading])

	// Если пользователь авторизован и sessionChecked = true, решаем что показывать
	if (!sessionChecked || isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
					<p className="mt-2 text-gray-600 dark:text-gray-300">Загрузка...</p>
				</div>
			</div>
		)
	}

	// Если нужно показать welcome screen
	if (showWelcome) {
		return (
			<WelcomePage
				onContinue={() => {
					sessionStorage.setItem("show_welcome", "false")
					setShowWelcome(false)
				}}
			/>
		)
	}

	return <HomePageContent />
}
