// Lightweight in-process rate limiter.
//
// Honest limitation: this state lives in the memory of a single serverless
// function instance. Vercel frequently reuses warm instances for bursts of
// traffic from the same region/source, so this meaningfully slows down
// scripted abuse in practice — but it is not a distributed guarantee. A
// determined attacker spread across many function instances (or regions)
// could bypass it. For an airtight, cross-region limit, the fix is a Vercel
// Firewall rate-limit rule (Project -> Firewall -> Rate Limiting) or a
// shared store like Upstash Redis — both need a one-time dashboard/account
// step this code alone can't provision.
const buckets = new Map<string, { count: number; resetAt: number }>();

// Periodically forget old buckets so this doesn't grow unbounded on a
// long-lived warm instance.
const MAX_BUCKETS = 5000;

export function checkLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey) buckets.delete(oldestKey);
    }
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

// Best-effort caller IP from standard proxy headers (Vercel sets x-forwarded-for).
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
