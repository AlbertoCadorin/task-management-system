import { TaskItem } from './components/TaskItem';
import type { Task } from './types/task.types';
import { Container, Typography } from '@mui/material';

function App() {
  // Task di esempio per testare
  const taskEsempio: Task = {
    id: 1,
    title: "Task di test",
    description: "Questa è una task di esempio per testare il componente",
    priority: "high",
    status: "in_progress",
    release_date: "2026-03-10",
    created_at: "2026-03-06T10:00:00Z",
    updated_at: "2026-03-06T10:00:00Z"
  };

  const handleEdit = (task: Task) => {
    console.log("Modifica task:", task);
    alert(`Modifica task: ${task.title}`);
  };

  const handleDelete = (id: number) => {
    console.log("Elimina task:", id);
    alert(`Elimina task ID: ${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test TaskItem
      </Typography>

      <TaskItem
        task={taskEsempio}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
}

export default App;
