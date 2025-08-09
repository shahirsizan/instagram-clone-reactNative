import { Link } from "expo-router";
import { View } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {
	// const tasks = useQuery(api.tasks.get);
	// console.log("tasks: ", tasks);

	return (
		<View style={[styles.container]}>
			<Link href={"/notifications"} style={{ color: "white" }}>
				visit notification screennn
			</Link>
		</View>
	);
}
