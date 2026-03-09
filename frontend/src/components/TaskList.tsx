import { Box, Typography, CircularProgress, Paper } from '@mui/material'
import { TaskItem } from './TaskItem'
import type { Task } from '../types/task.types'

interface TaskListProps {
    tasks: Task[],
    loading: boolean,
    onEdit: (task: Task) => void
    onDelete: (id: number) => void
}

export const TaskList = ({ tasks, loading, onEdit, onDelete }: TaskListProps) => {
    if (loading) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="220px" gap={1.5}>
                <CircularProgress size={28} sx={{ color: '#0e7c66' }} />
                <Typography color="text.secondary">Caricamento task in corso...</Typography>
            </Box>
        )
    }

    if (tasks.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                    borderRadius: 3,
                    border: '1px dashed rgba(23, 34, 38, 0.24)',
                    bgcolor: 'rgba(247, 251, 250, 0.75)'
                }}
            >
                <Typography variant='h6' color='text.primary' fontWeight={700}>
                    Nessuna task trovata
                </Typography>
                <Typography variant='body1' color='text.secondary' mt={1}>
                    Crea la tua prima task per iniziare.
                </Typography>
            </Paper>
        )
    }

    return (
        <Box display="grid" gap={2}>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    )
}