export function ProductionStorageWarning() {
  const isUnsafeProductionStorage =
    process.env.NODE_ENV === "production" && (process.env.SCRIPT_STORAGE_DRIVER ?? "local") === "local";

  if (!isUnsafeProductionStorage) {
    return null;
  }

  return (
    <section className="border border-amber-600 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100">
      <strong className="text-white">Production storage warning:</strong> SCRIPT_STORAGE_DRIVER is set to local.
      Vercel serverless filesystem writes are not durable. Use SCRIPT_STORAGE_DRIVER=database with Supabase before
      accepting production submissions or reviews.
    </section>
  );
}
