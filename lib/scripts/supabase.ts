import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  bucket: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    bucket: process.env.SUPABASE_STORAGE_BUCKET || "scriptforge",
  };
}

export function assertSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();

  if (!config.url || !config.serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase production storage.");
  }

  return config;
}

export function createSupabaseServiceClient(): SupabaseClient {
  const config = assertSupabaseConfig();

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function checkSupabaseConnection() {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("script_submissions").select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
