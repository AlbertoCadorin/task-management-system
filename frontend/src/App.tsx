import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { taskService } from './services/taskService';
import type { Task, CreateTaskDto } from './types/task.types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Carica tutte le task
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      showSnackbar('Errore nel caricamento delle task', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Carica task all'avvio
  useEffect(() => {
    loadTasks();
  }, []);

  // Mostra notifica
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Crea o aggiorna task
  const handleSubmit = async (taskData: CreateTaskDto) => {
    try {
      if (editingTask) {
        // Aggiorna task esistente
        await taskService.updateTask(editingTask.id, taskData);
        showSnackbar('Task aggiornata con successo! ✅', 'success');
      } else {
        // Crea nuova task
        await taskService.createTask(taskData);
        showSnackbar('Task creata con successo! 🎉', 'success');
      }
      loadTasks();
      setOpenForm(false);
      setEditingTask(null);
    } catch (error) {
      showSnackbar('Errore nel salvataggio della task', 'error');
      console.error(error);
    }
  };

  // Apri form per modifica
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpenForm(true);
  };

  // Elimina task
  const handleDelete = async (id: number) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa task?')) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      showSnackbar('Task eliminata con successo! 🗑️', 'success');
      loadTasks();
    } catch (error) {
      showSnackbar('Errore nell\'eliminazione della task', 'error');
      console.error(error);
    }
  };

  // Apri form per nuova task
  const handleNewTask = () => {
    setEditingTask(null);
    setOpenForm(true);
  };

  // Chiudi form
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTask(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1" fontWeight="bold">
          📋 Task Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewTask}
          size="large"
        >
          Nuova Task
        </Button>
      </Box>

      {/* Lista Task */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Dialog */}
      <TaskForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editTask={editingTask}
      />

      {/* Notifiche */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;