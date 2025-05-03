import { SimpleLineIcons } from "@expo/vector-icons";
import { ArrowLeftIcon } from "lucide-react-native";
import { Link, LinkProps } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title: string;
}

export default function HeaderLayout({ title, ...props }: HeaderLayoutProps) {
	return (
		<View className="flex-row items-center justify-between bg-white p-4">
			<Link dismissTo href="../">
				<ArrowLeftIcon size={24} color="#000" />
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
			<View />
		</View>
	);
}
