/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/create.styles";

const createScreen = () => {
	const router = useRouter();
	const { user } = useUser();

	const [caption, setCaption] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
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
		<View>
			<Text>create posttt</Text>
		</View>
	);
};

export default createScreen;
