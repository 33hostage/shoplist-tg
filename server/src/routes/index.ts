import { Router } from 'express';
import listRoutes from './listRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.use('/lists', listRoutes);
router.use('/tasks', taskRoutes);

export default router;