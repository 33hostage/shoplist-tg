// Пустое состояние списка

interface EmptyStateProps {
	searchQuery?: string
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
	return (
		<div className="text-center py-12 fade-in">
			{searchQuery ? (
				<>
					<div className="inline-block p-3 bg-blue-50 dark:bg-gray-600 rounded-full mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-blue-500"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</div>
					<p className="text-gray-500 dark:text-gray-400">
						Ничего не найдено по запросу "{searchQuery}"
					</p>
				</>
			) : (
				<>
					{/* Стандартное пустое состояние */}
					<div className="text-center py-12">
						<div className="inline-block p-3 bg-blue-50 dark:bg-gray-400 rounded-full mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-blue-500"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
						</div>
						<p className="text-gray-500 dark:text-gray-200 text-center mb-2">
							Добавить первую задачу
						</p>
						<p className="text-gray-500 dark:text-gray-300 mb-5 text-sm">
							Нажмите «+», чтобы добавить
						</p>
					</div>
				</>
			)}
		</div>
	)
}
