import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// const [fontsLoaded] = useFonts({
	// 	"JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
	// });

	// const onLayoutRootView = useCallback(async () => {
	// 	if (fontsLoaded) await SplashScreen.hideAsync();
	// }, [fontsLoaded]);

	// update the native navigation bar on Android.
	// useEffect(() => {
	// 	if (Platform.OS === "android") {
	// 		NavigationBar.setBackgroundColorAsync("#000000");
	// 		NavigationBar.setButtonStyleAsync("light");
	// 	}
	// }, []);

	return (
		<>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
					<Stack screenOptions={{ headerShown: false }} />
				</SafeAreaView>
			</SafeAreaProvider>
		</>
	);
}
