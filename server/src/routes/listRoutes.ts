import { Router } from 'express';
import { createList, getListById, getMyLists, updateList, deleteList } from '../controllers/listController';
import { authenticateTelegram } from '../middleware/auth';

const router = Router()

router.get('/', authenticateTelegram, getMyLists)
router.post('/', authenticateTelegram, createList)
router.get('/:id', authenticateTelegram, getListById)
router.patch('/:id', authenticateTelegram, updateList);
router.delete('/:id', authenticateTelegram, deleteList);

export default router