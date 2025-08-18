import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ comment }) => {
	// each comment represents:
	// comment : {
	//     user: {
	//         fullname: string;
	//         image: string;
	//     };
	//     _id: Id<"comments">;
	//     _creationTime: number;
	//     userId: Id<"users">;
	//     postId: Id<"posts">;
	//     content: string;
	// }[]

	return (
		<View
			style={{
				flexDirection: "row",
				paddingHorizontal: 16,
				paddingVertical: 12,
				borderBottomWidth: 0.5,
				borderBottomColor: COLORS.surface,
			}}
		>
			{/* LEFT PROFILE PIC */}
			<Image
				source={{ uri: comment.user.image }}
				style={{
					width: 32,
					height: 32,
					borderRadius: 16,
					marginRight: 12,
				}}
			/>

			{/* RIGHT PROFILE-NAME, COMMENT-BODY & TIME */}
			<View
				style={{
					flex: 1,
				}}
			>
				<Text
					style={{
						color: COLORS.white,
						fontWeight: "500",
						marginBottom: 4,
					}}
				>
					{comment.user.fullname}
				</Text>

				<Text
					style={{
						color: COLORS.white,
						fontSize: 14,
						lineHeight: 20,
					}}
				>
					{comment.content}
				</Text>

				<Text
					style={{
						color: COLORS.grey,
						fontSize: 12,
						marginTop: 4,
					}}
				>
					{formatDistanceToNow(comment._creationTime, {
						addSuffix: true,
					})}
				</Text>
			</View>
		</View>
	);
};

export default Comment;
