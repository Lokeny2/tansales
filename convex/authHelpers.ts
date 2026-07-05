import type { QueryCtx, MutationCtx } from "./_generated/server";

// Looks up who (if anyone) a given session token actually belongs to,
// and confirms that session hasn't expired.
export async function getSessionUser(
  ctx: QueryCtx | MutationCtx,
  token: string,
) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique()
    .catch(() => null);

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return await ctx.db.get(session.userId);
}

// Throws unless the token belongs to a real, currently-logged-in admin.
// Any admin-only function should call this FIRST, before doing anything else.
export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  const user = await getSessionUser(ctx, token);
  if (!user || user.role !== "admin") {
    throw new Error("UNAUTHORIZED: Admin access required.");
  }
  return user;
}
