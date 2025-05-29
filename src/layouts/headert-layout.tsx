import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HrefObject, Link, LinkProps, router } from "expo-router";
import EmployeesIcon from "@/components/emloyees-icon";
import { TouchableOpacity, View } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { truncateText } from "@/utils/helper";
import { cn } from "@/utils/libs/tailwind";
import config from "tailwind.config";
import { Text } from "react-native";


interface HeaderLayoutProps extends Partial<LinkProps> {
	title?: string;
	chat?: {
		description: string;
		link: HrefObject;
	};
	sheet?: {
		link: LinkProps["href"];
	};
	backgroundColor?: string;
	backButton?: boolean;
}

export default function HeaderLayout({ title, chat, sheet, backgroundColor, backButton = true }: HeaderLayoutProps) {
	return (
		<View className={cn("pt-safe flex-row items-center justify-between bg-background px-2 pb-2", backgroundColor)}>
			{backButton ? (
				<Link className={cn("w-24 p-2", chat && "w-10")} dismissTo href="../" asChild>
					<TouchableOpacity className="flex-row items-center gap-3">
						<ArrowLeftIcon size={20} color={config.theme.extend.colors.primary} />
						{!chat && <Text className="font-semibold text-primary">Retour</Text>}
					</TouchableOpacity>
				</Link>
			) : (
				<View className="w-24" />
			)}

			{chat ? (
				<Link href={chat.link}>
					<View className="flex-row items-center gap-3">
						<View className="size-12 items-center justify-center rounded-full bg-primaryUltraLight">
							<EmployeesIcon color={config.theme.extend.colors.primary} />
						</View>
						<View className="">
							<Text className="font-bold text-lg">{truncateText(title || "", 26)}</Text>
							<Text className="text-sm text-primaryLight">{truncateText(chat?.description || "", 30)}</Text>
						</View>
					</View>
				</Link>
			) : (
				<Text className="font-bold text-lg">{truncateText(title || "", 24)}</Text>
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
				<View className={cn("w-24", chat && "w-10")} />
			)}
		</View>
	);
}
