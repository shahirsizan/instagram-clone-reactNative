import { v } from "convex/values";
import { mutation } from "./_generated/server";

// 3 steps to upload file to convex storage:
//     1. Generate an upload URL using a mutation that calls `storage.generateUploadUrl()`.
//     2. Send a `POST` request with the `file` contents to the upload URL and receive a `storage ID`.
//     3. Save the storage ID into your data model via another mutation.

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export const createPost = mutation({
	args: {
		caption: v.string(),
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized user!");
		}

		// fetch current user info from convex db
		const currentUser = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!currentUser) {
			throw new Error("User not found!");
		}

		const imageUrl = await ctx.storage.getUrl(args.storageId);

		if (!imageUrl) {
			throw new Error("Image not found!");
		}

		// create post
		const postId = await ctx.db.insert("posts", {
			userId: currentUser._id,
			imageUrl: imageUrl,
			storageId: args.storageId, // will be needed when we want to delete a post
			caption: args.caption,
			likes: 0,
			comments: 0,
		});

		// increment of number of posts of the current user
		await ctx.db.patch(currentUser._id, { posts: currentUser.posts + 1 });

		return postId;
	},
});
