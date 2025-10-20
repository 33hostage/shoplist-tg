"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"
import WelcomeScreen from "@/components/WelcomeScreen"
import HomePageContent from "./home-content"
import { useRouter, useSearchParams } from "next/navigation"

export default function Page() {
	const { user, isLoading } = useUser()
	const [showWelcome, setShowWelcome] = useState(true)
	const [sessionChecked, setSessionChecked] = useState(false)

	const router = useRouter()
  const searchParams = useSearchParams()
  const sharedListId = searchParams.get('listId')

	useEffect(() => {
		// Если listId присутствует в URL и пользователь авторизован
		if (!isLoading && sharedListId) {
			// Это критический момент: если пользователь пришел по ссылке, 
      // перенаправляем его, игнорируя WelcomeScreen и главный экран.
			router.replace(`/list/${sharedListId}`)
			return
		}

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
	}, [isLoading, sharedListId, router])

	// Если пользователь авторизован и sessionChecked = true, решаем что показывать
	if (!sessionChecked || isLoading || sharedListId) {
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
			<WelcomeScreen
				onContinue={() => {
					sessionStorage.setItem("show_welcome", "false")
					setShowWelcome(false)
				}}
			/>
		)
	}

	return <HomePageContent />
}
