"use client"

export default function ListPageSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 page-fade-in">
			<div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
				{/* Кнопка "Назад" */}
				<div className="mb-4">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</div>

				{/* Заголовок списка */}
				<div className="mb-8">
					<div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
					<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</div>

				{/* Поле поиска задач */}
				<div className="my-4 relative">
					<div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
				</div>

				{/* Форма добавления */}
				<div className="flex mb-6">
					<div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-l-lg animate-pulse"></div>
					<div className="h-10 w-12 bg-gray-300 dark:bg-gray-600 rounded-r-lg animate-pulse"></div>
				</div>

				{/* Список задач */}
				<div className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex items-center p-3 rounded-lg shadow-sm bg-white dark:bg-gray-700 animate-pulse"
						>
							<div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
							<div className="ml-3 h-4 flex-1 bg-gray-200 dark:bg-gray-600 rounded"></div>
							<div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded ml-2"></div>
						</div>
					))}
				</div>

				{/* Кнопка "Поделиться" */}
				<div className="mt-6">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</div>
			</div>
		</div>
	)
}
