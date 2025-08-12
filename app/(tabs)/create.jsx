/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const createScreen = () => {
	const router = useRouter();
	const { user } = useUser();
	const [caption, setCaption] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [isSharing, setIsSharing] = useState(false);

	return (
		<View>
			<Text>create posttt</Text>
		</View>
	);
};

export default createScreen;
