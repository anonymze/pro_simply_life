import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Link, LinkProps, router } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import { cn } from "@/utils/libs/tailwind";
import config from "tailwind.config";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title?: string;
	sheet?: {
		link: LinkProps["href"];
	};
	backgroundColor?: string;
}

export default function HeaderLayout({ title, sheet, backgroundColor }: HeaderLayoutProps) {
	return (
		<View className={cn("flex-row items-center justify-between bg-background p-2", backgroundColor)}>
			<Link className="p-2" dismissTo href="../" asChild>
				<TouchableOpacity className="flex-row items-center gap-3">
					<ArrowLeftIcon size={20} color={config.theme.extend.colors.dark} />
					<Text className="text-sm font-semibold text-dark">Retour</Text>
				</TouchableOpacity>
			</Link>

			<Text className="text-lg font-bold">{title}</Text>
			{sheet ? (
				<TouchableOpacity
					className="p-2"
					onPress={() => {
						router.push(sheet.link);
					}}
				>
					<PlusCircleIcon size={24} color="#000" />
				</TouchableOpacity>
			) : (
				<View className="p-5" />
			)}
		</View>
	);
}
