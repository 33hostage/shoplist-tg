import { Request, Response } from "express"
import { PrismaClient, Prisma } from "@prisma/client"
import { sendTelegramNotification } from '../utils/notificationService'

const prisma = new PrismaClient()

// 1. Создаем тип для результата запроса к List с включением (select)
const listWithRelations = Prisma.validator<Prisma.ListDefaultArgs>()({
	select: {
		id: true,
		title: true,
		createdAt: true,
		ownerId: true,
		tasks: {
			select: { id: true, text: true, completed: true, createdAt: true }, // Указываем поля tasks
		},
		owner: {
			select: { id: true, firstName: true, username: true }, // Указываем поля owner
		},
		participants: {
			select: { id: true, firstName: true, username: true }, // Указываем поля participants
		},
	},
})

type ListWithRelations = Prisma.ListGetPayload<typeof listWithRelations>
type TaskType = Prisma.TaskGetPayload<{}>
type ParticipantType = Prisma.UserGetPayload<{
    select: { id: true, firstName: true, username: true }
}>

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
		const currentUserId = BigInt(req.user!.id)

		let list = await prisma.list.findUnique({
			where: { id },
			select: listWithRelations.select,
		})

		if (!list) {
			return res.status(400).json({ error: "List not found" })
		}

		const isParticipant = list.participants.some(p => p.id === currentUserId)

		if (!isParticipant) {
			list = await prisma.list.update({
				where: { id },
				data: {
					participants: {
						connect: { id: currentUserId },
					},
				},
				select: listWithRelations.select,
			})
			// ОТПРАВКА УВЕДОМЛЕНИЯ ВЛАДЕЛЬЦУ
			const senderName = req.user!.username || req.user!.first_name
			const notificationText = `✅ Пользователь @${senderName} присоединился к вашему совместному списку: *${list.title}*`

			// Отправляем уведомление владельцу списка (list.ownerId)
			await sendTelegramNotification(list.ownerId, notificationText)
		}

		const isOwner = list.ownerId === currentUserId

		res.json({
			...list,
			tasks: list.tasks,
			isOwner: isOwner,

			// Преобразование BigInt в string для фронтенда
			owner: {
				id: list.owner.id.toString(),
				firstName: list.owner.firstName,
				username: list.owner.username,
			},
			ownerId: list.ownerId.toString(),
			participants: list.participants.map((p: ParticipantType) => ({
				// p.id - это BigInt, который нужно сериализовать
				...p,
				id: p.id.toString(),
			})),
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

		const lists = (await prisma.list.findMany({
			where: {
				OR: [{ ownerId: userId }, { participants: { some: { id: userId } } }],
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
				ownerId: true,
				tasks: {
					select: { id: true, text: true, completed: true, createdAt: true }, // Только нужные поля задачи
				},
				owner: {
					select: { id: true, firstName: true, username: true }, // Только нужные поля владельца
				},
				participants: {
					select: { id: true, firstName: true, username: true }, // Только нужные поля участников
				},
			},
			orderBy: { createdAt: "desc" },
		})) as ListWithRelations[]

		// Преобразуем BigInt в string для JSON
		const serializableLists = lists.map(list => ({
			...list,
			ownerId: list.ownerId.toString(),
			owner: {
				...list.owner,
				id: list.owner.id.toString(), // ← важно!
			},
			participants: list.participants.map((p: ParticipantType) => ({
				...p,
				id: p.id.toString(), // <-- Ключевое преобразование BigInt
			})),
			tasks: list.tasks,
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
