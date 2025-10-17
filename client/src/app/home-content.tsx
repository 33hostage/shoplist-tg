"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ListCard from "@/components/ListCard"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"

interface Task {
	id: string
	text: string
	completed: boolean
}

interface List {
	id: string
	title: string
	tasks: Task[]
	createdAt: string
}

export default function HomePage() {
	const { user, isLoading: userLoading } = useUser()
	const [myLists, setMyLists] = useState<List[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	// Загрузка списков
	useEffect(() => {
		if (userLoading) return
		if (!user) return

		const fetchLists = async () => {
			setLoading(true)
			const initData = (window as any).Telegram?.WebApp?.initData
			if (!initData) {
				setError("Нет данных Telegram")
				setLoading(false)
				return
			}

			try {
				const res = await fetch("http://localhost:4000/api/lists", {
					headers: { "X-Telegram-Init-Data": initData },
				})

				if (res.ok) {
					const lists = await res.json()
					setMyLists(lists)
				} else {
					const err = await res.json()
					setError(err.error || "Не удалось загрузить списки")
				}
			} catch (err) {
				setError("Ошибка подключения к серверу")
			} finally {
				setLoading(false)
			}
		}

		fetchLists()
	}, [user, userLoading])

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const today = new Date()
		const yesterday = new Date()
		yesterday.setDate(today.getDate() - 1)

		if (date.toDateString() === today.toDateString()) return "сегодня"
		if (date.toDateString() === yesterday.toDateString()) return "вчера"

		return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
	}

	const handleCreateNewList = async () => {
		if (!user) {
			toast.error("⚠️ Нет данных Telegram")
			return
		}

		const initData = (window as any).Telegram?.WebApp?.initData
		if (!initData) {
			toast.error("⚠️ Нет данных Telegram")
			return
		}

		try {
			const res = await fetch("http://localhost:4000/api/lists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Telegram-Init-Data": initData,
				},
				body: JSON.stringify({ title: "Новый список" }),
			})

			if (res.ok) {
				const { listId } = await res.json()
				router.push(`/list/${listId}`)
				toast.success("✅ Список создан!", {
					duration: 1000,
				})
			} else {
				toast.error("❌ Не удалось создать список")
			}
		} catch (err) {
			toast.error("⚠️ Ошибка подключения")
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
					<p className="mt-2 text-gray-600 dark:text-gray-300">Загрузка...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
				<div className="text-center text-red-500">{error}</div>
			</div>
		)
	}

	const userName = user?.first_name || "Друг"

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 page-fade-in">
			<div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
				<h1 className="text-2xl text-center font-bold text-gray-800 dark:text-gray-100 mb-4">
					Привет, {userName}!
				</h1>

				<p className="text-sm text-center text-gray-600 dark:text-gray-100 mb-6">
					Создайте коллективный список покупок или задач и делитесь им с
					друзьями.
				</p>

				<button
					className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:text-gray-100 dark:bg-blue-600 dark:hover:bg-blue-700 py-2 px-4 rounded-lg mb-6 font-medium flex items-center justify-center gap-2"
					onClick={handleCreateNewList}
					aria-label="Создать новый список"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					Новый список
				</button>

				{myLists.length === 0 ? (
					<div className="text-center py-12">
						<div className="inline-block p-4 bg-gray-100 dark:bg-gray-400 rounded-full mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-gray-500"
							>
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
							У вас пока нет списков
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							Нажмите кнопку выше, чтобы создать первый список
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{myLists.map(list => (
							<ListCard
								key={list.id}
								list={list}
								onListDeleted={deletedId => {
									setMyLists(prev => prev.filter(l => l.id !== deletedId))
								}}
								stats={{
									total: list.tasks.length,
									completed: list.tasks.filter(t => t.completed).length,
									updatedAt: formatDate(list.createdAt),
								}}
							/>
						))}
					</div>
				)}
				<p className="text-xs text-gray-500 dark:text-gray-100 opacity-50 mt-6 text-center">
					Ссылку на список можно отправить другу — он увидит те же задачи в
					реальном времени.
				</p>
			</div>
		</div>
	)
}
