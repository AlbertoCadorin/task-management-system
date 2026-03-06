export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    release_date?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    release_date?: string;
}