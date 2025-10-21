"use client"

import { useListContext } from "@/context/ListContext"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import SortDropdown from "@/components/list/SortDropdown"
import ListHeader from "@/components/list/ListHeader"
import TaskForm from "@/components/list/TaskForm"
import TaskItem from "@/components/list/TaskItem"
import EmptyState from "@/components/list/EmptyState"
import UndoBanner from "@/components/list/UndoBanner"
import ShareButton from "@/components/list/ShareButton"
import BackButton from "@/components/ui/BackButton"
import ListPageSkeleton from "@/components/list/ListPageSkeleton"

export default function ListPage() {
	const params = useParams<{ id: string }>()
	const listId = params?.id
	const router = useRouter()

	const {
		list,
		tasks,
		loading,
		error,
		isOwner,
		searchQuery,
		setSearchQuery,
		sortBy,
		setSortBy,
		newTaskText,
		setNewTaskText,
		addTask,
		toggleTask,
		removeTask,
		updateListTitle,
		undoTask,
		showUndo,
		handleUndoDelete,
		sortedTasks,
	} = useListContext()

if (loading) {
  return <ListPageSkeleton />;
}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
				<div className="text-center text-red-500">{error}</div>
			</div>
		)
	}

	if (!list) {
		return <div className="p-4 text-center text-red-500">Список не найден</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 page-fade-in">
			<div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
				<BackButton ariaLabel="Назад" onClick={() => router.push('/')} />

				{/* Редактирования списка + поиск по названию */}
				<div className="fade-in-up">
					<ListHeader
						listTitle={list.title}
						isOwner={isOwner}
						list={list}
						onEditTitle={updateListTitle}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						sortBy={sortBy}
						onSortChange={setSortBy}
						tasksCount={tasks.length}
					/>
				</div>

				<div className="fade-in-up">
					<TaskForm
						newTaskText={newTaskText}
						onTextChange={setNewTaskText}
						onSubmit={addTask}
					/>
				</div>

				{/* Сортировка */}
				{tasks.length > 0 && (
					<SortDropdown value={sortBy} onChange={setSortBy} />
				)}

				{/* Список задач */}
				<div className="space-y-3">
					{sortedTasks.length === 0 ? (
						/* Empty State */
						<EmptyState searchQuery={searchQuery} />
					) : (
						sortedTasks.map(task => (
							// TaskItem
							<TaskItem
								key={task.id}
								task={task}
								onToggle={toggleTask}
								onRemove={removeTask}
							/>
						))
					)}
				</div>

				{/* Кнопка "Поделиться" */}
				{isOwner && <ShareButton listId={listId} botUsername="simplelist_bot" />}
			</div>

			{/* Баннер отмены */}
			{undoTask && showUndo && (
				/* UndoBanner */
				<UndoBanner show={showUndo} onUndo={handleUndoDelete} />
			)}
		</div>
	)
}
