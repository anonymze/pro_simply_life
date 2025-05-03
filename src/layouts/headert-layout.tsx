import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Link, LinkProps, router } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title: string;
	sheet?: {
		link: LinkProps["href"];
	};
}

export default function HeaderLayout({ title, sheet, ...props }: HeaderLayoutProps) {
	return (
		<View className="flex-row items-center justify-between bg-white p-4">
			<Link dismissTo href="../">
				<ArrowLeftIcon size={24} color="#000" />
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
			{sheet ? (
				<TouchableOpacity
					onPress={() => {
						router.push(sheet.link);
					}}
				>
					<PlusCircleIcon size={24} color="#000" />
				</TouchableOpacity>
			) : (
				<View className="size-6" />
			)}
		</View>
	);
}
