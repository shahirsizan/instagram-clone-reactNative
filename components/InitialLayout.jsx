import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
	const { isLoaded, isSignedIn } = useAuth();

	const segments = useSegments();
	// nicher log gula initial render eo log hoy.
	// abar porer render eo log hoy. Keno seta bujhlam na.
	// but overall login/signup process bujhchi.
	// console.log("segments from initialLayout: ", segments);

	const router = useRouter();

	useEffect(() => {
		if (!isLoaded) {
			return;
		}
		// console.log("initialLayout theke bolchi");

		const currentlyinAuthScreen = segments[0] === "(auth)";

		if (!isSignedIn && !currentlyinAuthScreen) {
			router.replace("/(auth)/login");
		} else if (isSignedIn && currentlyinAuthScreen) {
			router.replace("/(tabs)");
		}
	}, [isLoaded, isSignedIn, segments]);

	return <Stack screenOptions={{ headerShown: false }} />;
}
