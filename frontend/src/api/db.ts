import type { BaseEntity } from '@/types';
import { seedDatabase, SEED_VERSION } from './seed';
import { uid } from '@/lib/utils';

const STORAGE_KEY = 'neosix.db';
const VERSION_KEY = 'neosix.db.version';

type Database = Record<string, unknown[]>;

let cache: Database | null = null;

function load(): Database {
  if (cache) return cache;
  const storedVersion = localStorage.getItem(VERSION_KEY);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw && storedVersion === String(SEED_VERSION)) {
    try {
      cache = JSON.parse(raw) as Database;
      return cache;
    } catch {
      // corrupted store — fall through to reseed
    }
  }
  cache = seedDatabase();
  persist();
  localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
  return cache;
}

function persist(): void {
  if (cache) localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

/** Simulated network latency keeps loading states honest. */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function collection<T extends BaseEntity>(key: string): T[] {
  const db = load();
  if (!db[key]) db[key] = [];
  return db[key] as T[];
}

export const mockDb = {
  async list<T extends BaseEntity>(key: string): Promise<T[]> {
    return delay([...collection<T>(key)]);
  },

  async get<T extends BaseEntity>(key: string, id: string): Promise<T> {
    const item = collection<T>(key).find((entry) => entry.id === id);
    if (!item) throw new Error(`${key}/${id} not found`);
    return delay({ ...item });
  },

  async findBy<T extends BaseEntity>(key: string, field: keyof T, value: unknown): Promise<T> {
    const item = collection<T>(key).find((entry) => entry[field] === value);
    if (!item) throw new Error(`${key} where ${String(field)}=${String(value)} not found`);
    return delay({ ...item });
  },

  async create<T extends BaseEntity>(key: string, data: Omit<T, keyof BaseEntity>): Promise<T> {
    const now = new Date().toISOString();
    const item = { ...data, id: uid(), createdAt: now, updatedAt: now } as T;
    collection<T>(key).unshift(item);
    persist();
    return delay({ ...item });
  },

  async update<T extends BaseEntity>(key: string, id: string, data: Partial<T>): Promise<T> {
    const items = collection<T>(key);
    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error(`${key}/${id} not found`);
    items[index] = { ...items[index], ...data, id, updatedAt: new Date().toISOString() };
    persist();
    return delay({ ...items[index] });
  },

  async remove(key: string, id: string): Promise<void> {
    const db = load();
    db[key] = (db[key] as BaseEntity[]).filter((entry) => entry.id !== id);
    persist();
    return delay(undefined);
  },
};
