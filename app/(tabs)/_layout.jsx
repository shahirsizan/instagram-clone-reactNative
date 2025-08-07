// import { COLORS } from "@/constants/theme";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.grey,
				tabBarStyle: {
					backgroundColor: "black",
					position: "absolute",
					elevation: 0,
					height: 40,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ size, color }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="bookmarks"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="bookmark" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					tabBarIcon: ({ size, color }) => (
						<Ionicons
							name="add-circle"
							size={size}
							color={COLORS.primary}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="heart" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="person-circle"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
