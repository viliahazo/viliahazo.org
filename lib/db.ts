import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. The service_role key bypasses RLS, so it must
 * never be imported from a Client Component.
 */
export function getDb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

type SelectOptions = {
  /** Equality filter, e.g. { column: "statut", value: "publie" } */
  eq?: { column: string; value: string | number | boolean };
  order?: { column: string; ascending?: boolean };
  limit?: number;
};

/**
 * Read rows, returning an empty list when the database is not configured or
 * the query fails — public pages must stay usable without a database.
 */
export async function selectRows<T>(
  table: string,
  options: SelectOptions = {},
): Promise<T[]> {
  const db = getDb();
  if (!db) return [];

  let query = db.from(table).select("*");
  if (options.eq) query = query.eq(options.eq.column, options.eq.value);
  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
    });
  }
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) {
    console.error(`[db] ${table}: ${error.message}`);
    return [];
  }
  return (data ?? []) as T[];
}
