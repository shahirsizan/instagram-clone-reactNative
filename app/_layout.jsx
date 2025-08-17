import { tokenCache } from "@/cache.js";
import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useCallback } from "react";

// Dev mode e kaj kore na. Production mode e kaj korbe
// Prefer not to use the feature right now
// loads splash screen before the actual app
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
	});

	// if font loaded, means app loaded, close splash screen
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
		unsavedChangesWarning: false,
	});

	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
	if (!publishableKey) {
		throw new Error("Missing publishable key");
	}

	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<StatusBar style="light" />
				<SafeAreaProvider onLayout={onLayoutRootView}>
					<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
						<InitialLayout />
					</SafeAreaView>
				</SafeAreaProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
