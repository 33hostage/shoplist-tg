// Одна задача (чекбокс, текст, удаление)

"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { memo, useCallback } from "react"

interface Task {
	id: string
	text: string
	completed: boolean
	isRemoving?: boolean
	createdAt: string
}

interface TaskItemProps {
	task: Task
	onToggle: (taskId: string) => void
	onRemove: (taskId: string) => void
}

function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
	// Используем useCallback для обработчиков
	const handleToggle = useCallback(() => {
		onToggle(task.id)
	}, [onToggle, task.id])

	const handleRemove = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			onRemove(task.id)
		},
		[onRemove, task.id]
	)

	return (
		<div
			key={task.id}
			onClick={handleToggle}
			className={`flex items-center p-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out task-enter ${
				task.isRemoving ? "task-removed" : ""
			}
									 ${
											task.completed
												? "bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-700/20 dark:via-emerald-700/10 dark:to-teal-900/20 backdrop-blur-[2px] border border-green-200/80 dark:border-green-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.05)]"
												: "bg-gradient-to-br from-white/90 via-gray-50/80 to-gray-100/90 dark:from-gray-600/80 dark:via-gray-700/70 dark:to-gray-800/60 backdrop-blur-[2px] border border-gray-200/60 dark:border-gray-600/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.05)]"
										}`}
		>
			<div className="relative flex items-center justify-center w-5 h-5 transition-slow">
				{/* Галочка для чекбокса */}

				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className={`absolute inset-0 m-auto transition-opacity duration-300 ease-in-out ${
						task.completed ? "opacity-0 scale-90" : "opacity-100"
					}`}
				>
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`absolute inset-0 m-auto transition-all duration-300 ease-in-out ${
						task.completed
							? "opacity-100 scale-100 rotate-0"
							: "opacity-0 scale-90 -rotate-180"
					}`}
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</div>

			<span
				className={`ml-2 flex-1 duration-300 transition-all ${
					task.completed
						? "text-gray-500 dark:text-gray-100"
						: "text-gray-800  dark:text-gray-300"
				}`}
			>
				{task.text}
			</span>

			{/* Кнопка удаления */}
			<button
				onClick={handleRemove}
				className="text-gray-400 hover:text-gray-500 dark:text-gray-100 hover:dark:text-gray-400 duration-200 ml-2 cursor-pointer"
				aria-label="Удалить задачу"
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
export default memo(TaskItem, (prevProps, nextProps) => {
	// Сравниваем только то, что влияет на рендер
	return (
		prevProps.task.id === nextProps.task.id &&
		prevProps.task.text === nextProps.task.text &&
		prevProps.task.completed === nextProps.task.completed &&
		prevProps.task.isRemoving === nextProps.task.isRemoving
	)
})
