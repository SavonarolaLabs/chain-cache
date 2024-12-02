export const COUNT_TRANSACTIONS = `SELECT COUNT(*) AS count FROM transactions`;

export const COUNT_TRANSACTIONS_BY_DESCRIPTION = `
    SELECT COUNT(t.id) AS transaction_count
    FROM transactions t
    JOIN watchlist w ON t.ergo_tree = w.ergo_tree
    WHERE w.description = ?
`;

export const SELECT_WATCHLIST = `SELECT * FROM watchlist`;

export const INSERT_WATCHLIST = `
    INSERT INTO watchlist (ergo_tree, description) VALUES (?, ?)
`;
