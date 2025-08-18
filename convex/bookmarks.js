import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const toggleBookmark = mutation({
	args: { postId: v.id("posts") },
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		const isAlreadyBookmarked = await ctx.db
			.query("bookmarks")
			.withIndex("by_user_and_post", (q) => {
				return q
					.eq("userId", currentUser._id)
					.eq("postId", args.postId);
			})
			.first();

		if (isAlreadyBookmarked) {
			// remove bookmark
			await ctx.db.delete(isAlreadyBookmarked._id);
			return "bookmark removed";
		} else {
			// add bookmark
			await ctx.db.insert("bookmarks", {
				userId: currentUser._id,
				postId: args.postId,
			});
			return "bookmarked";
		}
	},
});

export const getBookmarkedPosts = query({
	handler: async (ctx) => {
		const currentUser = await getAuthenticatedUser(ctx);

		// get all bookmarked posts of the current user
		const allBookmarks = await ctx.db
			.query("bookmarks")
			.withIndex("by_user", (q) => q.eq("userId", currentUser._id))
			.order("desc")
			.collect();

		const allBookmarkedPosts = await Promise.all(
			allBookmarks.map(async (bookmark) => {
				const post = await ctx.db.get(bookmark.postId);
				return post;
			})
		);
		return allBookmarkedPosts;
	},
});
