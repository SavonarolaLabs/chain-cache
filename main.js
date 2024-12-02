import express from 'express';
import watchlistRoutes from './routes/watchlist.js';
import transactionRoutes from './routes/transactions.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Web server is running!');
});

app.use('/watchlist', watchlistRoutes);
app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
