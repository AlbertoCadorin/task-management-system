import { pool } from '../config/database';

type SeedTask = {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    release_date: string | null;
};

const toIsoDate = (offsetDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
};

const sampleTasks: SeedTask[] = [
    {
        title: '[Demo] Analisi requisiti onboarding',
        description: 'Raccogliere requisiti funzionali e vincoli tecnici con stakeholder.',
        priority: 'high',
        status: 'todo',
        release_date: toIsoDate(2)
    },
    {
        title: '[Demo] Wireframe dashboard kanban',
        description: 'Disegnare wireframe mobile e desktop della board.',
        priority: 'medium',
        status: 'todo',
        release_date: toIsoDate(4)
    },
    {
        title: '[Demo] Setup endpoint notifiche',
        description: 'Preparare endpoint backend per reminder task in scadenza.',
        priority: 'high',
        status: 'in_progress',
        release_date: toIsoDate(1)
    },
    {
        title: '[Demo] Refactor validazione form',
        description: 'Unificare validazione lato client e messaggi di errore.',
        priority: 'medium',
        status: 'in_progress',
        release_date: toIsoDate(3)
    },
    {
        title: '[Demo] Audit performance query task',
        description: 'Verificare indici e tempo medio di risposta sotto carico.',
        priority: 'low',
        status: 'in_progress',
        release_date: null
    },
    {
        title: '[Demo] Documentazione API v1',
        description: 'Completare esempi di request/response per il team frontend.',
        priority: 'low',
        status: 'done',
        release_date: toIsoDate(-3)
    },
    {
        title: '[Demo] Correzione bug drag and drop',
        description: 'Risolto drop intermittente su cambio colonna e rollback stato.',
        priority: 'high',
        status: 'done',
        release_date: toIsoDate(-1)
    },
    {
        title: '[Demo] Revisione copy UX',
        description: 'Uniformare microcopy bottoni, toast e stati vuoti.',
        priority: 'medium',
        status: 'todo',
        release_date: toIsoDate(5)
    },
    {
        title: '[Demo] Test integrazione update parziale',
        description: 'Aggiungere test per update solo status su endpoint PUT.',
        priority: 'medium',
        status: 'todo',
        release_date: toIsoDate(6)
    }
];

const seedTasks = async () => {
    try {
        await pool.query('DELETE FROM tasks WHERE title LIKE ?', ['[Demo]%']);

        for (const task of sampleTasks) {
            await pool.query(
                'INSERT INTO tasks (title, description, priority, status, release_date) VALUES (?, ?, ?, ?, ?)',
                [task.title, task.description, task.priority, task.status, task.release_date]
            );
        }

        console.log(`Seed completato: inserite ${sampleTasks.length} task demo.`);
    } catch (error) {
        console.error('Errore durante il seed delle task demo:', error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

void seedTasks();
