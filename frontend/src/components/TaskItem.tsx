import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import type { DragEvent } from 'react';
import type { Task } from '../types/task.types';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    draggable?: boolean;
    onDragStart?: (event: DragEvent<HTMLElement>) => void;
    onDragEnd?: (event: DragEvent<HTMLElement>) => void;
}

const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
} as const;

const statusLabels = {
    todo: 'Da fare',
    in_progress: 'In corso',
    done: 'Fatto'
} as const;

const priorityLabels = {
    low: 'Bassa',
    medium: 'Media',
    high: 'Alta'
} as const;

const getPriorityColor = (priority: unknown) => {
    if (priority === 'low' || priority === 'medium' || priority === 'high') {
        return priorityColors[priority];
    }
    return 'default';
};

const getStatusLabel = (status: unknown) => {
    if (status === 'todo' || status === 'in_progress' || status === 'done') {
        return statusLabels[status];
    }
    return 'Sconosciuto';
};

const getPriorityLabel = (priority: unknown) => {
    if (priority === 'low' || priority === 'medium' || priority === 'high') {
        return priorityLabels[priority];
    }
    return 'Sconosciuta';
};

export const TaskItem = ({ task, onEdit, onDelete, draggable = false, onDragStart, onDragEnd }: TaskItemProps) => {
    return (
        <Card
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            sx={{
                borderRadius: 3,
                border: '1px solid rgba(23, 34, 38, 0.1)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f9fcfb 100%)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: draggable ? 'grab' : 'default',
                '&:active': {
                    cursor: draggable ? 'grabbing' : 'default'
                },
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 14px 28px rgba(23, 34, 38, 0.08)'
                }
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.5} mb={1.25} flexDirection={{ xs: 'column', sm: 'row' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        {task.title}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                            label={`Priorita: ${getPriorityLabel(task.priority)}`}
                            color={getPriorityColor(task.priority)}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                        <Chip
                            label={getStatusLabel(task.status)}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {task.description}
                </Typography>

                {task.release_date && (
                    <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
                        Data rilascio: {new Date(task.release_date).toLocaleDateString('it-IT')}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(task)}>
                    Modifica
                </Button>
                <Button size="small" color="error" variant="text" onClick={() => onDelete(task.id)}>
                    Elimina
                </Button>
            </CardActions>
        </Card>
    )
}