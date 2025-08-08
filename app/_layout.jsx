import { tokenCache } from "@/cache.js";
import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	// update the native navigation bar on Android.
	// useEffect(() => {
	// 	if (Platform.OS === "android") {
	// 		NavigationBar.setBackgroundColorAsync("#000000");
	// 		NavigationBar.setButtonStyleAsync("light");
	// 	}
	// }, []);
	console.log("rootLayout theke bolchi");

	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
	if (!publishableKey) {
		throw new Error("Missing publishable key");
	}

	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
					<InitialLayout />
				</SafeAreaView>
			</SafeAreaProvider>
		</ClerkProvider>
	);
}
