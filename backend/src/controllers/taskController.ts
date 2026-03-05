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

// GET - Ottieni tutte le task
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<Task[]>('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Errore nel recupero delle task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// GET - Ottieni una task per ID
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Errore nel recupero della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// POST - Crea una nuova task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, status, release_date } = req.body;

        // Validazione
        if (!title) {
            return res.status(400).json({ error: 'Il titolo è obbligatorio' });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO tasks (title, description, priority, status, release_date) VALUES (?, ?, ?, ?, ?)',
            [title, description || '', priority || 'medium', status || 'todo', release_date || null]
        );

        const [newTask] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Errore nella creazione della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// PUT - Aggiorna una task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, release_date } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, release_date = ? WHERE id = ?',
            [title, description, priority, status, release_date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        const [updatedTask] = await pool.query<Task[]>('SELECT * FROM tasks WHERE id = ?', [id]);

        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Errore nell\'aggiornamento della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};

// DELETE - Elimina una task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task non trovata' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Errore nell\'eliminazione della task:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};