import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity, View } from "react-native";
import { Link, LinkProps, router } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import { cn } from "@/utils/libs/tailwind";
import config from "tailwind.config";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title?: string;
	description?: string;
	sheet?: {
		link: LinkProps["href"];
	};
	backgroundColor?: string;
	backButton?: boolean;
}

export default function HeaderLayout({
	title,
	description,
	sheet,
	backgroundColor,
	backButton = true,
}: HeaderLayoutProps) {
	return (
		<View className={cn("pt-safe flex-row items-center justify-between bg-background px-2 pb-2", backgroundColor)}>
			{backButton ? (
				<Link className="w-24 p-2" dismissTo href="../" asChild>
					<TouchableOpacity className="flex-row items-center gap-3">
						<ArrowLeftIcon size={20} color={config.theme.extend.colors.primary} />
						<Text className="font-semibold text-sm text-primary">Retour</Text>
					</TouchableOpacity>
				</Link>
			) : (
				<View className="w-24" />
			)}

			{description ? (
				<View className="">
					<Text className="font-bold text-lg">{title}</Text>
					<Text className="text-sm text-defaultGray">{description}</Text>
				</View>
			) : (
				<Text className="font-bold text-lg">{title}</Text>
			)}

			{sheet ? (
				<TouchableOpacity
					className="w-24 items-end p-2"
					onPress={() => {
						router.push(sheet.link);
					}}
				>
					<PlusCircleIcon size={24} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			) : (
				<View className="w-24" />
			)}
		</View>
	);
}
