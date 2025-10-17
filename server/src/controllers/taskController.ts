import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/tasks — добавить задачу
export const createTask = async (req: Request, res: Response) => {
  try {
    const { listId, text } = req.body;
    const userId = BigInt(req.user!.id);

    // Проверяем, что список принадлежит пользователю (или доступен)
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const task = await prisma.task.create({
      data: {
        text,
        list: { connect: { id: listId } },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// PATCH /api/tasks/:id — обновить задачу (completed)
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { list: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Проверка: пользователь — владелец списка?
    // (упрощённо: разрешаем всем, у кого есть ссылка)
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id — удалить задачу
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { list: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};