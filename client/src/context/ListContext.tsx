"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useMemo,
} from "react"
import { useRouter, useParams } from "next/navigation"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { mockTelegramWebApp } from "@/lib/mockTelegram"
import { toast } from "sonner"
import { useVibrate } from "@/hooks/useVibrate"
import { handleApiError } from "@/lib/handleApiError"

interface Task {
	id: string
	text: string
	completed: boolean
	isRemoving?: boolean
	createdAt: string
}

interface Owner {
	id: number
	firstName: string
	username?: string
}

interface List {
	id: string
	title: string
	owner: Owner
	tasks: Task[]
}

type SortOption = "date" | "alphabet" | "completed"

interface ListContextType {
	list: List | null
	tasks: Task[]
	loading: boolean
	error: string | null
	isOwner: boolean
	searchQuery: string
	setSearchQuery: (query: string) => void
	sortBy: SortOption
	setSortBy: (value: SortOption) => void
	newTaskText: string
	setNewTaskText: (text: string) => void
	addTask: (text: string) => Promise<void>
	toggleTask: (taskId: string) => void
	removeTask: (taskId: string) => void
	updateListTitle: (newTitle: string) => void
	undoTask: { task: Task; index: number } | null
	showUndo: boolean
	handleUndoDelete: () => void
	filteredTasks: Task[]
	sortedTasks: Task[]
	listId: string | undefined
	syncStatus: "idle" | "saving" | "syncing" | "saved" | "error"
	setSyncStatus: (
		status: "idle" | "saving" | "syncing" | "saved" | "error"
	) => void
}

const ListContext = createContext<ListContextType | undefined>(undefined)

