// all user related functions

import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const getAuthenticatedUser = async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) {
		throw new Error("Unauthorized!");
	}

	const currentUser = await ctx.db
		.query("users")
		.withIndex("by_clerk_id", (q) => {
			return q.eq("clerkId", identity.subject);
		})
		.first();

	if (!currentUser) {
		throw new Error("User not found");
	}

	return currentUser;
};

export const createUser = mutation({
	args: {
		username: v.string(),
		fullname: v.string(),
		image: v.string(),
		bio: v.optional(v.string()),
		email: v.string(),
		clerkId: v.string(),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
			.first();

		// user exists, don't create new user
		if (existingUser) {
			return;
		}

		// user doesn't exist, create new entry in convex db
		await ctx.db.insert("users", {
			username: args.username,
			fullname: args.fullname,
			email: args.email,
			bio: args.bio,
			image: args.image,
			clerkId: args.clerkId,
			followers: 0,
			following: 0,
			posts: 0,
		});
	},
});
