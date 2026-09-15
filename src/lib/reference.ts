// Human-facing enquiry reference, e.g. "MAV-2026-K3F9Q". Not a security
// token and not guaranteed globally unique on its own — callers insert with
// this value under a unique DB constraint and retry on conflict.
export function generateReference(prefix = "MAV") {
  const year = new Date().getFullYear();
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `${prefix}-${year}-${code}`;
}
