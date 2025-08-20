import { COLORS } from "@/constants/theme";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	FlatList,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

const profile = () => {
	// FROM CLERK
	const { signOut, userId } = useAuth();

	// API TO GET CURRENT USERS DATA
	const currentUser = useQuery(api.users.getUserByClerkId, {
		clerkId: userId,
	});

	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedPost, setSelectedPost] = useState(false);

	// state to hold updated profile data
	const [editedProfile, setEditedProfile] = useState({
		fullname: currentUser?.fullname || "",
		bio: currentUser?.bio || "",
	});

	// API TO GET CURRENT USERS ALL POSTS
	const posts = useQuery(api.posts.getPostsByUser, {});
	// API TO UPDATE PROFILE
	const updateProfile = useMutation(api.users.updateProfile);

	const handleSaveProfile = async () => {
		await updateProfile(editedProfile);
		setIsEditModalVisible(false);
	};

	if ((currentUser === posts) === undefined) {
		return <Loader />;
	}

	return (
		<View style={styles.container}>
			{/* TOP BAR */}
			<View style={styles.header}>
				{/* USERNAME */}
				<View style={styles.headerLeft}>
					<Text style={styles.username}>{currentUser?.username}</Text>
				</View>

				{/* SIGNOUT BUTTON */}
				<TouchableOpacity
					style={styles.headerIcon}
					onPress={() => {
						signOut();
					}}
				>
					<Ionicons
						name="log-out-outline"
						size={24}
						color={COLORS.white}
					/>
				</TouchableOpacity>
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
								source={currentUser?.image}
								style={styles.avatar}
								contentFit="cover"
							/>
						</View>

						{/* STATS */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{currentUser?.posts}
								</Text>
								<Text style={styles.statLabel}>Posts</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{currentUser?.followers}
								</Text>
								<Text style={styles.statLabel}>Followers</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>
									{currentUser?.following}
								</Text>
								<Text style={styles.statLabel}>Following</Text>
							</View>
						</View>
					</View>

					{/* USERNAME */}
					<Text style={styles.name}>{currentUser?.fullname}</Text>

					{/* BIO */}
					{currentUser?.bio && (
						<Text style={styles.bio}>{currentUser.bio}</Text>
					)}

					{/* EDIT-PROFILE BUTTON */}
					<TouchableOpacity
						style={[styles.editButton, { marginTop: 8 }]}
						onPress={() => setIsEditModalVisible(true)}
					>
						<Text style={styles.editButtonText}>Edit Profile</Text>
					</TouchableOpacity>
				</View>

				{/* ALL POSTS */}
				{posts?.length === 0 ? (
					<NoPostsFound />
				) : (
					<FlatList
						data={posts}
						numColumns={3}
						scrollEnabled={false}
						// because we have parent ScrollView
						renderItem={({ item, index, separators }) => (
							<TouchableOpacity
								style={styles.gridItem}
								onPress={() => setSelectedPost(item)}
							>
								<Image
									source={item.imageUrl}
									style={styles.gridImage}
									contentFit="cover"
								/>
							</TouchableOpacity>
						)}
					/>
				)}
			</ScrollView>

			{/* EDIT-PROFILE MODAL */}
			<Modal
				visible={isEditModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => {
					setIsEditModalVisible(false);
				}}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.modalContainer}
					>
						<View style={styles.modalContent}>
							{/* MODAL TOP-BAR */}
							<View style={styles.modalHeader}>
								{/* MODAL TITLE */}
								<Text style={styles.modalTitle}>
									Edit Profile
								</Text>

								{/* CLOSE ICON */}
								<Pressable
									onPress={() => setIsEditModalVisible(false)}
								>
									<Ionicons
										name="close"
										size={24}
										color={COLORS.white}
									/>
								</Pressable>
							</View>

							{/* NAME INPUT */}
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Name</Text>
								<TextInput
									style={styles.input}
									placeholderTextColor={COLORS.grey}
									value={editedProfile.fullname}
									onChangeText={(text) => {
										setEditedProfile((prev) => {
											return {
												...prev,
												fullname: text,
											};
										});
									}}
								/>
							</View>

							{/* BIO INPUT */}
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Bio</Text>
								<TextInput
									style={[styles.input, styles.bioInput]}
									value={editedProfile.bio}
									onChangeText={(text) =>
										setEditedProfile((prev) => {
											return {
												...prev,
												bio: text,
											};
										})
									}
									multiline
									numberOfLines={4}
									placeholderTextColor={COLORS.grey}
								/>
							</View>

							{/* SAVE BUTTON */}
							<Pressable
								onPress={() => {
									handleSaveProfile();
								}}
								style={styles.saveButton}
							>
								<Text style={styles.saveButtonText}>
									Save Changes
								</Text>
							</Pressable>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</Modal>

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
};

// NoPostsFound screen
const NoPostsFound = () => {
	return (
		<View
			style={{
				height: "100%",
				backgroundColor: COLORS.background,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Ionicons name="images-outline" size={48} color={COLORS.primary} />
			<Text style={{ fontSize: 20, color: COLORS.white }}>
				No posts yet
			</Text>
		</View>
	);
};

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

export default profile;
