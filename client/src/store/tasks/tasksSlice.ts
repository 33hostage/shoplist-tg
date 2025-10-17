import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Task {
	id: string
	text: string
	completed: boolean
	listId: string
}

interface TasksState {
	tasks: Task[]
	status: "idle" | "loading" | "succeeded" | "failed"
	error: string | null
}

const initialState: TasksState = {
	tasks: [],
	status: "idle",
	error: null,
}

// Позже заменить на createAsyncThunk + API
const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		// Заглушка : добавление задачи (без бэкенда)
		addTask: (
			state,
			action: PayloadAction<{ listId: string; text: string }>
		) => {
			const newTask: Task = {
				id: `task_${Date.now()}`,
				text: action.payload.text,
				completed: false,
				listId: action.payload.listId,
			}
			state.tasks.push(newTask)
		},

		// Переключить статус выполнения
		toggleTask: (state, action: PayloadAction<string>) => {
			const task = state.tasks.find(t => t.id === action.payload)
			if (task) {
				task.completed = !task.completed
			}
		},

		initList: (state, action: PayloadAction<string>) => {
			// Просто "активируем" список — задачи подтянутся позже (из API или уже есть в store)
		},

		// Удаление задачи
		removeTask: (state, action: PayloadAction<string>) => {
			state.tasks = state.tasks.filter(task => task.id !== action.payload)
		},
	},
})

export const { addTask, toggleTask, initList, removeTask } = tasksSlice.actions
export default tasksSlice.reducer
