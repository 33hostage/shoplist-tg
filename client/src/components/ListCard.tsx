"use client"

import { memo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Task {
	id: string
	text: string
	completed: boolean
}

interface ListCardProps {
	list: {
		id: string
		title: string
		tasks: Task[]
	}
	stats: {
		total: number
		completed: number
		updatedAt: string
	}
	onListDeleted?: (id: string) => void
}

function ListCard({ list, stats, onListDeleted }: ListCardProps) {
	const router = useRouter()

	const API_URL = process.env.NEXT_PUBLIC_API_URL

	const handleDelete = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation()
			e.preventDefault()

			toast("Удалить список?", {
				description: "Это действие нельзя отменить.",
				duration: 5000,
				action: {
					label: "Удалить",
					onClick: async () => {
						const initData = (window as any).Telegram?.WebApp?.initData
						if (!initData) {
							toast.error("Нет данных Telegram")
							return
						}

						try {
							const res = await fetch(
								`${API_URL}/api/lists/${list.id}`,
								{
									method: "DELETE",
									headers: { "Telegram-Auth-Data": initData },
								}
							)

							if (res.ok) {
								onListDeleted?.(list.id)
								toast.success("✅ Список удалён", {
									duration: 1000,
								})
							} else {
								toast.error("❌ Не удалось удалить список")
							}
						} catch (err) {
							toast.error("⚠️ Ошибка подключения")
						}
					},
				},
				cancel: {
					label: "Отмена",
					onClick: () => {},
				},
			})
		},
		[list.id, onListDeleted]
	)

	const handleClick = useCallback(() => {
		router.push(`/list/${list.id}`)
	}, [router, list.id])

	return (
		<div
			onClick={handleClick}
			className="bg-white/90 dark:bg-gray-700/70 backdrop-blur-[2px] border border-gray-200/60 dark:border-gray-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.05) p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-700 relative transition-all duration-300 ease-in-out"
		>
			<h2 className="font-bold text-gray-800 dark:text-gray-100">
				{list.title}
			</h2>
			<p className="text-sm text-gray-500 dark:text-gray-400">
				{stats.completed} / {stats.total} задач выполнено • Обнов.{" "}
				{stats.updatedAt}
			</p>
			<button
				onClick={handleDelete}
				className="absolute top-7 right-3 text-gray-400 hover:text-gray-500 dark:text-gray-100 hover:dark:text-gray-400 duration-200"
				aria-label="Удалить список"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					<line x1="10" y1="11" x2="10" y2="17" />
					<line x1="14" y1="11" x2="14" y2="17" />
				</svg>
			</button>
		</div>
	)
}

// Экспортируем с React.memo
export default memo(ListCard, (prevProps, nextProps) => {
	return (
		prevProps.list.id === nextProps.list.id &&
		prevProps.list.title === nextProps.list.title &&
		prevProps.list.tasks.length === nextProps.list.tasks.length &&
		prevProps.list.tasks.every(
			(task, i) => task.completed === nextProps.list.tasks[i]?.completed
		)
	)
})
