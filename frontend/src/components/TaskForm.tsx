import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import type { Task, CreateTaskDto } from '../types/task.types';
import { validateTaskInput, type TaskFormErrors } from '../utils/taskValidation';


interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: CreateTaskDto) => Promise<void>;
    editTask?: Task | null;
}

export const TaskForm = ({ open, onClose, onSubmit, editTask }: TaskFormProps) => {
    const [formData, setFormData] = useState<CreateTaskDto>({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        release_date: undefined
    })
    const [errors, setErrors] = useState<TaskFormErrors>({})

    // Keep local form state in sync when dialog opens for create vs edit.
    useEffect(() => {
        if (editTask) {
            setFormData({
                title: editTask.title,
                description: editTask.description || '',
                priority: editTask.priority,
                status: editTask.status,
                release_date: editTask.release_date
            })
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                release_date: undefined
            })
        }
        setErrors({})
    }, [editTask, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Normalize values once so frontend and backend validate the same shape.
        const normalized: CreateTaskDto = {
            ...formData,
            title: formData.title.trim(),
            description: (formData.description || '').trim(),
            release_date: formData.release_date || undefined
        }
        const validationErrors = validateTaskInput(normalized)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        await onSubmit(normalized)
    }

    const handleChange = (field: keyof CreateTaskDto, value: CreateTaskDto[keyof CreateTaskDto]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear only the error related to the field currently being edited.
        if (field === 'title' || field === 'description' || field === 'release_date') {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    border: '1px solid rgba(23, 34, 38, 0.1)',
                    background: 'linear-gradient(165deg, #ffffff 0%, #f7fbfa 100%)'
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    <Typography variant="h5" fontWeight={700}>
                        {editTask ? 'Modifica Task' : 'Nuova Task'}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Titolo"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Es. Preparare demo cliente"
                            required
                            fullWidth
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                        />

                        <TextField
                            label="Descrizione"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            multiline
                            rows={3}
                            placeholder="Dettagli utili per eseguire la task"
                            fullWidth
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Priorità</InputLabel>
                            <Select
                                value={formData.priority}
                                label="Priorità"
                                onChange={(e) => handleChange('priority', e.target.value)}
                            >
                                <MenuItem value="low">Bassa</MenuItem>
                                <MenuItem value="medium">Media</MenuItem>
                                <MenuItem value="high">Alta</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Stato</InputLabel>
                            <Select
                                value={formData.status}
                                label="Stato"
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <MenuItem value="todo">Da fare</MenuItem>
                                <MenuItem value="in_progress">In corso</MenuItem>
                                <MenuItem value="done">Completato</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Data di rilascio"
                            type="date"
                            value={formData.release_date || ''}
                            onChange={(e) => handleChange('release_date', e.target.value || undefined)}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            fullWidth
                            error={Boolean(errors.release_date)}
                            helperText={errors.release_date}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="text">Annulla</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            borderRadius: 999,
                            bgcolor: '#0e7c66',
                            '&:hover': { bgcolor: '#0b5f4f' }
                        }}
                    >
                        {editTask ? 'Salva' : 'Crea'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}