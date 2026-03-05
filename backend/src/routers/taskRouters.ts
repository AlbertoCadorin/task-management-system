import { Router } from 'express';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/taskController';

const router = Router();

// GET /api/tasks - Ottieni tutte le task
router.get('/', getAllTasks);

// GET /api/tasks/:id - Ottieni una task per ID
router.get('/:id', getTaskById);

// POST /api/tasks - Crea una nuova task
router.post('/', createTask);

// PUT /api/tasks/:id - Aggiorna una task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Elimina una task
router.delete('/:id', deleteTask);

export default router;