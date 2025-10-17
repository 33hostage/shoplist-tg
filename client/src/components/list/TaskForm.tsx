// Форма добавления задачи

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useListContext } from '@/context/ListContext';

interface TaskFormProps {
	newTaskText: string
	onTextChange: (text: string) => void
	onSubmit: (text: string) => Promise<void>
}

export default function TaskForm({
	newTaskText,
	onTextChange,
	onSubmit,
}: TaskFormProps) {
	const { syncStatus } = useListContext();
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async () => {
		if (isSubmitting || syncStatus === 'saving') return
		if (!newTaskText.trim()) return

		setIsSubmitting(true)
		try {
			await onSubmit(newTaskText.trim())
		} catch (err) {
			toast.error("⚠️ Ошибка при добавлении задачи")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			{/* Форма добавления */}
			<div className="flex mb-4">
				<input
					type="text"
					value={newTaskText}
					onChange={e => onTextChange(e.target.value)}
					placeholder="Новая задача/покупка..."
					className="text-gray-700 dark:text-gray-300 flex-1 border-y border-l border-gray-300 dark:border-gray-500 focus:outline-none focus:border-blue-500/50 transition-all duration-200 ease-in-out rounded-l-lg px-4 py-2"
					onKeyUp={e => e.key === "Enter" && handleSubmit()}
					disabled={syncStatus === 'saving'}
				/>
				<button
					onClick={handleSubmit}
					className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 rounded-r-lg transition-colors"
					aria-label="Добавить задачу"
					disabled={syncStatus === 'saving'}
				>
					{syncStatus === 'saving' ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="animate-spin"
						>
							<line x1="12" y1="2" x2="12" y2="6" />
							<line x1="12" y1="18" x2="12" y2="22" />
							<line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
							<line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
							<line x1="2" y1="12" x2="6" y2="12" />
							<line x1="18" y1="12" x2="22" y2="12" />
							<line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
							<line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					)}
				</button>
			</div>
		</>
	)
}
