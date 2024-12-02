import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = 3000;

async function getDatabaseConnection() {
	return await open({
		filename: "ergo_cache.db",
		driver: sqlite3.Database,
	});
}

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
	res.send("Web server is running!");
});

// Get all entries in watchlist
app.get("/watchlist", async (req, res) => {
	try {
		const db = await getDatabaseConnection();
		const watchlist = await db.all("SELECT * FROM watchlist");
		res.json(watchlist);
		await db.close();
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch watchlist" });
	}
});

// Add a new watchlist entry
app.post("/watchlist", async (req, res) => {
	const { ergo_tree, description } = req.body;

	if (!ergo_tree || !description) {
		return res
			.status(400)
			.json({ error: "ergo_tree and description are required" });
	}

	try {
		const db = await getDatabaseConnection();
		await db.run(
			"INSERT INTO watchlist (ergo_tree, description) VALUES (?, ?)",
			[ergo_tree, description]
		);
		res.status(201).json({ message: "Watchlist entry added successfully" });
		await db.close();
	} catch (error) {
		res.status(500).json({ error: "Failed to add watchlist entry" });
	}
});

// Get transaction count
app.get("/transactions/count", async (req, res) => {
	try {
		const db = await getDatabaseConnection();
		const result = await db.get(
			"SELECT COUNT(*) AS count FROM transactions"
		);
		res.json({ transaction_count: result.count });
		await db.close();
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch transaction count" });
	}
});

// Get transaction count for a specific description
app.get("/transactions/count/:description", async (req, res) => {
	const { description } = req.params;

	try {
		const db = await getDatabaseConnection();
		const result = await db.get(
			`
            SELECT COUNT(t.id) AS transaction_count
            FROM transactions t
            JOIN watchlist w ON t.ergo_tree = w.ergo_tree
            WHERE w.description = ?
        `,
			[description]
		);

		res.json({
			description,
			transaction_count: result.transaction_count || 0,
		});

		await db.close();
	} catch (error) {
		res.status(500).json({
			error: "Failed to fetch transaction count for the specified description",
		});
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
