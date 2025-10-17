import { Router } from 'express';
import listRoutes from './listRoutes';
import taskRoutes from './taskRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/lists', listRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);

export default router;