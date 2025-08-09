import { tokenCache } from "@/cache.js";
import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
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
				<SafeAreaProvider>
					<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
						<InitialLayout />
					</SafeAreaView>
				</SafeAreaProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
