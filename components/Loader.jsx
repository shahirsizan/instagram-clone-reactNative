import { View, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/theme";

const Loader = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: COLORS.background,
			}}
		>
			<ActivityIndicator
				animating={true}
				color={COLORS.primary}
				size={"large"}
			/>
		</View>
	);
};

export default Loader;
