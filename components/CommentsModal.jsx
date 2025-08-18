import { COLORS } from "@/constants/theme";
import {
	View,
	Text,
	KeyboardAvoidingView,
	StyleSheet,
	Dimensions,
	Platform,
	TouchableOpacity,
	FlatList,
	TextInput,
} from "react-native";
import React, { useState } from "react";
import { Modal } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import Loader from "./Loader";
import Comment from "./Comment";

const CommentsModal = ({ postId, showComments, setShowComments }) => {
	const [newComment, setNewComment] = useState("");
	const comments = useQuery(api.comments.getComments, { postId });
	const addComment = useMutation(api.comments.addComment);

	const handleAddComment = async () => {
		if (!newComment.trim()) {
			return;
		}

		try {
			await addComment({ content: newComment, postId });
			setNewComment("");
		} catch (error) {
			console.log("Error adding comment:", error);
		}
	};

	if (comments === undefined) {
		return <Loader />;
	}

	return (
		<Modal
			visible={showComments}
			animationType="slide"
			// transparent={true}
			onRequestClose={() => {
				setShowComments(false);
			}}
		>
			{/* <KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalContainer}
			> */}
			{/* KeyboardAvoidingView use korle keyboard close korar por screen e flickering hoy */}

			{/* TOP BAR */}
			<View style={styles.modalHeader}>
				{/* BACK BUTTON */}
				<TouchableOpacity
					onPress={() => {
						setShowComments(false);
					}}
				>
					<Ionicons name="close" size={24} color={COLORS.white} />
				</TouchableOpacity>

				{/* TAB TILE */}
				<Text style={styles.modalTitle}>Comments</Text>

				{/* JUST SOME SPACE IN RIGHT SIDE */}
				<View style={{ width: 24 }}></View>
			</View>

			{/* COMMENTS FLATLIST */}
			<FlatList
				data={comments}
				keyExtractor={(item, index) => {
					return item._id;
				}}
				renderItem={({ item, index, separators }) => {
					return <Comment comment={item} />;
				}}
				style={{ backgroundColor: COLORS.background, flex: 1 }}
				keyboardDismissMode="on-drag"
			/>

			{/* COMMENT INPUT */}
			<View style={styles.commentInput}>
				{/* LEFT INPUT */}
				<TextInput
					style={styles.input}
					placeholder="Add a comment..."
					placeholderTextColor={COLORS.grey}
					value={newComment}
					// onChange={(e) => {
					// 	setNewComment(e.nativeEvent.text);
					// }}
					// better use the below format
					onChangeText={(text) => {
						setNewComment(text);
					}}
					multiline
				/>

				{/* RIGHT SUBMIT BUTTON */}
				<TouchableOpacity
					onPress={() => {
						handleAddComment();
					}}
					disabled={!newComment.trim()}
				>
					<Text
						style={[
							styles.postButton,
							!newComment.trim() && styles.postButtonDisabled,
						]}
					>
						Post
					</Text>
				</TouchableOpacity>
			</View>

			{/* </KeyboardAvoidingView> */}
		</Modal>
	);
};

const { width } = Dimensions.get("window");
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
		flex: 1,
		marginBottom: Platform.OS === "ios" ? 44 : 0,
		paddingBottom: 20,
		marginTop: Platform.OS === "ios" ? 44 : 0,
	},
	modalHeader: {
		backgroundColor: COLORS.surface,
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

export default CommentsModal;