export function ListProvider({ children }: { children: React.ReactNode }) {
	const { vibrate } = useVibrate()
	const router = useRouter()
	const params = useParams<{ id: string }>()
	const listId = params?.id

	const { user, isLoading: userLoading } = useTelegramUser()
	const [list, setList] = useState<List | null>(null)
	const [tasks, setTasks] = useState<Task[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [sortBy, setSortBy] = useState<SortOption>("date")
	const [newTaskText, setNewTaskText] = useState("")
	const [undoTask, setUndoTask] = useState<{
		task: Task
		index: number
	} | null>(null)
	const [showUndo, setShowUndo] = useState(false)

	const deletionTimeout = useRef<NodeJS.Timeout | null>(null)

	const [syncStatus, setSyncStatus] = useState<
		"idle" | "saving" | "syncing" | "saved" | "error"
	>("idle")

	const API_BASE =
		process.env.NODE_ENV === "development"
			? "http://localhost:4000"
			: process.env.NEXT_PUBLIC_API_URL || "https://shoplist-tg-backend.onrender.com"

	// Очистка таймера отмены при размонтировании
	useEffect(() => {
		return () => {
			if (deletionTimeout.current) {
				clearTimeout(deletionTimeout.current)
			}
		}
	}, [])

	// Инициализация мока в dev
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			mockTelegramWebApp()
		}
	}, [])

	// Загрузка списка
	useEffect(() => {
		if (!user || !listId) return

		const fetchList = async () => {
			const initData = (window as any).Telegram?.WebApp?.initData
			if (!initData) {
				setError("Нет данных Telegram")
				setLoading(false)
				return
			}

			try {
				const res = await fetch(`${API_BASE}/api/lists/${listId}`, {
					headers: { "Telegram-Auth-Data": initData },
				})

				if (res.ok) {
					const data: List = await res.json()
					setList(data)
					setTasks(data.tasks || [])
				} else {
					const err = await res.json()
					setError(err.error || "Не удалось загрузить список")
				}
			} catch (err) {
				handleApiError(err, "⚠️ Ошибка подключения к серверу")
			} finally {
				setLoading(false)
			}
		}

		fetchList()
	}, [user, listId])

	// Сохраняем задачи в localStorage при изменении
	useEffect(() => {
		if (tasks.length > 0) {
			localStorage.setItem(`tasks_${listId}`, JSON.stringify(tasks))
		}
	}, [tasks, listId])

	// Загружаем задачи из localStorage при монтировании
	useEffect(() => {
		if (!user || !listId) return

		const storedTasks = localStorage.getItem(`tasks_${listId}`)
		if (storedTasks) {
			try {
				const parsedTasks = JSON.parse(storedTasks)
				setTasks(parsedTasks)
			} catch (err) {
				console.warn("Failed to parse tasks from localStorage")
			}
		}
	}, [user, listId])

	// Синхронизация при появлении интернета
	useEffect(() => {
		const handleOnline = async () => {
			const storedTasks = localStorage.getItem(`tasks_${listId}`)
			if (storedTasks) {
				try {
					const tasks = JSON.parse(storedTasks)
					// Отправляем задачи на сервер
					for (const task of tasks) {
						await fetch(`${API_BASE}/api/tasks`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Telegram-Auth-Data": getInitData(),
							},
							body: JSON.stringify({
								listId,
								text: task.text,
								completed: task.completed,
							}),
						})
					}
					// Очищаем localStorage после синхронизации
					localStorage.removeItem(`tasks_${listId}`)
				} catch (err) {
					console.warn("Failed to sync tasks with server")
				}
			}
		}

		window.addEventListener("online", handleOnline)

		return () => {
			window.removeEventListener("online", handleOnline)
		}
	}, [listId])

	const isOwner = (list: List | null) => {
		if (!user || !list || !list.owner) return true
		return BigInt(user.id) === BigInt(list.owner.id)
	}

	const getInitData = () => {
		return (window as any).Telegram?.WebApp?.initData
	}

	const addTask = async (text: string) => {
		if (!user) {
			toast.error("⚠️ Нет данных Telegram")
			return
		}

		const trimmedText = text.trim()
		if (!trimmedText || !listId) return

		const initData = getInitData()
		if (!initData) {
			toast.error("⚠️ Нет данных Telegram")
			return
		}

		setSyncStatus("saving")

		try {
			const res = await fetch(`${API_BASE}/api/tasks`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Telegram-Auth-Data": initData,
				},
				body: JSON.stringify({ listId, text: trimmedText }),
			})

			if (res.ok) {
				const newTask = await res.json()
				setTasks(prev => [...prev, newTask])
				setNewTaskText("")
				setSyncStatus("saved")
			} else {
				const err = await res.json()
				setSyncStatus("error")
				toast.error(`❌ ${err.error || "Не удалось добавить задачу"}`)
			}
		} catch (err) {
			setSyncStatus("error")
			handleApiError(err, "⚠️ Ошибка подключения к серверу")
		}
	}

	const toggleTask = async (taskId: string) => {
		if (!user) return

		const task = tasks.find(t => t.id === taskId)
		if (!task) return

		const initData = getInitData()
		if (!initData) return

		setSyncStatus("saving")

		try {
			const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Telegram-Auth-Data": initData,
				},
				body: JSON.stringify({ completed: !task.completed }),
			})

			if (res.ok) {
				setTasks(prev =>
					prev.map(t =>
						t.id === taskId ? { ...t, completed: !t.completed } : t
					)
				)
				setSyncStatus("saved")
			} else {
				setSyncStatus("error")
				toast.error("❌ Не удалось обновить задачу")
			}
		} catch (err) {
			setSyncStatus("error")
			handleApiError(err, "⚠️ Ошибка подключения к серверу")
		}
	}

	const removeTask = async (taskId: string) => {
		if (!user) return

		const taskIndex = tasks.findIndex(t => t.id === taskId)
		if (taskIndex === -1) return

		const taskToRemove = tasks[taskIndex]

		// 1. Помечаем задачу как "удаляемая"
		setTasks(prev =>
			prev.map(t => (t.id === taskId ? { ...t, isRemoving: true } : t))
		)

		// 2. Сохраняем задачу для возможной отмены
		setUndoTask({ task: taskToRemove, index: taskIndex })
		setShowUndo(true)

		// Вибрируем при удалении
		vibrate(50)

		// 3. Отменяем предыдущий таймер отмены, если он был
		if (deletionTimeout.current) {
			clearTimeout(deletionTimeout.current)
		}

		setSyncStatus("saving")

		// 4. Отправляем запрос на удаление
		const initData = getInitData()
		let deleteSuccess = false
		if (initData) {
			try {
				const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
					method: "DELETE",
					headers: { "Telegram-Auth-Data": initData },
				})
				deleteSuccess = res.ok
				if (!deleteSuccess) {
					// Ошибка — восстановить задачу
					setTasks(prev =>
						prev.map(t => (t.id === taskId ? { ...t, isRemoving: false } : t))
					)
					setSyncStatus("error")
					toast.error("❌ Не удалось удалить задачу на сервере")
				} else {
					// Успешно удалена — убрать из UI
					setTasks(prev => prev.filter(t => t.id !== taskId))
					setSyncStatus("saved")
				}
			} catch (err) {
				// Ошибка подключения — восстановить задачу
				setTasks(prev =>
					prev.map(t => (t.id === taskId ? { ...t, isRemoving: false } : t))
				)
				setSyncStatus("error")
				toast.error("⚠️ Ошибка подключения при удалении")
			}
		} else {
			// Нет initData — просто убираем из UI (в dev-режиме)
			setTasks(prev => prev.filter(t => t.id !== taskId))
			deleteSuccess = true
		}

		// 5. Устанавливаем таймер для автоматической очистки состояния отмены
		deletionTimeout.current = setTimeout(() => {
			setUndoTask(null)
			setShowUndo(false)
			// Если удаление не удалось, можно показать ошибку или попытаться снова
			if (initData && !deleteSuccess) {
				// Опционально: повторная попытка или уведомление
			}
		}, 4000) // 4 секунды на отмену
	}

	const updateListTitle = async (newTitle: string) => {
		if (!user || !listId) return

		const initData = getInitData()
		if (!initData) return

		setSyncStatus("saving")

		try {
			const res = await fetch(`${API_BASE}/api/lists/${listId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Telegram-Auth-Data": initData,
				},
				body: JSON.stringify({ title: newTitle }),
			})

			if (res.ok) {
				setList(prev => (prev ? { ...prev, title: newTitle } : null))
				setSyncStatus("saved")
			} else {
				const err = await res.json()
				setSyncStatus("error")
				toast.error(`❌ ${err.error || "Не удалось сохранить название"}`)
			}
		} catch (err) {
			handleApiError(err, "⚠️ Ошибка подключения к серверу")
			setSyncStatus("error")
		}
	}

	const handleUndoDelete = async () => {
		if (!undoTask) return

		// 1. Отменяем таймер
		if (deletionTimeout.current) {
			clearTimeout(deletionTimeout.current)
			deletionTimeout.current = null
		}

		const { task, index } = undoTask

		// 2. Восстанавливаем задачу в UI
		setTasks(prev => {
			const newTasks = [...prev]
			newTasks.splice(index, 0, task)
			return newTasks
		})

		// 3. Отправляем запрос на восстановление на сервер
		const initData = getInitData()
		if (initData && listId) {
			try {
				const res = await fetch(`${API_BASE}/api/tasks`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Telegram-Auth-Data": initData,
					},
					body: JSON.stringify({
						listId,
						text: task.text,
						completed: task.completed,
					}),
				})

				if (!res.ok) {
					toast.error("❌ Не удалось восстановить задачу на сервере")
				}
			} catch (err) {
				toast.error("⚠️ Ошибка подключения при восстановлении")
			}
		}

		// 4. Сбрасываем состояние отмены
		setUndoTask(null)
		setShowUndo(false)

		toast.success("✅ Задача восстановлена", { duration: 1500 })
	}

	// Фильтрация задач
	const filteredTasks = useMemo(() => {
		return tasks.filter(task =>
			task.text.toLowerCase().includes(searchQuery.toLowerCase())
		)
	}, [tasks, searchQuery])

	// Сортировка задач
	const sortedTasks = useMemo(() => {
		return [...filteredTasks].sort((a, b) => {
			if (sortBy === "completed") {
				if (a.completed !== b.completed) {
					return a.completed ? 1 : -1
				}
			}

			if (sortBy === "alphabet") {
				return a.text.localeCompare(b.text)
			}

			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		})
	}, [filteredTasks, sortBy])

	return (
		<ListContext.Provider
			value={{
				list,
				tasks,
				loading,
				error,
				isOwner: isOwner(list),
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
				filteredTasks,
				sortedTasks,
				listId,
				syncStatus,
				setSyncStatus,
			}}
		>
			{children}
		</ListContext.Provider>
	)
}

export function useListContext() {
	const context = useContext(ListContext)
	if (!context) {
		throw new Error("useListContext must be used within a ListProvider")
	}
	return context
}
