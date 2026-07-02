import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const signUp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique()
      .catch(() => null);

    if (existing) {
      return {
        ok: false,
        message: "An account with this email already exists.",
      };
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash: hashPassword(args.password),
      role: "customer",
      createdAt: new Date().toISOString(),
    });

    const token = crypto.randomBytes(24).toString("hex");
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true,
      message: "Account created successfully.",
      token,
      user: {
        id: userId,
        name: args.name,
        email: args.email,
        role: "customer",
      },
    };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique()
      .catch(() => null);

    if (!user || user.passwordHash !== hashPassword(args.password)) {
      return { ok: false, message: "Invalid email or password." };
    }

    const token = crypto.randomBytes(24).toString("hex");
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true,
      message: "Signed in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
});

export const signOut = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return { ok: true, message: "Signed out." };
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()
      .catch(() => null);

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { ok: true, message: "Signed out." };
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()
      .catch(() => null);

    if (!session || session.expiresAt <= Date.now()) {
      if (session) {
        await ctx.db.delete(session._id);
      }
      return null;
    }

    const user = await ctx.db.get("users", session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});
