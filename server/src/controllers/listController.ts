import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// POST /api/lists — создать список
export const createList = async (req: Request, res: Response) => {
	try {
		const { title = "Список покупок" } = req.body
		const userId = BigInt(req.user!.id)
		const firstName = req.user!.first_name
		const username = req.user!.username

		// Найти или создать пользователя
		let user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			user = await prisma.user.create({
				data: {
					id: userId,
					firstName,
					username,
				},
			})
		}

		// Создать список
		const list = await prisma.list.create({
			data: {
				title,
				ownerId: userId,
			},
		})

		res.status(201).json({ listId: list.id })
	} catch (error) {
		console.error("Error creating list:", error)
		res.status(500).json({ error: "Failed to create list" })
	}
}

// GET /api/lists/:id — получить список с задачами
export const getListById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const list = await prisma.list.findUnique({
			where: { id },
			include: {
				tasks: {
					orderBy: { createdAt: "asc" },
				},
				owner: true,
			},
		})

		if (!list) {
			return res.status(400).json({ error: "List not found" })
		}

		res.json({
			id: list.id,
			title: list.title,
			tasks: list.tasks,
		})
	} catch (error) {
		console.error("Error fetching list:", error)
		res.status(500).json({ error: "Failed to fetch list" })
	}
}

// GET /api/lists — получить все списки текущего пользователя
export const getMyLists = async (req: Request, res: Response) => {
	try {
		console.log("User from req:", req.user)
		const userId = BigInt(req.user!.id)

		const lists = await prisma.list.findMany({
			where: { ownerId: userId },
			include: {
				tasks: true,
				owner: true,
			},
			orderBy: { createdAt: "desc" },
		})

		// Преобразуем BigInt в string для JSON
		const serializableLists = lists.map(list => ({
			...list,
			ownerId: list.ownerId.toString(),
			owner: {
				...list.owner,
				id: list.owner.id.toString(), // ← важно!
			},
			tasks: list.tasks.map(task => ({
				...task,
				// task.id — строка (cuid), так что не нужно преобразовывать
			})),
		}))

		res.json(serializableLists)
	} catch (error) {
		console.error("Error fetching user lists:", error)
		res.status(500).json({ error: "Failed to load lists" })
	}
}

// PATCH /api/lists/:id — обновить название списка
export const updateList = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { title } = req.body

		// Проверка: список существует и принадлежит пользователю
		const list = await prisma.list.findFirst({
			where: { id, ownerId: BigInt(req.user!.id) },
		})

		if (!list) {
			return res.status(404).json({ error: "List not found or access denied" })
		}

		const updatedList = await prisma.list.update({
			where: { id },
			data: { title },
		})

		res.json({ id: updatedList.id, title: updatedList.title })
	} catch (error) {
		console.error("Error updating list:", error)
		res.status(500).json({ error: "Failed to update list" })
	}
}

// DELETE /api/lists/:id — удалить список (только владелец)
export const deleteList = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = BigInt(req.user!.id)

		// Проверка: список существует и принадлежит пользователю
		const list = await prisma.list.findFirst({
			where: { id, ownerId: userId },
		})

		if (!list) {
			return res.status(404).json({ error: "List not found or access denied" })
		}

		// Удаляем сначала задачи (каскадно, но — безопаснее)
		await prisma.task.deleteMany({
			where: { listId: id },
		})

		// Удаляем список
		await prisma.list.delete({
			where: { id },
		})

		res.status(204).send() // No Content
	} catch (error) {
		console.error("Error deleting list:", error)
		res.status(500).json({ error: "Failed to delete list" })
	}
}
