import express from 'express';
import { getDatabaseConnection } from '../db/connection.js';
import { COUNT_TRANSACTIONS, COUNT_TRANSACTIONS_BY_DESCRIPTION } from '../db/queries.js';

const router = express.Router();

router.get('/count', async (req, res) => {
    try {
        const db = await getDatabaseConnection();
        const result = await db.get(COUNT_TRANSACTIONS);
        res.json({ transaction_count: result.count });
        await db.close();
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transaction count' });
    }
});

router.get('/count/:description', async (req, res) => {
    const { description } = req.params;

    try {
        const db = await getDatabaseConnection();
        const result = await db.get(COUNT_TRANSACTIONS_BY_DESCRIPTION, [description]);
        res.json({
            description,
            transaction_count: result.transaction_count || 0,
        });
        await db.close();
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transaction count for the specified description' });
    }
});

export default router;
