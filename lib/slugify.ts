/**
 * Same rule as the SQL used to migrate legacy products:
 * lower-case, every run of characters outside a–z/0–9 becomes "-", trimmed.
 * Keep it identical, or old /product?name= links stop resolving.
 */
export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
