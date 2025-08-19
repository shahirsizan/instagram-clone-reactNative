import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
	args: {},
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		const notifications = await ctx.db
			.query("notifications")
			.withIndex("by_receiver", (q) =>
				q.eq("receiverId", currentUser._id)
			)
			.order("desc")
			.collect();
		// notifications schema: {
		//     senderId: v.id("users"),
		//     receiverId: v.id("users"),
		//     type: v.union(
		//         v.literal("like"),
		//         v.literal("comment"),
		//         v.literal("follow")
		//     ),
		//     postId: v.optional(v.id("posts")),
		//     commentId: v.optional(v.id("comments")),
		//     // Above two attributes are `optional` because a `follow` notification won't have any Id
		//     // Only a `like` or a `comment` will have a `postId`
		// }

		// comments schema: {
		//     userId: v.id("users"),
		//     postId: v.id("posts"),
		//     content: v.string(),
		// }

		const notificationsWithInfo = await Promise.all(
			// we have to include:
			// 1. notification contents
			// 1. Comment contents (in case of a comment notification)
			// 1. Sender info (in case of a follow notification)
			// 2. Post info (in case of a comment notification)
			notifications.map(async (notification) => {
				const sender = await ctx.db.get(notification.senderId);
				let post = null;
				let comment = null;

				if (notification.postId) {
					post = await ctx.db.get(notification.postId);
				}

				if (notification.type === "comment" && notification.commentId) {
					comment = await ctx.db.get(notification.commentId);
				}

				return {
					...notification,
					sender: {
						_id: sender._id,
						username: sender.username,
						image: sender.image,
					},
					post: post,
					// just `post` er jonno ?(null coalescing) use kora lagbe na
					// but dot(.) diye nested object retrieval er somoy ? lagbe.
					comment: comment?.content,
				};
			})
		);

		return notificationsWithInfo;
	},
});
