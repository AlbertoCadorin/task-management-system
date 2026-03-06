import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import type { Task } from '../types/task.types';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
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

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="div">
                        {task.title}
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Chip
                            label={task.priority}
                            color={getPriorityColor(task.priority)}
                            size="small"
                        />
                        <Chip
                            label={getStatusLabel(task.status)}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {task.description}
                </Typography>

                {task.release_date && (
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Data rilascio: {new Date(task.release_date).toLocaleDateString('it-IT')}
                    </Typography>
                )}
            </CardContent>

            <CardActions>
                <Button size="small" onClick={() => onEdit(task)}>
                    Modifica
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(task.id)}>
                    Elimina
                </Button>
            </CardActions>
        </Card>
    )
}