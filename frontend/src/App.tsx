import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length
  };

  // Load all tasks
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

  // Load tasks on startup
  useEffect(() => {
    loadTasks();
  }, []);

  // Show notification
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Create or update task
  const handleSubmit = async (taskData: CreateTaskDto) => {
    try {
      if (editingTask) {
        // Update existing task
        await taskService.updateTask(editingTask.id, taskData);
        showSnackbar('Task aggiornata con successo! ✅', 'success');
      } else {
        // Create new task
        await taskService.createTask(taskData);
        showSnackbar('Task creata con successo! 🎉', 'success');
      }
      await loadTasks();
      setOpenForm(false);
      setEditingTask(null);
    } catch (error) {
      showSnackbar('Errore nel salvataggio della task', 'error');
      console.error(error);
    }
  };

  // Open form in edit mode
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpenForm(true);
  };

  // Open delete confirmation
  const handleDelete = (id: number) => {
    setTaskToDelete(id);
  };

  // Confirm task deletion
  const handleConfirmDelete = async () => {
    if (taskToDelete === null) {
      return;
    }

    try {
      await taskService.deleteTask(taskToDelete);
      showSnackbar('Task eliminata con successo! 🗑️', 'success');
      await loadTasks();
      setTaskToDelete(null);
    } catch (error) {
      showSnackbar('Errore nell\'eliminazione della task', 'error');
      console.error(error);
    }
  };

  // Close delete confirmation
  const handleCloseDeleteDialog = () => {
    setTaskToDelete(null);
  };

  // Open form for new task
  const handleNewTask = () => {
    setEditingTask(null);
    setOpenForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTask(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box className="fade-in-up" mb={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            border: '1px solid rgba(23, 34, 38, 0.08)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fcfb 100%)'
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            gap={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            mb={2}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontFamily: 'Space Grotesk, Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.9rem', md: '2.5rem' }
                }}
              >
                Task Manager
              </Typography>
              <Typography color="text.secondary" mt={0.75}>
                Organizza il lavoro e monitora l'avanzamento in modo semplice.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewTask}
              size="large"
              sx={{
                alignSelf: { xs: 'flex-start', md: 'auto' },
                borderRadius: 999,
                px: 2.5,
                boxShadow: '0 10px 24px rgba(14, 124, 102, 0.24)',
                bgcolor: '#0e7c66',
                '&:hover': { bgcolor: '#0b5f4f' }
              }}
            >
              Nuova Task
            </Button>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label={`Totali: ${stats.total}`} sx={{ fontWeight: 700 }} />
            <Chip label={`Da fare: ${stats.todo}`} color="default" variant="outlined" />
            <Chip label={`In corso: ${stats.inProgress}`} color="warning" variant="outlined" />
            <Chip label={`Completate: ${stats.done}`} color="success" variant="outlined" />
          </Box>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        className="fade-in-up"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          border: '1px solid rgba(23, 34, 38, 0.08)',
          bgcolor: '#ffffffd9',
          backdropFilter: 'blur(4px)'
        }}
      >
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Form Dialog */}
      <TaskForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editTask={editingTask}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={taskToDelete !== null} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare questa task? Questa azione non puo essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
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