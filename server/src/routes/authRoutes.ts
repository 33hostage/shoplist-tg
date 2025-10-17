import { Router } from 'express';
import { loginUser } from '../controllers/authController'; 
import { authenticateTelegram } from '../middleware/auth';

const router = Router();

// POST /login (Полный маршрут будет /api/auth/login)
// Мы используем authenticateTelegram, чтобы получить данные пользователя
router.post('/login', authenticateTelegram, loginUser);

export default router;