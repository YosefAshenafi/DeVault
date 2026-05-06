import * as Crypto from 'expo-crypto';
import type { Resource, ResourceInput } from '../types/resource';
import { getDatabase } from './db';

type ResourceRow = {
  id: string;
  userId: string;
  title: string;
  url: string | null;
  note: string;
  tags: string;
  thumbnailUrl: string | null;
  createdAt: number;
  updatedAt: number;
};

function rowToResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    url: row.url,
    note: row.note,
    tags: row.tags,
    thumbnailUrl: row.thumbnailUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function normalizeUrlKey(url: string | null): string {
  return (url ?? '').trim().toLowerCase();
}

function normalizeTitleKey(title: string): string {
  return title.trim().toLowerCase();
}

export async function createResource(userId: string, input: ResourceInput): Promise<Resource> {
  const db = await getDatabase();
  const now = Date.now();
  const id = Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO resources (id, userId, title, url, note, tags, thumbnailUrl, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    userId,
    input.title,
    input.url,
    input.note,
    input.tags,
    input.thumbnailUrl,
    now,
    now,
  );
  const row = await db.getFirstAsync<ResourceRow>('SELECT * FROM resources WHERE id = ?', id);
  if (!row) throw new Error('Failed to read inserted resource');
  return rowToResource(row);
}

export async function updateResource(
  userId: string,
  id: string,
  input: ResourceInput,
): Promise<Resource | null> {
  const db = await getDatabase();
  const now = Date.now();
  const result = await db.runAsync(
    `UPDATE resources SET title = ?, url = ?, note = ?, tags = ?, thumbnailUrl = ?, updatedAt = ?
     WHERE id = ? AND userId = ?`,
    input.title,
    input.url,
    input.note,
    input.tags,
    input.thumbnailUrl,
    now,
    id,
    userId,
  );
  if (result.changes === 0) return null;
  const row = await db.getFirstAsync<ResourceRow>(
    'SELECT * FROM resources WHERE id = ? AND userId = ?',
    id,
    userId,
  );
  return row ? rowToResource(row) : null;
}

export async function deleteResource(userId: string, id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.runAsync('DELETE FROM resources WHERE id = ? AND userId = ?', id, userId);
  return result.changes > 0;
}

export async function getResource(userId: string, id: string): Promise<Resource | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ResourceRow>(
    'SELECT * FROM resources WHERE id = ? AND userId = ?',
    id,
    userId,
  );
  return row ? rowToResource(row) : null;
}

export type ListFilters = {
  search?: string;
  tag?: string;
};

export async function listResources(userId: string, filters: ListFilters = {}): Promise<Resource[]> {
  const db = await getDatabase();
  const search = filters.search?.trim();
  const tag = filters.tag?.trim().toLowerCase();

  const conditions: string[] = ['userId = ?'];
  const params: (string | number)[] = [userId];

  if (search) {
    const q = `%${search.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
    conditions.push('(title LIKE ? ESCAPE "\\" OR note LIKE ? ESCAPE "\\" OR tags LIKE ? ESCAPE "\\")');
    params.push(q, q, q);
  }

  if (tag) {
    const t = tag.toLowerCase();
    conditions.push(`(',' || REPLACE(LOWER(tags), ' ', '') || ',' LIKE ?)`);
    params.push(`%,${t},%`);
  }

  const where = conditions.join(' AND ');
  const sql = `SELECT * FROM resources WHERE ${where} ORDER BY updatedAt DESC`;
  const rows = await db.getAllAsync<ResourceRow>(sql, ...params);
  return rows.map(rowToResource);
}

export async function findByUrlTitle(
  userId: string,
  url: string | null,
  title: string,
): Promise<Resource | null> {
  const db = await getDatabase();
  const u = normalizeUrlKey(url);
  const t = title.trim();
  const rows = await db.getAllAsync<ResourceRow>(
    'SELECT * FROM resources WHERE userId = ? AND LOWER(TRIM(IFNULL(url, ""))) = ? AND LOWER(TRIM(title)) = ?',
    userId,
    u,
    normalizeTitleKey(t),
  );
  return rows[0] ? rowToResource(rows[0]) : null;
}

export async function getResourceByIdForUser(userId: string, id: string): Promise<Resource | null> {
  return getResource(userId, id);
}

export async function upsertResourceWithId(
  userId: string,
  id: string,
  input: ResourceInput,
  options: { createdAt?: number } = {},
): Promise<Resource> {
  const db = await getDatabase();
  const now = Date.now();
  const existing = await db.getFirstAsync<ResourceRow>(
    'SELECT * FROM resources WHERE id = ? AND userId = ?',
    id,
    userId,
  );
  if (existing) {
    await db.runAsync(
      `UPDATE resources SET title = ?, url = ?, note = ?, tags = ?, thumbnailUrl = ?, updatedAt = ?
       WHERE id = ? AND userId = ?`,
      input.title,
      input.url,
      input.note,
      input.tags,
      input.thumbnailUrl,
      now,
      id,
      userId,
    );
  } else {
    const createdAt = options.createdAt ?? now;
    await db.runAsync(
      `INSERT INTO resources (id, userId, title, url, note, tags, thumbnailUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      userId,
      input.title,
      input.url,
      input.note,
      input.tags,
      input.thumbnailUrl,
      createdAt,
      now,
    );
  }
  const row = await db.getFirstAsync<ResourceRow>('SELECT * FROM resources WHERE id = ? AND userId = ?', id, userId);
  if (!row) throw new Error('upsert failed');
  return rowToResource(row);
}

export async function insertResourceWithId(
  userId: string,
  id: string,
  input: ResourceInput,
  createdAt: number,
  updatedAt: number,
): Promise<Resource> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO resources (id, userId, title, url, note, tags, thumbnailUrl, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    userId,
    input.title,
    input.url,
    input.note,
    input.tags,
    input.thumbnailUrl,
    createdAt,
    updatedAt,
  );
  const row = await db.getFirstAsync<ResourceRow>('SELECT * FROM resources WHERE id = ? AND userId = ?', id, userId);
  if (!row) throw new Error('insert failed');
  return rowToResource(row);
}

/** Top tags by frequency (comma-separated tags on resources). */
export async function getTopTags(userId: string, limit = 12): Promise<{ tag: string; count: number }[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ResourceRow>('SELECT tags FROM resources WHERE userId = ?', userId);
  const counts = new Map<string, number>();
  for (const row of rows) {
    const parts = row.tags
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    for (const p of parts) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}

export async function listAllForUser(userId: string): Promise<Resource[]> {
  return listResources(userId, {});
}
