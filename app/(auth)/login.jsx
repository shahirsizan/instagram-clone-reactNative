/* eslint-disable react-hooks/rules-of-hooks */
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function login() {
	const { startSSOFlow } = useSSO();
	const router = useRouter();

	const handleGoogleSignIn = async () => {
		try {
			const { createdSessionId, setActive } = await startSSOFlow({
				strategy: "oauth_google",
			});

			if (createdSessionId) {
				await setActive({
					session: createdSessionId,
				});

				// router.replace("/(tabs)");
				// lagbe na.
			}
		} catch (error) {
			console.error("OAuth error: ", error);
		}
	};

	return (
		<View style={styles.container}>
			{/* BRAND SECTION */}
			<View style={styles.brandSection}>
				<View style={styles.logoContainer}>
					<Ionicons name="leaf" size={70} color={COLORS.primary} />
				</View>
				<Text style={styles.appName}>instaclone</Text>
				<Text style={styles.tagline}>Dont miss anything!</Text>
			</View>

			{/* ILLUSTRATION */}
			<View style={styles.illustrationContainer}>
				<Image
					source={require("../../assets/images/auth-bg-3.png")}
					style={styles.illustration}
					resizeMode="cover"
				/>
			</View>

			{/* LOGIN SECTION */}
			<View style={styles.loginSection}>
				<TouchableOpacity
					style={styles.googleButton}
					onPress={() => {
						handleGoogleSignIn();
					}}
					activeOpacity={0.9}
				>
					<View style={styles.googleIconContainer}>
						<Ionicons
							name="logo-google"
							size={20}
							color={COLORS.surface}
						/>
					</View>
					<Text style={styles.googleButtonText}>
						Continue with Google
					</Text>
				</TouchableOpacity>

				<Text style={styles.termsText}>
					By continuing, you agree to our Terms & Policies
				</Text>
			</View>
		</View>
	);
}
