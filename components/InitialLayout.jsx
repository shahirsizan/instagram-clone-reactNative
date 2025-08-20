import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
	const { isLoaded, isSignedIn } = useAuth();

	const segments = useSegments();

	const router = useRouter();

	useEffect(() => {
		if (!isLoaded) {
			return;
		}

		const currentlyinAuthScreen = segments[0] === "(auth)";

		if (!isSignedIn && !currentlyinAuthScreen) {
			router.replace("/(auth)/login");
		} else if (isSignedIn && currentlyinAuthScreen) {
			router.replace("/(tabs)");
		}
	}, [isLoaded, isSignedIn, segments]);

	return <Stack screenOptions={{ headerShown: false }} />;
}
