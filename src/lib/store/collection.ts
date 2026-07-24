import { readJsonFile, writeJsonFile } from "./json-file";

// Generic CRUD over a JSON file holding an array of records keyed by a
// unique field (slug or id). Used by every simple content-entity store.
export function createCollectionStore<T>(file: string, keyOf: (item: T) => string) {
  function getAll(): T[] {
    return readJsonFile<T[]>(file, []);
  }

  function getByKey(key: string): T | undefined {
    return getAll().find((item) => keyOf(item) === key);
  }

  function create(item: T): T {
    const all = getAll();
    all.push(item);
    writeJsonFile(file, all);
    return item;
  }

  function update(key: string, patch: Partial<T>): T | undefined {
    const all = getAll();
    const index = all.findIndex((item) => keyOf(item) === key);
    if (index === -1) return undefined;
    all[index] = { ...all[index], ...patch };
    writeJsonFile(file, all);
    return all[index];
  }

  function remove(key: string): boolean {
    const all = getAll();
    const next = all.filter((item) => keyOf(item) !== key);
    if (next.length === all.length) return false;
    writeJsonFile(file, next);
    return true;
  }

  return { getAll, getByKey, create, update, remove };
}
