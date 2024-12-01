import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function setupDatabase() {
	const db = await open({
		filename: "ergo_cache.db",
		driver: sqlite3.Database,
	});

	await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_id TEXT NOT NULL,
      ergo_tree TEXT NOT NULL,
      data TEXT NOT NULL,
      height INTEGER NOT NULL,
      inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	console.log("Database and 'transactions' table setup complete.");
	return db;
}

setupDatabase().catch(console.error);
