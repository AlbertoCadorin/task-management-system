import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import taskRoutes from './routers/taskRouters';

// Carica variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Route di test
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API funzionante! 🚀' });
});

// Route non trovata
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trovata' });
});

// Avvio del server
const startServer = async () => {
    try {
        // Test connessione database
        await testConnection();

        // Avvia server
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