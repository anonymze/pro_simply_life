import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title: string;
}

export default function HeaderLayout({ title, ...props }: HeaderLayoutProps) {
	return (
		<View className="flex-row items-center justify-center bg-white p-4">
			<Link {...props} href="../" className="absolute left-4 w-10 py-3">
				<SimpleLineIcons name="arrow-left" size={20} color="black" />
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
		</View>
	);
}
