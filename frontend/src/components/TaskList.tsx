import { useMemo, useState, type DragEvent } from 'react'
import { Box, Typography, Paper, Chip, Skeleton } from '@mui/material'
import { TaskItem } from './TaskItem'
import type { Task } from '../types/task.types'

interface TaskListProps {
    tasks: Task[],
    loading: boolean,
    onEdit: (task: Task) => void
    onDelete: (id: number) => void
    onStatusChange: (taskId: number, status: Task['status']) => Promise<void>
}

const boardColumns: Array<{ status: Task['status']; title: string; hint: string; tone: string }> = [
    { status: 'todo', title: 'Da fare', hint: 'Task in attesa di essere avviate', tone: '#5f6b73' },
    { status: 'in_progress', title: 'In corso', hint: 'Lavori aperti in questo momento', tone: '#bb6d00' },
    { status: 'done', title: 'Completate', hint: 'Risultati conclusi e verificati', tone: '#1f8a59' }
]

const DND_TASK_ID = 'application/x-task-id'

export const TaskList = ({ tasks, loading, onEdit, onDelete, onStatusChange }: TaskListProps) => {
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
    const [activeDropStatus, setActiveDropStatus] = useState<Task['status'] | null>(null)

    const groupedTasks = useMemo(() => {
        return {
            todo: tasks.filter((task) => task.status === 'todo'),
            in_progress: tasks.filter((task) => task.status === 'in_progress'),
            done: tasks.filter((task) => task.status === 'done')
        }
    }, [tasks])

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
                    Crea la tua prima task per iniziare la board.
                </Typography>
            </Paper>
        )
    }

    const handleDragStart = (event: DragEvent<HTMLElement>, taskId: number) => {
        event.dataTransfer.setData(DND_TASK_ID, String(taskId))
        event.dataTransfer.effectAllowed = 'move'
        setDraggedTaskId(taskId)
    }

    const handleDropOnColumn = async (event: DragEvent<HTMLElement>, targetStatus: Task['status']) => {
        event.preventDefault()

        const rawTaskId = event.dataTransfer.getData(DND_TASK_ID)
        const droppedTaskId = Number(rawTaskId)
        const resolvedTaskId = Number.isFinite(droppedTaskId) ? droppedTaskId : draggedTaskId

        if (resolvedTaskId === null) {
            setActiveDropStatus(null)
            return
        }

        const draggedTask = tasks.find((task) => task.id === resolvedTaskId)
        if (!draggedTask || draggedTask.status === targetStatus) {
            setDraggedTaskId(null)
            setActiveDropStatus(null)
            return
        }

        setDraggedTaskId(null)
        setActiveDropStatus(null)
        await onStatusChange(draggedTask.id, targetStatus)
    }

    const renderLoadingSkeleton = () => (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }} gap={2}>
            {[1, 2, 3].map((column) => (
                <Paper key={column} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(23, 34, 38, 0.1)', p: 2.25 }}>
                    <Skeleton variant="text" width="58%" height={34} />
                    <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rounded" height={116} sx={{ mb: 1.2, borderRadius: 2 }} />
                    <Skeleton variant="rounded" height={108} sx={{ borderRadius: 2 }} />
                </Paper>
            ))}
        </Box>
    )

    if (loading) {
        return renderLoadingSkeleton()
    }

    return (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }} gap={2}>
            {boardColumns.map((column, index) => {
                const columnTasks = groupedTasks[column.status]
                return (
                    <Paper
                        key={column.status}
                        elevation={0}
                        className="fade-in-up"
                        onDragOver={(event) => {
                            event.preventDefault()
                            event.dataTransfer.dropEffect = 'move'
                            setActiveDropStatus(column.status)
                        }}
                        onDragEnter={() => setActiveDropStatus(column.status)}
                        onDragLeave={() => setActiveDropStatus((current) => (current === column.status ? null : current))}
                        onDrop={(event) => {
                            void handleDropOnColumn(event, column.status)
                        }}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: activeDropStatus === column.status
                                ? '2px solid rgba(14, 124, 102, 0.45)'
                                : '1px solid rgba(23, 34, 38, 0.1)',
                            background: activeDropStatus === column.status
                                ? 'linear-gradient(160deg, #f2fbf8 0%, #ffffff 90%)'
                                : 'linear-gradient(160deg, #ffffff 0%, #f9fcfb 90%)',
                            transition: 'all 0.18s ease',
                            animationDelay: `${index * 70}ms`
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: column.tone }}>
                                {column.title}
                            </Typography>
                            <Chip size="small" label={columnTasks.length} sx={{ fontWeight: 700 }} />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {column.hint}
                        </Typography>

                        <Box display="grid" gap={1.25} minHeight="120px">
                            {columnTasks.length === 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        border: '1px dashed rgba(23, 34, 38, 0.25)',
                                        bgcolor: 'rgba(245, 249, 248, 0.82)'
                                    }}
                                >
                                    <Typography fontWeight={700} color="text.primary">
                                        Nessuna task qui
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                                        Trascina una card in questa colonna.
                                    </Typography>
                                </Paper>
                            )}

                            {columnTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, task.id)}
                                    onDragEnd={() => {
                                        setDraggedTaskId(null)
                                        setActiveDropStatus(null)
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                )
            })}
        </Box>
    )
}