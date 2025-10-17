"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type SortOption = "date" | "alphabet" | "completed"

interface SortDropdownProps {
	value: SortOption
	onChange: (value: SortOption) => void
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	const getSortLabel = (option: SortOption): string => {
		switch (option) {
			case "date":
				return "По дате"
			case "alphabet":
				return "По алфавиту"
			case "completed":
				return "Сначала невыполненные"
			default:
				return "По дате"
		}
	}

	return (
		<div className="relative flex items-center justify-end mb-4 mr-4">
			{/* Иконка сортировки */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 fade-in"
				aria-label="Сортировать задачи"
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
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="6" y1="12" x2="18" y2="12" />
					<line x1="9" y1="18" x2="15" y2="18" />
				</svg>
			</button>

			{/* Dropdown с вариантами + Анимация */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Overlay для закрытия при клике вне dropdown */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-10"
							onClick={() => setIsOpen(false)}
						/>

						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: -10 }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className="absolute right-[-17px] top-[34px] z-20 backdrop-blur-xl bg-gradient-to-r from-white/20 via-blue-100/10 to-white/20 dark:from-gray-500/30 dark:via-gray-800/10 dark:to-gray-700/30 rounded-[8px] border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] w-48 overflow-hidden"
						>
							{(["date", "completed", "alphabet"] as SortOption[]).map(
								option => (
									<motion.button
										key={option}
										whileTap={{ scale: 0.98 }}
										onClick={() => {
											onChange(option)
											setIsOpen(false)
										}}
										className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
											value === option
												? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
												: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
										}`}
									>
										{getSortLabel(option)}
									</motion.button>
								)
							)}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}
