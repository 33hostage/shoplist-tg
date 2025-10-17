import { Router } from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateTelegram } from '../middleware/auth';

const router = Router();

router.post('/', authenticateTelegram, createTask);
router.patch('/:id', authenticateTelegram, updateTask);
router.delete('/:id', authenticateTelegram, deleteTask);

export default router;