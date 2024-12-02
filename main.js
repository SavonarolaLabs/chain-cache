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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	await db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ergo_tree TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_transactions_updated_at
    AFTER UPDATE ON transactions
    BEGIN
      UPDATE transactions
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);

	await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_watchlist_updated_at
    AFTER UPDATE ON watchlist
    BEGIN
      UPDATE watchlist
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);

	console.log("Database, tables, and triggers setup complete.");
	return db;
}

setupDatabase().catch(console.error);
