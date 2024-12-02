import express from 'express';
import { getDatabaseConnection } from '../db/connection.js';
import { SELECT_WATCHLIST, INSERT_WATCHLIST } from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await getDatabaseConnection();
        const watchlist = await db.all(SELECT_WATCHLIST);
        res.json(watchlist);
        await db.close();
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

router.post('/', async (req, res) => {
    const { ergo_tree, description } = req.body;

    if (!ergo_tree || !description) {
        return res.status(400).json({ error: 'ergo_tree and description are required' });
    }

    try {
        const db = await getDatabaseConnection();
        await db.run(INSERT_WATCHLIST, [ergo_tree, description]);
        res.status(201).json({ message: 'Watchlist entry added successfully' });
        await db.close();
    } catch (error) {
        res.status(500).json({ error: 'Failed to add watchlist entry' });
    }
});

export default router;
