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
    const [errors, setErrors] = useState<{ title?: string; description?: string; release_date?: string }>({})

    const MAX_TITLE_LENGTH = 120
    const MAX_DESCRIPTION_LENGTH = 500

    const isValidDateString = (value: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false
        }

        const parsed = Date.parse(value)
        return !Number.isNaN(parsed)
    }

    const validateForm = (data: CreateTaskDto) => {
        const nextErrors: { title?: string; description?: string; release_date?: string } = {}

        const title = data.title.trim()
        if (!title) {
            nextErrors.title = 'Il titolo e obbligatorio'
        } else if (title.length > MAX_TITLE_LENGTH) {
            nextErrors.title = `Il titolo non puo superare ${MAX_TITLE_LENGTH} caratteri`
        }

        const description = (data.description || '').trim()
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            nextErrors.description = `La descrizione non puo superare ${MAX_DESCRIPTION_LENGTH} caratteri`
        }

        if (data.release_date && !isValidDateString(data.release_date)) {
            nextErrors.release_date = 'Data di rilascio non valida'
        }

        return nextErrors
    }

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
        const normalized: CreateTaskDto = {
            ...formData,
            title: formData.title.trim(),
            description: (formData.description || '').trim(),
            release_date: formData.release_date || undefined
        }
        const validationErrors = validateForm(normalized)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        await onSubmit(normalized)
    }

    const handleChange = (field: keyof CreateTaskDto, value: CreateTaskDto[keyof CreateTaskDto]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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