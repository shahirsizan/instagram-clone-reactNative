import { COLORS } from "../constants/theme";
// import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/convex/_generated/api";
import Loader from "./Loader";

const { width } = Dimensions.get("window");

export default Post = ({ post }) => {
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
	const [showComments, setShowComments] = useState(false);

	// current logged-in-user info is coming from clerk.
	// We have to fetch the users info from convex `users` db
	const { user } = useUser();
	const currentUser = useQuery(api.users.getUserByClerkId, {
		clerkId: user.id,
	});

	const toggleLike = useMutation(api.posts.toggleLike);
	// const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
	// const deletePost = useMutation(api.posts.deletePost);

	const handleLike = async () => {
		try {
			const likeStatus = await toggleLike({ postId: post._id });
			// "liked" or "unliked" will be returned

			if (likeStatus === "unliked") {
				setIsLiked(false);
			} else if (likeStatus === "liked") {
				setIsLiked(true);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		}
	};

	const handleBookmark = async () => {
		console.log("Bookmark pressed");

		// const newIsBookmarked = await toggleBookmark({ postId: post._id });
		// setIsBookmarked(newIsBookmarked);
	};

	const handleDelete = async () => {
		try {
			// await deletePost({ postId: post._id });
			console.log("Delete pressed");
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	if (!user) {
		return <Loader />;
	}

	return (
		<View style={styles.post}>
			{/* POST HEADER */}
			<View style={styles.postHeader}>
				{/* POST OWNER CIRCULAR PROFILE-PIC */}
				<Link
					href={
						post.author._id === currentUser?._id
							? "/(tabs)/profile"
							: `user/${post.author._id}`
					}
				>
					<TouchableOpacity style={styles.postHeaderLeft}>
						<Image
							source={post.author.image}
							style={styles.postAvatar}
							contentFit="cover"
							cachePolicy="memory-disk"
						/>
						<Text style={styles.postUsername}>
							{post.author.username}
						</Text>
					</TouchableOpacity>
				</Link>

				{/* OPTION DOTS */}
				{/* if my post, render `trashBin`, else `three-dots` */}
				{post.author._id === currentUser?._id ? (
					<TouchableOpacity
						onPress={() => {
							handleDelete();
						}}
					>
						<Ionicons
							name="trash-outline"
							size={20}
							color={COLORS.primary}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity>
						<Ionicons
							name="ellipsis-horizontal"
							size={20}
							color={COLORS.white}
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* POST IMAGE */}
			<Image
				source={post.imageUrl}
				style={styles.postImage}
				contentFit="cover"
				cachePolicy={"memory-disk"}
			/>

			{/* GIVE LIKE-COMMENT-BOOKMARK */}
			<View style={styles.postActions}>
				<View style={styles.postActionsLeft}>
					{/* GIVE LIKE */}
					<TouchableOpacity
						onPress={() => {
							handleLike();
						}}
					>
						<Ionicons
							name={isLiked ? "heart" : "heart-outline"}
							size={24}
							color={isLiked ? COLORS.primary : COLORS.white}
						/>
					</TouchableOpacity>

					{/* OPEN COMMENT MODAL */}
					<TouchableOpacity
						onPress={() => {
							setShowComments(true);
						}}
					>
						<Ionicons
							name="chatbubble-outline"
							size={22}
							color={COLORS.white}
						/>
					</TouchableOpacity>
				</View>

				{/* GIVE BOOKMARK */}
				<TouchableOpacity
					onPress={() => {
						handleBookmark();
					}}
				>
					<Ionicons
						name={isBookmarked ? "bookmark" : "bookmark-outline"}
						size={22}
						color={COLORS.white}
					/>
				</TouchableOpacity>
			</View>

			{/* SEE POST INFO */}
			<View style={styles.postInfo}>
				{/* SEE NUMBER OF LIKES */}
				<Text style={styles.likesText}>
					{post.likes > 0
						? `${post.likes.toLocaleString()} likes`
						: "Be the first to like"}
				</Text>

				{/* SEE OWNER-NAME & POST-CAPTION */}
				<View style={styles.captionContainer}>
					<Text style={styles.captionUsername}>
						{post.author.username}
					</Text>

					{post.caption && (
						<Text style={styles.captionText}>{post.caption}</Text>
					)}
				</View>

				{/* SEE NUMBER OF COMMENTS */}
				{post.comments > 0 && (
					<TouchableOpacity onPress={() => setShowComments(true)}>
						<Text style={styles.commentsText}>
							View all {post.comments} comments
						</Text>
					</TouchableOpacity>
				)}

				{/* SEE TIME AGO (eta upore circular profile pic er pashe dewa gele valo hoto) */}
				<Text style={styles.timeAgo}>
					{formatDistanceToNow(post._creationTime, {
						includeSeconds: true,
						addSuffix: true,
					})}
				</Text>
			</View>

			{/* COMMENT MODAL */}
			<CommentsModal
				postId={post._id}
				showComments={showComments}
				setShowComments={setShowComments}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.surface,
	},
	headerTitle: {
		fontSize: 24,
		fontFamily: "JetBrainsMono-Medium",
		color: COLORS.primary,
	},
	storiesContainer: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.surface,
	},
	storyWrapper: {
		alignItems: "center",
		marginHorizontal: 8,
		width: 72,
	},
	storyRing: {
		width: 68,
		height: 68,
		borderRadius: 34,
		padding: 2,
		backgroundColor: COLORS.background,
		borderWidth: 2,
		borderColor: COLORS.primary,
		marginBottom: 4,
	},
	noStory: {
		borderColor: COLORS.grey,
	},
	storyAvatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: COLORS.background,
	},
	storyUsername: {
		fontSize: 11,
		color: COLORS.white,
		textAlign: "center",
	},
	post: {
		marginBottom: 16,
	},
	postHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 12,
	},
	postHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	postAvatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 8,
	},
	postUsername: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.white,
	},
	postImage: {
		width: width,
		height: width,
	},
	postActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
	postActionsLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	postInfo: {
		paddingHorizontal: 12,
	},
	likesText: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.white,
		marginBottom: 6,
	},
	captionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 6,
	},
	captionUsername: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.white,
		marginRight: 6,
	},
	captionText: {
		fontSize: 14,
		color: COLORS.white,
		flex: 1,
	},
	commentsText: {
		fontSize: 14,
		color: COLORS.grey,
		marginBottom: 4,
	},
	timeAgo: {
		fontSize: 12,
		color: COLORS.grey,
		marginBottom: 8,
	},
	modalContainer: {
		backgroundColor: COLORS.background,
		// marginBottom: Platform.OS === "ios" ? 44 : 0,
		marginBottom: 0,
		flex: 1,
		// marginTop: Platform.OS === "ios" ? 44 : 0,
		marginTop: 0,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		height: 56,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.surface,
	},
	modalTitle: {
		color: COLORS.white,
		fontSize: 16,
		fontWeight: "600",
	},
	commentsList: {
		flex: 1,
	},
	commentContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.surface,
	},
	commentAvatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 12,
	},
	commentContent: {
		flex: 1,
	},
	commentUsername: {
		color: COLORS.white,
		fontWeight: "500",
		marginBottom: 4,
	},
	commentText: {
		color: COLORS.white,
		fontSize: 14,
		lineHeight: 20,
	},
	commentTime: {
		color: COLORS.grey,
		fontSize: 12,
		marginTop: 4,
	},
	commentInput: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderTopWidth: 0.5,
		borderTopColor: COLORS.surface,
		backgroundColor: COLORS.background,
	},
	input: {
		flex: 1,
		color: COLORS.white,
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginRight: 12,
		backgroundColor: COLORS.surface,
		borderRadius: 20,
		fontSize: 14,
	},
	postButton: {
		color: COLORS.primary,
		fontWeight: "600",
		fontSize: 14,
	},
	postButtonDisabled: {
		opacity: 0.5,
	},
	centered: {
		justifyContent: "center",
		alignItems: "center",
	},
});
