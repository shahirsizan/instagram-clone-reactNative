// all user related functions

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getUserByClerkId = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => {
				return q.eq("clerkId", args.clerkId);
			})
			.unique();

		return user;
	},
});

export const updateProfile = mutation({
	args: {
		fullname: v.string(),
		bio: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		await ctx.db.patch(currentUser._id, {
			fullname: args.fullname,
			bio: args.bio,
		});
	},
});

export const getUserProfile = query({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id);
		if (!user) {
			throw new Error("User not found");
		}

		return user;
	},
});

export const isFollowing = query({
	args: { followingId: v.id("users") },
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		const isFollowing = await ctx.db
			.query("follows")
			.withIndex("by_both", (q) =>
				q
					.eq("followerId", currentUser._id)
					.eq("followingId", args.followingId)
			)
			.first();

		return !!isFollowing;
	},
});

export const toggleFollow = mutation({
	args: { followingId: v.id("users") },
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		const isAlreadyFollowing = await ctx.db
			.query("follows")
			.withIndex("by_both", (q) =>
				q
					.eq("followerId", currentUser._id)
					.eq("followingId", args.followingId)
			)
			.first();

		if (isAlreadyFollowing) {
			// unfollow
			await ctx.db.delete(isAlreadyFollowing._id);

			await updateFollowCounts(
				ctx,
				currentUser._id,
				args.followingId,
				"unfollow"
			);
		} else {
			// follow
			await ctx.db.insert("follows", {
				followerId: currentUser._id,
				followingId: args.followingId,
			});

			await updateFollowCounts(
				ctx,
				currentUser._id,
				args.followingId,
				"follow"
			);

			// create a notification
			await ctx.db.insert("notifications", {
				receiverId: args.followingId,
				senderId: currentUser._id,
				type: "follow",
			});
		}
	},
});

const updateFollowCounts = async (
	ctx,
	followerId,
	followingId,
	whatTheyDid
) => {
	// purpose: update `follow count` of the person `who is following` &
	// the person `who is being followed`
	const follower = await ctx.db.get(followerId);
	const following = await ctx.db.get(followingId);

	await ctx.db.patch(followerId, {
		following: follower.following + (whatTheyDid === "follow" ? 1 : -1),
	});

	await ctx.db.patch(followingId, {
		followers: following.followers + (whatTheyDid === "follow" ? 1 : -1),
	});
};
