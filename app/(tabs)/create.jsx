/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { COLORS } from "../../constants/theme";
// import { styles } from "../../styles/create.styles";
// expo-image for performance optimization
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { api } from "../../convex/_generated/api";

const { width } = Dimensions.get("window");

const createScreen = () => {
	const router = useRouter();
	const { user } = useUser();

	const [caption, setCaption] = useState("");
	const [selectedImage, setSelectedImage] = useState(false);
	const [isSharing, setIsSharing] = useState(false);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
		}
	};

	// first create an `uploadURL`, then upload image from within `handleShare()`
	const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
	// only after uploading image, call `createPost` API.
	const createPost = useMutation(api.posts.createPost);

	const handleShare = async () => {
		if (!selectedImage) {
			return;
		}

		setIsSharing(true);

		try {
			const uploadUrl = await generateUploadUrl();
			const response = await FileSystem.uploadAsync(
				uploadUrl,
				selectedImage,
				{
					httpMethod: "POST",
					uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
				}
			);

			if (response.status !== 200) {
				throw new Error("Upload failed!");
			}

			const { storageId } = JSON.parse(response.body);

			await createPost({ caption: caption, storageId: storageId });

			// router.push("/(tabs)");
			router.navigate("/(tabs)");
		} catch (error) {
			console.log("Error sharing post: ", error);
		} finally {
			setIsSharing(false);
			setSelectedImage(null);
			setCaption("");
		}
	};

	// console.log(selectedImage);
	// file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%
	// 252Finsta-clone-app-293f34e2-b390-4c27-8acb-03aa635ae69a/ImagePicker/
	// db591c3d-6681-44f8-9b20-48365595f1c8.jpeg

	// if no image selected
	if (!selectedImage) {
		return (
			<View style={[styles.container]}>
				{/* back navigation topbar */}
				<View style={styles.header}>
					<TouchableOpacity>
						<Ionicons
							name="arrow-back"
							size={20}
							color={COLORS.primary}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>New Post</Text>
					<View style={{ width: 28 }}></View>
				</View>

				{/* select image middle section */}
				<TouchableOpacity
					style={styles.emptyImageContainer}
					onPress={() => {
						pickImage();
					}}
				>
					<Ionicons
						name="image-outline"
						size={48}
						color={COLORS.grey}
					/>
					<Text style={styles.emptyImageText}>
						Tap to select an image
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// if image selected
	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior="padding"
			keyboardVerticalOffset={50}
		>
			<View style={styles.contentContainer}>
				{/* header topbar */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => {
							setSelectedImage(null);
							setCaption("");
						}}
						disabled={isSharing}
					>
						<Ionicons
							name="close-outline"
							size={28}
							color={isSharing ? COLORS.grey : COLORS.white}
						/>
					</TouchableOpacity>

					<Text style={styles.headerTitle}>New Post</Text>

					<TouchableOpacity
						style={[
							styles.shareButton,
							isSharing && styles.shareButtonDisabled,
						]}
						disabled={isSharing || !selectedImage}
						onPress={() => {
							handleShare();
						}}
					>
						{isSharing ? (
							<ActivityIndicator
								size="small"
								color={COLORS.primary}
							/>
						) : (
							<Text style={styles.shareText}>Share</Text>
						)}
					</TouchableOpacity>
				</View>

				{/* selected image and caption section */}
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					bounces={false}
					keyboardShouldPersistTaps="handled"
					contentOffset={{ x: 0, y: 100 }}
				>
					<View
						style={[
							styles.content,
							isSharing && styles.contentDisabled,
						]}
					>
						{/* image section */}
						<View style={styles.imageSection}>
							<Image
								source={selectedImage}
								style={styles.previewImage}
								contentFit="cover"
								transition={200}
							/>

							<TouchableOpacity
								style={[
									styles.changeImageButton,
									{
										position: "absolute",
										bottom: 10,
										right: 10,
									},
								]}
								onPress={pickImage}
								disabled={isSharing}
							>
								<Ionicons
									name="image-outline"
									size={20}
									color={COLORS.white}
								/>
								<Text style={styles.changeImageText}>
									Change
								</Text>
							</TouchableOpacity>
						</View>

						{/* input section */}
						<View style={styles.inputSection}>
							<View style={styles.captionContainer}>
								<Image
									source={user?.imageUrl}
									style={styles.userAvatar}
									contentFit="cover"
									transition={200}
								/>
								<TextInput
									style={styles.captionInput}
									placeholder="Write a caption..."
									placeholderTextColor={COLORS.grey}
									multiline
									value={caption}
									onChangeText={setCaption}
									editable={!isSharing}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	contentContainer: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.surface,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.white,
	},
	contentDisabled: {
		opacity: 0.7,
	},
	shareButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		minWidth: 60,
		alignItems: "center",
		justifyContent: "center",
	},
	shareButtonDisabled: {
		opacity: 0.5,
	},
	shareText: {
		color: COLORS.primary,
		fontSize: 16,
		fontWeight: "600",
	},
	shareTextDisabled: {
		color: COLORS.grey,
	},
	emptyImageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
	},
	emptyImageText: {
		color: COLORS.grey,
		fontSize: 16,
	},
	content: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	imageSection: {
		position: "relative",
		width: width,
		height: width,
		backgroundColor: COLORS.surface,
		justifyContent: "center",
		alignItems: "center",
	},
	previewImage: {
		width: "100%",
		height: "100%",
	},
	changeImageButton: {
		backgroundColor: "rgba(0, 0, 0, 0.75)",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		borderRadius: 8,
		gap: 6,
	},
	changeImageText: {
		color: COLORS.white,
		fontSize: 14,
		fontWeight: "500",
	},
	inputSection: {
		padding: 16,
		flex: 1,
	},
	captionContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	userAvatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginRight: 12,
	},
	captionInput: {
		flex: 1,
		color: COLORS.white,
		fontSize: 16,
		paddingTop: 8,
		minHeight: 40,
	},
});

export default createScreen;
