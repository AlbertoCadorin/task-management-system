import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db-tasks',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection test
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connesso con successo!');
        connection.release();
    } catch (error) {
        console.error('❌ Errore connessione database:', error);
        process.exit(1);
    }
};