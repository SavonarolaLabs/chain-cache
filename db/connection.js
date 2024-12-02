import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDatabaseConnection() {
    return open({
        filename: 'ergo_cache.db',
        driver: sqlite3.Database,
    });
}
