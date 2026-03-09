import { Box, Typography, CircularProgress } from '@mui/material'
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        )
    }

    if (tasks.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant='h6' color='text.secondary'>
                    Nessuna Task Trovata
                </Typography>
                <Typography variant='h6' color='text.secondary' mt={1}>
                    Crea la tua prima task per iniziare!
                </Typography>
            </Box>
        )
    }

    return (
        <Box>
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