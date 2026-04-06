import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:userId', TaskController.getTaskByUserId);
router.post('/', TaskController.createTask);


export default router;