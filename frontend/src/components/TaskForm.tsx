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
    Box
} from '@mui/material';
import type { Task, CreateTaskDto } from '../types/task.types';


interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: CreateTaskDto) => void;
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
    }, [editTask, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        onClose()
    }

    const handleChange = (field: keyof CreateTaskDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {editTask ? 'Modifica Task' : 'Nuova Task'}
                </DialogTitle>

                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Titolo"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Descrizione"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
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
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Annulla</Button>
                    <Button type="submit" variant="contained">
                        {editTask ? 'Salva' : 'Crea'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}