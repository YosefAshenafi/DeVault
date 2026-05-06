import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('devault.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS resources (
          id TEXT PRIMARY KEY NOT NULL,
          userId TEXT NOT NULL,
          title TEXT NOT NULL,
          url TEXT,
          note TEXT NOT NULL DEFAULT '',
          tags TEXT NOT NULL DEFAULT '',
          thumbnailUrl TEXT,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resources_user ON resources(userId);
        CREATE INDEX IF NOT EXISTS idx_resources_user_updated ON resources(userId, updatedAt DESC);
      `);
      return db;
    })();
  }
  return dbPromise;
}
