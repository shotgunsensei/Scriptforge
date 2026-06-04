const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "official",
  "community",
  "review",
  "submit",
  "new",
]);

export function createScriptSlug(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug.slice(0, 80);
}

export function isValidScriptSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !RESERVED_SLUGS.has(slug);
}

export { RESERVED_SLUGS };
