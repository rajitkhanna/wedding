/**
 * Resolves the reachable email addresses for a set of guests.
 *
 * Guests without their own inbox get a `noemail+<slug>@meghanarajit.com`
 * placeholder in the unique-required `email` field; their real address lives in
 * `contactEmail`. Prefer `contactEmail`, fall back to `email`, and skip
 * placeholder addresses so we never send to (or burn quota on) them.
 *
 * `contactEmail` may hold several addresses separated by `,`, `;` or newlines —
 * e.g. a party head plus the family members who also want party mail.
 */
export function guestRecipientEmails(
  guests: Array<{ email?: string | null; contactEmail?: string | null }>,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of guests) {
    const source = (g.contactEmail || g.email || "").trim();
    if (!source) continue;
    for (const part of source.split(/[,;\s]+/)) {
      const addr = part.trim();
      if (!addr) continue;
      if (addr.toLowerCase().startsWith("noemail+")) continue;
      const key = addr.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(addr);
    }
  }
  return out;
}
