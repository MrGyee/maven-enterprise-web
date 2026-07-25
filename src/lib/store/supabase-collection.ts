import { getSupabaseClient } from "@/lib/supabase/server-client";

// Async replacement for the old fs-based createCollectionStore (Phase 2).
// Same getAll/getByKey/create/update/remove shape, backed by a Supabase
// table instead of a JSON file. `toDomain`/`toRow` bridge the DB's
// snake_case columns and the app's camelCase domain types.
export function createSupabaseCollectionStore<Row extends object, Domain>(
  table: string,
  keyColumn: string,
  toDomain: (row: Row) => Domain,
  toRow: (domain: Domain) => Row
) {
  async function getAll(): Promise<Domain[]> {
    const { data, error } = await getSupabaseClient().from(table).select("*");
    if (error) throw new Error(`[${table}] getAll: ${error.message}`);
    return ((data ?? []) as Row[]).map(toDomain);
  }

  async function getByKey(key: string): Promise<Domain | undefined> {
    const { data, error } = await getSupabaseClient()
      .from(table)
      .select("*")
      .eq(keyColumn, key)
      .maybeSingle();
    if (error) throw new Error(`[${table}] getByKey: ${error.message}`);
    return data ? toDomain(data as Row) : undefined;
  }

  async function create(item: Domain): Promise<Domain> {
    // `table` is a runtime string, not a literal type, so with no generated
    // Database schema type, insert()/update() can't infer a row shape and
    // resolve their payload param to `never`. The `Row`/`Domain` generics
    // above already give us the real type safety; cast the builder past
    // that gap.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from(table) as any)
      .insert(toRow(item))
      .select()
      .single();
    if (error) throw new Error(`[${table}] create: ${error.message}`);
    return toDomain(data as Row);
  }

  async function update(key: string, patch: Partial<Domain>): Promise<Domain | undefined> {
    const existing = await getByKey(key);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch } as Domain;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from(table) as any)
      .update(toRow(merged))
      .eq(keyColumn, key)
      .select()
      .single();
    if (error) throw new Error(`[${table}] update: ${error.message}`);
    return toDomain(data as Row);
  }

  async function remove(key: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient()
      .from(table)
      .delete()
      .eq(keyColumn, key)
      .select();
    if (error) throw new Error(`[${table}] remove: ${error.message}`);
    return (data?.length ?? 0) > 0;
  }

  return { getAll, getByKey, create, update, remove };
}
