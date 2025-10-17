// Заголовок списка + редактирование

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Owner {
	id: number
	firstName: string
	username?: string
}

interface List {
	id: string
	title: string
	owner: Owner
}

type SortOption = "date" | "alphabet" | "completed"

interface ListHeaderProps {
	listTitle: string
	isOwner: boolean
	list?: List
	onEditTitle: (newTitle: string) => void
	searchQuery?: string
	onSearchChange?: (query: string) => void
	tasksCount?: number
	sortBy?: SortOption
	onSortChange?: (value: SortOption) => void
}

export default function ListHeader({
	listTitle,
	isOwner,
	list,
	onEditTitle,
	searchQuery = "",
	onSearchChange = () => {},
	tasksCount = 0,
}: ListHeaderProps) {
	const router = useRouter()
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [editTitleValue, setEditTitleValue] = useState(listTitle)

	return (
		<div className="mb-8 relative isolate overflow-visible">
			{/* Градиентный фон */}
			<div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-blue-100/10 to-white/20 dark:from-gray-600/30 dark:via-gray-900/10 dark:to-gray-800/30 rounded-2xl blur-md opacity-70 z-[-1]"></div>

			{/* Карточка заголовка */}
			<div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/10 border border-white/30 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden">
				{/* Акцентная полоса */}
				<div className="absolute top-0 left-1/4 w-1/3 h-1 bg-white/40 dark:bg-blue-300/20 rounded-full blur-sm"></div>

				<div className="p-5 sm:p-6">
					{/* Редактирование заголовка */}
					{isEditingTitle ? (
						<div className="flex">
							<input
								type="text"
								value={editTitleValue}
								onChange={e => setEditTitleValue(e.target.value)}
								className="flex-1 border-b border-blue-500 focus:outline-none text-2xl font-bold text-gray-500 dark:text-gray-400 dark:border-gray-700 "
								autoFocus
								onKeyDown={e => {
									if (e.key === "Enter") {
										const title = editTitleValue.trim() || "Новый список"
										onEditTitle(title)
										setIsEditingTitle(false)
									}
								}}
								onBlur={() => {
									const title = editTitleValue.trim() || "Новый список"
									onEditTitle(title)
									setIsEditingTitle(false)
								}}
							/>
						</div>
					) : (
						<h1
							className="text-2xl font-bold text-gray-800 dark:text-gray-300 cursor-pointer hover:text-blue-600 hover:dark:text-gray-100 flex items-center justify-between duration-200"
							onClick={() => {
								setIsEditingTitle(true)
								setEditTitleValue(listTitle)
							}}
						>
							{listTitle}
							<div className="mr-2.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
								</svg>
							</div>
						</h1>
					)}

					{/* Индикатор совместного списка */}
					{!isOwner && (
						<div className="flex items-center mt-2 text-sm text-blue-500 dark:text-blue-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="mr-1"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							Совместный список с {list?.owner.firstName}
						</div>
					)}

					{/* Поле поиска задач */}
					{tasksCount > 0 && (
						<div className="my-4 relative">
							<input
								type="text"
								value={searchQuery}
								onChange={e => onSearchChange(e.target.value)}
								placeholder="Поиск по задачам..."
								className="w-full px-4 py-2 pr-10 text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none  focus:border-blue-500/50 transition-all duration-200 ease-in-out"
							/>
							<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="text-gray-400 dark:text-gray-500"
								>
									<circle cx="11" cy="11" r="8" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
