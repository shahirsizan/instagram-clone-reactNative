import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Notification({ notification }) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: 20,
			}}
		>
			{/* left side */}
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					marginRight: 12,
				}}
			>
				{/* Sender pro-pic and notification-type-logo */}
				<Link href={`/user/${notification.sender._id}`} asChild>
					<TouchableOpacity
						style={{
							position: "relative",
							marginRight: 12,
						}}
					>
						{/* sender pro-pic */}
						<Image
							source={notification.sender.image}
							style={{
								width: 44,
								height: 44,
								borderRadius: 22,
								borderWidth: 2,
								borderColor: COLORS.surface,
							}}
							contentFit="cover"
							transition={200}
						/>

						{/* notification-type-logo */}
						<View
							style={{
								position: "absolute",
								bottom: -4,
								right: -4,
								backgroundColor: COLORS.background,
								width: 24,
								height: 24,
								borderRadius: 12,
								alignItems: "center",
								justifyContent: "center",
								borderWidth: 2,
								borderColor: COLORS.surface,
							}}
						>
							{notification.type === "like" ? (
								<Ionicons
									name="heart"
									size={14}
									color={COLORS.primary}
								/>
							) : notification.type === "follow" ? (
								<Ionicons
									name="person-add"
									size={14}
									color="#8B5CF6"
								/>
							) : (
								<Ionicons
									name="chatbubble"
									size={14}
									color="#3B82F6"
								/>
							)}
						</View>
					</TouchableOpacity>
				</Link>

				{/* sender-name & notification-body */}
				<View
					style={{
						flex: 1,
					}}
				>
					{/* sender name */}
					<Link href={`/user/${notification.sender._id}`} asChild>
						<TouchableOpacity>
							<Text
								style={{
									color: COLORS.white,
									fontSize: 14,
									fontWeight: "600",
									marginBottom: 2,
								}}
							>
								{notification.sender.username}
							</Text>
						</TouchableOpacity>
					</Link>

					{/* notification message */}
					<Text
						style={{
							color: COLORS.grey,
							fontSize: 14,
							marginBottom: 2,
						}}
					>
						{notification.type === "follow"
							? "started following you"
							: notification.type === "like"
								? "liked your post"
								: `commented: "${notification.comment}"`}
					</Text>

					{/* time ago */}
					<Text
						style={{
							color: COLORS.grey,
							fontSize: 12,
						}}
					>
						{formatDistanceToNow(notification._creationTime, {
							addSuffix: true,
						})}
					</Text>
				</View>
			</View>

			{/* right side post image */}
			{notification.post && (
				<Image
					source={notification.post.imageUrl}
					style={{
						width: 44,
						height: 44,
						borderRadius: 6,
					}}
					contentFit="cover"
				/>
			)}
		</View>
	);
}
