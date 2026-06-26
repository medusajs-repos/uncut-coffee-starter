/**
 * Query-string key used to encode the set of selected product option value
 * ids on the storefront. Multiple values are encoded as repeated keys (or as
 * a single comma-separated value, supported as a fallback).
 */
export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

type RouteSearchParams = Record<string, string | string[] | undefined>

/**
 * Parses option value ids from either a URLSearchParams instance (browser
 * URL) or a server-side TanStack Start route loader `search` record. Returns
 * a deduped list of non-empty ids. Falls back to a comma-separated single
 * value when no repeated keys are present.
 */
export function parseOptionValueIds(
  input: URLSearchParams | RouteSearchParams | undefined | null
): string[] {
  if (!input) return []

  const collected: string[] = []

  if (input instanceof URLSearchParams) {
    const all = input.getAll(OPTION_VALUE_QUERY_KEY)
    if (all.length > 1) {
      collected.push(...all)
    } else if (all.length === 1) {
      collected.push(...all[0].split(","))
    }
  } else {
    const value = input[OPTION_VALUE_QUERY_KEY]
    if (Array.isArray(value)) {
      collected.push(...value)
    } else if (typeof value === "string" && value.length > 0) {
      collected.push(...value.split(","))
    }
  }

  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of collected) {
    const id = raw.trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}
