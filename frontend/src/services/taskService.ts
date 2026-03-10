import { api } from './api';
import type { Task, CreateTaskDto } from '../types/task.types';

export const taskService = {
    // GET - Fetch all tasks
    getAllTasks: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    // GET - Fetch a task by ID
    getTaskById: async (id: number): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    // POST - Create a new task
    createTask: async (task: CreateTaskDto): Promise<Task> => {
        const response = await api.post<Task>('/tasks', task);
        return response.data;
    },

    // PUT - Update a task
    updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },

    // DELETE - Delete a task
    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};