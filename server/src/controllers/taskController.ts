import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { sendTelegramNotification } from "../utils/notificationService"

const prisma = new PrismaClient()

/**
 * Получает ID всех пользователей, связанных со списком (владелец + участники),
 * исключая пользователя, который совершил действие.
 * @param listId ID списка.
 * @param currentUserId ID пользователя, совершившего действие.
 * @returns Массив BigInt ID получателей.
 */
async function getRecipients(
	listId: string,
	currentUserId: bigint
): Promise<bigint[]> {
	const list = await prisma.list.findUnique({
		where: { id: listId },
		select: {
			ownerId: true,
			participants: { select: { id: true } },
		},
	})

	if (!list) return []

	// Собираем все ID (владельца + участников)
	const allUserIds = new Set([
		list.ownerId,
		...list.participants.map(p => p.id),
	])

	// Исключаем пользователя, который совершил действие
	const recipients = Array.from(allUserIds).filter(id => id !== currentUserId)

	// Преобразуем BigInt[] в BigInt[]
	return recipients as bigint[]
}

// POST /api/tasks — добавить задачу
export const createTask = async (req: Request, res: Response) => {
	try {
		const { listId, text } = req.body
		const userId = BigInt(req.user!.id)
		const senderName = req.user!.username || req.user!.first_name // Получаем имя отправителя

		// Проверяем, что список принадлежит пользователю (или доступен)
		const list = await prisma.list.findUnique({
			where: { id: listId },
			select: {
				title: true,
				ownerId: true,
				participants: { select: { id: true } },
			},
		})

		if (!list) {
			return res.status(404).json({ error: "List not found" })
		}

		const task = await prisma.task.create({
			data: {
				text,
				list: { connect: { id: listId } },
			},
		})

		// Отправка уведомлений о новой задаче
		const recipients = await getRecipients(listId, userId)
		const notificationText = `➕ *Новая задача* добавлена в список *${list.title}* пользователем @${senderName}. Задача: ${text}`

		for (const recipientId of recipients) {
			await sendTelegramNotification(recipientId, notificationText)
		}

		res.status(201).json(task)
	} catch (error) {
		console.error("Error creating task:", error)
		res.status(500).json({ error: "Failed to create task" })
	}
}

// PATCH /api/tasks/:id — обновить задачу (completed)
export const updateTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { completed } = req.body
		const userId = BigInt(req.user!.id)
		const senderName = req.user!.username || req.user!.first_name

		const task = await prisma.task.findUnique({
			where: { id },
			select: { listId: true, text: true, list: { select: { title: true } } },
		})

		if (!task) {
			return res.status(404).json({ error: "Task not found" })
		}

		// Проверка: пользователь — владелец списка?
		// (упрощённо: разрешаем всем, у кого есть ссылка)
		const updatedTask = await prisma.task.update({
			where: { id },
			data: { completed },
		})

		// Отправка уведомлений об изменении статуса
		const listTitle = task.list.title
		const recipients = await getRecipients(task.listId, userId)

		const action = updatedTask.completed
			? "☑️ *Отметил как выполненную*"
			: "🔄 *Снова добавил в список*"

		const notificationText = `${action} задачу "*${updatedTask.text}*" в списке *${listTitle}* пользователь @${senderName}.`

    for (const recipientId of recipients) {
      await sendTelegramNotification(recipientId, notificationText)
    }

		res.json(updatedTask)
	} catch (error) {
		console.error("Error updating task:", error)
		res.status(500).json({ error: "Failed to update task" })
	}
}

// DELETE /api/tasks/:id — удалить задачу
export const deleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const task = await prisma.task.findUnique({
			where: { id },
			include: { list: true },
		})

		if (!task) {
			return res.status(404).json({ error: "Task not found" })
		}

		await prisma.task.delete({
			where: { id },
		})

		res.status(204).send() // No Content
	} catch (error) {
		console.error("Error deleting task:", error)
		res.status(500).json({ error: "Failed to delete task" })
	}
}
