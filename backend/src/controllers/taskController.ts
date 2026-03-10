import { Request, Response } from 'express';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Task extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    release_date: string | null;
    created_at: string;
    updated_at: string;
}

const PRIORITIES = ['low', 'medium', 'high'] as const;
const STATUSES = ['todo', 'in_progress', 'done'] as const;
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

const isValidDateString = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const parsed = Date.parse(value);
    return !Number.isNaN(parsed);
};

// Normalize request payload to avoid duplicated checks inside handlers.
const normalizeTaskInput = (body: Request['body']) => {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const priority = body.priority as Task['priority'] | undefined;
    const status = body.status as Task['status'] | undefined;
    const release_date = body.release_date === '' ? null : (body.release_date ?? null);

    return { title, description, priority, status, release_date };
};

// Centralized validation used by both create and update endpoints.
const validateTaskInput = (input: ReturnType<typeof normalizeTaskInput>) => {
    const errors: string[] = [];

    if (!input.title) {
        errors.push('Il titolo e obbligatorio');
    } else if (input.title.length > MAX_TITLE_LENGTH) {
        errors.push(`Il titolo non puo superare ${MAX_TITLE_LENGTH} caratteri`);
    }

    if (input.description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`La descrizione non puo superare ${MAX_DESCRIPTION_LENGTH} caratteri`);
    }

    if (input.priority && !PRIORITIES.includes(input.priority)) {
        errors.push('Priorita non valida');
    }

    if (input.status && !STATUSES.includes(input.status)) {
        errors.push('Stato non valido');
    }

    if (input.release_date !== null && typeof input.release_date !== 'string') {
        errors.push('Data di rilascio non valida');
    }

    if (typeof input.release_date === 'string' && !isValidDateString(input.release_date)) {
        errors.push('Data di rilascio non valida');
    }

    return errors;
};

// GET - Fetch all tasks
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<Task[]>('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Errore nel recupero delle task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// GET - Fetch task by ID
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({ error: 'ID non valido' });
        }

        const [rows] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [taskId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Errore nel recupero della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// POST - Create a new task
export const createTask = async (req: Request, res: Response) => {
    try {
        const input = normalizeTaskInput(req.body);
        const errors = validateTaskInput(input);

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join('. ') });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO tasks (title, description, priority, status, release_date) VALUES (?, ?, ?, ?, ?)',
            [
                input.title,
                input.description,
                input.priority || 'medium',
                input.status || 'todo',
                input.release_date || null
            ]
        );

        const [newTask] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Errore nella creazione della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// PUT - Update a task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({ error: 'ID non valido' });
        }

        const input = normalizeTaskInput(req.body);
        const errors = validateTaskInput(input);

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join('. ') });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, release_date = ? WHERE id = ?',
            [
                input.title,
                input.description,
                input.priority || 'medium',
                input.status || 'todo',
                input.release_date || null,
                taskId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        const [updatedTask] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [taskId]);

        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Errore nell\'aggiornamento della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// DELETE - Delete a task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({ error: 'ID non valido' });
        }

        const [result] = await pool.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ?', [taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Errore nell\'eliminazione della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};