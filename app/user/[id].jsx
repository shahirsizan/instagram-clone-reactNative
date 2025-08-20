import Loader from "../../components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Pressable,
	FlatList,
	Dimensions,
	StyleSheet,
	Modal,
} from "react-native";

export default function UserProfileScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [selectedPost, setSelectedPost] = useState(false);

	// API TO FETCH HIS/HER PROFILE INFO
	const profile = useQuery(api.users.getUserProfile, {
		id: id,
	});
	// API TO FETCH WHETHER HE/SHE IS BEING FOLLOWED OR NOT
	const isFollowing = useQuery(api.users.isFollowing, {
		followingId: id,
	});
	// API TO FETCH HIS/HER ALL POSTS
	const posts = useQuery(api.posts.getPostsByUser, {
		userId: id,
	});
	// API TO GIVE FOLLOW/UNFOLLOW
	const toggleFollow = useMutation(api.users.toggleFollow);

	const handleBack = () => {
		if (router.canGoBack()) router.back();
		else router.replace("/(tabs)");
	};

	// IF SOMETHING IS UNDEFINED, SHOW <Loader/> SCREEN
	if (
		profile === undefined ||
		posts === undefined ||
		isFollowing === undefined
	) {
		return <Loader />;
	}

	return (
		<View style={styles.container}>
			{/* TOP BAR */}
			<View style={styles.header}>
				{/* BACK BUTTON */}
				<Pressable
					onPress={() => {
						handleBack();
					}}
				>
					<Ionicons
						name="arrow-back"
						size={24}
						color={COLORS.white}
					/>
				</Pressable>

				{/* USERNAME */}
				<Text style={styles.headerTitle}>{profile?.username}</Text>

				{/* SOME SPACE TO THE RIGHT */}
				<View style={{ width: 24 }} />
			</View>

			{/* SCROLL VIEW */}
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* PROFILE INFO */}
				<View style={styles.profileInfo}>
					{/* PRO-PIC & STATS*/}
					<View style={styles.avatarAndStats}>
						{/* PRO-PIC */}
						<View style={styles.avatarContainer}>
							<Image
								source={profile?.image}
								style={styles.avatar}
								contentFit="cover"
								cachePolicy="memory-disk"
							/>
						</View>

						{/* STATS */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{profile?.posts}
								</Text>
								<Text style={styles.statLabel}>Posts</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{profile?.followers}
								</Text>
								<Text style={styles.statLabel}>Followers</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{profile?.following}
								</Text>
								<Text style={styles.statLabel}>Following</Text>
							</View>
						</View>
					</View>

					{/* USERNAME */}
					<Text style={styles.name}>{profile?.fullname}</Text>

					{/* BIO */}
					{profile?.bio && (
						<Text style={styles.bio}>{profile.bio}</Text>
					)}

					{/* FOLLOW/UNFOLLOW BUTTON */}
					<Pressable
						style={[
							styles.followButton,
							isFollowing && styles.followingButton,
						]}
						onPress={() => {
							toggleFollow({ followingId: id });
						}}
					>
						<Text
							style={[
								styles.followButtonText,
								isFollowing && styles.followingButtonText,
							]}
						>
							{isFollowing ? "Following" : "Follow"}
						</Text>
					</Pressable>
				</View>

				{/* ALL POSTS */}
				{/* <View style={styles.postsGrid}> */}
				{posts.length === 0 ? (
					<View style={styles.noPostsContainer}>
						<Ionicons
							name="images-outline"
							size={48}
							color={COLORS.grey}
						/>
						<Text style={styles.noPostsText}>No posts yet</Text>
					</View>
				) : (
					<FlatList
						data={posts}
						numColumns={3}
						// because we have parent ScrollView
						scrollEnabled={false}
						keyExtractor={(item) => {
							return item._id;
						}}
						renderItem={({ item, index, separators }) => (
							<TouchableOpacity
								style={styles.gridItem}
								onPress={() => {
									setSelectedPost(item);
								}}
							>
								<Image
									source={item.imageUrl}
									style={styles.gridImage}
									contentFit="cover"
									cachePolicy="memory-disk"
								/>
							</TouchableOpacity>
						)}
					/>
				)}
				{/* </View> */}
			</ScrollView>

			{/* SELECTED IMAGE MODAL */}
			<Modal
				visible={selectedPost !== false}
				animationType="fade"
				transparent={true}
				onRequestClose={() => {
					setSelectedPost(false);
				}}
			>
				<View style={styles.modalBackdrop}>
					<View style={styles.postDetailContainer}>
						{/* CLOSE BUTTON */}
						<View style={styles.postDetailHeader}>
							<Pressable
								onPress={() => {
									setSelectedPost(false);
								}}
							>
								<Ionicons
									name="close"
									size={24}
									color={COLORS.white}
								/>
							</Pressable>
						</View>

						{/* IMAGE BODY */}
						<Image
							source={selectedPost?.imageUrl}
							cachePolicy={"memory-disk"}
							style={styles.postDetailImage}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const { width, height } = Dimensions.get("window");
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
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.surface,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	username: {
		fontSize: 20,
		fontWeight: "700",
		color: COLORS.white,
	},
	headerRight: {
		flexDirection: "row",
		gap: 16,
	},
	headerIcon: {
		padding: 4,
	},
	profileInfo: {
		padding: 16,
	},
	avatarAndStats: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarContainer: {
		marginRight: 32,
	},
	avatar: {
		width: 86,
		height: 86,
		borderRadius: 43,
		borderWidth: 2,
		borderColor: COLORS.surface,
	},
	statsContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 17,
		fontWeight: "700",
		color: COLORS.white,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 13,
		color: COLORS.grey,
	},

	name: {
		fontSize: 15,
		fontWeight: "600",
		color: COLORS.white,
		marginBottom: 4,
	},
	bio: {
		fontSize: 14,
		color: COLORS.white,
		lineHeight: 20,
	},
	actionButtons: {
		flexDirection: "row",
		gap: 8,
		marginTop: 8,
	},
	editButton: {
		flex: 1,
		backgroundColor: COLORS.surface,
		padding: 8,
		borderRadius: 8,
		alignItems: "center",
	},
	editButtonText: {
		color: COLORS.white,
		fontWeight: "600",
		fontSize: 14,
	},
	shareButton: {
		backgroundColor: COLORS.surface,
		padding: 8,
		borderRadius: 8,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	gridItem: {
		flex: 1 / 3,
		aspectRatio: 1,
		padding: 1,
	},
	gridImage: {
		flex: 1,
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: COLORS.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		// minHeight: 400,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		color: COLORS.white,
		fontSize: 18,
		fontWeight: "600",
	},
	inputContainer: {
		marginBottom: 20,
	},
	inputLabel: {
		color: COLORS.grey,
		marginBottom: 8,
		fontSize: 14,
	},
	input: {
		backgroundColor: COLORS.surface,
		borderRadius: 8,
		padding: 12,
		color: COLORS.white,
		fontSize: 16,
	},
	bioInput: {
		height: 100,
		textAlignVertical: "top",
	},
	saveButton: {
		backgroundColor: COLORS.primary,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	saveButtonText: {
		color: COLORS.background,
		fontSize: 16,
		fontWeight: "600",
	},
	modalBackdrop: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.9)",
	},
	postDetailContainer: {
		backgroundColor: COLORS.background,
		maxHeight: height * 0.9,
	},
	postDetailHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.surface,
	},
	postDetailImage: {
		width: width,
		height: width,
	},
	followButton: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 24,
		paddingVertical: 8,
		borderRadius: 8,
		marginTop: 16,
	},
	followingButton: {
		backgroundColor: COLORS.surface,
		borderWidth: 1,
		borderColor: COLORS.primary,
	},
	followButtonText: {
		color: COLORS.white,
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
	},
	followingButtonText: {
		color: COLORS.white,
		textAlign: "center",
	},
	noPostsContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 48,
		gap: 12,
		flex: 1,
	},
	noPostsText: {
		color: COLORS.grey,
		fontSize: 16,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	postsGrid: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.white,
	},
});
