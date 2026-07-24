import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";

// Server-only synchronous JSON file store backing the admin CMS. Small data
// volume + low write concurrency (single local admin) make sync fs I/O fine
// here. TODO Phase 3: swap these bodies for Supabase queries — call sites in
// src/lib/data/*.ts are written to make that a drop-in change.
const dataDir = join(process.cwd(), "data");

export function readJsonFile<T>(file: string, fallback: T): T {
  const path = join(dataDir, file);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export function writeJsonFile<T>(file: string, data: T): void {
  const path = join(dataDir, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function generateId(): string {
  return randomUUID();
}
