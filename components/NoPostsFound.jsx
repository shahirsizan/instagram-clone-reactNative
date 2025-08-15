import { View, Text } from "react-native";
import React from "react";

const NoPostsFound = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: 20, color: COLORS.primary }}>
				No posts yet
			</Text>
		</View>
	);
};

export default NoPostsFound;
