import * as Crypto from 'expo-crypto';
import type { Resource, ResourceInput } from '../types/resource';
import {
  findByUrlTitle,
  getResource,
  insertResourceWithId,
  listAllForUser,
  upsertResourceWithId,
} from './resourceRepository';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asStringOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v;
  return null;
}

function asNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function toInput(row: Record<string, unknown>): ResourceInput | null {
  const title = asString(row.title).trim();
  if (!title) return null;
  return {
    title,
    url: asStringOrNull(row.url),
    note: asString(row.note),
    tags: asString(row.tags),
    thumbnailUrl: asStringOrNull(row.thumbnailUrl),
  };
}

export async function exportResourcesToJson(userId: string): Promise<string> {
  const list = await listAllForUser(userId);
  return JSON.stringify(list satisfies Resource[], null, 2);
}

export type ImportResult = { imported: number; updated: number; skipped: number };

export async function importResourcesFromJson(currentUserId: string, jsonText: string): Promise<ImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText) as unknown;
  } catch {
    throw new Error('Invalid JSON file');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array of resources');
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  const now = Date.now();

  for (const item of parsed) {
    if (!isRecord(item)) {
      skipped += 1;
      continue;
    }
    const input = toInput(item);
    if (!input) {
      skipped += 1;
      continue;
    }

    const idRaw = asString(item.id).trim();
    const hasUuid = UUID_RE.test(idRaw);
    const createdAt = asNumber(item.createdAt, now);
    const updatedAt = asNumber(item.updatedAt, now);

    if (hasUuid) {
      const existing = await getResource(currentUserId, idRaw);
      if (existing) {
        await upsertResourceWithId(currentUserId, idRaw, input, { createdAt: existing.createdAt });
        updated += 1;
      } else {
        await insertResourceWithId(currentUserId, idRaw, input, createdAt, Math.max(updatedAt, createdAt));
        imported += 1;
      }
      continue;
    }

    const dup = await findByUrlTitle(currentUserId, input.url, input.title);
    if (dup) {
      skipped += 1;
      continue;
    }

    const newId = Crypto.randomUUID();
    await insertResourceWithId(currentUserId, newId, input, createdAt, updatedAt);
    imported += 1;
  }

  return { imported, updated, skipped };
}
