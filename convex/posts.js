import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

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
		const currentUser = await getAuthenticatedUser(ctx);

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

export const getFeedPosts = query({
	args: {},
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		// get all posts
		const posts = await ctx.db.query("posts").order("desc").collect();

		if (posts.length === 0) {
			return [];
		}

		// incorporate userdata and interaction status to the posts
		const postsWithInfo = await Promise.all(
			posts.map(async (post) => {
				// fetch author info
				const postAuthor = await ctx.db.get(post.userId);

				// fetch if liked by me
				const isLiked = await ctx.db
					.query("likes")
					.withIndex("by_user_and_post", (q) => {
						return q
							.eq("postId", post._id)
							.eq("userId", currentUser._id);
					})
					.first();

				// fetch if bookmarked
				const isBookmarked = await ctx.db
					.query("bookmarks")
					.withIndex("by_user_and_post", (q) => {
						return q
							.eq("postId", post._id)
							.eq("userId", currentUser._id);
					})
					.first();

				return {
					...post,
					author: {
						_id: postAuthor._id,
						username: postAuthor.username,
						image: postAuthor.image,
					},
					// The `!!` is a quick way to cast a value to a boolean.
					// If isLiked/isBookmarked is an object, a string, or any "truthy" value,
					// !!isLiked or !!isBookmarked will be `true`. Else false.
					isLiked: !!isLiked,
					isBookmarked: !!isBookmarked,
				};
			})
		);

		return postsWithInfo;
	},
});
