import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import taskRoutes from './routers/taskRouters';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health-check route
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API funzionante! 🚀' });
});

// Fallback route
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trovata' });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Start HTTP server
        app.listen(PORT, () => {
            console.log(`🚀 Server avviato su http://localhost:${PORT}`);
            console.log(`📡 API disponibili su http://localhost:${PORT}/api/tasks`);
        });
    } catch (error) {
        console.error('❌ Errore nell\'avvio del server:', error);
        process.exit(1);
    }
};

startServer();